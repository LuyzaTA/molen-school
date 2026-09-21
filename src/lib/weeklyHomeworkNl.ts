import type { CEFRLevel, WeeklyPlan, WeeklyTask, HomeworkSkill } from "./types";

// ============================================================
// Curated weekly homework for the Dutch course, one plan per CEFR
// level. Every task carries both support languages: `detail` in
// English and `detailPt` in Brazilian Portuguese — the homework page
// shows the one the learner chose. Dutch words stay in Dutch.
// ============================================================

const t = (skill: HomeworkSkill, title: string, detail: string, detailPt: string): WeeklyTask => ({
  skill,
  title,
  detail,
  detailPt,
});

const PLANS: Record<CEFRLevel, WeeklyPlan> = {
  A1: {
    level: "A1",
    focus: "Introduce yourself and handle everyday moments in short, simple Dutch sentences.",
    focusPt: "Apresente-se e resolva situações do dia a dia com frases curtas e simples em holandês.",
    days: [
      {
        day: "Monday",
        theme: "Jezelf voorstellen",
        tasks: [
          t("speaking", "Say hello (30 seconds)", "Record yourself: 'Ik heet…', 'Ik kom uit Brazilië', 'Ik woon in…'. Listen back once.", "Grave você falando: 'Ik heet…', 'Ik kom uit Brazilië', 'Ik woon in…'. Ouça uma vez."),
          t("listening", "Greetings", "Listen to 8 greetings (Hoi, Goedemorgen, Tot ziens…) with the listen button in class and repeat each one.", "Ouça 8 cumprimentos (Hoi, Goedemorgen, Tot ziens…) com o botão de áudio da aula e repita cada um."),
        ],
      },
      {
        day: "Tuesday",
        theme: "Familie",
        tasks: [
          t("writing", "5 sentences about family", "Write 5 sentences: 'Mijn moeder heet…', 'Ik heb een broer', 'Hij is … jaar'.", "Escreva 5 frases: 'Mijn moeder heet…', 'Ik heb een broer', 'Hij is … jaar'."),
        ],
      },
      {
        day: "Wednesday",
        theme: "De dag",
        tasks: [
          t("speaking", "Your morning (40 seconds)", "Say your morning out loud: 'Ik sta om 7 uur op', 'Ik drink koffie', 'Ik ga naar mijn werk'.", "Diga a sua manhã em voz alta: 'Ik sta om 7 uur op', 'Ik drink koffie', 'Ik ga naar mijn werk'."),
        ],
      },
      {
        day: "Thursday",
        theme: "Boodschappen",
        tasks: [
          t("reading", "Supermarket words", "Learn 10 food words WITH de or het (de kaas, het brood…). Make flashcards.", "Aprenda 10 palavras de comida COM de ou het (de kaas, het brood…). Faça flashcards."),
          t("speaking", "At the counter", "Practise out loud: 'Mag ik een brood?', 'Hoeveel kost dat?', 'Dank u wel!'.", "Pratique em voz alta: 'Mag ik een brood?', 'Hoeveel kost dat?', 'Dank u wel!'."),
        ],
      },
      {
        day: "Friday",
        theme: "Herhaling",
        tasks: [
          t("writing", "My week", "Write 5 short sentences about your week with words from this week's classes.", "Escreva 5 frases curtas sobre a sua semana com palavras das aulas desta semana."),
        ],
      },
    ],
  },
  A2: {
    level: "A2",
    focus: "Talk about what you did and plan everyday arrangements in Dutch.",
    focusPt: "Fale sobre o que você fez e combine compromissos do dia a dia em holandês.",
    days: [
      {
        day: "Monday",
        theme: "Het weekend",
        tasks: [
          t("speaking", "Last weekend (1 minute)", "Record what you did last weekend using the perfect tense: 'Ik heb… gekocht', 'Ik ben naar… gegaan'.", "Grave o que você fez no fim de semana usando o perfeito: 'Ik heb… gekocht', 'Ik ben naar… gegaan'."),
        ],
      },
      {
        day: "Tuesday",
        theme: "Afspraken maken",
        tasks: [
          t("writing", "A short message", "Write a WhatsApp message to a colleague to plan a coffee: day, time, place (40–60 words).", "Escreva uma mensagem de WhatsApp para um colega combinando um café: dia, hora, lugar (40–60 palavras)."),
        ],
      },
      {
        day: "Wednesday",
        theme: "Nieuws in makkelijke taal",
        tasks: [
          t("listening", "Jeugdjournaal", "Watch one NOS Jeugdjournaal item. Write down 5 words you recognise and 2 new ones.", "Assista a uma notícia do NOS Jeugdjournaal. Anote 5 palavras que reconhece e 2 novas."),
        ],
      },
      {
        day: "Thursday",
        theme: "Scheidbare werkwoorden",
        tasks: [
          t("reading", "Separable verbs", "Learn 6 separable verbs (opstaan, meenemen, opbellen…) and write one sentence for each.", "Aprenda 6 verbos separáveis (opstaan, meenemen, opbellen…) e escreva uma frase com cada um."),
        ],
      },
      {
        day: "Friday",
        theme: "Bij de huisarts",
        tasks: [
          t("speaking", "Role-play", "Call the doctor's assistant (out loud): say what's wrong and ask for an appointment.", "Ligue para a assistente do médico (em voz alta): diga o que você tem e peça uma consulta."),
        ],
      },
    ],
  },
  B1: {
    level: "B1",
    focus: "Give your opinion and tell stories with linked sentences (omdat, dat, toen).",
    focusPt: "Dê sua opinião e conte histórias com frases ligadas (omdat, dat, toen).",
    days: [
      {
        day: "Monday",
        theme: "Mening geven",
        tasks: [
          t("speaking", "Opinion (90 seconds)", "Give your opinion on cycling everywhere. Use 'Ik vind dat…', 'omdat…' — verb at the end!", "Dê sua opinião sobre andar de bicicleta para tudo. Use 'Ik vind dat…', 'omdat…' — verbo no final!"),
        ],
      },
      {
        day: "Tuesday",
        theme: "Nieuws",
        tasks: [
          t("reading", "One NOS article", "Read one NOS article. Summarise it in 3 Dutch sentences.", "Leia um artigo da NOS. Resuma em 3 frases em holandês."),
        ],
      },
      {
        day: "Wednesday",
        theme: "Een verhaal",
        tasks: [
          t("writing", "A memory (100 words)", "Write about a memorable day with 'toen', 'daarna' and 'uiteindelijk'.", "Escreva sobre um dia marcante com 'toen', 'daarna' e 'uiteindelijk'."),
        ],
      },
      {
        day: "Thursday",
        theme: "Podcast",
        tasks: [
          t("listening", "Easy Dutch episode", "Watch an Easy Dutch episode. Note 3 opinions people give.", "Assista a um episódio do Easy Dutch. Anote 3 opiniões que as pessoas dão."),
        ],
      },
      {
        day: "Friday",
        theme: "Werk",
        tasks: [
          t("speaking", "Your job", "Explain your job or studies for 2 minutes: what you do, what you like, what is difficult.", "Explique seu trabalho ou estudos por 2 minutos: o que faz, do que gosta, o que é difícil."),
        ],
      },
    ],
  },
  B2: {
    level: "B2",
    focus: "Argue a position and adapt your register (u / jij) in work situations.",
    focusPt: "Defenda uma posição e adapte o registro (u / jij) em situações de trabalho.",
    days: [
      {
        day: "Monday",
        theme: "Debat",
        tasks: [
          t("speaking", "Pros and cons (3 minutes)", "Argue for and against a four-day work week with 'echter', 'bovendien', 'daarom'.", "Argumente a favor e contra a semana de quatro dias com 'echter', 'bovendien', 'daarom'."),
        ],
      },
      {
        day: "Tuesday",
        theme: "Formele e-mail",
        tasks: [
          t("writing", "Complaint e-mail (150 words)", "Write a formal complaint to a company. Use 'u', a clear request, and a polite close.", "Escreva uma reclamação formal para uma empresa. Use 'u', um pedido claro e um fechamento educado."),
        ],
      },
      {
        day: "Wednesday",
        theme: "Actualiteit",
        tasks: [
          t("listening", "News report", "Watch a full NOS news item. Explain it aloud in 2 minutes in your own words.", "Assista a uma notícia completa da NOS. Explique em voz alta em 2 minutos com suas palavras."),
        ],
      },
      {
        day: "Thursday",
        theme: "Zou / zouden",
        tasks: [
          t("reading", "Conditionals", "Write 6 sentences with 'Als ik…, zou ik…' about work and life in the Netherlands.", "Escreva 6 frases com 'Als ik…, zou ik…' sobre trabalho e vida na Holanda."),
        ],
      },
      {
        day: "Friday",
        theme: "Presentatie",
        tasks: [
          t("speaking", "Mini-presentation", "Present a topic from your field for 3 minutes with an introduction, 3 points, and a conclusion.", "Apresente um tema da sua área por 3 minutos com introdução, 3 pontos e conclusão."),
        ],
      },
    ],
  },
  C1: {
    level: "C1",
    focus: "Speak spontaneously with nuance, natural particles, and the right register.",
    focusPt: "Fale espontaneamente com nuance, partículas naturais e o registro certo.",
    days: [
      {
        day: "Monday",
        theme: "Partikels",
        tasks: [
          t("speaking", "Sound natural", "Tell a 2-minute anecdote using 'even', 'maar', 'toch', 'wel' naturally.", "Conte uma anedota de 2 minutos usando 'even', 'maar', 'toch', 'wel' com naturalidade."),
        ],
      },
      {
        day: "Tuesday",
        theme: "Opiniestuk",
        tasks: [
          t("reading", "Opinion column", "Read a Dutch opinion column. List the writer's 3 main arguments and one counter-argument.", "Leia uma coluna de opinião holandesa. Liste os 3 argumentos principais e um contra-argumento."),
        ],
      },
      {
        day: "Wednesday",
        theme: "Uitdrukkingen",
        tasks: [
          t("writing", "Idioms in context", "Write a short text (200 words) using 4 Dutch idioms correctly.", "Escreva um texto curto (200 palavras) usando 4 expressões idiomáticas holandesas corretamente."),
        ],
      },
      {
        day: "Thursday",
        theme: "Onderhandelen",
        tasks: [
          t("speaking", "Negotiation", "Role-play a salary negotiation out loud, both sides, 3 minutes.", "Faça em voz alta uma negociação salarial, os dois lados, 3 minutos."),
        ],
      },
      {
        day: "Friday",
        theme: "Documentaire",
        tasks: [
          t("listening", "Documentary", "Watch 15 minutes of a Dutch documentary and summarise it aloud in 2 minutes.", "Assista a 15 minutos de um documentário holandês e resuma em voz alta em 2 minutos."),
        ],
      },
    ],
  },
  C2: {
    level: "C2",
    focus: "Refine precision, style, and cultural depth — literature, humour, and debate.",
    focusPt: "Refine precisão, estilo e profundidade cultural — literatura, humor e debate.",
    days: [
      {
        day: "Monday",
        theme: "Literatuur",
        tasks: [
          t("reading", "A short story", "Read a Dutch short story. Analyse the style and tone in a 3-minute spoken review.", "Leia um conto holandês. Analise o estilo e o tom em uma resenha falada de 3 minutos."),
        ],
      },
      {
        day: "Tuesday",
        theme: "Humor",
        tasks: [
          t("listening", "Cabaret", "Watch a Dutch cabaret (comedy) fragment. Explain one joke and why it works.", "Assista a um trecho de cabaret holandês. Explique uma piada e por que ela funciona."),
        ],
      },
      {
        day: "Wednesday",
        theme: "Essay",
        tasks: [
          t("writing", "Essay (300 words)", "Write an essay on Dutch directness vs Brazilian politeness, with a clear thesis.", "Escreva um ensaio sobre a franqueza holandesa vs a cortesia brasileira, com uma tese clara."),
        ],
      },
      {
        day: "Thursday",
        theme: "Vlaams en Nederlands",
        tasks: [
          t("listening", "Two varieties", "Compare a Flemish and a Netherlandic news clip. Note 5 differences in words or sounds.", "Compare uma notícia flamenga e uma holandesa. Anote 5 diferenças de palavras ou sons."),
        ],
      },
      {
        day: "Friday",
        theme: "Debat",
        tasks: [
          t("speaking", "High-level debate", "Hold a 4-minute position on a current Dutch political issue, anticipating objections.", "Defenda por 4 minutos uma posição sobre um tema político atual holandês, antecipando objeções."),
        ],
      },
    ],
  },
};

export function getDutchWeeklyPlan(level: CEFRLevel): WeeklyPlan {
  return PLANS[level];
}
