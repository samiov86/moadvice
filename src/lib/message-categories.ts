import {
  MESSAGE_BANK,
  type MessageCategory,
  type MessageTemplateSeed,
} from "@/data/message-bank";

/**
 * Editorial layer over the message bank, for the public browsing pages.
 *
 * The bank itself stays a plain data file — this is where the copy that frames
 * it lives, so `message-bank.ts` never has to know about routing or SEO.
 */
export interface CategoryPage {
  /** URL segment. */
  slug: "personal" | "professional";
  category: MessageCategory;
  name: string;
  /** <title> and h1 — written for how people actually search. */
  title: string;
  metaDescription: string;
  heading: string;
  intro: string;
  /** Second paragraph, about when this tone is the right one. */
  guidance: string;
  messages: MessageTemplateSeed[];
}

const byCategory = (category: MessageCategory) =>
  MESSAGE_BANK.filter((message) => message.category === category);

export const CATEGORY_PAGES: CategoryPage[] = [
  {
    slug: "personal",
    category: "PERSONAL",
    name: "Personal",
    title: "Words of encouragement for someone having a hard time",
    metaDescription:
      "Thirty-two hand-written messages for a friend, a partner, or anyone going through a difficult stretch — specific, honest, and free to read.",
    heading: "Words for someone having a hard time",
    intro:
      "These are the messages we send when the tone is personal — for a friend, a partner, a parent, someone quietly getting through a difficult stretch. Every one is written by hand and edited to be true of a stranger, because that is the only way an anonymous message can land.",
    guidance:
      "Read them if you are trying to work out what to say to someone yourself. Most people reach for “let me know if you need anything”, which asks the person in trouble to do the work. Naming something specific and true is harder and lands better — that is what each of these tries to do.",
    messages: byCategory("PERSONAL"),
  },
  {
    slug: "professional",
    category: "PROFESSIONAL",
    name: "Professional",
    title: "Words of recognition for a colleague at work",
    metaDescription:
      "Thirty-two hand-written messages recognising real work — reliability, judgement, the unglamorous things nobody thanks anyone for. Free to read.",
    heading: "Words for someone carrying a lot at work",
    intro:
      "These are the messages we send when the tone is professional — for a colleague, a report, a manager, someone doing work that only gets noticed when it stops. They name a specific quality and say why it matters, which is what separates recognition from flattery.",
    guidance:
      "Useful whether or not you ever send one. If you have to write a review, a leaving card, or a thank-you and find yourself typing “great team player”, these are worth reading first: the difference is always specificity.",
    messages: byCategory("PROFESSIONAL"),
  },
];

export function getCategoryPage(slug: string): CategoryPage | undefined {
  return CATEGORY_PAGES.find((page) => page.slug === slug);
}
