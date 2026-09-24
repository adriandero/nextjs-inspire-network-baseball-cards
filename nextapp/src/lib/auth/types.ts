export const PERMISSIONS = {
  ADMIN: "Admin",
  USER: "User",
  GUEST: "Guest",
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

export type AuthenticationResult =
  | { status: "anonymous"; user: undefined }
  | { status: "unprovisioned"; user: undefined; email: string }
  | { status: "authenticated"; user: import("@/src/shared/entities/user.types").UserSanity };

export type AuthFailureCode = "ANONYMOUS" | "UNPROVISIONED" | "FORBIDDEN";

export class AuthError extends Error {
  readonly status: 401 | 403 | 404;
  readonly code: AuthFailureCode;

  constructor(code: AuthFailureCode, message: string, status: 401 | 403 | 404) {
    super(message);
    this.name = "AuthError";
    this.code = code;
    this.status = status;
  }
}

export function isAuthError(error: unknown): error is AuthError {
  return error instanceof AuthError;
}
