---
title: "Top 3 Claude Code Skills I Use Every Day (+ Bonus)"
description: "Custom skills that changed how I work with Claude Code: /review, /grill-me, /caveman, and the powerful /grill-with-docs."
pubDate: "May 17 2026"
heroImage: "/claude_code.png"
---

## What Are Claude Code Skills?

Skills are custom instructions you can add to Claude Code to extend its behavior. Think of them as reusable prompts that trigger specific workflows.

You can invoke them with slash commands like `/review` or `/grill-me`, and Claude follows the instructions defined in the skill file.

Some skills are built-in, others come from the community. Here are the ones I use most.

---

## 1. /review (Built-in)

This is a built-in Claude Code skill that performs code review on Pull Requests.

**What it does:**
- Fetches PR details and diff using `gh pr view` and `gh pr diff`
- Analyzes code quality and style
- Identifies potential bugs, security issues, and risks
- Suggests specific improvements
- Checks for test coverage and project conventions

**When I use it:**
Before merging any PR. I pass the PR number and get a thorough review.

**Example:**
```bash
/review 42
```

Or just `/review` to list open PRs first, then pick one to review.

---

## 2. /grill-me

This skill comes from [Matt Pocock's skill collection](https://github.com/mattpocock/skills). It's simple but powerful.

**What it does:**
- Interviews you relentlessly about a plan or design
- Walks through each branch of your decision tree
- Forces you to think through edge cases you missed
- If a question can be answered by exploring the codebase, it explores instead of asking

**The full skill definition:**
```text
Interview me relentlessly about every aspect of this plan until we
reach a shared understanding. Walk down each branch of the design
tree, resolving dependencies between decisions one by one.

And finally, if a question can be answered by exploring the code
base, explore the code base instead.
```

**When I use it:**
Before implementing anything complex. I describe my plan, type `/grill-me`, and Claude stress-tests my thinking. It's like having a senior engineer review your architecture before you write a single line of code.

**Example:**
```text
I'm thinking of implementing offline-first in our React Native app.
We'd use WatermelonDB for local storage and sync when back online.

/grill-me
```

Claude will ask things like: "What happens when the user edits the same record offline on two devices?", "How do you handle conflict resolution during sync?", "What's your strategy for large datasets that don't fit in memory?"

---

## 3. /caveman

Also from Matt Pocock. This one saves tokens and keeps responses tight.

**What it does:**
- Ultra-compressed communication mode
- Drops filler words, articles, and pleasantries
- Keeps all technical substance intact
- Cuts token usage by ~75%

**The style:**

Not: "Sure! I'd be happy to help you with that. The issue you're experiencing is likely caused by..."

Yes: "Bug in auth middleware. Token expiry check use `<` not `<=`. Fix:"

**Rules it follows:**
- Drop articles (a/an/the)
- Drop filler (just/really/basically/actually)
- Drop pleasantries (sure/certainly/of course)
- Abbreviate common terms (DB/auth/config/req/res/fn/impl)
- Use arrows for causality (X -> Y)

**When I use it:**
When I'm deep in a debugging session and don't need explanations. Just answers.

**Example:**
```text
/caveman

Why is my FlatList re-rendering all items when I update one?
```

Response: "keyExtractor return index -> all items re-render on data change. Use unique id. Wrap renderItem in `memo`."

To turn it off: "stop caveman" or "normal mode".

---

## BONUS: /grill-with-docs

This is the evolved version of `/grill-me`. Same relentless questioning, but with documentation superpowers.

**What it adds:**
- Challenges your plan against your existing domain model
- Cross-references with your actual code ("Your code does X, but you just said Y. Which is right?")
- Updates CONTEXT.md inline as terms are resolved
- Offers to create ADRs (Architecture Decision Records) when you make important decisions

**Key behaviors:**
- If you use a term that conflicts with your glossary, it calls it out immediately
- If you use vague terms, it proposes precise canonical terms
- It stress-tests relationships with concrete scenarios

**When I use it:**
For bigger architectural decisions where I want the conversation to also produce documentation. The decisions I make get recorded, so future me (or teammates) understand why we did things a certain way.

---

## How to Add These Skills

1. Create a `.claude/skills/` folder in your project
2. Add a `SKILL.md` file for each skill
3. Use the frontmatter format:

```markdown
---
name: skill-name
description: When to use this skill
---

Your instructions here...
```

You can find Matt Pocock's full skill collection on GitHub: [mattpocock/claude-code-skills](https://github.com/mattpocock/skills)

---

## Conclusion

These four skills cover most of my daily workflow:

- **/review** for catching issues before PRs
- **/grill-me** for stress-testing plans
- **/caveman** for fast, token-efficient responses
- **/grill-with-docs** for architectural decisions that need documentation

The best part? You can create your own skills for repetitive workflows. If you find yourself giving Claude the same instructions repeatedly, that's a skill waiting to be written.
