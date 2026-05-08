import "server-only";

// Cloudflare Turnstile server-side verification.
//
// Activated by setting CF_TURNSTILE_SECRET (server) and
// NEXT_PUBLIC_CF_TURNSTILE_SITE_KEY (client). When the secret is
// missing the verifier returns ok — useful for previews/local dev so
// the form stays unblocked.

export interface TurnstileResult {
  ok: boolean;
  reason?: string;
}

const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export async function verifyTurnstile(
  token: string | undefined | null,
  ip?: string,
): Promise<TurnstileResult> {
  const secret = process.env.CF_TURNSTILE_SECRET;
  if (!secret) return { ok: true };
  if (!token) return { ok: false, reason: "missing_token" };

  const body = new URLSearchParams({ secret, response: token });
  if (ip) body.set("remoteip", ip);

  try {
    const res = await fetch(VERIFY_URL, {
      method: "POST",
      body,
      cache: "no-store",
    });
    const json = (await res.json()) as {
      success: boolean;
      "error-codes"?: string[];
    };
    if (json.success) return { ok: true };
    return { ok: false, reason: (json["error-codes"] ?? []).join(",") || "verify_failed" };
  } catch (err) {
    return { ok: false, reason: err instanceof Error ? err.message : "network_error" };
  }
}
