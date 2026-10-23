# Syncy

Scan someone's LinkedIn or Xing QR code at a networking event, record a 20-second voice note, and get a contact card in your Notion: what you talked about, which of your projects it matters for, and the next step.

Built at the BCBT AI Entrepreneurship Hackathon, CIC Berlin, 23–26 Oct 2026.

## What's here

| File | What it is |
|---|---|
| [IDEA_PITCH.md](IDEA_PITCH.md) | The six pitch answers, how it works, pitch script |
| [SLIDES_BRIEF.md](SLIDES_BRIEF.md) | Slide-by-slide content for the pitch deck |
| [docs/screenshots/](docs/screenshots/) | Prototype screenshots for the slides |
| [prototype/index.html](prototype/index.html) | Clickable frontend prototype (demo data, AI simulated) |
| [PM_PLAN.md](PM_PLAN.md) | Plan, roles, timeline, cost log, decisions |
| [ACCEPTANCE_CRITERIA.md](ACCEPTANCE_CRITERIA.md) | Milestone gates and product acceptance criteria |

## Run the prototype

Open `prototype/index.html` in a browser, or serve it:

```bash
python3 -m http.server 5173 --directory prototype
```

Then go to http://localhost:5173.

The prototype uses invented people and fake profile URLs. AI output and the Notion save are simulated.
