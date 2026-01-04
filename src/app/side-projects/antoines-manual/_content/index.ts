import { ManualConfig } from "../_types";

// Chapter 1: Introduction
const chapter1 = `
# Welcome

The goal of this manual is for you to understand how to most effectively work with me. This document was written after a lot of documented trial and error in both my professional and personal life.

## What makes working with me easy

- Make the goal crisp
- Make ownership crisp
- Make progress visible
- Surface risks early
- Bring options with trade-offs
- Use prototypes and concrete examples whenever possible

## A small personal note

I care a lot about the work and I can bring intensity. It's because I want us to build things that actually matter, and because I'm protective of time: yours, mine, and the team's.

If you ever feel my intensity is misdirected, tell me. I'd rather adjust in the moment than have silent frustration accumulate.
`;

// Chapter 2: Personality
const chapter2 = `
# My Personality

I'm an INTJ (Architect) with some surge of ENTJ (Commander) when intensity is required. In short, I'm someone annoyingly curious, I value reason before emotions, I'm creative and love straightforward rationality and communication. I'm very self-aware which makes me seek ways to improve myself continually, often at my own expense.

## My main mode is INTJ

I run on models, first principles and long term horizon (I'm fascinated by macro-economics for instance). I want clarity, elegance and leverage. I dislike vague thinking and sloppy communication. I'd rather think alone, then show up with sharper takes, yet I usually absorb a lot of what others share and it sparks lots of fast associations for me (new angles, counterpoints, options).

## Social & energy pattern

I'm usually very present with people, but it costs me. I'm too self-conscious and noise + chaos exhaust me, so it drains my energy faster than for other people. At a team event, I'd be one of the first one to go to bed, not because I don't like others, but because I know my limits.

## Decision style

I make decisions based on the big picture—I'll ask "why" until it's uncomfortable and enjoy that. Once I have the "why" map, I quickly pick the most obvious direction, go fast and deep. This helps me a lot designing experiences that are holistic and cross products.

On the negative side, I may sometimes delay commitment to have a solid "why" which I have learned to deal with. Trusting that someone skilled asked why enough helps me go faster. It also happened that I miss short-term tactics because I'm too fascinated by the wrong level of analysis.

## Commander switch

Under pressure or high stakes, I tend to become a lot more direct and impatient and will seize ownership to unblock myself. I'll override ambiguity in decisions and push for outcomes. Now and then, I need to remind myself to bring people with me in such circumstances.

## Obsession with truth

I'm obsessive in my pursuit to solving problems, from mapping problems to solving them, I find myself craving the intellectual stimulus. On complex projects, I often wake up at 4am with a realization about a risk or edge case I hadn't accounted for.

---

In general, I have a strong internal locus of control, which basically means that I'm a strong believer that I can influence my own destiny. As an example, I usually take a lot more responsibility in the success or failure of a relationship than people around me.
`;

// Chapter 3: How to work with me
const chapter3 = `
# How to Work With Me

## Tie your *what* to the *why*

Unless you explain to me why you do something two levels deep, I'll either ask you that myself or not fully trust we're working on the right thing. The best way to work with me is to lead with this directly so we align on the goals first, then jump to the principles that lead to the "what."

## No surprises

Part of our job as product builders is to anticipate, hypothesise and validate. Late surprises usually mean we haven't done that job well enough.

If you only bring me bad news at the last minute, I'll assume one of three things: we weren't paying attention, we avoided uncomfortable conversations, or we didn't treat the work with enough seriousness.

## Fact based, low ego

When we work together, I do expect the discussions to be about the matter at hand. If the discussion is driven by ego, it will be unproductive in the pursuit of our common goal.

## Value time and focus

If we meet, be there on time and present. When possible, use async communication and be concise. When communicating, explain why something is urgent or important to me. In exchange, I'll do my best to do the same and keep us to these standards.

## Simplicity should win

The world is more complex than our brain can handle. To navigate it, we need to have layers of abstraction and simplify complex problems and solutions into simple words. That is true within a company, and with customers.
`;

// Chapter 4: What I Optimize For
const chapter4 = `
# What I Optimize For

## Real outcomes, not busywork

I'm allergic to "activity" that doesn't change anything meaningful. If we're investing time, I want to be able to answer at least one of these:

- Does it change customer behavior?
- Does it improve retention, revenue, conversion, quality, or speed?
- Does it reduce operational pain or future complexity?

If the answer is unclear, I will push to either clarify the intended impact or stop the work.

## Clarity as a force multiplier

I spend a lot of energy turning messy situations into something that can actually be executed. I don't like pseudo-alignment. I like explicit decisions, explicit trade-offs, and explicit ownership.

When something is unclear, I will keep pulling on the thread until it becomes concrete: who is the user, what is the job, what is the constraint, what is the metric, what is the plan.

## Systems over patches

I naturally think in systems. I care about primitives, not one-off screens. I care about how something scales when there are many groups, many conversations, many agents, many edge cases.

I'm happy to ship a v1, but I want the v1 to point toward a clean system rather than locking us into a pile of exceptions.

## Co-creation over handoffs

I work best when product, design, and engineering shape solutions together. I value rapid loops, early prototypes, and shared understanding over big handoffs.

If you want me at my best, involve me early when the problem is still being shaped.
`;

// Chapter 5: How I Think & Decide
const chapter5 = `
# How I Think & Decide

## I start with first principles, then demand grounding

I'm comfortable navigating ambiguity. I'll generate hypotheses fast and I'll challenge assumptions hard. But I don't like staying in "theory land." Once a direction emerges, I'll push for grounding: examples, evidence, constraints, or a cheap experiment that creates new facts.

## I am opinionated, but persuadable

I usually have a point of view. That can feel like I've already decided. Most of the time, I'm still testing the model.

The fastest way to move me is not to argue harder, but to show clearer reasoning and sharper trade-offs.

## I converge by forcing choices

When a team is stuck, I will try to compress the problem into a small set of real options. Then I'll ask us to choose.

If you feel I'm pushing too quickly, it's usually because I think the cost of waiting is higher than the cost of being wrong.

---

## My core principles

**Do it yourself.** This is the key principle I operate by. I like to fix problems and often get annoyed by bureaucratic process. I strongly believe that actions produce data and that there is no better time to fix something than now. I have a strong bias for action versus discussions about priorities.

> *"There is surely nothing quite so useless as doing with great efficiency what should not be done at all."* — Peter Drucker

This quote exposes one of my core beliefs. I'm annoyingly curious in my pursuit to understand why I need to do something, but when I understand it, I work fully autonomously. This means that I'm usually slower to get up to speed, but with time, I understood that my questions could be layered in a way that saves my energy, and the ones of my coworkers.
`;

// Chapter 6: Communication
const chapter6 = `
# How to Communicate With Me

## Start with what you need

If you message me, tell me why you're messaging me. I respond best when the intent is explicit.

- If you need a decision, say so and propose a recommendation
- If you need a review, tell me what you want feedback on
- If you're sharing an update, tell me what changed and why it matters

## Give me structure, not volume

I prefer short writing with a strong shape. If you bring me something with a clear problem statement, constraints, options, and a recommendation, I will be fast and useful.

If you bring me something that's unstructured, I will ask a lot of questions and it can feel like I'm "slowing you down." Usually I'm trying to prevent us from building the wrong thing.

## Make assumptions explicit

I love when people label assumptions. It makes discussions clean. It also makes it easier to decide what we should validate.

## No late surprises

Late surprises break trust quickly.

If something is slipping, risky, unclear, or blocked, tell me early. I don't need perfection. I need visibility.

---

## How to disagree with me

Disagreeing with me is not only allowed, it's encouraged.

I respond best to direct disagreement paired with clear reasoning and explicit trade-offs.

- If you think I'm wrong, say it plainly
- If you have better evidence, show it
- If you want me to change my mind, don't try to be polite—try to be precise
`;

// Chapter 7: Collaboration
const chapter7 = `
# What I Expect From Collaboration

## High ownership and high visibility

I don't micromanage by default. I assume competence and I give trust.

To keep that trust, I need two things: strong ownership and strong communication.

**Ownership** means you don't outsource thinking. You come with options. You propose a path. You make progress even when you're blocked.

**Visibility** means you keep work legible: what's happening, what changed, what's at risk, and what you need.

## Quality matters

I get frustrated by laziness, satisfaction with poor output, or pretending something is "done" when it clearly isn't.

If you're unsure whether the output is good, show it early. I'd rather steer a draft than critique a reveal.

## Goals must be crisp

If the goal is vague, execution becomes noisy. I will push hard for clarity on the goal.

When goals are crisp, I'm easy to work with. When goals are fuzzy, I become demanding because I'm trying to create a stable target.

---

## What tends to create friction with me

- Late surprises
- Poor communication
- Vague goals
- Low ownership
- Accepting weak output as "fine"
- Trying to move forward without acknowledging trade-offs
`;

// Chapter 8: Failure Modes
const chapter8 = `
# Failure Modes & Stress

Over the years, I understood some of my internal failure modes:

- **Over-framing:** I keep zooming out to perfect the "why," and decisions slip
- **Premature commander switch:** I push for closure before the model is stable, and bulldoze
- **Intensity as default:** my focus reads as pressure; people feel managed, not trusted
- **Sharpness under low clarity:** vague thinking triggers impatience; tone becomes cutting
- **Over-commitment:** once I pick a direction, I go very deep and discount disconfirming signals
- **Under-communicating in build mode:** I disappear to synthesize/execute; others feel blindsided
- **Optimizing over empathizing:** I jump to solutions when someone wanted reassurance first
- **Control via "best idea wins":** debates become persuasion contests; relationships take damage
- **High standards leakage:** excellence bar spills into everyday life; others feel "never enough"
- **Sensory/energy depletion:** noise + social exposure drains me; I become less patient and more rigid

---

## How I behave when stressed

When I'm stressed, you'll notice three patterns:

1. **Impatience**
2. **Less concise** — I can have difficulty expressing myself clearly because I'm trying to compress too many threads at once
3. **Trying to be everywhere at once** — I lose focus and perspective and start jumping between topics

If you see this, the best way to help is to force focus:

- Ask me what the single most important decision is right now
- Ask me what "good enough" looks like for the next step
- Propose a timebox and a next action

This usually brings me back to being effective quickly.

---

Over time, I've built myself guardrails to avoid periods of stress; usually it means I go back to my core competency, key goals and ignore the rest. In these periods I tend to say no a lot more often or take longer to respond.
`;

// Chapter 9: Compatibility
const chapter9 = `
# Personality Compatibility

Understanding how different personality types interact with my INTJ/ENTJ mix can help set expectations for collaboration.

## High fit personalities

| Type | Name | Fit | Why it works |
|------|------|-----|--------------|
| INTJ | Architect | 90% | Similar strengths, shared language |
| ENTJ | Commander | 85% | Adds pace and force |
| INTP | Logician | 80% | Improves rigor + falsification |
| ENTP | Debater | 75% | Great at stress-testing + ideation |

## High complement personalities

| Type | Name | Complement | What they add |
|------|------|------------|---------------|
| ENFJ | Protagonist | 85% | Buy-in, narrative, conflict smoothing |
| ISTJ | Logistician | 80% | Turns direction into stable ops |
| INFJ | Advocate | 75% | Stakeholder and emotional signal |
| ESFJ | Consul | 75% | Rituals, coordination, stakeholder warmth |

---

## Key guardrails by type

**With INTJs:** Early doc-sharing + decision log to avoid parallel solo work

**With ENTJs:** Clear decision rights + disagree/commit to prevent power escalation

**With INTPs:** Timebox + ship v0 default to avoid analysis loops

**With ENTPs:** Decision freeze date + parking lot to prevent endless debate

**With INFJs:** Lead with intent + ask for their read first to maintain trust

**With ISTJs:** Give end-state + let them own the how to avoid rigidity

**With ENFJs:** 2-phase process (align → decide) + clear decision owner
`;

export const manualConfig: ManualConfig = {
  title: "Antoine's Manual",
  subtitle: "A practical guide to working together",
  chapters: [
    {
      id: "welcome",
      number: 1,
      title: "Welcome",
      content: chapter1,
    },
    {
      id: "personality",
      number: 2,
      title: "My Personality",
      content: chapter2,
    },
    {
      id: "how-to-work",
      number: 3,
      title: "How to Work With Me",
      content: chapter3,
    },
    {
      id: "optimize",
      number: 4,
      title: "What I Optimize For",
      content: chapter4,
    },
    {
      id: "think-decide",
      number: 5,
      title: "How I Think & Decide",
      content: chapter5,
    },
    {
      id: "communication",
      number: 6,
      title: "Communication",
      content: chapter6,
    },
    {
      id: "collaboration",
      number: 7,
      title: "Collaboration",
      content: chapter7,
    },
    {
      id: "failure-modes",
      number: 8,
      title: "Failure Modes & Stress",
      content: chapter8,
    },
    {
      id: "compatibility",
      number: 9,
      title: "Personality Compatibility",
      content: chapter9,
    },
  ],
};
