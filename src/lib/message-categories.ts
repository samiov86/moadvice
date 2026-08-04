import type { MessageCategory, MessageTemplateSeed } from "@/data/message-bank";
import { localeContent } from "@/lib/locales";
import type { SiteLocale } from "@/lib/dictionary";

/**
 * Editorial layer over the message bank, for the public browsing pages.
 *
 * The banks themselves stay plain data files — this is where the copy that
 * frames them lives, so they never have to know about routing or SEO.
 *
 * Slugs stay the same in both languages ("personal", "professional"). Properly
 * localised path segments — /es/mensajes/profesional — would read better and
 * rank marginally better, but they mean per-locale routing for a one-letter
 * difference. Worth revisiting if Spanish earns real traffic.
 */
export interface CategoryPage {
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

type CategoryCopy = Omit<CategoryPage, "messages">;

const COPY: Record<SiteLocale, CategoryCopy[]> = {
  en: [
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
    },
  ],

  es: [
    {
      slug: "personal",
      category: "PERSONAL",
      name: "Personal",
      title: "Palabras de ánimo para alguien que lo está pasando mal",
      metaDescription:
        "Treinta y dos mensajes escritos a mano para un amigo, una pareja o cualquiera que atraviesa una racha difícil: concretos, honestos y gratis de leer.",
      heading: "Palabras para alguien que lo está pasando mal",
      intro:
        "Estos son los mensajes que enviamos cuando el tono es personal: para un amigo, una pareja, tu madre o tu padre, alguien que está saliendo adelante en silencio de una racha difícil. Todos están escritos a mano y editados para ser verdad incluso de un desconocido, porque es la única forma de que un mensaje anónimo llegue.",
      guidance:
        "Léelos si estás intentando averiguar qué decirle tú a alguien. Casi todo el mundo recurre a «avísame si necesitas algo», que le pasa el trabajo a la persona que está mal. Nombrar algo concreto y verdadero cuesta más y funciona mejor: eso es lo que intenta hacer cada uno de estos.",
    },
    {
      slug: "professional",
      category: "PROFESSIONAL",
      name: "Profesional",
      title: "Palabras de reconocimiento para un compañero de trabajo",
      metaDescription:
        "Treinta y dos mensajes escritos a mano que reconocen trabajo real: fiabilidad, criterio y las cosas poco vistosas que nadie agradece. Gratis de leer.",
      heading: "Palabras para alguien que carga con mucho en el trabajo",
      intro:
        "Estos son los mensajes que enviamos cuando el tono es profesional: para un compañero, alguien de tu equipo, tu jefa, alguien que hace un trabajo que solo se nota cuando deja de hacerse. Nombran una cualidad concreta y dicen por qué importa, que es lo que separa el reconocimiento del halago.",
      guidance:
        "Sirven aunque nunca envíes ninguno. Si tienes que escribir una evaluación, una tarjeta de despedida o un agradecimiento y te descubres tecleando «gran compañero de equipo», merece la pena leerlos antes: la diferencia está siempre en lo concreto.",
    },
  ],
};

export function categoryPages(locale: SiteLocale): CategoryPage[] {
  const bank = localeContent(locale).messages;
  return COPY[locale].map((copy) => ({
    ...copy,
    messages: bank.filter((message) => message.category === copy.category),
  }));
}

export function getCategoryPage(
  locale: SiteLocale,
  slug: string,
): CategoryPage | undefined {
  return categoryPages(locale).find((page) => page.slug === slug);
}

/** The slugs, which are the same in every language. */
export const CATEGORY_SLUGS = ["personal", "professional"] as const;
