# Acceptance Criteria

> Derived from the BCBT Hackathon Field Notes. Each milestone has a gate: all ACs must pass before moving on.
> Product-specific ACs (section P) are filled once the idea is chosen.
> Format: **Given / When / Then** for behaviour, checklists for deliverables.

| Milestone | When | Gate owner |
|---|---|---|
| M1 Idea pitch | **Fri 23 Oct, 13:00** | PM |
| M2 Stack + build plan | Fri 23 Oct, end of day | Build lead |
| M3 End-to-end slice | Sat 24 Oct, midday | Build lead |
| M4 Feature freeze | Sun 25 Oct, afternoon | PM |
| M5 Demo video | Sun 25 Oct | Demo lead |
| M6 Submission | Sun 25 Oct, end of day | PM |
| M7 Live demo | Mon 26 Oct | PM + speaker |

---

## M1 — Early idea pitch (13:00 today)

**AC-1.1 Problem**
- [ ] One sentence that names **who**, **how much time** (or €), **which task**, and **why** it happens.
- [ ] Passes the 5-question filter with ≥ 4 yeses (weekly · quantifiable · existing workaround · AI-suited core · rough version by Day 2 midday).

**AC-1.2 User**
- [ ] One role we could find and talk to this weekend (e.g. "office manager at a language school"), not a sector ("schools").
- [ ] At least **1 real conversation** with someone in or near that role, about their last week (Mom Test), logged in PM_PLAN §4.

**AC-1.3 Product**
- [ ] What it does, in **one line**.
- [ ] Scope is one user · one task · one screen; everything else is on the "Later" list.

**AC-1.4 What the AI does**
- [ ] Names the AI job explicitly: reads / sorts / drafts / searches documents / summarises.
- [ ] Given the AI step were removed, then the product would no longer work (the AI is not decoration).

**AC-1.5 Name**
- [ ] One name used for both product and team. Decided in ≤ 5 minutes.

**AC-1.6 Business case**
- [ ] Who pays and a concrete price (€ / month / unit).
- [ ] What they use today and why they would switch (hours or € saved).
- [ ] First estimate of monthly running cost.
- [ ] *If inside a company:* named sponsor role and whose budget pays.

**AC-1.7 Delivery**
- [ ] All six answers written in [IDEA_PITCH.md](IDEA_PITCH.md) by **12:45**.
- [ ] One dry run done; pitch fits in the given slot (target ≤ 2 min).
- [ ] Speaker chosen; every team member can state the problem in their own words.
- [ ] Mentor feedback captured in PM_PLAN §9 within 15 min after the pitch.

---

## M2 — Stack & build plan (end of Day 1)

- [ ] **AC-2.1** Tool stack chosen **with the mentor** and recorded in PM_PLAN §5; team commits not to switch.
- [ ] **AC-2.2** API key received; stored in `.env`; `.env` is in `.gitignore`; key shared only in the team channel. Given a fresh clone of the repo, when searching for the key, then it is not found.
- [ ] **AC-2.3** GitHub repo exists and every team member can access it.
- [ ] **AC-2.4** Data source chosen: fake or open data only (Mockaroo, Kaggle, Berlin / EU Open Data). No real personal data.
- [ ] **AC-2.5** Day 2 backlog written with owners; every team member has a task for the morning.
- [ ] **AC-2.6** First sketch of the one main screen exists.

---

## M3 — End-to-end by Day 2 midday

- [ ] **AC-3.1** Given the target user's input, when they run the product, then a **real AI model call** is made and the result appears on screen. (Rough UI is fine.)
- [ ] **AC-3.2** The flow runs start → finish without a developer stepping in manually.
- [ ] **AC-3.3** Shown running to the mentor at the midday check-in.
- [ ] **AC-3.4** Price and cost-per-month model v1 drafted (business lead).
- [ ] **AC-3.5** Demo script outline drafted (demo lead).

---

## M4 — Feature freeze (Day 3 afternoon)

- [ ] **AC-4.1** Main path works on demo data 3 runs in a row without errors.
- [ ] **AC-4.2** Given someone who **did not build it**, when they use it with only the on-screen instructions, then they complete the main task unaided.
- [ ] **AC-4.3** After freeze: no new features merged — only fixes (enforced by PM).
- [ ] **AC-4.4** Running-cost log complete for every tool / service used.

---

## M5 — Demo video (Day 3)

- [ ] **AC-5.1** ≤ 2-minute screen recording showing the product working end to end with real AI output.
- [ ] **AC-5.2** Stored locally on the presenter laptop **and** one backup location.

---

## M6 — Submission (end of Day 3)

- [ ] **AC-6.1** GitHub link submitted; repo has a README with what it does, how to run it, and the live URL.
- [ ] **AC-6.2** Slides submitted in the **official template** (Gamma drafts allowed, final in template).
- [ ] **AC-6.3** Slides list **every AI tool used and what for** (AI policy).
- [ ] **AC-6.4** Slides cover: user, problem, product, what the AI does, price, monthly cost, why switch, dependencies.
- [ ] **AC-6.5** Every team member can explain every part of the product (AI policy).
- [ ] **AC-6.6** No secrets in the repo history.

---

## M7 — Live demo (Day 4)

Mapped to the judging weights:

| Weight | AC | Pass condition |
|---|---|---|
| 30% | **AC-7.1 Works live** | Product runs live on stage with real AI calls; fallback video ready if it fails. |
| 20% | **AC-7.2 Real problem / real user** | One named user role + evidence from real conversations (quotes, hours lost). |
| 20% | **AC-7.3 Who pays & why switch** | Price, buyer, current alternative, and switching reason stated in one slide. |
| 15% | **AC-7.4 Cost & dependencies** | Monthly running cost with breakdown; key dependencies + risk named. |
| 15% | **AC-7.5 Demo quality** | Rehearsed ≥ 2×; within time; story follows the user, not the tech. |

- [ ] **AC-7.6** Pre-flight checklist (PM_PLAN §8) completed 1 hour before the slot.

---

## P — Product acceptance criteria (fill after M1)

> Template — one block per user-facing capability. Keep to the one-task scope.

**P-1 `<capability name>`**
- Given `<user role>` with `<input / context>`
- When `<action>`
- Then `<observable result>` within `<time>`
- And the AI `<reads / sorts / drafts / searches / summarises>` `<what>`
- And `<user stays in control: e.g. reviews before sending>`

**P-2 Error handling**
- Given the AI call fails or times out, when the user submits, then a clear message is shown and no data is lost.

**P-3 Data**
- Given any demo, then only fake / open data is used and no API key appears client-side.
