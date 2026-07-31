import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { AlertTriangle, ArrowRight, Mail, Plus } from "lucide-react";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  BillingPortalButton,
  SubscriptionControls,
} from "@/app/dashboard/subscription-actions";
import { auth, signOut } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatDate, formatDateTime, formatMoney } from "@/lib/utils";
import type { DeliveryStatus } from "@prisma/client";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/signin?callbackUrl=/dashboard");
  }

  const [subscriptions, oneOffs] = await Promise.all([
    prisma.subscription.findMany({
      where: { userId: session.user.id },
      include: { recipient: true },
      orderBy: [{ status: "asc" }, { createdAt: "desc" }],
    }),
    prisma.order.findMany({
      where: { userId: session.user.id, plan: "ONE_OFF", status: "PAID" },
      include: { recipient: true, messagesSent: true },
      orderBy: { createdAt: "desc" },
      take: 25,
    }),
  ]);

  const active = subscriptions.filter((s) => s.status !== "CANCELED");
  const ended = subscriptions.filter((s) => s.status === "CANCELED");
  const totalDelivered =
    subscriptions.reduce((sum, s) => sum + s.sentCount, 0) + oneOffs.length;

  return (
    <>
      <SiteHeader />

      <main className="flex-1">
        <div className="mx-auto w-full max-w-5xl px-5 py-12 sm:px-8 lg:py-16">
          {/* -------------------------------------------------- Header */}
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div>
              <h1 className="font-display text-3xl leading-tight sm:text-4xl">
                Your kind words
              </h1>
              <p className="mt-3 text-muted-foreground">
                Signed in as {session.user.email} ·{" "}
                <strong className="font-medium text-foreground">
                  {totalDelivered}
                </strong>{" "}
                {totalDelivered === 1 ? "message" : "messages"} delivered
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <BillingPortalButton />
              <Button asChild>
                <Link href="/send">
                  <Plus className="size-4" /> Send to someone
                </Link>
              </Button>
            </div>
          </div>

          {/* -------------------------------------------- Daily plans */}
          <section className="mt-14">
            <h2 className="font-display text-2xl">Daily plans</h2>

            {active.length === 0 ? (
              <EmptyState
                title="No daily plans running"
                body="A daily plan sends a different message every morning for $5 a month. You can run as many as you like, for different people."
                cta={{ href: "/send?plan=DAILY", label: "Start a daily plan" }}
              />
            ) : (
              <ul className="mt-6 space-y-4">
                {active.map((subscription) => (
                  <li key={subscription.id}>
                    <Card>
                      <CardContent className="p-6 sm:p-7">
                        <div className="flex flex-wrap items-start justify-between gap-4">
                          <div>
                            <h3 className="font-display text-xl">
                              {subscription.recipient.name?.trim() ||
                                subscription.recipient.email}
                            </h3>
                            <p className="mt-1 text-sm text-muted-foreground">
                              {subscription.recipient.email} ·{" "}
                              {subscription.theme === "PERSONAL"
                                ? "Personal"
                                : "Professional"}
                            </p>
                          </div>

                          <div className="flex flex-wrap items-center gap-2">
                            {subscription.recipient.unsubscribedAt && (
                              <Badge variant="destructive">
                                <AlertTriangle className="size-3.5" /> Opted out
                              </Badge>
                            )}
                            {subscription.status === "PAST_DUE" && (
                              <Badge variant="warning">Payment failed</Badge>
                            )}
                            {subscription.cancelAtPeriodEnd ? (
                              <Badge variant="warning">
                                Ends {formatDate(subscription.currentPeriodEnd)}
                              </Badge>
                            ) : (
                              subscription.status === "ACTIVE" && (
                                <Badge variant="success">Active</Badge>
                              )
                            )}
                          </div>
                        </div>

                        <dl className="mt-6 grid gap-4 border-t border-border pt-5 text-sm sm:grid-cols-3">
                          <Stat
                            label="Delivered"
                            value={`${subscription.sentCount} ${
                              subscription.sentCount === 1
                                ? "message"
                                : "messages"
                            }`}
                          />
                          <Stat
                            label="Next message"
                            value={
                              subscription.recipient.unsubscribedAt
                                ? "Paused — they opted out"
                                : formatDateTime(subscription.nextSendAt)
                            }
                          />
                          <Stat
                            label="Renews"
                            value={`${formatMoney(500)} · ${formatDate(
                              subscription.currentPeriodEnd,
                            )}`}
                          />
                        </dl>

                        {subscription.recipient.unsubscribedAt && (
                          <p className="mt-5 rounded-xl border border-destructive/25 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                            This person has asked to stop receiving messages, so
                            nothing further is being sent. Cancel the plan so you
                            aren't charged again.
                          </p>
                        )}

                        <div className="mt-6">
                          <SubscriptionControls
                            subscriptionId={subscription.id}
                            cancelAtPeriodEnd={subscription.cancelAtPeriodEnd}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* ---------------------------------------------- One-offs */}
          <section className="mt-14">
            <h2 className="font-display text-2xl">Single messages</h2>

            {oneOffs.length === 0 ? (
              <EmptyState
                title="Nothing sent yet"
                body="One message costs $1 and goes out the moment you've paid."
                cta={{ href: "/send", label: "Send one message" }}
              />
            ) : (
              <Card className="mt-6 overflow-hidden">
                <ul className="divide-y divide-border">
                  {oneOffs.map((order) => {
                    const delivery = order.messagesSent[0];
                    return (
                      <li
                        key={order.id}
                        className="flex flex-wrap items-center justify-between gap-4 p-5 sm:px-7"
                      >
                        <div className="min-w-0">
                          <p className="truncate font-medium">
                            {order.recipient.name?.trim() ||
                              order.recipient.email}
                          </p>
                          <p className="mt-0.5 truncate text-sm text-muted-foreground">
                            {order.recipient.email} ·{" "}
                            {order.theme === "PERSONAL"
                              ? "Personal"
                              : "Professional"}
                          </p>
                        </div>

                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <span>{formatDate(order.paidAt ?? order.createdAt)}</span>
                          <DeliveryBadge status={delivery?.status} />
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </Card>
            )}
          </section>

          {/* ------------------------------------------ Ended plans */}
          {ended.length > 0 && (
            <section className="mt-14">
              <h2 className="font-display text-2xl">Ended plans</h2>
              <Card className="mt-6 overflow-hidden">
                <ul className="divide-y divide-border">
                  {ended.map((subscription) => (
                    <li
                      key={subscription.id}
                      className="flex flex-wrap items-center justify-between gap-4 p-5 sm:px-7"
                    >
                      <div className="min-w-0">
                        <p className="truncate font-medium">
                          {subscription.recipient.name?.trim() ||
                            subscription.recipient.email}
                        </p>
                        <p className="mt-0.5 text-sm text-muted-foreground">
                          {subscription.sentCount}{" "}
                          {subscription.sentCount === 1
                            ? "message"
                            : "messages"}{" "}
                          delivered
                        </p>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        Ended {formatDate(subscription.canceledAt)}
                      </span>
                    </li>
                  ))}
                </ul>
              </Card>
            </section>
          )}

          {/* --------------------------------------------- Sign out */}
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
            className="mt-16 border-t border-border pt-8"
          >
            <Button type="submit" variant="ghost" size="sm">
              Sign out
            </Button>
          </form>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}

/**
 * "Sent" and "Delivered" are different claims and used to be conflated.
 * SENT means Resend accepted it; only the Resend webhook can promote that to
 * DELIVERED, or to BOUNCED once a mailbox rejects it.
 */
function DeliveryBadge({ status }: { status?: DeliveryStatus }) {
  switch (status) {
    case "DELIVERED":
      return (
        <Badge variant="success">
          <Mail className="size-3.5" /> Delivered
        </Badge>
      );
    case "SENT":
      return <Badge variant="outline">Sent</Badge>;
    case "BOUNCED":
      return <Badge variant="destructive">Bounced</Badge>;
    case "COMPLAINED":
      return <Badge variant="destructive">Marked as spam</Badge>;
    case "SKIPPED":
      return <Badge variant="warning">Opted out</Badge>;
    case "FAILED":
      return <Badge variant="destructive">Failed</Badge>;
    default:
      return <Badge variant="outline">Queued</Badge>;
  }
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-widest text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-1.5 font-medium">{value}</dd>
    </div>
  );
}

function EmptyState({
  title,
  body,
  cta,
}: {
  title: string;
  body: string;
  cta: { href: string; label: string };
}) {
  return (
    <Card className="mt-6 border-dashed bg-secondary/30 shadow-none">
      <CardContent className="p-8 text-center">
        <h3 className="font-display text-lg">{title}</h3>
        <p className="mx-auto mt-2 max-w-md text-[15px] text-muted-foreground">
          {body}
        </p>
        <Button asChild variant="outline" className="mt-6">
          <Link href={cta.href}>
            {cta.label} <ArrowRight className="size-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
