// Genera una página por producto en p/<id>/index.html a partir del CATALOG de index.html.
// Uso (desde la raíz del repo): node tools/build-productos.js
// Volver a correrlo cada vez que cambie el catálogo (stock, precios, productos).
const fs = require("fs"), path = require("path");
const root = path.join(__dirname, "..");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const src = html.slice(html.indexOf("const CATALOG = ["), html.indexOf("];", html.indexOf("const CATALOG = [")) + 2);
const CATALOG = new Function(src + "; return CATALOG;")();
const SITE = "https://ziggypyg.github.io/";
const gs = n => "₲" + String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
const esc = t => String(t).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
const ver = Date.now().toString(36);
fs.rmSync(path.join(root, "p"), { recursive: true, force: true });
for (const p of CATALOG) {
  const v = p.vars.find(x => x.stock > 0) || p.vars[0];
  const prices = p.vars.map(x => x.price);
  const precio = p.soon ? "Llega pronto, se puede reservar." : p.vars.some(x => x.stock > 0) ? (Math.min(...prices) === Math.max(...prices) ? gs(prices[0]) : "Desde " + gs(Math.min(...prices))) + "." : "Agotado por ahora.";
  const desc = [p.note, precio, "Pedidos por WhatsApp."].filter(Boolean).join(" ");
  const url = SITE + "p/" + p.id + "/";
  const head = `<title>${esc(p.name)} · Ziggy</title>
<base href="/">
<link rel="canonical" href="${url}">
<meta name="description" content="${esc(desc)}">
<meta property="og:title" content="${esc(p.name)} · Ziggy">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:type" content="product">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${SITE}fotos/${v.photo}.jpg?v=${ver}">
<meta name="twitter:card" content="summary_large_image">`;
  let out = html.replace(/<title>[\s\S]*?<meta name="twitter:card" content="summary_large_image">/, head)
                .replace('<html lang="es">', `<html lang="es" data-product="${p.id}">`);
  fs.mkdirSync(path.join(root, "p", p.id), { recursive: true });
  fs.writeFileSync(path.join(root, "p", p.id, "index.html"), out);
}
console.log(CATALOG.length + " páginas generadas en p/");
