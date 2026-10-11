// cspell:ignore EOSE
/** Diagnostics contain rules and fixes only; never interpolate credential values. */
export function credentialRule(
  network: string,
  key: string,
  value: string,
): { error?: string; warning?: string } {
  const host =
    /^(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)*[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?::[0-9]{1,5})?$/i;
  if (key === "host" && ["mastodon", "bluesky"].includes(network)) {
    if (!host.test(value))
      return {
        error:
          "Use a bare host name; remove the scheme, path, and trailing slash.",
      };
    if (
      network === "bluesky" &&
      value.split(":")[0]?.toLowerCase() === "bsky.app"
    )
      return {
        error:
          "The web app is not a PDS/API server. Use bsky.social or your account's PDS host.",
      };
  }
  if (
    network === "bluesky" &&
    key === "identifier" &&
    !/^(?:did:(?:plc|web):[^\s]+|[^\s@]+@[^\s@]+\.[^\s@]+|[a-z0-9-]+(?:\.[a-z0-9-]+)+)$/i.test(
      value,
    )
  )
    return {
      error:
        "Use the current full handle, DID, or email address; remove a leading @. A custom domain replaces the old handle.",
    };
  if (
    network === "bluesky" &&
    key === "password" &&
    !/^[a-z0-9]{4}(?:-[a-z0-9]{4}){3}$/i.test(value)
  )
    return {
      warning:
        "Expected app-password format xxxx-xxxx-xxxx-xxxx. Create one at https://bsky.app/settings/app-passwords.",
    };
  if (network === "nostr" && key === "relays") {
    const relays = value.split(",").map((relay) => relay.trim());
    if (
      !relays.every((relay) => {
        try {
          const url = new URL(relay);
          return (
            url.protocol === "wss:" &&
            Boolean(url.hostname) &&
            !url.username &&
            !url.password
          );
        } catch {
          return false;
        }
      })
    )
      return { error: "Each comma-separated relay must be a wss:// URL." };
  }
  if (
    network === "reddit" &&
    key === "subreddit" &&
    !/^[a-z0-9_]+$/i.test(value)
  )
    return { error: "Use a subreddit name without r/ or /r/." };
  if (network === "tumblr" && key === "blog_identifier" && !host.test(value))
    return {
      error:
        "Use a blog name or host without a scheme, path, or trailing slash.",
    };
  return {};
}

export function explainFailure(network: string, error: unknown): string {
  const raw =
    error instanceof Error
      ? `${error.message} ${String(error.cause ?? "")}`
      : String(error);
  if (/(?:EAI_AGAIN|ENOTFOUND)\s+https\b/i.test(raw))
    return "Host includes a scheme. Remove https:// from the host variable.";
  if (/ENOTFOUND|EAI_AGAIN|fetch failed/i.test(raw))
    return "Host lookup or connection failed. Check the host and network connection.";
  if (/JSON.parse|Unexpected token|non-JSON|content.type/i.test(raw))
    return "API returned a non-JSON response. Use the bare API host, remove paths and trailing slashes, and run --check.";
  if (/401/.test(raw)) {
    if (network === "bluesky")
      return "Session authentication failed. Use your current full handle or DID (a custom domain replaces the old handle), and create a new app password.";
    if (network === "linkedin")
      return "Access token expired or invalid. Follow the LinkedIn token renewal section in SKILL.md.";
    if (network === "mastodon")
      return "Token revoked or for another instance. Create a new token on the instance named by MASTODON_HOST.";
    return "Token expired or invalid. Renew credentials with the network's refresh-token skill.";
  }
  if (/403/.test(raw))
    return "Access denied. Check token permissions and account access.";
  if (/429/.test(raw))
    return "API rate limit reached. Wait before retrying --check.";
  return "API check or publish failed. Check service availability, credentials, and permissions, then run --check.";
}

export type Credentials = Record<string, string>;
export async function preflight(
  network: string,
  env: Credentials,
  request: typeof fetch = fetch,
): Promise<void> {
  const json = async (
    url: string,
    init: RequestInit = {},
  ): Promise<Record<string, unknown>> => {
    const response = await request(url, {
      ...init,
      redirect: "error",
      signal: AbortSignal.timeout(15000),
    });
    if (response.status !== 200) throw new Error(`HTTP ${response.status}`);
    if (
      !/\bapplication\/(?:[\w.-]+\+)?json\b/i.test(
        response.headers.get("content-type") ?? "",
      )
    )
      throw new Error("non-JSON content type");
    const body: unknown = await response.json();
    if (!body || typeof body !== "object" || Array.isArray(body))
      throw new Error("non-JSON object");
    return body as Record<string, unknown>;
  };
  const auth = { Authorization: `Bearer ${env.access_token}` };
  switch (network) {
    case "bluesky": {
      await json(`https://${env.host}/xrpc/com.atproto.server.describeServer`);
      const session = await json(
        `https://${env.host}/xrpc/com.atproto.server.createSession`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            identifier: env.identifier,
            password: env.password,
          }),
        },
      );
      if (!session.did || !session.accessJwt)
        throw new Error("401 Failed to create session");
      return;
    }
    case "mastodon": {
      const account = await json(
        `https://${env.host}/api/v1/accounts/verify_credentials`,
        { headers: auth },
      );
      if (!account.id) throw new Error("401 Missing account");
      return;
    }
    case "linkedin": {
      const person = await json("https://api.linkedin.com/v2/userinfo", {
        headers: auth,
      });
      if (typeof person.sub !== "string" || !person.sub)
        throw new Error("Failed to retrieve person URN");
      return;
    }
    case "threads": {
      const person = await json("https://graph.threads.net/v1.0/me?fields=id", {
        headers: auth,
      });
      if (String(person.id) !== env.user_id)
        throw new Error("403 Token belongs to another account");
      return;
    }
    case "tumblr": {
      const user = await json("https://api.tumblr.com/v2/user/info", {
        headers: auth,
      });
      const response = user.response as
        | {
            user?: {
              blogs?: { name?: string; url?: string; admin?: boolean }[];
            };
          }
        | undefined;
      if (
        !response?.user?.blogs?.some(
          (blog) =>
            blog.admin &&
            (blog.name === env.blog_identifier ||
              (blog.url && new URL(blog.url).hostname === env.blog_identifier)),
        )
      )
        throw new Error("403 Blog access denied");
      return;
    }
    case "reddit": {
      let token = env.access_token;
      if (!token) {
        const session = await json(
          "https://www.reddit.com/api/v1/access_token",
          {
            method: "POST",
            headers: {
              Authorization: `Basic ${Buffer.from(`${env.client_id}:${env.client_secret}`).toString("base64")}`,
              "User-Agent": env.user_agent ?? "",
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
              grant_type: "refresh_token",
              refresh_token: env.refresh_token ?? "",
            }),
          },
        );
        if (typeof session.access_token !== "string")
          throw new Error("401 Token refresh failed");
        token = session.access_token;
      }
      const person = await json("https://oauth.reddit.com/api/v1/me", {
        headers: {
          Authorization: `Bearer ${token}`,
          "User-Agent": env.user_agent ?? "",
        },
      });
      if (!person.id) throw new Error("401 Missing account");
      return;
    }
    case "nostr":
      // Nostr has no token verification endpoint. Read a relay event without signing.
      if (
        !/^[a-f0-9]{64}$/i.test(env.private_key ?? "") ||
        /^0+$/.test(env.private_key ?? "") ||
        BigInt(`0x${env.private_key}`) >=
          BigInt(
            "0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141",
          )
      )
        throw new Error("Invalid Nostr signing key");
      await Promise.all(
        (env.relays ?? "").split(",").map(
          (relay) =>
            new Promise<void>((resolve, reject) => {
              const socket = new WebSocket(relay.trim());
              const timer = setTimeout(() => {
                socket.close();
                reject(new Error("Relay timeout"));
              }, 15000);
              let finished = false;
              const finish = (error?: Error) => {
                if (finished) return;
                finished = true;
                clearTimeout(timer);
                socket.close();
                if (error) reject(error);
                else resolve();
              };
              socket.onopen = () =>
                socket.send(
                  JSON.stringify(["REQ", "posthaste-check", { limit: 1 }]),
                );
              socket.onerror = () =>
                finish(new Error("Relay connection failed"));
              socket.onclose = () =>
                finish(new Error("Relay closed before response"));
              socket.onmessage = (event) => {
                try {
                  const data = JSON.parse(String(event.data)) as unknown[];
                  if (
                    ["EVENT", "EOSE"].includes(String(data[0])) &&
                    data[1] === "posthaste-check"
                  )
                    finish();
                  else if (data[0] === "AUTH" || data[0] === "CLOSED")
                    finish(new Error("Relay requires authentication"));
                } catch {
                  finish(new Error("non-JSON relay response"));
                }
              };
            }),
        ),
      );
      return;
    default:
      throw new Error("Unsupported network");
  }
}

/** Attempt every target and return only safe diagnostics. */
export async function checkTargets(
  targets: { network: string; credentials: Credentials }[],
  request: typeof fetch = fetch,
): Promise<string[]> {
  return (
    await Promise.all(
      targets.map(async ({ network, credentials }) => {
        try {
          await preflight(network, credentials, request);
          return undefined;
        } catch (error) {
          return `${network}: ${explainFailure(network, error)}`;
        }
      }),
    )
  ).filter((failure): failure is string => failure !== undefined);
}
