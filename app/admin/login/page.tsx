import Link from "next/link";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/LoginForm";
import { Lockup } from "@/components/brand/Wordmark";
import { isAdmin } from "@/lib/auth";

export default async function AdminLoginPage() {
  if (await isAdmin()) redirect("/admin");

  return (
    <main className="flex min-h-dvh flex-col">
      <div className="on-dark border-b-[3px] border-accent bg-deep text-on-deep">
        <div className="mx-auto flex h-16 max-w-md items-center px-4 text-[1.375rem]">
          <Lockup />
        </div>
      </div>
      <div className="mx-auto w-full max-w-md flex-1 px-4 py-10">
        <h1 className="type-display text-[2rem]">Owner login</h1>
        <p className="mt-2 text-muted">Update prices, deals, hours and the notice banner.</p>
        <LoginForm />
        <Link href="/" className="mt-10 inline-block text-muted underline">
          Back to the website
        </Link>
      </div>
    </main>
  );
}
