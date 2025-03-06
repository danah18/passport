# Setup

## Supabase

### Run Locally

- Install [supabase cli](https://supabase.com/docs/guides/local-development/cli/getting-started?queryGroups=platform&platform=macos) and docker.
- Follow [local dev flow](https://supabase.com/docs/guides/local-development)
- In `client` folder, run `npx supabase init` `npx supabase start` with docker open.
- Then run `npx supabase db reset`
  
## Env variables

Copy `.env.example` and rename to `.env.local` with populated values. For supabase values, these are outputted from `npx supabase start`.

## Edge functions
To deploy new functions to prod as well as edits to prod: `supabase functions deploy` 

To serve the functions locally with env files populating: `supabase functions serve --debug  --env-file ../.env.local`