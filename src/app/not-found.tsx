import Link from "next/link";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <>
      <SiteHeader />

      <main className="flex-1 bg-warm-wash">
        <div className="mx-auto w-full max-w-lg px-5 py-28 text-center sm:px-8">
          <p className="font-display text-6xl text-primary">404</p>
          <h1 className="mt-6 font-display text-3xl leading-tight">
            There's nothing here
          </h1>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Which is a shame, because there's something rather good two clicks
            away.
          </p>
          <Button asChild size="lg" className="mt-8">
            <Link href="/send">Send someone kind words</Link>
          </Button>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
