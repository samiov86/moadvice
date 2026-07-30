import type { Metadata } from "next";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { SendForm } from "@/components/send/send-form";
import { auth } from "@/lib/auth";
import type { PlanId } from "@/lib/site";

export const metadata: Metadata = {
  title: "Send kind words",
  description:
    "Send an anonymous compliment by email. One message for $1, or a different one every morning for $5 a month.",
  alternates: { canonical: "/send" },
};

interface SendPageProps {
  searchParams: Promise<{ plan?: string; canceled?: string }>;
}

export default async function SendPage({ searchParams }: SendPageProps) {
  const [params, session] = await Promise.all([searchParams, auth()]);

  const initialPlan: PlanId = params.plan === "DAILY" ? "DAILY" : "ONE_OFF";

  return (
    <>
      <SiteHeader />

      <main className="flex-1 bg-warm-wash">
        <div className="mx-auto w-full max-w-6xl px-5 py-12 sm:px-8 lg:py-16">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">
              Send kind words
            </p>
            <h1 className="mt-4 font-display text-3xl leading-tight text-balance sm:text-4xl">
              Four short steps. They'll never know it was you.
            </h1>
          </div>

          <div className="mt-12 rounded-3xl border border-border bg-card p-6 shadow-warm sm:p-9 lg:p-11">
            <SendForm
              initialPlan={initialPlan}
              initialSenderEmail={session?.user?.email ?? ""}
              canceled={params.canceled === "1"}
            />
          </div>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
