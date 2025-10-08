// 🐉 Development-only authentication bypass utilities
// TODO: DELETE THIS ENTIRE FILE when implementing real auth (see dev-auth-cleanup-plan.md)

export const DEV_USER = {
  id: "dev-user-1",
  email: "john@example.com",
  name: "John Developer"
};

export const isDevMode = process.env.NEXT_PUBLIC_DEV_MODE === "true";

export function mockAuthBypass() {
  if (!isDevMode) {
    throw new Error("Auth bypass only available in development mode");
  }
  return DEV_USER;
}
