# Google Analytics Clone

A Next.js analytics dashboard inspired by Google Analytics, built for tracking website visits, page analytics, live user activity, and website-level reporting. The project uses Clerk for authentication, Neon/Postgres via Drizzle ORM for persistence, and a lightweight client-side tracking script to collect page-view and live-user telemetry.

## Project Overview

This application lets authenticated users:

- Create and manage tracked websites
- Generate a tracking snippet for each website
- View analytics such as traffic sources, countries, regions, and device/browser metrics
- Monitor live active users on a website
- Adjust website settings like timezone and localhost tracking preferences

## Highlights

- Google Analytics-style dashboard experience
- Clerk-based authenticated web app
- Postgres-backed analytics storage through Drizzle ORM
- Browser-side tracking script for real website telemetry
- Live visitor heartbeat monitoring for active user counts

## Quick Start

```bash
npm install
cp .env.example .env.local
npm run dev
```

Then open:

```text
http://localhost:3000
```

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Drizzle ORM
- Neon/Postgres database
- Clerk authentication
- Recharts for analytics visuals
- UAParser.js for device/browser/os parsing

## Core Features

- Authentication-protected dashboard
- Website creation and management
- Tracking script in `public/analytics.js`
- Page view analytics ingestion through `/api/track`
- Live user heartbeat ingestion through `/api/live-user`
- Dashboard widgets for country, source, device, page view, and live visitor analytics

## Project Structure

```text
app/
  api/
    live-user/route.tsx
    track/route.tsx
    user/route.tsx
    website/route.tsx
  (auth)/
  (routes)/dashboard/
configs/
  db.tsx
  schema.ts
public/
  analytics.js
```

## Prerequisites

Before running the project locally, make sure you have:

- Node.js 18+ recommended
- npm or pnpm
- A Neon/Postgres database instance
- A Clerk project with authentication enabled

## Environment Variables

Create a `.env.local` file in the project root and add the following keys.

Required variables:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_NEON_DB_CONNECTION_STRING=your_neon_postgres_connection_string
```

Recommended Clerk route variables:

```env
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

Notes:

- `NEXT_PUBLIC_NEON_DB_CONNECTION_STRING` is used by both the runtime database connection and Drizzle configuration.
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` is required for the Clerk provider in the app.
- `CLERK_SECRET_KEY` is required for server-side authentication protection and user resolution.
- If you use different Clerk route settings in your own project, update the values to match your implementation.

## Installation

1. Install dependencies:

```bash
npm install
```

2. Create your `.env.local` file using the values above.

3. Start the development server:

```bash
npm run dev
```

4. Open the app in your browser:

```text
http://localhost:3000
```

## Database Setup

This project uses Drizzle with a Postgres database.

The schema is defined in `configs/schema.ts` and includes:

- `users`
- `websites`
- `pageViews`
- `liveUsers`

To sync your database schema, run:

```bash
npx drizzle-kit push
```

If you are using a different Neon/Postgres setup, ensure your connection string points to the correct database and that the tables exist before using the dashboard.

## Authentication

Authentication is handled by Clerk.

The app protects most routes through `middleware.tsx`, leaving these public by default:

- `/`
- `/sign-in`
- `/sign-up`
- `/analytics.js`
- `/api/track`
- `/api/live-user`

All other application routes require a signed-in Clerk session.

## Tracking Script

The tracking script is served from `public/analytics.js` and is meant to be embedded into the websites you want to monitor.

Example usage:

```html
<script
  defer
  data-website-id="YOUR_WEBSITE_ID"
  data-domain="https://your-domain.com"
  src="https://your-app-domain.com/analytics.js"
></script>
```

The script will:

- generate or recover a visitor ID
- send a page-entry event to `/api/track`
- send a pagehide exit beacon to `/api/track`
- send a heartbeat ping to `/api/live-user` every 30 seconds

## API Reference

### `POST /api/track`

Used by the analytics script to collect page view events.

Accepted request body on entry event:

```json
{
  "type": "entry",
  "pageViewId": "uuid-or-generated-id",
  "websiteId": "website-id",
  "domain": "https://example.com",
  "entryTime": 1717600000,
  "visitorId": "visitor-id",
  "referrer": "https://google.com",
  "url": "https://example.com/page",
  "urlParams": "utm_source=google",
  "utmSource": "google",
  "utmMedium": "cpc",
  "utmCampaign": "summer-sale",
  "RefParams": "utm_source=google"
}
```

Accepted request body on exit event:

```json
{
  "type": "exit",
  "pageViewId": "uuid-or-generated-id",
  "websiteId": "website-id",
  "domain": "https://example.com",
  "exitTime": 1717600000,
  "totalActiveTime": 120,
  "visitorId": "visitor-id",
  "exitUrl": "https://example.com/page"
}
```

Responses:

- `200` on successful track insert/update
- `400` on invalid request body or invalid event type
- `500` on server failure

### `OPTIONS /api/track`

Supports CORS preflight for browser-based tracking requests.

### `POST /api/live-user`

Receives live visitor heartbeats from the analytics script.

Expected body:

```json
{
  "websiteId": "website-id",
  "visitorId": "visitor-id",
  "last_seen": "1717600000000",
  "url": "https://example.com/page"
}
```

The route uses a conflict update on `(visitorId, websiteId)` so the latest heartbeat refreshes the active user record.

### `GET /api/live-user?websiteId=...`

Returns active live users for a website using the `last_seen` timestamp window.

### `POST /api/user`

Creates or fetches a user record in the database using the authenticated Clerk user.

### `POST /api/website`

Creates a new website record with:

- `websiteId`
- `domain`
- `timezone`
- `enableLocalhostTracking`
- `userEmail`

### `GET /api/website`

Gets website data for the authenticated user.

Useful query parameters:

- `websiteOnly=true` → return websites only
- `websiteId=...` → return a specific website
- `from=...` → start date filter
- `to=...` → end date filter

## Dashboard Behavior

The dashboard uses the authenticated user’s email to scope website and analytics data. Each report is loaded from the Postgres-backed tables and grouped by metrics such as:

- referral source
- country/region/city
- browser/device/os
- page views
- active users

## Deployment Guide

### Option 1: Deploy on Vercel

1. Push the project to GitHub.
2. Import the repository into Vercel.
3. Add the same environment variables listed above in the Vercel project settings.
4. Set the production domain in your Clerk dashboard and verify the redirect URLs.
5. Make sure your Neon/Postgres connection string points to the production database.
6. Run a production build:

```bash
npm run build
```

### Option 2: Deploy on any Node-compatible host

1. Install dependencies with `npm install`.
2. Build the app:

```bash
npm run build
```

3. Start the production server:

```bash
npm run start
```

### Production Checklist

Before shipping:

- Set all required environment variables in production
- Configure Clerk domain and redirect URLs
- Ensure the tracking script is served from the production domain
- Use a production Postgres/Neon connection string
- Run the database migrations or schema push against the production database
- Replace default metadata/branding if needed

## Common Troubleshooting

### "Unauthorized" from API routes

This usually means the Clerk session is missing or the route is being hit without a valid authenticated user.

### Analytics data not appearing

Check that:

- the script is loaded on the target site
- `data-website-id` and `data-domain` attributes are correct
- the `NEXT_PUBLIC_NEON_DB_CONNECTION_STRING` is valid
- the database schema has been pushed successfully

### Clerk provider errors

Make sure both of these environment variables are set:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
CLERK_SECRET_KEY=...
```

## License

This project is intended for learning, internal use, or extension into a production analytics dashboard. Update the license and branding before public release.

