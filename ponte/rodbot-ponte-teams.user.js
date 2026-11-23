// ==UserScript==
// @name         rod bot — ponte Copilot do Teams
// @namespace    rodbot-pri
// @version      0.2.0
// @description  Liga o rod bot copiloto (Blip) ao Copilot do Teams aberto em outra aba do mesmo navegador (Edge ou Chrome).
// @match        https://*.desk.blip.ai/*
// @match        https://teams.microsoft.com/*
// @match        https://teams.cloud.microsoft/*
// @match        https://m365.cloud.microsoft/*
// @match        https://copilot.cloud.microsoft/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addValueChangeListener
// @run-at       document-idle
// ==/UserScript==

(function () {
  "use strict";

  // ---------------------------------------------------------------------------
  // Ajustes. Se o Teams mudar o layout, normalmente basta corrigir os seletores.
  // ---------------------------------------------------------------------------
  const CONFIG = {
    // Caixa de digitação do chat com o Copilot.
    seletorCaixa: [
      '[data-tid="ckeditor"][contenteditable="true"]',
      '[role="textbox"][contenteditable="true"]',
      'div[contenteditable="true"][aria-label]',
      "textarea",
    ],
    // Botão de enviar. Se nenhum for achado, a ponte aperta Enter na caixa.
    seletorEnviar: [
      'button[data-tid="newMessageCommands-send"]',
      'button[aria-label^="Enviar"]',
      'button[aria-label^="Send"]',
      'button[title^="Enviar"]',
      'button[type="submit"]',
    ],
    tempoMaxRespostaMs: 50000, // o rod bot desiste em 55 s
    pulsoMs: 2000, // a cada quanto o Blip pergunta "a ponte está viva?"
    vivoAteMs: 9000, // sem resposta do Teams nesse tempo = ponte fora
  };

  const PAINEL = "#rf-copiloto-panel";
  const K = { ping: "rf_ping", pong: "rf_pong", pedido: "rf_pedido", resposta: "rf_resposta", alvo: "rf_alvo" };

  // Armazenamento compartilhado entre abas (GM_* do Tampermonkey/Violentmonkey).
  // Nos testes, window.__rfPonteTeste fornece uma versão falsa.
  const teste = window.__rfPonteTeste;
  const api = teste?.api || {
    ler: (k, padrao) => GM_getValue(k, padrao),
    gravar: (k, v) => GM_setValue(k, v),
    ouvir: (k, fn) => GM_addValueChangeListener(k, (_n, _a, novo, remoto) => fn(novo, remoto)),
  };
  const papel = teste?.papel || (/\.desk\.blip\.ai$/.test(location.hostname) ? "blip" : "teams");

  const espera = (ms) => new Promise((r) => setTimeout(r, ms));
  const normal = (s) =>
    String(s || "")
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      .replace(/\s+/g, " ")
      .trim();

  papel === "blip" ? ladoBlip() : ladoTeams();

  // ===========================================================================
  // Aba do Blip: conversa com o painel do rod bot pelos atributos data-teams-*.
  // ===========================================================================
  function ladoBlip() {
    let ultimoPong = 0;
    let pedidoAtual = null;

    api.ouvir(K.pong, (v) => {
      ultimoPong = Date.now();
      void v;
    });
    api.ouvir(K.resposta, (v) => {
      const painel = document.querySelector(PAINEL);
      if (!painel || !v || !pedidoAtual || v.id !== pedidoAtual) return;
      painel.dataset.teamsResposta = JSON.stringify(v);
    });

    setInterval(() => {
      api.gravar(K.ping, Date.now());
      const painel = document.querySelector(PAINEL);
      if (!painel) return;
      painel.dataset.teamsPonte = "0.2.0"; // avisa o painel que a ponte está instalada nesta aba
      if (Date.now() - ultimoPong < CONFIG.vivoAteMs) painel.dataset.teamsPulso = String(Date.now());
    }, CONFIG.pulsoMs);

    // O painel escreve o pedido em data-teams-pedido; repassamos para a aba do Teams.
    setInterval(() => {
      const painel = document.querySelector(PAINEL);
      const bruto = painel?.dataset.teamsPedido;
      if (!bruto) return;
      let pedido;
      try {
        pedido = JSON.parse(bruto);
      } catch {
        return;
      }
      if (!pedido?.id || pedido.id === pedidoAtual || Date.now() > pedido.expira) return;
      pedidoAtual = pedido.id;
      painel.dataset.teamsEmConsulta = "1";
      api.gravar(K.pedido, pedido);
    }, 250);
  }

  // ===========================================================================
  // Aba do Teams: digita a pergunta no chat do Copilot e devolve a resposta.
  // ===========================================================================
  function ladoTeams() {
    const meuId = Math.random().toString(36).slice(2, 10);
    const souAlvo = () => api.ler(K.alvo, null) === meuId;
    let ocupado = false;

    const selo = document.createElement("button");
    selo.type = "button";
    selo.id = "rf-ponte-selo";
    selo.style.cssText =
      "position:fixed;left:12px;bottom:12px;z-index:2147483647;display:flex;align-items:center;gap:8px;" +
      "padding:7px 12px 7px 8px;border-radius:999px;border:1px solid rgba(255,255,255,.14);" +
      "background:rgba(15,18,22,.94);color:#f1f5f9;font:600 12px/1.2 Inter,-apple-system,'Segoe UI',sans-serif;" +
      "cursor:pointer;box-shadow:0 8px 24px rgba(0,0,0,.35)";
    const desenhar = () => {
      const ativo = souAlvo();
      const semCaixa = ativo && !acharCaixa();
      selo.innerHTML =
        `<span style="width:22px;height:22px;border-radius:7px;display:grid;place-items:center;` +
        `background:rgba(137,243,54,.12);border:1px solid rgba(137,243,54,.34);color:#89f336;font-weight:800;font-size:10px">rb</span>` +
        (semCaixa
          ? `<span><span style="color:#fbbf24">●</span> Ponte ativa — abra o chat do Copilot</span>`
          : ativo
          ? `<span><span style="color:#89f336">●</span> Ponte ativa neste chat</span>`
          : `<span style="color:#8c97a9">Usar este chat para o rod bot</span>`);
      selo.title = ativo
        ? "As perguntas do rod bot serão feitas neste chat. Clique para desligar."
        : "Abra o chat do Copilot e clique aqui.";
    };
    selo.addEventListener("click", () => {
      api.gravar(K.alvo, souAlvo() ? null : meuId);
      desenhar();
    });
    // Na janela principal o selo aparece sempre; em iframes, só onde há caixa de digitação.
    const principal = window.top === window;
    const mostrarSelo = () => {
      if (!selo.isConnected && document.body && (principal || acharCaixa())) document.body.appendChild(selo);
      if (selo.isConnected) desenhar();
    };
    setInterval(mostrarSelo, 1500);
    api.ouvir(K.alvo, desenhar);

    // Responde ao "ping" do Blip com um evento (não depende de timer, então
    // funciona mesmo com a aba do Teams em segundo plano).
    api.ouvir(K.ping, (v) => {
      if (souAlvo()) api.gravar(K.pong, { de: meuId, em: v });
    });

    api.ouvir(K.pedido, async (pedido) => {
      if (!souAlvo() || ocupado || !pedido?.id || Date.now() > pedido.expira) return;
      ocupado = true;
      try {
        const resposta = await perguntar(pedido);
        if (resposta) api.gravar(K.resposta, { id: pedido.id, ...resposta });
      } catch (e) {
        console.warn("[rod bot ponte]", e);
      } finally {
        ocupado = false;
      }
    });

    function acharCaixa() {
      for (const s of CONFIG.seletorCaixa) {
        const el = [...document.querySelectorAll(s)].find((e) => e.offsetParent !== null);
        if (el) return el;
      }
      return null;
    }

    function montarPergunta(p) {
      const marca = p.id.slice(0, 8);
      const linhas = [
        `[rod bot ${marca}] Classifique este atendimento em UMA das pastas: ${p.pastas.join(" | ")}.`,
        p.motivo ? `Motivo: ${p.motivo}.` : "",
        p.mensagens?.length ? `Mensagens do cliente: ${p.mensagens.map((m) => `"${m}"`).join(" ; ")}.` : "",
        `Responda apenas com JSON, sem texto extra: {"id":"${marca}","pasta":"NOME_DA_PASTA","palavrasChave":["palavra1","palavra2"]}`,
      ];
      return { marca, texto: linhas.filter(Boolean).join(" ") };
    }

    async function digitar(caixa, texto) {
      caixa.focus();
      if (caixa.tagName === "TEXTAREA") {
        const set = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, "value").set;
        set.call(caixa, texto);
        caixa.dispatchEvent(new Event("input", { bubbles: true }));
      } else {
        document.execCommand("selectAll", false);
        document.execCommand("delete", false);
        document.execCommand("insertText", false, texto);
      }
      await espera(300);
      const botao = CONFIG.seletorEnviar
        .map((s) => document.querySelector(s))
        .find((b) => b && !b.disabled && b.offsetParent !== null);
      if (botao) botao.click();
      else
        for (const tipo of ["keydown", "keypress", "keyup"])
          caixa.dispatchEvent(
            new KeyboardEvent(tipo, { key: "Enter", code: "Enter", keyCode: 13, which: 13, bubbles: true }),
          );
    }

    // Procura no texto da página um JSON com a nossa marca e uma pasta válida.
    function lerResposta(marca, pastas) {
      const texto = document.body.innerText;
      const porNome = new Map(pastas.map((n) => [normal(n), n]));
      const re = /\{[^{}]*\}/g;
      let achado = null;
      for (const m of texto.matchAll(re)) {
        let j;
        try {
          j = JSON.parse(m[0].replace(/[“”]/g, '"'));
        } catch {
          continue;
        }
        if (j?.id !== marca) continue;
        const pasta = porNome.get(normal(j.pasta));
        if (!pasta) continue; // ignora o modelo da própria pergunta ("NOME_DA_PASTA")
        achado = {
          pasta,
          palavrasChave: Array.isArray(j.palavrasChave) ? j.palavrasChave.filter((s) => typeof s === "string") : [],
        };
      }
      return achado;
    }

    async function perguntar(pedido) {
      const caixa = acharCaixa();
      if (!caixa) return null;
      const { marca, texto } = montarPergunta(pedido);
      await digitar(caixa, texto);

      // Espera a resposta estabilizar (o Copilot escreve aos poucos). Usa
      // MutationObserver para não depender de timers em aba de segundo plano.
      return new Promise((resolve) => {
        let ultimo = null;
        let estavel = null;
        const limite = Math.min(pedido.expira - 2000, Date.now() + CONFIG.tempoMaxRespostaMs);
        const fim = (v) => {
          obs.disconnect();
          clearTimeout(estavel);
          clearInterval(relogio);
          resolve(v);
        };
        const checar = () => {
          if (Date.now() > limite) return fim(null);
          const r = lerResposta(marca, pedido.pastas);
          if (!r) return;
          const chave = JSON.stringify(r);
          if (chave !== ultimo) {
            ultimo = chave;
            clearTimeout(estavel);
            estavel = setTimeout(() => fim(r), 1200);
          }
        };
        const obs = new MutationObserver(checar);
        obs.observe(document.body, { childList: true, subtree: true, characterData: true });
        const relogio = setInterval(checar, 1000);
      });
    }
  }
})();
