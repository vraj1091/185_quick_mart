import "server-only";
import bcrypt from "bcryptjs";
import { getIronSession, type SessionOptions } from "iron-session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export type AdminSession = { isAdmin: boolean; loggedInAt: number };

const SESSION_HOURS = 12;

export function sessionOptions(): SessionOptions {
  const password = process.env.SESSION_SECRET;
  if (!password || password.length < 32) {
    throw new Error("SESSION_SECRET must be set to a random string of at least 32 characters.");
  }
  return {
    password,
    cookieName: "qm_admin",
    ttl: SESSION_HOURS * 60 * 60,
    cookieOptions: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    },
  };
}

export async function getAdminSession() {
  return getIronSession<AdminSession>(await cookies(), sessionOptions());
}

export async function isAdmin(): Promise<boolean> {
  const session = await getAdminSession();
  return session.isAdmin === true;
}

/** Call at the top of every admin page and server action. Sends visitors to the login page. */
export async function requireAdmin(): Promise<void> {
  if (!(await isAdmin())) redirect("/admin/login");
}

export async function verifyAdminPassword(password: string): Promise<boolean> {
  const hash = process.env.ADMIN_PASSWORD_HASH;
  if (!hash) {
    console.error("ADMIN_PASSWORD_HASH is not set, so nobody can log in to /admin.");
    return false;
  }
  try {
    return await bcrypt.compare(password, hash);
  } catch {
    console.error("ADMIN_PASSWORD_HASH is not a valid bcrypt hash.");
    return false;
  }
}
