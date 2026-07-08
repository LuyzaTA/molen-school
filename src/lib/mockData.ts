import type {
  Speaker,
  ConversationCircle,
  BookingSlot,
  ResourceItem,
} from "./types";

// ============================================================
// Mock data for v1. Replace with API calls when a backend lands.
// Dates are generated relative to "now" so the feed always looks
// current in a demo.
// ============================================================

function daysFromNow(days: number, hour = 19): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(hour, 0, 0, 0);
  return d.toISOString();
}

function hoursBefore(iso: string, hours: number): string {
  const d = new Date(iso);
  d.setHours(d.getHours() - hours);
  return d.toISOString();
}

export const SPEAKERS: Speaker[] = [
  {
    id: "sp-ana",
    name: "Ana Beatriz",
    badge: "Fluent C2 (BR)",
    bio: "São Paulo-based interpreter. Specialises in helping learners over the 'freeze' barrier.",
  },
  {
    id: "sp-mike",
    name: "Mike Sullivan",
    badge: "Native (US)",
    bio: "From Chicago. Loves debate, sports, and casual small talk practice.",
  },
  {
    id: "sp-priya",
    name: "Priya Notthingham",
    badge: "Native (UK)",
    bio: "London-based. Patient with hesitant speakers; focus on everyday fluency.",
  },
  {
    id: "sp-carlos",
    name: "Carlos Mendes",
    badge: "Fluent C2 (BR)",
    bio: "Rio-based engineer. Great for technical and special-interest deep dives.",
  },
];

const circle1Date = daysFromNow(12, 19);
const circle2Date = daysFromNow(26, 20);

export const CONVERSATION_CIRCLES: ConversationCircle[] = [
  {
    id: "cc-1",
    title: "Monthly Conversation Circle — Travel Stories",
    speaker: SPEAKERS[1],
    dateTime: circle1Date,
    format: "Small group (8) · video · optional camera",
    theme: "Memorable trips, mishaps, and dream destinations",
    levelRange: "B1–B2",
    prepPackReleasesAt: hoursBefore(circle1Date, 48),
    prepPack: {
      phrases: [
        "off the beaten track",
        "a stone's throw away",
        "to get the hang of it",
        "I'd been meaning to…",
        "it was well worth it",
        "we ended up + -ing",
        "to make the most of",
        "I'm torn between… and…",
      ],
      warmUpQuestions: [
        "What's the last trip you took, even a short one?",
        "Do you prefer planning everything or improvising?",
        "What's one place you'd return to in a heartbeat?",
      ],
    },
  },
  {
    id: "cc-2",
    title: "Monthly Conversation Circle — Tech & the Future",
    speaker: SPEAKERS[0],
    dateTime: circle2Date,
    format: "Small group (6) · video · round-robin speaking",
    theme: "AI, work, and how daily life is changing",
    levelRange: "B2–C1",
    prepPackReleasesAt: hoursBefore(circle2Date, 48),
    prepPack: {
      phrases: [
        "a game changer",
        "to keep up with",
        "the jury's still out",
        "by and large",
        "to automate away",
        "a double-edged sword",
        "in the long run",
        "to weigh the pros and cons",
      ],
      warmUpQuestions: [
        "What technology changed your routine the most?",
        "Is there a tool you refuse to use? Why?",
        "What job do you think will change most in 10 years?",
      ],
    },
  },
];

export const BOOKING_SLOTS: BookingSlot[] = [
  {
    id: "bs-1",
    speakerId: "sp-ana",
    dateTime: daysFromNow(2, 18),
    durationMin: 30,
    kind: "1:1",
    capacity: 1,
    booked: 0,
  },
  {
    id: "bs-2",
    speakerId: "sp-mike",
    dateTime: daysFromNow(3, 20),
    durationMin: 45,
    kind: "small-group",
    capacity: 4,
    booked: 2,
  },
  {
    id: "bs-3",
    speakerId: "sp-priya",
    dateTime: daysFromNow(4, 17),
    durationMin: 30,
    kind: "1:1",
    capacity: 1,
    booked: 0,
  },
  {
    id: "bs-4",
    speakerId: "sp-carlos",
    dateTime: daysFromNow(5, 21),
    durationMin: 45,
    kind: "small-group",
    capacity: 4,
    booked: 1,
  },
  {
    id: "bs-5",
    speakerId: "sp-ana",
    dateTime: daysFromNow(7, 19),
    durationMin: 30,
    kind: "1:1",
    capacity: 1,
    booked: 0,
  },
];

export const RESOURCES: ResourceItem[] = [
  // ---- Favourites (pinned at top) ----
  {
    name: "HelloTalk",
    category: "community",
    free: true,
    featured: true,
    description: "Chat with native speakers and correct each other in real time.",
    url: "https://www.hellotalk.com/",
  },
  {
    name: "Meetup",
    category: "community",
    free: true,
    featured: true,
    description: "Find local or online English-speaking groups near you.",
    url: "https://www.meetup.com/",
  },
  {
    name: "Tandem",
    category: "community",
    free: true,
    featured: true,
    description: "Language exchange via text, voice, and video with native speakers.",
    url: "https://www.tandem.net/",
  },
  {
    name: "6 Minute English (BBC)",
    category: "podcast",
    free: true,
    featured: true,
    description: "Short, topical episodes with vocabulary breakdowns — perfect for busy days.",
    url: "https://www.bbc.co.uk/learningenglish/english/features/6-minute-english",
  },
  {
    name: "ESL Pod",
    category: "podcast",
    free: true,
    featured: true,
    description: "Slow, clear dialogues with detailed explanations for every level.",
    url: "https://www.eslpod.com/",
  },
  // ---- Podcasts ----
  {
    name: "Luke's English Podcast",
    category: "podcast",
    free: true,
    description: "Long-form, natural British English with humour.",
    url: "https://teacherluke.co.uk/",
  },
  {
    name: "All Ears English",
    category: "podcast",
    free: true,
    description: "Conversational American English and connection skills.",
    url: "https://www.allearsenglish.com/",
  },
  {
    name: "The English We Speak (BBC)",
    category: "podcast",
    free: true,
    description: "Bite-sized idioms and slang explained.",
    url: "https://www.bbc.co.uk/learningenglish/english/features/the-english-we-speak",
  },
  {
    name: "Culips",
    category: "podcast",
    free: true,
    description: "Real conversations broken down for learners.",
    url: "https://www.culips.com/",
  },
  {
    name: "Plain English",
    category: "podcast",
    free: true,
    description: "Current events told at a comfortable pace.",
    url: "https://plainenglish.com/",
  },
  // ---- Platforms ----
  {
    name: "BBC Learning English (YouTube)",
    category: "platform",
    free: true,
    description: "Video lessons on grammar, vocab, and pronunciation.",
    url: "https://www.youtube.com/@bbclearningenglish",
  },
  {
    name: "Rachel's English (YouTube)",
    category: "platform",
    free: true,
    description: "Deep dives on American pronunciation and mouth position.",
    url: "https://www.youtube.com/@rachelsenglish",
  },
  {
    name: "LingQ",
    category: "platform",
    free: false,
    description: "Read and listen to graded input; track known words.",
    url: "https://www.lingq.com/",
  },
  {
    name: "Speechling",
    category: "platform",
    free: false,
    description: "Record sentences and get coach feedback.",
    url: "https://speechling.com/",
  },
  // ---- Communities ----
  {
    name: "italki",
    category: "community",
    free: false,
    description: "Book 1:1 lessons or community tutors worldwide.",
    url: "https://www.italki.com/",
  },
  {
    name: "Speaky",
    category: "community",
    free: true,
    description: "Find partners by interest for live conversation.",
    url: "https://www.speaky.com/",
  },
  {
    name: "Conversation Exchange",
    category: "community",
    free: true,
    description: "Pen-pal style exchange for text and speaking practice.",
    url: "https://www.conversationexchange.com/",
  },
];

export function speakerById(id: string): Speaker | undefined {
  return SPEAKERS.find((s) => s.id === id);
}