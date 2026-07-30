import Link from "next/link";
import type { Metadata } from "next";
import { MailCheck } from "lucide-react";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Check your email",
  robots: { index: false, follow: false },
};

export default function CheckEmailPage() {
  return (
    <>
      <SiteHeader />

      <main className="flex-1 bg-warm-wash">
        <div className="mx-auto w-full max-w-md px-5 py-24 text-center sm:px-8">
          <span className="mx-auto grid size-14 place-items-center rounded-full bg-accent text-accent-foreground">
            <MailCheck className="size-7" />
          </span>

          <h1 className="mt-7 font-display text-3xl leading-tight">
            Check your inbox
          </h1>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            We've sent you a sign-in link. It works once and expires in 24
            hours. If it hasn't arrived in a minute, have a look in spam.
          </p>

          <Button asChild variant="outline" className="mt-8">
            <Link href="/signin">Use a different address</Link>
          </Button>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
