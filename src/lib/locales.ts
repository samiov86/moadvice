import {
  MESSAGE_BANK,
  SUBJECT_LINES,
  type MessageTemplateSeed,
} from "@/data/message-bank";
import { MESSAGE_BANK_ES, SUBJECT_LINES_ES } from "@/data/message-bank-es";

/**
 * The languages a recipient can be written to in.
 *
 * The site itself is English — this is about what lands in the recipient's
 * inbox, which is the product. A sender chooses it at checkout the same way
 * they choose the timezone: it's a fact about the recipient, not about them.
 *
 * Adding a language means adding a bank of messages written in it and one
 * entry here. Nothing else in the codebase needs to change.
 */
export interface LocaleContent {
  code: string;
  /** For the picker, in the language itself — people scan for their own. */
  nativeName: string;
  /** For English UI and the sender's receipt. */
  englishName: string;
  messages: MessageTemplateSeed[];
  subjectLines: readonly string[];
  /**
   * Every string that reaches a recipient. Kept beside the bank rather than in
   * the template so the email file stays about layout, not language.
   */
  email: {
    eyebrow: string;
    greetingFallback: string;
    /** `(name) =>` so languages can punctuate a name differently. */
    greeting: (name: string) => string;
    anonymousNote: string;
    anonymousNoteDaily: string;
    brandFooter: string;
    whatIsThis: string;
    passItOn: (linkOpen: string, linkClose: string) => string;
    stopReceiving: string;
    privacy: string;
  };
}

export const LOCALES: Record<string, LocaleContent> = {
  en: {
    code: "en",
    nativeName: "English",
    englishName: "English",
    messages: MESSAGE_BANK,
    subjectLines: SUBJECT_LINES,
    email: {
      eyebrow: "Someone wanted you to read this",
      greetingFallback: "Hello,",
      greeting: (name) => `${name},`,
      anonymousNote:
        "Sent anonymously. Someone who knows you chose these words for you.",
      anonymousNoteDaily:
        "Sent anonymously. Someone who knows you chose these words for you, and picked out a new one for every morning this month.",
      brandFooter:
        "delivers anonymous compliments by email. You don't have an account and we never sell or share your address.",
      whatIsThis: "What is this?",
      passItOn: (open, close) =>
        `If it made you think of someone, you can ${open}send one too${close}.`,
      stopReceiving: "Stop receiving these",
      privacy: "Privacy",
    },
  },

  es: {
    code: "es",
    nativeName: "Español",
    englishName: "Spanish",
    messages: MESSAGE_BANK_ES,
    subjectLines: SUBJECT_LINES_ES,
    email: {
      eyebrow: "Alguien quería que leyeras esto",
      greetingFallback: "Hola:",
      // Spanish opens a letter with a colon, not a comma.
      greeting: (name) => `${name}:`,
      anonymousNote:
        "Enviado de forma anónima. Alguien que te conoce eligió estas palabras para ti.",
      anonymousNoteDaily:
        "Enviado de forma anónima. Alguien que te conoce eligió estas palabras para ti, y ha escogido una nueva para cada mañana de este mes.",
      brandFooter:
        "envía cumplidos anónimos por correo. No tienes ninguna cuenta y nunca vendemos ni compartimos tu dirección.",
      whatIsThis: "¿Qué es esto?",
      passItOn: (open, close) =>
        `Si te ha hecho pensar en alguien, tú también ${open}puedes enviar uno${close}.`,
      stopReceiving: "Dejar de recibirlos",
      privacy: "Privacidad",
    },
  },
};

export const SUPPORTED_LOCALES = Object.keys(LOCALES);

export function isSupportedLocale(locale: string): boolean {
  return locale in LOCALES;
}

/** Falls back to English rather than throwing — a bad value in the database
 * should mean a message in the wrong language, never a failed send. */
export function localeContent(locale: string): LocaleContent {
  return LOCALES[locale] ?? LOCALES.en;
}
