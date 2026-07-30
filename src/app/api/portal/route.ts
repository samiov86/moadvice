import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { absoluteUrl } from "@/lib/site";

export const runtime = "nodejs";

/**
 * Opens the Stripe Customer Portal so a sender can update their card, download
 * invoices, or cancel a plan without us reimplementing any of it.
 */
export async function POST() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { stripeCustomerId: true },
  });

  if (!user?.stripeCustomerId) {
    return NextResponse.json(
      { error: "No billing history to manage yet." },
      { status: 400 },
    );
  }

  try {
    const portal = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: absoluteUrl("/dashboard"),
    });
    return NextResponse.json({ url: portal.url });
  } catch (error) {
    console.error("[portal] failed", error);
    return NextResponse.json(
      {
        error:
          "Couldn't open the billing portal. If this keeps happening, check that the Customer Portal is configured in your Stripe dashboard.",
      },
      { status: 500 },
    );
  }
}
