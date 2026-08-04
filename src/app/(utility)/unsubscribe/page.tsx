import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { CheckCircle2 } from "lucide-react";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Stop receiving messages",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

interface UnsubscribePageProps {
  searchParams: Promise<{ token?: string; done?: string }>;
}

export default async function UnsubscribePage({
  searchParams,
}: UnsubscribePageProps) {
  const { token, done } = await searchParams;

  const recipient = token
    ? await prisma.recipient.findUnique({
        where: { unsubscribeToken: token },
        select: { id: true, unsubscribedAt: true },
      })
    : null;

  const alreadyDone = done === "1" || Boolean(recipient?.unsubscribedAt);

  async function confirmOptOut(formData: FormData) {
    "use server";

    const optOutToken = String(formData.get("token") ?? "");
    if (!optOutToken) return;

    await prisma.recipient.updateMany({
      where: { unsubscribeToken: optOutToken, unsubscribedAt: null },
      data: { unsubscribedAt: new Date() },
    });

    const target = await prisma.recipient.findUnique({
      where: { unsubscribeToken: optOutToken },
      select: { id: true },
    });

    if (target) {
      await prisma.subscription.updateMany({
        where: { recipientId: target.id, status: "ACTIVE" },
        data: { nextSendAt: null },
      });
    }

    redirect("/unsubscribe?done=1");
  }

  return (
    <>
      <SiteHeader />

      <main className="flex-1 bg-warm-wash">
        <div className="mx-auto w-full max-w-lg px-5 py-20 sm:px-8">
          {alreadyDone ? (
            <div className="text-center">
              <span className="mx-auto grid size-14 place-items-center rounded-full bg-accent text-accent-foreground">
                <CheckCircle2 className="size-7" />
              </span>
              <h1 className="mt-7 font-display text-3xl leading-tight">
                That's stopped
              </h1>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                You won't receive any more messages from {siteConfig.name} — not
                from whoever was sending these, and not from anyone else. We've
                kept only your email address, so we know not to send there again.
              </p>
              <Button asChild variant="outline" className="mt-8">
                <Link href="/">Back to {siteConfig.domain}</Link>
              </Button>
            </div>
          ) : recipient ? (
            <>
              <h1 className="font-display text-3xl leading-tight">
                Stop receiving these?
              </h1>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                Someone has been sending you anonymous compliments through{" "}
                {siteConfig.name}. If you'd rather not receive them, we'll stop
                immediately and permanently.
              </p>

              <Card className="mt-8">
                <CardContent className="p-7">
                  <form action={confirmOptOut} className="space-y-5">
                    <input type="hidden" name="token" value={token} />
                    <Button type="submit" size="lg" className="w-full">
                      Yes, stop sending
                    </Button>
                    <p className="text-center text-sm text-muted-foreground">
                      The person who set this up is never told who you are —
                      only that the address opted out, so they can cancel.
                    </p>
                  </form>
                </CardContent>
              </Card>

              <p className="mt-6 text-center text-sm text-muted-foreground">
                Changed your mind?{" "}
                <Link href="/" className="underline underline-offset-4">
                  Nothing happens unless you click the button
                </Link>
                .
              </p>
            </>
          ) : (
            <>
              <h1 className="font-display text-3xl leading-tight">
                We need the link from the email
              </h1>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                This page needs the opt-out link at the bottom of the message you
                received — it's the only way we can tell which address to stop
                sending to. If you can't find it, email us at{" "}
                <a
                  href={`mailto:${siteConfig.supportEmail}`}
                  className="underline underline-offset-4"
                >
                  {siteConfig.supportEmail}
                </a>{" "}
                and we'll take care of it.
              </p>
              <Button asChild variant="outline" className="mt-8">
                <Link href="/">Back to {siteConfig.domain}</Link>
              </Button>
            </>
          )}
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
