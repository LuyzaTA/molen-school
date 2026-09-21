// ============================================================
// Inburgeren (Dutch civic integration exam) module content.
// Facts about the exam come from DUO's official site
// inburgeren.nl ("Taking the integration exam" and its sub-pages),
// checked September 2026. Rules change — the page always links to
// the official source and tells learners to confirm in Mijn Inburgering.
// Text is bilingual (en/pt) so the learner's support language is used.
// ============================================================

export interface Bilingual {
  en: string;
  pt: string;
}

export const INBURGEREN_SOURCE = "https://www.inburgeren.nl/en/taking-the-integration-exam/";

export interface ExamPart {
  code: string; // short tag
  nl: string; // Dutch name
  name: Bilingual;
  what: Bilingual;
  format: Bilingual; // format/duration, per the official site
  practiceTopic?: string; // exam-prep class topic for this part
}

export const EXAM_PARTS: ExamPart[] = [
  {
    code: "LZ",
    nl: "Lezen",
    name: { en: "Reading", pt: "Leitura" },
    what: {
      en: "Read short everyday texts — letters, notices, websites — and answer questions.",
      pt: "Ler textos curtos do dia a dia — cartas, avisos, sites — e responder perguntas.",
    },
    format: {
      en: "A2: on a computer, 65 minutes. B1: 110 minutes · B2: 100 minutes (State Exam NT2).",
      pt: "A2: no computador, 65 minutos. B1: 110 minutos · B2: 100 minutos (Exame Estatal NT2).",
    },
    practiceTopic: "Inburgeren — Lezen: brieven en berichten",
  },
  {
    code: "LU",
    nl: "Luisteren",
    name: { en: "Listening", pt: "Compreensão auditiva" },
    what: {
      en: "Watch short films and listen to texts, then answer questions about them.",
      pt: "Assistir a filmes curtos e ouvir textos, depois responder perguntas sobre eles.",
    },
    format: {
      en: "A2: on a computer, 45 minutes. B1 and B2: 90 minutes (State Exam NT2).",
      pt: "A2: no computador, 45 minutos. B1 e B2: 90 minutos (Exame Estatal NT2).",
    },
    practiceTopic: "Inburgeren — Luisteren: dagelijkse situaties",
  },
  {
    code: "SC",
    nl: "Schrijven",
    name: { en: "Writing", pt: "Escrita" },
    what: {
      en: "Write short texts such as a letter or message, or fill in a form.",
      pt: "Escrever textos curtos, como uma carta ou mensagem, ou preencher um formulário.",
    },
    format: {
      en: "A2: pen and paper, 40 minutes, 4 assignments. B1 and B2: 100 minutes (State Exam NT2).",
      pt: "A2: papel e caneta, 40 minutos, 4 tarefas. B1 e B2: 100 minutos (Exame Estatal NT2).",
    },
    practiceTopic: "Inburgeren — Schrijven: formulier en korte brief",
  },
  {
    code: "SP",
    nl: "Spreken",
    name: { en: "Speaking", pt: "Fala" },
    what: {
      en: "Watch short films and answer questions out loud about everyday situations.",
      pt: "Assistir a filmes curtos e responder em voz alta a perguntas sobre situações do dia a dia.",
    },
    format: {
      en: "A2: on a computer, 35 minutes. B1 and B2: about 30 minutes (State Exam NT2).",
      pt: "A2: no computador, 35 minutos. B1 e B2: cerca de 30 minutos (Exame Estatal NT2).",
    },
    practiceTopic: "Inburgeren — Spreken: vragen over jezelf",
  },
  {
    code: "KNM",
    nl: "Kennis van de Nederlandse Maatschappij",
    name: { en: "Knowledge of Dutch Society", pt: "Conhecimento da Sociedade Holandesa" },
    what: {
      en: "Questions about life in the Netherlands, grouped by theme — for example 'wonen' (housing) or 'werk en inkomen' (work and income).",
      pt: "Perguntas sobre a vida na Holanda, agrupadas por tema — por exemplo 'wonen' (moradia) ou 'werk en inkomen' (trabalho e renda).",
    },
    format: {
      en: "On a computer, 45 minutes.",
      pt: "No computador, 45 minutos.",
    },
  },
  {
    code: "ONA",
    nl: "Oriëntatie op de Nederlandse Arbeidsmarkt",
    name: { en: "Orientation on the Dutch Labour Market", pt: "Orientação sobre o Mercado de Trabalho Holandês" },
    what: {
      en: "A portfolio of assignments about work, plus either a 64-hour ONA course or a final interview.",
      pt: "Um portfólio de tarefas sobre trabalho, mais um curso ONA de 64 horas ou uma entrevista final.",
    },
    format: {
      en: "Portfolio check takes up to 6 weeks. Final interview: about 30 minutes with 2 DUO staff members. Exam fee €40. Result within 8 weeks.",
      pt: "A análise do portfólio leva até 6 semanas. Entrevista final: cerca de 30 minutos com 2 funcionários do DUO. Taxa de €40. Resultado em até 8 semanas.",
    },
    practiceTopic: "Inburgeren — ONA: werk zoeken en solliciteren",
  },
  {
    code: "PVT",
    nl: "Participatieverklaringstraject",
    name: { en: "Participation Statement process", pt: "Processo da Declaração de Participação" },
    what: {
      en: "Learn core Dutch values — such as equality, freedom of religion, and non-discrimination — and sign a statement that you will actively participate in Dutch society.",
      pt: "Conhecer valores fundamentais holandeses — como igualdade, liberdade religiosa e não discriminação — e assinar uma declaração de que você vai participar ativamente da sociedade holandesa.",
    },
    format: {
      en: "Arranged by your municipality (gemeente), which informs DUO (about 3 weeks).",
      pt: "Organizado pelo seu município (gemeente), que informa o DUO (cerca de 3 semanas).",
    },
  },
];

/** Which exams apply, by the date the integration requirement started. */
export const REQUIRED_BY_DATE: { since: Bilingual; parts: string[] }[] = [
  {
    since: { en: "Required to integrate from 1 October 2017", pt: "Obrigação de integração a partir de 1 de outubro de 2017" },
    parts: ["LZ", "LU", "SC", "SP", "KNM", "ONA", "PVT"],
  },
  {
    since: { en: "Between 1 January 2015 and 1 October 2017", pt: "Entre 1 de janeiro de 2015 e 1 de outubro de 2017" },
    parts: ["LZ", "LU", "SC", "SP", "KNM", "ONA"],
  },
  {
    since: { en: "Between 1 January 2013 and 1 January 2015", pt: "Entre 1 de janeiro de 2013 e 1 de janeiro de 2015" },
    parts: ["LZ", "LU", "SC", "SP", "KNM"],
  },
];

/** KNM themes used for exam-prep classes. */
export const KNM_THEMES: { nl: string; name: Bilingual }[] = [
  { nl: "Werk en inkomen", name: { en: "Work and income", pt: "Trabalho e renda" } },
  { nl: "Wonen", name: { en: "Housing", pt: "Moradia" } },
  { nl: "Gezondheid en zorg", name: { en: "Health and healthcare", pt: "Saúde e assistência médica" } },
  { nl: "Onderwijs en opvoeding", name: { en: "Education and parenting", pt: "Educação e criação dos filhos" } },
  { nl: "Instanties", name: { en: "Public organisations", pt: "Órgãos públicos" } },
  { nl: "Staatsinrichting en rechtsstaat", name: { en: "Government and the rule of law", pt: "Estado e Estado de direito" } },
  { nl: "Geschiedenis en geografie", name: { en: "History and geography", pt: "História e geografia" } },
  { nl: "Omgangsvormen, waarden en normen", name: { en: "Customs, values and norms", pt: "Costumes, valores e normas" } },
];

export const KNM_TOPIC_PREFIX = "Inburgeren — KNM: ";

/** Exam-prep topics shown in the Dutch class picker. */
export const INBURGEREN_TOPICS: string[] = [
  ...EXAM_PARTS.flatMap((p) => (p.practiceTopic ? [p.practiceTopic] : [])),
  ...KNM_THEMES.map((t) => KNM_TOPIC_PREFIX + t.nl),
];

export function isInburgerenTopic(topic: string): boolean {
  return topic.trim().toLowerCase().startsWith("inburgeren");
}

/** Practical steps, per the official "Registering" and "Results" pages. */
export const PRACTICAL: Bilingual[] = [
  {
    en: "KNM, ONA and the A2 language exams: log in to Mijn Inburgering (with DigiD), then choose a date and location.",
    pt: "KNM, ONA e os exames de língua A2: entre no Mijn Inburgering (com DigiD) e escolha data e local.",
  },
  {
    en: "B1/B2 language exams are the State Exam Dutch as a Second Language (Staatsexamen NT2).",
    pt: "Os exames de língua B1/B2 são o Exame Estatal de Holandês como Segunda Língua (Staatsexamen NT2).",
  },
  {
    en: "The participation statement (PVT) is arranged with your municipality (gemeente).",
    pt: "A declaração de participação (PVT) é feita com o seu município (gemeente).",
  },
  {
    en: "Register in time: it can take more than 6 weeks before you can take an exam.",
    pt: "Inscreva-se com antecedência: pode levar mais de 6 semanas até você conseguir fazer o exame.",
  },
  {
    en: "You can change or cancel until 1 week before the exam. DUO sends a letter 1 week before with the date, time and place.",
    pt: "Você pode alterar ou cancelar até 1 semana antes do exame. O DUO envia uma carta 1 semana antes com data, hora e local.",
  },
  {
    en: "Results for KNM and the A2 exams arrive by letter within 8 weeks, and appear in Mijn Inburgering.",
    pt: "Os resultados do KNM e dos exames A2 chegam por carta em até 8 semanas e aparecem no Mijn Inburgering.",
  },
];

export const OFFICIAL_LINKS: { label: Bilingual; url: string }[] = [
  {
    label: { en: "Official practice exams (A2 language + KNM)", pt: "Simulados oficiais (língua A2 + KNM)" },
    url: "https://www.inburgeren.nl/en/taking-the-integration-exam/practicing.jsp",
  },
  {
    label: { en: "Which exams you take", pt: "Quais exames você faz" },
    url: INBURGEREN_SOURCE,
  },
  {
    label: { en: "Registering for an exam", pt: "Inscrição no exame" },
    url: "https://www.inburgeren.nl/en/taking-the-integration-exam/registering.jsp",
  },
  {
    label: { en: "Fewer or no exams (exemptions)", pt: "Menos ou nenhum exame (dispensas)" },
    url: "https://www.inburgeren.nl/en/fewer-or-no-exams/index.jsp",
  },
  {
    label: { en: "State Exam NT2 (B1/B2) — what the exam looks like", pt: "Exame Estatal NT2 (B1/B2) — como é o exame" },
    url: "https://www.staatsexamensnt2.nl/voorbereiden/hoe-ziet-het-examen-eruit",
  },
  {
    label: { en: "Oefenen.nl — free practice lessons", pt: "Oefenen.nl — aulas de prática gratuitas" },
    url: "https://oefenen.nl/",
  },
];

// ---- KNM practice quiz -------------------------------------
// Well-established facts only. Questions and options in simple Dutch,
// with a support-language translation and explanation.

export interface KnmQuestion {
  theme: string; // KNM theme (Dutch)
  question: string;
  translation: Bilingual;
  options: string[];
  answer: number;
  explain: Bilingual;
}

export const KNM_QUIZ: KnmQuestion[] = [
  {
    theme: "Gezondheid en zorg",
    question: "Er is brand in je huis. Welk nummer bel je?",
    translation: { en: "There is a fire in your house. Which number do you call?", pt: "Há um incêndio na sua casa. Para qual número você liga?" },
    options: ["112", "911", "190"],
    answer: 0,
    explain: { en: "112 is the emergency number for police, fire brigade and ambulance.", pt: "112 é o número de emergência para polícia, bombeiros e ambulância." },
  },
  {
    theme: "Gezondheid en zorg",
    question: "Je bent ziek, maar het is geen spoed. Naar wie ga je eerst?",
    translation: { en: "You are ill, but it is not an emergency. Who do you go to first?", pt: "Você está doente, mas não é emergência. A quem você procura primeiro?" },
    options: ["Naar het ziekenhuis", "Naar de huisarts", "Naar de apotheek"],
    answer: 1,
    explain: { en: "The GP (huisarts) is the first point of contact; they refer you to a hospital if needed.", pt: "O clínico geral (huisarts) é o primeiro contato; ele encaminha ao hospital se necessário." },
  },
  {
    theme: "Gezondheid en zorg",
    question: "Welke verzekering is verplicht voor iedereen die in Nederland woont?",
    translation: { en: "Which insurance is compulsory for everyone who lives in the Netherlands?", pt: "Qual seguro é obrigatório para todos que moram na Holanda?" },
    options: ["De zorgverzekering", "De autoverzekering", "De reisverzekering"],
    answer: 0,
    explain: { en: "Basic health insurance (basisverzekering) is compulsory.", pt: "O seguro-saúde básico (basisverzekering) é obrigatório." },
  },
  {
    theme: "Wonen",
    question: "Je gaat in een andere gemeente wonen. Waar geef je je nieuwe adres door?",
    translation: { en: "You move to another municipality. Where do you register your new address?", pt: "Você vai morar em outro município. Onde você informa seu novo endereço?" },
    options: ["Bij de politie", "Bij de gemeente", "Bij de huisbaas"],
    answer: 1,
    explain: { en: "You register your address with the municipality (gemeente).", pt: "Você registra seu endereço no município (gemeente)." },
  },
  {
    theme: "Onderwijs en opvoeding",
    question: "Vanaf welke leeftijd moeten kinderen naar school?",
    translation: { en: "From what age must children go to school?", pt: "A partir de que idade as crianças devem ir à escola?" },
    options: ["Vanaf 4 jaar", "Vanaf 5 jaar", "Vanaf 6 jaar"],
    answer: 1,
    explain: { en: "Compulsory education (leerplicht) starts at age 5. Most children already start at 4.", pt: "A escolaridade obrigatória (leerplicht) começa aos 5 anos. A maioria das crianças já começa aos 4." },
  },
  {
    theme: "Staatsinrichting en rechtsstaat",
    question: "Hoe heet het Nederlandse parlement?",
    translation: { en: "What is the Dutch parliament called?", pt: "Como se chama o parlamento holandês?" },
    options: ["De Staten-Generaal", "Het Kabinet", "De Raad van State"],
    answer: 0,
    explain: { en: "The Staten-Generaal: the Eerste Kamer (Senate) and the Tweede Kamer (House of Representatives).", pt: "Os Staten-Generaal: a Eerste Kamer (Senado) e a Tweede Kamer (Câmara dos Deputados)." },
  },
  {
    theme: "Staatsinrichting en rechtsstaat",
    question: "Wie leidt de regering?",
    translation: { en: "Who leads the government?", pt: "Quem lidera o governo?" },
    options: ["De koning", "De burgemeester", "De minister-president"],
    answer: 2,
    explain: { en: "The prime minister (minister-president) leads the cabinet. The King is head of state.", pt: "O primeiro-ministro (minister-president) lidera o gabinete. O Rei é o chefe de Estado." },
  },
  {
    theme: "Staatsinrichting en rechtsstaat",
    question: "Artikel 1 van de Grondwet gaat over…",
    translation: { en: "Article 1 of the Constitution is about…", pt: "O Artigo 1 da Constituição trata de…" },
    options: ["Belasting betalen", "Gelijke behandeling en het verbod op discriminatie", "Het koningshuis"],
    answer: 1,
    explain: { en: "Article 1: everyone in the Netherlands is treated equally in equal cases; discrimination is not allowed.", pt: "Artigo 1: todos na Holanda são tratados igualmente em casos iguais; a discriminação é proibida." },
  },
  {
    theme: "Geschiedenis en geografie",
    question: "Wat is de hoofdstad van Nederland?",
    translation: { en: "What is the capital of the Netherlands?", pt: "Qual é a capital da Holanda?" },
    options: ["Den Haag", "Rotterdam", "Amsterdam"],
    answer: 2,
    explain: { en: "Amsterdam is the capital. The government and parliament sit in The Hague (Den Haag).", pt: "Amsterdã é a capital. O governo e o parlamento ficam em Haia (Den Haag)." },
  },
  {
    theme: "Geschiedenis en geografie",
    question: "Op welke dag is Koningsdag?",
    translation: { en: "On which day is King's Day?", pt: "Em que dia é o Dia do Rei?" },
    options: ["27 april", "5 mei", "5 december"],
    answer: 0,
    explain: { en: "King's Day is on 27 April (26 April when the 27th falls on a Sunday). 5 May is Liberation Day.", pt: "O Dia do Rei é 27 de abril (26 quando o dia 27 cai num domingo). 5 de maio é o Dia da Libertação." },
  },
  {
    theme: "Werk en inkomen",
    question: "Welke organisatie regelt de belastingen?",
    translation: { en: "Which organisation handles taxes?", pt: "Qual órgão cuida dos impostos?" },
    options: ["De Belastingdienst", "Het UWV", "De gemeente"],
    answer: 0,
    explain: { en: "The Belastingdienst is the tax authority. UWV handles unemployment benefits and work-related insurance.", pt: "A Belastingdienst é a Receita. O UWV cuida do seguro-desemprego e de seguros ligados ao trabalho." },
  },
  {
    theme: "Omgangsvormen, waarden en normen",
    question: "Je hebt om 10.00 uur een afspraak. Wanneer kom je?",
    translation: { en: "You have an appointment at 10:00. When do you arrive?", pt: "Você tem um compromisso às 10h. Quando você chega?" },
    options: ["Om 10.00 uur, op tijd", "Rond 10.30 uur", "Het maakt niet uit"],
    answer: 0,
    explain: { en: "Being on time is important in the Netherlands. If you will be late, call or send a message.", pt: "Ser pontual é importante na Holanda. Se for se atrasar, ligue ou mande mensagem." },
  },
];
