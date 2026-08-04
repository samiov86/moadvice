import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Check, Clock } from "lucide-react";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrackPurchase } from "@/components/track-purchase";
import { prisma } from "@/lib/prisma";
import { PLANS } from "@/lib/site";
import {
  alternatesFor,
  localePath,
  type SiteLocale,
} from "@/lib/dictionary";
import { formatMoney } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: "Sent",
    robots: { index: false, follow: false },
    alternates: alternatesFor(locale as SiteLocale, "/send/success"),
  };
}

/** Always fresh — the webhook may land moments after the redirect. */
export const dynamic = "force-dynamic";

interface SuccessPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ session_id?: string }>;
}

export default async function SendSuccessPage({
  params,
  searchParams,
}: SuccessPageProps) {
  const [{ locale: raw }, { session_id: sessionId }] = await Promise.all([
    params,
    searchParams,
  ]);
  const locale = raw as SiteLocale;

  const order = sessionId
    ? await prisma.order.findUnique({
        where: { stripeCheckoutSessionId: sessionId },
        include: { recipient: true, subscription: true },
      })
    : null;

  const isDaily = order?.plan === "DAILY";
  const plan = order ? PLANS[order.plan] : null;
  // Stripe redirects immediately; the webhook usually lands within a second or
  // two but is not guaranteed to have run yet.
  const settled = order?.status === "PAID";

  return (
    <>
      <SiteHeader locale={locale} />

      {order && (
        <TrackPurchase
          orderId={order.id}
          plan={order.plan}
          theme={order.theme}
        />
      )}

      <main className="flex-1 bg-warm-wash">
        <div className="mx-auto w-full max-w-2xl px-5 py-16 sm:px-8 lg:py-24">
          <div className="text-center">
            <span className="mx-auto grid size-14 place-items-center rounded-full bg-primary text-primary-foreground">
              <Check className="size-7" />
            </span>

            <h1 className="mt-7 font-display text-3xl leading-tight text-balance sm:text-4xl">
              {isDaily ? "Their mornings just got better" : "That's on its way"}
            </h1>

            <p className="mx-auto mt-5 max-w-lg text-lg leading-relaxed text-muted-foreground">
              {order ? (
                isDaily ? (
                  <>
                    The first message is going out to{" "}
                    <strong className="font-medium text-foreground">
                      {order.recipient.name?.trim() || order.recipient.email}
                    </strong>{" "}
                    now, and a new one will arrive at the same time every day.
                  </>
                ) : (
                  <>
                    Your message is on its way to{" "}
                    <strong className="font-medium text-foreground">
                      {order.recipient.name?.trim() || order.recipient.email}
                    </strong>
                    . There is nothing in it that points back to you.
                  </>
                )
              ) : (
                <>
                  Payment received. Your message is being prepared and will be
                  delivered in the next minute.
                </>
              )}
            </p>
          </div>

          {order && plan && (
            <Card className="mt-12">
              <CardContent className="p-7">
                <div className="flex items-center justify-between gap-4">
                  <h2 className="font-display text-xl">Receipt</h2>
                  <Badge variant={settled ? "success" : "warning"}>
                    {settled ? (
                      <>
                        <Check className="size-3.5" /> Confirmed
                      </>
                    ) : (
                      <>
                        <Clock className="size-3.5" /> Processing
                      </>
                    )}
                  </Badge>
                </div>

                <dl className="mt-5 divide-y divide-border text-sm">
                  <Row label="Recipient">{order.recipient.email}</Row>
                  <Row label="Tone">
                    {order.theme === "PERSONAL" ? "Personal" : "Professional"}
                  </Row>
                  <Row label="Plan">{plan.name}</Row>
                  <Row label="Paid">
                    {formatMoney(order.amountCents, order.currency)}
                    {isDaily ? " / month" : ""}
                  </Row>
                  <Row label="Order">
                    <span className="font-mono text-xs">{order.id}</span>
                  </Row>
                </dl>

                <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
                  A confirmation is on its way to your inbox, and Stripe has
                  emailed a formal receipt separately.
                </p>
              </CardContent>
            </Card>
          )}

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button asChild size="lg">
              <Link href={localePath(locale, "/send")}>
                Send to someone else <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/dashboard">Go to dashboard</Link>
            </Button>
          </div>

          {isDaily && (
            <p className="mt-8 text-center text-sm leading-relaxed text-muted-foreground">
              Cancel any time from your dashboard — sign in with the email
              address you just used, no password required.
            </p>
          )}
        </div>
      </main>

      <SiteFooter locale={locale} />
    </>
  );
}

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-3">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-right font-medium">{children}</dd>
    </div>
  );
}
