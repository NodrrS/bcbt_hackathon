# Syncy

Enter the event you're at, scan someone's LinkedIn or Xing QR code, then write a quick note or record a 20-second voice memo. Syncy turns it into a contact card: what you talked about, which of your projects it matters for, and the next step. Phase 1 stores everything in Supabase and shows it in a contacts dashboard; Notion / notes-app sync is Phase 2.

Built at the BCBT AI Entrepreneurship Hackathon, CIC Berlin, 23–26 Oct 2026.

## What's here

| File | What it is |
|---|---|
| [IDEA_PITCH.md](IDEA_PITCH.md) | The six pitch answers, how it works, pitch script |
| [PRD.md](PRD.md) | Detailed product requirements + decisions to lock in (🔒) |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Current, Phase 1 and Phase 2 architecture (Mermaid) |
| [docs/BACKEND_BRIEF.md](docs/BACKEND_BRIEF.md) | Backend build & wiring instructions: journey → calls, tools, keys, order |
| [docs/BUSINESS_TASKS.md](docs/BUSINESS_TASKS.md) | Economics, pricing, research and marketing tasklists (Sadaf, Anastasiya) |
| [SLIDES_BRIEF.md](SLIDES_BRIEF.md) | Slide-by-slide content for the pitch deck |
| [docs/screenshots/](docs/screenshots/) | Prototype screenshots of the Phase 1 flow and the dashboard, for the slides |
| [prototype/index.html](prototype/index.html) | Clickable phone prototype, Phase 1 flow (demo data, AI simulated) |
| [prototype/dashboard.html](prototype/dashboard.html) | Contacts dashboard: filter, sort, edit (shares data with the phone prototype) |
| [docs/DATA_MODEL.md](docs/DATA_MODEL.md) | Phase 1 data model, flow, and Phase 2 Notion / notes-app sync design |
| [supabase/migrations/](supabase/migrations/) | Supabase schema (events, projects, contacts, RLS, voice-notes bucket) |
| [PM_PLAN.md](PM_PLAN.md) | Plan, roles, timeline, cost log, decisions |
| [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md) | Per-person Day 1–4 checklists |
| [ACCEPTANCE_CRITERIA.md](ACCEPTANCE_CRITERIA.md) | Milestone gates and product acceptance criteria |

## Run the prototype

Open `prototype/index.html` in a browser, or serve it:

```bash
python3 -m http.server 5173 --directory prototype
```

Then go to http://localhost:5173.

Open `dashboard.html` the same way for the contacts dashboard; both pages share their data in the browser.

The prototype uses invented people and fake profile URLs. AI output is simulated, and rows are stored in the browser (localStorage) with the same tables and columns as the Supabase schema.
