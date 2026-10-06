// Atualiza o HTML visível usando o mesmo renderizador e os mesmos dados do site.
// Execute da raiz: node scripts/build-seo.cjs
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
let html = read('index.html');
const nodes = new Map();
for (const match of html.matchAll(/id="([^"]+)"/g)) nodes.set(match[1], { innerHTML: '', textContent: '' });
const context = {
 document: { getElementById(id) { if (!nodes.has(id)) throw new Error(`Missing element: ${id}`); return nodes.get(id); }, querySelectorAll: () => [], documentElement: {} },
 console
};
vm.createContext(context);
const source = read('js/script.js');
const boundary = source.indexOf('document.querySelectorAll("[data-lang]").forEach(button');
if (boundary < 0) throw new Error('Render boundary not found');
vm.runInContext(source.slice(0, boundary), context);
context.portfolioData = JSON.parse(read('js/data/pt-br/data.json'));
vm.runInContext('render(portfolioData, "pt-br")', context);
const ids = ['featured','gallery','skill-cards','all-skills','opportunities','spoken','bio','recent-experience','past-experience','degrees','courses','socials','publications-label','publications-title','publications-intro','publication-cards'];
const escapeText = value => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
for (const id of ids) {
 const node = nodes.get(id);
 const content = node.innerHTML || escapeText(node.textContent);
 const start = `<!-- seo:${id} -->`, end = `<!-- /seo:${id} -->`;
 if (html.includes(start)) {
  const first = html.indexOf(start), last = html.indexOf(end, first);
  if (last < 0) throw new Error(`Missing end marker: ${id}`);
  html = html.slice(0, first) + start + content + end + html.slice(last + end.length);
 } else {
  const regex = new RegExp(`(<(div|ul|p|h2|span) id="${id}"[^>]*>)[\\s\\S]*?(</\\2>)`);
  if (!regex.test(html)) throw new Error(`Cannot find container: ${id}`);
  html = html.replace(regex, (_, opening, tag, closing) => opening + start + content + end + closing);
 }
}
fs.writeFileSync(path.join(root, 'index.html'), html);
console.log(`HTML atualizado: ${ids.length} blocos disponíveis sem JavaScript.`);
