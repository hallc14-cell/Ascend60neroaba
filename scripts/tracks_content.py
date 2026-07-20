# -*- coding: utf-8 -*-
"""
Content source for the 6 Ascend60 recovery protocols.

Each track defines 3 phase task-lists (detox → rewiring → new identity),
phase copy, quotes and metadata. Task notes carry the neuroscience "why"
(habit loop, dopamine regulation, neuroplasticity, HALT, urge surfing/SOBER).
"""


def t(tid, emoji, title, note, xp, cat, hour):
    return {"id": tid, "emoji": emoji, "title": title, "note": note,
            "xp": xp, "cat": cat, "hour": hour}


# ── Tasks shared in spirit across tracks, worded per-track where it matters ──

TRACKS = []

# =========================================================================
# 1. ALCOHOL RECOVERY
# =========================================================================
TRACKS.append({
    "id": "alcohol-recovery",
    "addictionType": "alcohol",
    "name": "Alcohol Recovery",
    "tagline": "60 days to break the loop and rewire a sober brain.",
    "description": "A neuroscience-based 60-day program to stop drinking — replace the cue→drink→relief loop with healthier rewards, calm the overactive stress response, and build a sober identity.",
    "icon": "🍺",
    "color": "#38bdf8",
    "identityName": "Sober Self Blueprint",
    "vital1": "Sleep 7-9 hrs",
    "vital2": "Hydrate 3 L/day",
    "vital3": "Move 20+ min/day",
    "vital4": "1 sober contact/day",
    "vital5": "SOBER-breathe on urges",
    "phases": [
        {"title": "Breaking the Cycle",
         "tag": "Detox & foundation. Remove the cue.",
         "vibe": "The first two weeks are about safety and subtraction. Clear alcohol from your space, flood the day with water and sleep, and meet every urge with breath instead of a bottle. You are starving an old habit loop of its cue and its reward."},
        {"title": "Rewiring the Brain",
         "tag": "New routine in the same slot.",
         "vibe": "Your brain still fires the old craving at the old time — so give it a new routine to run. Where a drink used to go, insert movement, connection, or a ritual. Every repetition thickens the new neural path and thins the old one."},
        {"title": "Building a New Identity",
         "tag": "You are a person who doesn't drink.",
         "vibe": "This isn't a streak anymore — it's who you are. You protect your sleep, your people, and your purpose. You help someone else and you plan the life sobriety makes possible."},
    ],
    "tasks0": [
        t("am_intent", "🌅", "Morning intention + water", "First thing: 500ml water, then name today's reason to stay sober out loud. Morning cortisol is high — hydration and a stated intention steady the prefrontal cortex before cravings hit.", 50, "reflection", 7),
        t("clear_cues", "🧹", "Remove one alcohol cue", "Pour out a bottle, hide the glasses, unfollow a bar page. Habits fire from cues — deleting the cue is the cheapest way to weaken the loop.", 70, "cbt", 9),
        t("hydrate_halt", "💧", "HALT check + hydrate", "Ask: am I Hungry, Angry, Lonely, Tired? Most 'cravings' are an unmet basic need. Eat, rest, or reach out instead of drinking.", 40, "mindfulness", 12),
        t("move", "🏃", "20 min movement", "Walk, run, or lift. Exercise gives you the dopamine and endorphins alcohol used to counterfeit — a clean reward that rebuilds the reward system.", 90, "physical", 18),
        t("urge_surf", "🌊", "Urge surfing — SOBER breath", "When the craving comes: Stop, Observe, Breathe, Expand awareness, Respond. Urges peak and pass in ~15-20 min like a wave. Ride it, don't fight it.", 80, "mindfulness", 20),
        t("connect", "🤝", "Reach one sober ally", "Text a friend, sponsor, or meeting. Loneliness is a top relapse trigger; connection releases oxytocin, nature's anti-craving.", 60, "social", 21),
        t("journal", "📓", "Evening journal — 3 wins, 1 trigger", "Write what worked and what tempted you. Naming triggers moves them from the reactive amygdala to the reasoning cortex.", 60, "reflection", 22),
        t("sleep", "🛏️", "Lights out — protect sleep", "In bed by a set time, no screens. Alcohol wrecks REM sleep; restoring sleep is the fastest way to cut next-day cravings.", 90, "physical", 23),
    ],
    "tasks1": [
        t("am_intent", "🌅", "Morning intention + cold splash", "Water, intention, then 30s cold water on the face. Cold exposure spikes dopamine gently for hours — a natural mood lift to start rewiring the reward baseline.", 60, "physical", 7),
        t("replace", "🔁", "Run your replacement ritual", "At your old drinking time, do the swap you chose (tea ritual, walk, gym, call). Same cue, new routine — this is the core of habit rewiring.", 90, "cbt", 18),
        t("meditate", "🧘", "10 min mindfulness", "Sit and watch the breath. Meditation strengthens the prefrontal cortex's control over impulsive urges and lowers baseline stress.", 80, "mindfulness", 12),
        t("move", "🏋️", "30 min exercise", "Push a little harder than week one. Consistent training re-sensitizes dopamine receptors dulled by alcohol.", 100, "physical", 19),
        t("trigger_plan", "🧠", "Rehearse one high-risk scenario", "Picture a party or a hard evening and script your exact plan. Mental rehearsal wires the response before you need it.", 70, "cbt", 20),
        t("connect", "🤝", "Meaningful connection", "A meeting, a call, or coffee with someone sober-supportive. Rebuild the social rewards drinking eroded.", 70, "social", 21),
        t("gratitude", "🙏", "Gratitude + tomorrow's plan", "List 3 things you're grateful for and plan tomorrow. Gratitude shifts the brain toward the reward you already have.", 60, "reflection", 22),
    ],
    "tasks2": [
        t("am_ritual", "🌅", "Sober morning ritual", "Water, movement, intention — automatic now. A stable morning is the anchor of a stable identity.", 60, "reflection", 7),
        t("purpose", "🎯", "30-45 min toward a goal", "Study, build, create — pour the freed-up energy into something that matters. Purpose is the long-term replacement for the bottle.", 110, "cbt", 10),
        t("move", "🏃", "Train — your standard now", "Movement is who you are, not a chore. It keeps the reward system healthy for good.", 100, "physical", 18),
        t("mentor", "🫂", "Support someone else", "Share your experience or check on someone struggling. Helping others is one of the strongest protectors against relapse.", 90, "social", 20),
        t("meditate", "🧘", "10-15 min mindfulness", "Keep the prefrontal cortex strong. Calm brains don't need to escape.", 80, "mindfulness", 21),
        t("reflect", "📓", "Identity journal", "Write as the person you've become: 'I am someone who...'. Repeated self-statements reshape self-concept.", 70, "reflection", 22),
        t("sleep", "🛏️", "Protect sleep", "Guard your recovery's foundation. Consistent sleep locks in every gain.", 90, "physical", 23),
    ],
    "quotes": [
        "The urge is a wave. You are the surfer, not the ocean.",
        "You never regret the drink you didn't take.",
        "Sobriety is not deprivation — it's the return of everything alcohol stole.",
        "One day at a time is still forward.",
        "Your brain is healing every single sober hour.",
        "Cravings lie. They promise relief and deliver the trap.",
        "The opposite of addiction is connection.",
        "You are not missing out. You are getting yourself back.",
        "Discomfort now, or the same regret forever. Choose the growth.",
        "Two months sober rewires what two years of promises never could.",
    ],
})



# =========================================================================
# 2. OPIOID RECOVERY
# =========================================================================
TRACKS.append({
    "id": "opioid-recovery",
    "addictionType": "opioid",
    "name": "Opioid Recovery",
    "tagline": "60 days to heal the reward system and reclaim control.",
    "description": "A neuroscience-based 60-day program for opioid recovery — support your treatment plan, retrain a hijacked dopamine system, manage pain and stress without opioids, and rebuild a life worth staying present for.",
    "icon": "💊",
    "color": "#a78bfa",
    "identityName": "Recovered Self Blueprint",
    "vital1": "Sleep 7-9 hrs",
    "vital2": "Follow your care plan",
    "vital3": "Move gently daily",
    "vital4": "1 support contact/day",
    "vital5": "Breathe through pain waves",
    "phases": [
        {"title": "Breaking the Cycle",
         "tag": "Stabilize. Lean on your support.",
         "vibe": "Recovery from opioids is medical as well as mental — stay connected to your treatment team and take it hour by hour. These two weeks are about safety, structure, and replacing the chemical reward with small real ones. Never detox alone; call your provider for any severe symptoms."},
        {"title": "Rewiring the Brain",
         "tag": "New routines, restored rewards.",
         "vibe": "Opioids flooded and then flattened your dopamine system. Now you rebuild it slowly — movement, sunlight, connection, and accomplishment restore natural reward chemistry. Give every craving a new routine to run."},
        {"title": "Building a New Identity",
         "tag": "A life bigger than the substance.",
         "vibe": "You're building reasons to stay present: purpose, people, and self-respect. You manage pain and stress with real tools and you help others walk the path behind you."},
    ],
    "tasks0": [
        t("am_intent", "🌅", "Morning check-in + medication", "Water, take any prescribed recovery medication (e.g. as directed), and set one intention. Structure and adherence to your plan are the backbone of early recovery.", 60, "reflection", 7),
        t("support", "☎️", "Contact your support line", "Message your counselor, sponsor, or a trusted person. Isolation feeds relapse; a daily human anchor changes outcomes.", 70, "social", 9),
        t("halt", "🧭", "HALT + basic needs", "Hungry, Angry, Lonely, Tired? Meet the real need. Cravings often ride on unmet basics — food, rest, and connection blunt them.", 40, "mindfulness", 12),
        t("move", "🚶", "Gentle movement 15-20 min", "A walk or light stretch. Movement releases natural endorphins — your body's own pain relief and mood lift — helping the reward system relearn.", 80, "physical", 17),
        t("urge_surf", "🌊", "Urge surfing — SOBER breath", "Stop, Observe, Breathe, Expand, Respond. Cravings and pain both come in waves that crest and fall. Breathe slowly through the peak.", 90, "mindfulness", 20),
        t("comfort", "🛋️", "Non-drug comfort ritual", "Heat pad, warm shower, calming music, tea. Teaching the brain that comfort has many sources loosens the opioid's monopoly.", 50, "cbt", 21),
        t("journal", "📓", "Evening journal — feelings + triggers", "Name pain levels, moods, and triggers. Labeling emotion reduces its grip and gives your team useful information.", 60, "reflection", 22),
        t("sleep", "🛏️", "Wind-down + sleep", "Same time nightly, screens off. Sleep repairs the brain and lowers next-day craving and pain sensitivity.", 90, "physical", 23),
    ],
    "tasks1": [
        t("am_intent", "🌅", "Morning intention + sunlight", "Water, intention, 10 min of daylight. Morning light resets circadian rhythm and gently supports dopamine — free medicine for a healing brain.", 60, "physical", 7),
        t("replace", "🔁", "Run your replacement routine", "At a former high-risk time, do your chosen activity (walk, call, craft). Same cue, new routine rewires the loop.", 90, "cbt", 17),
        t("move", "🚴", "25-30 min movement", "Build a bit of intensity as your body allows. Exercise steadily rebuilds natural dopamine and endorphin function.", 100, "physical", 18),
        t("meditate", "🧘", "10 min mindfulness / body scan", "Notice sensations without reacting. This strengthens tolerance for discomfort — the skill opioids destroyed.", 80, "mindfulness", 12),
        t("group", "🫂", "Attend / join a support group", "Meeting, group chat, or therapy. Shared recovery multiplies your odds and rebuilds social reward.", 80, "social", 20),
        t("pain_plan", "🧠", "Review your pain-management plan", "List non-opioid tools that help and note what you'll use next flare. Preparation prevents panic-driven relapse.", 70, "cbt", 21),
        t("gratitude", "🙏", "Gratitude + plan tomorrow", "Three things that went right, then set up tomorrow. Gratitude rebalances a reward system tilted toward loss.", 60, "reflection", 22),
    ],
    "tasks2": [
        t("am_ritual", "🌅", "Recovery morning ritual", "Water, light, movement, medication as prescribed — steady and automatic. Stability is the platform for a new life.", 60, "reflection", 7),
        t("purpose", "🎯", "30-45 min toward a goal", "Work, learning, or a creative project. Meaningful engagement is the long-term antidote to the void opioids filled.", 110, "cbt", 10),
        t("move", "🏃", "Train — your standard now", "Movement is part of who you are. Keep feeding the reward system the clean way.", 100, "physical", 18),
        t("mentor", "🫂", "Support someone in recovery", "Share hope with someone earlier on the path. Service protects your own recovery more than almost anything.", 90, "social", 20),
        t("meditate", "🧘", "15 min mindfulness", "Keep building your window of tolerance for pain and stress.", 80, "mindfulness", 21),
        t("reflect", "📓", "Identity journal", "Write from your recovered self. Repeated self-narrative rewires who you believe you are.", 70, "reflection", 22),
        t("sleep", "🛏️", "Protect sleep", "Guard the foundation. Deep sleep keeps pain and cravings low.", 90, "physical", 23),
    ],
    "quotes": [
        "Recovery is not a straight line, but every day forward counts.",
        "Pain is a wave. You have learned to breathe until it passes.",
        "Ask for help — it is the strongest thing you will do today.",
        "Your brain is rebuilding its own reward, one clean day at a time.",
        "You are not your worst day.",
        "Connection heals what the substance never could.",
        "Small, real rewards rebuild what the drug burned down.",
        "Stay. The version of you on the other side is worth meeting.",
        "Progress, not perfection.",
        "You survived 100% of your hardest days. That is your proof.",
    ],
})


# =========================================================================
# 3. WEIGHT LOSS
# =========================================================================
TRACKS.append({
    "id": "weight-loss",
    "addictionType": "food",
    "name": "Weight Loss",
    "tagline": "60 days to rewire cravings and build a lean routine.",
    "description": "A neuroscience-based 60-day fat-loss program — break the sugar/craving loop, retrain hunger and reward signals, move daily, and build eating habits that stick long after day 60.",
    "icon": "🥗",
    "color": "#34d399",
    "identityName": "Lean Self Blueprint",
    "vital1": "1,500-1,700 kcal",
    "vital2": "Protein 100-150g",
    "vital3": "8-10k steps/day",
    "vital4": "Sleep 7-9 hrs",
    "vital5": "Water before every meal",
    "phases": [
        {"title": "Breaking the Cycle",
         "tag": "Detox from sugar & mindless eating.",
         "vibe": "The first two weeks reset your palate and your habits. Cut the liquid sugar, front-load protein, and walk daily. You're weakening the cue→snack→dopamine loop that drives overeating, and teaching your body real hunger again."},
        {"title": "Rewiring the Brain",
         "tag": "New rewards, steady deficit.",
         "vibe": "Cravings still fire at the old times — replace the routine, not the willpower. Swap the evening snack for a ritual, train a little harder, and let a mild consistent deficit do the work. New habits are becoming automatic."},
        {"title": "Building a New Identity",
         "tag": "A lean routine you actually keep.",
         "vibe": "You now eat and move like a lean person by default. The scale is a lagging indicator of habits already locked in. You plan for the maintenance life ahead."},
    ],
    "tasks0": [
        t("am_water", "💧", "Water first + weigh-in", "500ml water on waking, then weigh yourself. Morning hydration curbs false hunger; a daily data point keeps you honest without obsessing.", 40, "physical", 7),
        t("protein_am", "🍳", "Protein-forward breakfast", "30g+ protein (eggs, Greek yogurt, shake). Protein blunts the hunger hormone ghrelin and stabilizes blood sugar so cravings never spike.", 70, "cbt", 8),
        t("log", "📝", "Log everything you eat", "Track every bite in an app. Awareness alone cuts intake — you can't rewire a loop you can't see.", 60, "cbt", 13),
        t("steps", "🚶", "8,000+ steps", "Walk after meals when you can. Steady low-intensity movement burns fat and blunts post-meal glucose without spiking appetite.", 90, "physical", 17),
        t("halt", "🧭", "HALT before snacking", "Hungry, Angry, Lonely, Tired? Emotional eating is a routine triggered by feelings, not fuel. Meet the real need first.", 50, "mindfulness", 20),
        t("craving_tool", "🌊", "Beat one craving", "Sparkling water + brush teeth, or 15 squats. Cravings pass in ~10 min; a competing action rides out the wave.", 50, "cbt", 21),
        t("journal", "📓", "Evening journal — wins + triggers", "Note what you ate well and what tripped you. Reflection turns slips into data instead of shame.", 50, "reflection", 22),
        t("sleep", "🛏️", "Sleep 7-9 hrs", "Poor sleep raises ghrelin and lowers leptin — you literally get hungrier. Sleep is a fat-loss tool.", 90, "physical", 23),
    ],
    "tasks1": [
        t("am_water", "💧", "Water first + weigh-in", "Keep the morning data habit. Trends over days matter, not any single number.", 40, "physical", 7),
        t("protein_am", "🍳", "Protein + fiber breakfast", "Add vegetables/fruit for fiber. Fiber slows digestion and feeds satiety — you eat less without trying.", 70, "cbt", 8),
        t("train", "🏋️", "Strength training 30 min", "Lift 3-4x/week. Muscle raises your resting burn and protects your metabolism in a deficit.", 100, "physical", 18),
        t("replace", "🔁", "Swap the evening snack ritual", "Replace mindless snacking with tea + a walk or a hobby. Same cue and time, healthier routine — that's the rewire.", 80, "cbt", 20),
        t("steps", "🚶", "9,000+ steps", "Nudge the daily target up. Small increases compound over 60 days.", 90, "physical", 17),
        t("plan_meals", "🥗", "Plan tomorrow's meals", "Decide meals in advance. Pre-commitment beats in-the-moment willpower every time.", 60, "cbt", 21),
        t("journal", "📓", "Gratitude + reflect", "Note progress you feel, not just the scale — energy, clothes, mood. Non-scale wins sustain motivation.", 50, "reflection", 22),
    ],
    "tasks2": [
        t("am_ritual", "💧", "Morning ritual + weigh-in", "Water, weigh, plan — automatic now. Systems, not motivation, carry you.", 50, "physical", 7),
        t("protein_am", "🍳", "Dialed-in breakfast", "Your go-to high-protein meal. Consistency at breakfast anchors the whole day.", 70, "cbt", 8),
        t("train", "🏋️", "Train — your standard now", "Strength + steps are just who you are. Keep progressive overload going.", 100, "physical", 18),
        t("mindful_eat", "🧘", "One mindful meal", "Eat slowly, no screens, notice fullness. Mindful eating retrains satiety signals for the long run.", 70, "mindfulness", 19),
        t("steps", "🚶", "10,000 steps", "Your baseline activity. Movement is a lifestyle now, not a diet phase.", 90, "physical", 17),
        t("maintain_plan", "🎯", "Sketch your maintenance plan", "Plan how you'll eat after day 60. Weight kept off is a habit kept up.", 70, "cbt", 21),
        t("journal", "📓", "Identity journal", "Write as a lean, active person. Self-image drives behavior more than any diet rule.", 60, "reflection", 22),
    ],
    "quotes": [
        "You don't need more willpower — you need fewer cravings, and those you can rewire.",
        "Every meal is a vote for the body you're becoming.",
        "The scale is a lagging indicator of habits you already own.",
        "Hunger is a wave, not an emergency.",
        "Protein and steps beat motivation every time.",
        "You're not on a diet. You're building a default.",
        "Sleep is the fat-loss tool no one is selling you.",
        "Discipline at the store is easier than willpower in the kitchen.",
        "Small deficit, big consistency, real results.",
        "Sixty days of habits outlast any 3-day crash diet.",
    ],
})



# =========================================================================
# 4. DIGITAL DETOX
# =========================================================================
TRACKS.append({
    "id": "digital-detox",
    "addictionType": "digital",
    "name": "Digital Detox",
    "tagline": "60 days to break the scroll and reclaim your attention.",
    "description": "A neuroscience-based 60-day program to beat phone, social media, and screen addiction — kill the notification-dopamine loop, restore your attention span, and rebuild an analog life you actually enjoy.",
    "icon": "📵",
    "color": "#f472b6",
    "identityName": "Focused Self Blueprint",
    "vital1": "Sleep 7-9 hrs",
    "vital2": "No phone first/last hour",
    "vital3": "Move 20+ min/day",
    "vital4": "1 real conversation/day",
    "vital5": "Pause before you unlock",
    "phases": [
        {"title": "Breaking the Cycle",
         "tag": "Detox the dopamine slot machine.",
         "vibe": "The first two weeks strip the hooks: kill notifications, grayscale the screen, and keep the phone out of the bedroom. Each buzz was a tiny dopamine hit training you to check. Remove the cue and the loop starves."},
        {"title": "Rewiring the Brain",
         "tag": "Replace scrolling with living.",
         "vibe": "Your thumb still reaches for the phone at the old moments — give those moments a better routine. A book, a walk, a real conversation. You're rebuilding an attention span that endless feeds deliberately fractured."},
        {"title": "Building a New Identity",
         "tag": "Present by default.",
         "vibe": "You're now someone who uses tech on purpose, not on reflex. Deep focus, real presence, and boredom tolerance are yours again. You design a life the feed can't compete with."},
    ],
    "tasks0": [
        t("no_phone_am", "🌅", "No phone for the first hour", "Wake without the scroll. Water, light, one intention. Starting on your own terms protects your attention before the feed hijacks it.", 60, "reflection", 7),
        t("notifications", "🔕", "Kill non-essential notifications", "Turn off badges and alerts for social/news. Each ping is an engineered dopamine cue — remove the cue, break the loop.", 70, "cbt", 8),
        t("grayscale", "⚫", "Grayscale + tidy home screen", "Set the screen to grayscale and hide addictive apps off page one. Color and one-tap access are designed to pull you back; friction reduces use.", 50, "cbt", 9),
        t("move", "🚶", "20 min screen-free movement", "Walk without headphones or leave the phone home. Movement gives real dopamine and lets a restless mind settle.", 90, "physical", 17),
        t("pause", "✋", "Pause before you unlock", "Before opening a feed, take one breath and ask 'why?'. Inserting a gap between cue and action is how you regain control of the impulse.", 60, "mindfulness", 20),
        t("analog", "📖", "30 min analog activity", "Read a paper book, cook, draw, play music. Rebuilds the sustained-attention circuits infinite scroll erodes.", 70, "cbt", 21),
        t("phone_bed", "🛏️", "Phone out of the bedroom", "Charge it in another room; use a real alarm. Blue light and late scrolling wreck sleep and morning willpower.", 80, "physical", 22),
        t("journal", "📓", "Evening journal — screen-time review", "Check your screen-time number and note one trigger. Awareness of the real number is a powerful corrective.", 50, "reflection", 23),
    ],
    "tasks1": [
        t("no_phone_am", "🌅", "Phone-free morning routine", "Extend the phone-free window. The longer you protect the morning, the sharper the whole day.", 60, "reflection", 7),
        t("replace", "🔁", "Run your scroll-replacement", "When you'd normally scroll (line, break, couch), do your swap: read, stretch, breathe. Same cue, new routine.", 80, "cbt", 12),
        t("deep_focus", "🎯", "45 min single-task focus", "Phone in another room, one task, no tabs. Deep work rebuilds the attention span that apps fragmented.", 100, "cbt", 15),
        t("move", "🏃", "30 min movement", "Screen-free exercise. Real-world dopamine makes the digital kind less tempting.", 90, "physical", 18),
        t("connect", "🗣️", "One real, in-person/voice talk", "Call or meet someone — no texting. Face-to-face contact delivers the connection social media only simulates.", 70, "social", 20),
        t("boredom", "🧘", "Sit with 10 min of boredom", "No input — just be. Tolerating boredom rebuilds impulse control and sparks real creativity.", 70, "mindfulness", 21),
        t("journal", "📓", "Reflect + set tomorrow's limits", "Review usage and set app limits for tomorrow. Pre-commitment beats in-the-moment willpower.", 50, "reflection", 22),
    ],
    "tasks2": [
        t("no_phone_am", "🌅", "Intentional morning", "Wake, move, plan — screens wait. This is simply how you live now.", 60, "reflection", 7),
        t("deep_focus", "🎯", "60-90 min deep work", "Long, undistracted focus is your superpower again. Guard it fiercely.", 110, "cbt", 10),
        t("move", "🏃", "Train — your standard now", "Movement anchors a low-stimulation, high-energy life.", 90, "physical", 18),
        t("create", "🎨", "Create, don't just consume", "Write, build, make something. Producing rewires you from passive feed to active life.", 90, "cbt", 15),
        t("connect", "🫂", "Real-world connection", "People over profiles. Presence is the whole point.", 80, "social", 20),
        t("reflect", "📓", "Identity journal", "Write as a focused, present person. Self-image steers behavior.", 60, "reflection", 22),
        t("phone_bed", "🛏️", "Phone out, wind down", "Analog evenings, deep sleep. Protect the reset.", 80, "physical", 23),
    ],
    "quotes": [
        "Your attention is the most valuable thing you own. Stop giving it away for free.",
        "The urge to check is a wave — let it pass unclicked.",
        "Boredom is where creativity is born.",
        "You don't need a longer feed. You need a fuller life.",
        "Every notification you kill is attention you keep.",
        "Be where your feet are.",
        "The apps were built to hook you. Unhooking is a skill you can learn.",
        "Presence is a superpower in a distracted world.",
        "Consume less, create more.",
        "Sixty days off the slot machine and your mind comes back.",
    ],
})


# =========================================================================
# 5. PRODUCTIVITY
# =========================================================================
TRACKS.append({
    "id": "productivity",
    "addictionType": "productivity",
    "name": "Productivity",
    "tagline": "60 days to beat procrastination and build deep focus.",
    "description": "A neuroscience-based 60-day program to defeat procrastination and distraction — rewire the avoidance loop, train deep-focus attention, and build a daily execution system that compounds.",
    "icon": "⚡",
    "color": "#fbbf24",
    "identityName": "Disciplined Self Blueprint",
    "vital1": "Sleep 7-9 hrs",
    "vital2": "1 deep-work block/day",
    "vital3": "Move 20+ min/day",
    "vital4": "Plan the night before",
    "vital5": "Start before you feel ready",
    "phases": [
        {"title": "Breaking the Cycle",
         "tag": "Detox distraction. Ship one thing.",
         "vibe": "Procrastination is an emotional-avoidance loop: task → discomfort → escape to your phone → relief. The first two weeks break it by shrinking tasks until starting is easy and removing the escape hatches around you."},
        {"title": "Rewiring the Brain",
         "tag": "Deep work as the default.",
         "vibe": "You still feel the pull to bail when work gets hard — now you have a routine for it. Time-block, single-task, and ride the discomfort for a few minutes until focus kicks in. Each rep strengthens your attention."},
        {"title": "Building a New Identity",
         "tag": "A person who executes.",
         "vibe": "Deep work, follow-through, and calm focus are simply who you are now. You protect your peak hours, finish what you start, and build a system that compounds long past day 60."},
    ],
    "tasks0": [
        t("plan_day", "🌅", "Plan the day — pick 1 priority", "Water, then write your single most important task (MIT). Deciding in advance removes the morning decision fatigue that fuels procrastination.", 60, "cbt", 7),
        t("two_min", "▶️", "The 2-minute start", "Commit to just 2 minutes on the hardest task. Starting — not finishing — is the barrier; motion creates motivation, not the reverse.", 70, "cbt", 9),
        t("deep_block", "🎯", "One 45-min focus block", "Phone away, one task, timer on. Single-tasking rebuilds the focus circuits that constant switching degrades.", 100, "cbt", 10),
        t("remove_distraction", "🔕", "Remove one distraction", "Silence the phone, close tabs, block a site. You can't out-willpower a slot machine — remove the cue instead.", 60, "cbt", 12),
        t("move", "🚶", "20 min movement", "A walk or workout mid-day. Exercise boosts dopamine and focus and clears the mental fog that invites escape.", 80, "physical", 17),
        t("urge_pause", "✋", "Pause before you bail", "When you feel the urge to escape a task, breathe and name the feeling. Avoidance is emotional; labeling it hands control back to the thinking brain.", 60, "mindfulness", 15),
        t("shutdown", "📓", "Shutdown review + plan tomorrow", "List what you shipped and set tomorrow's MIT. A clear endpoint prevents work bleeding into rest and rumination.", 60, "reflection", 21),
        t("sleep", "🛏️", "Protect sleep 7-9 hrs", "Sleep is the ultimate cognitive enhancer — willpower and focus collapse without it.", 90, "physical", 23),
    ],
    "tasks1": [
        t("plan_day", "🌅", "Plan + top 3 tasks", "Set your MIT plus two supporting tasks. A short, ranked list beats an overwhelming one.", 60, "cbt", 7),
        t("deep_block", "🎯", "Two 50-min deep-work blocks", "Two focused sprints with a break between. Building block length grows your attention capacity.", 110, "cbt", 10),
        t("replace", "🔁", "Run your anti-distraction routine", "At your usual slump time, do the swap: stand, breathe, refocus — instead of grabbing the phone. Same cue, new routine.", 80, "cbt", 15),
        t("move", "🏃", "30 min movement", "Exercise sharpens executive function for hours. Treat it as focus fuel, not a reward.", 90, "physical", 18),
        t("single_task", "🧠", "Single-task everything today", "No multitasking. Task-switching has a real cognitive cost; doing one thing fully is faster and calmer.", 70, "mindfulness", 12),
        t("connect", "🤝", "Share progress / accountability", "Tell someone what you'll finish today. Accountability harnesses social reward to drive follow-through.", 60, "social", 20),
        t("shutdown", "📓", "Shutdown review", "Close the loop, plan tomorrow. Reflection turns effort into a repeatable system.", 60, "reflection", 21),
    ],
    "tasks2": [
        t("plan_day", "🌅", "Plan — automatic now", "MIT set before the day starts. Systems, not willpower, run your days.", 60, "cbt", 7),
        t("deep_block", "🎯", "Deep work — your standard", "Long, protected focus is who you are. Guard your peak hours ruthlessly.", 120, "cbt", 10),
        t("move", "🏃", "Train — your standard now", "Movement keeps the mind sharp and the mood steady.", 90, "physical", 18),
        t("build", "🚀", "Advance your biggest project", "Pour compounding energy into the thing that matters most. Momentum is your identity now.", 100, "cbt", 14),
        t("reflect_week", "📈", "Weekly review of systems", "Refine what works, cut what doesn't. Continuous improvement is the productivity edge.", 70, "reflection", 16),
        t("journal", "📓", "Identity journal", "Write as a disciplined person who finishes. Self-image drives daily action.", 60, "reflection", 21),
        t("sleep", "🛏️", "Protect sleep", "Recovery powers tomorrow's focus. Non-negotiable.", 90, "physical", 23),
    ],
    "quotes": [
        "Starting is the whole battle. Motion makes motivation.",
        "You don't need to feel like it. You need to begin.",
        "Focus is a muscle — every block makes it stronger.",
        "Procrastination is avoidance of a feeling, not a task.",
        "Protect your peak hours like your life depends on it.",
        "Done beats perfect. Ship it.",
        "One deep-work block a day compounds into a different life.",
        "Distraction is a choice you can stop making.",
        "Discipline is choosing what you want most over what you want now.",
        "Sixty days of showing up rewires who you are.",
    ],
})


# =========================================================================
# 6. GENERAL HEALTH
# =========================================================================
TRACKS.append({
    "id": "general-health",
    "addictionType": "general",
    "name": "General Health",
    "tagline": "60 days to build the daily habits of a healthier life.",
    "description": "A neuroscience-based 60-day program to build foundational healthy habits — movement, nutrition, sleep, stress management, and connection — and turn them into an automatic, sustainable lifestyle.",
    "icon": "🌱",
    "color": "#22d3ee",
    "identityName": "Healthy Self Blueprint",
    "vital1": "Sleep 7-9 hrs",
    "vital2": "Hydrate 2-3 L/day",
    "vital3": "Move 30 min/day",
    "vital4": "Whole foods + veg",
    "vital5": "Breathe & de-stress daily",
    "phases": [
        {"title": "Breaking the Cycle",
         "tag": "Foundation. One healthy habit at a time.",
         "vibe": "The first two weeks lay the base: hydrate, move, eat real food, and sleep well. Small consistent actions repeated at the same cues begin forming automatic habits — the brain's energy-saving autopilot working for you."},
        {"title": "Rewiring the Brain",
         "tag": "Stack habits into a routine.",
         "vibe": "The starter habits are sticking — now stack them. Attach new actions to established ones and add mindfulness for stress. Consistency is turning conscious effort into effortless routine."},
        {"title": "Building a New Identity",
         "tag": "A healthy lifestyle on autopilot.",
         "vibe": "Health is no longer a project — it's your default. Movement, good food, sleep, and calm are simply how you live. You design an environment and routine that make the healthy choice the easy one for good."},
    ],
    "tasks0": [
        t("am_water", "💧", "Hydrate first + intention", "500ml water on waking and one intention for the day. Hydration kickstarts metabolism and focus; intention primes the prefrontal cortex.", 40, "physical", 7),
        t("move", "🚶", "30 min movement", "Walk, stretch, or work out. Daily movement improves mood, sleep, and brain health more reliably than any supplement.", 90, "physical", 17),
        t("nutrition", "🥗", "One whole-food meal + veg", "Build a meal around protein and vegetables. Whole foods stabilize energy and reduce the cravings processed food engineers.", 70, "cbt", 13),
        t("sunlight", "☀️", "10 min morning daylight", "Get outside early. Morning light sets your circadian clock for better sleep and daytime energy.", 50, "physical", 8),
        t("breathe", "🧘", "5-10 min breathing / mindfulness", "Slow breathing activates the calming parasympathetic system, lowering the chronic stress that erodes health.", 70, "mindfulness", 20),
        t("connect", "🤝", "Connect with someone", "A call, meal, or chat. Strong social bonds are one of the biggest predictors of long-term health and longevity.", 60, "social", 21),
        t("journal", "📓", "Evening reflection — 3 wins", "Note three things that went well. Gratitude lowers stress and reinforces the habits worth repeating.", 50, "reflection", 22),
        t("sleep", "🛏️", "Sleep 7-9 hrs", "Consistent bed and wake times. Sleep is when the body repairs and the brain consolidates every good habit.", 90, "physical", 23),
    ],
    "tasks1": [
        t("am_water", "💧", "Hydrate + morning routine", "Anchor water and light to waking. Stacking habits onto existing cues makes them stick.", 40, "physical", 7),
        t("move", "🏃", "Movement + a little more", "Add intensity or duration. Progressive challenge keeps improving fitness and mood.", 100, "physical", 18),
        t("nutrition", "🥗", "Two whole-food meals", "Extend clean eating across the day. Steady blood sugar means steady energy and fewer cravings.", 80, "cbt", 13),
        t("habit_stack", "🔗", "Stack a new healthy habit", "Attach one new action to an existing one (e.g. stretch after brushing teeth). Habit stacking wires new routines fast.", 70, "cbt", 9),
        t("breathe", "🧘", "10 min mindfulness", "Deepen the practice. Regular mindfulness lowers baseline stress and improves emotional control.", 70, "mindfulness", 20),
        t("connect", "🤝", "Meaningful connection", "Invest in a relationship today. Connection buffers stress and boosts wellbeing.", 60, "social", 21),
        t("journal", "📓", "Gratitude + plan tomorrow", "Reflect and set up an easy win for tomorrow. Planning removes friction.", 50, "reflection", 22),
    ],
    "tasks2": [
        t("am_ritual", "🌅", "Healthy morning ritual", "Water, light, movement — automatic now. A strong morning sets the whole day.", 50, "physical", 7),
        t("move", "🏃", "Train — your standard now", "Movement is simply part of your life. Keep it varied and enjoyable so it lasts.", 100, "physical", 18),
        t("nutrition", "🥗", "Eat well by default", "Whole foods are your normal. Design your kitchen so the healthy choice is the easy one.", 80, "cbt", 13),
        t("mindful", "🧘", "15 min mindfulness / de-stress", "Keep stress low for long-term heart and brain health.", 70, "mindfulness", 20),
        t("connect", "🫂", "Nurture your circle", "Relationships are a cornerstone of a long, healthy life. Tend them.", 70, "social", 21),
        t("reflect", "📓", "Identity journal", "Write as a healthy, active person. Identity keeps habits alive after day 60.", 60, "reflection", 22),
        t("sleep", "🛏️", "Protect sleep", "Guard your foundation. Everything good is built on good sleep.", 90, "physical", 23),
    ],
    "quotes": [
        "Health is built in the small choices you repeat every day.",
        "You don't have to be extreme, just consistent.",
        "Motion is the best medicine.",
        "Take care of your body — it's the only place you have to live.",
        "Good sleep is the foundation everything else is built on.",
        "Small habits, stacked daily, become a different life.",
        "Whole foods, real movement, deep sleep — the boring stuff works.",
        "Stress managed is years gained.",
        "Connection is as vital to health as diet and exercise.",
        "Sixty days of good habits become who you are.",
    ],
})
