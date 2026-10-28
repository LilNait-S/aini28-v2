import assert from "node:assert/strict";
import { test } from "node:test";
import {
  orderMessage,
  saveReceipt,
  loadReceipt,
  takePendingHandoff,
  receiptSchema,
} from "../lib/checkout-receipt.ts";
import { whatsappLink } from "../types/catalog.ts";
const id = "52a25d42-4cd6-4fca-8e74-33aefb730909";
const message = orderMessage({
  id,
  name: "Maria",
  total: "0.30",
  payment: "Yape",
  delivery: "Shalom - America Norte - Calle 123",
  lines: [{ name: "Peluche", variantLabel: "40 cm", qty: 3, finalPrice: 0.1 }],
});
const receipt = {
  id,
  message,
  whatsappUrl: whatsappLink({ whatsapp: "900000000" }, message),
  emailSent: false,
  expiresAt: Date.now() + 60000,
};
test("message includes saved reference, variants, line totals and exact destination", () => {
  assert.ok(message.includes(id));
  assert.ok(message.includes("40 cm"));
  assert.ok(message.includes("S/ 0.30"));
  assert.ok(message.includes("America Norte - Calle 123"));
  assert.ok(message.includes("por coordinar"));
  assert.equal(new URL(receipt.whatsappUrl).searchParams.get("text"), message);
});
test("receipt survives reload-style storage read; opening WhatsApp is one-shot and never creates requests", () => {
  let stored;
  globalThis.sessionStorage = {
    setItem: (_key, value) => {
      stored = value;
    },
    getItem: () => stored,
    removeItem: () => {
      stored = null;
    },
  };
  saveReceipt(receipt);
  assert.deepEqual(loadReceipt(), receipt);
  assert.equal(takePendingHandoff(), true);
  assert.equal(takePendingHandoff(), false);
  assert.equal(loadReceipt(receipt.expiresAt), null);
  assert.equal(stored, null);
});
test("blocked storage preserves recovery in memory and expires", () => {
  globalThis.sessionStorage = {
    setItem: () => {
      throw Error();
    },
    getItem: () => {
      throw Error();
    },
    removeItem: () => {
      throw Error();
    },
  };
  saveReceipt(receipt);
  assert.deepEqual(loadReceipt(), receipt);
  assert.equal(loadReceipt(receipt.expiresAt + 1), null);
});
test("receipt rejects scripts and external handoff URLs", () => {
  for (const whatsappUrl of [
    "javascript:alert(1)",
    "https://evil.test/",
    "https://wa.me.evil.test/1?text=a",
  ])
    assert.equal(
      receiptSchema.safeParse({ ...receipt, whatsappUrl }).success,
      false,
    );
  assert.equal(
    receiptSchema.safeParse({ ...receipt, whatsappUrl: null }).success,
    true,
  );
});
import { readFileSync } from "node:fs";
import vm from "node:vm";
import ts from "typescript";
import { recordedEmailLines } from "../lib/catalog/quote.ts";
import { shippingAgenciesSchema } from "../types/shipping.ts";
const routeSource = ts.transpileModule(
  readFileSync(
    new URL("../app/api/requests/route.ts", import.meta.url),
    "utf8",
  ),
  {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      esModuleInterop: true,
      jsx: ts.JsxEmit.React,
    },
  },
).outputText;
function route({
  status = 201,
  emailFails = false,
  catalogFails = false,
  delivery = { type: "PICKUP" },
  directoryFails = false,
} = {}) {
  const calls = [];
  const contact = {
    fullName: "Maria",
    email: "example@example.invalid",
    phoneNumber: "900000000",
    paymentMethod: "YAPE",
    delivery,
  };
  const modules = {
    "@/components/email/order-summary-email": () => null,
    "@/lib/security/request-guards": {
      exceedsMaxBody: () => false,
      verifyOrigin: () => true,
      guardMailRequest: async () => null,
    },
    "@/lib/validations/order": {
      orderPayloadSchema: {
        safeParse: () => ({
          success: true,
          data: {
            clientRequestId: id,
            userDetails: contact,
            cartItems: [{ selectedSize: id, qty: 1, finalPrice: 99 }],
          },
        }),
      },
    },
    "@/lib/validations/customer-contact": {
      peruvianMobile: () => "+51900000000",
    },
    "@/lib/checkout": {
      deliveryLabel: () => "Recojo en tienda",
      paymentMethodLabels: { YAPE: "Yape" },
    },
    "@/lib/catalog/plush": {
      createSaleRequest: async () => {
        calls.push("saved");
        return {
          status,
          body:
            status === 201
              ? {
                  id,
                  total: "45.00",
                  items: [{ variantId: id, quantity: 2, unitPrice: "22.50" }],
                }
              : { code: "SALE_REQUEST_ITEMS_UNAVAILABLE", variantIds: [id] },
        };
      },
      readAllProducts: async () => {
        if (catalogFails) throw Error();
        return [];
      },
      readCompany: async () => ({ whatsapp: "900000000" }),
      plushApiUrl: () => "http://localhost",
    },
    "@/lib/catalog/quote": {
      recordedEmailLines,
      UnpublishedItemError: class extends Error {},
    },
    "@/lib/checkout-receipt": { orderMessage },
    "@/types/catalog": { whatsappLink },
    "@/types/shipping": { shippingAgenciesSchema },
    "@react-email/render": { render: async () => "<html></html>" },
    react: { createElement: () => null },
    nodemailer: {
      createTransport: () => ({
        sendMail: async () => {
          calls.push("email");
          if (emailFails) throw Error();
        },
        close: () => {},
      }),
    },
    "next/server": {
      NextResponse: {
        json: (body, options = {}) => ({
          body,
          status: options.status ?? 200,
          headers: options.headers,
        }),
      },
    },
  };
  const module = { exports: {} };
  vm.runInNewContext(routeSource, {
    module,
    exports: module.exports,
    require: (name) => {
      if (!(name in modules)) throw Error(name);
      return modules[name];
    },
    console: { error: () => {} },
    process: { env: {} },
    setTimeout,
    clearTimeout,
    Date,
    AbortSignal,
    fetch: async (url) => {
      calls.push("directory");
      assert.equal(new URL(url).searchParams.get("id"), id);
      return {
        ok: !directoryFails,
        json: async () => ({
          agencies: [
            {
              id,
              name: "America Norte",
              address: "Calle de prueba 123",
              department: "La Libertad",
              province: "Trujillo",
              district: "Trujillo",
              ubigeo: "130101",
            },
          ],
        }),
      };
    },
  });
  return { post: () => module.exports.POST({ json: async () => ({}) }), calls };
}
test("saved request succeeds despite email/catalog failure and message uses recorded quantities/prices", async () => {
  const { post, calls } = route({ emailFails: true, catalogFails: true });
  const result = await post();
  assert.equal(result.status, 200);
  assert.equal(result.body.emailSent, false);
  assert.equal(result.body.id, id);
  assert.ok(result.body.message.includes("2 × Peluche"));
  assert.ok(result.body.message.includes("45.00"));
  assert.ok(!result.body.message.includes("99.00"));
  assert.equal(result.headers["Cache-Control"], "no-store");
  assert.deepEqual(calls, ["saved", "email"]);
});
test("failed registration never prepares WhatsApp or sends confirmation", async () => {
  const { post, calls } = route({ status: 409 });
  const result = await post();
  assert.equal(result.status, 409);
  assert.equal(result.body.whatsappUrl, undefined);
  assert.deepEqual(calls, ["saved"]);
});

test("agency message resolves exact branch from the server directory", async () => {
  const { post } = route({
    delivery: { type: "AGENCY", ubigeo: "130101", agencyId: id },
  });
  const result = await post();
  assert.equal(result.status, 200);
  assert.ok(result.body.message.includes("America Norte"));
  assert.ok(result.body.message.includes("Calle de prueba 123"));
});

test("directory failure preserves registration with a branch-review fallback", async () => {
  const { post } = route({
    directoryFails: true,
    delivery: { type: "AGENCY", ubigeo: "130101", agencyId: id },
  });
  const result = await post();
  assert.equal(result.status, 200);
  assert.ok(result.body.message.includes("Consulta la sede seleccionada"));
  assert.ok(!result.body.message.includes("America Norte"));
});

test("missing branch is explicitly marked for review; motorbike retains address", async () => {
  const agency = await route({
    delivery: {
      type: "AGENCY",
      ubigeo: "130101",
      agencyNote: "Sede de prueba pendiente",
    },
  }).post();
  assert.ok(
    agency.body.message.includes(
      "Sede pendiente de confirmar: Sede de prueba pendiente",
    ),
  );
  const motorbike = await route({
    delivery: {
      type: "MOTORBIKE",
      ubigeo: "150122",
      address: "Direccion de prueba 123",
    },
  }).post();
  assert.ok(motorbike.body.message.includes("Direccion de prueba 123"));
});
