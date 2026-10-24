# Build Brief: 185 Quick Mart website (Next.js + Node.js)

Paste this whole file into Claude Code at the root of an empty project folder that already contains the `public/images/` folder from this kit. Read it end to end before writing any code.

---

## 1. Your role

You are a **senior full-stack engineer and product designer** who has shipped websites for independent, owner-operated businesses in the American South. You have three hats on at once:

- **Designer.** You design from the real place outward: its signage, materials, colors, and the way its customers actually use a website (on a phone, in a truck, often in a parking lot). You hate templated, generic, "AI-looking" sites, and you know exactly what makes them look that way.
- **Engineer.** You write clean, typed, production-grade Next.js (App Router) with a small Node.js backend (Route Handlers / Server Actions + a database) that a non-technical owner can live with for years.
- **Local-business strategist.** You know that for a gas station and convenience store, the website exists to answer four questions in under five seconds: *Are you open? Where are you? What's the gas price? What can I get there?* Everything else is secondary.

Work like a careful professional: ask before inventing facts, keep the owner's real voice, and never pad the site with fake content.

---

## 2. Mission

Build a fast, mobile-first, original website for **185 Quick Mart**, an independent BP-branded gas station and convenience store on Highway 185 in Bowling Green, Kentucky. The site must:

1. Feel like *this specific store*, not a template. Someone who has been inside should recognize it.
2. Make calling, getting directions, and checking fuel prices one tap away on every page.
3. Show off everything the store carries (the "one stop for everything" promise) without becoming a cluttered catalog.
4. Let the owner update fuel prices, deals, hours, and a notice banner from a simple password-protected admin page, with no code.
5. Rank well locally ("gas station near me", "lottery Bowling Green", "fried chicken Hwy 185") through clean local SEO.

This is an original site. Do not copy layout, code, or text from any existing gas station or chain website.

---

## 3. Store facts (single source of truth)

Put all of this in one typed config file, `content/store.ts`, and read from it everywhere. Never hard-code these values inside components.

| Field | Value | Status |
|---|---|---|
| Name (display) | **185 Quick Mart** | Confirmed by owner and exterior sign. Some directories list it as "HWY 185 Quick Mart"; use that only as an alternate name in schema markup. |
| Fuel brand | BP | Confirmed (canopy, price sign, GasBuddy listing) |
| Address | 1341 KY-185 (Highway 185), Bowling Green, KY 42101 | Confirmed |
| Phone | (270) 599-1126 → `tel:+12705991126` | From owner. Not yet verified in public listings. |
| Time zone | America/Chicago (Central Time) | Bowling Green is on Central Time. All open/closed logic must use this zone. |
| Opened | Around early 2023 | Early public reviews describe it as newly opened in Jan–Feb 2023. Use only as "Serving Bowling Green since 2023" if the owner confirms. |
| Hours | **UNKNOWN** | Do not invent. Store as `null`; see §8.6 for how the UI handles it. |
| Coordinates | **UNKNOWN** | Do not guess. Use an address-based Google Maps link and embed until the owner provides exact lat/long. |
| Email / socials | **UNKNOWN** | Leave fields empty and hide the UI for anything empty. |
| In-store tagline | **"Quick · Clean · Kind"** | Painted large on the interior wall above the counter. Use it as the brand line. |
| Owner's headline idea | "One stop for everything" | Use as a supporting line, not the H1. |

**What the store offers (from the owner):**
- Fuel: regular (low prices), premium, diesel
- Kentucky Lottery: tickets, scratch-offs, and **cash-out of prizes up to $5,000**
- Hot food: fried chicken and pizza
- Coffee, slushies, fountain drinks, cold drinks
- Snacks, candy, ice cream
- Medicine and health basics
- Auto items (oil, fluids, gas cans, etc.)
- Cigarettes, tobacco, and smoke items
- T-shirts
- ATM
- Air for tires
- Bagged ice (ice chest seen out front)

**Brands and programs visible in the store photos** (useful for copy; see §10 before using any logo):
- Perfectly Southern® Fresh Fried Chicken (a licensed turnkey chicken program distributed by Core-Mark / Performance Foodservice)
- Hunt Brothers® Pizza
- Coffee bar with a "Begin every day fresh" sign
- "Beverage Bay" fountain station
- Slushie machines (strawberry, watermelon, mango, sour apple flavors visible)
- Blue Bunny ice cream freezer
- Kentucky Lottery self-service ticket machine
- Express ATM (Hyosung machine)
- Deals visible in photos: 2-liter bottles 2 for $5 (treat as an *example* deal only; prices change)

**Public reputation (for tone only, never quote or fabricate reviews):** early public reviews consistently mention friendly staff who offered to cook food fresh, a very clean store, and a big drink and hot-food selection. That lines up perfectly with "Quick · Clean · Kind". Lean into it in copy.

> Rule: Anything marked UNKNOWN stays empty until the owner supplies it. Put a `// TODO(owner): …` next to it and list all TODOs in the README.

---

## 4. Research summary: how US convenience store websites work

Use this as product strategy, not as something to imitate visually.

**What the big regional chains (Sheetz, Wawa, QuikTrip, Casey's, Kwik Trip, Buc-ee's) get right:**
- Location, hours, and directions are always one tap away; the store locator is the most-used feature.
- Food is the headline, not gas. Foodservice is now the biggest profit driver in c-stores, so menus, photos of hot food, and "fresh" messaging get prime space.
- Deals change weekly and are shown as simple, scannable tags.
- They're built mobile-first because most visits come from Google Maps or a phone search, often from someone already driving.
- They use structured data so Google can show hours, phone, and fuel types directly in search.

**What most independent stations get wrong (our opportunity):**
- One-page sites with no hours, a blurry logo, and a contact form nobody answers.
- Stock photos of someone else's store, or AI images.
- Fuel prices that are months out of date (worse than no prices at all).
- No mention of lottery cashing, ATM, or air, which are exactly the things people search for.

**Our positioning:** the polish and usefulness of a chain site, with the warmth and specificity of a family-run store.

---

## 5. Design direction

### 5.1 Concept: "Built from the storefront"

Every design decision should trace back to something real about the building:

| Real thing at the store | How it shows up on the site |
|---|---|
| Charcoal standing-seam metal roof | Dark "asphalt" header, footer, and fuel board |
| Cream split-face block walls | Warm off-white page background, not pure white |
| Deep red channel-letter sign with white outline | The one loud brand color: buttons, wordmark, key links |
| The BP price pylon with glowing green digits | The fuel price board component (§5.4) |
| Black shelving with red price-strip edges | Section dividers and caption strips |
| Aisle signs ("Chilled Drinks", "Health & Wellness") | Numbered "Aisle" labels on product categories |
| "Quick · Clean · Kind" wall lettering | Brand tagline, used with the middle dot separators |
| Highway 185 itself | A small original route-marker style "185" badge in the logo lockup |

### 5.2 Color palette

Define these as CSS custom properties / Tailwind theme tokens. Do not introduce other colors.

| Token | Hex | Use |
|---|---|---|
| `asphalt` | `#1E2023` | Primary dark: header, footer, fuel board, body text |
| `asphalt-2` | `#2B2E32` | Raised surfaces on dark backgrounds |
| `sign-red` | `#B4232C` | Brand color: primary buttons, wordmark, active nav, key links |
| `ember` | `#8E1B22` | Hover/pressed state for red |
| `limestone` | `#F3EEE4` | Page background (from the block walls) |
| `bone` | `#FBF9F4` | Cards and raised light surfaces |
| `concrete` | `#D9D3C7` | Borders, dividers, input outlines |
| `slate` | `#5A5E63` | Secondary text on light backgrounds |
| `price-green` | `#2FD06A` | **Only** for fuel price digits on the dark fuel board (LED look) |
| `canopy-green` | `#0B6B3A` | Small fuel-related accents only (fuel grade dots, "Diesel available" tag) |
| `hi-vis` | `#F2C230` | **Only** for deal tags and the lottery "$5,000" badge, always on asphalt or with asphalt text |

Color rules:
- Red is the only loud color in regular UI. Green belongs to fuel. Yellow belongs to deals and lottery. Never mix all three in one component.
- Don't make the site look like a BP site. BP green is the oil company's brand; ours is the red and charcoal of the building.
- Verify every text/background pair meets WCAG AA (4.5:1 for body text, 3:1 for large text). Adjust shades slightly if needed and note the change.

### 5.3 Typography

Load with `next/font/google`, self-hosted, `display: swap`.

| Role | Font | Settings | Why |
|---|---|---|---|
| Display (H1–H2, wordmark-style headings) | **Archivo** (variable) | weight 800, width 115–125 (expanded), uppercase, tight tracking | Echoes the wide channel-letter sign on the roof |
| Body, UI, H3–H6 | **Overpass** | 400 / 600 / 700 | Based on Highway Gothic, the typeface on US highway signs. Fits a store named after a highway. |
| Numbers (prices, hours, phone) | **Overpass Mono** | 600, tabular figures | Prices and times line up cleanly, like a price board |

Scale: fluid with `clamp()`. H1 roughly 40px mobile → 88px desktop. Body 17–18px, line-height 1.55. Max text width ~68ch.

### 5.4 Signature components (these make the site feel ownable)

1. **Fuel Price Board.** A dark asphalt panel styled after the pylon sign: grade labels in small white uppercase Overpass, prices in large Overpass Mono `price-green` digits with a subtle glow (text-shadow, no neon overload), "9/10" rendered as a smaller superscript like real fuel signs. Below: "Updated 7:12 AM today" from the database timestamp. If the price is older than 48 hours, hide the numbers and show "Call for today's price" with the phone link. Never show stale prices.
2. **Open-Now Pill.** Live status computed in America/Chicago: "Open now · until 11 PM" / "Closed · opens 5 AM". Rendered on the client after hydration to avoid timezone mismatch; server renders a neutral placeholder of the same size to prevent layout shift.
3. **Route badge.** An original small rounded-rectangle badge with "185" in it, black border on white, used beside the wordmark. Keep it original; do not reproduce an official state highway shield exactly.
4. **Aisle cards.** Category cards labeled like store aisle signs: "Aisle 01 · Chilled Drinks". Real photo, a short line of copy, no icons.
5. **Shelf-edge divider.** A thin black bar with a 3px `sign-red` line on top, used between major sections and as caption strips under photos (like the price strips on the store's shelves).
6. **Mobile action bar.** Fixed bottom bar on small screens with three equal buttons: **Call**, **Directions**, **Gas Prices**. Respect `env(safe-area-inset-bottom)`.

### 5.5 Photography rules

- Use only the store's own photos from `public/images/`. No stock photos, no AI-generated images, no illustrations of food.
- Several supplied photos look digitally enhanced and a few contain **garbled or inconsistent text** (see §11). Crop or skip anything with visibly wrong lettering, because that is the fastest way to make a site look fake.
- Prefer natural crops over dark overlays. If text must sit on a photo, use a solid asphalt panel beside or below it, not a gradient over it.
- Every image through `next/image` with proper `sizes`, explicit width/height, AVIF/WebP, and real descriptive alt text.

### 5.6 Anti-"AI-generated look" rules (strict)

Do **not** do any of these:
- Purple/blue gradients, mesh gradients, glassmorphism, frosted cards, glowing blobs, grain overlays for "vibe"
- A centered hero of "Welcome to [Store]" + subtitle + two pill buttons over a darkened photo
- Rows of three identical cards each with an icon in a tinted circle
- Emoji in headings or UI
- Generic copy: "Elevate", "Experience the difference", "Your ultimate destination", "We pride ourselves", "Unlock", "Seamless", "Curated"
- Invented testimonials, star ratings, customer counts, or statistics
- Fake "As seen on" logos
- Excessive scroll animations, parallax, or text that fades in word by word
- Perfectly symmetrical layouts on every section
- Inter / Poppins / Montserrat as the main font

Do this instead:
- Asymmetric layouts with real photos at different sizes, like a store wall
- Short, specific, plain sentences that sound like a person behind the counter
- Real details: actual flavors on the slushie machine, actual aisle names, actual services
- Restrained motion: 150–200ms color/transform transitions on hover and focus; respect `prefers-reduced-motion`
- Hard edges and small radii (4–6px), not pillowy 24px-rounded cards

### 5.7 Voice and copy

Friendly, quick, Kentucky-plain. Short sentences. Talk like the person at the register.

Examples of the tone:
- "Gas, hot chicken, cold drinks, and whatever else you forgot."
- "Won a scratch-off? Cash it right here, up to $5,000."
- "Fresh coffee on, every morning."
- "Air for your tires, ice for your cooler, cash from the ATM."

Avoid superlatives you can't prove ("cheapest gas in Bowling Green"). Use "low prices at the pump" and let the live price board prove it.

---

## 6. Information architecture

```
/              Home
/fuel          Fuel & prices
/food          Hot food & drinks
/store         In the store (aisles)
/lottery       Kentucky Lottery
/visit         Hours, directions, contact
/admin         Owner dashboard (noindex, password protected)
/privacy       Privacy notice (short, plain language)
```

Header nav (desktop): Fuel · Food · In the Store · Lottery · Visit, plus a red "Call" button with the phone number visible on desktop. Mobile: menu button + the fixed bottom action bar.

Footer: wordmark + route badge, "Quick · Clean · Kind", address (links to directions), phone, hours summary, nav links, BP fuel note, "Must be 21+ to purchase tobacco. Must be 18+ to play the Kentucky Lottery.", small privacy link, © year.

---

## 7. Page-by-page spec

Write real copy in the store's voice using the facts in §3. Where a fact is UNKNOWN, show nothing rather than a placeholder that looks real.

### 7.1 Home

1. **Notice banner** (optional, from admin): thin asphalt strip, e.g. "Fresh chicken ready by 11 AM". Dismissible, hidden if empty.
2. **Hero (split, asymmetric).** Left ~55%: route badge + small label "Highway 185 · Bowling Green, KY", H1 **"Gas, hot food & everything in between."**, line "Quick · Clean · Kind", Open-Now pill, buttons **Get Directions** (red) and **Call (270) 599-1126** (outlined). Right ~45%: `storefront/storefront-dusk.jpg` cropped tight on the building, with a shelf-edge caption strip "1341 Hwy 185". On mobile the photo comes first, then text.
3. **Fuel Price Board** (Regular / Premium / Diesel) + short line "BP fuel. Low prices. Diesel on site." + link to /fuel.
4. **Hot food band.** Large photo + text: Perfectly Southern fried chicken and Hunt Brothers pizza, plus coffee and slushies. One clear link to /food.
5. **Aisles grid.** 6–8 aisle cards (Chilled Drinks, Snacks & Chips, Candy, Health & Wellness, Auto Care, T-Shirts, Ice Cream, Tobacco & Smoke [text-only card, see §10]). Varied card sizes in a masonry-like grid.
6. **Services strip.** Plain, compact list (not icon cards): ATM · Air for tires · Bagged ice · Lottery cashing up to $5,000 · Coffee · Slushies.
7. **Lottery callout.** Asphalt panel with `hi-vis` "$5,000" badge: "Won? Cash it here." Link to /lottery.
8. **This week's deals** (from admin). Up to 4 deal tags styled like shelf price labels. Section hidden if there are none.
9. **Visit block.** Embedded map, address, hours table, phone, directions button.

### 7.2 Fuel (`/fuel`)
- Full price board with "last updated" timestamp and stale-price rule.
- Grades available: Regular, Premium, Diesel. (Ask owner about mid-grade and E0/non-ethanol before listing them.)
- Air for tires, bagged ice, auto aisle cross-link.
- Photo: `fuel/fuel-canopy.jpg`. Note: the BP sign photo shows old prices on it; crop the prices out or don't use it near the live board, so the page never shows two different prices.
- Short FAQ: "Do you have diesel?" "Is there air?" "Pay at the pump?" (pay-at-pump: owner must confirm before you write the answer; omit until confirmed).

### 7.3 Hot food & drinks (`/food`)
Sections, each with photo + 2–3 lines:
- **Fried chicken** (Perfectly Southern program: chicken pieces, tenders; ask owner for the real menu and prices before listing items).
- **Pizza** (Hunt Brothers; whole pizzas and slices; same rule on menu).
- **Coffee bar** — `food/coffee-bar.jpg`, "Begin every day fresh."
- **Fountain drinks** — `food/fountain-beverage-bay.jpg`, "Beverage Bay".
- **Slushies** — `food/slushie-machines.jpg` (crop out the top wall sign, see §11). Flavors seen: strawberry, watermelon, mango, sour apple. Label as "Flavors rotate".
- **Ice cream** — `food/ice-cream-freezer.jpg`.

Build menu items as data (`content/menu.ts`) with optional prices so the owner can fill them later. Hide price fields that are empty. If the menu is still empty at launch, show the categories with "Ask at the counter for today's menu" instead of a fake list.

### 7.4 In the store (`/store`)
Aisle-by-aisle page using aisle cards, each linking to an anchor section with a larger photo and a short description:
Chilled Drinks · Snacks & Chips · Candy · Snack Cakes & Pastries · Jerky & Meat Snacks · Health & Wellness · Auto Care · T-Shirts · Ice Cream · Tobacco & Smoke (text only, 21+).

### 7.5 Lottery (`/lottery`)
- "Kentucky Lottery tickets, scratch-offs, and draw games." Mention the self-service lottery machine (`services/lottery-vending.jpg`).
- **Cashing:** "We cash winning tickets up to $5,000." Then the accurate Kentucky rules in plain language:
  - Prizes **$600 or less**: cash at the counter.
  - Prizes **over $600 up to $5,000**: bring the signed ticket, a completed Kentucky Lottery prize claim form, and valid ID. Link to the official Kentucky Lottery claim form page.
  - Prizes **over $5,000**: must be claimed through the Kentucky Lottery (Super Cashing Agent, regional office, or HQ). Link to the official page.
- Legal line: "Must be 18 or older to play. Please play responsibly." plus a problem-gambling helpline (owner/you must verify the current Kentucky number before launch; 1-800-GAMBLER is the national line).
- **Owner must confirm** the store is an authorized cashing agent for $600–$5,000 prizes before this page goes live. Add this to the TODO list.

### 7.6 Visit (`/visit`)
- Map embed (Google Maps embed by address, lazy-loaded with a static placeholder until tapped, to protect performance and privacy).
- Address, phone, hours table (today highlighted), holiday notice from admin.
- "Get directions" deep link: `https://www.google.com/maps/dir/?api=1&destination=1341+KY-185,+Bowling+Green,+KY+42101`, plus an Apple Maps link on iOS.
- Contact form (see §8.4).
- Optional "We're hiring" block, off by default, toggled from admin.

---

## 8. Technical architecture

### 8.1 Stack
- **Next.js** latest stable, App Router, **TypeScript** (strict), React Server Components by default
- **Node.js** runtime for Route Handlers and Server Actions (this is the backend)
- **Tailwind CSS** (v4, theme tokens from §5.2 in CSS `@theme`)
- **Prisma** ORM with **SQLite** in development and **PostgreSQL** in production (Neon, Supabase, or Vercel Postgres)
- **Zod** for validation, **React Hook Form** for the contact and admin forms
- **Resend** (or Nodemailer via SMTP) for contact-form email to the owner
- **iron-session** for the admin session cookie; password hash with **bcrypt**
- Icons: one set only (Lucide or Phosphor), 1.75px stroke, used sparingly
- Lint/format: ESLint + Prettier. Tests: Vitest for utilities (especially hours logic), Playwright smoke test for key flows.
- Deploy target: Vercel (document env vars), but nothing Vercel-only in the code.

### 8.2 Folder structure
```
app/
  (site)/
    layout.tsx           # header, footer, mobile action bar, notice banner
    page.tsx             # Home
    fuel/page.tsx
    food/page.tsx
    store/page.tsx
    lottery/page.tsx
    visit/page.tsx
    privacy/page.tsx
  admin/
    login/page.tsx
    page.tsx             # dashboard
    actions.ts           # server actions (auth-guarded)
  api/
    contact/route.ts
  sitemap.ts
  robots.ts
  opengraph-image.tsx    # branded OG image (asphalt + red wordmark + route badge)
  icon.tsx / apple-icon.tsx
components/
  brand/ (Wordmark, RouteBadge, ShelfEdge)
  fuel/FuelBoard.tsx
  hours/OpenNowPill.tsx, HoursTable.tsx
  aisles/AisleCard.tsx
  layout/Header.tsx, Footer.tsx, MobileActionBar.tsx, NoticeBanner.tsx
  forms/ContactForm.tsx
content/
  store.ts               # §3 facts, typed
  aisles.ts
  menu.ts
lib/
  db.ts                  # Prisma client singleton
  hours.ts               # open/closed logic, America/Chicago
  auth.ts                # session helpers, requireAdmin()
  rate-limit.ts
  seo.ts                 # JSON-LD builders
prisma/schema.prisma
public/images/...        # provided
```

### 8.3 Data model (Prisma)
```prisma
model FuelPrice {
  id        String   @id @default(cuid())
  grade     String   @unique   // "regular" | "premium" | "diesel"
  price     Decimal            // e.g. 2.799
  updatedAt DateTime @updatedAt
}

model Deal {
  id        String    @id @default(cuid())
  title     String               // "2-Liter Pepsi products"
  priceText String               // "2 for $5"
  note      String?
  startsAt  DateTime?
  endsAt    DateTime?
  active    Boolean   @default(true)
  sortOrder Int       @default(0)
}

model StoreHours {
  dayOfWeek Int     @id          // 0 = Sunday
  opensAt   String?              // "05:00", null = closed
  closesAt  String?              // "23:00"; support past-midnight and 24h
}

model SpecialHours {
  id      String   @id @default(cuid())
  date    DateTime
  label   String                 // "Thanksgiving"
  opensAt String?
  closesAt String?
}

model SiteSettings {
  id            Int     @id @default(1)
  noticeText    String?
  hotFoodOn     Boolean @default(true)
  hiringOn      Boolean @default(false)
}

model ContactMessage {
  id        String   @id @default(cuid())
  name      String
  contact   String               // phone or email
  topic     String
  message   String
  createdAt DateTime @default(now())
}
```
Seed script: fuel grades with `null`-safe placeholder handling (no fake prices shown), empty hours, one example inactive deal.

### 8.4 Backend behavior
- **Contact form** (`POST /api/contact`): Zod-validated, honeypot field, per-IP rate limit (e.g. 5/hour), saves to DB, emails the owner via Resend. Friendly success state; specific, human error messages.
- **Admin** (`/admin`): single owner login (password hash in `ADMIN_PASSWORD_HASH`), session cookie (httpOnly, secure, sameSite=lax), login rate limiting, every server action calls `requireAdmin()`. Big, simple, phone-friendly forms:
  - Update fuel prices (three inputs, one "Save prices" button; timestamp auto-set)
  - Add/edit/expire deals
  - Edit weekly hours and special/holiday hours
  - Notice banner text
  - Toggles: hot food available, hiring
  - Inbox of contact messages
- After any admin save, call `revalidatePath`/`revalidateTag` so the public pages update immediately.
- Public pages: static/ISR with tag-based revalidation. No client-side data fetching for core content.

### 8.5 Environment variables (document in `.env.example`)
`DATABASE_URL`, `ADMIN_PASSWORD_HASH`, `SESSION_SECRET`, `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `NEXT_PUBLIC_SITE_URL`.

### 8.6 Hours logic (`lib/hours.ts`)
- All calculations in `America/Chicago` using `Intl.DateTimeFormat` (or `date-fns-tz`), never the server's local time.
- Support: normal hours, closing after midnight, open 24 hours, closed days, special/holiday hours overriding the weekly schedule.
- If no hours are set at all: the Open-Now pill is hidden and the hours table says "Call for hours" with the phone link.
- Unit-test every case.

---

## 9. SEO, local search, and sharing

- Per-page `metadata` with unique titles: e.g. "185 Quick Mart | BP Gas, Fried Chicken & Lottery on Hwy 185, Bowling Green KY".
- JSON-LD on every page: `GasStation` + `ConvenienceStore` (as `@type` array) with name, `alternateName: "HWY 185 Quick Mart"`, address, telephone, `openingHoursSpecification` (only when hours exist), `geo` (only when coordinates exist), `url`, `image`, `brand` for BP fuel, `amenityFeature` (ATM, air, lottery). Validate output shape.
- `sitemap.ts`, `robots.ts` (disallow `/admin`), canonical URLs, Open Graph + Twitter cards using the generated OG image.
- Natural local keywords in real sentences: Bowling Green, Highway 185 / KY-185, Warren County, BP gas, diesel, lottery cashing, fried chicken, Hunt Brothers Pizza, ATM. No keyword stuffing.
- README note for the owner: claim and update the **Google Business Profile** and **Apple Business Connect** with the same name, address, phone, and hours as the site (NAP consistency matters more than anything else for local ranking).

---

## 10. Legal, brand, and compliance guardrails

- **Tobacco and smoke items:** text-only mention. No product photos, no brand logos, no promotional pricing. Show "21+ with valid ID" (federal Tobacco 21). Don't market to minors anywhere on the site.
- **Lottery:** 18+ notice and responsible-play line wherever lottery is promoted. Accurate claim rules (§7.5). No language implying guaranteed winnings.
- **Third-party trademarks** (BP, Perfectly Southern, Hunt Brothers Pizza, Kentucky Lottery, Blue Bunny, etc.): mention them by name in text. Only use their logos if the owner confirms the store's dealer/program agreement allows it; build a `<PartnerLogo>` slot that renders nothing until a logo file is added. Real photos of the store's own signage are fine.
- **Fuel prices:** always show the "last updated" time; never display a price older than 48 hours.
- **Privacy page:** what the contact form collects, why, how long it's kept, how to request deletion. Plain English, short.
- **Accessibility:** WCAG 2.2 AA. Semantic landmarks, skip link, visible focus states (2px red outline with offset), 44×44px minimum tap targets, labels on all inputs, `aria-live` for form status, correct heading order, alt text on every meaningful image.

---

## 11. Asset manifest (`public/images/`)

| File | What it shows | Use / notes |
|---|---|---|
| `storefront/storefront-dusk.jpg` | Store front at sunset, red sign lit | **Home hero.** Crop toward the building. |
| `storefront/storefront-day.jpg` | Store front, daytime, flowers, "Right on the Money" sign | Visit page, OG image source |
| `storefront/storefront-side-ice.jpg` | Side of building, Hunt Brothers + chicken signs, ice chest | Food page or Visit page |
| `fuel/fuel-canopy.jpg` | BP canopy and pumps | Fuel page hero |
| `fuel/bp-price-sign.jpg` | BP price pylon with old prices | Design reference for the price board. Avoid near live prices, or crop the numbers out. |
| `food/coffee-bar.jpg` | Coffee machines, "Begin every day fresh" sign | Food page, coffee section |
| `food/fountain-beverage-bay.jpg` | "Beverage Bay" fountain station | Food page, fountain section |
| `food/slushie-machines.jpg` | Four slushie flavors | Food page. **Crop out the top wall sign**, which reads "185 QUICK STOP" (doesn't match the real name). |
| `food/ice-cream-freezer.jpg` | Blue Bunny freezer | Food page / aisles |
| `aisles/interior-counter-wide.jpg` | Wide interior, "Quick · Clean · Kind" wall, counter | Home or About-style band |
| `aisles/cooler-wall.jpg` | "Chilled Drinks" cooler wall | Aisle: Chilled Drinks |
| `aisles/chips-and-coolers.jpg` | Chips gondola with coolers behind | Aisle: Snacks & Chips |
| `aisles/chips-aisle-wide.jpg` | Wide chips aisle | Use **cropped to the lower 2/3**: the background signs read "185 QUICK STOP". |
| `aisles/candy-aisle.jpg` | Candy wall | Aisle: Candy |
| `aisles/snack-cakes-aisle.jpg` | Snack cakes, donuts | Aisle: Snack Cakes |
| `aisles/pastries-display.jpg` | Pastry rack (muffins, danish, cupcakes) | Aisle: Snack Cakes & Pastries |
| `aisles/jerky-meat-snacks.jpg` | Jerky and meat sticks | Aisle: Jerky |
| `aisles/counter-snack-rack.jpg` | Counter rack, trail mix, candy | Secondary / gallery |
| `aisles/two-liter-racks.jpg` | 2-liter racks, "2 for $5" tag | Deals section imagery (don't hard-code the deal) |
| `aisles/health-wellness.jpg` | Health & Wellness endcap | Aisle: Health & Wellness |
| `aisles/auto-care.jpg` | Motor oil, fluids, gas can | Aisle: Auto Care |
| `aisles/tshirts-and-soda.jpg` | T-shirt rack + soda boxes | Aisle: T-Shirts |
| `aisles/tshirts-shelf.jpg` | T-shirt shelving | Aisle: T-Shirts (alternate) |
| `services/atm.jpg` | Express ATM | Services. **Crop out the screen**: its on-screen text is garbled. |
| `services/lottery-vending.jpg` | Kentucky Lottery self-service machine | Lottery page |
| `_reference-only/marketing-collage.jpg` | Pre-made collage | **Do not use on the site.** Reference only. It contains a misspelled brand name. |

Before using any photo, look at it at full size and check for warped or misspelled text. If in doubt, crop it out or skip it, and list what you changed in the README.

---

## 12. Performance targets

- Lighthouse (mobile): Performance ≥ 95, Accessibility 100, Best Practices 100, SEO 100
- LCP < 2.0s on 4G for the home page; hero image preloaded with `priority`
- CLS < 0.05 (reserve space for the Open-Now pill and notice banner)
- JS sent to the client kept minimal: only the menu toggle, Open-Now pill, forms, and map-on-tap are client components

---

## 13. How to work

Do this in order, and stop for my review where marked.

1. **Clarify first.** Before coding, list every UNKNOWN from §3 and every "owner must confirm" item (hours, coordinates, pay-at-pump, mid-grade, chicken/pizza menu, lottery cashing authorization, logo permissions, email, socials, helpline number). Ask me for them in one message. If I don't have them yet, proceed with the empty-state behaviors described above.
2. **Design tokens and primitives.** Tailwind theme, fonts, Wordmark, RouteBadge, ShelfEdge, buttons, FuelBoard, OpenNowPill. Build a hidden `/styleguide` route to show them. **Stop and show me screenshots.**
3. **Home page** fully built with real copy. **Stop for review.**
4. Remaining public pages.
5. Database, admin, contact API.
6. SEO, JSON-LD, sitemap, OG image.
7. Tests (hours logic, contact validation, admin auth guard) and a Playwright smoke test (home loads, call link works, admin requires login).
8. **Self-review pass** against §5.6 (anti-AI-look list) and §10 (compliance). Fix anything that fails, then tell me what you changed.
9. README: setup, env vars, how the owner updates prices/deals/hours, deployment steps, and the full owner TODO list.

## 14. Definition of done

- [ ] Every page works and looks intentional at 360px, 768px, 1280px, and 1600px wide
- [ ] Call, Directions, and Gas Prices are one tap away on every mobile page
- [ ] No invented facts, prices, hours, reviews, or stats anywhere
- [ ] No stale fuel prices can ever be shown
- [ ] Open/closed status is correct in Central Time, including after-midnight and holiday cases (tested)
- [ ] Owner can update prices, deals, hours, and the notice banner from a phone in under a minute
- [ ] Tobacco and lottery compliance lines present; no tobacco imagery
- [ ] No photo on the site shows misspelled or wrong store names
- [ ] Lighthouse targets in §12 met
- [ ] Passes the §5.6 anti-AI-look checklist on a fresh read
