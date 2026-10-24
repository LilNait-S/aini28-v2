import assert from "node:assert/strict";
import { test } from "node:test";
import { phoneSchema } from "../lib/validations/phone.ts";
import { catalogMetadata } from "../lib/seo/catalog-metadata.ts";
import {
  quoteCart,
  quoteRequestSchema,
  recordedEmailLines,
  UnpublishedItemError,
} from "../lib/catalog/quote.ts";
import {
  effectivePrice,
  variantLabel,
  catalogSchema,
  whatsappLink,
  companySchema,
} from "../types/catalog.ts";

const variant = {
  id: "17fbb3fc-d98e-4483-8eab-17678195fc6d",
  sku: "PLS-00000001",
  attributes: { Color: "Azul", "Medida aprox.": "40 cm" },
  normalPrice: "50.00",
  offerPrice: null,
  imageUrl: "https://api.aini28.com/api/public/images/products/test",
};
test("pagination has its own canonical and filtered catalog stays out of search indexes", () => {
  const base = {page:2,limit:8};
  assert.equal(catalogMetadata("/peluches",base).alternates.canonical,"https://aini28.com/peluches?page=2");
  const filtered = catalogMetadata("/peluches",{...base,size:"Grande"});
  assert.equal(filtered.robots.index,false);
  assert.equal(filtered.alternates.canonical,"https://aini28.com/peluches");
  assert.equal(catalogMetadata("/ofertas",{page:1,limit:8}).alternates.canonical,"https://aini28.com/ofertas");
});
test("phone validation is usable without importing a browser component", () => {
  assert.equal(phoneSchema.safeParse("+51900000000").success, true);
  assert.equal(phoneSchema.safeParse("invalid").success, false);
});
test("closing a live replaces an offer with the normal price", () => {
  assert.equal(effectivePrice({ ...variant, offerPrice: "35.00" }), 35);
  assert.equal(effectivePrice(variant), 50);
});

const product = {
  id: "52a25d42-4cd6-4fca-8e74-33aefb730909",
  name: "Peluche oficial",
  slug: "peluche-oficial",
  imageUrl: variant.imageUrl,
  variants: [variant],
};
const request = {
  cartItems: [
    {
      _id: product.id,
      selectedSize: variant.id,
      qty: 3,
      finalPrice: 0.01,
      name: "Nombre falso",
      variantLabel: "Tamaño falso",
    },
  ],
};
test("quote ignores forged metadata and prices, and computes cents exactly", () => {
  const quote = quoteCart(request, [
    { ...product, variants: [{ ...variant, normalPrice: "0.10" }] },
  ]);
  assert.equal(quote.total, 0.3);
  assert.equal(quote.cartItems[0].name, "Peluche oficial");
  assert.equal(quote.cartItems[0].variantLabel, "Azul · 40 cm");
  assert.equal(quote.changed, true);
});
test("quote rejects hidden products, removed variants and cross-product IDs", () => {
  assert.throws(() => quoteCart(request, []), UnpublishedItemError);
  assert.throws(
    () => quoteCart(request, [{ ...product, variants: [] }]),
    UnpublishedItemError,
  );
  assert.throws(
    () =>
      quoteCart(
        {
          ...request,
          cartItems: [{ ...request.cartItems[0], _id: variant.id }],
        },
        [product],
      ),
    UnpublishedItemError,
  );
});
test("quote flags live closing even when a persisted cart carries the offer", () => {
  const input = {
    cartItems: [{ ...request.cartItems[0], qty: 1, finalPrice: 35 }],
  };
  assert.equal(
    quoteCart(input, [
      { ...product, variants: [{ ...variant, offerPrice: "35.00" }] },
    ]).changed,
    false,
  );
  assert.equal(quoteCart(input, [product]).changed, true);
  assert.equal(quoteCart(input, [product]).total, 50);
});
test("invalid quantities, legacy identities and duplicate variants are rejected", () => {
  for (const qty of [0, -1, 1.5, 1001])
    assert.equal(
      quoteRequestSchema.safeParse({
        cartItems: [{ ...request.cartItems[0], qty }],
      }).success,
      false,
    );
  assert.equal(
    quoteRequestSchema.safeParse({
      cartItems: [{ ...request.cartItems[0], selectedSize: 2 }],
    }).success,
    false,
  );
  assert.throws(
    () =>
      quoteCart({ cartItems: [request.cartItems[0], request.cartItems[0]] }, [
        product,
      ]),
    UnpublishedItemError,
  );
});
test("an invalid or higher offer cannot increase the normal price", () => {
  for (const offerPrice of ["0.00", "50.00", "65.00"])
    assert.equal(effectivePrice({ ...variant, offerPrice }), 50);
});
test("variant labels support attributes beyond the four legacy sizes", () => {
  assert.equal(variantLabel(variant), "Azul · 40 cm");
});
test("a malformed upstream response is rejected instead of rendering a price", () => {
  assert.equal(
    catalogSchema.safeParse({
      products: [{ id: variant.id, name: "Peluche" }],
      total: 1,
      totalPages: 1,
    }).success,
    false,
  );
});
test("availability defaults to available and a sold-out variant cannot be quoted", () => {
  const parsed = catalogSchema.parse({
    products: [
      {
        ...product,
        featured: false,
        description: "x",
        updatedAt: "2026-10-23T00:00:00.000Z",
      },
    ],
    total: 1,
    totalPages: 1,
  });
  assert.equal(parsed.products[0].variants[0].availability, "AVAILABLE");
  assert.throws(
    () =>
      quoteCart(request, [
        { ...product, variants: [{ ...variant, availability: "SOLD_OUT" }] },
      ]),
    /se agotó/,
  );
});
test("the store WhatsApp link adds Peru's prefix and encodes the message", () => {
  const company = { whatsapp: "927 742 710" };
  assert.equal(
    whatsappLink(company, "Hola María"),
    "https://wa.me/51927742710?text=Hola%20Mar%C3%ADa",
  );
  assert.equal(whatsappLink({ whatsapp: "" }), null);
});
test("confirmation email lines use Plush data, never browser text", () => {
  const lines = recordedEmailLines(
    [{ variantId: variant.id, quantity: 2, unitPrice: "45.00" }],
    [product],
  );
  assert.deepEqual(lines, [
    {
      name: "Peluche oficial",
      qty: 2,
      finalPrice: 45,
      variantLabel: "Azul · 40 cm",
    },
  ]);
  assert.throws(() => recordedEmailLines([{ variantId: "x" }], [product]));
});
test("store links from Plush must be http(s) to be rendered", () => {
  const base = {
    name: "Aini28",
    whatsapp: "",
    email: "",
    address: "",
    district: "",
    province: "",
    department: "",
    reference: "",
  };
  const parsed = companySchema.parse({
    ...base,
    mapsUrl: "https://maps.app.goo.gl/x",
    tiktokUrl: "javascript:alert(1)",
    instagramUrl: "",
  });
  assert.equal(parsed.mapsUrl, "https://maps.app.goo.gl/x");
  assert.equal(parsed.tiktokUrl, "");
});
