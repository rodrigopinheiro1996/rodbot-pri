// Teste da ponte do Teams: duas abas (Blip falso + Teams falso) no mesmo navegador.
// Uso: node test/ponte.mjs [pasta-de-screenshots]
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import { createServer } from "node:http";
const { chromium } = createRequire(import.meta.url)("playwright");

const raiz = new URL("../", import.meta.url);
const ler = (p) => readFileSync(new URL(p, raiz), "utf8");
const codigo = decodeURIComponent(ler("rodbot-pri.html").match(/href="javascript:([^"]+)"/)[1]);
const ponte = ler("ponte/rodbot-ponte-teams.user.js");
const saida = process.argv[2];
let falhas = 0;
const ok = (c, m) => { console.log(`${c ? "ok  " : "FALHOU"} ${m}`); if (!c) falhas++; };

// Mesmo endereço para as duas páginas: o localStorage faz o papel do GM_setValue.
const servidor = createServer((req, res) => {
  try { res.end(ler("test/" + req.url.slice(1).split("?")[0])); } catch { res.statusCode = 404; res.end(); }
}).listen(0);
const base = `http://localhost:${servidor.address().port}/`;
const shim = (papel) => `window.__rfPonteTeste = { papel: "${papel}", api: {
  ler: (k, d) => { const v = localStorage.getItem("gm_" + k); return v == null ? d : JSON.parse(v); },
  gravar: (k, v) => localStorage.setItem("gm_" + k, JSON.stringify(v)),
  ouvir: (k, fn) => addEventListener("storage", (e) => { if (e.key === "gm_" + k) fn(e.newValue == null ? null : JSON.parse(e.newValue), true); }),
}};`;

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1100, height: 820 }, deviceScaleFactor: saida ? 2 : 1 });
const erro = (e) => { console.log("ERRO NA PÁGINA:", e.message); falhas++; };

const teams = await ctx.newPage();
teams.on("pageerror", erro);
await teams.goto(base + "teams-falso.html");
await teams.evaluate(shim("teams"));
await teams.evaluate(ponte);
await teams.waitForSelector("#rf-ponte-selo", { timeout: 5000 });
await teams.click("#rf-ponte-selo");
ok((await teams.textContent("#rf-ponte-selo")).includes("Ponte ativa"), "teams: selo marca este chat como ativo");
if (saida) await teams.locator("#rf-ponte-selo").screenshot({ path: `${saida}/ponte-selo.png` });

const blip = await ctx.newPage();
blip.on("pageerror", erro);
await blip.goto(base + "blip-falso.html");
await blip.evaluate(() => {
  localStorage.setItem("rf_copiloto_pastas", JSON.stringify([
    { nome: "Financeiro", palavras: ["fatura"] },
    { nome: "Suporte", palavras: ["login"] },
    { nome: "Cancelamento", palavras: ["assinatura"] },
  ]));
  // Confiança mínima alta: o rod bot não sugere sozinho e pergunta ao Teams.
  localStorage.setItem("rf_copiloto_config", JSON.stringify({ limiarProb: 0.999, limiarMargem: 0.5, copilotTeams: true }));
});
await blip.evaluate(shim("blip"));
await blip.evaluate(ponte);
await blip.evaluate(codigo);
await blip.waitForFunction(() => document.querySelector("#rf-copiloto-panel")?.dataset.teamsPulso, null, { timeout: 8000 });
ok(true, "blip: pulso da ponte chega ao painel");

await blip.click("#rf-copiloto-panel .rf-cta");
await blip.waitForSelector("text=Copilot do Teams", { timeout: 8000 });
await blip.waitForSelector('#rf-copiloto-panel .rf-caixa button.rf-bt', { timeout: 15000 });
const pergunta = (await teams.evaluate(() => window.__perguntas))[0];
console.log("   pergunta enviada:", pergunta.slice(0, 150) + "…");
ok(/Financeiro \| Suporte \| Cancelamento/.test(pergunta), "teams: pergunta lista as pastas");
ok((await blip.textContent("#rf-copiloto-panel .rf-caixa")).includes("Financeiro"), "blip: Copilot sugeriu Financeiro (nome casado mesmo em MAIÚSCULAS)");
if (saida) await blip.locator("#rf-copiloto-panel").screenshot({ path: `${saida}/ponte-blip.png` });
await blip.click('#rf-copiloto-panel .rf-caixa button.rf-bt');
await blip.waitForFunction(() => (window.__movidos || []).length === 1, null, { timeout: 8000 });
ok((await blip.evaluate(() => window.__movidos[0][1])) === "Financeiro", "blip: ticket movido para a pasta do Copilot");

await browser.close();
servidor.close();
console.log(falhas ? `${falhas} falha(s)` : "tudo certo");
process.exit(falhas ? 1 : 0);
