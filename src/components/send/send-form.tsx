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
import { PLANS, type PlanId, type ThemeId } from "@/lib/site";
import { fill, type SendDictionary } from "@/lib/dictionary";
import { SEND_HOURS } from "@/lib/timezone";
import { LOCALES } from "@/lib/locales";
import { cn } from "@/lib/utils";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

interface FormState {
  recipientEmail: string;
  recipientName: string;
  theme: ThemeId;
  plan: PlanId;
  senderEmail: string;
  sendHour: number;
  sendTimezone: string;
  locale: string;
  withdrawalConsent: boolean;
}

/**
 * The sender picks the *recipient's* zone, which we can't detect — so we
 * default to the sender's own and let them change it. Same country covers the
 * overwhelming majority of sends, and being one zone out is a far smaller error
 * than everyone getting 06:00 UTC.
 */
function detectTimeZone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  } catch {
    return "UTC";
  }
}

/**
 * Every zone the browser knows. `supportedValuesOf` is missing in older
 * engines, so fall back to the detected zone plus UTC rather than rendering an
 * empty select.
 */
function allTimeZones(detected: string): string[] {
  try {
    const supported = Intl.supportedValuesOf?.("timeZone");
    if (supported?.length) return supported;
  } catch {
    // fall through
  }
  return Array.from(new Set([detected, "UTC"]));
}

export interface SendFormProps {
  /** All user-facing copy, in the language of the page this is rendered on. */
  dict: SendDictionary;
  /** Pre-selected from the pricing table on the homepage. */
  initialPlan?: PlanId;
  /** Pre-filled when the sender is already signed in. */
  initialSenderEmail?: string;
  /** True when Stripe bounced them back from an abandoned checkout. */
  canceled?: boolean;
}

export function SendForm({
  dict,
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
    // Resolved on the client only — the server has no idea where anyone is,
    // and guessing during SSR would cause a hydration mismatch.
    sendHour: 8,
    sendTimezone: "UTC",
    locale: "en",
    withdrawalConsent: false,
  });

  const [timezones, setTimezones] = React.useState<string[]>(["UTC"]);

  React.useEffect(() => {
    const detected = detectTimeZone();
    setTimezones(allTimeZones(detected));
    setForm((previous) =>
      previous.sendTimezone === "UTC"
        ? { ...previous, sendTimezone: detected }
        : previous,
    );
  }, []);

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
    track("send_step_viewed", { step: steps[step], position: step + 1 });
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

  const steps = dict.send.steps;
  const theme = dict.themes.find((t) => t.id === form.theme)!;
  const plan = PLANS[form.plan];
  const planCopy = dict.plans[form.plan];

  const stepValid = (index: number) => {
    switch (index) {
      case 0:
        return EMAIL_PATTERN.test(form.recipientEmail.trim());
      case 3:
        return (
          EMAIL_PATTERN.test(form.senderEmail.trim()) && form.withdrawalConsent
        );
      default:
        return true;
    }
  };

  const canContinue = stepValid(step);

  const goNext = () => {
    if (!canContinue) return;
    setError(null);
    setStep((s) => Math.min(s + 1, steps.length - 1));
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
          locale: form.locale,
          withdrawalConsent: form.withdrawalConsent,
          ...(form.plan === "DAILY"
            ? { sendHour: form.sendHour, sendTimezone: form.sendTimezone }
            : {}),
        }),
      });

      const data = (await response.json()) as { url?: string; error?: string };

      if (!response.ok || !data.url) {
        track("checkout_failed", { status: response.status });
        setError(data.error ?? dict.send.genericError);
        setSubmitting(false);
        return;
      }

      window.location.assign(data.url);
    } catch {
      track("checkout_failed", { status: 0 });
      setError(dict.send.networkError);
      setSubmitting(false);
    }
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:gap-14">
      <form ref={formRef} onSubmit={handleSubmit} noValidate className="scroll-mt-24">
        <Stepper steps={steps} current={step} onSelect={(index) => {
          // Allow jumping back to any completed step, never forward past a gap.
          if (index < step) setStep(index);
        }} />

        {canceled && step === 0 && (
          <p className="mt-8 rounded-xl border border-border bg-secondary/60 px-4 py-3 text-sm text-muted-foreground">
            {dict.send.canceledNote}
          </p>
        )}

        <div className="mt-9">
          {/* ------------------------------------------------ Step 1: Who */}
          {step === 0 && (
            <StepPanel
              title={dict.send.whoTitle}
              description={dict.send.whoBody}
            >
              <div className="space-y-2">
                <Label htmlFor="recipientEmail">{dict.send.theirEmail}</Label>
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
                  {dict.send.theirName}{" "}
                  <span className="font-normal text-muted-foreground">
                    {dict.send.optional}
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
                  {dict.send.nameHelp}
                </p>
              </div>
            </StepPanel>
          )}

          {/* ----------------------------------------------- Step 2: Tone */}
          {step === 1 && (
            <StepPanel
              title={dict.send.toneTitle}
              description={dict.send.toneBody}
            >
              <RadioGroup
                value={form.theme}
                onValueChange={(value) => update("theme", value as ThemeId)}
                className="gap-4"
              >
                {dict.themes.map((option) => (
                  <RadioCard
                    key={option.id}
                    id={`theme-${option.id}`}
                    value={option.id}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <span className="font-display text-lg">
                          {dict.themes.find((x) => x.id === option.id)?.name ?? option.name}
                        </span>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {option.blurb}
                        </p>
                      </div>
                      <Badge variant="muted" className="shrink-0">
                        {option.id === "PERSONAL" ? dict.forLife : dict.forWork}
                      </Badge>
                    </div>
                  </RadioCard>
                ))}
              </RadioGroup>

              <div className="space-y-2 rounded-2xl border border-border bg-secondary/40 p-5">
                <Label htmlFor="locale">{dict.send.languageLabel}</Label>
                <select
                  id="locale"
                  value={form.locale}
                  onChange={(e) => update("locale", e.target.value)}
                  className="h-12 w-full rounded-xl border border-input bg-card px-4 text-base text-foreground shadow-sm focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/25"
                >
                  {Object.values(LOCALES).map((entry) => (
                    <option key={entry.code} value={entry.code}>
                      {entry.nativeName}
                    </option>
                  ))}
                </select>
                <p className="text-sm text-muted-foreground">
                  {dict.send.languageHelp}</p>
              </div>
            </StepPanel>
          )}

          {/* ------------------------------------------ Step 3: Frequency */}
          {step === 2 && (
            <StepPanel
              title={dict.send.frequencyTitle}
              description={dict.send.frequencyBody}
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
                          {dict.plans[option.id].name}
                        </span>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {dict.plans[option.id].blurb}
                        </p>
                      </div>
                      <div className="shrink-0 text-right">
                        <div className="font-display text-2xl">
                          {dict.plans[option.id].price}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {dict.plans[option.id].priceSuffix}
                        </div>
                      </div>
                    </div>
                  </RadioCard>
                ))}
              </RadioGroup>

              {form.plan === "DAILY" && (
                <div className="space-y-4 rounded-2xl border border-border bg-secondary/40 p-5">
                  <div>
                    <h3 className="font-display text-lg">
                      {dict.send.whenHeading}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {dict.send.whenBody}
                    </p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="sendHour">{dict.send.timeOfDay}</Label>
                      <select
                        id="sendHour"
                        value={form.sendHour}
                        onChange={(e) =>
                          update("sendHour", Number(e.target.value))
                        }
                        className="h-12 w-full rounded-xl border border-input bg-card px-4 text-base text-foreground shadow-sm focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/25"
                      >
                        {SEND_HOURS.map((option) => (
                          <option key={option.hour} value={option.hour}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="sendTimezone">{dict.send.theirTimezone}</Label>
                      <select
                        id="sendTimezone"
                        value={form.sendTimezone}
                        onChange={(e) =>
                          update("sendTimezone", e.target.value)
                        }
                        className="h-12 w-full rounded-xl border border-input bg-card px-4 text-base text-foreground shadow-sm focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/25"
                      >
                        {timezones.map((zone) => (
                          <option key={zone} value={zone}>
                            {zone.replace(/_/g, " ")}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground">
                    {fill(dict.send.dailyNote, {
                      time:
                        SEND_HOURS.find((h) => h.hour === form.sendHour)
                          ?.label ?? "",
                    })}
                  </p>
                </div>
              )}
            </StepPanel>
          )}

          {/* -------------------------------------------- Step 4: Payment */}
          {step === 3 && (
            <StepPanel
              title={dict.send.payTitle}
              description={dict.send.payBody}
            >
              <div className="space-y-2">
                <Label htmlFor="senderEmail">{dict.send.yourEmail}</Label>
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
                  {dict.send.yourEmailHelp}
                </p>
              </div>

              <dl className="rounded-2xl border border-border bg-secondary/40 p-5 text-sm">
                <Summary label={dict.send.summaryTo}>
                  {form.recipientName.trim()
                    ? `${form.recipientName.trim()} · ${form.recipientEmail.trim()}`
                    : form.recipientEmail.trim()}
                </Summary>
                <Summary label={dict.send.summaryTone}>{theme.name}</Summary>
                <Summary label={dict.send.summaryLanguage}>
                  {LOCALES[form.locale]?.nativeName ?? form.locale}
                </Summary>
                <Summary label={dict.send.summaryPlan}>
                  {planCopy.name} · {planCopy.price} {planCopy.priceSuffix}
                </Summary>
                {form.plan === "DAILY" && (
                  <Summary label={dict.send.summaryArrives}>
                    {SEND_HOURS.find((h) => h.hour === form.sendHour)?.label}{" "}
                    · {form.sendTimezone.replace(/_/g, " ")}
                  </Summary>
                )}
                <Summary label={dict.send.summaryTotal} emphasis>
                  {planCopy.price}
                </Summary>
              </dl>

              <label
                htmlFor="withdrawalConsent"
                className="flex cursor-pointer gap-3 rounded-xl border border-border bg-secondary/40 p-4 transition-colors has-[:checked]:border-primary/50 has-[:checked]:bg-accent/30"
              >
                <input
                  id="withdrawalConsent"
                  name="withdrawalConsent"
                  type="checkbox"
                  checked={form.withdrawalConsent}
                  onChange={(e) =>
                    update("withdrawalConsent", e.target.checked)
                  }
                  className="mt-0.5 size-5 shrink-0 accent-[var(--primary)]"
                  required
                />
                <span className="text-sm leading-relaxed text-muted-foreground">
                  {dict.send.consent}
                </span>
              </label>

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
              <ArrowLeft className="size-4" /> {dict.send.back}
            </Button>
          )}

          <div className="ml-auto">
            {step < steps.length - 1 ? (
              <Button
                type="button"
                size="lg"
                onClick={goNext}
                disabled={!canContinue}
              >
                {dict.send.continueLabel} <ArrowRight className="size-4" />
              </Button>
            ) : (
              <Button
                type="submit"
                size="lg"
                disabled={!canContinue || submitting}
              >
                {submitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" /> {dict.send.opening}
                  </>
                ) : (
                  <>
                    <Lock className="size-4" /> {fill(dict.send.payLabel, { price: planCopy.price })}
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

        <p className="mt-5 text-xs leading-relaxed text-muted-foreground">
          {dict.send.smallPrint}
        </p>
      </form>

      {/* ------------------------------------------------- Live preview */}
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          {dict.send.previewLabel}
        </p>
        <EmailPreview
          headline={theme.exampleHeadline}
          body={theme.example}
          recipientName={form.recipientName}
          recipientEmail={form.recipientEmail}
          isDaily={form.plan === "DAILY"}
        />
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          {fill(dict.send.previewNote, {
            tone: theme.name.toLowerCase(),
            daily:
              form.plan === "DAILY" ? dict.send.previewNoteDailySuffix : "",
          })}
        </p>
      </aside>
    </div>
  );
}

// ---------------------------------------------------------------------------

function Stepper({
  steps,
  current,
  onSelect,
}: {
  steps: readonly string[];
  current: number;
  onSelect: (index: number) => void;
}) {
  return (
    <ol className="flex items-center gap-2 sm:gap-3">
      {steps.map((label, index) => {
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
            {index < steps.length - 1 && (
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
