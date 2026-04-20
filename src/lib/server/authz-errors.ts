// Client-safe error type shared by server actions in authz.ts.
// Kept out of the "use server" file because that module can only export
// async functions.
export class AuthzError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthzError";
  }
}
