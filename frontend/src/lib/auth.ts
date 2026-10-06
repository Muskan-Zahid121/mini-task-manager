const DEMO_CREDENTIALS = {
  email: "admin@example.com",
  password: "admin123"
} as const;

const AUTH_STORAGE_KEY = "isAuthenticated";

export { DEMO_CREDENTIALS };

export function isAuthenticated(): boolean {
  return localStorage.getItem(AUTH_STORAGE_KEY) === "true";
}

export async function login(email: string, password: string): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 600));

  const normalizedEmail = email.trim().toLowerCase();
  if (
    normalizedEmail !== DEMO_CREDENTIALS.email ||
    password !== DEMO_CREDENTIALS.password
  ) {
    throw new Error("Invalid email or password.");
  }

  localStorage.setItem(AUTH_STORAGE_KEY, "true");
}

export function logout(): void {
  localStorage.removeItem(AUTH_STORAGE_KEY);
}
