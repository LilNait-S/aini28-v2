import fs from "node:fs/promises";

// Read-only reconciliation. Public catalog data only; no write token is used.
try {
  process.loadEnvFile(".env");
} catch (error) {
  if (error.code !== "ENOENT") throw error;
}
const project = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
if (!project || !dataset)
  throw new Error("Missing public Sanity project/dataset");
const api = (process.env.PLUSH_API_URL || "https://api.aini28.com").replace(
  /\/$/,
  "",
);
async function get(url) {
  const response = await fetch(url, { signal: AbortSignal.timeout(30000) });
  if (!response.ok) throw new Error(`Catalog request HTTP ${response.status}`);
  return response.json();
}
const query =
  '*[_type in ["product", "banners", "category"] && !(_id in path("drafts.**"))]{_id,_type,name,slug,isFeatured,sizePricing,title,images,isActive,order,link,image}';
const sanity = (
  await get(
    `https://${project}.api.sanity.io/v2025-03-26/data/query/${dataset}?query=${encodeURIComponent(query)}`,
  )
).result;
if (!Array.isArray(sanity)) throw new Error("Unexpected Sanity response");
const first = await get(
  `${api}/api/public/catalog/products?pageSize=100&page=1`,
);
const products = [...first.products];
for (let page = 2; page <= first.totalPages; page++) {
  products.push(
    ...(
      await get(`${api}/api/public/catalog/products?pageSize=100&page=${page}`)
    ).products,
  );
}
if (
  products.length !== first.total ||
  new Set(products.map((p) => p.id)).size !== products.length
) {
  throw new Error("Catalog changed during pagination; rerun reconciliation");
}
const normalize = (value) =>
  String(value ?? "")
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
const sizes = { 1: "Pequeño", 2: "Mediano", 3: "Grande", 4: "Gigante" };
const mappings = sanity
  .filter((p) => p._type === "product")
  .map((source) => {
    const candidates = products.filter(
      (p) =>
        p.slug === source.slug?.current &&
        normalize(p.name) === normalize(source.name),
    );
    const target = candidates.length === 1 ? candidates[0] : null;
    return {
      sanityId: source._id,
      name: source.name.trim(),
      oldPath: `/peluches/${source.slug?.current}`,
      plushProductId: target?.id ?? null,
      status: target
        ? "matched"
        : candidates.length > 1
          ? "ambiguous"
          : "not-in-public-plush-catalog",
      oldFeatured: source.isFeatured === true,
      variants: (source.sizePricing ?? [])
        .filter((v) => v.isActive === true)
        .map((v) => {
          const matches =
            target?.variants.filter(
              (t) =>
                normalize(t.attributes["Tamaño"]) ===
                  normalize(sizes[v.size]) &&
                normalize(t.attributes["Medida aprox."]) ===
                  normalize(`${v.approximateSize} ${v.unit}`),
            ) ?? [];
          const match = matches.length === 1 ? matches[0] : null;
          return {
            sanityKey: v._key,
            size: sizes[v.size],
            measurement: `${v.approximateSize} ${v.unit}`,
            plushVariantId: match?.id ?? null,
            oldPrice: Number(v.price).toFixed(2),
            plushPrice: match?.normalPrice ?? null,
            priceMatches: match
              ? Number(v.price).toFixed(2) === match.normalPrice
              : null,
          };
        }),
      imageCount: source.images?.length ?? 0,
    };
  });
const report = {
  generatedAt: new Date().toISOString(),
  source: { project, dataset, plushApi: api },
  scope:
    "Published Sanity documents versus public Plush catalog. Hidden/inactive Plush products are not observable here. No data imported.",
  counts: {
    sanityProducts: mappings.length,
    plushPublicProducts: products.length,
    matchedProducts: mappings.filter((p) => p.status === "matched").length,
    unmatchedProducts: mappings.filter((p) => p.status !== "matched").length,
    categories: sanity.filter((x) => x._type === "category").length,
  },
  products: mappings,
  banners: sanity
    .filter((x) => x._type === "banners")
    .map((b, index) => {
      let proposedLink = b.link ?? "";
      try {
        const url = new URL(proposedLink);
        if (
          ["aini28-v2.vercel.app", "aini28.com", "www.aini28.com"].includes(
            url.hostname,
          )
        )
          proposedLink = `${url.pathname}${url.search}${url.hash}`;
      } catch {
        /* Preserve for manual review. */
      }
      const asset = b.image?.asset?._ref ?? "";
      const dimensions = /-(\d+)x(\d+)-[^-]+$/.exec(asset);
      return {
        sanityId: b._id,
        title: b.title ?? "",
        alt: b.image?.alt?.trim() ?? "",
        active: b.isActive === true,
        oldOrder: b.order ?? null,
        proposedOrder: b.order ?? index,
        oldLink: b.link ?? "",
        proposedLink,
        targetInPublicPlush: products.some(
          (p) => `/peluches/${p.slug}` === proposedLink,
        ),
        width: dimensions ? Number(dimensions[1]) : null,
        height: dimensions ? Number(dimensions[2]) : null,
        assetRef: asset,
      };
    }),
};
await fs.mkdir("docs", { recursive: true });
await fs.writeFile(
  "docs/catalog-reconciliation.json",
  `${JSON.stringify(report, null, 2)}\n`,
);
console.log(
  JSON.stringify({
    ...report.counts,
    banners: report.banners.length,
    matchedVariants: mappings
      .flatMap((p) => p.variants)
      .filter((v) => v.plushVariantId).length,
  }),
);
