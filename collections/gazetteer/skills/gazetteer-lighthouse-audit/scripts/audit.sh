#!/usr/bin/env bash

set -Eeuo pipefail

readonly SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
readonly SKILL_DIR="$(cd -- "${SCRIPT_DIR}/.." && pwd)"
readonly CONFIG_DIR="${SKILL_DIR}/configs"

URL=""
OUTPUT_DIR=""

usage() {
  cat <<'EOF'
Usage:
  audit.sh --url <URL> [--output-dir <PATH>]
  audit.sh --help

Run mobile and desktop Lighthouse audits against a live URL.

Options:
  --url <URL>
      Absolute HTTP or HTTPS URL to audit.

  --output-dir <PATH>
      Optional output directory. When omitted, a unique directory is created
      beneath the operating system temporary directory.

  --help
      Show this help message.
EOF
}

error() {
  printf 'Error: %s\n' "$*" >&2
}

die() {
  error "$@"
  exit 1
}

validate_url() {
  local url="$1"

  if [[ ! "${url}" =~ ^https?://[^[:space:]]+$ ]]; then
    die "URL must be an absolute HTTP or HTTPS URL: ${url}"
  fi
}

resolve_lighthouse() {
  if [[ -x "${SKILL_DIR}/node_modules/.bin/lighthouse" ]]; then
    printf '%s\n' "${SKILL_DIR}/node_modules/.bin/lighthouse"
    return 0
  fi

  if command -v lighthouse >/dev/null 2>&1; then
    command -v lighthouse
    return 0
  fi

  if command -v npx >/dev/null 2>&1; then
    printf '%s\n' "npx --yes lighthouse@latest"
    return 0
  fi

  die "Lighthouse is unavailable and npx could not be found."
}

run_lighthouse() {
  local profile="$1"
  local config="$2"
  local output_base="${OUTPUT_DIR}/${profile}"
  local lighthouse_command="$3"

  printf 'Running Lighthouse profile: %s\n' "${profile}" >&2

  # lighthouse_command may intentionally contain multiple words when npx is
  # used as the fallback.
  # shellcheck disable=SC2086
  ${lighthouse_command} "${URL}" \
    --cli-flags-path="${config}" \
    --output=json \
    --output=html \
    --output=csv \
    --output-path="${output_base}" \
    --save-assets \
    --no-enable-error-reporting
}

json_array_for_glob() {
  local pattern="$1"
  local first=true
  local file

  printf '['

  shopt -s nullglob

  for file in ${pattern}; do
    if [[ "${first}" == false ]]; then
      printf ','
    fi

    first=false
    printf '"%s"' "${file//\"/\\\"}"
  done

  shopt -u nullglob

  printf ']'
}

write_manifest() {
  local status="$1"
  local lighthouse_version="$2"
  local mobile_status="$3"
  local desktop_status="$4"

  local mobile_assets
  local desktop_assets

  mobile_assets="$(json_array_for_glob "${OUTPUT_DIR}/mobile-*")"
  desktop_assets="$(json_array_for_glob "${OUTPUT_DIR}/desktop-*")"

  cat >"${OUTPUT_DIR}/manifest.json" <<EOF
{
  "schemaVersion": 1,
  "status": "${status}",
  "url": "${URL}",
  "createdAt": "$(date -u '+%Y-%m-%dT%H:%M:%SZ')",
  "lighthouseVersion": "${lighthouse_version}",
  "nodeVersion": "$(node --version)",
  "outputDirectory": "${OUTPUT_DIR}",
  "profiles": {
    "mobile": {
      "status": "${mobile_status}",
      "config": "${CONFIG_DIR}/mobile.json",
      "reports": {
        "json": "${OUTPUT_DIR}/mobile.report.json",
        "html": "${OUTPUT_DIR}/mobile.report.html",
        "csv": "${OUTPUT_DIR}/mobile.report.csv"
      },
      "assets": ${mobile_assets}
    },
    "desktop": {
      "status": "${desktop_status}",
      "config": "${CONFIG_DIR}/desktop.json",
      "reports": {
        "json": "${OUTPUT_DIR}/desktop.report.json",
        "html": "${OUTPUT_DIR}/desktop.report.html",
        "csv": "${OUTPUT_DIR}/desktop.report.csv"
      },
      "assets": ${desktop_assets}
    }
  }
}
EOF
}

main() {
  local lighthouse_command
  local lighthouse_version
  local mobile_status="pending"
  local desktop_status="pending"
  local overall_status="failed"

  while (($# > 0)); do
    case "$1" in
    --url)
      (($# >= 2)) || die "--url requires a value."
      URL="$2"
      shift 2
      ;;
    --output-dir)
      (($# >= 2)) || die "--output-dir requires a value."
      OUTPUT_DIR="$2"
      shift 2
      ;;
    --help)
      usage
      exit 0
      ;;
    *)
      die "Unknown option: $1"
      ;;
    esac
  done

  [[ -n "${URL}" ]] || die "--url is required."

  validate_url "${URL}"

  command -v node >/dev/null 2>&1 ||
    die "Node.js is required."

  if [[ -z "${OUTPUT_DIR}" ]]; then
    OUTPUT_DIR="$(mktemp -d "${TMPDIR:-/tmp}/lighthouse-audit.XXXXXXXX")"
  else
    mkdir -p "${OUTPUT_DIR}"
    OUTPUT_DIR="$(cd -- "${OUTPUT_DIR}" && pwd)"
  fi

  lighthouse_command="$(resolve_lighthouse)"

  # shellcheck disable=SC2086
  lighthouse_version="$(${lighthouse_command} --version)"

  if run_lighthouse \
    "mobile" \
    "${CONFIG_DIR}/mobile.json" \
    "${lighthouse_command}"; then
    mobile_status="complete"
  else
    mobile_status="failed"
  fi

  if run_lighthouse \
    "desktop" \
    "${CONFIG_DIR}/desktop.json" \
    "${lighthouse_command}"; then
    desktop_status="complete"
  else
    desktop_status="failed"
  fi

  if [[ "${mobile_status}" == "complete" &&
    "${desktop_status}" == "complete" ]]; then
    overall_status="complete"
  else
    overall_status="partial"
  fi

  write_manifest \
    "${overall_status}" \
    "${lighthouse_version}" \
    "${mobile_status}" \
    "${desktop_status}"

  printf '\n'
  printf 'LIGHTHOUSE_AUDIT_STATUS=%s\n' "${overall_status}"
  printf 'LIGHTHOUSE_AUDIT_MANIFEST=%s\n' "${OUTPUT_DIR}/manifest.json"
  printf 'LIGHTHOUSE_AUDIT_DIR=%s\n' "${OUTPUT_DIR}"

  [[ "${overall_status}" == "complete" ]]
}

main "$@"
