import bcrypt from "bcryptjs";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Next.js and session internals are replaced with small fakes so the guard can be tested alone.
const session: { isAdmin?: boolean } = {};

vi.mock("server-only", () => ({}));
vi.mock("next/headers", () => ({ cookies: vi.fn(async () => ({})) }));
vi.mock("next/navigation", () => ({
  redirect: vi.fn((to: string) => {
    throw new Error(`REDIRECT:${to}`);
  }),
}));
vi.mock("iron-session", () => ({ getIronSession: vi.fn(async () => session) }));

const { isAdmin, requireAdmin, sessionOptions, verifyAdminPassword } = await import("./auth");

describe("admin auth guard", () => {
  beforeEach(() => {
    delete session.isAdmin;
    process.env.SESSION_SECRET = "x".repeat(40);
  });

  it("sends visitors without a session to the login page", async () => {
    await expect(requireAdmin()).rejects.toThrow("REDIRECT:/admin/login");
    expect(await isAdmin()).toBe(false);
  });

  it("does not accept a session that isn't marked as admin", async () => {
    session.isAdmin = false;
    await expect(requireAdmin()).rejects.toThrow("REDIRECT:/admin/login");
  });

  it("lets the owner through", async () => {
    session.isAdmin = true;
    await expect(requireAdmin()).resolves.toBeUndefined();
  });

  it("refuses to run with a short or missing session secret", () => {
    process.env.SESSION_SECRET = "short";
    expect(() => sessionOptions()).toThrow(/SESSION_SECRET/);
    delete process.env.SESSION_SECRET;
    expect(() => sessionOptions()).toThrow(/SESSION_SECRET/);
  });

  it("uses an httpOnly, sameSite=lax cookie", () => {
    const opts = sessionOptions();
    expect(opts.cookieOptions?.httpOnly).toBe(true);
    expect(opts.cookieOptions?.sameSite).toBe("lax");
  });
});

describe("password check", () => {
  it("accepts the right password and rejects others", async () => {
    process.env.ADMIN_PASSWORD_HASH = bcrypt.hashSync("correct horse battery", 4);
    expect(await verifyAdminPassword("correct horse battery")).toBe(true);
    expect(await verifyAdminPassword("wrong password")).toBe(false);
  });

  it("locks everyone out when no hash is configured", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    delete process.env.ADMIN_PASSWORD_HASH;
    expect(await verifyAdminPassword("anything")).toBe(false);
  });
});
