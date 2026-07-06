/**
 * Serializa un objeto a JSON seguro para incrustar en una etiqueta
 * <script type="application/ld+json"> mediante dangerouslySetInnerHTML.
 *
 * Escapa los caracteres que podrían romper el contexto de <script> o iniciar
 * un comentario HTML si algún valor (p. ej. contenido del CMS) contiene
 * `</script>`. También escapa U+2028/U+2029 (inválidos como saltos de línea
 * dentro de literales JS).
 */

// Construido desde char codes para no incluir los separadores literales
// (U+2028/U+2029) en el código fuente, donde actúan como fin de línea.
const LINE_SEPARATORS = new RegExp(
  `[${String.fromCharCode(0x2028)}${String.fromCharCode(0x2029)}]`,
  "g"
)

export function safeJsonLd(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(LINE_SEPARATORS, (c) => "\\u" + c.charCodeAt(0).toString(16))
}
