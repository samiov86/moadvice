import { MESSAGE_BANK, type MessageTemplateSeed } from "@/data/message-bank";

/**
 * Occasion pages.
 *
 * Days when people actively search for what to say. Four, not twenty: each one
 * has real editorial substance and a reason to exist for someone who never
 * buys anything. A pile of near-identical "words for X day" pages is a content
 * farm, and search engines have been good at spotting those for years.
 *
 * Each page pulls real messages from the bank by slug, so nothing here invents
 * content that the product doesn't actually send.
 */
export interface Occasion {
  slug: string;
  /** <title>, absolute so the site suffix can't truncate it. */
  title: string;
  metaDescription: string;
  heading: string;
  /** When it falls, in plain words — people search this too. */
  when: string;
  /** Two or three paragraphs of genuine guidance. */
  body: string[];
  /** Pull quote framing what actually works. */
  principle: string;
  messageSlugs: string[];
}

export const OCCASIONS: Occasion[] = [
  {
    slug: "employee-appreciation-day",
    title: "What to say on Employee Appreciation Day",
    metaDescription:
      "Employee Appreciation Day falls on the first Friday in March. Words that recognise specific work, rather than the pizza-and-a-plaque version nobody believes.",
    heading: "What to actually say on Employee Appreciation Day",
    when: "The first Friday in March.",
    body: [
      "Most appreciation days fail in the same way: something is bought, an all-staff email goes out, and everyone can tell it was scheduled a week ago by someone whose job it was. Recognition that costs money but no attention reads as an obligation being discharged.",
      "What lands is specific. Not “thanks for all you do” — which is indistinguishable from a form letter — but a named thing this person did, and why it mattered to someone else. That requires having actually noticed, which is the part that can't be bought and is precisely why it means something.",
      "If you manage people, the useful exercise is to write one sentence per person about something concrete from the last month. If you can't, that itself is the finding, and it's worth more than the catering budget.",
    ],
    principle:
      "Specificity is the whole difference. “Great team player” is noise; “you rewrote the handover doc nobody asked you to and two people onboarded without help” is recognition.",
    messageSlugs: [
      "pro-quiet-reliability",
      "pro-unglamorous-work",
      "pro-credit-generosity",
      "pro-under-titled",
    ],
  },
  {
    slug: "random-acts-of-kindness-day",
    title: "Ideas for Random Acts of Kindness Day",
    metaDescription:
      "Random Acts of Kindness Day is 17 February. Ideas that reach a specific person rather than a stranger — including saying the thing you've never said out loud.",
    heading: "Random Acts of Kindness Day, done properly",
    when: "17 February each year.",
    body: [
      "The usual suggestions involve strangers: pay for someone's coffee, leave a note on a windscreen, let a car in. They're pleasant, and they're easy partly because a stranger can't be embarrassed by them and you never see the result.",
      "The harder and better version is aimed at someone you actually know. Most people go years without being told the specific, true thing that others think about them — not because nobody thinks it, but because saying it out loud feels exposing. The kindness that costs something is the kindness that names a person and a quality.",
      "It doesn't have to come from you by name. Plenty of the most affecting things people receive arrive anonymously, precisely because the recipient can't feel obliged to reciprocate or perform gratitude.",
    ],
    principle:
      "A kind act aimed at a stranger costs a few euros. One aimed at someone you know costs nerve, which is why it's worth more.",
    messageSlugs: [
      "per-kindness-unwitnessed",
      "per-steady-presence",
      "per-noticing-people",
      "per-generosity",
    ],
  },
  {
    slug: "world-mental-health-day",
    title: "What to say to someone struggling",
    metaDescription:
      "World Mental Health Day is 10 October. What to say to someone having a hard time — and why 'let me know if you need anything' puts the work on them.",
    heading: "What to say to someone who is struggling",
    when: "World Mental Health Day is 10 October.",
    body: [
      "The default is “let me know if you need anything”, and it is almost always well meant. It also quietly hands the entire task to the person who is least able to do it: they now have to identify a need, judge whether it's reasonable, and ask. Most won't.",
      "What helps more is specific and unconditional. Naming something true about them that has nothing to do with their current state — their steadiness, their humour, the fact that they've survived worse — gives them something solid at a moment when their own account of themselves has gone unreliable.",
      "None of this is treatment, and nobody should pretend otherwise. If someone is in real difficulty they need proper support, and a kind message is not a substitute for it. But being reminded that you are seen, by someone who took the trouble, is not nothing either.",
    ],
    principle:
      "“Let me know if you need anything” asks the struggling person to do the work. Saying one true, specific thing asks nothing of them at all.",
    messageSlugs: [
      "per-resilience",
      "per-gentle-with-self",
      "per-grief",
      "per-being-enough",
    ],
  },
  {
    slug: "teacher-appreciation-week",
    title: "What to write to a teacher",
    metaDescription:
      "Teacher Appreciation Week falls in the first full week of May. What to write in a card that a teacher will actually keep, instead of another generic thank-you.",
    heading: "What to write to a teacher",
    when: "The first full week of May.",
    body: [
      "Teachers receive a great many mugs. They receive rather fewer accounts of what they specifically changed, which is unfortunate, because the second thing is the one people keep in a drawer for twenty years.",
      "The useful shape is almost always the same: name the moment, then name the effect. A child who stopped dreading a subject. A conversation that landed at the right time. Patience shown on a day that clearly cost something. Teachers rarely learn how any of it turned out — the feedback loop ends when the year does.",
      "Written by a parent or by a former student, the same rule holds. Specific beats effusive every time, and “you were a great teacher” communicates less than one concrete sentence about a Tuesday in March.",
    ],
    principle:
      "Teachers almost never find out how it turned out. Telling them is the rarest thing you can give.",
    messageSlugs: [
      "pro-mentorship",
      "pro-listening",
      "pro-onboarding",
      "per-patience-with-others",
    ],
  },
];

export function getOccasion(slug: string): Occasion | undefined {
  return OCCASIONS.find((occasion) => occasion.slug === slug);
}

export function occasionMessages(occasion: Occasion): MessageTemplateSeed[] {
  return occasion.messageSlugs.map((slug) => {
    const message = MESSAGE_BANK.find((entry) => entry.slug === slug);
    if (!message) throw new Error(`Occasion message "${slug}" is missing`);
    return message;
  });
}
