/**
 * Mo Advice — the message bank.
 *
 * These are seeded into the `MessageTemplate` table by `prisma/seed.ts`.
 * `slug` is the stable key: re-running the seed updates existing rows rather
 * than creating duplicates, so you can safely edit copy here and re-seed.
 *
 * House style:
 *  - Second person, present tense. Speak to one real person.
 *  - Two to four sentences. Long enough to feel considered, short enough to read.
 *  - Specific over sweeping. "You answer the question that was actually asked"
 *    lands; "you're amazing" does not.
 *  - Recognition or gentle advice, never instruction or flattery.
 *  - No names, no gendered language, no assumptions about job title, family,
 *    religion, health, or appearance. Every line has to be true for a stranger.
 */

export type MessageCategory = "PERSONAL" | "PROFESSIONAL";

export interface MessageTemplateSeed {
  slug: string;
  category: MessageCategory;
  /** Short line shown as the headline above the message in the email. */
  headline: string;
  /** The message itself. */
  body: string;
}

export const PROFESSIONAL_MESSAGES: MessageTemplateSeed[] = [
  {
    slug: "pro-quiet-reliability",
    category: "PROFESSIONAL",
    headline: "You are the reason things don't fall through",
    body: "There is a kind of work that only gets noticed when it stops, and you have been doing it for a long time without stopping. The follow-ups, the loose ends, the thing you remembered that nobody else did. It is not glamorous and it is not accidental — it is a standard you hold when no one is checking.",
  },
  {
    slug: "pro-calm-under-pressure",
    category: "PROFESSIONAL",
    headline: "You lower the temperature in a room",
    body: "When something goes wrong, people watch to see how the steadiest person reacts. That has become you. Whatever it costs you privately to stay level, know that it changes how everyone around you handles the same bad news.",
  },
  {
    slug: "pro-credit-generosity",
    category: "PROFESSIONAL",
    headline: "You give credit away easily",
    body: "You name the people who helped, even when it would be easier to let the assumption stand. That habit is rarer than it should be, and people remember it far longer than they remember the project. It is the cheapest form of leadership and almost nobody pays it.",
  },
  {
    slug: "pro-clear-writing",
    category: "PROFESSIONAL",
    headline: "You make complicated things simple",
    body: "Clarity looks effortless from the outside, which is exactly why it goes unthanked. Someone read something you wrote this year and finally understood a thing they had been nodding along to for months. That is real work, and you do it well.",
  },
  {
    slug: "pro-hard-conversation",
    category: "PROFESSIONAL",
    headline: "You say the difficult thing kindly",
    body: "Most people choose between honest and kind. You keep finding the version that is both, which takes more thought and more nerve than either one alone. The people you have been straight with trust you more for it, not less.",
  },
  {
    slug: "pro-mentorship",
    category: "PROFESSIONAL",
    headline: "Someone is better at their job because of you",
    body: "You explained something without making anyone feel small for not knowing it. That person is now doing work they could not have done a year ago, and they carry your patience into how they teach the next person. Very little of what we build outlasts us. That does.",
  },
  {
    slug: "pro-follow-through",
    category: "PROFESSIONAL",
    headline: "When you say you'll do it, it gets done",
    body: "You may not think of that as a skill. It is — and it is the one people quietly sort colleagues by. Every commitment you have kept has bought you something you cannot buy any other way.",
  },
  {
    slug: "pro-standards",
    category: "PROFESSIONAL",
    headline: "You refuse to ship something you'd be embarrassed by",
    body: "Holding a standard is tiring, especially when good enough would pass unnoticed. But the work has your fingerprints on it, and it shows. Don't let anyone talk you out of caring about the last ten percent.",
  },
  {
    slug: "pro-listening",
    category: "PROFESSIONAL",
    headline: "You answer the question people actually asked",
    body: "You listen past the first sentence to what someone is really worried about, and then you address that. It makes meetings shorter and people calmer. It is a genuinely uncommon skill and you use it constantly.",
  },
  {
    slug: "pro-ownership",
    category: "PROFESSIONAL",
    headline: "You pick things up without being asked",
    body: "There is a gap between what your role says and what you actually do, and you have been filling it for a while now. Nobody assigned it. You just saw that it mattered and started. That instinct is the whole difference between doing a job and doing it well.",
  },
  {
    slug: "pro-mistake-owned",
    category: "PROFESSIONAL",
    headline: "You own mistakes without theatre",
    body: "You say what happened, say what you'll change, and get back to work. No defensiveness, no long apology that makes everyone else do the comforting. That is a professional maturity most people never reach.",
  },
  {
    slug: "pro-unglamorous-work",
    category: "PROFESSIONAL",
    headline: "The boring work you did was the important work",
    body: "The cleanup, the documentation, the migration nobody wanted — it will never be in a highlight reel. But it removed a problem from other people's futures, and they will never know how close they came to it. Somebody noticed.",
  },
  {
    slug: "pro-creativity",
    category: "PROFESSIONAL",
    headline: "You suggest the option nobody thought to consider",
    body: "You are the person who asks whether the constraint is real. Half the time it isn't, and the whole conversation changes. Keep asking, even when the room has already settled.",
  },
  {
    slug: "pro-decision-making",
    category: "PROFESSIONAL",
    headline: "You decide instead of waiting for perfect information",
    body: "Waiting feels safe and costs a fortune. You have a good sense for when more analysis stops helping, and you are willing to be accountable for the call. That is the part of judgement you cannot teach.",
  },
  {
    slug: "pro-protecting-focus",
    category: "PROFESSIONAL",
    headline: "You protect other people's time",
    body: "You come to conversations prepared, you keep them short, and you don't add to anyone's pile without a reason. It sounds small. Multiply it by everyone you work with and it is a real gift.",
  },
  {
    slug: "pro-consistency",
    category: "PROFESSIONAL",
    headline: "You are the same person on a bad week",
    body: "Consistency is underrated because it makes no noise. People know what they are going to get from you, which means they can plan, relax, and trust. That predictability is a foundation others are standing on.",
  },
  {
    slug: "pro-asking-questions",
    category: "PROFESSIONAL",
    headline: "You ask the question everyone was too proud to ask",
    body: "Every time you say \"can you explain that again\", you rescue three other people in the room. It takes confidence to be the one who admits the gap. It also, quietly, raises the quality of every decision that follows.",
  },
  {
    slug: "pro-onboarding",
    category: "PROFESSIONAL",
    headline: "You make new people feel like they belong",
    body: "The first weeks somewhere are lonely and disorienting, and you shortened that for someone. You answered the questions they were embarrassed to ask and gave them context nobody wrote down. They will pass that forward without realising where they learned it.",
  },
  {
    slug: "pro-saying-no",
    category: "PROFESSIONAL",
    headline: "You've learned to say no properly",
    body: "Not a flat refusal and not a resentful yes — a clear no with a reason and, where you can, an alternative. It protects your work and it respects the other person. It took you a while to get here. It was worth the practice.",
  },
  {
    slug: "pro-resilience-after-setback",
    category: "PROFESSIONAL",
    headline: "The thing that didn't work out was not wasted",
    body: "You put real effort into something that ended badly, and you came back anyway. Whatever the outcome column says, you now know things you could not have learned from a success. Give that a little time and it becomes your advantage.",
  },
  {
    slug: "pro-humour",
    category: "PROFESSIONAL",
    headline: "You make a hard day lighter",
    body: "You have a way of finding the funny thing at exactly the moment a room needs it, without ever making it at someone's expense. That isn't a distraction from the work. On a difficult week it is what keeps people in the room.",
  },
  {
    slug: "pro-remote-presence",
    category: "PROFESSIONAL",
    headline: "You are genuinely present, wherever you're working from",
    body: "Attention has gotten scarce. You still give it fully — you're not half in another window while someone is talking. People can feel the difference, and it is one reason they bring you their real problems.",
  },
  {
    slug: "pro-curiosity",
    category: "PROFESSIONAL",
    headline: "You are still curious, and it shows",
    body: "It would be easy by now to run on what you already know. Instead you keep asking how things actually work, including the parts that are not your responsibility. That curiosity is why your judgement keeps getting better while other people's plateau.",
  },
  {
    slug: "pro-taking-criticism",
    category: "PROFESSIONAL",
    headline: "You take feedback like a professional",
    body: "You listen to it properly before deciding what to do with it, and you don't make the person who gave it regret trying. That is why people keep telling you the truth — and being told the truth is a career advantage most people accidentally destroy.",
  },
  {
    slug: "pro-advocacy",
    category: "PROFESSIONAL",
    headline: "You spoke up for someone who wasn't in the room",
    body: "You defended a decision, a name, or a person when there was nothing in it for you. Those moments almost never get reported back to the person you protected. It still counted.",
  },
  {
    slug: "pro-under-titled",
    category: "PROFESSIONAL",
    headline: "You're doing more than your title says",
    body: "The gap between what you are responsible for and what you are recognised for is real, and it is frustrating. Don't mistake a slow organisation for a verdict on your work. The people who work beside you know exactly what you are carrying.",
  },
  {
    slug: "pro-detail",
    category: "PROFESSIONAL",
    headline: "You catch the thing everyone else skims past",
    body: "The wrong number, the sentence that could be misread, the assumption nobody checked. Every one of those you caught was a small disaster that never happened. That is a strange kind of accomplishment: invisible by definition, and completely real.",
  },
  {
    slug: "pro-changing-mind",
    category: "PROFESSIONAL",
    headline: "You can change your mind in public",
    body: "You have argued a position, heard a better one, and said so out loud. Most people dig in to protect their standing. What you do instead is what makes a team actually get smarter over time.",
  },
  {
    slug: "pro-first-draft",
    category: "PROFESSIONAL",
    headline: "You start before it's clear",
    body: "You are willing to make the rough first version — the one that is wrong in useful ways and gives everyone something to react to. Plenty of people can improve a draft. Far fewer will risk making one.",
  },
  {
    slug: "pro-long-project",
    category: "PROFESSIONAL",
    headline: "You're in the unglamorous middle, and still going",
    body: "The start of a project has energy and the end has applause. The middle has neither, and that is where you currently are. Staying steady through this part is the whole skill. It will look obvious in hindsight, and it is not obvious now.",
  },
  {
    slug: "pro-boundaries",
    category: "PROFESSIONAL",
    headline: "Your work is good enough to survive you resting",
    body: "You have built something that does not require you to be permanently available, even if the habit says otherwise. Logging off is not a risk to your reputation. The quality of what you do has never come from the hours at the edges.",
  },
  {
    slug: "pro-integrity",
    category: "PROFESSIONAL",
    headline: "You do it right when nobody would know",
    body: "There have been shortcuts available to you that no one would have caught. You didn't take them. That is the entire meaning of the word integrity, and you spend it daily without calling it anything.",
  },
];

export const PERSONAL_MESSAGES: MessageTemplateSeed[] = [
  {
    slug: "per-steady-presence",
    category: "PERSONAL",
    headline: "You are somebody's safe place",
    body: "There is a person who thinks of you when something goes wrong, before they have thought about what to do. You may never be told that. It is one of the highest things a human being can be to another one.",
  },
  {
    slug: "per-kindness-unwitnessed",
    category: "PERSONAL",
    headline: "The kind things you do unwitnessed still count",
    body: "The message you sent, the thing you noticed, the trouble you took for someone who could not repay it. None of it was performed for an audience. That is precisely what makes it character rather than manners.",
  },
  {
    slug: "per-resilience",
    category: "PERSONAL",
    headline: "You have already survived what you were sure would break you",
    body: "Look back a few years. There was a version of you who could not imagine getting through the thing you have since gotten through. You did it anyway, mostly unimpressively, one ordinary day at a time. That is exactly how you'll get through the next one.",
  },
  {
    slug: "per-good-listener",
    category: "PERSONAL",
    headline: "You listen without waiting for your turn",
    body: "You let people finish. You don't rush to fix or to relate it back to yourself. It is a small, disciplined generosity, and the people you do it for feel rare in a way they probably can't explain.",
  },
  {
    slug: "per-gentle-with-self",
    category: "PERSONAL",
    headline: "Try speaking to yourself the way you speak to your friends",
    body: "You extend an enormous amount of patience outward and almost none of it back to yourself. If a friend described your week to you, you would not call them lazy or behind. You'd tell them they were doing their best in a hard stretch. That is also true when it's you.",
  },
  {
    slug: "per-showing-up",
    category: "PERSONAL",
    headline: "You show up, which is most of it",
    body: "Not with the perfect words — nobody has those. You just went, sat, drove, called, stayed. People remember who was actually there with a clarity that never fades, and you are on that list for more than one person.",
  },
  {
    slug: "per-honesty",
    category: "PERSONAL",
    headline: "People trust you with the real version",
    body: "Friends tell you things they have not said out loud anywhere else. That is not luck. It is because you have never once made someone feel foolish for being honest with you.",
  },
  {
    slug: "per-small-discipline",
    category: "PERSONAL",
    headline: "The small thing you keep doing is working",
    body: "The habit that feels too minor to matter — the walk, the practice, the early night, the thing you started again after stopping. Progress at this scale is invisible day to day and undeniable over a year. You are further along than you can feel from here.",
  },
  {
    slug: "per-starting-over",
    category: "PERSONAL",
    headline: "Starting again is not starting from zero",
    body: "You are carrying everything you learned the first time, even if the scoreboard looks reset. Beginning again with your eyes open takes more courage than beginning the first time did, when you didn't know what it would ask of you.",
  },
  {
    slug: "per-noticing-people",
    category: "PERSONAL",
    headline: "You notice people",
    body: "You remember the appointment, the anniversary, the thing someone was nervous about. Being noticed is one of the deepest human needs and most of us go days without it. You hand it out constantly and think nothing of it.",
  },
  {
    slug: "per-forgiveness",
    category: "PERSONAL",
    headline: "You let people be more than their worst day",
    body: "You have given someone a second chance who genuinely needed one, and you did not hold it over them afterwards. That is a generous way to move through the world, and it says more about your character than about theirs.",
  },
  {
    slug: "per-courage-quiet",
    category: "PERSONAL",
    headline: "What you did took more nerve than it looked like",
    body: "The conversation you finally had, the door you closed, the thing you admitted. From the outside it may have looked like an ordinary Tuesday. You know what it cost. It counted.",
  },
  {
    slug: "per-keeping-promises",
    category: "PERSONAL",
    headline: "Your word is good",
    body: "When you say you'll be somewhere, you are. It sounds like the baseline, and it is not — plenty of people treat plans as provisional. Being someone whose yes is reliable makes you unusually restful to be close to.",
  },
  {
    slug: "per-caring-for-someone",
    category: "PERSONAL",
    headline: "The care you're giving is not going unseen",
    body: "Looking after someone is mostly repetition and logistics, and almost none of it feels meaningful in the moment. From the outside it is one of the most decent things a person can spend their life on. Please eat something and sit down for ten minutes.",
  },
  {
    slug: "per-hospitality",
    category: "PERSONAL",
    headline: "People relax in your company",
    body: "There is a specific comfort in being around someone who is not judging you, and you produce it without effort. Your friends behave more like themselves near you. That is not a small thing to be able to do for people.",
  },
  {
    slug: "per-hope",
    category: "PERSONAL",
    headline: "You are allowed to want things",
    body: "Somewhere along the way, wanting started feeling embarrassing or risky, so you got good at not needing much. The thing you have quietly wanted for years is still a legitimate thing to want. Nothing about being an adult required you to give it up.",
  },
  {
    slug: "per-loyalty",
    category: "PERSONAL",
    headline: "You stay",
    body: "You have stayed through the boring stretches and the difficult ones, with people and with commitments. Loyalty gets far less credit than charisma and it builds everything that actually lasts.",
  },
  {
    slug: "per-changing-mind",
    category: "PERSONAL",
    headline: "You grew, and you didn't have to announce it",
    body: "You are not the same person you were five years ago in some specific way you worked hard on. Nobody threw you a party for it. That change is real, and the people close to you can feel it even if they've never mentioned it.",
  },
  {
    slug: "per-gentleness-strength",
    category: "PERSONAL",
    headline: "Your softness is not a weakness",
    body: "You have been told, directly or otherwise, that you feel things too much. It is why people come to you. Staying open in a world that rewards armour is not naivety — it is a decision you make again every day, and it costs something.",
  },
  {
    slug: "per-boundaries",
    category: "PERSONAL",
    headline: "You are allowed to disappoint people",
    body: "You can say no to something that will drain you and remain a good person. The people worth keeping will still be there afterwards. The relief on the other side of that sentence is bigger than you expect.",
  },
  {
    slug: "per-rest",
    category: "PERSONAL",
    headline: "Rest is not a reward you have to earn",
    body: "You are treating rest as something to be unlocked once the list is finished, and the list is never going to be finished. You are allowed to stop while things are still undone. That is the only way anyone ever stops.",
  },
  {
    slug: "per-patience-with-others",
    category: "PERSONAL",
    headline: "You give people room",
    body: "You don't rush people through their grief, their indecision, or their slow patch. Sitting with someone while they take their time is uncomfortable, and you do it anyway. Very few people can tolerate that discomfort on someone else's behalf.",
  },
  {
    slug: "per-humour",
    category: "PERSONAL",
    headline: "You are genuinely funny",
    body: "Not performing, not scrolling for material — actually funny, in the moment, about the thing in front of you. You have gotten people through some grim weeks that way, including ones they never told you about.",
  },
  {
    slug: "per-self-respect",
    category: "PERSONAL",
    headline: "You walked away from something that was wearing you down",
    body: "Leaving a job, a friendship, or a version of your life that had stopped being good for you is not failure. It is one of the hardest forms of self-respect, and almost nobody applauds it at the time. It was the right call.",
  },
  {
    slug: "per-parenting-caring",
    category: "PERSONAL",
    headline: "The people in your care are safe with you",
    body: "You may spend a lot of energy on everything you didn't manage today. What the people around you are actually absorbing is that you are steady, you come back, and you are on their side. That is the part that shapes them.",
  },
  {
    slug: "per-lonely-stretch",
    category: "PERSONAL",
    headline: "This stretch is not permanent",
    body: "If it has been a lonely season, that is a circumstance, not a verdict on you. Rooms change, cities change, people arrive. You have been in a version of this before and it did eventually shift.",
  },
  {
    slug: "per-being-enough",
    category: "PERSONAL",
    headline: "You do not have to be impressive to be worth knowing",
    body: "The people who love you were not persuaded by your achievements and would not be un-persuaded by their absence. You could do nothing notable for a year and remain exactly as valuable to them. That is what it means that they actually know you.",
  },
  {
    slug: "per-generosity",
    category: "PERSONAL",
    headline: "You give more than you tell anyone about",
    body: "Money, time, attention, favours that were never mentioned again. You do it without keeping a ledger, which is the only kind of giving that counts. It has made things easier for more people than you realise.",
  },
  {
    slug: "per-integrity-personal",
    category: "PERSONAL",
    headline: "You are the same person in every room",
    body: "You don't have a different self for different audiences, and you don't say things behind people you wouldn't say in front of them. It makes you unusually restful company, and it is the reason people believe you.",
  },
  {
    slug: "per-asking-for-help",
    category: "PERSONAL",
    headline: "Asking for help is allowed",
    body: "You have carried a lot alone, partly out of habit and partly because you did not want to be a burden. The people who care about you would genuinely rather be asked than find out afterwards. Letting someone help is a gift to them too.",
  },
  {
    slug: "per-taste",
    category: "PERSONAL",
    headline: "The thing you care about is worth caring about",
    body: "The interest you have half-apologised for — the one that is not useful and does not scale. It is one of the more genuinely interesting things about you. You are allowed to spend a Saturday on it without justifying it to anyone.",
  },
  {
    slug: "per-grief",
    category: "PERSONAL",
    headline: "You are doing better than you think",
    body: "If you are getting through the day at all right now, that is the achievement, and it does not need to look like anything more than that. There is no schedule for this. Nobody is grading you.",
  },
];

export const MESSAGE_BANK: MessageTemplateSeed[] = [
  ...PROFESSIONAL_MESSAGES,
  ...PERSONAL_MESSAGES,
];

/**
 * Subject lines rotate so a daily recipient doesn't see the same one every
 * morning. All of them are deliberately anonymous — no sender, no product
 * shouting, nothing that hints at who paid.
 */
export const SUBJECT_LINES = [
  "Someone wanted you to hear this",
  "A few words for you, from someone who meant them",
  "Someone was thinking about you today",
  "This was written with you in mind",
  "Something someone wanted you to know",
] as const;
