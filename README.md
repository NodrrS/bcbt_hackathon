# Syncy

Capture a networking contact, add a typed note or voice memo, and review AI generated insights and a project match. Phase 1 stores events, projects, contacts, and note text in Supabase. Voice audio is sent to the Edge Function for transcription and is not stored. Notion project import remains Phase 2.

## Run locally

The browser demo still works without credentials. For the live Phase 1 app, create a Supabase project and configure it:

1. In Supabase Auth, create a confirmed demo user with email `demo@syncy.local` and a long random password.
2. Apply `supabase/migrations/0001_phase1_schema.sql` in the SQL editor.
3. Run `supabase/seed.sql` in the SQL editor to add fictional demo projects, an event, and a contact.
4. Copy `prototype/config.example.js` to `prototype/config.js`; fill in the project URL, anon/publishable key, and demo credentials. `config.js` is gitignored. The demo account is browser accessible, so use invented data only.
5. Deploy `supabase/functions/process-note` and set its secrets:

   ```sh
   supabase login
   supabase link --project-ref YOUR_PROJECT_REF
   supabase functions deploy process-note
   supabase secrets set OPENROUTER_API_KEY=YOUR_KEY OPENROUTER_MODEL=YOUR_MODEL
   ```

   The function uses OpenRouter for Whisper transcription when recording stops, then two text calls when the user taps Process. The same OpenRouter key covers all three calls. Keep it in Supabase Function secrets, never in `config.js`.

6. Serve the `prototype` directory from `localhost` (or HTTPS):

   ```sh
   python -m http.server 5173 --directory prototype
   ```

   Open `http://localhost:5173` and `http://localhost:5173/dashboard.html`. Camera/microphone access requires localhost or HTTPS.

## Prototype mode

Without `prototype/config.js`, both pages use invented localStorage data and simulated AI. “Reset demo” resets only that local prototype. With config present, pages use Supabase Auth and database, QR camera scanning, real recording, and the Edge Function pipeline. New voice recordings are sent in memory to the Edge Function and are not uploaded to Storage.

## Security and limits

- Browser receives only Supabase's anon/publishable key and the demo login; RLS restricts rows to that signed-in demo account.
- OpenRouter, Whisper, and service-role credentials stay server-side in Supabase.
- The project is a single-user demo. Do not put real contact details in its shared demo account.
- Check provider pricing and set a spend limit before processing audio; transcription and chat both draw from the OpenRouter balance.
