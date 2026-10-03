# Plush integration

## Phase 2: local website consumer (2026-10-02)

Official checkout C:/dev/2025/aini28-v2, branch codex/catalog-phase-1.
Catalog, detail, banners, actual size filters, search and sitemap now read the
public Plush API on the server. No Sanity fallback, API token or R2 credentials.
PLUSH_API_URL is an optional server-only origin (default https://api.aini28.com).
HTTPS required; development permits HTTP localhost/127.0.0.1 only.
Responses are schema-validated, uncached, timeout 10 seconds. Missing detail
returns 404; upstream errors are not disguised as missing products.

One main photo, system attributes/variant UUIDs and fixed description; no
category, likes, public stock or fabricated ratings/availability. Prices derive
from current props; a valid lower offer replaces normal price. Visible catalog
pages refresh every 15 seconds and on focus. Search debounce is 500 ms with
stale-response cancellation. Sitemap reads every public page (100 per request).

Minimal cart compatibility uses real product/variant UUIDs and public image URLs.
Old persisted Sanity carts are discarded by version migration. Email payload and
summary labels were adapted to the UUID/attribute shape to keep the app runnable.
Authoritative server repricing before email/WhatsApp remains PHASE 3: do not
publish this intermediate checkout as the final integration. No emails/messages
sent, live changed or production inventory mutated during phase 2.

Verification: Next 15.2.8 production build passed, tsc --noEmit passed,
next lint passed without warnings, test:catalog 4/4 (live closing restores normal
price, invalid offers, flexible attributes, malformed upstream response).
Local browser verified 3 homepage banners, actual size links, 16 products over
2 pages, debounced Pikachu search, detail 45 -> 80 after selecting Grande/50 cm,
cart UUID selection/label/image/total and empty offers with the current closed
live. Actual open-to-close live polling has not been exercised in the browser;
price transition is covered by unit tests and the Plush integration suite.
Proof: ignored Plush .data/aini-qa/phase2-cart.png.

Local preview: http://localhost:3001, started with
node node_modules/next/dist/bin/next dev --port 3001.
No Aini commit, push or deployment performed. Sanity Studio/dependencies remain
for phase 4 cleanup. Next: phase 3 authoritative request repricing and contact
flows, then final SEO/Sanity cleanup and separately authorized deployment.
## Import completed

Banner transfer also completed on 2026-10-02 under the authenticated user:
3 active banners, original titles/alt/images, relative product links and orders
0/1/2. Public API fields, image delivery and all target details verified.
Phase 1 content transfer is complete. See phase 2 below.

2026-10-02: user authorized copying the missing products following the existing
six and signed in to production. Authenticated UI confirmed 6 active products,
zero deactivated products before import. Created 10 products with 15 active
variants through the normal product form, under the user's session. Main image
only, original names/slugs, normal prices, no live price, threshold 1, not on
order, no inventory adjustments/purchases. New variants start at zero stock.
Existing six products were not edited. Public re-reconciliation now verifies
16/16 products and 24/24 variants: all slugs, sizes, measures and normal prices
match. All 16 main image URLs return images successfully through private R2
delivery. docs/catalog-reconciliation.json reflects the POST-import state.
All three banner targets now resolve; banner transfer completed above.
No Aini runtime changes or deployment. Phase 2 can begin with catalog/banners
API consumption. The section below records the initial comparison.

Verified 2026-10-02 against public Sanity bhxkbc7p/production and production
Plush API. Website runtime remains unchanged and uses Sanity.

Run `node scripts/reconcile-catalog.mjs` from this repo to reproduce the
read-only comparison. Public Sanity settings come from .env; no write token
used. PLUSH_API_URL optionally overrides the public Plush API. Published
Sanity documents only; Plush reads are paginated. Output is
docs/catalog-reconciliation.json. No imports or inventory/price writes.

Sanity: 16 products, 25 categories, 3 active banners. Public Plush: 6 products,
9 variants. All 6 match normalized names and exact slugs: Coyote y correcaminos,
Minion, Sullivan bebe, Gato Garfield, Gengar, Pikachu. All 9 active sizes match
size/measurement attributes and normal prices. Keep /peluches/<slug> links.
JSON records source product/variant keys and target IDs.

Ten products lack a PUBLIC match: Miku, oso disfraz, Furia nocturna, Totoro con
hoja peludo, pochaco hamburguesa, Conejo convertible, Gorila, Gato Pusheen,
Perro znauser, Pollo antena. Public reads cannot distinguish absent from hidden
or inactive products/variants. User decision pending: incorporate them before
cutover or intentionally retire listings. Never import blindly or invent stock.
Retired URLs should truthfully report unavailable/not-found, without redirecting
to unrelated products.

Plush public banners empty. Sanity originals: Pusheen 1320x1319, Furia 800x800,
Coyote 675x772, all with assets and alt text. Keep originals; 2:1 is recommended,
not mandatory. Old links use aini28-v2.vercel.app; propose relative paths.
Only Coyote currently resolves in public Plush. Hold the other two until product
scope is resolved. Old orders unset; JSON proposes deterministic 0/1/2 from
snapshot, to review before publication. No banner uploaded in this phase.

Later phases: dynamic variants with real IDs, one photo, fixed description,
no categories/likes/public stock. Plush owns publication, featured, prices and
banners. Offer uses livePrice only for products in the open live; disappears on
close. POS same-day switch does not activate public offers. Email/WhatsApp are
requests; manual sale entry. Reprice before sending and version old carts.
Preserve slugs and paginate sitemap (100 maximum per request). Local Aini uses
3001 because Plush API uses 3000; align allowed form origin.

Next: resolve ten unmatched listings, then phase 2 replaces server reads and
presentation. No dual Sanity fallback after cutover. No production edits or
deployment performed. Script syntax and existing TypeScript pass; no runtime
UI/build/deployment verification claimed for this phase.

## Phase 3: authoritative inquiry pricing (2026-10-02)

Implemented locally, no deployment. POST /api/catalog/quote resolves product and
variant UUIDs against the current public Plush catalog. Editorial fields and
prices come from Plush, never from browser metadata. Totals use integer cents
with a safe-integer guard. Invalid/duplicate/removed/hidden variants are rejected;
quantity is integer 1..1000, at most 200 distinct lines. Origin, body declaration
limit and per-IP rate limit guard the quote route; response is no-store.

Email re-quotes again after the existing Origin/rate/CAPTCHA guards and BEFORE
creating SMTP delivery. Changed prices return 409 plus canonical cart; client
updates the summary and requires another deliberate send. Upstream failure is
503, unavailable item 409. No fallback to persisted/browser prices. Customer
and merchant emails use canonical variant/name/prices and referential totals.
No database sale, reservation or inventory operation is created.

WhatsApp preparation works in detail and full-cart summary. Server constructs
text/target from current canonical items. The customer reviews the fresh total,
then Continue re-quotes once more before navigation. Price changes stop that
navigation for review; stale responses after cart edits are ignored. No personal
contact fields are included in the prepared WhatsApp URL. The actual message is
sent manually in WhatsApp. Cart/email/confirmation wording now describes an
inquiry, rather than a confirmed sale.

Fixed a discovered pre-existing runtime failure: customer-contact imported
phoneSchema from a use-client component. Validation now lives in neutral
lib/validations/phone.ts, shared by server/form and compatibility UI export.

Verified: TypeScript, zero-warning lint, 9 catalog/quote/phone tests. Browser QA
at temporary localhost:3002 verified detail and full-cart preparation, canonical
Pikachu Mediano 45.00 label/total/URL. No Continue navigation or actual messages.
HTTP QA: forged quote -> 200/correct amount, missing variant -> 409, untrusted
Origin -> 403; send-email with changed price -> 409/canonical total before SMTP.
No real SMTP delivery tested or performed; deployment smoke test remains pending.
Ignored proof in Plush .data/aini-qa/phase3-request.png.
Local browser had stale dev assets at 3001; fresh 3002 isolated that QA.
Next: phase 4 final SEO/Sanity dependency/Studio cleanup, then release review and
separately authorized deployment. Exact local preview state is in Plush handoff.

Phase 3 final production build PASSED. Local dev preview restored at http://localhost:3002 with process-only NEXT_PUBLIC_SITE_URL=http://localhost:3002; no env file changed. 3001 is stopped.

## Phase 4: Sanity retirement and SEO (2026-10-02)

Completed locally; no deployment or external Sanity data deletion. Removed all
runtime Sanity clients/schema/types/GROQ/Studio source and four direct packages
(@sanity/image-url, @sanity/vision, next-sanity, sanity), obsolete typegen script.
npm updated the lockfile and removed 1103 packages. The read-only reconciliation
script and public migration evidence remain historical tools; they use native
fetch and do not require a Sanity runtime dependency. Historical security notes
are retained. Sanity environment variables/tokens are no longer runtime needs;
no credential/environment files or external settings were changed.

/studio and nested Studio URLs permanently redirect (308) to the actual Plush
website management panel https://app.aini28.com/website. Old /api/revalidate POST
returns 410: no obsolete webhook token or cache invalidation consumer.
Removed Sanity image/CSP allowances. Retained existing CSP report-only behavior.
Fixed development immutable Next static caching that caused stale hydration;
production content-hashed assets retain immutable caching. Public image optimizer
TTL is 60s, without the former forced one-year image cache; sitemap is no-store.

Catalog and offers have distinct canonical metadata. Unfiltered page 2 has its
own canonical; filtered/search/sorted lists are noindex/follow with base canonical.
Pagination anchor URLs preserve current filters, including previous/next links.
Checkout metadata is noindex/nofollow. Product slugs/canonical URLs, public images
and variant prices are preserved; schema contains no public stock/fake ratings.
Removed placeholder Google verification/nonexistent social preview image URLs and
unverified Organization founding/employees/social accounts. Existing real store
image, logo, company phone/email/address and store TikTok are used. General SEO
copy describes inquiry/manual coordination rather than unverified free delivery.

Verification: final Next 15.2.8 build PASSED, TypeScript PASSED, lint zero warnings,
10/10 focused catalog/quote/phone/SEO tests. HTTP checks passed on local 3002:
Studio 308, webhook 410, sitemap 16 product links/no checkout/no-store, current
product canonical + 2 offers/no stock/reviews, missing product 404, filtered robots
and pagination query, page 2 canonical, offers canonical, checkout noindex,
home without placeholder verification/Sanity CDN. No Sanity runtime imports or
packages remain. Ignored reproducible HTTP QA: Plush .data/aini-qa/phase4-http.mjs.

Next: phase 5 review and publish the Aini changes. Current branch remains
codex/catalog-phase-1 with local uncommitted changes from phases 1–4; no push or
Vercel deployment performed. Keep Plush backend/R2 credentials out of this repo.
Deploy configuration: PLUSH_API_URL=https://api.aini28.com (server-only/default),
NEXT_PUBLIC_SITE_URL=https://aini28.com, existing SMTP/recipient and existing
CAPTCHA/rate-limit settings. Confirm actual SMTP delivery in a controlled release
smoke check; it was intentionally not exercised during local implementation.

Phase 4 browser follow-up found and fixed size-filter defaults: cards initialize to the requested actual size (including legacy numeric size URLs), reset selection when that filter changes, and carry the selected variant UUID into detail links. Verified Grande-filtered Pikachu shows 80.00 and detail preserves Grande/50 cm. Screenshot ignored at Plush .data/aini-qa/phase4-variant.png. TypeScript and zero-warning lint passed after this correction; final build rerun below.

Final phase 4 build PASSED after the card variant correction. Preview restored at localhost:3002 (development, public Plush reads only; no external writes).

Phase 5 release: final source build, TypeScript, lint and 10 focused tests passed. Local SMTP connection/authentication verified without sending an email; deployed delivery remains a manual check. Release via GitHub PR and the existing Vercel Git integration, retaining existing production SMTP/CAPTCHA configuration. Production verification will be recorded in the Plush implementation handoff.
