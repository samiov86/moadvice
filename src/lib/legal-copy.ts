import type { SiteLocale } from "@/lib/dictionary";

/**
 * Terms, Privacy and Contact, in both languages.
 *
 * Kept as structured data rather than JSX so the two versions stay aligned
 * section by section: a clause that exists in English but not in Spanish is the
 * failure mode that matters here, and a shared shape makes it visible.
 *
 * Blocks carry a little inline HTML — <strong>, <a>. The content is entirely
 * ours, and the alternative is a markup mini-language that helps nobody.
 *
 * Placeholders are filled at render: {support}, {name}, {nif}, {address},
 * {domain}, {termsHref}, {privacyHref}, {unsubscribeHref}, {dashboardHref}.
 *
 * The Spanish is a faithful rendering, not a loose one — where the English
 * makes a commitment, the Spanish makes the same commitment. It should still be
 * read by a Spanish lawyer before you rely on it.
 */

export type LegalBlock =
  | { kind: "p"; html: string }
  | { kind: "h3"; text: string }
  | { kind: "ul"; items: string[] };

export interface LegalSection {
  /** Anchor, e.g. "refunds" so /terms#refunds keeps working. */
  id?: string;
  heading: string;
  blocks: LegalBlock[];
}

export interface LegalPage {
  title: string;
  metaDescription: string;
  intro: string;
  sections: LegalSection[];
}

export interface LegalCopy {
  terms: LegalPage;
  privacy: LegalPage;
  contact: LegalPage;
  lastUpdatedLabel: string;
  legalEyebrow: string;
}

const en: LegalCopy = {
  lastUpdatedLabel: "Last updated",
  legalEyebrow: "Legal",

  terms: {
    title: "Terms of Service",
    metaDescription:
      "The terms behind Mo Advice: what the service does, what it costs, how cancellation and refunds work, and the rules that keep anonymity a feature for kindness.",
    intro:
      "These terms cover your use of Mo Advice ({domain}). They're written to be read, not to be impressive. If anything here is unclear, email {support} and we'll explain it.",
    sections: [
      {
        heading: "Who you are contracting with",
        blocks: [
          { kind: "p", html: "Mo Advice is a trading name of {name}, an individual trader based at:" },
          { kind: "p", html: "{address}" },
          { kind: "p", html: "NIF: {nif}" },
          { kind: "p", html: 'Contact: <a href="mailto:{support}">{support}</a>' },
        ],
      },
      {
        heading: "1. What the service does",
        blocks: [
          { kind: "p", html: "Mo Advice sends anonymous, pre-written messages of encouragement and recognition by email, on your instruction, to an email address you provide. You choose the tone, the language and the frequency. We choose the specific words from a bank we write and maintain." },
          { kind: "p", html: "The person receiving the message does not need an account and is never told who paid for it. We do not disclose your identity to them under any circumstances short of a valid legal order." },
        ],
      },
      {
        heading: "2. Who can use it",
        blocks: [
          { kind: "p", html: "You must be at least 16 years old and legally able to enter into a contract. By placing an order you confirm that you are." },
        ],
      },
      {
        heading: "3. Your responsibilities",
        blocks: [
          { kind: "p", html: "You are responsible for the address you enter and for the effect of sending mail to it. Specifically, you agree that:" },
          {
            kind: "ul",
            items: [
              "You have a genuine, good-faith reason to believe the recipient would not object to receiving kind words.",
              "You will not use the service to contact anyone who has asked you not to contact them, including anyone subject to a restraining or no-contact order.",
              "You will not use the service to harass, intimidate, stalk, or circumvent a block, even with material that appears positive.",
              "You will not enter an address you have obtained unlawfully.",
            ],
          },
          { kind: "p", html: "<strong>Anonymity is a feature for kindness, not a shield for harassment.</strong> We terminate accounts used this way without refund, and we will cooperate with law enforcement where required." },
        ],
      },
      {
        heading: "4. Recipients can always opt out",
        blocks: [
          { kind: "p", html: "Every message contains a one-click opt-out. When someone uses it we stop sending to that address permanently — from you and from anybody else — and we tell you so that you can cancel your plan. We will not re-enable an address that has opted out, and no refund is owed for messages that could not be sent for this reason." },
        ],
      },
      {
        heading: "5. Prices and payment",
        blocks: [
          { kind: "p", html: "A single message costs $1 (one-time). A daily plan costs $5 per month and renews automatically until cancelled. Prices are in US dollars and exclude any taxes we're required to collect." },
          { kind: "p", html: "Payments are processed by Stripe. We never receive or store your full card details. Your statement will show <strong>{domain}</strong>." },
        ],
      },
      {
        id: "refunds",
        heading: "6. Refunds",
        blocks: [
          { kind: "h3", text: "One-off messages" },
          { kind: "p", html: "<strong>One-off messages are non-refundable once the message has been sent.</strong> Delivery normally happens within a minute of payment, so in practice a one-off order becomes non-refundable almost immediately. If a message was never delivered because of a fault on our side, we will refund it in full." },
          { kind: "h3", text: "Daily plans" },
          { kind: "p", html: "You can cancel a daily plan at any time from your dashboard or through the Stripe billing portal. Cancellation stops all future charges. Messages continue until the end of the period you have already paid for, and that period is not refunded on a pro-rata basis." },
          { kind: "h3", text: "Everything else" },
          { kind: "p", html: 'If something has genuinely gone wrong — a duplicate charge, a plan that kept billing after you cancelled, a delivery failure — email <a href="mailto:{support}">{support}</a> and we will put it right. We would rather refund you than argue.' },
          { kind: "h3", text: "Your statutory cancellation right" },
          { kind: "p", html: "If you are a consumer in the UK or EU, you normally have 14 days to withdraw from a contract made online. Because a message is sent immediately, we ask you to confirm at checkout that you want it sent straight away and that you understand you lose that right once it has been sent. You tick that box yourself, we record the exact wording with your order, and we repeat it back to you in your receipt." },
          { kind: "p", html: "<strong>If you do not tick it, we cannot take the order</strong> — rather than take your money and rely on a clause you never accepted. Until a message has actually been sent, the withdrawal right still applies and you can ask us to cancel for a full refund." },
          { kind: "p", html: "Nothing here limits any other statutory right you may have under consumer law in your country. Where such a right applies, it takes precedence over this section." },
        ],
      },
      {
        heading: "7. Message content",
        blocks: [
          { kind: "p", html: "Messages are chosen from our bank at the time of sending. You do not choose the specific message, and the same message may be sent to different people. We may add to, edit, or retire messages at any time." },
          { kind: "p", html: "Messages are general encouragement. They are not advice of any professional kind — not medical, psychological, legal, or financial — and should not be relied on as such." },
        ],
      },
      {
        heading: "8. Availability",
        blocks: [
          { kind: "p", html: "We aim to deliver each daily message at approximately the time chosen when the plan was set up, in the timezone chosen with it. Email delivery depends on providers we don't control, and we can't guarantee that a given message reaches an inbox rather than a spam folder. Occasional delay or non-delivery does not entitle you to a refund, though repeated failure does — see section 6." },
        ],
      },
      {
        heading: "9. Liability",
        blocks: [
          { kind: "p", html: "To the fullest extent the law allows, our total liability to you for any claim connected with the service is limited to the amount you paid us in the twelve months before the claim arose. We are not liable for indirect or consequential loss." },
          { kind: "p", html: "Nothing in these terms excludes liability for death or personal injury caused by negligence, for fraud, or for anything else that cannot lawfully be excluded." },
        ],
      },
      {
        heading: "10. Ending the arrangement",
        blocks: [
          { kind: "p", html: "You may stop using the service at any time; cancel any daily plans first so you aren't billed again. We may suspend or close an account that breaches these terms, and we'll tell you why unless we're legally prevented from doing so." },
        ],
      },
      {
        heading: "11. Changes",
        blocks: [
          { kind: "p", html: "We may update these terms. If a change materially affects you and you hold an active plan, we'll email you before it takes effect. Continuing to use the service after that means you accept the new terms." },
        ],
      },
      {
        heading: "12. Contact",
        blocks: [
          { kind: "p", html: '<a href="mailto:{support}">{support}</a>' },
        ],
      },
      {
        heading: "13. Governing law",
        blocks: [
          { kind: "p", html: "These terms are governed by Spanish law. If you are a consumer, this does not deprive you of the protection of any mandatory consumer rules of the country where you live — you keep those rights, and you may bring proceedings in your own country's courts." },
        ],
      },
    ],
  },

  privacy: {
    title: "Privacy Policy",
    metaDescription:
      "What Mo Advice stores about senders and recipients, why recipients get the stricter treatment, who processes data for us, and how to have yours deleted.",
    intro:
      "Mo Advice handles two kinds of people's data: senders, who pay us, and recipients, who never asked for an account. Recipients get the stricter treatment.",
    sections: [
      {
        heading: "What we collect",
        blocks: [
          { kind: "h3", text: "If you send messages" },
          {
            kind: "ul",
            items: [
              "Your email address — for receipts, confirmations, and sign-in.",
              "Your orders and plans: which tone, which language, which frequency, which recipient, and when.",
              "A Stripe customer ID and subscription IDs. We never see or store your card number, expiry, or CVC — those go directly to Stripe.",
            ],
          },
          { kind: "h3", text: "If you receive messages" },
          {
            kind: "ul",
            items: [
              "Your email address.",
              "A first name, only if the sender supplied one.",
              "A log of which messages were sent to you and when, so we don't repeat one and so we can answer support questions.",
              "An opt-out token, so the unsubscribe link works.",
            ],
          },
          { kind: "p", html: "That's it. No tracking pixels in the messages, no open or click tracking, no profile building, no ad networks." },
          { kind: "p", html: "We do record that a message was accepted, delivered, or bounced — reported to us by our email provider, not by anything embedded in the message you opened." },
        ],
      },
      {
        heading: "Anonymity works in one direction only",
        blocks: [
          { kind: "p", html: "We know who sent what — we have to, in order to bill and to handle abuse reports. The <strong>recipient</strong> never learns the sender's identity from us. We do not reveal it on request, and the emails contain nothing that would identify the sender." },
          { kind: "p", html: "The one exception is a valid legal order, or a credible report that the service is being used to harass someone. We will comply with the law." },
        ],
      },
      {
        heading: "What we don't do",
        blocks: [
          {
            kind: "ul",
            items: [
              "We do not sell, rent, or share personal data with advertisers.",
              "We do not use recipient addresses for marketing. The only mail an address receives is the messages that were paid for.",
              "We do not add anyone to a mailing list.",
            ],
          },
        ],
      },
      {
        heading: "Who processes data for us",
        blocks: [
          {
            kind: "ul",
            items: [
              "<strong>Stripe</strong> — payments, subscriptions, and billing portal.",
              "<strong>Resend</strong> — email delivery.",
              "<strong>Vercel</strong> — hosting, scheduled jobs, and cookieless web analytics.",
              "<strong>Our database host</strong> — Postgres, storing everything described above.",
            ],
          },
          { kind: "p", html: "Each is bound by its own data processing terms. Data may be processed in the United States and the EU." },
        ],
      },
      {
        heading: "How long we keep things",
        blocks: [
          {
            kind: "ul",
            items: [
              "Order and payment records: seven years, because tax law requires it.",
              "Delivery logs: two years, then deleted.",
              "Opted-out addresses: kept indefinitely in a suppression list. This is deliberate — it is the only way to guarantee we never send to that address again.",
            ],
          },
        ],
      },
      {
        heading: "Your rights",
        blocks: [
          { kind: "p", html: 'Depending on where you live, you may have the right to access, correct, export, or delete your personal data, and to object to processing. Email <a href="mailto:{support}">{support}</a> and we\'ll action it within 30 days.' },
          { kind: "p", html: '<strong>Recipients:</strong> the fastest route is the opt-out link at the bottom of any message. Emailing us works too, and we\'ll confirm when it\'s done.' },
        ],
      },
      {
        heading: "Cookies and analytics",
        blocks: [
          { kind: "p", html: "One cookie, used to keep you signed in to the sender dashboard. It's set only after you use a sign-in link, and it expires. There are no advertising cookies and nothing that follows you to other sites." },
          { kind: "p", html: "We use <strong>Vercel Web Analytics</strong> to count page views and a few steps in the send form. It is cookieless, stores nothing on your device, and does not build a profile or track you across sites." },
          { kind: "p", html: "We also offer <strong>Google Analytics</strong>, which does set cookies — so it only runs if you accept the banner. Decline and nothing is stored on your device." },
          { kind: "p", html: "Those events record only what was chosen: the plan, the tone, and which step of the form. <strong>No email address is ever included</strong> — not yours and certainly not the recipient's, who never agreed to anything." },
        ],
      },
      {
        heading: "Children",
        blocks: [
          { kind: "p", html: "The service is not intended for anyone under 16. If we learn we hold data about a child, we delete it." },
        ],
      },
      {
        heading: "Contact",
        blocks: [
          { kind: "p", html: '<a href="mailto:{support}">{support}</a>' },
          { kind: "p", html: "The data controller is {name} (NIF {nif}), {address}. We process sender data to perform the contract you entered into, and recipient data on the basis of our legitimate interest in delivering the message a sender paid for — balanced against the recipient's interests by the one-click opt-out in every message and the permanent suppression that follows." },
          { kind: "p", html: 'If you are in the EU or UK and think we have handled your data badly, tell us first — but you also have the right to complain to your national data protection authority. In Spain that is the <a href="https://www.aepd.es">AEPD</a>.' },
        ],
      },
    ],
  },

  contact: {
    title: "Contact",
    metaDescription:
      "Contact Mo Advice — stop receiving messages, cancel a daily plan, query a charge, or report misuse. One inbox, read by a person, usually answered within a day.",
    intro: "One inbox, read by a person, usually answered within a day.",
    sections: [
      {
        heading: "Email us",
        blocks: [{ kind: "p", html: '<a href="mailto:{support}">{support}</a>' }],
      },
      {
        heading: "Postal address",
        blocks: [
          { kind: "p", html: "Mo Advice is a trading name of {name}, NIF {nif}." },
          { kind: "p", html: "{address}" },
          { kind: "p", html: "Email reaches us far faster, but this is the registered trading address if you need to write." },
        ],
      },
      {
        heading: "Common things",
        blocks: [
          { kind: "h3", text: "I want to stop receiving messages" },
          { kind: "p", html: 'Use the opt-out link at the bottom of any message you\'ve received — it\'s instant and permanent. If you can\'t find it, email us from the address that\'s receiving them and we\'ll take care of it. You can also <a href="{unsubscribeHref}">open the opt-out page</a>.' },
          { kind: "h3", text: "I want to cancel a daily plan" },
          { kind: "p", html: 'Sign in at <a href="{dashboardHref}">your dashboard</a> with the email address you paid with, and cancel there in one click. No password needed — we email you a link.' },
          { kind: "h3", text: "Something was charged twice" },
          { kind: "p", html: "Send us the last four digits of the card and the date. We'll find it and refund it." },
          { kind: "h3", text: "A message never arrived" },
          { kind: "p", html: "Check the recipient's spam folder first — that's usually it. If it's genuinely missing, tell us the recipient address and roughly when you ordered, and we'll either resend or refund." },
          { kind: "h3", text: "Someone is using this to bother me" },
          { kind: "p", html: "Tell us and we will stop it immediately and permanently. Please include the full email you received, headers if you can get them. We take this seriously — anonymity here exists for kindness, and we remove people who abuse it." },
        ],
      },
      {
        heading: "Press and partnerships",
        blocks: [
          { kind: "p", html: "Same address. Mention what you're working on and we'll get back to you." },
        ],
      },
    ],
  },
};

const es: LegalCopy = {
  lastUpdatedLabel: "Última actualización",
  legalEyebrow: "Legal",

  terms: {
    title: "Términos del servicio",
    metaDescription:
      "Los términos de Mo Advice: qué hace el servicio, cuánto cuesta, cómo funcionan la cancelación y las devoluciones, y las normas que mantienen el anonimato como algo para la amabilidad.",
    intro:
      "Estos términos regulan tu uso de Mo Advice ({domain}). Están escritos para leerse, no para impresionar. Si algo no queda claro, escribe a {support} y te lo explicamos.",
    sections: [
      {
        heading: "Con quién contratas",
        blocks: [
          { kind: "p", html: "Mo Advice es un nombre comercial de {name}, empresario individual con domicilio en:" },
          { kind: "p", html: "{address}" },
          { kind: "p", html: "NIF: {nif}" },
          { kind: "p", html: 'Contacto: <a href="mailto:{support}">{support}</a>' },
        ],
      },
      {
        heading: "1. Qué hace el servicio",
        blocks: [
          { kind: "p", html: "Mo Advice envía por correo electrónico mensajes anónimos y ya redactados de ánimo y reconocimiento, siguiendo tus instrucciones, a la dirección que nos indiques. Tú eliges el tono, el idioma y la frecuencia. Nosotros elegimos las palabras concretas de un banco que escribimos y mantenemos." },
          { kind: "p", html: "Quien recibe el mensaje no necesita ninguna cuenta y nunca se le dice quién lo ha pagado. No revelamos tu identidad en ninguna circunstancia salvo orden legal válida." },
        ],
      },
      {
        heading: "2. Quién puede usarlo",
        blocks: [
          { kind: "p", html: "Debes tener al menos 16 años y capacidad legal para contratar. Al hacer un pedido confirmas que es así." },
        ],
      },
      {
        heading: "3. Tus responsabilidades",
        blocks: [
          { kind: "p", html: "Eres responsable de la dirección que introduces y del efecto de enviarle correo. En concreto, aceptas que:" },
          {
            kind: "ul",
            items: [
              "Tienes un motivo real y de buena fe para creer que a esa persona no le molestaría recibir buenas palabras.",
              "No usarás el servicio para contactar con nadie que te haya pedido que no lo hagas, incluida cualquier persona amparada por una orden de alejamiento o de no contacto.",
              "No usarás el servicio para acosar, intimidar, hostigar ni para sortear un bloqueo, aunque el contenido parezca positivo.",
              "No introducirás una dirección que hayas obtenido de forma ilícita.",
            ],
          },
          { kind: "p", html: "<strong>El anonimato es una función para la amabilidad, no un escudo para el acoso.</strong> Cerramos sin devolución las cuentas que se usen así, y colaboraremos con las autoridades cuando se nos requiera." },
        ],
      },
      {
        heading: "4. Quien recibe siempre puede darse de baja",
        blocks: [
          { kind: "p", html: "Todos los mensajes incluyen una baja en un clic. Cuando alguien la usa dejamos de enviar a esa dirección de forma permanente —ni tú ni ninguna otra persona— y te avisamos para que puedas cancelar tu plan. No reactivamos una dirección que se ha dado de baja, y no se debe devolución alguna por los mensajes que no hayan podido enviarse por este motivo." },
        ],
      },
      {
        heading: "5. Precios y pago",
        blocks: [
          { kind: "p", html: "Un mensaje suelto cuesta 1 $ (pago único). Un plan diario cuesta 5 $ al mes y se renueva automáticamente hasta que se cancele. Los precios están en dólares estadounidenses y no incluyen los impuestos que estemos obligados a repercutir." },
          { kind: "p", html: "Los pagos los procesa Stripe. Nunca recibimos ni almacenamos los datos completos de tu tarjeta. En tu extracto aparecerá <strong>{domain}</strong>." },
        ],
      },
      {
        id: "refunds",
        heading: "6. Devoluciones",
        blocks: [
          { kind: "h3", text: "Mensajes sueltos" },
          { kind: "p", html: "<strong>Los mensajes sueltos no son reembolsables una vez enviado el mensaje.</strong> La entrega suele producirse en menos de un minuto desde el pago, así que en la práctica un pedido suelto deja de ser reembolsable casi de inmediato. Si un mensaje nunca llegó a entregarse por un fallo nuestro, te lo devolvemos íntegramente." },
          { kind: "h3", text: "Planes diarios" },
          { kind: "p", html: "Puedes cancelar un plan diario cuando quieras desde tu cuenta o desde el portal de facturación de Stripe. La cancelación detiene todos los cobros futuros. Los mensajes continúan hasta el final del periodo que ya has pagado, y ese periodo no se devuelve de forma proporcional." },
          { kind: "h3", text: "Todo lo demás" },
          { kind: "p", html: 'Si algo ha salido mal de verdad —un cobro duplicado, un plan que siguió facturando después de cancelarlo, un fallo de entrega—, escribe a <a href="mailto:{support}">{support}</a> y lo arreglamos. Preferimos devolverte el dinero a discutir.' },
          { kind: "h3", text: "Tu derecho legal de desistimiento" },
          { kind: "p", html: "Si eres consumidor en España, la UE o el Reino Unido, normalmente dispones de 14 días para desistir de un contrato celebrado a distancia. Como el mensaje se envía de inmediato, te pedimos que confirmes al pagar que quieres que salga ya y que entiendes que pierdes ese derecho una vez enviado. La casilla la marcas tú, guardamos con tu pedido el texto exacto que se te mostró y te lo repetimos en el recibo." },
          { kind: "p", html: "<strong>Si no la marcas, no podemos aceptar el pedido</strong>, en lugar de cobrarte y ampararnos en una cláusula que nunca aceptaste. Mientras un mensaje no se haya enviado, el derecho de desistimiento sigue vigente y puedes pedirnos la cancelación con devolución íntegra." },
          { kind: "p", html: "Nada de lo aquí escrito limita cualquier otro derecho que la normativa de consumo de tu país te reconozca. Cuando exista tal derecho, prevalece sobre esta sección." },
        ],
      },
      {
        heading: "7. Contenido de los mensajes",
        blocks: [
          { kind: "p", html: "Los mensajes se eligen de nuestro banco en el momento del envío. Tú no eliges el mensaje concreto, y el mismo mensaje puede enviarse a personas distintas. Podemos añadir, editar o retirar mensajes en cualquier momento." },
          { kind: "p", html: "Los mensajes son ánimo de carácter general. No son asesoramiento profesional de ningún tipo —ni médico, ni psicológico, ni jurídico, ni financiero— y no deben tomarse como tal." },
        ],
      },
      {
        heading: "8. Disponibilidad",
        blocks: [
          { kind: "p", html: "Procuramos entregar cada mensaje diario aproximadamente a la hora elegida al contratar el plan, en la zona horaria elegida con ella. La entrega de correo depende de proveedores que no controlamos y no podemos garantizar que un mensaje concreto llegue a la bandeja de entrada en lugar de a spam. Un retraso o una falta de entrega puntuales no dan derecho a devolución; un fallo repetido sí, véase la sección 6." },
        ],
      },
      {
        heading: "9. Responsabilidad",
        blocks: [
          { kind: "p", html: "En la máxima medida que permita la ley, nuestra responsabilidad total frente a ti por cualquier reclamación relacionada con el servicio se limita al importe que nos hayas pagado en los doce meses anteriores a la reclamación. No respondemos de daños indirectos o consecuenciales." },
          { kind: "p", html: "Nada en estos términos excluye la responsabilidad por muerte o daños personales causados por negligencia, por dolo, ni por cualquier otra cosa que no pueda excluirse legalmente." },
        ],
      },
      {
        heading: "10. Fin de la relación",
        blocks: [
          { kind: "p", html: "Puedes dejar de usar el servicio cuando quieras; cancela antes cualquier plan diario para que no se te vuelva a cobrar. Podemos suspender o cerrar una cuenta que incumpla estos términos, y te diremos por qué salvo que legalmente no podamos." },
        ],
      },
      {
        heading: "11. Cambios",
        blocks: [
          { kind: "p", html: "Podemos actualizar estos términos. Si un cambio te afecta de forma sustancial y tienes un plan activo, te escribiremos antes de que entre en vigor. Seguir usando el servicio después implica que aceptas los nuevos términos." },
        ],
      },
      {
        heading: "12. Contacto",
        blocks: [
          { kind: "p", html: '<a href="mailto:{support}">{support}</a>' },
        ],
      },
      {
        heading: "13. Ley aplicable",
        blocks: [
          { kind: "p", html: "Estos términos se rigen por la ley española. Si eres consumidor, esto no te priva de la protección de las normas imperativas de consumo del país donde resides: conservas esos derechos y puedes acudir a los tribunales de tu propio país." },
        ],
      },
    ],
  },

  privacy: {
    title: "Política de privacidad",
    metaDescription:
      "Qué guarda Mo Advice sobre quien envía y quien recibe, por qué quien recibe tiene la protección más estricta, quién trata datos por nosotros y cómo pedir que se borren los tuyos.",
    intro:
      "Mo Advice maneja datos de dos tipos de personas: quienes envían, que nos pagan, y quienes reciben, que nunca pidieron una cuenta. Quienes reciben tienen el trato más estricto.",
    sections: [
      {
        heading: "Qué recogemos",
        blocks: [
          { kind: "h3", text: "Si envías mensajes" },
          {
            kind: "ul",
            items: [
              "Tu dirección de correo, para recibos, confirmaciones y para entrar en tu cuenta.",
              "Tus pedidos y planes: qué tono, qué idioma, qué frecuencia, qué destinatario y cuándo.",
              "Un identificador de cliente de Stripe y los identificadores de suscripción. Nunca vemos ni almacenamos el número de tu tarjeta, su caducidad ni el CVC: eso va directo a Stripe.",
            ],
          },
          { kind: "h3", text: "Si recibes mensajes" },
          {
            kind: "ul",
            items: [
              "Tu dirección de correo.",
              "Un nombre, solo si quien envía lo facilitó.",
              "Un registro de qué mensajes se te enviaron y cuándo, para no repetir ninguno y para poder responder consultas de soporte.",
              "Un identificador de baja, para que el enlace de darse de baja funcione.",
            ],
          },
          { kind: "p", html: "Eso es todo. Sin píxeles de seguimiento en los mensajes, sin control de aperturas ni de clics, sin perfilado y sin redes publicitarias." },
          { kind: "p", html: "Sí registramos si un mensaje fue aceptado, entregado o rebotado, según nos lo comunica nuestro proveedor de correo, no por nada incrustado en el mensaje que abriste." },
        ],
      },
      {
        heading: "El anonimato funciona en una sola dirección",
        blocks: [
          { kind: "p", html: "Nosotros sabemos quién envió qué: no nos queda más remedio, para facturar y para atender denuncias de abuso. <strong>Quien recibe</strong> nunca conoce por nosotros la identidad de quien envía. No la revelamos aunque se nos pida, y los correos no contienen nada que identifique al remitente." },
          { kind: "p", html: "La única excepción es una orden legal válida o una denuncia creíble de que el servicio se está usando para acosar a alguien. Cumpliremos con la ley." },
        ],
      },
      {
        heading: "Qué no hacemos",
        blocks: [
          {
            kind: "ul",
            items: [
              "No vendemos, alquilamos ni compartimos datos personales con anunciantes.",
              "No usamos las direcciones de quienes reciben para marketing. El único correo que recibe una dirección son los mensajes que alguien pagó.",
              "No añadimos a nadie a ninguna lista de correo.",
            ],
          },
        ],
      },
      {
        heading: "Quién trata datos por nosotros",
        blocks: [
          {
            kind: "ul",
            items: [
              "<strong>Stripe</strong>: pagos, suscripciones y portal de facturación.",
              "<strong>Resend</strong>: entrega de correo.",
              "<strong>Vercel</strong>: alojamiento, tareas programadas y analítica web sin cookies.",
              "<strong>Nuestro proveedor de base de datos</strong>: Postgres, donde se guarda todo lo descrito arriba.",
            ],
          },
          { kind: "p", html: "Cada uno está sujeto a sus propias condiciones de tratamiento de datos. Los datos pueden tratarse en Estados Unidos y en la UE." },
        ],
      },
      {
        heading: "Cuánto tiempo lo guardamos",
        blocks: [
          {
            kind: "ul",
            items: [
              "Registros de pedidos y pagos: siete años, porque la normativa fiscal lo exige.",
              "Registros de entrega: dos años, y después se borran.",
              "Direcciones dadas de baja: se conservan de forma indefinida en una lista de supresión. Es deliberado: es la única manera de garantizar que nunca volvemos a enviar a esa dirección.",
            ],
          },
        ],
      },
      {
        heading: "Tus derechos",
        blocks: [
          { kind: "p", html: 'Según dónde vivas, puedes tener derecho a acceder, rectificar, exportar o suprimir tus datos personales, y a oponerte al tratamiento. Escribe a <a href="mailto:{support}">{support}</a> y lo atenderemos en un plazo de 30 días.' },
          { kind: "p", html: '<strong>Si recibes mensajes:</strong> lo más rápido es el enlace de baja al final de cualquier mensaje. Escribirnos también funciona, y te confirmaremos cuando esté hecho.' },
        ],
      },
      {
        heading: "Cookies y analítica",
        blocks: [
          { kind: "p", html: "Una cookie, para mantener la sesión iniciada en la cuenta de quien envía. Solo se activa después de usar un enlace de acceso y caduca. No hay cookies publicitarias ni nada que te siga a otros sitios." },
          { kind: "p", html: "Usamos <strong>Vercel Web Analytics</strong> para contar visitas y algunos pasos del formulario de envío. No usa cookies, no guarda nada en tu dispositivo y no crea perfiles ni te sigue entre sitios." },
          { kind: "p", html: "También ofrecemos <strong>Google Analytics</strong>, que sí usa cookies, así que solo se activa si aceptas el aviso. Si lo rechazas, no se guarda nada en tu dispositivo." },
          { kind: "p", html: "Esos eventos registran únicamente lo que se eligió: el plan, el tono y en qué paso del formulario. <strong>Nunca se incluye ninguna dirección de correo</strong>, ni la tuya ni, mucho menos, la de quien recibe, que no ha aceptado nada." },
        ],
      },
      {
        heading: "Menores",
        blocks: [
          { kind: "p", html: "El servicio no está dirigido a menores de 16 años. Si nos consta que tenemos datos de un menor, los borramos." },
        ],
      },
      {
        heading: "Contacto",
        blocks: [
          { kind: "p", html: '<a href="mailto:{support}">{support}</a>' },
          { kind: "p", html: "El responsable del tratamiento es {name} (NIF {nif}), {address}. Tratamos los datos de quien envía para ejecutar el contrato que ha celebrado, y los de quien recibe sobre la base de nuestro interés legítimo en entregar el mensaje que alguien ha pagado, ponderado frente a los intereses de esa persona mediante la baja en un clic presente en todos los mensajes y la supresión permanente que la sigue." },
          { kind: "p", html: 'Si estás en la UE o el Reino Unido y crees que hemos tratado mal tus datos, dínoslo primero, pero también tienes derecho a reclamar ante tu autoridad de protección de datos. En España es la <a href="https://www.aepd.es">AEPD</a>.' },
        ],
      },
    ],
  },

  contact: {
    title: "Contacto",
    metaDescription:
      "Contacta con Mo Advice: dejar de recibir mensajes, cancelar un plan diario, consultar un cobro o denunciar un mal uso. Un buzón, lo lee una persona y suele responderse en un día.",
    intro: "Un buzón, lo lee una persona y suele responderse en un día.",
    sections: [
      {
        heading: "Escríbenos",
        blocks: [{ kind: "p", html: '<a href="mailto:{support}">{support}</a>' }],
      },
      {
        heading: "Dirección postal",
        blocks: [
          { kind: "p", html: "Mo Advice es un nombre comercial de {name}, NIF {nif}." },
          { kind: "p", html: "{address}" },
          { kind: "p", html: "El correo electrónico llega mucho antes, pero esta es la dirección de la actividad si necesitas escribir." },
        ],
      },
      {
        heading: "Lo más habitual",
        blocks: [
          { kind: "h3", text: "Quiero dejar de recibir mensajes" },
          { kind: "p", html: 'Usa el enlace de baja al final de cualquier mensaje que hayas recibido: es inmediato y permanente. Si no lo encuentras, escríbenos desde la dirección que los está recibiendo y nos encargamos. También puedes <a href="{unsubscribeHref}">abrir la página de baja</a>.' },
          { kind: "h3", text: "Quiero cancelar un plan diario" },
          { kind: "p", html: 'Entra en <a href="{dashboardHref}">tu cuenta</a> con la dirección con la que pagaste y cancélalo ahí en un clic. No hace falta contraseña: te enviamos un enlace.' },
          { kind: "h3", text: "Me han cobrado dos veces" },
          { kind: "p", html: "Mándanos los cuatro últimos dígitos de la tarjeta y la fecha. Lo localizamos y lo devolvemos." },
          { kind: "h3", text: "Un mensaje no ha llegado nunca" },
          { kind: "p", html: "Mira primero la carpeta de spam de quien lo recibe: casi siempre es eso. Si de verdad falta, dinos la dirección y más o menos cuándo lo pediste, y lo reenviamos o lo devolvemos." },
          { kind: "h3", text: "Alguien está usando esto para molestarme" },
          { kind: "p", html: "Dínoslo y lo detendremos de inmediato y de forma permanente. Incluye el correo completo que recibiste y, si puedes conseguirlas, las cabeceras. Nos lo tomamos en serio: aquí el anonimato existe para la amabilidad, y expulsamos a quien abusa de él." },
        ],
      },
      {
        heading: "Prensa y colaboraciones",
        blocks: [
          { kind: "p", html: "La misma dirección. Cuéntanos en qué estás trabajando y te respondemos." },
        ],
      },
    ],
  },
};

export const legalCopy: Record<SiteLocale, LegalCopy> = { en, es };
