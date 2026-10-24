# 185 Quick Mart website

The website for **185 Quick Mart**, the BP station and convenience store at 1341 Highway 185 (KY-185), Bowling Green, KY 42101.

It answers the four things people want in five seconds: *Are you open? Where are you? What's the gas price? What can I get there?* The owner updates fuel prices, deals, hours and a notice banner from a password-protected page at `/admin`, from a phone, with no code.

Built with Next.js 16 (App Router, TypeScript), Tailwind CSS 4, Prisma, Zod, React Hook Form and iron-session.

---

## Contents

1. [Run it on your computer](#1-run-it-on-your-computer)
2. [For the owner: updating the site](#2-for-the-owner-updating-the-site)
3. [Put it online (Vercel + Neon)](#3-put-it-online-vercel--neon)
4. [Environment variables](#4-environment-variables)
5. [Owner to-do list before launch](#5-owner-to-do-list-before-launch)
6. [Local search checklist](#6-local-search-checklist)
7. [Photo changes](#7-photo-changes)
8. [How it works (for developers)](#8-how-it-works-for-developers)
9. [Tests and checks](#9-tests-and-checks)
10. [Decisions and changes from the brief](#10-decisions-and-changes-from-the-brief)

---

## 1. Run it on your computer

Needs **Node.js 22.13 or newer** (`node -v` to check).

```bash
npm install
cp .env.example .env            # then fill it in (see below)
npm run admin:password -- "pick-a-long-password"   # paste the .env line it prints into .env
node -e "console.log(require('crypto').randomBytes(36).toString('base64url'))"  # paste as SESSION_SECRET
npm run setup                   # creates the local database (prisma/dev.db) and seeds it
npm run dev                     # http://localhost:3000
```

- Website: <http://localhost:3000>
- Owner dashboard: <http://localhost:3000/admin>
- Internal style guide (not linked, not indexed): <http://localhost:3000/styleguide>

`npm run setup` leaves the site in its honest "launch" state: no fuel prices ("Call for today's price"), no hours ("Call for hours"), and one example deal that is switched **off**.

---

## 2. For the owner: updating the site

Go to **yoursite.com/admin** on your phone and log in. Every save shows up on the website right away.

| To do this | Go to | Notes |
|---|---|---|
| **Update gas prices** | Fuel prices → type the three prices → **Save prices** | Type them like the sign: $2.79⁹⁄₁₀ is `2.799`. **Save every morning**, even if nothing changed. Prices hide themselves 48 hours after the last save and the site says "Call for today's price". That way it never shows an old price. Leave a box empty to hide that grade. |
| **Post a deal** | Deals → **+ Add a deal** | Name, price ("2 for $5"), optional note and dates. The home page shows up to 4 live deals; use the arrows to pick which. **Take down** hides a deal without deleting it. |
| **Set store hours** | Store hours | Pick Open / Closed all day / Open 24 hours for each day. Closing after midnight is fine (pick 2:00 AM). "Copy Monday to every day" saves typing. This turns on the "Open now" sign and the hours table across the site. |
| **Holiday hours** | Store hours → Add holiday hours | Overrides that one day. Shows on the Visit page and footer up to 45 days ahead. |
| **Notice banner** | Notice banner | One short line at the top of every page, like "Fresh chicken ready by 11 AM". Remove it when it's done. |
| **Kitchen closed / We're hiring** | Switches | "Hot food is available" off = the site tells people to call before coming for chicken or pizza. "We're hiring" on = a hiring box on the Visit page. |
| **Read messages** | Inbox | Messages from the contact form. Tap a phone number or email to reply. Messages are deleted automatically after 12 months. |

**Changing the password:** run `npm run admin:password -- "new password"` and put the new value in `ADMIN_PASSWORD_HASH` (in `.env` locally, or in your host's settings), then redeploy. Old logins stop working once `SESSION_SECRET` changes too.

---

## 3. Put it online (Vercel + Neon)

Any Node.js host works; nothing in the code is Vercel-only. These steps use Vercel and a free Neon Postgres database.

1. **Database.** Create a project at [neon.tech](https://neon.tech) and copy the connection string (`postgresql://…?sslmode=require`).
2. **Create the tables** from your computer, pointing at that database:
   ```bash
   DATABASE_URL="postgresql://…" npm run db:push
   DATABASE_URL="postgresql://…" npm run db:seed
   ```
   `db:push` switches `prisma/schema.prisma` to PostgreSQL automatically when the URL starts with `postgres`. Don't commit that change if you still use SQLite locally (`git checkout prisma/schema.prisma`).
3. **Vercel.** Import the repository at [vercel.com/new](https://vercel.com/new). Framework: Next.js. Build command: leave the default (`npm run build`). It runs `scripts/prisma-provider.mjs`, which picks PostgreSQL from `DATABASE_URL` for you.
4. **Environment variables** in Vercel → Settings → Environment Variables: everything in [section 4](#4-environment-variables). Paste the **plain** password hash (no backslashes) on Vercel.
5. **Domain.** Add your domain in Vercel, then set `NEXT_PUBLIC_SITE_URL` to it (e.g. `https://185quickmart.com`) and redeploy. Canonical links, the sitemap and share images all use it.
6. **Check it:** open the site on your phone, log in at `/admin`, save prices, and confirm they show on the home page. Then run [PageSpeed Insights](https://pagespeed.web.dev/) on the live URL.

SQLite does **not** work on Vercel (the disk is read-only), so production must use PostgreSQL.

---

## 4. Environment variables

| Variable | Required | What it is |
|---|---|---|
| `DATABASE_URL` | Yes | `file:./dev.db` locally; a `postgresql://` URL in production. |
| `ADMIN_PASSWORD_HASH` | Yes | bcrypt hash of the owner password. Make it with `npm run admin:password -- "…"`. In a `.env` file every `$` must be written `\$` (the script prints it that way). |
| `SESSION_SECRET` | Yes | Random string, 32+ characters. Signs the login cookie. |
| `NEXT_PUBLIC_SITE_URL` | Yes (prod) | Public address, no trailing slash. |
| `RESEND_API_KEY` | Optional | From [resend.com](https://resend.com). Without it, messages still arrive in the `/admin` inbox; they just aren't emailed. |
| `CONTACT_TO_EMAIL` | Optional | Where contact-form emails go. |
| `CONTACT_FROM_EMAIL` | Optional | Sender on a domain verified in Resend, e.g. `185 Quick Mart website <website@yourdomain.com>`. |

---

## 5. Owner to-do list before launch

Nothing below is guessed on the site; each item stays hidden or says "call" until you confirm it.

**Facts to confirm** (edit `content/store.ts` or `content/menu.ts`; each has a `TODO(owner)` comment):

- [ ] **Phone** (270) 599-1126 matches the Google Business Profile listing.
- [ ] **Lottery cashing:** confirm the store is an authorized Kentucky Lottery cashing agent for prizes from $600.01 to $5,000. The Lottery page says "We cash winning tickets up to $5,000"; change `lottery.cashLimitDollars` if that's not right.
- [ ] **Problem-gambling helpline:** the site lists 1-800-GAMBLER (1-800-426-2537), the Kentucky Council on Problem Gambling's line (kycpg.org). Re-check before launch.
- [ ] **Store hours:** set them in `/admin` (the site says "Call for hours" until you do).
- [ ] **Opening year:** if you want "Serving Bowling Green since 2023", set `servingSince: 2023`.
- [ ] **Exact location:** latitude/longitude of the front door (`coordinates`). Until then, maps use the street address.
- [ ] **Pay at the pump?** (`fuel.payAtPump`). The fuel FAQ leaves this question out until you answer it.
- [ ] **Mid-grade?** and **Non-ethanol (E0)?** (`fuel.midGrade`, `fuel.nonEthanol`). Only Regular, Premium and Diesel are listed now.
- [ ] **Chicken menu and prices** (`content/menu.ts`). Until then: "Ask at the counter for today's menu."
- [ ] **Pizza menu and prices** (`content/menu.ts`).
- [ ] **Public email** (`email`), shown on the Visit page once set.
- [ ] **Facebook / Instagram / Google Business Profile links** (`socials`), added to search data once set.

**Permissions:**

- [ ] **Logos.** BP, Hunt Brothers Pizza, Perfectly Southern and Kentucky Lottery are named in text only. If your dealer/program agreements allow their logos, add the files to `public/images/partners/` and fill in `partnerLogos` in `content/store.ts`. The slots render nothing until then.
- [ ] **Privacy notice:** confirm the 12-month message retention on `/privacy` suits you (the inbox already deletes older messages).

**Setup:**

- [ ] Change the admin password from the development one (`npm run admin:password`).
- [ ] Set up Resend email if you want messages emailed as well as in the inbox.
- [ ] Do the [local search checklist](#6-local-search-checklist).

---

## 6. Local search checklist

For "gas station near me" and "lottery Bowling Green", consistency matters more than anything else on the website.

1. **Rename the Google listing.** Google Maps currently shows the store at 1341 KY-185 as just **"bp"**. In the Google Business Profile, change the business name to **185 Quick Mart** (BP stays as the fuel brand).
2. **Claim and update the Google Business Profile** ([business.google.com](https://business.google.com)): name **185 Quick Mart**, address **1341 KY-185, Bowling Green, KY 42101**, phone **(270) 599-1126**, the same hours as the website, category *Gas station* plus *Convenience store*, and the website URL. Add the store photos.
3. **Claim Apple Business Connect** ([businessconnect.apple.com](https://businessconnect.apple.com)) with exactly the same name, address, phone and hours (this is what iPhone Maps shows).
4. Fix any directory listing that says "HWY 185 Quick Mart" or has a different phone number, so every listing matches. The website already tells search engines that "HWY 185 Quick Mart" is the same store.
5. When hours change, update **all three** (website, Google, Apple) the same day.

The site already includes: unique page titles and descriptions, `GasStation` + `ConvenienceStore` structured data (address, phone, BP brand, ATM/air/lottery amenities, and hours once set), a sitemap, robots rules, canonical links, and a share image for links posted on Facebook and in texts.

---

## 7. Photo changes

Only the store's own photos are used. No stock photos, AI images or food illustrations. Every photo was checked at full size, and these were **cropped** (by `scripts/crop-photos.py`) because they showed something that shouldn't be on the site:

| Photo | Problem found | Fix |
|---|---|---|
| Storefront at dusk (home hero) and daytime | A **cigarette price promotion** sign ("Right on the Money", Montego, $4.69) by the door | Cropped above the sign |
| Side of the store (pizza and chicken signs) | Window poster advertising tobacco cans | Cropped to the right-hand windows, signs and ice chest |
| Coffee bar | Sign reads "COFFEE EST. 2014" (store opened 2023); Hunt Brothers poster with garbled text | Cropped to the machines |
| Slushie machines | Wall sign reads "185 QUICK STOP" (wrong name) | Cropped below the machine tops |
| Ice cream freezer | Tobacco/dip shelf beside the freezer | Cropped to the freezer |
| Wide chips aisle | Background signs read "185 QUICK STOP" | Lower part only |
| Auto care | Garbled background signs | Lower shelves only |
| Wide interior | Cigarette back bar behind the counter; garbled lottery banner | Cropped to the "Quick · Clean · Kind" wall and menu boards |
| ATM | Garbled on-screen text | Cropped to the card reader and keypad |

**Not used:** the BP price sign photo (shows old prices, so it could contradict the live board), the marketing collage (misspelled brand name), and two alternate shots. All originals are kept in `assets/photo-originals/` (outside `public/`, so they're never served). See that folder's README.

Remaining small details to be aware of: small price stickers on the front doors are visible in the storefront photos (the products aren't identifiable). The lottery machine's screen ad is legible and correct.

---

## 8. How it works (for developers)

```
app/
  (site)/            public pages: home, fuel, food, store, lottery, visit, privacy, styleguide
  admin/             login, dashboard, server actions (every action calls requireAdmin())
  api/contact/       contact form endpoint (Zod, honeypot, same-origin check, rate limit, Resend)
  opengraph-image.tsx, twitter-image.tsx, icon.tsx, apple-icon.tsx, sitemap.ts, robots.ts
components/          brand (route badge, wordmark, shelf edge), fuel board, hours, aisles, layout, forms, admin
content/             store facts (single source of truth), photos, aisles, menu
lib/                 hours logic, fuel rules, time zones, validation, auth, rate limiting, SEO, data access
prisma/              schema + seed
scripts/             photo crops, display font build, password hash, DB provider switch
e2e/                 Playwright smoke tests and accessibility (axe) checks
```

**Key behaviors**

- **Central Time everywhere.** All open/closed logic uses `America/Chicago` via `Intl` (`lib/time.ts`, `lib/hours.ts`). Supports normal hours, after-midnight closing, 24 hours, closed days, and holiday overrides. If a day isn't set, the site doesn't guess.
- **No stale fuel prices, ever.** A price older than 48 hours is (1) never rendered by the server, (2) hidden before first paint by a tiny inline script if a cached page has aged, and (3) re-checked every minute in the browser (`components/fuel/`).
- **Fast, static pages.** Public pages are pre-rendered and refreshed at most every 10 minutes, and immediately after any admin save (`revalidatePath`). Only the menu toggle, open-now pill, hours highlight, fuel freshness check, notice dismiss, map loader and forms run JavaScript in the browser. The Google map starts loading on its own after the rest of the page has finished, so Google's scripts never slow the first paint.
- **Fails safe.** If the database is unreachable, public pages still render with "Call for price" / "Call for hours" instead of an error.
- **Admin security.** Single owner password (bcrypt), httpOnly + sameSite=lax session cookie (secure in production, 12-hour life), login rate limit (5 tries / 15 min per IP), every server action re-checks the session, `/admin` is `noindex` and disallowed in robots.txt. Server Actions include Next.js's built-in CSRF (origin) protection.
- **Contact form.** Validated in the browser and again on the server, honeypot field, 5 messages/hour per IP (IP addresses are hashed, never stored), saved to the inbox, then emailed if Resend is set up.

**Colors and the theme file**

Every color on the site lives in one file, [`lib/theme.ts`](lib/theme.ts). Nothing else in the codebase contains a color value. Components use semantic names, never raw colors:

| Token | Value | Used for |
|---|---|---|
| `bg`, `surface` | white | Page background, cards |
| `surface-alt` | mist `#F2F7F3` | Every other section |
| `ink`, `muted` | `#14201A`, `#4F5D54` | Main and secondary text |
| `line` | sage `#D5E3D9` | Borders and dividers |
| `primary`, `primary-hover`, `on-primary` | pine `#14532D`, `#0E3B20`, white | Buttons, active nav, links |
| `accent`, `accent-soft` | fern `#1F7A45`, tint `#E3F0E7` | Eyebrow labels, tagline, chips |
| `deep`, `deep-2`, `on-deep`, `on-deep-muted` | dark pines, white, `#A7C4B0` | Footer, fuel board, lottery panel, notice strip |
| `led` | `#4ADE80` | Fuel price digits only |
| `brand-red` | `#B4232C` | Logo wordmark only |
| `danger` | `#9F1D24` | Form errors only |

The values reach the page as CSS variables on `<html>`, which Tailwind exposes as classes (`bg-surface-alt`, `text-muted`, `border-line` ...). The share image, icons and browser `theme-color` read the same file. To change the site's colors, edit the values there and rebuild.

**Red in the logo:** `USE_BRAND_RED_IN_LOGO` in `lib/theme.ts`. `true` (the default) keeps the real sign red in the header wordmark and share image; red appears nowhere else. `false` makes the wordmark pine green. The footer wordmark is always white, because red or pine on the dark pine footer would be too low-contrast.

The hidden style guide at `/styleguide` shows every token as a swatch with its contrast ratios, a WCAG AA check of every text/background pair, both logo options, and the components on light and dark sections.

**Scripts**

| Command | What it does |
|---|---|
| `npm run dev` | Development server |
| `npm run build` / `npm start` | Production build / server |
| `npm run setup` | Create local DB tables + seed |
| `npm run db:push` / `npm run db:seed` | Sync schema / seed (any database) |
| `npm run admin:password -- "…"` | Make an `ADMIN_PASSWORD_HASH` |
| `npm test` | Unit tests (Vitest) |
| `npm run test:e2e` | Smoke and accessibility tests (Playwright + axe) against a production build |
| `npm run lint` / `npm run typecheck` / `npm run format` | ESLint / TypeScript / Prettier |
| `npm run photos:crop` | Re-create the cropped photos from `assets/photo-originals/` |
| `python scripts/build-display-font.py` | Rebuild the display font file (needs `pip install fonttools brotli`) |

---

## 9. Tests and checks

- `npm test`: 49 unit tests. Hours logic (time zones, normal / after-midnight / 24-hour / closed days / holiday overrides / unknown days), the 48-hour fuel rule and price display, contact and admin validation, the admin auth guard and password check, and the JSON-LD shape.
- `npm run build && npx playwright install chromium && npm run test:e2e`: smoke tests on phone and desktop. Home loads, call links dial the store, the Call/Directions/Gas Prices bar works on phones, every page responds, admin requires login, and the contact form shows friendly errors and sends. (Run repeatedly within an hour, the contact and login tests see the rate-limit message instead, which they accept.)
- The same command runs `e2e/a11y.spec.ts`: an axe scan for WCAG 2.2 A/AA problems, including color contrast, on every public page and the admin login, on phone and desktop. All pass. (The Google map iframe is Google's content and is excluded.)

**Lighthouse (local, mobile, after the white & green retheme):** Accessibility **100**, Best Practices **100** and SEO **100** on every page, and layout shift near zero. Performance: Fuel, Store and Lottery **96**; Home, Food and Visit between **90 and 94** across runs (Home's largest paint is the hero photo, which shares the simulated slow-4G bandwidth with the framework's JavaScript). So the 95 target is met on half the pages and close on the rest. Run PageSpeed Insights on the deployed site for the real-world figure. The hero image is preloaded, the display font is a 7 KB subset, and the Google map waits until the page has finished loading.

---

## 10. Decisions and changes from the brief

- **White & green retheme** (October 2026, three commits on top of the original charcoal & red build): semantic tokens first with no visual change, then the new palette, then polish. Pine rather than bright green, and no yellow, so the site doesn't read as a BP corporate page.
- **Contrast details (WCAG AA):** every text pair passes (see `/styleguide`). Two deliberate exceptions to the retheme brief: form fields use the `muted` border (6.9:1) instead of `line`, because `line` is only 1.3:1 on white and an input outline needs 3:1 (WCAG 1.4.11); and the footer wordmark is white, not red or pine. On dark sections the focus ring is white instead of pine so it stays visible.
- **Display font:** Archivo ExtraBold at 118% width, served as a 7 KB self-hosted subset (`app/fonts/archivo-display.woff2`, built from Google Fonts by `scripts/build-display-font.py`) instead of the 88 KB variable font. Overpass and Overpass Mono load through `next/font/google`.
- **Hero size:** the headline tops out at 64px, so at 1920×1080 it runs three lines and the fuel board starts above the fold.
- **Prisma 6** (stable, single schema with built-in engines) rather than Prisma 7, which needs separate native database drivers. **bcryptjs** (same bcrypt algorithm, no native build) rather than `bcrypt`.
- **Rate limits are stored in the database**, so they work on serverless hosts where memory resets between requests.
- **Map shows on its own** (a Google Maps embed) instead of the brief's tap-to-load placeholder, at the owner's request. It starts loading after the rest of the page has finished, so it doesn't slow the first paint.
- **Apple Maps** link is shown to everyone on the Visit page (it works on all devices), next to Google Maps directions.
- **Lottery claim rules** come from the Kentucky Lottery's own claim page: $600 or less at any retailer; up to $5,000 at a cashing agent with the claim form and ID; above that, a Super Cashing Agent (up to $25,000) or Lottery headquarters; 180-day claim deadline.
- **Original photos** that contain wrong names, garbled text, old prices or tobacco promotions were moved out of `public/` (see section 7), so they can't be reached on the live site.
- **The review pauses in the brief** (style guide, then home page) were skipped at the owner's request to build the full site in one pass. The style guide is at `/styleguide` for review.
