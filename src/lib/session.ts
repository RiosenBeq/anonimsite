import "server-only";

import { cookies } from "next/headers";

const SESSION_COOKIE = "anonim_session";

/**
 * Returns the visitor's anonymous session UUID. Middleware writes this on
 * first request, but for completeness this falls back to generating a fresh
 * one (e.g. when a server action runs before the first GET).
 */
export async function getAnonimSession(): Promise<string | null> {
  const store = await cookies();
  return store.get(SESSION_COOKIE)?.value ?? null;
}

export async function ensureAnonimSession(): Promise<string> {
  const store = await cookies();
  let value = store.get(SESSION_COOKIE)?.value;
  if (!value) {
    value = crypto.randomUUID();
    try {
      store.set(SESSION_COOKIE, value, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24 * 365,
      });
    } catch {
      // Read-only context (RSC). Caller will see the value; cookie persists
      // via middleware on the next response.
    }
  }
  return value;
}
