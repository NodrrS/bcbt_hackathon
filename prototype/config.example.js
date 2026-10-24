// Copy to config.js and fill in the values from Supabase Auth → Users / Project Settings → API.
// config.js is gitignored. The anon key and demo credentials are public to this demo app;
// use only fictional demo data and keep all AI/service-role keys in Edge Function secrets.
window.SYNCY_CONFIG = {
  supabaseUrl: 'https://YOUR_PROJECT_REF.supabase.co',
  supabaseAnonKey: 'YOUR_SUPABASE_ANON_KEY',
  demoEmail: 'demo@syncy.local',
  demoPassword: 'SET_A_LONG_RANDOM_DEMO_PASSWORD',
};
