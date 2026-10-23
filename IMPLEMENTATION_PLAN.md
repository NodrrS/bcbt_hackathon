# Implementation Plan — Syncy

> Per-person checklists, Day 1 (Fri 23 Oct) → Day 4 (Mon 26 Oct).
> Gates and AC numbers refer to [ACCEPTANCE_CRITERIA.md](ACCEPTANCE_CRITERIA.md); timeline in [PM_PLAN.md §3](PM_PLAN.md).
> **Phase 1 = Supabase** (events, projects, contacts). Notion / notes-app sync is **Phase 2** and not built this weekend.
> Single sources of truth: screens = [prototype/index.html](prototype/index.html) + [prototype/dashboard.html](prototype/dashboard.html) · schema = [supabase/migrations/0001_phase1_schema.sql](supabase/migrations/0001_phase1_schema.sql) · flow and field mapping = [docs/DATA_MODEL.md](docs/DATA_MODEL.md). If this plan and those files disagree, the files win; fix the plan.
> Rule of thumb: the AI processing endpoint (Utkarsh) is the critical path for the 30% "works live" score; everyone else parallelizes around it and never blocks it.

| Who | Owns | Judging weight covered |
|---|---|---|
| **Nodir** | PM, phone app frontend (event → scan → note → review), PRD, pitch, submission | 30% works live (with Utkarsh) · 15% demo |
| **Anastasiya** | ICP, interviews, positioning, GTM, CX-UX copy, demo script | 20% real problem/user · 15% demo |
| **Bhuvanesh** | Supabase demo data, contacts dashboard, BI numbers, cost log | 15% cost & dependencies (with Sadaf) |
| **Utkarsh** | Supabase project + schema, AI processing endpoint (STT + 2 LLM calls) | 30% works live |
| **Sadaf** | Pricing, competition, market analysis, business slides | 20% who pays & why switch |

**Hard dependencies (watch these):**
1. Utkarsh's Supabase project with the migration applied must exist **before** Nodir and Bhuvanesh swap the prototype's `data.js` for supabase-js (end of Day 1).
2. The clickable prototype **is** the screen spec. Anastasiya refines its copy; nobody redesigns the flow after Day 1.
3. Utkarsh's `POST /api/contacts/:id/process` must be up by Day 2 morning so Nodir can wire Processing → Review before the **midday M3 gate**.
4. Sadaf's cost numbers need Utkarsh's actual per-call costs (Day 2 afternoon).

---

## Phase 1 build map (mirrors the prototype and the schema)

| # | Screen | User does | Writes / reads (table.columns) | How | Owner | AC |
|---|---|---|---|---|---|---|
| 1 | **Event picker** (Today, no event) | Choose an event, create one, or edit its details (name, place, date, link) → **Enter event** | `events`: name, location, url, starts_on | supabase-js select / insert / update | Nodir | P-1 |
| 2 | **Event home** | See people scanned here, "Needs a note" badges, open / add / edit the event link, Leave | `contacts` where event_id; `events.url` | supabase-js | Nodir | P-1 |
| 3 | **Scan** | Point camera at a QR | `contacts` insert: source, profile_url, profile_slug, name (from slug), event_id, scanned_at, `status='captured'`; same person + event = existing row (unique index) | Camera QR library (D3) + `parseProfile()` from data.js; supabase-js insert | Nodir | P-2 |
| 4 | **Project pick** (note screen, optional) | Tap a project, "Let AI suggest" or "No project" | `contacts`: project_id, `project_set_by='user'`, match_reason | supabase-js update | Nodir | P-3 |
| 5 | **Note** | Write a note **or** record a voice memo; "Later" skips | `contacts`: note_kind, note_text (typed) or audio_path; audio → Storage `voice-notes/<user_id>/<contact_id>.webm` | supabase-js update + Storage upload | Nodir | P-4 |
| 6 | **Processing** | Wait ≤ 15 s | `status='processing'` → AI fields → `status='review'`; failure → `status='error'`, note kept | `POST /api/contacts/:id/process` (server, key never in the browser) | Utkarsh | P-5, P-7 |
| 7 | **Review** | Edit any field, change the project, Save | name, role, company, summary, discussed[≤3], needs, project_id, project_set_by, match_reason, next_step, next_step_date, follow_up_draft, `status='saved'` | supabase-js update | Nodir | P-6 |
| 8 | **Projects tab** | See projects, add one (name + description) | `projects`: name, description, emoji | supabase-js select / insert | Nodir | P-5 |
| 9 | **Dashboard** (desktop) | Filter (search, project, event, due, capture status, source, stage), sort, edit every field, stage, notes | `contacts` (all columns incl. stage, user_notes), `events`, `projects` | supabase-js select / update | Bhuvanesh | P-8 |
| — | **Demo data** | — | seed rows for all three tables | `supabase/seed.sql` generated from `prototype/data.js` | Bhuvanesh | P-9 |

### The processing endpoint (step 6)
`POST /api/contacts/:id/process`, runs server-side (stack per D1; a Supabase Edge Function also works):
1. Read the contact row; set `status='processing'`.
2. If `note_kind='voice'`: download `audio_path` from Storage → speech-to-text (D7) → store the transcript in `note_text`.
3. **LLM call 1:** note_text + name-from-slug + event name → `{name?, role?, company?, summary, discussed[≤3], needs, next_step, next_step_date?}`. Unknown = empty, never invented.
4. **LLM call 2:** call-1 JSON + the user's `projects` (name + description, `archived=false`) → `{project_id | null, match_reason (quotes the note), match_confidence, follow_up_draft}`. **If `project_set_by='user'`, keep the user's project** and only draft the follow-up.
5. Write the fields, set `status='review'`, return the row. On any failure: `status='error'`, note and audio stay, the app offers Retry.

### Swapping the prototype for the real backend
The prototype already uses the schema's table and column names. Replace the four `db.*` functions in `prototype/data.js` with supabase-js (mapping in [docs/DATA_MODEL.md §3](docs/DATA_MODEL.md)) and replace `simulateAI()` with a call to the endpoint above. Screens stay as they are.

---

## Nodir — PM · phone app frontend · PRD · pitch

### Day 1 (today)
- [ ] Deliver the 13:00 idea pitch; log mentor feedback in PM_PLAN §9 within 15 min (AC-1.7)
- [ ] PRD v1 ([PRD.md](PRD.md)) incl. the Phase 1 / Phase 2 note; run the 15-min lock-in on its §12 decision table, record outcomes in PM_PLAN §9 (AC-1.3)
- [ ] Choose the frontend stack **with the mentor** together with Utkarsh (Supabase is decided); record in PM_PLAN §5; no switching after (AC-2.1)
- [ ] GitHub repo live, all 5 members have access (AC-2.3)
- [ ] Day 2 backlog written from the build map above; every member has a morning task (AC-2.5)

### Day 2 (Sat)
- [ ] Screens 1–5 on supabase-js: event picker (create / edit / link), event home, scan with real camera QR (D3), project chips, note (text + voice upload)
- [ ] Wire Processing → `POST /api/contacts/:id/process`; **end to end by midday** (M3, AC-3.1–3.3)
- [ ] Review screen: every AI field editable, project re-assignable, Save sets `status='saved'` (P-6)
- [ ] Projects tab: list + add project (P-5)
- [ ] Evening: slides v1 skeleton in the official template with Anastasiya + Sadaf

### Day 3 (Sun — clocks went back 1 h)
- [ ] Error state on Processing: message + Retry, note kept (P-7)
- [ ] Run the non-builder usability test, fix what it surfaces (AC-4.2)
- [ ] Call and enforce **feature freeze** in the afternoon (AC-4.3)
- [ ] README updated: what it does, how to run, live URL (AC-6.1)
- [ ] **Submit GitHub link + slides end of day** (M6)

### Day 4 (Mon)
- [ ] Pre-flight checklist (PM_PLAN §8) done 1 h before the slot (AC-7.6)
- [ ] Present; if the live demo fails, switch to video and keep talking

## Anastasiya — ICP · GTM · positioning · CX-UX · demo script

### Day 1 (today)
- [ ] 3 Mom-Test conversations in the building; log in PM_PLAN §4; replace the ⚠️ numbers in IDEA_PITCH.md (AC-1.2)
- [ ] ICP v1: one named role (Berlin freelance consultant/dev who networks for clients), not a sector
- [ ] Walk the clickable prototype ([prototype/index.html](prototype/index.html)) end to end; list copy and flow issues for Nodir by end of day (AC-2.6)

### Day 2 (Sat)
- [ ] On-screen copy for every step: event picker, scan, project pick, note, review, dashboard empty states; a stranger must complete the flow unaided (feeds AC-4.2)
- [ ] Positioning one-liner + "why switch" story with Sadaf
- [ ] Demo script outline (AC-3.5): enter the event → scan → pick project → voice memo → review → dashboard. Story follows the freelancer, not the tech (AC-7.5)
- [ ] 2 more interviews; pull one quotable quote for the slides (AC-7.2)

### Day 3 (Sun)
- [ ] Final demo script; rehearse the speaker ×2, timed (AC-7.5)
- [ ] Record the ≤ 2-min demo video with Nodir; store locally + backup (M5, AC-5.1–5.2)
- [ ] GTM slide: channel, first 10 customers; Notion / notes-app sync as the Phase 2 roadmap item

### Day 4 (Mon)
- [ ] Support Q&A on user, problem evidence, ICP (AC-7.2)

## Bhuvanesh — demo data · dashboard · BI

### Day 1 (today)
- [ ] Demo data plan: the invented events, projects and personas in [prototype/data.js](prototype/data.js) become `supabase/seed.sql`; fake profile URLs only, **no real personal data** (AC-2.4, P-9)
- [ ] Walk the dashboard prototype ([prototype/dashboard.html](prototype/dashboard.html)); confirm every column maps to the schema ([docs/DATA_MODEL.md §4](docs/DATA_MODEL.md))

### Day 2 (Sat)
- [ ] Load the seed into Utkarsh's Supabase project; check the RLS demo user sees exactly these rows
- [ ] Dashboard on supabase-js: list, filters, sorting, detail panel edits, stage, event link (P-8)
- [ ] Start the running-cost log per tool with Sadaf (PM_PLAN §7)

### Day 3 (Sun)
- [ ] Numbers for the slides from the dashboard: contacts captured, follow-ups due, € cost per contact (feeds AC-7.4)
- [ ] Cost log complete for every tool / service (AC-4.4)
- [ ] Stability check: main path 3 runs in a row on demo data without errors (AC-4.1)

### Day 4 (Mon)
- [ ] Reset before the demo: re-run `supabase/seed.sql` so the demo starts clean
- [ ] Backup: dashboard already open in a second tab

## Utkarsh — Supabase · AI processing

### Day 1 (today)
- [ ] Stack decision with mentor + Nodir (AC-2.1); API key in `.env`, `.env` in `.gitignore`, key shared only in the team channel (AC-2.2)
- [ ] Supabase project; apply [0001_phase1_schema.sql](supabase/migrations/0001_phase1_schema.sql) (tables, RLS, `voice-notes` bucket); demo user per D6 so RLS works (one demo account or anonymous sign-in)
- [ ] Share the project URL + publishable key with Nodir and Bhuvanesh (the secret key stays server-side)
- [ ] Scan rules: `parseProfile()` for LinkedIn, Xing and other links (P-2). **No scraping, URL only** (PM_PLAN §9 decision)

### Day 2 (Sat) — morning is the M3 critical path
- [ ] `POST /api/contacts/:id/process`: voice memo → speech-to-text (D7); typed note goes straight to LLM call 1 (P-4)
- [ ] LLM call 1: summary JSON (P-4); LLM call 2: best project from the `projects` table + reason + follow-up draft; keep a user-picked project (P-5)
- [ ] **Show it running end to end to the mentor at the midday check-in** (AC-3.3)
- [ ] Afternoon: failures set `status='error'` and keep the note and audio for retry (P-7)
- [ ] Prompt + JSON schema validation: unknown fields stay empty, never invented (P-4)
- [ ] Hand actual per-call costs to Sadaf (speech-to-text + 2 LLM calls)

### Day 3 (Sun)
- [ ] Deploy to a live HTTPS URL (camera and mic need it, D9); runs without a developer stepping in (AC-3.2, AC-6.1)
- [ ] After freeze: fixes only (AC-4.3)
- [ ] Repo history clean of secrets (AC-6.6)

### Day 4 (Mon)
- [ ] API key valid, credits left (pre-flight); on standby during the demo

## Sadaf — pricing · competition · market

### Day 1 (today)
- [ ] Competitor table v1: LinkedIn connect + notes app (status quo), HubSpot/Folk/Dex (too heavy), Blinq/HiHello (card swap, no conversation capture); price and gap per row
- [ ] Sit in on Anastasiya's interviews; test the €9.99/month hypothesis; replace the ⚠️ in IDEA_PITCH.md #6

### Day 2 (Sat)
- [ ] Pricing + cost model v1 (AC-3.4): €9.99/month freelancer, €19/seat teams later; unit cost ~€0.01–0.015 per contact from Utkarsh's real numbers
- [ ] Market one-pager: freelancers/consultants in DE who network regularly (rough TAM/SAM)
- [ ] "Why switch" slide with Anastasiya: one client won pays for years of the app (AC-7.3)

### Day 3 (Sun)
- [ ] Final running-cost breakdown with Bhuvanesh, incl. dependencies + risks: LLM / speech-to-text provider, Supabase (database, storage, auth), hosting; Notion API only from Phase 2 (AC-4.4, AC-7.4)
- [ ] Business slides final in the official template: user, problem, price, cost, why switch, dependencies (AC-6.4)

### Day 4 (Mon)
- [ ] Field judge questions on pricing, competition, market size (AC-7.3)

---

## Shared — whole team

- [ ] Daily: 10-min sync at start of day + before each mentor check-in
- [ ] Day 3: 15-min walkthrough so **every member can explain every part**: screens, schema, both prompts (AC-6.5, AI policy, judges check this)
- [ ] Every tool used goes in the tool log with "who can explain it" (PM_PLAN §7)
- [ ] Decisions and mentor feedback go in PM_PLAN §9 the same day
- [ ] Sunday morning: re-check the schedule, clocks went back overnight (DST risk, PM_PLAN §8)

## Later (Phase 2, not this weekend)
- Notion / notes-app sync: projects in, contacts out ([docs/DATA_MODEL.md §5](docs/DATA_MODEL.md))
- Badge / business-card photo and vCard QR (D4)
- Reminders when a follow-up is due
