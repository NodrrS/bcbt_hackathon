# Syncy — data model and sync (Phase 1 / Phase 2)

> Decided 23 Oct: **Phase 1** stores everything in **Supabase** (events, projects, contacts). **Phase 2** adds Notion / notes-app sync.
> Schema: [supabase/migrations/0001_phase1_schema.sql](../supabase/migrations/0001_phase1_schema.sql) · Frontend mirror: [prototype/data.js](../prototype/data.js) (same tables, same column names).

## 1. Phase 1 flow

```
Today: choose event (edit its details if needed) ─or─ create event ──▶ [Enter event]
   │
   ▼
Scan QR ──▶ row INSERTED at once (status = captured): profile_url, profile_slug, name-from-slug, event_id
   │
   ▼
Note: ✍️ type it  ─or─  🎙️ voice memo (audio sent for transcription only → note_text; never stored)   [Skip = note later]
   │
   ▼
Processing (status = processing): LLM summarises note_text, compares with the user's projects table,
                                  suggests project_id + match_reason, drafts follow-up
   │
   ▼
Review (status = review): user edits any field, assigns / changes the project ──▶ [Save] (status = saved)
   │
   ▼
Dashboard: filter, sort, edit everything later (stage, project, next step, notes …)
```

| Step | What's written to `contacts` |
|---|---|
| Scan | `source`, `profile_url`, `profile_slug`, `name`, `event_id`, `scanned_at`, `status='captured'` |
| Project pick (optional, right after scan) | `project_id`, `project_set_by='user'`, `match_reason`; processing then keeps this project instead of the AI's suggestion |
| Note | `note_kind`, `note_text` (typed note now; voice transcript lands during processing — **audio itself is never stored**) |
| Processing | `status='processing'` → AI fields: `summary`, `discussed[≤3]`, `needs`, `project_id`, `match_reason`, `match_confidence`, `project_set_by='ai'`, `next_step`, `next_step_date`, `follow_up_draft`, then `status='review'` |
| Review / Save | any edited field; changing the project sets `project_set_by='user'`; `status='saved'` |
| Dashboard | `stage`, `user_notes` and any field above |

## 2. Tables

### `events`
| Column | Type | Notes |
|---|---|---|
| id | uuid | |
| user_id | uuid | `auth.uid()`; RLS |
| name | text | "BCBT AI Hackathon" |
| location | text | "CIC Berlin" |
| url | text | Event page link, optional; must start with `http(s)://` |
| starts_on | date | default today |
| created_at, updated_at | timestamptz | |

### `projects`
| Column | Type | Notes |
|---|---|---|
| id, user_id | uuid | |
| name | text | "Client work: React dashboards" |
| description | text | **What the AI matches against** — one or two sentences of goals |
| emoji | text | |
| archived | bool | hidden from matching |
| external_source, external_id, external_updated_at | | **Phase 2** sync keys (Notion page id …) |

### `contacts`
| Group | Columns |
|---|---|
| Keys | id, user_id, event_id → events, project_id → projects |
| Scan | source (`qr_linkedin` · `qr_xing` · `qr_other` · `manual`), profile_url, profile_slug, name, role, company, scanned_at |
| Note | note_kind (`text` · `voice`), note_text — no audio column: voice is transcribed, never stored |
| AI output | summary, discussed text[≤3], needs, match_reason, match_confidence (`high` · `medium` · `low`), project_set_by (`ai` · `user`), next_step, next_step_date, follow_up_draft |
| Management | status (`captured` · `processing` · `review` · `saved` · `error`), stage (`to_follow_up` · `followed_up` · `meeting_set` · `won` · `not_relevant`), user_notes |
| Phase 2 | external_id, external_synced_at |
| Time | created_at, updated_at (trigger) |

Two different "states", on purpose:
- **status** = where the row is in the capture pipeline (the phone app cares).
- **stage** = where the relationship is (the dashboard cares).

Rules in the schema: one row per person per event (`unique (user_id, event_id, profile_url)`), `discussed` max 3 items, RLS so every user only sees their own rows. **No audio storage** (decided 24 Oct): a voice memo goes straight to the processing endpoint, is transcribed, and is discarded — only the transcript persists, in `note_text`.

## 3. Frontend mirror

`prototype/data.js` holds the same three tables as arrays of plain objects with **identical snake_case column names**, persisted in `localStorage` for the prototype. Both the phone app and the dashboard read and write through it, so a contact saved on the phone shows up in the dashboard.

| Prototype call | Real build (supabase-js) |
|---|---|
| `db.list('contacts')` | `supabase.from('contacts').select('*')` |
| `db.insert('contacts', row)` | `supabase.from('contacts').insert(row).select().single()` |
| `db.update('contacts', id, patch)` | `supabase.from('contacts').update(patch).eq('id', id)` |
| `db.list('projects')` | `supabase.from('projects').select('*').eq('archived', false)` |

So swapping the prototype for the real backend means replacing four functions, not rewriting screens.

## 4. Dashboard ↔ schema

| Dashboard column / control | Column(s) |
|---|---|
| Person | name, role, company, source, profile_url |
| Summary | summary (drawer: + discussed, needs, note_text) |
| Project (filter, editable) | project_id → projects.name, match_reason, project_set_by |
| Next step (sort, editable) | next_step, next_step_date |
| Stage (filter, editable) | stage |
| Met at (filter, sort) | event_id → events.name, events.starts_on, events.url (link) |
| Pipeline badge ("Needs a note") | status |
| Your notes | user_notes |

## 5. Sync with Notion and other notes apps — Phase 2

**Yes, it's possible.** Supabase stays the source of truth; external apps are connected in two directions.

### 5.1 Projects in (knowledge base → Supabase)
1. User connects Notion with OAuth (Notion public integration) and picks the page or database that holds their projects.
2. A Supabase **Edge Function** reads it with the Notion API and **upserts** into `projects` on `(user_id, external_source='notion', external_id=<page id>)`, storing Notion's `last_edited_time` in `external_updated_at`.
3. Keep it fresh: Notion's integration webhooks (page changed → call our Edge Function) where available, otherwise **polling** every 10–15 min with `pg_cron`, fetching only pages edited since the last sync. Plus a manual "Refresh" button.
4. Pages deleted in Notion → `archived = true` (contacts keep their link).

### 5.2 Contacts out (Supabase → Notion)
1. A **database webhook** on `contacts` (insert / update where `status = 'saved'`) calls an Edge Function.
2. It creates the Notion page the first time (`pages.create`, stores the id in `external_id`) and updates it afterwards (`pages.update`), then sets `external_synced_at`.
3. Notion allows ~3 requests/second per integration, so writes go through a small queue table (or Supabase Queues) with retries.

### 5.3 Conflicts
- Fields Syncy creates (summary, match, draft) → **Supabase wins**.
- If two-way editing is wanted for a few fields (stage, user notes, next step date): **last write wins**, comparing `updated_at` with Notion's `last_edited_time`.

### 5.4 Other notes apps
| App | How | Effort |
|---|---|---|
| Notion | Official API + OAuth (above) | Medium, best first target |
| Google Docs / Drive | Drive + Docs API, OAuth; read a "Projects" doc, export contacts to a Sheet | Medium |
| Obsidian | Markdown files in the vault; community sync plugin or a folder export | Medium |
| Evernote | Official API | Medium |
| Apple Notes | **No public API**; only on-device via Shortcuts. Realistic option: share/export, not live sync | High / limited |

Design rule for Phase 2: one connector interface per app — `pullProjects()` and `pushContact()` — so adding an app does not touch the screens or the schema.

## 6. One schema, three layers

Same tables, same snake_case column names at every layer (`data.js` mirrors the migration), so each row below means the same thing everywhere. This is the alignment table for the frontend ↔ backend handoff.

| Data | Frontend — phone app + dashboard (Nodir, Bhuvanesh) | Backend — Supabase + endpoint (Utkarsh) | Other — storage · external · ops |
|---|---|---|---|
| **Events** | Event picker creates / edits / selects via supabase-js | `events` table; RLS per `user_id` | — |
| **Projects** | Projects tab lists + adds (name, description, emoji) | `projects` table; the AI matches on `description`; `archived=true` hides from matching | Phase 2: pulled from Notion via `external_source` / `external_id` / `external_updated_at` (§5.1); no-API apps via import/export (§5.4) |
| **Contact capture** | Scan screen: QR → `parseProfile()` → insert with `status='captured'` (`source`, `profile_url`, `profile_slug`, `name`, `event_id`, `scanned_at`) | `unique (user_id, event_id, profile_url)` dedupes re-scans; RLS | QR carries only the public LinkedIn/Xing profile URL — **no scraping** (PM_PLAN §9) |
| **Note** | Typed note → `note_text`; voice memo (MediaRecorder) stays **in memory** and is sent with the processing request | `note_kind`, `note_text` on `contacts`; voice `note_text` is filled by transcription | **Audio is never stored** — transcribed and discarded (privacy win for the pitch); client keeps the blob until processing succeeds, for Retry |
| **Processing** | Sets `status='processing'`, calls the endpoint, polls the row every 2 s until status changes | `POST /api/contacts/:id/process`: STT (voice) → LLM call 1 (extract) → read `projects` → LLM call 2 (match + draft) → writes AI fields, `status='review'` or `'error'` | AI + STT keys live **server-side only**; ~€0.01 per contact; prompts in `/prompts` |
| **Review / Save** | Review screen edits any field; changing project sets `project_set_by='user'`; Save → `status='saved'` | Plain supabase-js update; endpoint respects `project_set_by='user'` on re-runs | Phase 2: `status='saved'` triggers push to Notion (`external_id`, `external_synced_at`, §5.2) |
| **Dashboard** | Filter / sort / edit everything incl. `stage`, `user_notes` | Same `contacts` table — no extra backend | `status` = capture pipeline (phone cares) · `stage` = relationship (dashboard cares) |
