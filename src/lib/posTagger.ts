// Simple rule-based English POS tagger for warm-up questions.
// Covers the patterns that appear in class content well enough
// for educational tooltips. Not a full NLP pipeline.

export type PosToken =
  | { kind: "word"; text: string; tag: string }
  | { kind: "blank"; text: string } // fill-in-the-blank marker (one or more underscores)
  | { kind: "space"; text: string }
  | { kind: "punct"; text: string };

const ARTICLES      = new Set(["a", "an", "the"]);
const WH_WORDS      = new Set(["when", "where", "what", "why", "how", "which"]);
const PRONOUNS      = new Set(["i", "you", "he", "she", "it", "we", "they", "me", "him", "her", "us", "them", "one", "who"]);
const POSSESSIVES   = new Set(["my", "your", "his", "its", "our", "their"]);
const AUX_VERBS     = new Set(["is", "are", "was", "were", "be", "been", "being", "have", "has", "had", "do", "does", "did", "will", "would", "could", "should", "may", "might", "shall", "can", "must", "let", "get", "got"]);
const MAIN_VERBS    = new Set(["talk", "feel", "think", "come", "like", "go", "say", "tell", "know", "see", "look", "use", "find", "give", "take", "make", "keep", "call", "try", "ask", "need", "seem", "turn", "learn", "show", "hear", "play", "run", "move", "live", "believe", "hold", "bring", "happen", "write", "provide", "sit", "stand", "lose", "pay", "meet", "include", "continue", "set", "change", "lead", "understand", "watch", "follow", "stop", "create", "speak", "read", "spend", "grow", "open", "walk", "win", "offer", "remember", "consider", "appear", "buy", "wait", "serve", "die", "send", "expect", "build", "stay", "fall", "cut", "reach", "decide", "explain", "describe", "imagine", "feel", "enjoy", "prefer", "practice", "start", "finish", "answer", "choose", "share", "help", "love", "hate", "feel", "miss", "visit", "travel", "work", "study", "teach", "surprise", "think"]);
const CONJUNCTIONS  = new Set(["and", "but", "or", "so", "because", "although", "though", "while", "if", "that", "as", "than", "nor", "yet", "since", "unless", "until", "whether"]);
const ADVERBS       = new Set(["very", "really", "quite", "just", "not", "never", "always", "often", "sometimes", "already", "still", "again", "also", "even", "only", "well", "too", "then", "here", "there", "now", "today", "yesterday", "last", "next", "soon", "ago", "once", "twice", "ever", "lately", "recently", "mostly", "mainly", "usually", "maybe", "perhaps", "together", "away", "back", "out", "up", "down", "off", "long", "around", "little"]);
const ADJECTIVES    = new Set(["new", "old", "good", "bad", "big", "small", "short", "easy", "hard", "first", "second", "third", "few", "many", "more", "most", "less", "least", "other", "same", "different", "important", "interesting", "neutral", "tired", "interested", "easy", "difficult", "common", "personal", "unique", "special", "great", "best", "worst", "free", "full", "true", "real", "whole", "high", "low", "early", "late", "young", "local", "national", "certain", "clear", "simple", "funny", "happy", "sad", "glad", "open", "close", "right", "left", "ready", "sure", "nice", "pretty", "beautiful", "terrible", "wonderful", "perfect", "possible", "impossible", "natural", "social", "main", "general", "specific", "daily", "busy", "quiet", "loud", "fast", "slow", "strong", "weak", "rich", "poor", "hot", "cold", "warm", "cool"]);
const NUMBERS_WORD  = new Set(["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "twenty", "thirty", "hundred", "thousand"]);
const PREPOSITIONS  = new Set(["in", "on", "at", "with", "about", "for", "of", "to", "from", "by", "over", "under", "above", "below", "before", "after", "between", "among", "into", "onto", "through", "during", "without", "within", "against", "along", "near", "around", "behind", "beyond", "inside", "outside", "past", "since", "toward", "towards", "except", "per", "upon", "across", "beneath", "beside", "besides", "despite", "off", "out", "up", "down"]);

function getTag(raw: string): string {
  const w = raw.toLowerCase();

  // Contractions
  if (w.endsWith("n't")) return "Aux. verb";
  if (w.endsWith("'m") || w.endsWith("'re") || w.endsWith("'ve") || w.endsWith("'ll") || w.endsWith("'d")) return "Contraction";
  if (w.endsWith("'s")) return w.length <= 4 ? "Contraction" : "Noun";  // it's / someone's

  if (/^\d+$/.test(w))      return "Number";
  if (NUMBERS_WORD.has(w))  return "Number";
  if (ARTICLES.has(w))      return "Article";
  if (WH_WORDS.has(w))      return "Question word";
  if (PRONOUNS.has(w))      return "Pronoun";
  if (POSSESSIVES.has(w))   return "Possessive adj.";
  if (AUX_VERBS.has(w))     return "Aux. verb";
  if (MAIN_VERBS.has(w))    return "Verb";
  if (PREPOSITIONS.has(w))  return "Preposition";
  if (CONJUNCTIONS.has(w))  return "Conjunction";
  if (ADVERBS.has(w))       return "Adverb";
  if (ADJECTIVES.has(w))    return "Adjective";

  // Suffix heuristics
  if (w.endsWith("ing") && w.length > 5) return "Verb";
  if (w.endsWith("ed")  && w.length > 4) return "Verb";
  if (w.endsWith("ly")  && w.length > 4) return "Adverb";
  if (w.match(/(tion|sion|ness|ment|ity|ance|ence|hood|ship)$/)) return "Noun";
  if (w.match(/(ful|ous|ive|ical|ible|able|ish|ent|ant|ary)$/) && w.length > 5) return "Adjective";

  return "Noun";
}

/** Tokenise a sentence into words, blanks, spaces and punctuation. */
export function tokenize(text: string): PosToken[] {
  const tokens: PosToken[] = [];
  // Match: blank markers (1+ underscores), words (with optional apostrophe),
  // whitespace runs, or punctuation. Blanks must come before the generic \w+ so
  // they are captured as their own kind rather than silently dropped.
  const re = /_+|[a-zA-Z][a-zA-Z']*|[^\w\s]+|\s+/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    const t = m[0];
    if (/^_+$/.test(t)) {
      tokens.push({ kind: "blank", text: t });
    } else if (/^\s+$/.test(t)) {
      tokens.push({ kind: "space", text: t });
    } else if (/^[a-zA-Z]/.test(t)) {
      tokens.push({ kind: "word", text: t, tag: getTag(t) });
    } else {
      tokens.push({ kind: "punct", text: t });
    }
  }
  return tokens;
}
