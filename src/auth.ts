const SESSION_STORAGE_KEY = "my-vue-login-session";
const SESSION_STORAGE_VALUE = "authenticated";
const LOGIN_ACCOUNT = "13888380032@139.com";
const LOGIN_PASSWORD_HASH =
  "9ae6f4c1538386498a115c47afbb40893ab977a101305339c07c58b4c3468c61";

export function isAuthenticated() {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    return (
      window.sessionStorage.getItem(SESSION_STORAGE_KEY) ===
      SESSION_STORAGE_VALUE
    );
  } catch {
    return false;
  }
}

export function markAuthenticated() {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.setItem(SESSION_STORAGE_KEY, SESSION_STORAGE_VALUE);
}

export async function verifyCredentials(account: string, password: string) {
  if (account.trim() !== LOGIN_ACCOUNT) {
    return false;
  }

  const passwordHash = await hashPassword(password);
  return passwordHash === LOGIN_PASSWORD_HASH;
}

async function hashPassword(value: string) {
  const encoded = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", encoded);

  return Array.from(new Uint8Array(digest))
    .map((item) => item.toString(16).padStart(2, "0"))
    .join("");
}
