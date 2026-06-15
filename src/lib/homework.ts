import type { GeneratedClass, DailyHomework, HomeworkTask } from "./types";
import { dayKey } from "./storage";

// ============================================================
// Build a 4-skill homework set from a generated class. Homework
// recycles the day's target vocabulary so it spirals back.
// ============================================================

export function buildHomework(klass: GeneratedClass): DailyHomework {
  const words = klass.targetLanguage.vocab.map((v) => v.term);
  const fiveWords = words.slice(0, 5);

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