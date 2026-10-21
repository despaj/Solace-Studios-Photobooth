# Solace Studios Photo Booth Website

Static HTML/CSS pages deployed on Vercel, with a Vercel serverless booking API and Supabase database.

## Structure

- `public/index.html` — homepage
- `public/pages/` — booking, FAQ, photobooth, privacy policy, results, and confirmation pages
- `public/assets/css/` — stylesheets
- `public/assets/images/` — SVG/JPG images
- `api/bookings.js` — server-side booking endpoint
- `supabase-bookings.sql` — database table setup

## Setup

1. Create a Supabase project.
2. In Supabase SQL Editor, run `supabase-bookings.sql`.
3. Deploy this repository to Vercel with the project root set to the repository root.
4. In Vercel → Project → Settings → Environment Variables, add:
   - `SUPABASE_URL` — your Supabase project URL
   - `SUPABASE_SERVICE_ROLE_KEY` — the service-role key from Supabase API settings
5. Redeploy after adding the environment variables.
6. Test a future booking from `/pages/book.html`, then confirm a row appears in Supabase `public.bookings`.

**Security:** Never put the Supabase service-role key in any HTML or frontend JavaScript, and never commit `.env` files. The API currently accepts booking requests and stores them as `pending`; it does not send email or prevent overlapping bookings.

## Run locally

Install Node.js and the Vercel CLI, then run:

```bash
npm install
npx vercel dev
```

Open the local URL printed by Vercel CLI. Set the two environment variables in a local `.env.local` file (do not commit it).
