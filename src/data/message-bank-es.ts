/**
 * Mo Advice — el banco de mensajes en español.
 *
 * Escritos en español, no traducidos. Los mensajes en inglés viven en
 * `message-bank.ts` y ninguno de estos es su versión equivalente: el valor de
 * un mensaje está en el ritmo y en el registro, y una traducción los pierde
 * aunque el significado sobreviva. Por eso los slugs tampoco se corresponden.
 *
 * Normas de estilo (las mismas que en inglés, adaptadas):
 *  - Segunda persona del singular, tuteo. Se le habla a una sola persona real.
 *  - De dos a cuatro frases. Lo bastante largo para parecer pensado.
 *  - Concreto antes que grandilocuente. "Contestas a la pregunta que de verdad
 *    te han hecho" funciona; "eres increíble" no.
 *  - Reconocimiento, no halago. Nunca instrucciones.
 *  - Sin nombres, sin género gramatical marcado cuando se pueda evitar, sin dar
 *    por supuesto trabajo, familia, salud ni aspecto. Cada frase tiene que ser
 *    verdad para un desconocido.
 *
 * Registro: castellano neutro con tuteo, sin voseo y sin vosotros, para que
 * funcione tanto en España como en Latinoamérica.
 */

import type { MessageTemplateSeed } from "@/data/message-bank";

export const PROFESIONAL_MESSAGES: MessageTemplateSeed[] = [
  {
    slug: "es-pro-fiabilidad",
    category: "PROFESSIONAL",
    headline: "Si las cosas no se caen, es porque estás tú",
    body: "Hay un tipo de trabajo que solo se nota cuando deja de hacerse, y tú llevas mucho tiempo sin dejar de hacerlo. Los seguimientos, los cabos sueltos, aquello que recordaste y nadie más. No es vistoso y no es casualidad: es un listón que mantienes cuando nadie está mirando.",
  },
  {
    slug: "es-pro-calma",
    category: "PROFESSIONAL",
    headline: "Bajas la temperatura de una sala",
    body: "Cuando algo sale mal, la gente mira cómo reacciona la persona más serena. Esa persona has pasado a ser tú. Cueste lo que cueste sostenerlo por dentro, cambia la forma en que todos los demás encajan la misma mala noticia.",
  },
  {
    slug: "es-pro-merito",
    category: "PROFESSIONAL",
    headline: "Repartes el mérito sin que te cueste",
    body: "Dices quién ayudó, incluso cuando sería más cómodo dejar que se supusiera otra cosa. Es una costumbre menos común de lo que debería, y la gente la recuerda mucho más tiempo que el proyecto. Es la forma más barata de liderazgo y casi nadie la paga.",
  },
  {
    slug: "es-pro-claridad",
    category: "PROFESSIONAL",
    headline: "Haces sencillo lo complicado",
    body: "La claridad parece fácil desde fuera, y por eso nadie la agradece. Este año alguien leyó algo que escribiste y entendió por fin una cosa que llevaba meses fingiendo entender. Eso es trabajo de verdad, y lo haces bien.",
  },
  {
    slug: "es-pro-conversacion-dificil",
    category: "PROFESSIONAL",
    headline: "Dices lo difícil sin hacer daño",
    body: "Casi todo el mundo elige entre ser honesto y ser amable. Tú sigues encontrando la versión que es las dos cosas, y eso exige más cabeza y más valor que cualquiera de las dos por separado. Quien te ha oído decir la verdad se fía más de ti, no menos.",
  },
  {
    slug: "es-pro-mentoria",
    category: "PROFESSIONAL",
    headline: "Alguien hace mejor su trabajo gracias a ti",
    body: "Explicaste algo sin que la otra persona se sintiera pequeña por no saberlo. Hoy hace cosas que hace un año no habría podido hacer, y se lleva tu paciencia a la forma en que enseña a la siguiente. Muy poco de lo que construimos nos sobrevive. Eso sí.",
  },
  {
    slug: "es-pro-palabra",
    category: "PROFESSIONAL",
    headline: "Cuando dices que lo haces, se hace",
    body: "Puede que no lo consideres una habilidad. Lo es, y además es el criterio silencioso con el que la gente ordena a sus compañeros. Cada compromiso que has cumplido te ha comprado algo que no se compra de ninguna otra manera.",
  },
  {
    slug: "es-pro-listón",
    category: "PROFESSIONAL",
    headline: "No entregas nada de lo que te avergonzarías",
    body: "Sostener un estándar cansa, sobre todo cuando lo mediocre pasaría desapercibido. Pero el trabajo lleva tus huellas y se nota. Que nadie te convenza de dejar de preocuparte por ese último diez por ciento.",
  },
  {
    slug: "es-pro-escucha",
    category: "PROFESSIONAL",
    headline: "Contestas a la pregunta que de verdad te han hecho",
    body: "Escuchas más allá de la primera frase, hasta lo que a la otra persona le preocupa en realidad, y respondes a eso. Las reuniones duran menos y la gente sale más tranquila. Es una habilidad genuinamente rara y la usas a todas horas.",
  },
  {
    slug: "es-pro-iniciativa",
    category: "PROFESSIONAL",
    headline: "Coges cosas sin que nadie te las pida",
    body: "Hay una distancia entre lo que pone en tu puesto y lo que haces en realidad, y llevas tiempo cubriéndola. Nadie te la asignó: viste que importaba y empezaste. Ese instinto es toda la diferencia entre hacer un trabajo y hacerlo bien.",
  },
  {
    slug: "es-pro-errores",
    category: "PROFESSIONAL",
    headline: "Asumes los errores sin montar un drama",
    body: "Cuentas qué ha pasado, dices qué vas a cambiar y sigues trabajando. Sin defenderte y sin una disculpa tan larga que obligue a los demás a consolarte. Esa madurez profesional no la alcanza casi nadie.",
  },
  {
    slug: "es-pro-trabajo-invisible",
    category: "PROFESSIONAL",
    headline: "El trabajo aburrido que hiciste era el importante",
    body: "La limpieza, la documentación, la migración que no quería nadie. No va a salir en ningún resumen del año. Pero quitó un problema del futuro de otras personas, y ellas nunca sabrán lo cerca que estuvieron de él. Alguien se dio cuenta.",
  },
  {
    slug: "es-pro-creatividad",
    category: "PROFESSIONAL",
    headline: "Propones la opción que nadie había pensado",
    body: "Eres quien pregunta si la limitación es real. La mitad de las veces no lo es, y la conversación entera cambia. Sigue preguntándolo, incluso cuando la sala ya haya dado el asunto por cerrado.",
  },
  {
    slug: "es-pro-decidir",
    category: "PROFESSIONAL",
    headline: "Decides sin esperar a tenerlo todo claro",
    body: "Esperar parece prudente y cuesta carísimo. Tienes buen olfato para saber cuándo analizar más deja de ayudar, y estás dispuesto a responder de la decisión. Esa es la parte del criterio que no se puede enseñar.",
  },
  {
    slug: "es-pro-tiempo-ajeno",
    category: "PROFESSIONAL",
    headline: "Cuidas el tiempo de los demás",
    body: "Llegas preparado, no alargas las conversaciones y no añades cosas al montón de nadie sin un motivo. Suena a poco. Multiplícalo por toda la gente con la que trabajas y es un regalo considerable.",
  },
  {
    slug: "es-pro-constancia",
    category: "PROFESSIONAL",
    headline: "Eres el mismo en una semana mala",
    body: "La constancia está infravalorada porque no hace ruido. La gente sabe lo que va a encontrarse contigo, así que puede planificar, relajarse y confiar. Esa previsibilidad es un suelo sobre el que otros están de pie.",
  },
  {
    slug: "es-pro-preguntar",
    category: "PROFESSIONAL",
    headline: "Preguntas lo que a los demás les da vergüenza preguntar",
    body: "Cada vez que dices \"¿puedes explicarlo otra vez?\" rescatas a tres personas más de la sala. Hace falta seguridad para ser quien admite la laguna. Y además, discretamente, mejora la calidad de todas las decisiones que vienen después.",
  },
  {
    slug: "es-pro-acogida",
    category: "PROFESSIONAL",
    headline: "Haces que quien llega nuevo se sienta de la casa",
    body: "Las primeras semanas en un sitio son solitarias y desorientan, y tú se las acortaste a alguien. Contestaste lo que le daba apuro preguntar y le diste el contexto que no está escrito en ninguna parte. Lo pasará adelante sin recordar dónde lo aprendió.",
  },
  {
    slug: "es-pro-decir-no",
    category: "PROFESSIONAL",
    headline: "Has aprendido a decir que no como se debe",
    body: "Ni una negativa seca ni un sí resentido: un no claro, con un motivo y, cuando puedes, con una alternativa. Protege tu trabajo y respeta a la otra persona. Te ha costado llegar hasta aquí. Ha merecido la pena.",
  },
  {
    slug: "es-pro-fracaso",
    category: "PROFESSIONAL",
    headline: "Lo que salió mal no fue tiempo perdido",
    body: "Pusiste esfuerzo de verdad en algo que acabó mal, y aun así volviste. Diga lo que diga la columna de resultados, ahora sabes cosas que un éxito no te habría enseñado. Dale algo de tiempo y se convierte en tu ventaja.",
  },
  {
    slug: "es-pro-humor",
    category: "PROFESSIONAL",
    headline: "Haces más llevadero un día duro",
    body: "Tienes la costumbre de encontrar lo gracioso justo cuando la sala lo necesita, y nunca a costa de nadie. No es una distracción del trabajo. En una semana difícil es lo que mantiene a la gente en la sala.",
  },
  {
    slug: "es-pro-presencia",
    category: "PROFESSIONAL",
    headline: "Estás de verdad, trabajes desde donde trabajes",
    body: "La atención se ha vuelto escasa. Tú la sigues dando entera: no estás a medias en otra ventana mientras alguien habla. Se nota, y es una de las razones por las que te traen los problemas de verdad.",
  },
  {
    slug: "es-pro-curiosidad",
    category: "PROFESSIONAL",
    headline: "Sigues teniendo curiosidad y se te nota",
    body: "A estas alturas sería fácil vivir de lo que ya sabes. En vez de eso sigues preguntando cómo funcionan las cosas de verdad, incluso las que no son cosa tuya. Por esa curiosidad tu criterio sigue mejorando mientras el de otros se estanca.",
  },
  {
    slug: "es-pro-critica",
    category: "PROFESSIONAL",
    headline: "Encajas las críticas como un profesional",
    body: "Las escuchas enteras antes de decidir qué hacer con ellas, y no haces que quien te las dio se arrepienta de haberlo intentado. Por eso la gente te sigue diciendo la verdad, y que te digan la verdad es una ventaja profesional que muchos destruyen sin darse cuenta.",
  },
  {
    slug: "es-pro-defender",
    category: "PROFESSIONAL",
    headline: "Defendiste a alguien que no estaba delante",
    body: "Sostuviste una decisión, un nombre o a una persona cuando no ganabas nada con ello. Esos momentos casi nunca le llegan a quien protegiste. Contaron igual.",
  },
  {
    slug: "es-pro-sin-reconocer",
    category: "PROFESSIONAL",
    headline: "Haces más de lo que dice tu puesto",
    body: "La distancia entre lo que llevas encima y lo que te reconocen es real, y es frustrante. No confundas una organización lenta con un veredicto sobre tu trabajo. Quien trabaja a tu lado sabe perfectamente lo que estás sosteniendo.",
  },
  {
    slug: "es-pro-detalle",
    category: "PROFESSIONAL",
    headline: "Ves lo que los demás pasan por alto",
    body: "El número equivocado, la frase que se podía malinterpretar, la suposición que nadie comprobó. Cada una de esas fue un pequeño desastre que no llegó a ocurrir. Es un logro extraño: invisible por definición, y completamente real.",
  },
  {
    slug: "es-pro-cambiar-opinion",
    category: "PROFESSIONAL",
    headline: "Sabes cambiar de opinión delante de la gente",
    body: "Has defendido una postura, has oído una mejor y lo has dicho en voz alta. La mayoría se atrinchera para no perder posición. Lo que haces tú es lo que de verdad hace que un equipo sea más listo con el tiempo.",
  },
  {
    slug: "es-pro-primer-borrador",
    category: "PROFESSIONAL",
    headline: "Empiezas antes de tenerlo claro",
    body: "Estás dispuesto a hacer la primera versión mala, esa que se equivoca de forma útil y le da a todo el mundo algo con lo que discutir. Mejorar un borrador sabe hacerlo mucha gente. Arriesgarse a escribirlo, bastante menos.",
  },
  {
    slug: "es-pro-mitad",
    category: "PROFESSIONAL",
    headline: "Estás en la mitad ingrata y sigues ahí",
    body: "El principio de un proyecto tiene energía y el final tiene aplausos. La mitad no tiene ninguna de las dos cosas, y ahí es donde estás ahora. Aguantar esta parte es toda la habilidad. Parecerá obvio visto desde el final, y no lo es desde aquí.",
  },
  {
    slug: "es-pro-descansar",
    category: "PROFESSIONAL",
    headline: "Tu trabajo aguanta que descanses",
    body: "Has construido algo que no exige que estés disponible siempre, aunque la costumbre diga lo contrario. Desconectar no es un riesgo para tu reputación. La calidad de lo que haces nunca ha salido de las horas de los bordes.",
  },
  {
    slug: "es-pro-integridad",
    category: "PROFESSIONAL",
    headline: "Lo haces bien cuando nadie se enteraría",
    body: "Has tenido atajos a mano que nadie habría detectado. No los cogiste. Eso es exactamente lo que significa la palabra integridad, y la gastas a diario sin ponerle nombre.",
  },
];

export const PERSONAL_MESSAGES: MessageTemplateSeed[] = [
  {
    slug: "es-per-refugio",
    category: "PERSONAL",
    headline: "Eres el sitio seguro de alguien",
    body: "Hay una persona que piensa en ti cuando algo va mal, antes incluso de pensar qué hacer. Puede que nunca te lo diga. Es de las cosas más altas que un ser humano puede ser para otro.",
  },
  {
    slug: "es-per-bondad-sin-testigos",
    category: "PERSONAL",
    headline: "Lo que haces sin testigos también cuenta",
    body: "El mensaje que mandaste, lo que notaste, la molestia que te tomaste por alguien que no podía devolvértelo. Nada de eso se hizo para una audiencia. Justo por eso es carácter y no modales.",
  },
  {
    slug: "es-per-resistencia",
    category: "PERSONAL",
    headline: "Ya has sobrevivido a lo que creías que te rompería",
    body: "Mira unos años atrás. Había una versión de ti que no se imaginaba superando aquello que ya has superado. Lo hiciste igualmente, sin ningún brillo, un día corriente detrás de otro. Así es exactamente como vas a superar lo siguiente.",
  },
  {
    slug: "es-per-escuchar",
    category: "PERSONAL",
    headline: "Escuchas sin esperar tu turno",
    body: "Dejas que la gente termine. No te lanzas a arreglarlo ni a llevártelo a tu propia historia. Es una generosidad pequeña y disciplinada, y quien la recibe se siente raro de una forma que probablemente no sepa explicar.",
  },
  {
    slug: "es-per-trato-contigo",
    category: "PERSONAL",
    headline: "Háblate como le hablas a tus amigos",
    body: "Repartes una cantidad enorme de paciencia hacia fuera y casi nada hacia dentro. Si un amigo te contara tu semana, no lo llamarías vago ni le dirías que va tarde. Le dirías que lo está haciendo lo mejor que puede en una racha difícil. Eso también es verdad cuando se trata de ti.",
  },
  {
    slug: "es-per-aparecer",
    category: "PERSONAL",
    headline: "Apareces, y eso es casi todo",
    body: "No con las palabras perfectas, que no las tiene nadie. Simplemente fuiste, te sentaste, condujiste, llamaste, te quedaste. La gente recuerda con una claridad que no se borra quién estuvo de verdad, y tú estás en esa lista de más de una persona.",
  },
  {
    slug: "es-per-confianza",
    category: "PERSONAL",
    headline: "A ti te cuentan la versión de verdad",
    body: "Hay amigos que te dicen cosas que no han dicho en voz alta en ningún otro sitio. No es suerte. Es que nunca has hecho que nadie se sienta ridículo por ser sincero contigo.",
  },
  {
    slug: "es-per-constancia-pequena",
    category: "PERSONAL",
    headline: "Eso pequeño que repites está funcionando",
    body: "La costumbre que parece demasiado menor para importar: el paseo, el rato de práctica, acostarte pronto, aquello que retomaste después de dejarlo. A esta escala el avance es invisible cada día e innegable en un año. Estás más lejos de lo que se nota desde aquí.",
  },
  {
    slug: "es-per-empezar-de-nuevo",
    category: "PERSONAL",
    headline: "Volver a empezar no es empezar de cero",
    body: "Llevas encima todo lo que aprendiste la primera vez, aunque el marcador parezca puesto a cero. Empezar otra vez con los ojos abiertos exige más valor que empezar la primera, cuando no sabías lo que te iba a pedir.",
  },
  {
    slug: "es-per-fijarse",
    category: "PERSONAL",
    headline: "Te fijas en la gente",
    body: "Te acuerdas de la cita, del aniversario, de aquello que ponía nervioso a alguien. Que se fijen en uno es de las necesidades humanas más hondas y casi todos pasamos días sin ella. Tú la repartes sin parar y no le das ninguna importancia.",
  },
  {
    slug: "es-per-perdonar",
    category: "PERSONAL",
    headline: "Dejas que la gente sea más que su peor día",
    body: "Le has dado una segunda oportunidad a alguien que la necesitaba de verdad, y después no se la echaste en cara. Es una manera generosa de moverse por el mundo, y dice más de tu carácter que del suyo.",
  },
  {
    slug: "es-per-valor-callado",
    category: "PERSONAL",
    headline: "Aquello tuvo más mérito del que pareció",
    body: "La conversación que por fin tuviste, la puerta que cerraste, lo que admitiste. Desde fuera pudo parecer un martes cualquiera. Tú sabes lo que costó. Contó.",
  },
  {
    slug: "es-per-cumplir",
    category: "PERSONAL",
    headline: "Tu palabra vale",
    body: "Cuando dices que vas a estar, estás. Suena a mínimo, y no lo es: mucha gente trata los planes como algo provisional. Ser alguien cuyo sí es de fiar te vuelve un descanso poco común para quien está cerca.",
  },
  {
    slug: "es-per-cuidar",
    category: "PERSONAL",
    headline: "El cuidado que estás dando no pasa desapercibido",
    body: "Cuidar de alguien es sobre todo repetición y logística, y casi nada de eso parece importante mientras ocurre. Desde fuera es una de las cosas más decentes en las que una persona puede gastar su vida. Come algo y siéntate diez minutos, por favor.",
  },
  {
    slug: "es-per-compania",
    category: "PERSONAL",
    headline: "La gente se relaja contigo",
    body: "Hay una comodidad concreta en estar con alguien que no te está juzgando, y tú la produces sin esfuerzo. Tus amigos se parecen más a sí mismos cuando están cerca de ti. No es poca cosa poder hacerle eso a alguien.",
  },
  {
    slug: "es-per-querer-cosas",
    category: "PERSONAL",
    headline: "Tienes permiso para querer cosas",
    body: "En algún momento querer empezó a dar vergüenza o miedo, y te hiciste experto en necesitar poco. Aquello que llevas años queriendo en voz baja sigue siendo algo legítimo de querer. Nada de ser adulto exigía que renunciaras a ello.",
  },
  {
    slug: "es-per-quedarse",
    category: "PERSONAL",
    headline: "Te quedas",
    body: "Te has quedado en los tramos aburridos y en los difíciles, con personas y con compromisos. La lealtad recibe mucho menos crédito que el carisma y construye todo lo que de verdad dura.",
  },
  {
    slug: "es-per-crecer",
    category: "PERSONAL",
    headline: "Cambiaste, y no hizo falta anunciarlo",
    body: "No eres la misma persona que hace cinco años en algo concreto en lo que trabajaste mucho. Nadie te hizo una fiesta por ello. Ese cambio es real, y quien te tiene cerca lo nota aunque nunca lo haya mencionado.",
  },
  {
    slug: "es-per-sensibilidad",
    category: "PERSONAL",
    headline: "Ser sensible no es tu punto débil",
    body: "Te han dicho, con palabras o sin ellas, que lo sientes todo demasiado. Es exactamente por eso por lo que la gente acude a ti. Seguir abierto en un mundo que premia la coraza no es ingenuidad: es una decisión que tomas cada día y que cuesta algo.",
  },
  {
    slug: "es-per-limites",
    category: "PERSONAL",
    headline: "Tienes permiso para decepcionar a alguien",
    body: "Puedes decir que no a algo que va a vaciarte y seguir siendo buena persona. Quien merezca la pena seguirá ahí después. El alivio que hay al otro lado de esa frase es mayor de lo que esperas.",
  },
  {
    slug: "es-per-descanso",
    category: "PERSONAL",
    headline: "El descanso no es un premio que haya que ganarse",
    body: "Estás tratando el descanso como algo que se desbloquea cuando la lista esté terminada, y la lista no va a terminarse nunca. Tienes permiso para parar con cosas a medias. Es la única forma en que alguien para alguna vez.",
  },
  {
    slug: "es-per-paciencia",
    category: "PERSONAL",
    headline: "Le das espacio a la gente",
    body: "No metes prisa a nadie en su duelo, en sus dudas ni en su racha lenta. Acompañar a alguien mientras se toma su tiempo es incómodo, y aun así lo haces. Muy poca gente aguanta esa incomodidad en nombre de otro.",
  },
  {
    slug: "es-per-gracia",
    category: "PERSONAL",
    headline: "Tienes gracia de verdad",
    body: "No actuando, ni buscando material: gracioso de verdad, en el momento, sobre lo que hay delante. Has sacado a gente de semanas bastante malas así, incluidas algunas de las que nunca te enteraste.",
  },
  {
    slug: "es-per-irse",
    category: "PERSONAL",
    headline: "Te fuiste de algo que te estaba desgastando",
    body: "Dejar un trabajo, una amistad o una versión de tu vida que había dejado de hacerte bien no es fracasar. Es una de las formas más difíciles de respeto propio, y casi nadie la aplaude cuando ocurre. Hiciste lo que había que hacer.",
  },
  {
    slug: "es-per-cuidado-de-otros",
    category: "PERSONAL",
    headline: "Quien está a tu cargo está a salvo contigo",
    body: "Puede que gastes mucha energía en todo lo que hoy no conseguiste hacer. Lo que la gente que tienes cerca está absorbiendo en realidad es que eres estable, que vuelves y que estás de su lado. Esa es la parte que los forma.",
  },
  {
    slug: "es-per-soledad",
    category: "PERSONAL",
    headline: "Esta racha no es para siempre",
    body: "Si ha sido una temporada solitaria, eso es una circunstancia y no un veredicto sobre ti. Las salas cambian, las ciudades cambian, aparece gente. Ya has estado en una versión de esto antes y acabó moviéndose.",
  },
  {
    slug: "es-per-suficiente",
    category: "PERSONAL",
    headline: "No hace falta que impresiones para merecer la pena",
    body: "A quien te quiere no lo convencieron tus logros y no lo desconvencería su ausencia. Podrías pasar un año sin hacer nada destacable y seguirías valiendo exactamente lo mismo para esa gente. Eso es lo que significa que te conozcan de verdad.",
  },
  {
    slug: "es-per-generosidad",
    category: "PERSONAL",
    headline: "Das más de lo que cuentas",
    body: "Dinero, tiempo, atención, favores que no volviste a mencionar. Lo haces sin llevar la cuenta, que es la única forma de dar que cuenta. Le ha hecho la vida más fácil a más gente de la que te imaginas.",
  },
  {
    slug: "es-per-coherencia",
    category: "PERSONAL",
    headline: "Eres el mismo en todas las salas",
    body: "No tienes un yo distinto para cada público, y no dices por detrás lo que no dirías por delante. Eso te convierte en una compañía tranquila, y es la razón por la que la gente te cree.",
  },
  {
    slug: "es-per-pedir-ayuda",
    category: "PERSONAL",
    headline: "Pedir ayuda está permitido",
    body: "Has cargado con mucho tú solo, en parte por costumbre y en parte por no ser una molestia. Quien te quiere preferiría con diferencia que se lo pidieras a enterarse después. Dejarse ayudar también es un regalo para el otro.",
  },
  {
    slug: "es-per-aficion",
    category: "PERSONAL",
    headline: "Eso que te gusta merece la pena",
    body: "Ese interés por el que casi pides perdón, el que no sirve para nada y no escala. Es de las cosas genuinamente interesantes que tienes. Puedes dedicarle un sábado sin justificárselo a nadie.",
  },
  {
    slug: "es-per-duelo",
    category: "PERSONAL",
    headline: "Lo estás haciendo mejor de lo que crees",
    body: "Si ahora mismo llegas al final del día, eso ya es el logro, y no tiene que parecerse a nada más. Para esto no hay calendario. Nadie te está puntuando.",
  },
];

export const MESSAGE_BANK_ES: MessageTemplateSeed[] = [
  ...PROFESIONAL_MESSAGES,
  ...PERSONAL_MESSAGES,
];

/** Asuntos rotativos, igual de anónimos que los ingleses. */
export const SUBJECT_LINES_ES = [
  "Alguien quería que leyeras esto",
  "Unas palabras para ti, de alguien que las piensa de verdad",
  "Alguien se ha acordado hoy de ti",
  "Esto lo escribieron pensando en ti",
  "Algo que alguien quería que supieras",
] as const;
