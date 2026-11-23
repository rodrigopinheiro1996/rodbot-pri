// Teste visual + ponta a ponta do painel num Blip falso. Uso: node test/painel.mjs [pasta-de-screenshots]
import { createRequire } from "node:module";
const { chromium } = createRequire(import.meta.url)("playwright");
import { readFileSync } from "node:fs";

const raiz = new URL("../", import.meta.url);
const html = readFileSync(new URL("rodbot-pri.html", raiz), "utf8");
const codigo = decodeURIComponent(html.match(/href="javascript:([^"]+)"/)[1]);
const saida = process.argv[2];
const pastas = [
  { nome: "Financeiro", palavras: ["boleto", "fatura", "pagamento"] },
  { nome: "Suporte", palavras: ["senha", "login", "acesso"] },
  { nome: "Cancelamento", palavras: ["cancelar", "cancelamento", "assinatura"] },
];
let falhas = 0;
const ok = (cond, msg) => { console.log(`${cond ? "ok  " : "FALHOU"} ${msg}`); if (!cond) falhas++; };

const browser = await chromium.launch();
async function abrir(config, cadastro = pastas) {
  const page = await browser.newPage({ viewport: { width: 1100, height: 820 }, deviceScaleFactor: saida ? 2 : 1 });
  page.on("pageerror", (e) => { console.log("ERRO NA PÁGINA:", e.message); falhas++; });
  await page.goto(new URL("test/blip-falso.html", raiz).href);
  await page.evaluate(([p, c]) => {
    localStorage.setItem("rf_copiloto_pastas", JSON.stringify(p));
    localStorage.setItem("rf_copiloto_config", JSON.stringify(c));
  }, [cadastro, config]);
  await page.evaluate(codigo);
  return page;
}
const shot = (page, nome) => saida && page.locator("#rf-copiloto-panel").screenshot({ path: `${saida}/${nome}.png` });

// 1) Modo manual: espera Enter.
let page = await abrir({ limiarProb: 0.5, limiarMargem: 0.1 });
await shot(page, "1-parado");
await page.click("#rf-copiloto-panel .rf-cta");
await page.waitForSelector("#rf-copiloto-panel .rf-sug", { timeout: 8000 });
await page.waitForTimeout(2500);
ok(((await page.evaluate(() => window.__movidos)) || []).length === 0, "manual: nada é movido sem Enter");
await shot(page, "2-sugestao");
await page.keyboard.press("Enter");
await page.waitForFunction(() => (window.__movidos || []).length === 1, null, { timeout: 8000 });
ok(true, "manual: Enter move o ticket");
await page.keyboard.press(" ");
await page.click('#rf-copiloto-panel [data-aba="Ajustes"]');
await shot(page, "3-ajustes");
await page.click('#rf-copiloto-panel [data-aba="Pastas"]');
await shot(page, "4-pastas");
await page.close();

// 2) Envio automático: move sozinho acima do limite.
page = await abrir({ limiarProb: 0.5, limiarMargem: 0.1, autoEnviar: true, autoConfianca: 0.5, autoAtrasoMs: 600 });
await page.click("#rf-copiloto-panel .rf-cta");
await page.waitForSelector("#rf-copiloto-panel .rf-auto", { timeout: 8000 });
await shot(page, "5-auto");
await page.waitForFunction(() => (window.__movidos || []).length === 5, null, { timeout: 30000 });
const movidos = await page.evaluate(() => window.__movidos);
console.log("   movidos:", JSON.stringify(movidos));
ok(movidos.length === 5, "auto: os 5 tickets foram movidos sem Enter");
ok(movidos.every(([id, p]) => ({ 101: "Financeiro", 102: "Suporte", 103: "Cancelamento", 104: "Financeiro", 105: "Suporte" })[id] === p), "auto: cada ticket foi para a pasta certa");
await page.waitForSelector("#rf-copiloto-panel .rf-vazio", { timeout: 5000 });
ok((await page.textContent("#rf-copiloto-panel .rf-nums")).includes("5Automáticos"), "auto: contador de automáticos = 5");
const modelo = await page.evaluate(() => JSON.parse(localStorage.getItem("rf_copiloto_modelo")));
ok(!modelo || Object.keys(modelo.contagens).length === 0, "auto: envio automático não altera o aprendizado");
await shot(page, "6-concluido");
await page.close();

// 3) Limite alto: não envia sozinho, espera confirmação.
// Cadastro ambíguo (palavras repetidas entre pastas) deixa a confiança abaixo de 90%.
const ambiguas = [
  { nome: "Financeiro", palavras: ["boleto", "erro"] },
  { nome: "Suporte", palavras: ["erro", "senha"] },
  { nome: "Cancelamento", palavras: ["cancelar"] },
];
page = await abrir({ limiarProb: 0.3, limiarMargem: 0, autoEnviar: true, autoConfianca: 0.9, autoAtrasoMs: 300 }, ambiguas);
await page.click("#rf-copiloto-panel .rf-cta");
await page.waitForSelector("#rf-copiloto-panel .rf-sug", { timeout: 8000 });
await page.waitForTimeout(1500);
const conf = await page.textContent("#rf-copiloto-panel .rf-conf b");
console.log("   confiança mostrada:", conf);
ok(parseInt(conf) < 90, "auto 90%: ticket ficou abaixo do limite");
await shot(page, "7-abaixo-do-limite");
ok(((await page.evaluate(() => window.__movidos)) || []).length === 0, "auto 90%: abaixo do limite espera Enter");
await page.close();

await browser.close();
console.log(falhas ? `${falhas} falha(s)` : "tudo certo");
process.exit(falhas ? 1 : 0);
