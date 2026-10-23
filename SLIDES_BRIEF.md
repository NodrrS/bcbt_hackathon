# Syncy: slide brief for the pitch deck

> Content for each slide, ready to paste into the official template (Gamma for drafts is fine; the final version goes in the template).
> Source of truth: [IDEA_PITCH.md](IDEA_PITCH.md). Screenshots: [docs/screenshots/](docs/screenshots/).
> ⚠️ = a guess we still have to confirm by talking to real users. Replace it with real numbers or quotes before the final deck.

Judges score: **30%** works live · **20%** real problem for a real user · **20%** who pays and why switch · **15%** cost to run and dependencies · **15%** demo quality.

---

## 1. Title

- **Syncy**
- Tagline: *From "who was that?" to a next step.*
- Team Syncy · BCBT AI Entrepreneurship Hackathon · CIC Berlin · 23–26 Oct 2026
- Visual: `01-today.png`

## 2. Problem

- Opening question: *"Who here has opened LinkedIn after an event and had no idea who someone was?"*
- A Berlin freelancer goes to ~2 networking events a month and meets 5–10 people at each ⚠️
- The next day they spend ~1 h ⚠️ trying to remember who was who and what was discussed, and most follow-ups are dropped ⚠️
- Why: the LinkedIn connection stores the name and job title, but not the conversation or why it mattered
- Add **1 real quote** from our interviews here

## 3. User

- **Freelance consultants and developers** who go to Berlin startup and networking events to find clients
- Today they use: LinkedIn connect + phone notes app + memory
- CRMs (HubSpot etc.) are too heavy for one person and don't capture the conversation
- Evidence: `N` conversations held, `quote`, `hours lost` ⚠️ (fill from PM_PLAN §4)

## 4. Product: how it works

Three steps, one screen each:

1. **Scan** their LinkedIn or Xing QR code (we store the link only, no scraping)
2. **Record** a 20-second voice note right after the chat
3. **Get** a contact card in your Notion: what you discussed, which of your projects it matters for, next step + date, a draft follow-up

- Visuals: `02-scan.png` → `03-record.png` → `05-review.png` → `06-saved-to-notion.png`

## 5. What the AI does

- **Summarises** the voice note: who they are, what was discussed, what they need
- **Reads** your own project list in Notion and **sorts** the contact to the project it fits, with a one-line reason quoting the conversation
- **Drafts** the follow-up message (you review it; nothing is sent automatically)
- Key line: *"Without the AI it's just another contact list."*
- Visual: `04-ai-processing.png` + `05-review.png`

## 6. Demo

- Live walkthrough: scan Lena → voice note → AI result → saved to Notion
- Backup: 2-minute screen recording (made on Day 3)

## 7. Business model: who pays and why switch

- **Who pays:** the freelancer, **€9 / month** ⚠️ (later: €19 / seat for sales and business-development teams)
- **Today:** LinkedIn + notes app + memory: free, but contacts and context get lost
- **Why switch:** one contact turned into a client pays for years of Syncy; saves ~1 h ⚠️ of sorting after each event
- Optional: a one-sentence market-size estimate (number of freelancers in Berlin / Germany) — only if we can source it

## 8. Cost to run and dependencies

| Item | Assumption | € / month |
|---|---|---|
| AI model (transcription + 2 short calls) | ~€0.01 per contact | < €5 at hackathon scale |
| Hosting | free tier | €0 |
| Notion API | free | €0 |
| **Total** | | **< €5 / month** (update from PM_PLAN §7 cost log) |

Dependencies and risks:
- **AI model provider:** prices and API keys; we could switch to an open model (Ollama) if needed
- **Notion API:** a single integration; Google Drive comes later
- **LinkedIn / Xing:** we only read the URL inside the QR code, no scraping, so changes to their terms don't break us
- **Personal data:** notes about other people are stored in the user's own Notion, not on our servers; the demo uses invented people only

## 9. What's next (the "Later" list)

- Google Drive / Sheets as an alternative to Notion
- Photo of a badge or business card instead of a QR code
- Reminders when a follow-up is due
- Team version for sales and business-development teams

## 10. Tools we used (required by the AI policy)

| Tool | Used for |
|---|---|
| Claude Code (Claude Opus) | Drafting the pitch documents, building the clickable prototype |
| `add: AI model for the product` | Transcription, summary, project match, follow-up draft |
| `add: hosting / database` | |
| `add: Gamma, if used` | Slide drafts |

## 11. Team

- Team Syncy: names and roles (from PM_PLAN §2)

---

### Screenshot list (`docs/screenshots/`)

| File | Shows |
|---|---|
| `01-today.png` | Home: the event, stats, the Scan button, people met today |
| `02-scan.png` | QR scanner with a LinkedIn profile detected |
| `03-record.png` | Voice note being recorded, transcript appearing live |
| `04-ai-processing.png` | AI steps: transcribe → summarise → read projects → match → draft |
| `05-review.png` | Result: matched project with reason, summary, next step, follow-up draft |
| `06-saved-to-notion.png` | Saved: the row in the Notion contacts table |
| `07-projects.png` | The user's own projects the AI matches against |

The screenshots come from the clickable prototype (demo data, AI output simulated). The live demo on Day 4 must use real AI calls.
