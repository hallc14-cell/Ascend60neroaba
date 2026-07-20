// 60-Day Transformation Protocol — fat-loss + mind + markets
// Toned down looksmax → balanced glow up · skill stacking · capital
//
// NOTE: This file is the *content* source for the default "Looksmax" program.
// The data-driven protocol abstraction lives in
// `src/features/checklist/data` which assembles this content into a swappable
// `ProtocolDefinition`. Core domain types are centralised in `src/types`.

import type { Phase, Task, Unlock } from "@/types/protocol";

// Re-exported so existing imports (`@/data/protocol`) keep working unchanged.
export type { Phase, Task, Unlock } from "@/types/protocol";

export const PHASES: Phase[] = [
  {
    id: 0,
    label: "P1",
    weeks: "Weeks 1-2",
    weekRange: [1, 2],
    title: "Foundation",
    tag: "Hard reset. Build the ritual.",
    vibe: "First two weeks decide everything. Wake up, hit protein, lift heavy with the bar, study one chart, sleep deep. Repeat until your old self can't recognize you.",
    rank: "Rookie",
    kcal: "1,500–1,600 kcal",
    protein: "200g (preserve muscle)",
    carbs: "150–175g",
    fat: "45–55g",
    split: "Push / Pull / Legs 3×/week (free-weight compounds, longer sets)",
  },
  {
    id: 1,
    label: "P2",
    weeks: "Weeks 3-6",
    weekRange: [3, 6],
    title: "Cut Phase",
    tag: "Fat off. Skills on. Capital up.",
    vibe: "The body sharpens. The mind sharpens. You stack AI prompts, paper-trade setups, and lift heavy free-weights so your body has zero reason to burn the muscle you built. Don't break now.",
    rank: "Operator",
    kcal: "1,300–1,400 kcal",
    protein: "210g (HIGH — anti-catabolic)",
    carbs: "100–130g (training) · 60–80g (rest)",
    fat: "40–50g",
    split: "Push / Pull / Legs 3×/week (heavy barbell + accessory)",
  },
  {
    id: 2,
    label: "P3",
    weeks: "Weeks 7-8",
    weekRange: [7, 8],
    title: "Lock In",
    tag: "Lock in the body. Lock in the edge.",
    vibe: "Carbs back, lifts heavier, skin clearer, head clearer. You ship one AI project, log a real (or paper) trade journal, and finalize the version of you that walks differently. Make it permanent.",
    rank: "Prospect",
    kcal: "1,500–1,700 kcal",
    protein: "200g",
    carbs: "175–200g",
    fat: "50–60g",
    split: "Push / Pull / Legs 3×/week (PR week — heavy barbell)",
  },
];

// Daily protocol — same core ritual, evolves slightly per phase
export const DAILY_TASKS: Record<number, Task[]> = {
  0: [
    { id: "wake",    emoji: "⏰", title: "Wake up — alarm across the room", note: "No snooze. Discipline starts in second one.", xp: 50, cat: "ritual", hour: 7 },
    { id: "pray_am", emoji: "🙏", title: "Morning prayer + 1 verse", note: "Open the day with God. 'This is the day the Lord has made.' — Ps 118:24", xp: 60, cat: "faith", hour: 7 },
    { id: "cold",    emoji: "🥶", title: "Cold shower 2 min", note: "Shocks the system. De-puffs. Sharpens features. Free.", xp: 80, cat: "looks", hour: 8 },
    { id: "water",   emoji: "💧", title: "1L water + electrolytes", note: "Hydrate before caffeine. Skin clears in a week.", xp: 30, cat: "fuel", hour: 8 },
    { id: "supp_am", emoji: "💊", title: "AM stack", note: "Vit D 5000IU · Omega-3 2g · Multi · Creatine 5g", xp: 40, cat: "fuel", hour: 9 },
    { id: "study",   emoji: "🤖", title: "Study block — 60 min (see Study tab)", note: "Open the Study Planner. Hit today's lesson. Don't freelance.", xp: 120, cat: "money", hour: 10 },
    { id: "brunch",  emoji: "🍳", title: "Brunch — 60g+ protein (meal 1 of 2)", note: "6 eggs + oats + berries OR steak + rice. Front-load protein.", xp: 70, cat: "fuel", hour: 12 },
    { id: "study2",  emoji: "📊", title: "Study block #2 — 45 min", note: "Second pass on the Study tab. Build > consume — apply today's lesson.", xp: 100, cat: "money", hour: 14 },
    { id: "scripture", emoji: "📖", title: "Read 1 gospel passage", note: "Mark is the action gospel — start there. One story per day.", xp: 70, cat: "faith", hour: 16 },
    { id: "lift",    emoji: "🏋️", title: "Gym — Push / Pull / Legs (free weights)", note: "Today's split in the Plan tab. 5×10-12 RPE 7. Long sets, full muscle coverage.", xp: 150, cat: "body", hour: 18 },
    { id: "dinner",  emoji: "🍽️", title: "Dinner — lean + veg (meal 2 of 2)", note: "8oz beef/salmon + sweet potato + greens. Hit your daily protein.", xp: 60, cat: "fuel", hour: 19 },
    { id: "craving", emoji: "🧂", title: "Crush cravings — 2 tools", note: "1) Sparkling water + lemon  2) 10 push-ups + brush teeth.", xp: 50, cat: "fuel", hour: 20 },
    { id: "deepwk",  emoji: "🎯", title: "1hr deep work — phone in drawer", note: "Build the AI project. Or paper-trade journal entry.", xp: 100, cat: "mind", hour: 21 },
    { id: "journal", emoji: "📓", title: "Journal — 3 wins, 1 fix, 1 trade idea", note: "5 minutes. Track the streak. Track the change.", xp: 60, cat: "mind", hour: 22 },
    { id: "pray_pm", emoji: "🕯️", title: "Night prayer + Hallow session", note: "Open Hallow → Night Prayer or Examen. Hand the day to God.", xp: 70, cat: "faith", hour: 22 },
    { id: "supp_pm", emoji: "🌙", title: "PM stack: Magnesium 400mg", note: "Better sleep = better recovery = no muscle burn.", xp: 30, cat: "fuel", hour: 23 },
    { id: "summary", emoji: "📊", title: "Open Daily Summary", note: "Tap the Today tab → review your recap. Close the loop.", xp: 50, cat: "ritual", hour: 23 },
    { id: "sleep",   emoji: "🛏️", title: "Lights out by 11 PM (8+ hr)", note: "Sleep is the #1 looksmax AND the #1 trader edge.", xp: 90, cat: "ritual", hour: 23 },
  ],
  1: [
    { id: "wake",    emoji: "⏰", title: "Wake up — automatic now", note: "Body clock locked in.", xp: 60, cat: "ritual", hour: 7 },
    { id: "pray_am", emoji: "🙏", title: "Morning prayer + verse of the day", note: "'I can do all things through Christ who strengthens me.' — Phil 4:13", xp: 70, cat: "faith", hour: 7 },
    { id: "cold",    emoji: "🥶", title: "Cold shower + face splash", note: "Reduces inflammation. Sharpens features.", xp: 80, cat: "looks", hour: 8 },
    { id: "water",   emoji: "💧", title: "1L water + black coffee", note: "Coffee = appetite suppressant in deficit phase.", xp: 30, cat: "fuel", hour: 8 },
    { id: "supp_am", emoji: "💊", title: "Full AM stack + EAAs", note: "Add 10g EAAs — anti-catabolic insurance during cut.", xp: 50, cat: "fuel", hour: 9 },
    { id: "study",   emoji: "🤖", title: "Study block — 60 min (see Study tab)", note: "Follow the planner. Build > consume. Ship the tiny thing.", xp: 140, cat: "money", hour: 10 },
    { id: "brunch",  emoji: "🍳", title: "Brunch — 60g+ protein (meal 1 of 2)", note: "Egg whites + lean meat + greens. Defend muscle in the deficit.", xp: 70, cat: "fuel", hour: 12 },
    { id: "study2",  emoji: "📈", title: "Study block #2 — 60 min (markets/AI)", note: "Chart review + 1 paper trade OR ship a code change.", xp: 130, cat: "money", hour: 14 },
    { id: "scripture", emoji: "📖", title: "Gospel reading — 1 passage", note: "John in the deficit — words that hold the body together.", xp: 80, cat: "faith", hour: 16 },
    { id: "lift",    emoji: "🏋️", title: "Gym — Push / Pull / Legs (heavy barbell)", note: "Heavy compounds + long accessory sets keep muscle in deficit. 5×10 RPE 8.", xp: 170, cat: "body", hour: 18 },
    { id: "dinner",  emoji: "🍽️", title: "Dinner — lean + low carb (meal 2 of 2)", note: "Turkey/fish + roasted veg. Hit total protein for the day.", xp: 60, cat: "fuel", hour: 19 },
    { id: "craving", emoji: "🧂", title: "Crush cravings — pick 2", note: "Greek yogurt · pickles · sparkling water · gum · 20 push-ups.", xp: 60, cat: "fuel", hour: 20 },
    { id: "deepwk",  emoji: "🎯", title: "90 min deep work — ship/study", note: "AI build OR trading review. Phone in another room.", xp: 120, cat: "mind", hour: 21 },
    { id: "social",  emoji: "📸", title: "Social platform — 15 min ideation", note: "Sketch 1 feature for the looksmax social app you'll build.", xp: 60, cat: "money", hour: 21 },
    { id: "photo",   emoji: "🤳", title: "Weekly progress photo (Sun)", note: "Same lighting · same pose · don't lie to yourself.", xp: 40, cat: "looks", hour: 22 },
    { id: "journal", emoji: "📓", title: "Journal + tomorrow planned", note: "Wake with direction, not questions.", xp: 60, cat: "mind", hour: 22 },
    { id: "pray_pm", emoji: "🕯️", title: "Night prayer + Hallow Examen", note: "Open Hallow → Examen. Lay the cut at His feet.", xp: 80, cat: "faith", hour: 22 },
    { id: "supp_pm", emoji: "🌙", title: "Magnesium + Zinc + ZMA", note: "Recovery stack — protects muscle and sleep depth.", xp: 30, cat: "fuel", hour: 23 },
    { id: "summary", emoji: "📊", title: "Open Daily Summary", note: "Review your recap. Close the loop on the day.", xp: 50, cat: "ritual", hour: 23 },
    { id: "sleep",   emoji: "🛏️", title: "Lights out 11:30 PM (8+ hr)", note: "Recovery in deficit. Sleep is the cheat code.", xp: 100, cat: "ritual", hour: 23 },
  ],
  2: [
    { id: "wake",    emoji: "🌄", title: "Natural wake — no alarm", note: "You don't need it anymore.", xp: 70, cat: "ritual", hour: 7 },
    { id: "pray_am", emoji: "🙏", title: "Morning prayer + worship 5 min", note: "'Commit your work to the Lord, and your plans will be established.' — Pr 16:3", xp: 80, cat: "faith", hour: 7 },
    { id: "cold",    emoji: "🥶", title: "Cold shower — automatic", note: "It's just who you are now.", xp: 80, cat: "looks", hour: 8 },
    { id: "water",   emoji: "💧", title: "1L water + coffee", note: "Hydration habit locked.", xp: 30, cat: "fuel", hour: 8 },
    { id: "supp_am", emoji: "💊", title: "Full AM stack", note: "Same dialed-in protocol.", xp: 40, cat: "fuel", hour: 9 },
    { id: "study",   emoji: "🤖", title: "Study block — 75 min, ship the project", note: "Follow the planner — final phase is BUILD week. Code > consume.", xp: 160, cat: "money", hour: 10 },
    { id: "brunch",  emoji: "🍳", title: "Brunch — refeed (meal 1 of 2)", note: "Eggs + oats + berries + lean meat. Carbs back, fuel the lift.", xp: 70, cat: "fuel", hour: 12 },
    { id: "study2",  emoji: "📈", title: "Study block #2 — 60 min synergy", note: "Where AI meets markets. Build a tool, run a backtest, journal a setup.", xp: 140, cat: "money", hour: 14 },
    { id: "scripture", emoji: "📖", title: "Gospel — 1 passage + reflect", note: "Read a parable, write 1 line. Carry it through the lift.", xp: 90, cat: "faith", hour: 16 },
    { id: "lift",    emoji: "🏋️", title: "Gym — Push / Pull / Legs, PR week", note: "Barbell PRs back on the table. 5×6 heavy + 3×12 accessory.", xp: 180, cat: "body", hour: 18 },
    { id: "dinner",  emoji: "🍽️", title: "Dinner — steak + potato + greens (meal 2 of 2)", note: "Earned. Eat like the man you're becoming.", xp: 70, cat: "fuel", hour: 19 },
    { id: "craving", emoji: "🧂", title: "Cravings — barely noticed", note: "Habit is the cure. Keep tools handy anyway.", xp: 40, cat: "fuel", hour: 20 },
    { id: "deepwk",  emoji: "🎯", title: "Deep work — biggest project", note: "Body's done. Now build the life and the bag.", xp: 130, cat: "mind", hour: 21 },
    { id: "social",  emoji: "📸", title: "Social platform — mockup screen", note: "One screen of the looksmax social app per week.", xp: 80, cat: "money", hour: 21 },
    { id: "photo",   emoji: "🤳", title: "Final-week progress photo", note: "Compare to Day 1. Feel it.", xp: 50, cat: "looks", hour: 22 },
    { id: "journal", emoji: "📓", title: "Journal — vision + next 60", note: "What's the next version? What's the next product?", xp: 70, cat: "mind", hour: 22 },
    { id: "pray_pm", emoji: "🕯️", title: "Night prayer + Hallow Examen", note: "End in gratitude. Sleep with peace, not tabs open.", xp: 80, cat: "faith", hour: 22 },
    { id: "supp_pm", emoji: "🌙", title: "PM stack", note: "Magnesium + Zinc + L-Theanine.", xp: 30, cat: "fuel", hour: 23 },
    { id: "summary", emoji: "📊", title: "Open Daily Summary", note: "Lock in the recap. Plan tomorrow before bed.", xp: 50, cat: "ritual", hour: 23 },
    { id: "sleep",   emoji: "🛏️", title: "Sleep by 11:30 PM (8+ hr)", note: "Wake feeling like a different species.", xp: 100, cat: "ritual", hour: 23 },
  ],
};

export const QUOTES: string[] = [
  "Discipline equals freedom.",
  "The body you want is built by the choices you make today.",
  "You're not tired. You're untrained.",
  "Every meal is a vote for who you're becoming.",
  "Sleep is the cheat code. Take it.",
  "Your future self is watching. Don't disappoint him.",
  "Lift. Learn. Sleep. Repeat. The life follows.",
  "Discomfort now or regret forever. Pick.",
  "Cold water. Hot ambition.",
  "Two months. One version. No excuses.",
  "The mirror doesn't lie. Neither does the streak.",
  "Hard now, easy later.",
  "You don't rise to your goals. You fall to your habits.",
  "Protein protects the work. Don't skip it.",
  "Be the guy people google.",
  "If it's not on the checklist, it doesn't exist.",
  "The work works. Trust it.",
  "60 days from now you'll wish you'd started today. So start today.",
  "You are exactly what you tolerate.",
  "Skill stacks compound. Stack daily.",
  "Pretty face built ugly: in the dark, alone, on Tuesday.",
  "Glow up isn't aesthetic. It's a religion.",
  "Old you was a draft. Ship the final.",
  "Cravings are 5 minutes. Regret is 24 hours. Wait it out.",
  "AI is the new gym. Show up daily.",
  "I can do all things through Christ who strengthens me. — Phil 4:13",
  "The Lord is my strength and my shield. — Ps 28:7",
  "Wait for the Lord; be strong, and let your heart take courage. — Ps 27:14",
  "Commit your work to the Lord, and your plans will be established. — Pr 16:3",
  "He gives power to the faint, and to him who has no might he increases strength. — Is 40:29",
  "Let us not grow weary of doing good. — Gal 6:9",
  "God didn't give you the spirit of fear, but of power, love, and a sound mind. — 2 Tim 1:7",
  "Cast all your anxiety on Him, because He cares for you. — 1 Pet 5:7",
  "Be strong and courageous. The Lord your God is with you. — Josh 1:9",
  "Whatever you do, work heartily, as for the Lord. — Col 3:23",
];

export const SUPPLEMENTS = [
  { time: "Morning", items: "Vitamin D3 5000IU · Omega-3 2g · Multivitamin · Creatine 5g · Caffeine 100-200mg" },
  { time: "Pre-Workout", items: "Citrulline Malate 6g · EAAs 10g (anti-catabolic) · Beta-Alanine 3g (optional)" },
  { time: "Post-Workout", items: "Whey Protein 30g + Creatine 5g + Carbs 30g (recovery)" },
  { time: "With Meals", items: "Digestive Enzyme · Probiotic" },
  { time: "Before Bed", items: "Magnesium Glycinate 300-400mg · Zinc 15mg · L-Theanine 200mg" },
];

export const CRAVING_KILLERS: { emoji: string; title: string; note: string }[] = [
  { emoji: "🥒", title: "Pickles or olives", note: "Salty + zero sugar. Kills sweet cravings in seconds." },
  { emoji: "💧", title: "Sparkling water + lemon", note: "Stretches the stomach. Most cravings are thirst in disguise." },
  { emoji: "☕", title: "Black coffee or green tea", note: "Caffeine + L-theanine = appetite off-switch." },
  { emoji: "🪥", title: "Brush your teeth", note: "Mint flavor signals 'kitchen closed' to the brain." },
  { emoji: "💪", title: "20 push-ups", note: "Reroutes the urge. Adrenaline kills appetite for ~30 min." },
  { emoji: "🧂", title: "Electrolytes (sodium + potassium)", note: "Cravings on a cut are usually a salt deficit, not hunger." },
  { emoji: "🍫", title: "1 square 90% dark chocolate", note: "Bitter + tiny. Satisfies without breaking the deficit." },
  { emoji: "🥛", title: "Greek yogurt + cinnamon", note: "30g protein + sweet hit + blood sugar control." },
  { emoji: "🚶", title: "10 min walk outside", note: "Cravings die in sunlight. Almost every time." },
  { emoji: "⏱️", title: "Set a 15-min timer", note: "Cravings peak then crash. Outlast it once and you own it." },
];

export const COURSES: { provider: string; name: string; topic: "ai" | "trading"; note: string; url: string }[] = [
  // AI
  { provider: "DeepLearning.AI", name: "ChatGPT Prompt Engineering for Devs", topic: "ai", note: "Free · 1 hour · Andrew Ng. Start here.", url: "https://www.deeplearning.ai/short-courses/chatgpt-prompt-engineering-for-developers/" },
  { provider: "DeepLearning.AI", name: "Building Systems with the ChatGPT API", topic: "ai", note: "Free · ship a real GPT-powered app.", url: "https://www.deeplearning.ai/short-courses/building-systems-with-chatgpt/" },
  { provider: "Coursera", name: "Generative AI with LLMs", topic: "ai", note: "AWS-backed. Deep dive on how LLMs work.", url: "https://www.coursera.org/learn/generative-ai-with-llms" },
  { provider: "fast.ai", name: "Practical Deep Learning for Coders", topic: "ai", note: "Free. Best in the game if you can code.", url: "https://course.fast.ai/" },
  { provider: "Hugging Face", name: "NLP / LLM Course", topic: "ai", note: "Free · open source · transformers from scratch.", url: "https://huggingface.co/learn" },
  // Trading
  { provider: "Investopedia Academy", name: "Become a Day Trader", topic: "trading", note: "Solid fundamentals. No guru fluff.", url: "https://academy.investopedia.com/products/become-a-day-trader" },
  { provider: "Babypips", name: "School of Pipsology", topic: "trading", note: "Free. The classic intro to markets and FX.", url: "https://www.babypips.com/learn/forex" },
  { provider: "TrendSpider U", name: "Technical Analysis Basics", topic: "trading", note: "Free chart-reading + indicators.", url: "https://trendspider.com/university/" },
  { provider: "Stock Investing 101 (Coursera/Yale)", name: "Financial Markets — Robert Shiller", topic: "trading", note: "Free audit. Understand WHY markets move.", url: "https://www.coursera.org/learn/financial-markets-global" },
  { provider: "Bookmap / SMB Capital (YouTube)", name: "Order Flow & Tape Reading", topic: "trading", note: "Free YouTube playlists from real prop traders.", url: "https://www.youtube.com/@smbcapital" },
];

export const SOCIAL_VISION = {
  name: "Project: Looksmax Social",
  pitch: "A social platform for guys on the glow up — daily check-ins, before/after walls, routine sharing, AI face-rating with consent, and verified transformations.",
  pillars: [
    "🤳 Verified transformations (timestamped photos, not filters)",
    "🧠 Routine library — copy proven 60-day plans in one tap",
    "🤝 Squads of 5 — shared streaks, accountability DMs",
    "🤖 AI coach — analyzes your routine, suggests upgrades",
    "📈 Glow-up score — bone structure · skin · physique · style",
    "🛡️ No bullying. No looksmaxxing extremes. Health-first moderation.",
  ],
  weeklyStep: "Each week: 1 mockup screen · 1 user interview · 1 paragraph of pitch.",
};

// ─────────────────────────────────────────────────────────────────────────────
// LEARNING PATHS — beginner trading → AI corporate beginner → synergy
// Used by the Study tab as a curated "what to do, in what order" guide.
// ─────────────────────────────────────────────────────────────────────────────
export type LearningPath = {
  id: "trading" | "ai" | "synergy";
  emoji: string;
  name: string;
  level: string;
  pitch: string;
  steps: { title: string; note: string }[];
};

export const LEARNING_PATHS: LearningPath[] = [
  {
    id: "trading",
    emoji: "📈",
    name: "Day Trading — Beginner",
    level: "Start here · weeks 1-3",
    pitch: "Learn how markets move before you risk a dollar. 30 days of paper-trading minimum.",
    steps: [
      { title: "Babypips — Pre-school + Kindergarten", note: "Free vocab + how accounts blow up. 2-3 hrs total." },
      { title: "Read a candlestick chart", note: "One pattern locked in (Investopedia · 25 min)." },
      { title: "Open TradingView paper account", note: "Zero real money. This is the rule for 30 days." },
      { title: "Babypips — Elementary: S/R + Fibonacci", note: "Real chart-reading begins here." },
      { title: "Watch market open · journal 1 setup (no trade)", note: "Read price action live. Don't click." },
      { title: "Top 3 indicators only — RSI, MACD, MA", note: "Never add a 4th. Discipline is the edge." },
    ],
  },
  {
    id: "ai",
    emoji: "🤖",
    name: "AI for Corporate — Beginner",
    level: "Weeks 2-5 · in parallel with trading",
    pitch: "Become the guy at work who ships AI tools. The skill that pays in 2026 corporate jobs.",
    steps: [
      { title: "DeepLearning.AI · Prompt Engineering for Devs", note: "Free · 1 hr · Andrew Ng. The base of everything." },
      { title: "Save your top 10 work prompts in a doc", note: "Email · summarize · draft · plan · brainstorm." },
      { title: "Build a custom GPT for ONE annoying task", note: "Your first shipped product. Even if tiny." },
      { title: "DeepLearning.AI · Building Systems w/ ChatGPT API", note: "Move from chat → API. Where money lives." },
      { title: "Try n8n or Make.com · 1 simple automation", note: "Skill that pays freelance immediately." },
      { title: "LangChain quickstart — give an LLM your data", note: "RAG basics. Real corporate use case." },
    ],
  },
  {
    id: "synergy",
    emoji: "⚡",
    name: "Where They Meet",
    level: "Weeks 5-8 · the unfair advantage",
    pitch: "AI + Markets = leverage no one has. This is what the 60 days are really for.",
    steps: [
      { title: "GPT that critiques your trade journal", note: "Paste entry → get back risk · setup · psychology notes." },
      { title: "Backtest a strategy with ChatGPT-generated rules", note: "Convert your gut feel into testable code." },
      { title: "Build an alert bot (n8n + LLM + webhook)", note: "When X happens on Y chart → DM me a summary." },
      { title: "Write your trading rules — 1 page max", note: "Have a GPT pressure-test them. If you can't defend it, drop it." },
      { title: "Public post: 'I built X · here's what I learned'", note: "Distribution is the real moat. Build in public." },
      { title: "Looksmax Social — pitch deck (5 slides)", note: "AI + community + transformation. Ship the artifact." },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// FAITH — verses, prayers, devotionals you can lean on every day
// ─────────────────────────────────────────────────────────────────────────────
export const VERSES_BY_THEME: { theme: string; verses: { ref: string; text: string }[] }[] = [
  {
    theme: "When you're tired",
    verses: [
      { ref: "Isaiah 40:31", text: "They who wait for the Lord shall renew their strength; they shall mount up with wings like eagles." },
      { ref: "Matthew 11:28", text: "Come to me, all who labor and are heavy laden, and I will give you rest." },
      { ref: "Psalm 23:1-3", text: "The Lord is my shepherd; I shall not want… He restores my soul." },
    ],
  },
  {
    theme: "When cravings hit",
    verses: [
      { ref: "1 Corinthians 10:13", text: "God is faithful — he will not let you be tempted beyond your ability, but will provide a way of escape." },
      { ref: "Galatians 5:22-23", text: "The fruit of the Spirit is… self-control." },
      { ref: "Proverbs 25:28", text: "A man without self-control is like a city broken into and left without walls." },
    ],
  },
  {
    theme: "When you want to quit",
    verses: [
      { ref: "Galatians 6:9", text: "Let us not grow weary of doing good, for in due season we will reap, if we do not give up." },
      { ref: "Hebrews 12:1-2", text: "Run with endurance the race that is set before you, looking to Jesus." },
      { ref: "Philippians 4:13", text: "I can do all things through him who strengthens me." },
    ],
  },
  {
    theme: "When you fall off",
    verses: [
      { ref: "Lamentations 3:22-23", text: "His mercies… are new every morning." },
      { ref: "Proverbs 24:16", text: "The righteous falls seven times and rises again." },
      { ref: "1 John 1:9", text: "If we confess our sins, he is faithful and just to forgive us." },
    ],
  },
  {
    theme: "For the body",
    verses: [
      { ref: "1 Corinthians 6:19-20", text: "Your body is a temple of the Holy Spirit… so glorify God in your body." },
      { ref: "1 Timothy 4:8", text: "Bodily training is of some value, but godliness is of value in every way." },
    ],
  },
  {
    theme: "For the work",
    verses: [
      { ref: "Colossians 3:23", text: "Whatever you do, work heartily, as for the Lord and not for men." },
      { ref: "Proverbs 16:3", text: "Commit your work to the Lord, and your plans will be established." },
      { ref: "Ecclesiastes 9:10", text: "Whatever your hand finds to do, do it with your might." },
    ],
  },
];

export const PRAYERS = [
  {
    title: "Morning prayer",
    body: "Father, this day is yours. Give me strength for the cold, focus for the work, discipline for the table, and a soft heart for the people I meet. Make my body a temple. Make my mind sharp. Make my will yours. In Jesus' name, amen.",
  },
  {
    title: "Pre-workout prayer",
    body: "Lord, you are my strength. Let every rep be worship. Protect my body, build it up, and keep me humble in the gain. Amen.",
  },
  {
    title: "When the craving hits",
    body: "Jesus, I'm weak right now. Be my way of escape. Give me 5 more minutes of patience. Replace this hunger with hunger for you. Amen.",
  },
  {
    title: "Night prayer",
    body: "Father, thank you for today — the wins and the failures. Forgive what I missed. Heal my body in sleep. Wake me ready. I trust you with tomorrow. Amen.",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// STUDY PLANNER — 8 weeks, 1 lesson/day across AI + Trading + Faith reading
// ─────────────────────────────────────────────────────────────────────────────
export type Lesson = {
  id: string;
  week: number;
  day: number;          // day-of-program 1..60
  track: "ai" | "trading" | "build" | "faith";
  title: string;
  why: string;
  url?: string;
  minutes: number;
};

const w = (week: number, dayInWeek: number) => (week - 1) * 7 + dayInWeek;

export const STUDY_PLAN: Lesson[] = [
  // ── WEEK 1 — orientation
  { id: "l1",  week: 1, day: w(1,1), track: "ai",      title: "ChatGPT Prompt Engineering — Lesson 1: Guidelines",          why: "The base of everything. 20 min, free.",                     url: "https://www.deeplearning.ai/short-courses/chatgpt-prompt-engineering-for-developers/", minutes: 25 },
  { id: "l2",  week: 1, day: w(1,2), track: "trading", title: "Babypips — Pre-school: What is Forex/Markets",               why: "Vocab. You can't trade what you can't name.",                url: "https://www.babypips.com/learn/forex/preschool", minutes: 30 },
  { id: "l3",  week: 1, day: w(1,3), track: "ai",      title: "Prompt Engineering — Lesson 2: Iterative",                   why: "How pros refine prompts. Steal the framework.",              url: "https://www.deeplearning.ai/short-courses/chatgpt-prompt-engineering-for-developers/", minutes: 25 },
  { id: "l4",  week: 1, day: w(1,4), track: "trading", title: "Investopedia — Reading a candlestick chart",                 why: "One chart pattern, locked in.",                              url: "https://www.investopedia.com/trading/candlestick-charting-what-is-it/", minutes: 25 },
  { id: "l5",  week: 1, day: w(1,5), track: "ai",      title: "Prompt Engineering — Lesson 3: Summarizing & Inferring",     why: "Practical use #1: summarize anything in seconds.",           url: "https://www.deeplearning.ai/short-courses/chatgpt-prompt-engineering-for-developers/", minutes: 25 },
  { id: "l6",  week: 1, day: w(1,6), track: "build",   title: "BUILD: write your first 10 prompts in a Google Doc",         why: "Save prompts you'd actually use weekly.",                                                                                          minutes: 30 },
  { id: "l7",  week: 1, day: w(1,7), track: "faith",   title: "Read Mark 1 + open Hallow",                                  why: "The action gospel — start where Christ starts. Day of rest.",                                                                       minutes: 25 },

  // ── WEEK 2 — fundamentals
  { id: "l8",  week: 2, day: w(2,1), track: "ai",      title: "Prompt Engineering — Lessons 4-5",                           why: "Transforming + expanding text. Real superpower.",            url: "https://www.deeplearning.ai/short-courses/chatgpt-prompt-engineering-for-developers/", minutes: 30 },
  { id: "l9",  week: 2, day: w(2,2), track: "trading", title: "Babypips — Kindergarten: Margin & Leverage",                 why: "How accounts blow up. Don't be that guy.",                   url: "https://www.babypips.com/learn/forex/kindergarten", minutes: 30 },
  { id: "l10", week: 2, day: w(2,3), track: "ai",      title: "Prompt Engineering — Lesson 6: Chatbot",                     why: "End of course. You now have the basic toolkit.",             url: "https://www.deeplearning.ai/short-courses/chatgpt-prompt-engineering-for-developers/", minutes: 30 },
  { id: "l11", week: 2, day: w(2,4), track: "trading", title: "Investopedia — Support, Resistance, Trendlines",             why: "The 3 lines that make or break every trade.",                url: "https://www.investopedia.com/trading/support-and-resistance-basics/", minutes: 25 },
  { id: "l12", week: 2, day: w(2,5), track: "ai",      title: "Building Systems w/ ChatGPT API — Lesson 1",                why: "Move from chat to API. Where money lives.",                  url: "https://www.deeplearning.ai/short-courses/building-systems-with-chatgpt/", minutes: 35 },
  { id: "l13", week: 2, day: w(2,6), track: "build",   title: "BUILD: a custom GPT for one annoying daily task",            why: "First shipped product. Even if tiny.",                                                                                             minutes: 45 },
  { id: "l14", week: 2, day: w(2,7), track: "faith",   title: "Read Psalms 1, 23, 91 + journal",                            why: "Three psalms every man should memorize.",                                                                                          minutes: 25 },

  // ── WEEK 3
  { id: "l15", week: 3, day: w(3,1), track: "trading", title: "Open paper-trading account (TradingView or ThinkOrSwim)",    why: "No real money for 30 days. This is the rule.",               url: "https://www.tradingview.com/", minutes: 30 },
  { id: "l16", week: 3, day: w(3,2), track: "ai",      title: "Building Systems — Lesson 2-3: Moderation + Chains",         why: "How serious AI apps actually work.",                         url: "https://www.deeplearning.ai/short-courses/building-systems-with-chatgpt/", minutes: 35 },
  { id: "l17", week: 3, day: w(3,3), track: "trading", title: "Babypips — Elementary: Support/Resistance + Fibonacci",      why: "Real chart-reading begins here.",                            url: "https://www.babypips.com/learn/forex/elementary", minutes: 35 },
  { id: "l18", week: 3, day: w(3,4), track: "ai",      title: "Building Systems — Lesson 4-5: Eval + Q&A",                  why: "How to know if your prompt actually works.",                 url: "https://www.deeplearning.ai/short-courses/building-systems-with-chatgpt/", minutes: 35 },
  { id: "l19", week: 3, day: w(3,5), track: "trading", title: "Watch market open + journal 1 setup (no trade)",             why: "Read price action live. Don't click.",                                                                                             minutes: 30 },
  { id: "l20", week: 3, day: w(3,6), track: "build",   title: "BUILD: GPT that critiques your trade journal",               why: "Combine both tracks. This is the unfair advantage.",                                                                               minutes: 60 },
  { id: "l21", week: 3, day: w(3,7), track: "faith",   title: "Read Romans 8 + journal",                                    why: "The chapter every man should read in a deficit.",                                                                                  minutes: 30 },

  // ── WEEK 4
  { id: "l22", week: 4, day: w(4,1), track: "ai",      title: "OpenAI Cookbook — pick 1 recipe and run it",                 why: "Real code. Even if you copy/paste.",                         url: "https://github.com/openai/openai-cookbook", minutes: 45 },
  { id: "l23", week: 4, day: w(4,2), track: "trading", title: "Babypips — Middle School: Indicators (RSI, MACD, MA)",       why: "Top 3 indicators. Don't add a 4th. Ever.",                   url: "https://www.babypips.com/learn/forex/middle-school", minutes: 35 },
  { id: "l24", week: 4, day: w(4,3), track: "ai",      title: "n8n / Make.com — build 1 simple automation",                why: "Skill that pays freelance immediately.",                     url: "https://docs.n8n.io/", minutes: 45 },
  { id: "l25", week: 4, day: w(4,4), track: "trading", title: "Paper trade: 1 setup, full journal entry",                   why: "Entry · stop · target · feeling. All four.",                                                                                       minutes: 30 },
  { id: "l26", week: 4, day: w(4,5), track: "ai",      title: "LangChain or LlamaIndex — 1 quickstart",                     why: "How to give an LLM your own data.",                          url: "https://python.langchain.com/docs/get_started/quickstart", minutes: 45 },
  { id: "l27", week: 4, day: w(4,6), track: "build",   title: "BUILD: Looksmax Social — sketch home screen on paper",       why: "Day 1 of the future product.",                                                                                                     minutes: 45 },
  { id: "l28", week: 4, day: w(4,7), track: "faith",   title: "Read Ecclesiastes 1-3 + journal",                            why: "Vanity check. Keeps the ego in line.",                                                                                              minutes: 30 },

  // ── WEEK 5
  { id: "l29", week: 5, day: w(5,1), track: "ai",      title: "Hugging Face — NLP Course Chapter 1",                        why: "Free, deep, and respected.",                                 url: "https://huggingface.co/learn/nlp-course/chapter1", minutes: 40 },
  { id: "l30", week: 5, day: w(5,2), track: "trading", title: "SMB Capital YouTube — 1 'mental model' video",               why: "Real prop firm. Real edge.",                                 url: "https://www.youtube.com/@smbcapital", minutes: 25 },
  { id: "l31", week: 5, day: w(5,3), track: "ai",      title: "Hugging Face — Chapter 2: Transformers",                     why: "Now you know what GPT actually is.",                         url: "https://huggingface.co/learn/nlp-course/chapter2", minutes: 45 },
  { id: "l32", week: 5, day: w(5,4), track: "trading", title: "Backtest 1 strategy on TradingView (manual, 20 trades)",     why: "Most setups don't work. Find out cheaply.",                                                                                        minutes: 45 },
  { id: "l33", week: 5, day: w(5,5), track: "ai",      title: "Build a Chrome extension w/ AI (any tutorial)",              why: "Distribution channel + portfolio.",                                                                                                minutes: 60 },
  { id: "l34", week: 5, day: w(5,6), track: "build",   title: "BUILD: Looksmax Social — wireframe profile screen",          why: "Week 2 of the product.",                                                                                                           minutes: 45 },
  { id: "l35", week: 5, day: w(5,7), track: "faith",   title: "Read Matthew 5-7 (Sermon on the Mount)",                     why: "The blueprint for the man you're becoming.",                                                                                       minutes: 40 },

  // ── WEEK 6
  { id: "l36", week: 6, day: w(6,1), track: "ai",      title: "Pick 1 LLM API (OpenAI/Anthropic/Gemini) — billing setup",   why: "You need the keys to ship anything serious.",                                                                                      minutes: 30 },
  { id: "l37", week: 6, day: w(6,2), track: "trading", title: "Read 'Trading in the Zone' — Ch 1-2",                        why: "Psychology > strategy. Always.",                                                                                                   minutes: 40 },
  { id: "l38", week: 6, day: w(6,3), track: "ai",      title: "Build a tiny SaaS landing page (Carrd / Framer)",            why: "First $ requires a page to send people to.",                                                                                       minutes: 60 },
  { id: "l39", week: 6, day: w(6,4), track: "trading", title: "Paper trade week — review + tag winners",                    why: "Find YOUR setup. The one that fits you.",                                                                                          minutes: 45 },
  { id: "l40", week: 6, day: w(6,5), track: "ai",      title: "Connect your GPT to your landing page (form → email)",       why: "First lead-gen loop in your life.",                                                                                                minutes: 60 },
  { id: "l41", week: 6, day: w(6,6), track: "build",   title: "BUILD: Looksmax Social — pitch in 100 words",                why: "If you can't pitch it, you can't ship it.",                                                                                        minutes: 30 },
  { id: "l42", week: 6, day: w(6,7), track: "faith",   title: "Read James 1 + journal on patience",                         why: "Patience is the trader's edge AND the disciple's.",                                                                                minutes: 30 },

  // ── WEEK 7
  { id: "l43", week: 7, day: w(7,1), track: "build",   title: "BUILD WEEK: pick ONE AI project. Scope it tiny.",            why: "Too big = nothing ships. Tiny = portfolio piece.",                                                                                 minutes: 45 },
  { id: "l44", week: 7, day: w(7,2), track: "build",   title: "Build the MVP — 90 min focused block",                       why: "Working > pretty.",                                                                                                                minutes: 90 },
  { id: "l45", week: 7, day: w(7,3), track: "build",   title: "Polish the UX — 1 round only",                               why: "Don't golden-plate. Ship.",                                                                                                        minutes: 60 },
  { id: "l46", week: 7, day: w(7,4), track: "trading", title: "Live paper trade w/ real risk math",                         why: "Risk < 1% per trade. Always.",                                                                                                     minutes: 45 },
  { id: "l47", week: 7, day: w(7,5), track: "build",   title: "Deploy the MVP (Vercel / Lovable / Netlify)",                why: "Live URL or it doesn't count.",                                                                                                    minutes: 60 },
  { id: "l48", week: 7, day: w(7,6), track: "build",   title: "BUILD: Looksmax Social — design 1 real Figma screen",        why: "From paper to pixels.",                                                                                                            minutes: 60 },
  { id: "l49", week: 7, day: w(7,7), track: "faith",   title: "Read Philippians (whole book, 4 chapters)",                  why: "Joy + contentment + Phil 4:13. The cap-stone.",                                                                                    minutes: 40 },

  // ── WEEK 8
  { id: "l50", week: 8, day: w(8,1), track: "build",   title: "Share MVP with 5 people. Collect feedback.",                 why: "First users beat first features.",                                                                                                 minutes: 45 },
  { id: "l51", week: 8, day: w(8,2), track: "trading", title: "Write your trading rules — 1 page max",                      why: "If it's not written, you'll break it.",                                                                                            minutes: 30 },
  { id: "l52", week: 8, day: w(8,3), track: "build",   title: "Iterate: ship 1 fix from feedback",                          why: "Users → fix → users. The loop.",                                                                                                   minutes: 60 },
  { id: "l53", week: 8, day: w(8,4), track: "trading", title: "Decide: continue paper, or fund a small live account",       why: "Only after 30+ days of profitable paper.",                                                                                         minutes: 30 },
  { id: "l54", week: 8, day: w(8,5), track: "build",   title: "Write a public post about what you built / learned",         why: "Distribution = the real moat. Build in public.",                                                                                   minutes: 45 },
  { id: "l55", week: 8, day: w(8,6), track: "build",   title: "Looksmax Social — pitch deck (5 slides)",                    why: "End the 60 days with a real artifact.",                                                                                            minutes: 60 },
  { id: "l56", week: 8, day: w(8,7), track: "faith",   title: "Read Joshua 1 + plan the NEXT 60 days with God",             why: "Be strong and courageous. Start the next chapter.",                                                                                minutes: 45 },

  // tail (days 57-60 already covered; pad so day-lookup never empty)
  { id: "l57", week: 8, day: 57, track: "build",   title: "Reflection — write 'who I was vs who I am' (1 page)",            why: "Make the win conscious.",                                                                                                          minutes: 30 },
  { id: "l58", week: 8, day: 58, track: "build",   title: "Plan: next 60-day skill",                                        why: "Compound. Don't stop.",                                                                                                            minutes: 30 },
  { id: "l59", week: 8, day: 59, track: "faith",   title: "Read Psalm 103 — gratitude pass",                                why: "End in worship.",                                                                                                                  minutes: 20 },
  { id: "l60", week: 8, day: 60, track: "build",   title: "Day 60. Take the after-photo. Pray. Restart Day 1 if you want.", why: "The streak doesn't end. It compounds.",                                                                                            minutes: 30 },
];

// ─────────────────────────────────────────────────────────────────────────────
// UNLOCKS — features locked behind progress, revealed as you earn it
// ─────────────────────────────────────────────────────────────────────────────
export const UNLOCKS: Unlock[] = [
  { id: "study",   name: "Study Planner",      emoji: "🤖", blurb: "60-day AI + Trading curriculum, 1 lesson per day.", requireDay: 1 },
  { id: "faith",   name: "Faith Vault",        emoji: "✝️", blurb: "Verses, prayers, devotionals — for any moment.",     requireDay: 1 },
  { id: "cravings",name: "Craving Killers",    emoji: "🧂", blurb: "10 tools to crush hunger in 5 minutes.",             requireStreak: 2 },
  { id: "dumbbell",name: "Free-Weight Vault",  emoji: "🏋️", blurb: "Full barbell + DB routine to protect muscle.",       requireDay: 4 },
  { id: "social",  name: "Looksmax Social",    emoji: "📸", blurb: "The future product blueprint.",                       requireDay: 14 },
  { id: "phase2",  name: "Cut Phase Protocol", emoji: "🔥", blurb: "Phase 2 unlocks at Day 15. Earn it.",                requireDay: 15 },
  { id: "phase3",  name: "Lock In Protocol",   emoji: "👑", blurb: "Final phase. Carbs back, lifts heavy.",               requireDay: 43 },
  { id: "alarm",   name: "Alarm Mode",         emoji: "🚨", blurb: "Loud alarm + dialog at every check-in.",              requireStreak: 3 },
];

// ─────────────────────────────────────────────────────────────────────────────
// WORKOUT SPLIT — Push / Pull / Legs, free weights, longer sets, full coverage
// ─────────────────────────────────────────────────────────────────────────────
export type WorkoutDay = {
  id: "push" | "pull" | "legs";
  name: string;
  focus: string;
  exercises: { name: string; sets: string; muscle: string }[];
};

export const WORKOUT_SPLIT: WorkoutDay[] = [
  {
    id: "push",
    name: "PUSH",
    focus: "Chest · Shoulders · Triceps",
    exercises: [
      { name: "Barbell Bench Press",        sets: "5×8-10",   muscle: "Chest (mid)" },
      { name: "Incline DB Press",           sets: "4×10-12",  muscle: "Chest (upper)" },
      { name: "Standing Overhead Press",    sets: "5×8",      muscle: "Front delts" },
      { name: "DB Lateral Raise",           sets: "4×15",     muscle: "Side delts (V-taper)" },
      { name: "Cable Tricep Pushdown",      sets: "4×12-15",  muscle: "Triceps" },
      { name: "Overhead Tricep Extension",  sets: "3×12",     muscle: "Triceps (long head)" },
    ],
  },
  {
    id: "pull",
    name: "PULL",
    focus: "Back · Rear Delts · Biceps",
    exercises: [
      { name: "Barbell Deadlift",           sets: "4×6-8",    muscle: "Posterior chain" },
      { name: "Pull-ups (or Lat Pulldown)", sets: "5×8-10",   muscle: "Lats (width)" },
      { name: "Barbell Row",                sets: "4×10",     muscle: "Back (thickness)" },
      { name: "Face Pulls",                 sets: "4×15",     muscle: "Rear delts · posture" },
      { name: "Barbell Curl",               sets: "4×10-12",  muscle: "Biceps" },
      { name: "Hammer Curl",                sets: "3×12",     muscle: "Brachialis · forearm" },
    ],
  },
  {
    id: "legs",
    name: "LEGS + CORE",
    focus: "Quads · Hamstrings · Glutes · Calves · Core",
    exercises: [
      { name: "Barbell Back Squat",         sets: "5×8-10",   muscle: "Quads · glutes" },
      { name: "Romanian Deadlift",          sets: "4×10",     muscle: "Hamstrings · glutes" },
      { name: "Walking DB Lunges",          sets: "3×12/leg", muscle: "Quads · stability" },
      { name: "Leg Curl",                   sets: "4×12",     muscle: "Hamstrings (isolation)" },
      { name: "Standing Calf Raise",        sets: "5×15",     muscle: "Calves" },
      { name: "Hanging Leg Raise",          sets: "4×12",     muscle: "Core (lower abs)" },
      { name: "Weighted Plank",             sets: "3×45s",    muscle: "Core (stability)" },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// NUTRITION — calorie targets per phase + recommended-food picker for the log
// (Wide enough that you're not stuck logging; narrow enough to keep you honest.)
// ─────────────────────────────────────────────────────────────────────────────
export type CalorieTarget = { kcal: number; protein: number };

export const CALORIE_TARGETS: Record<number, CalorieTarget> = {
  0: { kcal: 1600, protein: 200 },  // Foundation
  1: { kcal: 1400, protein: 210 },  // Cut
  2: { kcal: 1700, protein: 200 },  // Lock In
};

export type FoodItem = {
  id: string;
  name: string;
  serving: string;
  kcal: number;
  protein: number;
  group: "protein" | "carb" | "fat" | "veg" | "fruit" | "dairy" | "snack" | "drink";
  emoji: string;
};

/**
 * Recommended foods — broad, real, cut-friendly. Not selective:
 * lean meats, eggs, dairy, fish, complex carbs, fruit, veg, nuts,
 * cut-friendly snacks. Add custom entries from the logger UI too.
 */
export const RECOMMENDED_FOODS: FoodItem[] = [
  // Protein
  { id: "chicken",   name: "Chicken breast",     serving: "6 oz / 170g",  kcal: 280, protein: 52, group: "protein", emoji: "🍗" },
  { id: "beef93",    name: "Lean ground beef 93/7", serving: "5 oz",      kcal: 280, protein: 35, group: "protein", emoji: "🥩" },
  { id: "steak",     name: "Sirloin steak",      serving: "6 oz",         kcal: 350, protein: 48, group: "protein", emoji: "🥩" },
  { id: "salmon",    name: "Salmon",             serving: "6 oz",         kcal: 360, protein: 40, group: "protein", emoji: "🐟" },
  { id: "tuna",      name: "Canned tuna (water)", serving: "1 can / 5oz", kcal: 120, protein: 27, group: "protein", emoji: "🐟" },
  { id: "tilapia",   name: "Tilapia / cod",      serving: "6 oz",         kcal: 180, protein: 36, group: "protein", emoji: "🐟" },
  { id: "turkey",    name: "Ground turkey 93/7", serving: "5 oz",         kcal: 240, protein: 33, group: "protein", emoji: "🦃" },
  { id: "eggs",      name: "Whole eggs",         serving: "3 large",      kcal: 210, protein: 18, group: "protein", emoji: "🥚" },
  { id: "eggwhites", name: "Egg whites",         serving: "1 cup",        kcal: 125, protein: 26, group: "protein", emoji: "🥚" },
  { id: "whey",      name: "Whey protein",       serving: "1 scoop",      kcal: 120, protein: 25, group: "protein", emoji: "🥤" },

  // Dairy
  { id: "greek",     name: "Greek yogurt 0%",    serving: "1 cup / 200g", kcal: 130, protein: 23, group: "dairy",   emoji: "🥛" },
  { id: "cottage",   name: "Cottage cheese 2%",  serving: "1 cup",        kcal: 180, protein: 24, group: "dairy",   emoji: "🥛" },
  { id: "milk",      name: "Skim milk",          serving: "1 cup",        kcal: 90,  protein: 8,  group: "dairy",   emoji: "🥛" },

  // Carbs
  { id: "rice",      name: "White rice (cooked)", serving: "1 cup",       kcal: 205, protein: 4,  group: "carb",    emoji: "🍚" },
  { id: "oats",      name: "Oats (dry)",         serving: "1/2 cup",      kcal: 150, protein: 5,  group: "carb",    emoji: "🥣" },
  { id: "sweetpot",  name: "Sweet potato",       serving: "1 medium",     kcal: 115, protein: 2,  group: "carb",    emoji: "🍠" },
  { id: "potato",    name: "Potato (baked)",     serving: "1 medium",     kcal: 160, protein: 4,  group: "carb",    emoji: "🥔" },
  { id: "ezekiel",   name: "Ezekiel bread",      serving: "1 slice",      kcal: 80,  protein: 4,  group: "carb",    emoji: "🍞" },
  { id: "quinoa",    name: "Quinoa (cooked)",    serving: "1 cup",        kcal: 220, protein: 8,  group: "carb",    emoji: "🌾" },

  // Veg
  { id: "broccoli",  name: "Broccoli",           serving: "2 cups",       kcal: 60,  protein: 5,  group: "veg",     emoji: "🥦" },
  { id: "spinach",   name: "Spinach",            serving: "2 cups",       kcal: 15,  protein: 2,  group: "veg",     emoji: "🥬" },
  { id: "asparagus", name: "Asparagus",          serving: "1 cup",        kcal: 30,  protein: 3,  group: "veg",     emoji: "🥬" },
  { id: "salad",     name: "Mixed greens salad", serving: "large bowl",   kcal: 50,  protein: 3,  group: "veg",     emoji: "🥗" },

  // Fat
  { id: "avocado",   name: "Avocado",            serving: "1/2",          kcal: 160, protein: 2,  group: "fat",     emoji: "🥑" },
  { id: "oliveoil",  name: "Olive oil",          serving: "1 tbsp",       kcal: 120, protein: 0,  group: "fat",     emoji: "🫒" },
  { id: "almonds",   name: "Almonds",            serving: "1 oz / 23",    kcal: 165, protein: 6,  group: "fat",     emoji: "🌰" },
  { id: "pb",        name: "Peanut butter",      serving: "1 tbsp",       kcal: 95,  protein: 4,  group: "fat",     emoji: "🥜" },

  // Fruit
  { id: "berries",   name: "Mixed berries",      serving: "1 cup",        kcal: 70,  protein: 1,  group: "fruit",   emoji: "🫐" },
  { id: "banana",    name: "Banana",             serving: "1 medium",     kcal: 110, protein: 1,  group: "fruit",   emoji: "🍌" },
  { id: "apple",     name: "Apple",              serving: "1 medium",     kcal: 95,  protein: 0,  group: "fruit",   emoji: "🍎" },

  // Cut-friendly snacks / drinks
  { id: "jerky",     name: "Beef jerky",         serving: "1 oz",         kcal: 80,  protein: 13, group: "snack",   emoji: "🥓" },
  { id: "darkchoc",  name: "85% dark chocolate", serving: "1 square",     kcal: 55,  protein: 1,  group: "snack",   emoji: "🍫" },
  { id: "rice cake", name: "Rice cake",          serving: "1",            kcal: 35,  protein: 1,  group: "snack",   emoji: "🍘" },
  { id: "pickles",   name: "Pickles",            serving: "2 spears",     kcal: 10,  protein: 0,  group: "snack",   emoji: "🥒" },
  { id: "coffee",    name: "Black coffee",       serving: "1 cup",        kcal: 5,   protein: 0,  group: "drink",   emoji: "☕" },
  { id: "sparkling", name: "Sparkling water",    serving: "1 can",        kcal: 0,   protein: 0,  group: "drink",   emoji: "💧" },
];

