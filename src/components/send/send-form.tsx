"use client";

import * as React from "react";
import { track } from "@vercel/analytics";
import { ArrowLeft, ArrowRight, Check, Loader2, Lock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioCard } from "@/components/ui/radio-group";
import { EmailPreview } from "@/components/email-preview";
import { PLANS, THEMES, type PlanId, type ThemeId } from "@/lib/site";
import { cn } from "@/lib/utils";

const STEPS = ["Who", "Tone", "How often", "Pay"] as const;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

interface FormState {
  recipientEmail: string;
  recipientName: string;
  theme: ThemeId;
  plan: PlanId;
  senderEmail: string;
}

export interface SendFormProps {
  /** Pre-selected from the pricing table on the homepage. */
  initialPlan?: PlanId;
  /** Pre-filled when the sender is already signed in. */
  initialSenderEmail?: string;
  /** True when Stripe bounced them back from an abandoned checkout. */
  canceled?: boolean;
}

export function SendForm({
  initialPlan = "ONE_OFF",
  initialSenderEmail = "",
  canceled = false,
}: SendFormProps) {
  const [step, setStep] = React.useState(0);
  const formRef = React.useRef<HTMLFormElement>(null);
  const renderedStep = React.useRef(0);
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [form, setForm] = React.useState<FormState>({
    recipientEmail: "",
    recipientName: "",
    theme: "PERSONAL",
    plan: initialPlan,
    senderEmail: initialSenderEmail,
  });

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((previous) => ({ ...previous, [key]: value }));

  /**
   * Funnel: one event the first time each step is seen. Comparing the counts
   * shows where people give up — which is the whole reason for measuring, given
   * most checkouts so far were abandoned and nobody could say at which step.
   *
   * Counted once per step per session, so React's double-invoked effects in
   * development don't inflate the numbers.
   */
  const trackedSteps = React.useRef(new Set<number>());
  React.useEffect(() => {
    if (trackedSteps.current.has(step)) return;
    trackedSteps.current.add(step);
    track("send_step_viewed", { step: STEPS[step], position: step + 1 });
  }, [step]);

  // Changing step swaps the panel in place, which on a short viewport leaves
  // the reader looking at the bottom of the new step. Bring the heading back.
  // Compared against the previous value rather than a mount flag so React's
  // double-invoked effects in development don't scroll on first paint.
  React.useEffect(() => {
    if (renderedStep.current === step) return;
    renderedStep.current = step;
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    // Focus the step's first field, but never on initial page load — an
    // autofocus there would scroll the heading off the top before it's read.
    formRef.current
      ?.querySelector<HTMLElement>("[data-autofocus]")
      ?.focus({ preventScroll: true });
  }, [step]);

  const theme = THEMES.find((t) => t.id === form.theme)!;
  const plan = PLANS[form.plan];

  const stepValid = (index: number) => {
    switch (index) {
      case 0:
        return EMAIL_PATTERN.test(form.recipientEmail.trim());
      case 3:
        return EMAIL_PATTERN.test(form.senderEmail.trim());
      default:
        return true;
    }
  };

  const canContinue = stepValid(step);

  const goNext = () => {
    if (!canContinue) return;
    setError(null);
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const goBack = () => {
    setError(null);
    setStep((s) => Math.max(s - 1, 0));
  };

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!stepValid(0) || !stepValid(3) || submitting) return;

    setSubmitting(true);
    setError(null);

    // Plan and theme only. Never the email addresses — the recipient's in
    // particular belongs to someone who never agreed to anything.
    track("checkout_started", { plan: form.plan, theme: form.theme });

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipientEmail: form.recipientEmail.trim(),
          recipientName: form.recipientName.trim() || undefined,
          senderEmail: form.senderEmail.trim(),
          theme: form.theme,
          plan: form.plan,
        }),
      });

      const data = (await response.json()) as { url?: string; error?: string };

      if (!response.ok || !data.url) {
        track("checkout_failed", { status: response.status });
        setError(data.error ?? "Something went wrong. Please try again.");
        setSubmitting(false);
        return;
      }

      window.location.assign(data.url);
    } catch {
      track("checkout_failed", { status: 0 });
      setError("We couldn't reach the payment page. Check your connection.");
      setSubmitting(false);
    }
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:gap-14">
      <form ref={formRef} onSubmit={handleSubmit} noValidate className="scroll-mt-24">
        <Stepper current={step} onSelect={(index) => {
          // Allow jumping back to any completed step, never forward past a gap.
          if (index < step) setStep(index);
        }} />

        {canceled && step === 0 && (
          <p className="mt-8 rounded-xl border border-border bg-secondary/60 px-4 py-3 text-sm text-muted-foreground">
            No payment was taken — you closed the checkout. Pick up where you
            left off whenever you're ready.
          </p>
        )}

        <div className="mt-9">
          {/* ------------------------------------------------ Step 1: Who */}
          {step === 0 && (
            <StepPanel
              title="Who should hear something good?"
              description="We only ever email this address the message itself. It's never sold, never shared, and they don't need an account."
            >
              <div className="space-y-2">
                <Label htmlFor="recipientEmail">Their email address</Label>
                <Input
                  id="recipientEmail"
                  name="recipientEmail"
                  type="email"
                  inputMode="email"
                  autoComplete="off"
                  placeholder="them@example.com"
                  value={form.recipientEmail}
                  onChange={(e) => update("recipientEmail", e.target.value)}
                  aria-invalid={
                    form.recipientEmail.length > 3 && !stepValid(0)
                      ? true
                      : undefined
                  }
                  data-autofocus
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="recipientName">
                  Their first name{" "}
                  <span className="font-normal text-muted-foreground">
                    (optional)
                  </span>
                </Label>
                <Input
                  id="recipientName"
                  name="recipientName"
                  autoComplete="off"
                  placeholder="Alex"
                  value={form.recipientName}
                  onChange={(e) => update("recipientName", e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  Used only to open the message. Leave it blank and it starts
                  with a simple hello.
                </p>
              </div>
            </StepPanel>
          )}

          {/* ----------------------------------------------- Step 2: Tone */}
          {step === 1 && (
            <StepPanel
              title="What kind of words?"
              description="Both banks are written by hand. Pick whichever fits how you know them."
            >
              <RadioGroup
                value={form.theme}
                onValueChange={(value) => update("theme", value as ThemeId)}
                className="gap-4"
              >
                {THEMES.map((option) => (
                  <RadioCard
                    key={option.id}
                    id={`theme-${option.id}`}
                    value={option.id}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <span className="font-display text-lg">
                          {option.name}
                        </span>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {option.blurb}
                        </p>
                      </div>
                      <Badge variant="muted" className="shrink-0">
                        {option.id === "PERSONAL" ? "For life" : "For work"}
                      </Badge>
                    </div>
                  </RadioCard>
                ))}
              </RadioGroup>
            </StepPanel>
          )}

          {/* ------------------------------------------ Step 3: Frequency */}
          {step === 2 && (
            <StepPanel
              title="Once, or every morning?"
              description="Daily plans send a different message each day and never repeat until the whole bank is used."
            >
              <RadioGroup
                value={form.plan}
                onValueChange={(value) => update("plan", value as PlanId)}
                className="gap-4"
              >
                {Object.values(PLANS).map((option) => (
                  <RadioCard
                    key={option.id}
                    id={`plan-${option.id}`}
                    value={option.id}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <span className="font-display text-lg">
                          {option.name}
                        </span>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {option.blurb}
                        </p>
                      </div>
                      <div className="shrink-0 text-right">
                        <div className="font-display text-2xl">
                          {option.price}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {option.priceSuffix}
                        </div>
                      </div>
                    </div>
                  </RadioCard>
                ))}
              </RadioGroup>

              {form.plan === "DAILY" && (
                <p className="rounded-xl border border-border bg-secondary/60 px-4 py-3 text-sm text-muted-foreground">
                  The first message goes out straight away. After that, one
                  arrives every morning at 6:00 AM UTC. Cancel any time — you
                  keep the days you've paid for.
                </p>
              )}
            </StepPanel>
          )}

          {/* -------------------------------------------- Step 4: Payment */}
          {step === 3 && (
            <StepPanel
              title="Where should the receipt go?"
              description="Yours, not theirs. This is also how you sign in later to manage or cancel a plan."
            >
              <div className="space-y-2">
                <Label htmlFor="senderEmail">Your email address</Label>
                <Input
                  id="senderEmail"
                  name="senderEmail"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={form.senderEmail}
                  onChange={(e) => update("senderEmail", e.target.value)}
                  aria-invalid={
                    form.senderEmail.length > 3 && !stepValid(3)
                      ? true
                      : undefined
                  }
                  data-autofocus
                  required
                />
                <p className="text-sm text-muted-foreground">
                  Never shown to them. Nothing in their email points back here.
                </p>
              </div>

              <dl className="rounded-2xl border border-border bg-secondary/40 p-5 text-sm">
                <Summary label="To">
                  {form.recipientName.trim()
                    ? `${form.recipientName.trim()} · ${form.recipientEmail.trim()}`
                    : form.recipientEmail.trim()}
                </Summary>
                <Summary label="Tone">{theme.name}</Summary>
                <Summary label="Plan">
                  {plan.name} · {plan.price} {plan.priceSuffix}
                </Summary>
                <Summary label="Total today" emphasis>
                  {plan.price}
                </Summary>
              </dl>

              {error && (
                <p
                  role="alert"
                  className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive"
                >
                  {error}
                </p>
              )}
            </StepPanel>
          )}
        </div>

        {/* ------------------------------------------------- Navigation */}
        <div className="mt-9 flex items-center gap-3">
          {step > 0 && (
            <Button type="button" variant="ghost" onClick={goBack}>
              <ArrowLeft className="size-4" /> Back
            </Button>
          )}

          <div className="ml-auto">
            {step < STEPS.length - 1 ? (
              <Button
                type="button"
                size="lg"
                onClick={goNext}
                disabled={!canContinue}
              >
                Continue <ArrowRight className="size-4" />
              </Button>
            ) : (
              <Button
                type="submit"
                size="lg"
                disabled={!canContinue || submitting}
              >
                {submitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" /> Opening
                    checkout…
                  </>
                ) : (
                  <>
                    <Lock className="size-4" /> Pay {plan.price}
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

        <p className="mt-5 text-xs leading-relaxed text-muted-foreground">
          Payment is handled by Stripe — we never see your card details. One-off
          messages are non-refundable once delivered. Daily plans can be
          cancelled at any time.
        </p>
      </form>

      {/* ------------------------------------------------- Live preview */}
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          What they'll receive
        </p>
        <EmailPreview
          headline={theme.exampleHeadline}
          body={theme.example}
          recipientName={form.recipientName}
          recipientEmail={form.recipientEmail}
          isDaily={form.plan === "DAILY"}
        />
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          An example from the {theme.name.toLowerCase()} bank. The actual message
          is chosen when it sends
          {form.plan === "DAILY" ? ", and a different one goes out each day" : ""}
          .
        </p>
      </aside>
    </div>
  );
}

// ---------------------------------------------------------------------------

function Stepper({
  current,
  onSelect,
}: {
  current: number;
  onSelect: (index: number) => void;
}) {
  return (
    <ol className="flex items-center gap-2 sm:gap-3">
      {STEPS.map((label, index) => {
        const done = index < current;
        const active = index === current;
        return (
          <li key={label} className="flex flex-1 items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => onSelect(index)}
              disabled={index >= current}
              className={cn(
                "flex items-center gap-2 rounded-full text-sm transition-colors",
                done && "text-foreground hover:text-primary",
                active && "text-foreground",
                !done && !active && "text-muted-foreground",
                index >= current && "cursor-default",
              )}
            >
              <span
                className={cn(
                  "grid size-7 shrink-0 place-items-center rounded-full border text-xs font-semibold transition-colors",
                  done && "border-primary bg-primary text-primary-foreground",
                  active && "border-primary text-primary",
                  !done && !active && "border-border text-muted-foreground",
                )}
              >
                {done ? <Check className="size-3.5" /> : index + 1}
              </span>
              <span className="hidden sm:inline">{label}</span>
            </button>
            {index < STEPS.length - 1 && (
              <span
                aria-hidden
                className={cn(
                  "h-px flex-1 transition-colors",
                  done ? "bg-primary" : "bg-border",
                )}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}

function StepPanel({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2 className="font-display text-2xl leading-snug sm:text-3xl">{title}</h2>
      <p className="mt-2.5 text-[15px] leading-relaxed text-muted-foreground">
        {description}
      </p>
      <div className="mt-7 space-y-6">{children}</div>
    </div>
  );
}

function Summary({
  label,
  children,
  emphasis,
}: {
  label: string;
  children: React.ReactNode;
  emphasis?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-baseline justify-between gap-4 py-1.5",
        emphasis && "mt-1.5 border-t border-border pt-3",
      )}
    >
      <dt className="text-muted-foreground">{label}</dt>
      <dd
        className={cn(
          "text-right font-medium",
          emphasis && "font-display text-xl",
        )}
      >
        {children}
      </dd>
    </div>
  );
}
