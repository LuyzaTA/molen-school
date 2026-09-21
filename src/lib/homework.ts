import type { GeneratedClass, DailyHomework, HomeworkTask } from "./types";
import type { SupportLanguage } from "./language";
import { dayKey } from "./storage";

// ============================================================
// Build a 4-skill homework set from a generated class. Homework
// recycles the day's target vocabulary so it spirals back.
// ============================================================

export function buildHomework(
  klass: GeneratedClass,
  supportLang: SupportLanguage = "pt",
): DailyHomework {
  const words = klass.targetLanguage.vocab.map((v) => v.term);
  const fiveWords = words.slice(0, 5);

  if (klass.language === "nl") {
    return {
      date: dayKey(),
      topic: klass.topic,
      tasks: buildDutchTasks(klass.topic, fiveWords, klass.supportLang ?? supportLang),
    };
  }

  const tasks: HomeworkTask[] = [
    {
      skill: "speaking",
      title: "Record a voice note (60–90s)",
      instructions: `Speak for 60–90 seconds about "${klass.topic}". Use at least 4 of today's words. Don't script it — just talk.`,
      done: false,
      recordingSeconds: 75,
      targetWords: fiveWords,
    },
    {
      skill: "listening",
      title: "Listen to a short segment",
      instructions: `Find a short podcast or video clip about "${klass.topic}" (try the Resources tab) and listen once without subtitles, then once with. Answer the questions below.`,
      done: false,
      questions: [
        "What was the main idea in one sentence?",
        "Note 2 new words or phrases you heard.",
        "What is one thing the speaker said that you agreed or disagreed with?",
      ],
    },
    {
      skill: "reading",
      title: "Read a short text & mine 5 words",
      instructions: `Read a short article about "${klass.topic}". Extract 5 useful words or phrases and write a quick definition for each in your own words.`,
      done: false,
      text: `Today's reading is self-chosen: pick any short text about "${klass.topic}" — a news article, blog post, or even a product page. Keep it under ~400 words so you can finish in a few minutes.`,
    },
    {
      skill: "writing",
      title: "Write 80–150 words",
      instructions: `Write 80–150 words about "${klass.topic}". You MUST reuse these target words: ${fiveWords.join(", ")}.`,
      done: false,
      minWords: 80,
      maxWords: 150,
      targetWords: fiveWords,
    },
  ];

  return {
    date: dayKey(),
    topic: klass.topic,
    tasks,
  };
}
/** Dutch-course homework: same four skills, instructions in the support language. */
function buildDutchTasks(
  topic: string,
  fiveWords: string[],
  sl: SupportLanguage,
): HomeworkTask[] {
  const tx = (en: string, pt: string) => (sl === "pt" ? pt : en);
  return [
    {
      skill: "speaking",
      title: tx("Record a voice note in Dutch (60–90s)", "Grave um áudio em holandês (60–90s)"),
      instructions: tx(
        `Speak Dutch for 60–90 seconds about "${topic}". Use at least 4 of today's words. Don't script it — just talk.`,
        `Fale holandês por 60–90 segundos sobre "${topic}". Use pelo menos 4 palavras de hoje. Não escreva antes — apenas fale.`,
      ),
      done: false,
      recordingSeconds: 75,
      targetWords: fiveWords,
    },
    {
      skill: "listening",
      title: tx("Listen to Dutch", "Ouça holandês"),
      instructions: tx(
        `Find a short Dutch clip about "${topic}" (try NOS Jeugdjournaal or Easy Dutch in Resources). Listen once without subtitles, then once with. Answer the questions below.`,
        `Encontre um trecho curto em holandês sobre "${topic}" (experimente NOS Jeugdjournaal ou Easy Dutch em Resources). Ouça uma vez sem legendas e outra com. Responda às perguntas abaixo.`,
      ),
      done: false,
      questions: [
        tx("What was the main idea in one sentence?", "Qual foi a ideia principal em uma frase?"),
        tx("Note 2 new Dutch words or phrases you heard.", "Anote 2 palavras ou expressões novas em holandês que você ouviu."),
        tx("Repeat one sentence you heard, out loud, 3 times.", "Repita em voz alta, 3 vezes, uma frase que você ouviu."),
      ],
    },
    {
      skill: "reading",
      title: tx("Read a short Dutch text & mine 5 words", "Leia um texto curto em holandês e colete 5 palavras"),
      instructions: tx(
        `Read a short Dutch text about "${topic}". Pick 5 useful words — write each with de/het and its meaning.`,
        `Leia um texto curto em holandês sobre "${topic}". Escolha 5 palavras úteis — escreva cada uma com de/het e o significado.`,
      ),
      done: false,
      text: tx(
        `Choose any short Dutch text about "${topic}" — a news item in simple Dutch, a website, or a product page. Keep it short so you can finish in a few minutes.`,
        `Escolha qualquer texto curto em holandês sobre "${topic}" — uma notícia em holandês simples, um site ou uma página de produto. Mantenha curto para terminar em poucos minutos.`,
      ),
    },
    {
      skill: "writing",
      title: tx("Write 60–120 words in Dutch", "Escreva 60–120 palavras em holandês"),
      instructions: tx(
        `Write 60–120 Dutch words about "${topic}". You MUST reuse these words: ${fiveWords.join(", ")}.`,
        `Escreva 60–120 palavras em holandês sobre "${topic}". Você DEVE reutilizar estas palavras: ${fiveWords.join(", ")}.`,
      ),
      done: false,
      minWords: 60,
      maxWords: 120,
      targetWords: fiveWords,
    },
  ];
}
