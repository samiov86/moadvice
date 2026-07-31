import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { auth, signIn } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false, follow: false },
};

interface SignInPageProps {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
}

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const [params, session] = await Promise.all([searchParams, auth()]);

  if (session?.user) {
    redirect(params.callbackUrl ?? "/dashboard");
  }

  async function sendMagicLink(formData: FormData) {
    "use server";
    const email = String(formData.get("email") ?? "").trim();
    const callbackUrl = String(formData.get("callbackUrl") ?? "/dashboard");

    try {
      // `redirect: false` stops Auth.js handing off to its own verify-request
      // page, which the v5 beta cannot handle behind a custom `pages` config
      // (UnknownAction: verify-request). The email still sends; we just do the
      // redirect ourselves.
      await signIn("resend", {
        email,
        redirectTo: callbackUrl,
        redirect: false,
      });
    } catch {
      redirect("/signin?error=EmailSignin");
    }

    redirect("/signin/check");
  }
  return (
    <>
      <SiteHeader />

      <main className="flex-1 bg-warm-wash">
        <div className="mx-auto w-full max-w-md px-5 py-20 sm:px-8">
          <h1 className="font-display text-3xl leading-tight">
            Manage your plans
          </h1>
          <p className="mt-3 text-muted-foreground">
            Use the email address you paid with. We'll send a sign-in link — no
            password to remember.
          </p>

          <Card className="mt-8">
            <CardContent className="p-7">
              <form action={sendMagicLink} className="space-y-5">
                <input
                  type="hidden"
                  name="callbackUrl"
                  value={params.callbackUrl ?? "/dashboard"}
                />

                <div className="space-y-2">
                  <Label htmlFor="email">Your email address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    required
                    autoFocus
                  />
                </div>

                {params.error && (
                  <p
                    role="alert"
                    className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive"
                  >
                    We couldn't send that link. Check the address and try again.
                  </p>
                )}

                <Button type="submit" size="lg" className="w-full">
                  Email me a link
                </Button>
              </form>
            </CardContent>
          </Card>

          <p className="mt-6 text-sm text-muted-foreground">
            Haven't sent anything yet?{" "}
            <Link href="/send" className="underline underline-offset-4">
              Start here
            </Link>
            — you don't need an account to send.
          </p>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
