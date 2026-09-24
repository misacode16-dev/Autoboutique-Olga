// src/utils/whatsapp.js
// Única fuente de verdad para generar los mensajes/links de WhatsApp.
// Se importa como módulo ES real (no is:inline) desde CartWidget.astro y desde [slug].astro.

export const WHATSAPP_NUMBER = "51907300174"; // sin +, sin espacios

// Construye la URL absoluta de un producto a partir de su slug.
// Usa window.location.origin porque esto siempre corre en el navegador
// (tanto el botón de la ficha de producto como el carrito son client-side).
function productUrl(slug) {
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  return `${origin}/tienda/${slug}`;
}

/**
 * Mensaje para "Comprar por WhatsApp" en la ficha de un solo producto.
 * @param {{ name: string, price: number, slug: string }} product
 * @returns {string} URL de wa.me lista para abrir
 */
export function buildSingleProductWhatsAppLink(product) {
  const url = productUrl(product.slug);

  const message = [
    "Hola estoy interesado en el siguiente producto:",
    "",
    `*${product.name}*`,
    `*Precio:* S/ ${product.price.toFixed(2)}`,
    `*URL:* ${url}`,
    "",
    "Gracias!",
  ].join("\n");

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

/**
 * Mensaje para el carrito (uno o varios productos), usado por CartWidget.
 * @param {Array<{name: string, price: number, quantity: number, slug: string}>} items
 * @returns {string} URL de wa.me lista para abrir
 */
export function buildWhatsAppOrderLink(items) {
  if (!items || items.length === 0) return `https://wa.me/${WHATSAPP_NUMBER}`;

  const blocks = items.map((item) => {
    const url = productUrl(item.slug);
    const lineTotal = item.price * item.quantity;

    // "4 productos de Alarma XYZ" en vez de "Alarma XYZ x4" — más fácil de leer
    // cuando el pedido tiene varias unidades del mismo producto.
    const productLabel =
      item.quantity > 1 ? `${item.quantity} productos de ${item.name}` : item.name;

    return [
      `*${productLabel}*`,
      `*Precio:* S/ ${lineTotal.toFixed(2)}`,
      `*URL:* ${url}`,
    ].join("\n");
  });

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const message = [
    "Hola estoy interesado en los siguientes productos:",
    "",
    blocks.join("\n\n"),
    "",
    `*Total: S/ ${total.toFixed(2)}*`,
    "",
    "Gracias!",
  ].join("\n");

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
