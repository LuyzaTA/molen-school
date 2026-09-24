import type { ClassGenInput, CEFRLevel } from "./types";
import type { SupportLanguage } from "./language";
import { getCEFRInfo } from "./cefr";
import { isInburgerenTopic } from "./inburgeren";

// ============================================================
// Prompt construction for the Dutch course. Same class structure
// as the English course (story → warm-up → target language →
// guided → free → self-check); the learner speaks Dutch and gets
// every explanation in their support language (English or
// Brazilian Portuguese).
// ============================================================

/** A1–A2 Dutch stories carry line-by-line support-language translations. */
export function dutchStoryTranslated(level: CEFRLevel): boolean {
  return level === "A1" || level === "A2";
}

function supportName(s: SupportLanguage): string {
  return s === "pt" ? "Brazilian Portuguese" : "English";
}

function ordinal(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] ?? s[v] ?? s[0]);
}

function dutchCurriculum(level: CEFRLevel): string {
  switch (level) {
    case "A1":
      return `
A1 DUTCH CURRICULUM — STRICT RULES:
- Every Dutch sentence must be SHORT and SIMPLE, maximum 8 words, main clauses only.
- ONLY high-frequency A1 vocabulary: greetings, introducing yourself, family, numbers,
  colours, daily routine, food & drink (boodschappen), home, weather, days/months, the body,
  clothes, simple shopping.
- Grammar focus: present tense (stem + t: ik werk, jij werkt, hij werkt; inversion drops
  the t: werk jij?), zijn and hebben, personal pronouns, articles de/het/een (always teach
  nouns WITH their article), negation with niet and geen, yes/no questions by inversion,
  question words (wie, wat, waar, wanneer, hoe), possessives (mijn, jouw, zijn, haar).
- No idioms, no subordinate clauses, no perfect tense.
- freeProduction MUST be a structured vocabulary or sentence-building activity — NOT open
  discussion. Prompts must be completable with 1–3 Dutch words or one short sentence.
  Choose format "vocabulary_practice", "sentence_building", or "picture_description".`;
    case "A2":
      return `
A2 DUTCH CURRICULUM:
- Grammar focus: perfect tense (hebben/zijn + voltooid deelwoord: ik heb gewerkt, ik ben
  gegaan), simple past of common verbs (was, had, ging), separable verbs (opstaan → ik sta
  op), modal verbs with the infinitive at the end (ik wil morgen komen), inversion after a
  time/place word (Morgen ga ik…), comparatives (groter dan, meer, liever), diminutives (-je).
- Vocabulary: shopping, transport (trein, fiets, OV-chipkaart), work & colleagues, health &
  the doctor (huisarts), restaurants, describing people and places, making appointments.
- Sentences may be joined with en / maar / want / dus. Avoid long subordinate clauses.
- freeProduction: simple discussion of personal experiences. Concrete, everyday scenarios.
  Format: "discussion".`;
    case "B1":
      return `
B1 DUTCH CURRICULUM:
- Grammar focus: subordinate clauses with the verb at the end (omdat, dat, als, toen,
  wanneer, terwijl), relative clauses with die/dat, reflexive verbs (zich vergissen), the
  uses of "er", future with gaan/zullen, om … te + infinitive, basic passive with worden.
- Vocabulary: opinions (volgens mij, ik vind dat…), telling stories, work & plans, health &
  lifestyle, living in the Netherlands, cultural differences, travel problems.
- The learner can give and justify opinions, describe experiences and explain plans.
- freeProduction: open discussion or storytelling on real, relatable topics.`;
    case "B2":
      return `
B2 DUTCH CURRICULUM:
- Grammar focus: conditional with zou/zouden (Als ik tijd had, zou ik…), passive in all
  tenses (is gebouwd, werd besproken), verb clusters (ik had het moeten weten), linking
  adverbs (echter, bovendien, daarom, toch, desondanks), formal "u" vs informal "jij".
- Vocabulary: professional communication, debate language, abstract ideas, news and
  society, presentations, e-mails, nuanced adjectives.
- The learner can argue a position with structured reasoning.
- freeProduction: structured debate or discussion on substantive topics. Push for
  well-organised arguments with evidence and counter-arguments.`;
    case "C1":
      return `
C1 DUTCH CURRICULUM:
- Grammar focus: complex word order in long sentences, nominalisations, concession
  (hoewel, ook al, weliswaar … maar), modal particles that make Dutch sound natural
  (maar, even, toch, wel, eens, hoor), register shifts between formal and informal.
- Vocabulary: academic and professional register, negotiation and persuasion,
  fixed expressions and idioms (uitdrukkingen, spreekwoorden) in context.
- Expect nuance, stylistic variety and register awareness. Push for spontaneity.
- freeProduction: sophisticated debate or academic discussion with rhetorical structure.`;
    case "C2":
      return `
C2 DUTCH CURRICULUM:
- Full grammatical flexibility. Focus on precision, register, elegance and nuance.
- Vocabulary: literature, humour, cultural references, idioms and proverbs, subtle
  connotations, differences between Netherlandic and Flemish Dutch where relevant.
- Challenge the learner with complexity and cultural depth.
- freeProduction: high-level debate, literary or cultural analysis, or professional
  discourse.`;
    default:
      return "";
  }
}

export function buildDutchSystemPrompt(input: ClassGenInput): string {
  const info = getCEFRInfo(input.level);
  const speakingPct = Math.round(info.speakingRatio * 100);
  const sl: SupportLanguage = input.supportLang ?? "pt";
  const support = supportName(sl);
  const pt = sl === "pt";
  const translatedStory = dutchStoryTranslated(input.level);

  const autisticGuidance = input.autisticMode
    ? `
AUTISTIC MODE IS ON. Adapt the content accordingly:
- Flag EVERY idiom or figurative phrase (set isIdiom true) and give a literal, concrete
  explanation in literalMeaning (in ${support}). Avoid sarcasm and vague language.
- Keep instructions explicit, literal, and concrete. One idea per sentence.
- Feedback items must be concrete and specific — never vague praise.
- Prompts should be predictable and low-ambiguity, with clear expectations.`
    : `
Autistic mode is off. You may use natural Dutch idioms at higher levels; still set isIdiom
true and fill literalMeaning (in ${support}) for any idiomatic items.`;

  const spiral =
    input.knownVocab && input.knownVocab.length
      ? `\nSPIRAL REVIEW: the learner has previously studied these Dutch words — weave a few
naturally into examples and prompts where they fit: ${input.knownVocab.slice(0, 24).join(", ")}.`
      : "";

  const repeatTopic =
    input.topicRepeatCount && input.topicRepeatCount > 0
      ? `
REPEAT TOPIC — MANDATORY NEW CONTENT:
The student is studying "${input.topic}" for the ${ordinal(input.topicRepeatCount + 1)} time.
Produce entirely different content from any previous class on this topic.
${
  input.priorTopicVocab?.length
    ? `BANNED VOCABULARY — do NOT teach any of these words, they are already known:
${input.priorTopicVocab.slice(0, 50).join(", ")}.`
    : ""
}
Teach the NEXT LAYER: synonyms, collocations, sub-topics, more nuanced expressions, a new
role-play scenario, and all-new sentence frames and prompts.`
      : "";

  const examPrep = isInburgerenTopic(input.topic)
    ? `
EXAM PREP — DUTCH CIVIC INTEGRATION EXAM (INBURGERINGSEXAMEN):
This class prepares the learner for the official exam run by DUO. Facts about the exam:
- Language exams at A2: Reading (on a computer, 65 min, everyday texts + questions),
  Listening (computer, 45 min, short films and texts + questions), Speaking (computer,
  35 min, short films + spoken answers), Writing (pen and paper, 40 min, 4 assignments such
  as a letter or a form). B1/B2 are taken as the State Exam NT2 (Staatsexamen NT2).
- KNM (Kennis van de Nederlandse Maatschappij): computer, 45 min, questions grouped by
  themes of Dutch society such as wonen and werk en inkomen.
- ONA: orientation on the Dutch labour market (portfolio + course or final interview).
Rules for this class:
- Teach the Dutch vocabulary and real situations of the named exam part or KNM theme
  (e.g. gemeente, huisarts, huurcontract, belastingdienst, sollicitatiegesprek).
- For KNM themes include ONLY accurate, well-established, non-controversial facts about
  Dutch society, institutions, rules and customs. Never invent numbers, dates, or rules; if
  unsure, stay general.
- Make guided and free production mimic exam tasks: answering a question about a short
  everyday situation, reacting in a phone call or at a counter, writing a short message or
  filling in a form. Keep the language at the learner's level (the exam itself is A2+).
- Story checks may look like exam questions (short situation → 3 options).`
    : "";

  // Portuguese interference errors only make sense for the PT support language.
  const ptErrors = pt
    ? '\nInclude errors caused by Portuguese, such as "ik heb 30 jaar" instead of "ik ben 30 jaar".'
    : "";

  const businessFocus =
    input.track === "business"
      ? `
BUSINESS TRACK: focus vocabulary, examples, role-plays and prompts on professional contexts
in Dutch-speaking workplaces (vergaderingen, e-mails, afspraken, presentaties, overleg).`
      : "";

  return `You are an expert teacher of Dutch as a foreign language (NT2) who designs
SPEAKING-FIRST classes${pt ? " for Brazilian learners" : ""}. Your learners freeze when speaking, so every
class is built around getting them to talk — in Dutch.

Design a single 45–60 minute speaking class on the learner's topic.

Learner level in Dutch: ${input.level} (${info.name}) — ${info.canDo}
Target speaking ratio: about ${speakingPct}% of class time is the learner speaking.
Set the "speakingRatio" field to ${info.speakingRatio}.

LANGUAGE RULES — FOLLOW EXACTLY:
The learner's support language is ${support}. This is the ONLY language you explain in.
${
  pt
    ? "Never write English explanations; everything that is not Dutch is in Brazilian Portuguese."
    : `NEVER WRITE PORTUGUESE ANYWHERE IN THIS CLASS. The learner does not read Portuguese.
Some JSON field names end in "Pt" (questionsPt, sentenceFramesPt, promptsPt) for historical
reasons — the name is meaningless here: fill them with ENGLISH, like every other explanation.`
}
- Write in standard Netherlands Dutch (ABN): every vocab "term", every "example", both
  structure "pattern"s and "example"s, the whole story (narration "text", "scene", dialogue
  "line"s, the check "question" and "options"), every warm-up question, every sentence
  frame, and every free-production prompt. This is the Dutch the learner reads, hears and says.
- Write in ${support}: every vocab "meaning" (a short translation/explanation),
  "exampleTranslation", "literalMeaning", warmUp.grammarNote, guidedProduction.intro,
  rolePlay.scenario and rolePlay.roles, picturePrompts, freeProduction.intro, the whole
  feedback object, every agenda label, and every grammar label.
- Grammar labels: the ${support} name with the Dutch term in brackets, e.g.
  ${pt ? '"Ordem verbo-segundo (inversie)", "Pretérito perfeito (voltooide tijd)"' : '"Verb-second word order (inversie)", "Perfect tense (voltooide tijd)"'}.
- Vocab terms: give nouns WITH their article (de fiets, het huis) and separable verbs in
  the infinitive (opstaan). Never mix languages inside a Dutch sentence.
- Parallel translation arrays: warmUp.questionsPt, guidedProduction.sentenceFramesPt and
  freeProduction.promptsPt hold the ${support} translation of each Dutch item, in the same
  order and the same count (the "Pt" in those names does NOT mean Portuguese).${
    translatedStory
      ? `
- Story translations: fill every panel's "textTranslation" with the ${support} translation
  of the narration, and every dialogue line's "translation" with the ${support} translation.`
      : ""
  }

Calibrate vocabulary difficulty, sentence length, and abstraction to ${input.level}.
${autisticGuidance}${spiral}${repeatTopic}${dutchCurriculum(input.level)}${businessFocus}${examPrep}

CRITICAL — TEACH THE TOPIC, NOT ABOUT THE TOPIC:
Every vocab item, sentence frame, role-play, and prompt must contain Dutch the student
actually uses IN this topic.
  ✓ Topic "Food & drink" (A1) → de boterham, het brood, de kaas, drinken, lekker,
    "Ik wil graag ___", "Mag ik ___?"
  ✗ Generic discussion phrases adapted to the topic name — wrong.

STORY (Step 1 — interactive scene-by-scene story):
Write a short story set in the world of the topic, told scene by scene like an episode of a
series, in natural Dutch at exactly ${input.level} level. The student reveals each scene's
dialogue line by line and must answer a quick comprehension check to unlock the next scene.

Scene count and depth by CEFR level:
  A1 → 3 scenes · 1–2 simple narration sentences · 2 short dialogue lines · present tense only
  A2 → 4 scenes · 2–3 narration sentences · 2–3 dialogue lines · perfect tense + present
  B1 → 5 scenes · 3–4 narration sentences · 3–4 dialogue lines · subordinate clauses
  B2 → 5 scenes · 4–5 narration sentences · 3–4 dialogue lines · varied linking and register
  C1 → 6 scenes · 5–6 narration sentences · 4–5 dialogue lines · complex structures, particles
  C2 → 6 scenes · 5–7 literary-quality sentences · 4–5 dialogue lines · nuanced, idiomatic

For each panel provide:
  • text     — the scene's Dutch narration
  • scene    — a short Dutch setting line: place + moment, e.g. "Een bakkerij in Utrecht — zaterdagochtend"
  • dialogue — the characters' spoken Dutch lines (speaker + line). Use the SAME 2–3 named
               adult characters across the story. Settings in the Netherlands or Belgium are
               welcome;${pt ? " a Brazilian character adapting to Dutch life is a great fit." : " a newcomer adapting to Dutch life is a great fit."}
  • check    — ONE quick comprehension question in simple Dutch about THIS scene, 2–3 short
               Dutch options (1–5 words each), and the zero-based index of the correct option.
  • vocab    — target vocab terms (exact strings from targetLanguage.vocab) that appear in
               this scene's text or dialogue${
                 translatedStory
                   ? `
  • textTranslation and each dialogue "translation" — in ${support}`
                   : ""
               }

Story rules:
  - NO emojis. Real tension or curiosity; small hooks at the end of middle scenes.
  - Use at least 6 target vocabulary words across the scenes, mostly in the DIALOGUE.
  - Clear arc: setup → complication → resolution.

Content requirements:
- warmUp.questions: exactly 5 personal, easy-to-answer Dutch questions (plus questionsPt).
- targetLanguage.vocab: 8–12 useful Dutch words/phrases for the topic at this level, each
  with a ${support} meaning, a natural Dutch example sentence, and its ${support} translation.
- targetLanguage.structures: exactly 2 Dutch sentence patterns with a Dutch example.
- guidedProduction: a short ${support} intro, 4–6 Dutch sentence frames the learner completes
  (plus sentenceFramesPt), one role-play (${support} scenario + roles), and 2–3 picture /
  visualisation prompts in ${support} that the learner answers in Dutch.
  For any fill-in-the-blank slot write ______ (six underscores). Never use a dot as a placeholder.
- freeProduction: a short ${support} intro and 3–5 Dutch prompts (plus promptsPt). For A1:
  format vocabulary_practice, sentence_building, or picture_description. For A2+: discussion,
  debate, or storytelling appropriate to the level.
- feedback (in ${support}): a short intro, a 4–6 item self-correction checklist, and 3–5
  concrete errors learners make in Dutch on this topic — e.g. verb-second word
  order after a time word, the verb at the end of subordinate clauses, de/het, niet vs geen,
  splitting separable verbs, and the sounds g/ch, ui, eu, ij.${ptErrors}
- agenda: 6 short ${support} labels, one per stage (story, warm-up, target language, guided
  production, free production, self-check). The LAST label is the post-lesson self-check
  review — word it as a review, not as another lesson step.
- grammar: 3–5 grammar labels (format described above).
- warmUp.grammarNote: 2–3 ${support} sentences explaining today's Dutch grammar focus,
  written to the learner ("you"). Use **bold** for grammar term names and give short Dutch
  examples in *italics*.

Return ONLY the structured JSON. Be encouraging, practical, and concrete.`;
}

export function buildDutchUserPrompt(input: ClassGenInput): string {
  const sl: SupportLanguage = input.supportLang ?? "pt";
  return `Create today's Dutch speaking class. Topic: "${input.topic}". Level: ${input.level}.
Support language: ${supportName(sl)} — write every explanation and translation in ${supportName(sl)}${
    sl === "en" ? ", never in Portuguese" : ""
  }.
Teach the actual Dutch the student says and hears in "${input.topic}" situations.`;
}
