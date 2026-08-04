/**
 * Site copy, per language.
 *
 * English lives at the site root and Spanish under /es — existing URLs don't
 * move, because they're indexed and the risk of a mass rewrite outweighs the
 * tidiness of putting both behind a [locale] segment.
 *
 * As with the messages, the Spanish here is written rather than translated
 * where translation would read stiffly. Marketing copy carries idiom, and a
 * literal rendering of "words that feel like good advice" is not a sentence a
 * Spanish speaker would write.
 */

export type SiteLocale = "en" | "es";

export interface Dictionary {
  locale: SiteLocale;
  /** Prefix for internal links: "" for English, "/es" for Spanish. */
  prefix: string;
  htmlLang: string;

  nav: {
    howItWorks: string;
    messages: string;
    pricing: string;
    dashboard: string;
    sendCta: string;
    openMenu: string;
    closeMenu: string;
    otherLanguage: string;
  };

  footer: {
    blurb: string;
    product: string;
    legal: string;
    company: string;
    sendKindWords: string;
    readMessages: string;
    terms: string;
    privacy: string;
    refunds: string;
    contact: string;
    stopReceiving: string;
    cookieChoices: string;
    questions: string;
    /** Templated: {name}, {nif}, {address}. */
    tradingAs: string;
  };

  /** Tone cards. The examples are real messages from that language's bank. */
  themes: {
    id: "PERSONAL" | "PROFESSIONAL";
    name: string;
    blurb: string;
    exampleHeadline: string;
    example: string;
  }[];

  /** Plan copy. Prices stay in USD — Stripe charges in USD either way. */
  plans: Record<
    "ONE_OFF" | "DAILY",
    {
      name: string;
      /** Formatted per locale: Spanish writes the symbol after the number. */
      price: string;
      priceSuffix: string;
      blurb: string;
      features: string[];
    }
  >;

  /** The trader's country, named in this language. */
  countryName: string;

  consent: {
    message: string;
    howWeHandleData: string;
    decline: string;
    accept: string;
    regionLabel: string;
  };

  home: {
    metaTitle: string;
    metaDescription: string;
    heroBadge: string;
    heroHeading: string;
    heroBody: string;
    heroPrimary: string;
    heroSecondary: string;
    heroPoints: string[];
    valueTitle: string[];
    valueBody: string[];
    howEyebrow: string;
    howHeading: string;
    howSteps: { title: string; body: string }[];
    tonesEyebrow: string;
    tonesHeading: string;
    tonesBody: string;
    forLife: string;
    forWork: string;
    pricingEyebrow: string;
    pricingHeading: string;
    pricingBody: string;
    mostSent: string;
    startDaily: string;
    sendOne: string;
    pricingNote: string;
    refundPolicy: string;
    showcaseEyebrow: string;
    /** Templated: {count}. */
    showcaseHeading: string;
    showcaseBody: string;
    showcaseNote: string;
    /** Templated: {count}. */
    readAll: string;
    faqHeading: string;
    faqs: { q: string; a: string }[];
    finalHeading: string;
    finalBody: string;
  };

  send: {
    metaTitle: string;
    metaDescription: string;
    eyebrow: string;
    heading: string;
    steps: string[];
    canceledNote: string;
    whoTitle: string;
    whoBody: string;
    theirEmail: string;
    theirName: string;
    optional: string;
    nameHelp: string;
    toneTitle: string;
    toneBody: string;
    languageLabel: string;
    languageHelp: string;
    frequencyTitle: string;
    frequencyBody: string;
    whenHeading: string;
    whenBody: string;
    timeOfDay: string;
    theirTimezone: string;
    /** Templated, not a function: this dictionary crosses into a client
     * component, and functions can't be serialised over that boundary. */
    dailyNote: string;
    payTitle: string;
    payBody: string;
    yourEmail: string;
    yourEmailHelp: string;
    summaryTo: string;
    summaryTone: string;
    summaryLanguage: string;
    summaryPlan: string;
    summaryArrives: string;
    summaryTotal: string;
    consent: string;
    back: string;
    continueLabel: string;
    payLabel: string;
    opening: string;
    smallPrint: string;
    previewLabel: string;
    previewNote: string;
    previewNoteDailySuffix: string;
    genericError: string;
    networkError: string;
  };
}

export const dictionaries: Record<SiteLocale, Dictionary> = {
  en: {
    locale: "en",
    prefix: "/en",
    htmlLang: "en",
    nav: {
      howItWorks: "How it works",
      messages: "Messages",
      pricing: "Pricing",
      dashboard: "Dashboard",
      sendCta: "Send kind words",
      openMenu: "Open menu",
      closeMenu: "Close menu",
      otherLanguage: "Español",
    },
    footer: {
      blurb:
        "Anonymous compliments that feel like good advice. Sent by email, delivered anonymously, and read by someone who probably needed it today.",
      product: "Product",
      legal: "Legal",
      company: "Company",
      sendKindWords: "Send kind words",
      readMessages: "Read the messages",
      terms: "Terms of Service",
      privacy: "Privacy Policy",
      refunds: "Refunds",
      contact: "Contact",
      stopReceiving: "Stop receiving messages",
      cookieChoices: "Cookie choices",
      questions: "Questions?",
      tradingAs: "Mo Advice is a trading name of {name}, NIF {nif}, {address}.",
    },
    themes: [
      {
        id: "PERSONAL",
        name: "Personal",
        blurb:
          "For a friend, a partner, a parent, someone having a hard month.",
        exampleHeadline: "You are somebody's safe place",
        example:
          "There is a person who thinks of you when something goes wrong, before they have thought about what to do. You may never be told that. It is one of the highest things a human being can be to another one.",
      },
      {
        id: "PROFESSIONAL",
        name: "Professional",
        blurb:
          "For a colleague, a report, a manager, someone carrying a lot at work.",
        exampleHeadline: "You are the reason things don't fall through",
        example:
          "There is a kind of work that only gets noticed when it stops, and you have been doing it for a long time without stopping. It is not glamorous and it is not accidental — it is a standard you hold when no one is checking.",
      },
    ],
    plans: {
      ONE_OFF: {
        name: "One message",
        price: "$1",
        priceSuffix: "once",
        blurb: "A single set of kind words, delivered right away.",
        features: [
          "Sent within a minute of paying",
          "Completely anonymous",
          "Personal or professional tone",
          "No account needed for them",
        ],
      },
      DAILY: {
        name: "Daily words",
        price: "$5",
        priceSuffix: "per month",
        blurb: "One new message every morning, for as long as you like.",
        features: [
          "A different message every day, at a time you choose",
          "Never repeats until the whole bank is used",
          "Cancel any time in one click",
          "Run several at once, for different people",
        ],
      },
    },
    countryName: "Spain",
    consent: {
      message:
        "We'd like to use Google Analytics to understand how people find this site. It sets cookies, so we only will if you say yes — decline and nothing is stored on your device.",
      howWeHandleData: "How we handle data",
      decline: "Decline",
      accept: "Accept",
      regionLabel: "Cookie choices",
    },
    home: {
      metaTitle: "Mo Advice — Anonymous compliments that feel like good advice",
      metaDescription:
        "Mo Advice sends anonymous compliments by email — short, genuine words that boost someone's confidence and morale. No account needed for the person receiving them.",
      heroBadge: "More of the good words",
      heroHeading: "Send anonymous compliments that feel like good advice",
      heroBody:
        "Most people go years without hearing the specific, true thing someone thinks about them. Mo Advice sends it — by email, without your name on it, to someone who could use it this week.",
      heroPrimary: "Send kind words",
      heroSecondary: "Try one for $1",
      heroPoints: [
        "No account for them",
        "Anonymous by design",
        "Cancel in one click",
      ],
      valueTitle: [
        "Anonymous, properly",
        "Written to be believed",
        "Built for morale",
      ],
      valueBody: [
        'Not "anonymous unless you look". There is nothing in the email, the headers, or the footer that leads back to you.',
        "Specific recognition beats generic praise every time. Our messages name a real quality and say why it matters.",
        "One message lifts a day. A month of them changes how someone talks about themselves at work and at home.",
      ],
      howEyebrow: "How it works",
      howHeading: "Three steps, about ninety seconds",
      howSteps: [
        {
          title: "Tell us who",
          body: "Their email address, and their first name if you'd like the message to open with it. That's the entire form.",
        },
        {
          title: "Pick the tone",
          body: "Personal for a friend or family member, professional for someone at work. We write the words — you choose which kind land right.",
        },
        {
          title: "They hear something good",
          body: "One message now for $1, or a different one every morning for $5 a month. Your name is never attached to any of it.",
        },
      ],
      tonesEyebrow: "Two tones",
      tonesHeading: "The same honesty, aimed differently",
      tonesBody:
        "Pick the one that fits your relationship with them. Here is a real message from each bank.",
      forLife: "For life",
      forWork: "For work",
      pricingEyebrow: "Pricing",
      pricingHeading: "A dollar to try it. Five a month to keep it going.",
      pricingBody:
        "No accounts to create, no minimums, no bundles. Cancel a daily plan whenever you like.",
      mostSent: "Most sent",
      startDaily: "Start a daily plan",
      sendOne: "Send one message",
      pricingNote:
        "Payments handled by Stripe. One-off messages are non-refundable once delivered — see the ",
      refundPolicy: "refund policy",
      showcaseEyebrow: "The actual words",
      showcaseHeading: "Four of the {count}, exactly as they arrive",
      showcaseBody:
        "Every message is written and edited by hand. No templates with a name slotted in, nothing generated on the fly — just specific things that are true of someone, said plainly.",
      showcaseNote:
        "A daily plan works through the bank without repeating, so nobody receives the same message twice until they've seen them all.",
      readAll: "Read all {count} of them",
      faqHeading: "Questions people ask",
      faqs: [
        {
          q: "Will they find out it was me?",
          a: "No. The email carries no name, no reply address that maps back to you, and nothing in the footer identifies the sender. If you want them to know, you have to tell them yourself.",
        },
        {
          q: "Does the recipient need an account?",
          a: "Never. They receive an email. There is nothing to sign up for, nothing to install, and one link at the bottom that stops the messages permanently.",
        },
        {
          q: "Who writes the messages?",
          a: "We do. Every message in the bank is written and edited by hand to be specific, warm, and true of a stranger — recognition rather than flattery. Nothing generic, nothing that reads like a fortune cookie.",
        },
        {
          q: "Can I send to more than one person?",
          a: "Yes. Run as many daily plans as you like, each with its own recipient and tone. They're listed separately in your dashboard and cancelled separately.",
        },
        {
          q: "How do I cancel a daily plan?",
          a: "One click in your dashboard, or through the Stripe billing portal. You keep the days you've already paid for, and you're never charged again.",
        },
        {
          q: "What if someone doesn't want these?",
          a: "Every message has a one-click opt-out. The moment someone uses it we stop sending to that address — from you or from anyone else — and we tell you so you can cancel.",
        },
      ],
      finalHeading:
        "Someone you know is having a harder week than they've said",
      finalBody:
        "It costs a dollar to do something about it, and they will never know it was you.",
    },
    send: {
      metaTitle: "Send kind words",
      metaDescription:
        "Send an anonymous compliment by email. One message for $1, or a different one every morning for $5 a month.",
      eyebrow: "Send kind words",
      heading: "Four short steps. They'll never know it was you.",
      steps: ["Who", "Tone", "How often", "Pay"],
      canceledNote:
        "No payment was taken — you closed the checkout. Pick up where you left off whenever you're ready.",
      whoTitle: "Who should hear something good?",
      whoBody:
        "We only ever email this address the message itself. It's never sold, never shared, and they don't need an account.",
      theirEmail: "Their email address",
      theirName: "Their first name",
      optional: "(optional)",
      nameHelp:
        "Used only to open the message. Leave it blank and it starts with a simple hello.",
      toneTitle: "What kind of words?",
      toneBody:
        "Both banks are written by hand. Pick whichever fits how you know them.",
      languageLabel: "What language do they read in?",
      languageHelp:
        "Each language has its own messages, written in it rather than translated.",
      frequencyTitle: "Once, or every morning?",
      frequencyBody:
        "Daily plans send a different message each day and never repeat until the whole bank is used.",
      whenHeading: "When should it arrive?",
      whenBody:
        "In their time, not yours — so “morning” means morning where they are.",
      timeOfDay: "Time of day",
      theirTimezone: "Their timezone",
      dailyNote:
        "The first message goes out straight away. After that, one arrives every day at {time} their time. Cancel any time — you keep the days you've paid for.",
      payTitle: "Where should the receipt go?",
      payBody:
        "Yours, not theirs. This is also how you sign in later to manage or cancel a plan.",
      yourEmail: "Your email address",
      yourEmailHelp:
        "Never shown to them. Nothing in their email points back here.",
      summaryTo: "To",
      summaryTone: "Tone",
      summaryLanguage: "Language",
      summaryPlan: "Plan",
      summaryArrives: "Arrives",
      summaryTotal: "Total today",
      consent:
        "I want my message sent straight away, and I understand that once it has been sent I lose my right to cancel within 14 days.",
      back: "Back",
      continueLabel: "Continue",
      payLabel: "Pay {price}",
      opening: "Opening checkout…",
      smallPrint:
        "Payment is handled by Stripe — we never see your card details. One-off messages are non-refundable once delivered. Daily plans can be cancelled at any time.",
      previewLabel: "What they'll receive",
      previewNote:
        "An example from the {tone} bank. The actual message is chosen when it sends{daily}.",
      previewNoteDailySuffix: ", and a different one goes out each day",
      genericError: "Something went wrong. Please try again.",
      networkError: "We couldn't reach the payment page. Check your connection.",
    },
  },

  es: {
    locale: "es",
    prefix: "/es",
    htmlLang: "es",
    nav: {
      howItWorks: "Cómo funciona",
      messages: "Mensajes",
      pricing: "Precios",
      dashboard: "Mi cuenta",
      sendCta: "Enviar buenas palabras",
      openMenu: "Abrir menú",
      closeMenu: "Cerrar menú",
      otherLanguage: "English",
    },
    footer: {
      blurb:
        "Cumplidos anónimos que se leen como un buen consejo. Se envían por correo, llegan sin remitente y los lee alguien que hoy probablemente los necesitaba.",
      product: "Producto",
      legal: "Legal",
      company: "Nosotros",
      sendKindWords: "Enviar buenas palabras",
      readMessages: "Leer los mensajes",
      terms: "Términos del servicio",
      privacy: "Política de privacidad",
      refunds: "Devoluciones",
      contact: "Contacto",
      stopReceiving: "Dejar de recibir mensajes",
      cookieChoices: "Preferencias de cookies",
      questions: "¿Dudas?",
      tradingAs:
        "Mo Advice es un nombre comercial de {name}, NIF {nif}, {address}.",
    },
    themes: [
      {
        id: "PERSONAL",
        name: "Personal",
        blurb:
          "Para un amigo, una pareja, tu madre o tu padre, alguien que está teniendo un mes difícil.",
        exampleHeadline: "Eres el sitio seguro de alguien",
        example:
          "Hay una persona que piensa en ti cuando algo va mal, antes incluso de pensar qué hacer. Puede que nunca te lo diga. Es de las cosas más altas que un ser humano puede ser para otro.",
      },
      {
        id: "PROFESSIONAL",
        name: "Profesional",
        blurb:
          "Para un compañero, alguien de tu equipo, tu jefa, alguien que carga con mucho en el trabajo.",
        exampleHeadline: "Si las cosas no se caen, es porque estás tú",
        example:
          "Hay un tipo de trabajo que solo se nota cuando deja de hacerse, y tú llevas mucho tiempo sin dejar de hacerlo. No es vistoso y no es casualidad: es un listón que mantienes cuando nadie está mirando.",
      },
    ],
    plans: {
      ONE_OFF: {
        name: "Un mensaje",
        price: "1 $",
        priceSuffix: "una vez",
        blurb: "Unas palabras buenas, entregadas ahora mismo.",
        features: [
          "Se envía menos de un minuto después de pagar",
          "Completamente anónimo",
          "Tono personal o profesional",
          "Quien lo recibe no necesita cuenta",
        ],
      },
      DAILY: {
        name: "Palabras diarias",
        price: "5 $",
        priceSuffix: "al mes",
        blurb: "Un mensaje nuevo cada mañana, mientras tú quieras.",
        features: [
          "Un mensaje distinto cada día, a la hora que elijas",
          "No se repite hasta agotar el banco entero",
          "Se cancela en un clic",
          "Puedes tener varios a la vez, para distintas personas",
        ],
      },
    },
    countryName: "España",
    consent: {
      message:
        "Nos gustaría usar Google Analytics para entender cómo llega la gente a este sitio. Usa cookies, así que solo lo haremos si nos dices que sí: si rechazas, no se guarda nada en tu dispositivo.",
      howWeHandleData: "Cómo tratamos los datos",
      decline: "Rechazar",
      accept: "Aceptar",
      regionLabel: "Preferencias de cookies",
    },
    home: {
      metaTitle: "Mo Advice — Cumplidos anónimos que suenan a buen consejo",
      metaDescription:
        "Mo Advice envía cumplidos anónimos por correo: palabras breves y sinceras que levantan la confianza y el ánimo de alguien. Quien los recibe no necesita ninguna cuenta.",
      heroBadge: "Más de las palabras buenas",
      heroHeading: "Envía cumplidos anónimos que suenan a buen consejo",
      heroBody:
        "Casi todo el mundo pasa años sin oír eso concreto y verdadero que alguien piensa de él. Mo Advice se lo envía: por correo, sin tu nombre, a alguien a quien le vendría bien esta semana.",
      heroPrimary: "Enviar buenas palabras",
      heroSecondary: "Prueba con uno por 1 $",
      heroPoints: [
        "Sin cuenta para quien lo recibe",
        "Anónimo por diseño",
        "Se cancela en un clic",
      ],
      valueTitle: [
        "Anónimo de verdad",
        "Escrito para que se lo crea",
        "Pensado para el ánimo",
      ],
      valueBody: [
        "No «anónimo hasta que miras». No hay nada en el correo, ni en las cabeceras, ni en el pie que lleve hasta ti.",
        "Un reconocimiento concreto gana siempre a un halago genérico. Nuestros mensajes nombran una cualidad real y dicen por qué importa.",
        "Un mensaje levanta un día. Un mes de mensajes cambia cómo habla alguien de sí mismo, en el trabajo y en casa.",
      ],
      howEyebrow: "Cómo funciona",
      howHeading: "Tres pasos, unos noventa segundos",
      howSteps: [
        {
          title: "Dinos a quién",
          body: "Su correo y, si quieres que el mensaje empiece con él, su nombre. Ese es todo el formulario.",
        },
        {
          title: "Elige el tono",
          body: "Personal para un amigo o alguien de la familia, profesional para alguien del trabajo. Las palabras las ponemos nosotros; tú eliges cuáles encajan.",
        },
        {
          title: "Y oye algo bueno",
          body: "Un mensaje ahora por 1 $, o uno distinto cada mañana por 5 $ al mes. Tu nombre no aparece en ninguno.",
        },
      ],
      tonesEyebrow: "Dos tonos",
      tonesHeading: "La misma honestidad, apuntada distinto",
      tonesBody:
        "Elige el que encaje con vuestra relación. Aquí tienes un mensaje real de cada banco.",
      forLife: "Para la vida",
      forWork: "Para el trabajo",
      pricingEyebrow: "Precios",
      pricingHeading: "Un dólar para probarlo. Cinco al mes para mantenerlo.",
      pricingBody:
        "Sin cuentas que crear, sin mínimos y sin paquetes. Cancela un plan diario cuando quieras.",
      mostSent: "El más enviado",
      startDaily: "Empezar un plan diario",
      sendOne: "Enviar un mensaje",
      pricingNote:
        "Los pagos los gestiona Stripe. Los mensajes sueltos no se devuelven una vez enviados: consulta la ",
      refundPolicy: "política de devoluciones",
      showcaseEyebrow: "Las palabras de verdad",
      showcaseHeading: "Cuatro de los {count}, tal y como llegan",
      showcaseBody:
        "Todos los mensajes están escritos y editados a mano. Ninguna plantilla con un nombre encajado, nada generado sobre la marcha: cosas concretas que son verdad de alguien, dichas sin adornos.",
      showcaseNote:
        "Un plan diario recorre el banco sin repetir, así que nadie recibe el mismo mensaje dos veces hasta haberlos visto todos.",
      readAll: "Léelos los {count}",
      faqHeading: "Lo que suele preguntarse",
      faqs: [
        {
          q: "¿Va a saber que fui yo?",
          a: "No. El correo no lleva ningún nombre, ni una dirección de respuesta que lleve hasta ti, ni nada en el pie que identifique a quien lo envía. Si quieres que lo sepa, tendrás que decírselo tú.",
        },
        {
          q: "¿Quien lo recibe necesita una cuenta?",
          a: "Nunca. Recibe un correo. No hay nada que registrar, nada que instalar y un enlace al final que detiene los mensajes para siempre.",
        },
        {
          q: "¿Quién escribe los mensajes?",
          a: "Nosotros. Cada mensaje del banco está escrito y editado a mano para ser concreto, cálido y verdadero incluso para un desconocido: reconocimiento, no halago. Nada genérico y nada que suene a galleta de la suerte.",
        },
        {
          q: "¿Puedo enviar a más de una persona?",
          a: "Sí. Puedes tener tantos planes diarios como quieras, cada uno con su destinatario y su tono. Aparecen por separado en tu cuenta y se cancelan por separado.",
        },
        {
          q: "¿Cómo cancelo un plan diario?",
          a: "Con un clic desde tu cuenta, o desde el portal de facturación de Stripe. Te quedas con los días que ya has pagado y no se te vuelve a cobrar.",
        },
        {
          q: "¿Y si alguien no quiere recibirlos?",
          a: "Todos los mensajes llevan una baja en un clic. En cuanto alguien la usa dejamos de enviar a esa dirección —tuya o de cualquier otra persona— y te avisamos para que canceles.",
        },
      ],
      finalHeading:
        "Alguien que conoces está teniendo una semana más dura de lo que ha contado",
      finalBody:
        "Cuesta un dólar hacer algo al respecto, y nunca sabrá que fuiste tú.",
    },
    send: {
      metaTitle: "Enviar buenas palabras",
      metaDescription:
        "Envía un cumplido anónimo por correo. Un mensaje por 1 $, o uno distinto cada mañana por 5 $ al mes.",
      eyebrow: "Enviar buenas palabras",
      heading: "Cuatro pasos cortos. Nunca sabrá que fuiste tú.",
      steps: ["Quién", "Tono", "Cada cuánto", "Pagar"],
      canceledNote:
        "No se ha cobrado nada: cerraste el pago. Puedes retomarlo donde lo dejaste cuando quieras.",
      whoTitle: "¿Quién debería oír algo bueno?",
      whoBody:
        "A esta dirección solo le enviamos el mensaje. No se vende, no se comparte y quien la recibe no necesita ninguna cuenta.",
      theirEmail: "Su correo electrónico",
      theirName: "Su nombre",
      optional: "(opcional)",
      nameHelp:
        "Solo se usa para empezar el mensaje. Déjalo en blanco y empieza con un saludo sencillo.",
      toneTitle: "¿Qué tipo de palabras?",
      toneBody:
        "Los dos bancos están escritos a mano. Elige el que encaje con cómo la conoces.",
      languageLabel: "¿En qué idioma lee?",
      languageHelp:
        "Cada idioma tiene sus propios mensajes, escritos en él y no traducidos.",
      frequencyTitle: "¿Una vez, o cada mañana?",
      frequencyBody:
        "Los planes diarios envían un mensaje distinto cada día y no repiten hasta agotar el banco entero.",
      whenHeading: "¿Cuándo debería llegar?",
      whenBody:
        "En su hora, no en la tuya, para que «por la mañana» sea por la mañana donde esté.",
      timeOfDay: "Hora del día",
      theirTimezone: "Su zona horaria",
      dailyNote:
        "El primer mensaje sale enseguida. Después llega uno cada día a las {time}, hora suya. Cancela cuando quieras: te quedas con los días que ya has pagado.",
      payTitle: "¿Adónde mandamos el recibo?",
      payBody:
        "A ti, no a esa persona. Es también con lo que entrarás luego para gestionar o cancelar un plan.",
      yourEmail: "Tu correo electrónico",
      yourEmailHelp:
        "Nunca se le muestra. Nada en su correo lleva hasta aquí.",
      summaryTo: "Para",
      summaryTone: "Tono",
      summaryLanguage: "Idioma",
      summaryPlan: "Plan",
      summaryArrives: "Llega",
      summaryTotal: "Total hoy",
      consent:
        "Quiero que mi mensaje se envíe de inmediato y entiendo que, una vez enviado, pierdo el derecho de desistimiento de 14 días.",
      back: "Atrás",
      continueLabel: "Continuar",
      payLabel: "Pagar {price}",
      opening: "Abriendo el pago…",
      smallPrint:
        "El pago lo gestiona Stripe: nunca vemos los datos de tu tarjeta. Los mensajes sueltos no se devuelven una vez entregados. Los planes diarios se pueden cancelar cuando quieras.",
      previewLabel: "Lo que va a recibir",
      previewNote:
        "Un ejemplo del banco {tone}. El mensaje concreto se elige al enviarlo{daily}.",
      previewNoteDailySuffix: ", y cada día sale uno distinto",
      genericError: "Algo ha salido mal. Inténtalo otra vez.",
      networkError: "No hemos podido abrir la página de pago. Revisa tu conexión.",
    },
  },
};

/**
 * Just the parts the send form needs.
 *
 * It's a client component, so whatever it receives is serialised and shipped to
 * the browser. Handing over the whole dictionary would put the entire homepage
 * copy in the bundle of a page that never renders a word of it.
 */
export type SendDictionary = {
  send: Dictionary["send"];
  themes: Dictionary["themes"];
  plans: Dictionary["plans"];
  forLife: string;
  forWork: string;
};

export function sendDictionary(dict: Dictionary): SendDictionary {
  return {
    send: dict.send,
    themes: dict.themes,
    plans: dict.plans,
    forLife: dict.home.forLife,
    forWork: dict.home.forWork,
  };
}

export function getDictionary(locale: SiteLocale): Dictionary {
  return dictionaries[locale];
}

/**
 * Paths that genuinely exist in every language.
 *
 * hreflang is a per-URL claim, not a site-wide one: pointing it at a Spanish
 * URL that renders English tells search engines a translation exists when it
 * doesn't, which is worse than staying quiet. Add a path here the moment it is
 * actually translated — and not before.
 */
const TRANSLATED_PATHS = new Set([
  "/",
  "/send",
  "/send/success",
  "/terms",
  "/privacy",
  "/contact",
]);

export function isTranslated(path: string): boolean {
  return TRANSLATED_PATHS.has(path);
}

/**
 * Canonical plus hreflang for a page, given the path without a locale prefix.
 *
 * Untranslated pages get a canonical and nothing else, so each language's
 * version stands alone rather than claiming a counterpart it doesn't have.
 */
export function alternatesFor(locale: SiteLocale, path: string) {
  const canonical = localePath(locale, path);
  if (!isTranslated(path)) return { canonical };

  return {
    canonical,
    languages: {
      en: localePath("en", path),
      es: localePath("es", path),
      // Which version an unmatched language gets. English, because that's
      // where the content and the audience currently are.
      "x-default": localePath("en", path),
    },
  };
}

/**
 * Fills {placeholders} in a dictionary string.
 *
 * The send dictionary is handed to a client component, so it has to be plain
 * data — a function would fail to serialise across the boundary with a fairly
 * unhelpful error.
 */
export function fill(
  template: string,
  values: Record<string, string>,
): string {
  return template.replace(/\{(\w+)\}/g, (_, key) => values[key] ?? "");
}

/** Prefixes an internal path for the given locale. */
export function localePath(locale: SiteLocale, path: string): string {
  const prefix = dictionaries[locale].prefix;
  if (path === "/") return prefix;
  return `${prefix}${path}`;
}
