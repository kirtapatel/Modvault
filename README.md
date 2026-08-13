# ModVault

Production-ready, fully responsive **game mod distribution platform** built with Next.js (App Router), TypeScript, Tailwind CSS, MongoDB Atlas, NextAuth.js, and Cloudflare R2.

## Features

- **Homepage** — dark hero with search bar, tag quick-filters, Trending carousel, Latest Uploads, ad banner zones
- **Game categories** — `/games/[gameSlug]` with sub-category filtering sidebar + sort (Newest / Most Popular / Highest Rated)
- **Mod detail** — `/mod/[modSlug]` with markdown description, creator bio with ko-fi/Patreon tips, MediaFire hosting badge, ratings, tags, and comments
- **Interstitial download** — `/download/[modId]` with 5-second countdown, ad slot, Free (2 MB/s) vs VIP (uncapped, $4.99/mo) buttons and premium modal
- **Multi-step upload** — `/upload` with title/game/category/tags → markdown description → drag & drop upload directly to Cloudflare R2 presigned URLs + thumbnail
- **Creator dashboard** — `/dashboard` with account settings, favorites grid, uploaded mods manager (edit/delete), VIP badge
- **Auth** — NextAuth.js credentials sign-in/register with MongoDB-backed users and bcrypt password hashing
- **Monetization UI** — reusable `<AdBanner />` slots + VIP/premium upgrade modal (`$4.99/mo`)

## Tech Stack

| Concern       | Choice                                            |
| ------------- | ------------------------------------------------- |
| Framework     | Next.js 16 (App Router, TypeScript)               |
| Styling       | Tailwind CSS v4 + Lucide icons                    |
| Database      | MongoDB Atlas (Mongoose ODM)                      |
| Auth          | NextAuth.js (Auth.js v5)                          |
| File storage  | Cloudflare R2 (S3 API compatible)                 |
| Deployment    | Vercel (Free Tier)                                |

## Local Setup (step by step)

### 1. Prerequisites

- **Node.js** (LTS 20+): https://nodejs.org — click the green LTS button, install, keep defaults.
- **VS Code**: https://code.visualstudio.com — install, keep defaults.
- **Git**: https://git-scm.com — install, keep defaults.

Open a terminal in this folder (`modvault`) and run:

```bash
npm install
```

### 2. MongoDB Atlas (free)

1. Go to https://www.mongodb.com/cloud/atlas/register → click **Start Free**
2. Create a database user (username + password — **save these**) in *Database Access*
3. Add your IP in *Network Access* → "Add IP Address" → **Allow access from anywhere** → Submit
4. In *Database Deployments* → your cluster → **Connect** → **Drivers** → copy the connection string
5. Paste it into `.env.local` as `MONGODB_URI`, replacing `<password>` with your user's password.

### 3. Cloudflare R2 (free tier storage)

1. Create a Cloudflare account: https://dash.cloudflare.com/sign-up
2. Left menu → **R2** → enable R2 (may need to add a payment method — free tier has no charges)
3. **Create bucket** (name it e.g. `modvault-files`) → optionally enable *Public access*
4. **Manage R2 API Tokens** → Create API token → **Object Read & Write** → select your bucket
5. Copy the `Access Key ID` and `Secret Access Key`; fill in the `Account ID`, bucket name and (if public) the public URL in `.env.local`.

### 4. Run locally

```bash
npm run dev
```

Open http://localhost:3000

**Demo mode:** if `MONGODB_URI` is empty, the site runs on built-in demo mods so you can preview every page immediately. Sign up/upload require a configured database.

## Production Build

```bash
npm run build
npm start
```

## Deployment to Vercel (free)

1. Push this folder to a GitHub repo (or use Vercel CLI: `npm i -g vercel && vercel`)
2. Import the repo at https://vercel.com/new
3. In **Environment Variables** add every key from `.env.local`
4. Deploy. MongoDB Atlas + Cloudflare R2 work fine from Vercel's free tier.

## Environment Variables

| Variable                 | Required | Purpose                          |
| ------------------------ | -------- | -------------------------------- |
| `MONGODB_URI`            | Yes      | MongoDB Atlas connection string  |
| `AUTH_SECRET`            | Yes      | NextAuth session signing secret  |
| `CLOUDFLARE_ACCOUNT_ID`  | Yes*     | R2 endpoint                     |
| `R2_ACCESS_KEY_ID`       | Yes*     | R2 credentials                  |
| `R2_SECRET_ACCESS_KEY`   | Yes*     | R2 credentials                  |
| `R2_BUCKET`              | Yes*     | R2 bucket name                  |
| `R2_PUBLIC_URL`          | No       | Public bucket URL (for file URLs) |

\* required for mod file uploads; optional while previewing demo mode.