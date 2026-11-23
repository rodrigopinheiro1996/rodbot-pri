// Gera rodbot-pri.html: minifica src/rodbot-copiloto.js e injeta como favorito (bookmarklet).
import { readFileSync, writeFileSync } from "node:fs";
import { transformSync } from "esbuild";

const raiz = new URL("../", import.meta.url);
const pkg = JSON.parse(readFileSync(new URL("package.json", raiz), "utf8"));
const fonte = readFileSync(new URL("src/rodbot-copiloto.js", raiz), "utf8");
const { code } = transformSync(fonte, { minify: true, target: "es2020", charset: "utf8" });
const href = "javascript:" + encodeURIComponent(code.trim());

const modelo = readFileSync(new URL("src/instalar.html", raiz), "utf8");
const saida = modelo
  .replace("{{VERSAO}}", pkg.version)
  .replace("{{BOOKMARKLET}}", href.replace(/"/g, "%22"));
writeFileSync(new URL("rodbot-pri.html", raiz), saida);
console.log(`rodbot-pri.html gerado (v${pkg.version}, favorito com ${href.length} caracteres)`);
