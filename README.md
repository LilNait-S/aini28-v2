# Aini28 public catalog

Next.js website backed by Plush public catalog APIs. Products, publication,
variants, normal/live offer prices and banners are managed at
https://app.aini28.com/website. The former /studio URL redirects there.

The website is a catalog: it does not expose stock, reserve products or create
sales. Email and WhatsApp send inquiries; a seller records the sale manually.
Current public variants/prices are revalidated before preparing/sending an inquiry.

## Local development

Use Node 22+ and npm. Run npm ci, then
node node_modules/next/dist/bin/next dev --port 3002.
Use NEXT_PUBLIC_SITE_URL=http://localhost:3002 for that local process.
Plush system development uses ports 5173/3000 independently.

PLUSH_API_URL is server-only and defaults to https://api.aini28.com. It must be an
HTTPS origin in production; local HTTP localhost/127.0.0.1 is allowed during
development. Catalog API access is public/read-only: no API token or R2 secret.

Email uses the existing FROM_EMAIL_USER_AINI, FROM_EMAIL_PASS_AINI and TO_EMAIL
server settings. NEXT_PUBLIC_SITE_URL is https://aini28.com in production.
Keep existing Turnstile and rate-limit settings. Never commit credentials or
customer data. Sanity settings and tokens are no longer required by the website.

## Validation and release

npm run test:catalog
npm run lint
node node_modules/typescript/bin/tsc --noEmit
npm run build

Vercel is connected to the GitHub repository. Review its deployment status before
checking the public site. Verify published/hidden products, variants, images,
closed-live offers, inquiry repricing, sitemap and /studio redirect after release.
Do not use real inquiry delivery as an automated test without authorization.
See docs/PLUSH_INTEGRATION.md for migration evidence and verification history.
