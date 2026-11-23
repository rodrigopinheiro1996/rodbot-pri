(() => {
  var dt = {
    padroes: [
      "tempo de espera",
      "realizamos uma nova atualizacao no seu aplicativo",
    ],
  };
  var g = {
    painelChat: "#pane-chat-div",
    ticketAberto: '#pane-chat-div [id="ticket-sequential-id"]',
    campoTexto: "#text-input",
    segmentos: '[data-testid="message-list-segments"]',
    grupo: ".blip-message-group",
    cardGrupo: ".blip-card-group",
    bolha: ".bubble > div",
    textoSimples: ".plain-text",
    divisor: ".blip-container.ticket",
    resumoCorpo: "#widget-copilot-summary-body",
    resumoSentimento: "bds-paper.sentiment",
    resumoItem: ".summary-itens",
    abrirResumo: ".icon-worker",
    cardTicket: "article.chat-list-item",
    menuTicket: 'button.ticket-info-options[id^="menu-"]',
    listaPastas: ".folder-list",
    menu: "bds-menu",
    acaoMenu: "bds-menu-action",
    submenuPastas: ".folder-submenu-container",
    itemPasta: ".custom-submenu-item",
    nomePasta: ".sub-menu",
    painelRodBot: "#blip-auto-panel",
    painelProprio: "#rf-copiloto-panel",
  };
  var H = (e) => new Promise((o) => setTimeout(o, e));
  async function O(e, o, t = 100) {
    let a = Date.now() + o;
    for (;;) {
      let r = null;
      try {
        r = e();
      } catch {
        r = null;
      }
      if (r) return r;
      if (Date.now() >= a) return null;
      await H(t);
    }
  }
  function X(e) {
    if (!e) return;
    let o = e.ownerDocument?.defaultView || globalThis,
      t = o.PointerEvent || o.MouseEvent,
      a = { bubbles: !0, cancelable: !0, composed: !0, view: o };
    try {
      e.focus?.();
    } catch {}
    for (let [r, n] of [
      [t, "pointerover"],
      [o.MouseEvent, "mouseover"],
      [t, "pointerdown"],
      [o.MouseEvent, "mousedown"],
      [t, "pointerup"],
      [o.MouseEvent, "mouseup"],
    ])
      try {
        e.dispatchEvent(new r(n, a));
      } catch {}
    e.click();
  }
  function _(e) {
    return (e?.textContent || "").replace(/\s+/g, " ").trim();
  }
  function J(e = document) {
    let o = e.querySelector(g.ticketAberto),
      t = o ? (o.textContent || "").match(/\d+/g) : null;
    return t ? t[t.length - 1] : null;
  }
  function G(e = document) {
    return [...e.querySelectorAll(g.menuTicket)]
      .filter((o) => !o.closest(g.listaPastas) && !o.closest(g.painelProprio))
      .map((o) => o.id.slice(5).trim())
      .filter(Boolean);
  }
  function gt(e, o = document) {
    let t = o.getElementById(`menu-${e}`);
    return t ? t.closest(g.cardTicket) : null;
  }
  var ie = new Set([
      "que",
      "para",
      "com",
      "uma",
      "por",
      "dos",
      "das",
      "nos",
      "nas",
      "mais",
      "como",
      "mas",
      "foi",
      "ser",
      "tem",
      "ter",
      "esta",
      "estou",
      "isso",
      "esse",
      "essa",
      "ele",
      "ela",
      "meu",
      "minha",
      "seu",
      "sua",
      "voce",
      "pra",
      "pro",
      "quando",
      "onde",
      "qual",
      "porque",
      "pois",
      "sim",
      "nao",
      "bom",
      "boa",
      "dia",
      "tarde",
      "noite",
      "ola",
      "obrigado",
      "obrigada",
      "favor",
      "gostaria",
      "queria",
      "quero",
      "preciso",
      "sobre",
      "ainda",
      "tambem",
      "aqui",
      "entao",
      "fazer",
      "feito",
      "pode",
      "poderia",
      "vou",
      "vai",
      "estava",
      "muito",
      "num",
      "numa",
      "pelo",
      "pela",
      "nem",
    ]),
    ce = [
      /[\w.+-]+@[\w-]+(\.[\w-]+)+/g,
      /\d{3}\.?\d{3}\.?\d{3}-?\d{2}/g,
      /(\+?55\s?)?\(?\d{2}\)?\s?9?\d{4}[-\s]?\d{4}/g,
      /\d+/g,
    ];
  function F(e) {
    return (e || "").normalize("NFD").replace(/[̀-ͯ]/g, "");
  }
  function le(e) {
    let o = e || "";
    for (let t of ce) o = o.replace(t, " ");
    return o;
  }
  function I(e) {
    return F(le(e))
      .toLowerCase()
      .replace(/[^a-z\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }
  function Z(e) {
    let o = I(e);
    return o ? o.split(" ").filter((t) => t.length >= 3 && !ie.has(t)) : [];
  }
  function vt(e) {
    let o = [];
    for (let t = 0; t < e.length - 1; t++) o.push(`${e[t]}_${e[t + 1]}`);
    return o;
  }
  var ue = {
      "motivo do contato": "motivo",
      "nos ultimos 30 dias": "ultimos30",
      "motivos dos contatos": "motivosAnteriores",
    },
    pe = { positive: "positivo", neutral: "neutro", negative: "negativo" },
    me = (e) => F(_(e)).toLowerCase().replace(/:\s*$/, "").trim();
  function bt(e = document) {
    let o = e.querySelector(g.resumoCorpo);
    if (!o) return null;
    let t = {
        sentimento: null,
        motivo: null,
        ultimos30: null,
        motivosAnteriores: null,
      },
      a = o.querySelector(g.resumoSentimento),
      r = a ? [...a.classList].find((n) => n.startsWith("sentiment-")) : null;
    r && (t.sentimento = pe[r.slice(10)] || null);
    for (let n of o.querySelectorAll(g.resumoItem)) {
      let s = n.querySelector("b");
      if (!s) continue;
      let u = ue[me(s)];
      if (!u) continue;
      let f = _(n),
        m = _(s),
        d = f.startsWith(m) ? f.slice(m.length).trim() : f;
      t[u] = d || null;
    }
    return t;
  }
  async function ht(e, o) {
    if (e.querySelector(g.resumoCorpo)) return !0;
    let t = e.querySelector(g.abrirResumo);
    return t && X(t), !!(await O(() => e.querySelector(g.resumoCorpo), o));
  }
  function fe(e) {
    let o = [...e.querySelectorAll(".blip-container")]
      .map((t) => t.className)
      .join(" ")
      .toLowerCase();
    return /audio/.test(o)
      ? "audio"
      : /image|img|photo|video/.test(o)
        ? "imagem"
        : "documento";
  }
  function xt(e = document) {
    let o = e.querySelector(g.segmentos);
    if (!o) return [];
    let t = [...o.querySelectorAll(g.grupo)],
      a = -1;
    t.forEach((n, s) => {
      n.querySelector(g.divisor) && (a = s);
    });
    let r = [];
    return (
      t.forEach((n, s) => {
        if (n.querySelector(g.divisor)) return;
        let u = n.querySelector(g.cardGrupo);
        if (!u) return;
        let f = n.querySelector(g.bolha),
          m = !!n.querySelector(g.textoSimples);
        r.push({
          lado: u.classList.contains("left") ? "cliente" : "atendente",
          texto: f ? _(f) : "",
          midia: m ? null : fe(n),
          antesDoDivisor: a >= 0 && s < a,
        });
      }),
      r
    );
  }
  function N(e) {
    return F(e || "")
      .toLowerCase()
      .replace(/\s*\(\d+\)\s*$/, "")
      .replace(/\s+\d+\s*$/, "")
      .replace(/\s+/g, " ")
      .trim();
  }
  function yt(e) {
    return (e || "")
      .split(",")
      .map((o) => o.trim())
      .filter(Boolean);
  }
  function kt(e, o) {
    let t = (e.nome || "").trim();
    return t
      ? o.some((a) => N(a.nome) === N(t))
        ? { ok: !1, erro: "Essa pasta já está cadastrada." }
        : { ok: !0 }
      : { ok: !1, erro: "Digite o nome da pasta como aparece no Blip." };
  }
  function Tt(e, o) {
    let t = new Set(o.map(N));
    return Object.fromEntries(e.map((a) => [a.nome, t.has(N(a.nome))]));
  }
  function St(e, o, t = 9) {
    return e.filter((a) => a.nome !== o).slice(0, t);
  }
  function wt(e, o, t) {
    let a = e.find((n) => n.nome === o);
    if (!a) return { ok: !1, erro: `A pasta ${o} não está mais cadastrada.` };
    let r = I(t);
    return a.palavras.some((n) => I(n) === r)
      ? { ok: !1, erro: `Essa palavra já está na pasta ${o}.` }
      : {
          ok: !0,
          pastas: e.map((n) =>
            n === a ? { ...n, palavras: [...n.palavras, t.trim()] } : n,
          ),
        };
  }
  function Pt(e, o, t) {
    return e.map((a) =>
      a.nome === o ? { ...a, palavras: a.palavras.filter((r) => r !== t) } : a,
    );
  }
  var Y = (e) =>
    F(e || "")
      .toLowerCase()
      .trim();
  function at(e, o) {
    let t = e.ownerDocument.defaultView;
    for (let a of o) {
      let r = (a.startsWith("pointer") && t.PointerEvent) || t.MouseEvent;
      try {
        e.dispatchEvent(new r(a, { bubbles: !0, composed: !0 }));
      } catch {}
    }
  }
  var Ct = (e, o) => {
    let t = e.closest(g.cardTicket);
    return !t || t === o;
  };
  function de(e, o, t) {
    let a = [
      e?.querySelector(g.menu),
      e,
      o.querySelector("div.ticket-menu.visible bds-menu"),
      o.querySelector("bds-menu[open]"),
    ].filter((r) => r && Ct(r, t));
    for (let r of a)
      for (let n of r.querySelectorAll(g.acaoMenu)) {
        let s = Y(n.getAttribute("button-text")),
          u = Y(n.getAttribute("subtitle")),
          f = Y(n.getAttribute("icon-left"));
        if (s.includes("mover para") || (f === "folder" && u.includes("pasta")))
          return n;
      }
    return null;
  }
  function ge(e, o, t) {
    let a = [
        e.querySelector(g.submenuPastas),
        ...o.querySelectorAll(g.submenuPastas),
      ].filter((s) => s && Ct(s, t)),
      r = new Set(),
      n = [];
    for (let s of a)
      for (let u of s.querySelectorAll(g.itemPasta)) {
        if (r.has(u)) continue;
        r.add(u);
        let f = _(u.querySelector(g.nomePasta) || u);
        f && n.push({ item: u, nome: f });
      }
    return n;
  }
  function Et(e) {
    let o = e?.querySelector(g.menu);
    return !!o && (o.open === !0 || o.hasAttribute("open"));
  }
  async function W(e, o, t) {
    let a = e?.querySelector(g.menu);
    a && typeof a.open == "boolean" && (a.open = !1);
    let r = t.defaultView;
    t.dispatchEvent(
      new r.KeyboardEvent("keydown", {
        key: "Escape",
        code: "Escape",
        bubbles: !0,
      }),
    ),
      await H(150),
      Et(e) && (o.click(), await H(150));
  }
  async function At(e, o) {
    let t = o.getElementById(`menu-${e}`);
    if (!t) return null;
    let a = t.closest(".ticket-menu") || t.parentElement,
      r = t.closest(g.cardTicket);
    r && at(r, ["mouseenter", "mouseover"]), t.click();
    let n = await O(() => de(a, o, r), 3500);
    if (!n) return await W(a, t, o), null;
    at(n, ["pointerenter", "mouseenter", "mouseover"]);
    let s = n.shadowRoot?.querySelector("button.menuaction__button, button");
    s && at(s, ["pointerenter", "mouseenter", "mouseover"]);
    let u = await O(() => {
      let f = ge(n, o, r);
      return f.length ? f : null;
    }, 2800);
    return { botao: t, wrap: a, itens: u || [] };
  }
  async function $t(e, o = document) {
    let t = await At(e, o);
    return t ? (await W(t.wrap, t.botao, o), t.itens.map((a) => a.nome)) : null;
  }
  async function qt(e, o, t = document, a = 5e3) {
    let r = await At(e, t);
    if (!r) return { status: "menu_indisponivel", pastasVistas: [] };
    let n = (h) =>
        Y(h)
          .replace(/\s*\(\d+\)\s*$/, "")
          .replace(/\s+/g, " ")
          .trim(),
      s = r.itens.filter((h) => n(h.nome) === n(o)),
      u = r.itens.filter((h) => N(h.nome) === N(o)),
      f = s.length === 1 ? s : u;
    if (f.length > 1)
      return (
        await W(r.wrap, r.botao, t),
        { status: "pasta_ambigua", pastasVistas: f.map((h) => h.nome) }
      );
    let m = f[0];
    if (!m)
      return (
        await W(r.wrap, r.botao, t),
        {
          status: "pasta_nao_encontrada",
          pastasVistas: r.itens.map((h) => h.nome),
        }
      );
    X(m.item);
    let d = await O(() => !G(t).includes(e), a);
    return (
      Et(r.wrap) && (await W(r.wrap, r.botao, t)),
      { status: d ? "movido" : "nao_confirmado", pastasVistas: [] }
    );
  }
  var ve = (e) => String(e.value ?? e.textContent ?? "").trim() === "",
    be = (e) =>
      !!(
        typeof e.composedPath == "function" ? e.composedPath()[0] : e.target
      )?.closest?.(g.campoTexto);
  function Mt(e = document, { janelaMs: o = 1500, intervaloMs: t = 100 } = {}) {
    let a = !0,
      r = { id: null },
      n = () => {
        (a = !1), clearInterval(r.id);
        for (let m of ["mousedown", "keydown", "input"])
          e.removeEventListener(m, s, !0);
      },
      s = (m) => {
        be(m) && n();
      },
      u = () => {
        let m = e.querySelector(g.campoTexto);
        m && e.activeElement === m && ve(m) && m.blur();
      };
    for (let m of ["mousedown", "keydown", "input"])
      e.addEventListener(m, s, !0);
    let f = Date.now() + o;
    return (
      u(),
      (r.id = setInterval(() => {
        if (a) {
          if (Date.now() >= f) {
            n();
            return;
          }
          u();
        }
      }, t)),
      n
    );
  }
  function Rt(e, o = document) {
    return G(o).find((t) => !e.has(t)) || null;
  }
  async function Dt(e, o, t) {
    if (J(o) !== e) {
      let s = gt(e, o);
      if (!s) return "card_ausente";
      s.click();
    }
    if (!(await O(() => J(o) === e, t.cabecalho))) return "timeout_cabecalho";
    let a = new RegExp(`#${e}(?![0-9])`);
    return (await O(
      () =>
        [...o.querySelectorAll(`${g.segmentos} ${g.divisor}`)].some((s) =>
          a.test(_(s)),
        ),
      Math.min(2e3, t.mensagens),
    )) ||
      (await O(() => o.querySelector(`${g.segmentos} ${g.grupo}`), t.mensagens))
      ? "ok"
      : "timeout_mensagens";
  }
  function Lt(e = document) {
    let o = e.querySelectorAll(g.cardTicket),
      t = o[o.length - 1];
    if (t) {
      t.scrollIntoView?.({ block: "end" });
      for (let a = t.parentElement; a && a !== e.body; a = a.parentElement)
        if (a.scrollHeight > a.clientHeight) {
          (a.scrollTop += Math.max(300, Math.floor(a.clientHeight * 0.8))),
            a.dispatchEvent(new e.defaultView.Event("scroll", { bubbles: !0 }));
          break;
        }
    }
  }
  function jt(e = document) {
    let o = [];
    return (
      e.querySelector(g.painelChat) ||
        o.push("painel do chat (#pane-chat-div)"),
      e.querySelector(g.campoTexto) || o.push("campo de texto (#text-input)"),
      !e.querySelector(g.menuTicket) &&
        !e.querySelector(g.cardTicket) &&
        o.push("lista de tickets"),
      o
    );
  }
  var rt = "rf_copiloto_",
    j = {
      pastas: "pastas",
      modelo: "modelo",
      config: "config",
      registro: "registro",
    };
  function zt(e = globalThis.localStorage) {
    return {
      ler(o, t) {
        try {
          let a = e.getItem(rt + o);
          return a == null ? t : JSON.parse(a);
        } catch {
          return t;
        }
      },
      gravar(o, t) {
        try {
          return e.setItem(rt + o, JSON.stringify(t)), !0;
        } catch {
          return !1;
        }
      },
      remover(o) {
        try {
          e.removeItem(rt + o);
        } catch {}
      },
    };
  }
  var Q = {
    limiarProb: 0.6,
    limiarMargem: 0.2,
    copilotTeams: !1,
    pesos: { motivo: 3, cliente: 1, anteriores: 0.5 },
    pseudoContagem: 5,
    alfa: 1,
    suporteMinimo: 3,
    maxMensagens: 30,
    maxAntesDivisor: 10,
    maxRegistro: 5e3,
    esperas: { cabecalho: 8e3, mensagens: 8e3, resumo: 5e3, mover: 5e3 },
    maxFalhasSeguidas: 3,
    autoEnviar: !1,
    autoConfianca: 0.9,
    autoAtrasoMs: 1500,
  };
  function nt(e) {
    let o = e && typeof e == "object" ? e : {};
    return {
      ...Q,
      ...o,
      pesos: { ...Q.pesos, ...(o.pesos || {}) },
      esperas: { ...Q.esperas, ...(o.esperas || {}) },
      autoEnviar: o.autoEnviar === !0,
      autoConfianca: Number.isFinite(Number(o.autoConfianca))
        ? Math.min(0.99, Math.max(0.5, Number(o.autoConfianca)))
        : Q.autoConfianca,
      autoAtrasoMs: Number.isFinite(Number(o.autoAtrasoMs))
        ? Math.min(1e4, Math.max(0, Number(o.autoAtrasoMs)))
        : Q.autoAtrasoMs,
    };
  }
  function st() {
    return { versao: 1, contagens: {}, totais: {}, suporte: {} };
  }
  function it(e) {
    return (
      !!e &&
      e.versao === 1 &&
      typeof e.contagens == "object" &&
      e.contagens !== null &&
      typeof e.totais == "object" &&
      e.totais !== null &&
      typeof e.suporte == "object" &&
      e.suporte !== null
    );
  }
  var Ot = [
    "data",
    "ticketHash",
    "sugerida",
    "confianca",
    "final",
    "acao",
    "fonte",
    "temResumo",
    "palpite",
    "sugeridaTeams",
  ];
  function tt({
    ticketHash: e,
    sugerida: o = null,
    confianca: t = null,
    final: a = null,
    acao: r,
    temResumo: n,
    palpite: s = null,
    fonte: u = "local",
    sugeridaTeams: f = null,
    data: m = new Date().toISOString(),
  }) {
    return {
      data: m,
      ticketHash: e,
      sugerida: o,
      confianca: t == null ? null : Math.round(t * 100) / 100,
      final: a,
      acao: r,
      fonte: u,
      temResumo: !!n,
      palpite: s,
      sugeridaTeams: f,
    };
  }
  function _t(e, o, t) {
    let a = [...e, o];
    return a.length > t ? a.slice(a.length - t) : a;
  }
  function ct(e) {
    let o = {};
    for (let t of e) {
      if (
        !t ||
        typeof t != "object" ||
        !t.sugerida ||
        (t.acao !== "confirmou" && t.acao !== "corrigiu")
      )
        continue;
      let a =
        o[t.sugerida] ||
        (o[t.sugerida] = {
          sugeridas: 0,
          confirmadas: 0,
          corrigidas: 0,
          acerto: null,
        });
      a.sugeridas++, t.acao === "confirmou" ? a.confirmadas++ : a.corrigidas++;
    }
    for (let t of Object.values(o))
      t.acerto = t.sugeridas ? t.confirmadas / t.sugeridas : null;
    return o;
  }
  function lt(e) {
    let o = 0,
      t = 0;
    for (let a of e)
      !a ||
        typeof a != "object" ||
        !a.palpite ||
        a.acao !== "escolheu" ||
        a.fonte === "copilot_teams" ||
        (t++, a.final === a.palpite && o++);
    return { certos: o, total: t, acerto: t ? o / t : null };
  }
  function ut(e) {
    let o = 0,
      t = 0;
    for (let a of e)
      !a ||
        typeof a != "object" ||
        !a.sugeridaTeams ||
        !a.final ||
        (t++, a.final === a.sugeridaTeams && o++);
    return { concordou: o, total: t, acerto: t ? o / t : null };
  }
  function Nt(e) {
    let o = (t) => {
      let a = t == null ? "" : String(t);
      return /[;"\n]/.test(a) ? `"${a.replace(/"/g, '""')}"` : a;
    };
    return [
      Ot.join(";"),
      ...e
        .filter((t) => t && typeof t == "object")
        .map((t) => Ot.map((a) => o(t[a])).join(";")),
    ].join(`
`);
  }
  var It = `
#P{--bg:rgba(15,18,22,.97);--elev:rgba(255,255,255,.035);--card:rgba(255,255,255,.05);--line:rgba(255,255,255,.08);--line2:rgba(255,255,255,.14);--tx:#f1f5f9;--mu:#8c97a9;--ac:#89f336;--on:#0a0f08;--acd:rgba(137,243,54,.12);--acb:rgba(137,243,54,.34);--wn:#fbbf24;--wnd:rgba(251,191,36,.12);--er:#f87171;--erd:rgba(248,113,113,.12);position:fixed;top:72px;right:16px;width:352px;max-height:calc(100vh - 88px);display:flex;flex-direction:column;z-index:2147483000;background:var(--bg);color:var(--tx);border:1px solid var(--line2);border-radius:18px;font:13px/1.45 Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif;box-shadow:0 24px 60px rgba(0,0,0,.55),0 0 0 1px rgba(255,255,255,.02);backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);-webkit-font-smoothing:antialiased;text-align:left}
#P *{box-sizing:border-box;margin:0;padding:0;font-family:inherit;letter-spacing:normal}
#P button{font:inherit;color:inherit;background:none;border:0;cursor:pointer}
#P button:focus-visible,#P input:focus-visible{outline:2px solid var(--acb);outline-offset:2px}
#P .rf-cab{display:flex;align-items:center;gap:10px;padding:14px 14px 12px;cursor:grab;user-select:none}
#P .rf-cab:active{cursor:grabbing}
#P .rf-marca{width:30px;height:30px;flex:none;border-radius:9px;display:grid;place-items:center;background:var(--acd);border:1px solid var(--acb);color:var(--ac);font-weight:800;font-size:12px;letter-spacing:-.04em}
#P .rf-nome{flex:1;min-width:0;line-height:1.2}
#P .rf-nome b{display:block;font-size:14px;font-weight:700;letter-spacing:-.01em}
#P .rf-nome span{font-size:11.5px;color:var(--mu)}
#P .rf-pill{display:inline-flex;align-items:center;gap:6px;padding:4px 9px;border-radius:999px;font-size:11px;font-weight:600;color:var(--mu);background:var(--elev);border:1px solid var(--line);white-space:nowrap}
#P .rf-pill::before{content:"";width:6px;height:6px;border-radius:50%;background:currentColor;opacity:.8}
#P .rf-pill[data-estado="rodando"]{color:var(--ac);background:var(--acd);border-color:var(--acb)}
#P .rf-pill[data-estado="rodando"]::before{animation:rf-pulso 1.4s ease-in-out infinite}
#P .rf-x{width:28px;height:28px;flex:none;border-radius:8px;display:grid;place-items:center;color:var(--mu);font-size:16px;line-height:1}
#P .rf-x:hover{background:var(--erd);color:var(--er)}
#P .rf-abas{display:flex;gap:2px;margin:0 14px;padding:3px;border-radius:11px;background:var(--elev);border:1px solid var(--line)}
#P .rf-aba{flex:1;padding:6px 4px;border-radius:8px;font-size:12.5px;font-weight:600;color:var(--mu);transition:background .15s,color .15s}
#P .rf-aba:hover{color:var(--tx)}
#P .rf-aba.on{background:var(--card);color:var(--tx);box-shadow:0 1px 2px rgba(0,0,0,.3),inset 0 0 0 1px var(--line)}
#P .rf-corpo{flex:1;min-height:0;overflow:auto;padding:14px}
#P .rf-corpo::-webkit-scrollbar{width:5px}
#P .rf-corpo::-webkit-scrollbar-thumb{background:var(--line2);border-radius:99px}
#P .rf-rodape{padding:12px 14px 14px;border-top:1px solid var(--line)}
#P .rf-cta{width:100%;padding:11px 14px;border-radius:12px;background:var(--ac);color:var(--on);font-weight:700;font-size:13.5px;display:flex;align-items:center;justify-content:center;gap:8px;transition:filter .15s,transform .05s}
#P .rf-cta:hover{filter:brightness(1.08)}
#P .rf-cta:active{transform:scale(.99)}
#P .rf-cta.sec{background:var(--elev);color:var(--tx);border:1px solid var(--line2)}
#P .rf-cta kbd{background:rgba(0,0,0,.12);border-color:rgba(0,0,0,.18);color:inherit}
#P .rf-status{display:flex;align-items:flex-start;gap:8px;margin-top:10px;font-size:12px;color:var(--mu)}
#P .rf-status::before{content:"";width:6px;height:6px;margin-top:6px;flex:none;border-radius:50%;background:currentColor}
#P .rf-status.ok{color:var(--ac)}
#P .rf-status.aviso{color:var(--wn)}
#P .rf-status.erro{color:var(--er)}
#P details.rf-ativ{margin-top:8px}
#P details.rf-ativ summary{cursor:pointer;font-size:11.5px;color:var(--mu);list-style:none;user-select:none}
#P details.rf-ativ summary::-webkit-details-marker{display:none}
#P details.rf-ativ summary::before{content:"›";display:inline-block;margin-right:6px;transition:transform .15s}
#P details.rf-ativ[open] summary::before{transform:rotate(90deg)}
#P .rf-log{margin-top:6px;font:11px/1.5 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;color:var(--mu);max-height:96px;overflow:auto}
#P .rf-log:empty::before{content:"Nada por enquanto."}
#P kbd{display:inline-grid;place-items:center;min-width:22px;height:20px;padding:0 5px;border-radius:6px;border:1px solid var(--line2);background:var(--elev);font:600 10.5px ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;color:var(--tx)}
#P .rf-mu{color:var(--mu);font-size:12px}
#P .rf-rot{font-size:10.5px;font-weight:700;letter-spacing:.07em;text-transform:uppercase;color:var(--mu)}
#P .rf-vazio{text-align:center;padding:18px 6px 10px}
#P .rf-vazio-ic{width:44px;height:44px;margin:0 auto 12px;border-radius:14px;display:grid;place-items:center;background:var(--acd);border:1px solid var(--acb);color:var(--ac);font-size:18px}
#P .rf-vazio b{display:block;font-size:14.5px;font-weight:650;margin-bottom:4px}
#P .rf-carga{display:flex;align-items:center;gap:10px;padding:18px 2px;color:var(--mu)}
#P .rf-giro{width:16px;height:16px;border-radius:50%;border:2px solid var(--line2);border-top-color:var(--ac);animation:rf-giro .8s linear infinite}
#P .rf-topo{display:flex;justify-content:space-between;align-items:center;margin-bottom:4px}
#P .rf-sug{font-size:22px;font-weight:700;letter-spacing:-.02em;line-height:1.2;margin:2px 0 12px;word-break:break-word}
#P .rf-conf{display:flex;align-items:center;gap:10px}
#P .rf-barra{flex:1;height:6px;border-radius:99px;background:var(--line);overflow:hidden}
#P .rf-barra>i{display:block;height:100%;border-radius:inherit;background:var(--ac);transition:width .3s}
#P .rf-conf[data-nivel="medio"] .rf-barra>i{background:var(--wn)}
#P .rf-conf b{font-size:12.5px;font-variant-numeric:tabular-nums;min-width:36px;text-align:right}
#P .rf-chips{display:flex;flex-wrap:wrap;gap:6px;margin-top:10px}
#P .rf-chip{display:inline-flex;align-items:center;gap:4px;padding:3px 9px;border-radius:999px;background:var(--elev);border:1px solid var(--line);font-size:11.5px;color:var(--tx)}
#P .rf-chip button{color:var(--mu);font-size:13px;line-height:1;padding:0 0 0 2px}
#P .rf-chip button:hover{color:var(--er)}
#P .rf-caixa{margin-top:12px;padding:10px 12px;border-radius:12px;background:var(--card);border:1px solid var(--line)}
#P .rf-aviso{margin-top:12px;padding:10px 12px;border-radius:12px;background:var(--wnd);border:1px solid rgba(251,191,36,.28);color:var(--wn);font-size:12.5px}
#P .rf-auto{margin-top:12px;padding:10px 12px;border-radius:12px;background:var(--acd);border:1px solid var(--acb);font-size:12.5px}
#P .rf-auto b{color:var(--ac)}
#P .rf-auto .rf-barra{margin-top:8px;height:3px;background:rgba(137,243,54,.15)}
#P .rf-auto .rf-barra>i{width:0;animation:rf-encher var(--dur,1.5s) linear forwards;transition:none}
#P .rf-acoes{display:flex;flex-direction:column;gap:2px;margin-top:14px}
#P .rf-acao{width:100%;display:flex;align-items:center;gap:10px;padding:8px 10px;border-radius:10px;border:1px solid transparent;text-align:left;transition:background .12s,border-color .12s}
#P .rf-acao:hover{background:var(--elev);border-color:var(--line)}
#P .rf-acao span{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
#P .rf-acao em{font-style:normal;font-size:11.5px;color:var(--mu);font-variant-numeric:tabular-nums}
#P .rf-acao.prim{background:var(--acd);border-color:var(--acb);font-weight:600}
#P .rf-acao.prim kbd{border-color:var(--acb);color:var(--ac)}
#P .rf-dicas{display:flex;gap:14px;justify-content:center;margin-top:12px;font-size:11.5px;color:var(--mu)}
#P .rf-dicas span{display:inline-flex;align-items:center;gap:6px}
#P .rf-nums{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:16px}
#P .rf-nums div{padding:9px 10px;border-radius:12px;background:var(--elev);border:1px solid var(--line)}
#P .rf-nums b{display:block;font-size:17px;font-weight:700;font-variant-numeric:tabular-nums;line-height:1.2}
#P .rf-nums span{font-size:11px;color:var(--mu)}
#P .rf-cartao{padding:10px 12px;border-radius:12px;background:var(--card);border:1px solid var(--line);margin-bottom:8px}
#P .rf-cartao-cab{display:flex;align-items:center;gap:8px}
#P .rf-cartao-cab b{flex:1;min-width:0;font-weight:650;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
#P .rf-selo{display:inline-flex;align-items:center;gap:5px;font-size:11px;color:var(--mu)}
#P .rf-selo::before{content:"";width:6px;height:6px;border-radius:50%;background:currentColor}
#P .rf-selo-ok{color:var(--ac)}
#P .rf-selo-nao{color:var(--er)}
#P .rf-cartao .rf-chips{margin-top:8px}
#P .rf-del{width:24px;height:24px;border-radius:7px;display:grid;place-items:center;color:var(--mu);font-size:14px}
#P .rf-del:hover{background:var(--erd);color:var(--er)}
#P .rf-campo{width:100%;padding:9px 11px;border-radius:10px;background:rgba(0,0,0,.25);color:var(--tx);border:1px solid var(--line2);font-size:12.5px;outline:none;transition:border-color .15s,box-shadow .15s}
#P .rf-campo::placeholder{color:#64707f}
#P .rf-campo:focus{border-color:var(--acb);box-shadow:0 0 0 3px var(--acd)}
#P .rf-form{display:grid;gap:8px;margin-top:6px}
#P .rf-erro{font-size:12px;color:var(--er)}
#P .rf-erro:empty{display:none}
#P .rf-bt{padding:9px 12px;border-radius:10px;background:var(--ac);color:var(--on);font-weight:700;font-size:12.5px}
#P .rf-bt:hover{filter:brightness(1.08)}
#P .rf-bt:disabled{opacity:.5;cursor:default;filter:none}
#P .rf-bt2{padding:7px 11px;border-radius:10px;background:var(--elev);border:1px solid var(--line2);font-weight:600;font-size:12px;color:var(--tx)}
#P .rf-bt2:hover{border-color:var(--acb);color:var(--ac)}
#P .rf-bt2.perigo:hover{border-color:rgba(248,113,113,.4);color:var(--er)}
#P .rf-bt2:disabled{opacity:.5;cursor:default}
#P .rf-linha-bt{display:flex;gap:6px;flex-wrap:wrap}
#P .rf-sep{display:flex;align-items:center;justify-content:space-between;margin:16px 0 8px}
#P .rf-sec{padding:12px;border-radius:14px;background:var(--card);border:1px solid var(--line);margin-bottom:10px}
#P .rf-sec-cab{display:flex;align-items:flex-start;gap:12px}
#P .rf-sec-cab div{flex:1}
#P .rf-sec h4{font-size:13px;font-weight:650;margin-bottom:2px}
#P .rf-sec p{font-size:12px;color:var(--mu)}
#P .rf-faixa{margin-top:12px}
#P .rf-faixa-cab{display:flex;justify-content:space-between;align-items:center;font-size:12px;margin-bottom:4px}
#P .rf-faixa-cab b{font-variant-numeric:tabular-nums;padding:2px 8px;border-radius:999px;background:var(--acd);color:var(--ac);font-size:12px}
#P input[type=range]{width:100%;accent-color:var(--ac);cursor:pointer}
#P .rf-faixa.off{opacity:.45;pointer-events:none}
#P .rf-sw{appearance:none;-webkit-appearance:none;flex:none;width:36px;height:20px;border-radius:99px;background:var(--line2);position:relative;cursor:pointer;transition:background .15s;margin-top:1px}
#P .rf-sw::after{content:"";position:absolute;top:2px;left:2px;width:16px;height:16px;border-radius:50%;background:#fff;box-shadow:0 1px 2px rgba(0,0,0,.4);transition:transform .15s}
#P .rf-sw:checked{background:var(--ac)}
#P .rf-sw:checked::after{transform:translateX(16px)}
#P .rf-nota{margin-top:8px;font-size:11.5px;color:var(--mu)}
#P .rf-hist{display:grid;grid-template-columns:1fr 70px 64px;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid var(--line);font-size:12.5px}
#P .rf-hist:last-of-type{border-bottom:0}
#P .rf-hist span:first-child{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
#P .rf-hist em{font-style:normal;text-align:right;color:var(--mu);font-size:11.5px;font-variant-numeric:tabular-nums}
@keyframes rf-giro{to{transform:rotate(360deg)}}
@keyframes rf-pulso{0%,100%{opacity:1}50%{opacity:.3}}
@keyframes rf-encher{from{width:0}to{width:100%}}
`.replace(/#P/g, "#rf-copiloto-panel");
  var U = (e) => `${Math.round((e || 0) * 100)}%`;
  function pt(e, o, t, a) {
    let r = e.defaultView,
      n = r.URL.createObjectURL(new r.Blob([t], { type: a })),
      s = e.createElement("a");
    (s.href = n),
      (s.download = o),
      e.body.appendChild(s),
      s.click(),
      s.remove(),
      setTimeout(() => r.URL.revokeObjectURL(n), 1e3);
  }
  function Bt(e, o) {
    let t = (c, S = {}, ...i) => {
      let p = e.createElement(c);
      for (let [b, w] of Object.entries(S))
        if (b === "on")
          for (let [$, k] of Object.entries(w)) p.addEventListener($, k);
        else b === "class" ? (p.className = w) : p.setAttribute(b, w);
      for (let b of i.flat())
        b != null &&
          b !== !1 &&
          p.append(b.nodeType ? b : e.createTextNode(String(b)));
      return p;
    };
    e.getElementById("rf-copiloto-css")?.remove();
    let a = t("style", { id: "rf-copiloto-css" });
    (a.textContent = It), e.head.appendChild(a);
    let cfg = { autoEnviar: !1, autoConfianca: 0.9 },
      modoAtual = "parado",
      rodando = () => ["carregando", "sugestao", "escolha"].includes(modoAtual),
      r = t("div", { class: "rf-corpo" }),
      n = t(
        "div",
        { class: "rf-status", role: "status" },
        "Cadastre as pastas e clique em Iniciar.",
      ),
      s = t("div", { class: "rf-log" }),
      pill = t("span", { class: "rf-pill", "data-estado": "parado" }, "Parado"),
      cta = t("button", {
        class: "rf-cta",
        type: "button",
        on: { click: () => (rodando() ? o.pausar() : o.iniciar()) },
      }),
      rotulos = {
        Triagem: "Triagem",
        Pastas: "Pastas",
        Registro: "Histórico",
        Ajustes: "Ajustes",
      },
      u = Object.keys(rotulos),
      f = u.map((c) =>
        t(
          "button",
          {
            class: "rf-aba",
            type: "button",
            "data-aba": c,
            on: { click: () => A(c) },
          },
          rotulos[c],
        ),
      ),
      m = Object.fromEntries(u.map((c) => [c, t("div")])),
      d = t(
        "div",
        { class: "rf-cab" },
        t("div", { class: "rf-marca", "aria-hidden": "true" }, "rb"),
        t(
          "div",
          { class: "rf-nome" },
          t("b", {}, "rod bot"),
          t("span", {}, "copiloto de pastas"),
        ),
        pill,
        t(
          "button",
          {
            class: "rf-x",
            type: "button",
            "aria-label": "Fechar",
            title: "Fechar",
            on: { click: () => o.fechar() },
          },
          "×",
        ),
      ),
      h = t(
        "div",
        { id: "rf-copiloto-panel" },
        d,
        t("div", { class: "rf-abas", role: "tablist" }, f),
        r,
        t(
          "div",
          { class: "rf-rodape" },
          cta,
          n,
          t(
            "details",
            { class: "rf-ativ" },
            t("summary", {}, "Atividade"),
            s,
          ),
        ),
      );
    e.body.appendChild(h);
    function atualizarTopo() {
      let ativo = rodando();
      cta.className = ativo ? "rf-cta sec" : "rf-cta";
      cta.replaceChildren(
        ...(ativo
          ? ["Pausar", t("kbd", {}, "Espaço")]
          : [modoAtual === "concluido" ? "Iniciar de novo" : "Iniciar triagem"]),
      );
      pill.dataset.estado = ativo ? "rodando" : "parado";
      pill.textContent = ativo
        ? cfg.autoEnviar
          ? `Auto ≥ ${U(cfg.autoConfianca)}`
          : "Rodando"
        : modoAtual === "concluido"
          ? "Concluído"
          : cfg.autoEnviar
            ? `Auto ≥ ${U(cfg.autoConfianca)}`
            : "Parado";
    }
    let P = "Triagem";
    function A(c) {
      (P = c),
        f.forEach((S) => S.classList.toggle("on", S.dataset.aba === c)),
        r.replaceChildren(m[c]);
    }
    A("Triagem");
    let x = null;
    d.addEventListener("mousedown", (c) => {
      if (c.target.closest("button")) return;
      let S = h.getBoundingClientRect();
      x = { dx: c.clientX - S.left, dy: c.clientY - S.top };
      c.preventDefault();
    });
    let C = (c) => {
        x &&
          ((h.style.left = `${Math.max(0, c.clientX - x.dx)}px`),
          (h.style.top = `${Math.max(0, c.clientY - x.dy)}px`),
          (h.style.right = "auto"));
      },
      M = () => {
        x = null;
      };
    e.addEventListener("mousemove", C), e.addEventListener("mouseup", M);
    let z = (c) => {
        let movidos =
          (c.confirmados || 0) +
          (c.corrigidos || 0) +
          (c.escolhidos || 0) +
          (c.automaticos || 0);
        return t(
          "div",
          {
            class: "rf-nums",
            title: `Confirmados ${c.confirmados || 0} · Corrigidos ${c.corrigidos || 0} · Escolhidos ${c.escolhidos || 0} · Automáticos ${c.automaticos || 0}`,
          },
          t("div", {}, t("b", {}, movidos), t("span", {}, "Movidos")),
          t(
            "div",
            {},
            t("b", {}, c.automaticos || 0),
            t("span", {}, "Automáticos"),
          ),
          t("div", {}, t("b", {}, c.pulados || 0), t("span", {}, "Pulados")),
        );
      },
      porque = (c) =>
        c.porque?.length
          ? t(
              "div",
              { class: "rf-chips", title: "Palavras que pesaram na sugestão" },
              c.porque.map((b) => t("span", { class: "rf-chip" }, b)),
            )
          : null,
      acao = (classe, tecla, texto, extra, aoClicar) =>
        t(
          "button",
          { class: `rf-acao ${classe}`, type: "button", on: { click: aoClicar } },
          t("kbd", {}, tecla),
          t("span", {}, texto),
          extra ? t("em", {}, extra) : null,
        );
    function l(c) {
      (modoAtual = c.modo), atualizarTopo();
      ["carregando", "sugestao", "escolha"].includes(c.modo) &&
        P !== "Triagem" &&
        A("Triagem");
      let S = m.Triagem,
        i = [];
      if (c.modo === "parado" || c.modo === "concluido") {
        let fim = c.modo === "concluido";
        i.push(
          t(
            "div",
            { class: "rf-vazio" },
            t("div", { class: "rf-vazio-ic", "aria-hidden": "true" }, fim ? "✓" : "▸"),
            t("b", {}, fim ? "Lista concluída" : "Pronto para começar"),
            t(
              "div",
              { class: "rf-mu" },
              fim
                ? "Não há mais tickets na lista."
                : cfg.autoEnviar
                  ? `Envio automático ligado a partir de ${U(cfg.autoConfianca)} de confiança.`
                  : "Você confirma cada ticket com Enter.",
            ),
          ),
        );
      }
      c.modo === "carregando" &&
        i.push(
          t(
            "div",
            { class: "rf-carga" },
            t("div", { class: "rf-giro", "aria-hidden": "true" }),
            `Abrindo ticket #${c.ticket}…`,
          ),
        );
      if (c.modo === "sugestao" || c.modo === "escolha") {
        let temSug = c.modo === "sugestao";
        i.push(
          t(
            "div",
            { class: "rf-topo" },
            t("span", { class: "rf-rot" }, temSug ? "Sugestão" : "Escolha a pasta"),
            t("span", { class: "rf-mu" }, `#${c.ticket}`),
          ),
        );
        if (temSug) {
          i.push(t("div", { class: "rf-sug" }, c.sugestao));
          i.push(
            t(
              "div",
              {
                class: "rf-conf",
                "data-nivel":
                  cfg.autoEnviar && c.confianca < cfg.autoConfianca
                    ? "medio"
                    : "alto",
                title: "Confiança",
              },
              t(
                "div",
                { class: "rf-barra" },
                t("i", { style: `width:${U(c.confianca)}` }),
              ),
              t("b", {}, U(c.confianca)),
            ),
            porque(c),
          );
          if (c.auto) {
            let seg = (c.autoAtrasoMs || 1500) / 1e3;
            i.push(
              t(
                "div",
                { class: "rf-auto", role: "status" },
                t("b", {}, "Enviando automaticamente"),
                " — Esc pula, 1–9 troca a pasta.",
                t(
                  "div",
                  { class: "rf-barra", style: `--dur:${seg}s` },
                  t("i"),
                ),
              ),
            );
          }
        } else
          c.palpite
            ? i.push(
                t(
                  "div",
                  { class: "rf-aviso" },
                  `Palpite: ${c.palpite} (${U(c.confianca)}). Confirme escolhendo a pasta.`,
                ),
                porque(c),
              )
            : i.push(
                t(
                  "div",
                  { class: "rf-aviso" },
                  "Confiança baixa. Escolha a pasta abaixo.",
                ),
              );
        if (
          (c.teams === "consultando" &&
            i.push(
              t(
                "div",
                { class: "rf-carga", role: "status" },
                t("div", { class: "rf-giro", "aria-hidden": "true" }),
                "Consultando o Copilot do Teams…",
              ),
            ),
          c.teams === "indisponivel" &&
            i.push(
              t(
                "div",
                { class: "rf-mu", role: "status", style: "margin-top:10px" },
                "Sem sugestão do Teams. Escolha a pasta abaixo.",
              ),
            ),
          c.teams === "sugeriu")
        ) {
          let b = c.sugestaoTeams.pasta,
            w = c.sugestaoTeams.palavrasChave.map(($) => {
              let k = t("span", { class: "rf-mu", role: "status" }),
                q = t(
                  "button",
                  {
                    class: "rf-bt2",
                    type: "button",
                    on: {
                      click: () => {
                        let D = o.adicionarPalavra(b, $);
                        (k.textContent = D?.ok
                          ? " Adicionada."
                          : ` ${D?.erro || "Não foi possível adicionar."}`),
                          D?.ok && (q.disabled = !0);
                      },
                    },
                  },
                  `+ "${$}" em ${b}`,
                );
              return t("div", { style: "margin-top:6px" }, q, k);
            });
          i.push(
            t(
              "div",
              { class: "rf-caixa" },
              t("div", { class: "rf-rot" }, "Copilot do Teams"),
              t(
                "div",
                { style: "font-weight:650;font-size:15px;margin:2px 0 8px" },
                b,
              ),
              w.length
                ? t(
                    "div",
                    { class: "rf-mu" },
                    "Palavras-chave sugeridas (opcional):",
                  )
                : null,
              w,
              t(
                "button",
                {
                  class: "rf-bt",
                  type: "button",
                  style: "margin-top:10px;width:100%",
                  on: { click: () => o.confirmarTeams() },
                },
                "Mover para " + b,
              ),
            ),
          );
        }
        c.motivo &&
          i.push(
            t(
              "div",
              { class: "rf-caixa" },
              t("div", { class: "rf-rot" }, "Motivo no Blip"),
              t("div", { style: "margin-top:2px" }, c.motivo),
            ),
          );
        c.temResumo ||
          i.push(
            t(
              "div",
              { class: "rf-mu", style: "margin-top:10px" },
              "Atendimento sem Resumo Inteligente.",
            ),
          );
        let p = t("div", { class: "rf-acoes" });
        temSug &&
          p.append(
            acao("prim", "Enter", `Mover para ${c.sugestao}`, null, () =>
              o.decidir({ tipo: "confirmar" }),
            ),
          );
        (c.alternativas || []).forEach((b, w) =>
          p.append(
            acao("", String(w + 1), b.nome, U(b.p), () =>
              o.decidir({ tipo: "escolher", indice: w }),
            ),
          ),
        );
        i.push(
          p,
          t(
            "div",
            { class: "rf-dicas" },
            t("span", {}, t("kbd", {}, "Esc"), "Pular"),
            t("span", {}, t("kbd", {}, "Espaço"), "Pausar"),
          ),
        );
      }
      i.push(
        z(
          c.contadores || {
            confirmados: 0,
            corrigidos: 0,
            escolhidos: 0,
            pulados: 0,
            automaticos: 0,
          },
        ),
      ),
        S.replaceChildren(...i);
    }
    let ultimaTriagem = null,
      l0 = l;
    l = (c) => {
      (ultimaTriagem = c), l0(c);
    };
    function v(c, S) {
      let i = t("div", { class: "rf-erro", role: "alert" }),
        p = t("input", {
          class: "rf-campo",
          name: "nome",
          placeholder: "Nome exato da pasta no Blip",
          autocomplete: "off",
        }),
        b = t("input", {
          class: "rf-campo",
          name: "palavras",
          placeholder: "Palavras-chave, separadas por vírgula",
          autocomplete: "off",
        }),
        w = t(
          "form",
          {
            class: "rf-form",
            on: {
              submit: (k) => {
                k.preventDefault();
                let q = o.salvarPasta({
                  nome: p.value.trim(),
                  palavras: yt(b.value),
                });
                i.textContent = q && !q.ok ? q.erro : "";
              },
            },
          },
          p,
          b,
          t("button", { class: "rf-bt2", type: "submit" }, "Adicionar pasta"),
          i,
        ),
        $ = c.map((k) => {
          let q = S
            ? S[k.nome]
              ? t("span", { class: "rf-selo rf-selo-ok" }, "no Blip")
              : t("span", { class: "rf-selo rf-selo-nao" }, "não encontrada")
            : null;
          return t(
            "div",
            { class: "rf-cartao" },
            t(
              "div",
              { class: "rf-cartao-cab" },
              t("b", { title: k.nome }, k.nome),
              q,
              t(
                "button",
                {
                  class: "rf-del",
                  type: "button",
                  title: "Remover pasta",
                  "aria-label": `Remover ${k.nome}`,
                  on: { click: () => o.removerPasta(k.nome) },
                },
                "×",
              ),
            ),
            k.palavras.length
              ? t(
                  "div",
                  { class: "rf-chips" },
                  k.palavras.map((D) =>
                    t(
                      "span",
                      { class: "rf-chip" },
                      D,
                      t(
                        "button",
                        {
                          type: "button",
                          title: "Remover palavra",
                          "aria-label": `Remover palavra ${D} de ${k.nome}`,
                          on: { click: () => o.removerPalavra(k.nome, D) },
                        },
                        "×",
                      ),
                    ),
                  ),
                )
              : t(
                  "div",
                  { class: "rf-mu", style: "margin-top:6px" },
                  "Sem palavras-chave.",
                ),
          );
        });
      m.Pastas.replaceChildren(
        t(
          "div",
          { class: "rf-sep", style: "margin-top:0" },
          t(
            "span",
            { class: "rf-rot" },
            `${c.length} ${c.length === 1 ? "pasta" : "pastas"}`,
          ),
          t(
            "button",
            {
              class: "rf-bt2",
              type: "button",
              on: { click: () => o.conferirPastas() },
            },
            "Conferir com o Blip",
          ),
        ),
        ...($.length
          ? $
          : [
              t(
                "div",
                { class: "rf-mu", style: "padding:4px 0 8px" },
                "Nenhuma pasta ainda. Cadastre pelo menos 2.",
              ),
            ]),
        t(
          "div",
          { class: "rf-sep" },
          t("span", { class: "rf-rot" }, "Nova pasta"),
        ),
        w,
      );
    }
    function y(c, S, i) {
      let p = Object.entries(c).map(([$, k]) =>
          t(
            "div",
            { class: "rf-hist" },
            t("span", { title: $ }, $),
            t(
              "div",
              { class: "rf-barra" },
              t("i", { style: `width:${U(k.acerto)}` }),
            ),
            t(
              "em",
              { title: `${k.confirmadas} de ${k.sugeridas} sugestões aceitas` },
              `${k.acerto == null ? "—" : U(k.acerto)} · ${k.sugeridas}`,
            ),
          ),
        ),
        b = S?.total
          ? [
              t(
                "div",
                { class: "rf-mu", style: "margin-top:10px" },
                `Palpites: ${S.certos} de ${S.total} certos (${U(S.acerto)})`,
              ),
            ]
          : [],
        w = i?.total
          ? [
              t(
                "div",
                { class: "rf-mu", style: "margin-top:6px" },
                `Copilot do Teams: ${i.concordou} de ${i.total} na pasta sugerida (${U(i.acerto)})`,
              ),
            ]
          : [];
      m.Registro.replaceChildren(
        t(
          "div",
          { class: "rf-sep", style: "margin-top:0" },
          t("span", { class: "rf-rot" }, "Acerto por pasta"),
          t(
            "button",
            {
              class: "rf-bt2",
              type: "button",
              on: { click: () => o.exportarCSV() },
            },
            "Exportar CSV",
          ),
        ),
        ...(p.length
          ? p
          : [
              t(
                "div",
                { class: "rf-mu" },
                "Ainda não há decisões registradas.",
              ),
            ]),
        ...b,
        ...w,
      );
    }
    function E(c) {
      (cfg = c), atualizarTopo();
      ultimaTriagem &&
        ["parado", "concluido"].includes(ultimaTriagem.modo) &&
        l0(ultimaTriagem);
      let pct = (v) => Math.round((Number(v) || 0) * 100),
        faixa = (titulo, nome, valor, min, max, aoMudar) => {
          let rot = t("b", {}, `${pct(valor)}%`),
            inp = t("input", {
              type: "range",
              name: nome,
              min: String(min),
              max: String(max),
              step: "1",
              value: String(pct(valor)),
              "aria-label": titulo,
              on: {
                input: (ev) => (rot.textContent = `${ev.target.value}%`),
                change: (ev) => aoMudar(Number(ev.target.value) / 100),
              },
            });
          return t(
            "div",
            { class: "rf-faixa" },
            t("div", { class: "rf-faixa-cab" }, t("span", {}, titulo), rot),
            inp,
          );
        },
        sw = (marcado, aoMudar, rotulo) => {
          let k = t("input", {
            type: "checkbox",
            class: "rf-sw",
            role: "switch",
            "aria-label": rotulo,
            on: { change: (ev) => aoMudar(ev.target.checked) },
          });
          return (k.checked = marcado === !0), k;
        },
        salvar = (parcial) => o.salvarConfig(parcial),
        autoFaixa = faixa(
          "Enviar sozinho a partir de",
          "autoConfianca",
          c.autoConfianca,
          50,
          99,
          (v) => salvar({ autoConfianca: v }),
        );
      c.autoEnviar || autoFaixa.classList.add("off");
      let w = t("input", {
        type: "file",
        accept: "application/json",
        style: "display:none",
        on: {
          change: async ($) => {
            let k = $.target.files?.[0];
            k && o.importar(await k.text()), ($.target.value = "");
          },
        },
      });
      m.Ajustes.replaceChildren(
        t(
          "div",
          { class: "rf-sec" },
          t(
            "div",
            { class: "rf-sec-cab" },
            t(
              "div",
              {},
              t("h4", {}, "Envio automático"),
              t(
                "p",
                {},
                "Move o ticket sozinho, sem precisar apertar Enter, quando a confiança for alta.",
              ),
            ),
            sw(
              c.autoEnviar,
              (v) => salvar({ autoEnviar: v }),
              "Envio automático",
            ),
          ),
          autoFaixa,
          t(
            "div",
            { class: "rf-nota" },
            c.autoConfianca < c.limiarProb
              ? `Abaixo da confiança mínima (${U(c.limiarProb)}), nada é enviado sozinho.`
              : "Abaixo desse valor, o ticket espera sua confirmação. Esc pula durante o envio.",
          ),
        ),
        t(
          "div",
          { class: "rf-sec" },
          t("h4", {}, "Sugestões"),
          t("p", {}, "Quando o bot mostra uma pasta como sugestão."),
          faixa(
            "Confiança mínima para sugerir",
            "limiarProb",
            c.limiarProb,
            30,
            95,
            (v) => salvar({ limiarProb: v }),
          ),
          faixa(
            "Distância mínima para a 2ª pasta",
            "limiarMargem",
            c.limiarMargem,
            0,
            60,
            (v) => salvar({ limiarMargem: v }),
          ),
        ),
        t(
          "div",
          { class: "rf-sec" },
          t(
            "div",
            { class: "rf-sec-cab" },
            t(
              "div",
              {},
              t("h4", {}, "Copilot do Teams"),
              t(
                "p",
                {},
                "Na confiança baixa, envia motivo e mensagens do cliente com mascaramento ao Teams corporativo. Ative apenas para uso autorizado.",
              ),
            ),
            sw(
              c.copilotTeams,
              (v) => salvar({ copilotTeams: v }),
              "Consultar o Copilot do Teams",
            ),
          ),
        ),
        t(
          "div",
          { class: "rf-sec" },
          t("h4", {}, "Aprendizado"),
          t("p", { style: "margin-bottom:10px" }, "Leve o que o bot aprendeu para outro navegador."),
          t(
            "div",
            { class: "rf-linha-bt" },
            t(
              "button",
              {
                class: "rf-bt2",
                type: "button",
                on: { click: () => o.exportar() },
              },
              "Exportar",
            ),
            t(
              "button",
              { class: "rf-bt2", type: "button", on: { click: () => w.click() } },
              "Importar",
            ),
            t(
              "button",
              {
                class: "rf-bt2 perigo",
                type: "button",
                on: { click: () => o.zerar() },
              },
              "Zerar",
            ),
            w,
          ),
        ),
      );
    }
    function T(c, S = "") {
      (n.textContent = c), (n.className = `rf-status ${S}`);
    }
    function B(c) {
      let S = new Date().toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      for (s.append(t("div", {}, `${S}  ${c}`)); s.children.length > 30; )
        s.firstChild.remove();
      s.scrollTop = s.scrollHeight;
    }
    function V() {
      e.removeEventListener("mousemove", C),
        e.removeEventListener("mouseup", M),
        h.remove(),
        a.remove();
    }
    return (
      l({
        modo: "parado",
        contadores: {
          confirmados: 0,
          corrigidos: 0,
          escolhidos: 0,
          pulados: 0,
          automaticos: 0,
        },
      }),
      {
        raiz: h,
        mostrarTriagem: l,
        mostrarPastas: v,
        mostrarRegistro: y,
        mostrarConfig: E,
        status: T,
        log: B,
        destruir: V,
        get aba() {
          return P;
        },
      }
    );
  }
  function Vt(e) {
    return !e || e.nodeType !== 1
      ? !1
      : e.id === "text-input" ||
          e.closest?.("#text-input") ||
          ["INPUT", "TEXTAREA", "SELECT"].includes(e.tagName)
        ? !0
        : e.isContentEditable === !0 ||
          !!e.closest?.('[contenteditable=""], [contenteditable="true"]');
  }
  function xe(e) {
    return e.ctrlKey || e.metaKey || e.altKey
      ? null
      : e.key === "Enter"
        ? { tipo: "confirmar" }
        : e.key === "Escape"
          ? { tipo: "pular" }
          : e.key === " " || e.code === "Space"
            ? { tipo: "pausar" }
            : /^[1-9]$/.test(e.key)
              ? { tipo: "escolher", indice: Number(e.key) - 1 }
              : null;
  }
  function Ft(e, o) {
    let t = (a) => {
      let r =
        typeof a.composedPath == "function" ? a.composedPath()[0] : a.target;
      if (Vt(r) || Vt(e.activeElement)) return;
      let n = xe(a);
      if (!n) return;
      let s = o(n) === !0,
        u =
          !!r?.closest?.("#rf-copiloto-panel button") &&
          (n.tipo === "confirmar" || n.tipo === "pausar");
      (s || u) && (a.preventDefault(), a.stopPropagation());
    };
    return (
      e.addEventListener("keydown", t, !0),
      { desligar: () => e.removeEventListener("keydown", t, !0) }
    );
  }
  var Ut = { audio: "[áudio]", imagem: "[imagem]", documento: "[documento]" };
  function Ht(
    e,
    { padroesRuido: o = [], maxTotal: t = 30, maxAntesDivisor: a = 10 } = {},
  ) {
    let r = o.map(I).filter(Boolean),
      n = 0,
      s = e
        .map((d) => ({
          ...d,
          texto: d.midia ? Ut[d.midia] || Ut.documento : (d.texto || "").trim(),
        }))
        .filter((d) => d.texto),
      u = s.filter((d) => d.antesDoDivisor && d.lado === "cliente").slice(-a),
      f = s.filter((d) => !d.antesDoDivisor),
      m = [];
    for (let d of [...u, ...f]) {
      if (d.lado === "atendente") {
        let h = I(d.texto);
        if (r.some((A) => h.includes(A))) {
          n++;
          continue;
        }
        let P = m[m.length - 1];
        if (P && P.lado === "atendente" && P.texto === d.texto) {
          n++;
          continue;
        }
      }
      m.push(d);
    }
    return { mensagens: m.slice(-t), removidas: n };
  }
  var Jt = "rf-copiloto-v1:";
  function Gt(e) {
    let o = 2166136261;
    for (let t = 0; t < e.length; t++)
      (o ^= e.charCodeAt(t)), (o = Math.imul(o, 16777619) >>> 0);
    return o.toString(16).padStart(8, "0");
  }
  var et = (e) => Gt(`${Jt}t:${e}`),
    mt = (e) => Gt(`${Jt}k:${String(e)}`);
  function Kt(e) {
    let o = Z(e);
    return [...o, ...vt(o)];
  }
  function Wt(e, o) {
    let t = new Map(),
      a = (r, n) => {
        for (let s of new Set(Kt(r))) t.set(s, (t.get(s) || 0) + n);
      };
    e.motivo && a(e.motivo, o.motivo),
      e.anteriores && a(e.anteriores, o.anteriores);
    for (let r of e.mensagensCliente || []) a(r, o.cliente);
    return [...t].map(([r, n]) => ({ token: r, peso: n }));
  }
  function ye(e, o) {
    let t = new Map();
    for (let a of e) {
      let r = new Map();
      for (let n of a.palavras || [])
        for (let s of new Set(Kt(n))) r.set(s, (r.get(s) || 0) + o);
      t.set(a.nome, r);
    }
    return t;
  }
  function Xt(e, o, t, a) {
    if (!o.length) return { ranking: [], sugestao: null, porque: [] };
    let {
        alfa: r,
        pseudoContagem: n,
        suporteMinimo: s,
        limiarProb: u,
        limiarMargem: f,
      } = a,
      m = ye(o, n),
      d = new Set();
    for (let i of m.values()) for (let p of i.keys()) d.add(`s:${p}`);
    for (let [i, p] of Object.entries(t.suporte)) p >= s && d.add(`h:${i}`);
    let h = Math.max(1, d.size),
      P = (i, p) => {
        let b = et(i),
          w = ((t.suporte[b] || 0) >= s && t.contagens[b]?.[p]) || 0;
        return (m.get(p).get(i) || 0) + w;
      },
      A = {};
    for (let [i, p] of Object.entries(t.contagens))
      if (!((t.suporte[i] || 0) < s))
        for (let [b, w] of Object.entries(p)) A[b] = (A[b] || 0) + w;
    let x = (i) => {
        let p = A[i] || 0;
        for (let b of m.get(i).values()) p += b;
        return p;
      },
      C = e.filter((i) => o.some((p) => P(i.token, p.nome) > 0)),
      M = o.map((i) => {
        let p = x(i.nome),
          b = new Map(),
          w = 0;
        for (let { token: $, peso: k } of C) {
          let q = P($, i.nome),
            D = k * Math.log((q + r) / (p + r * h));
          b.set($, { v: D, c: q }), (w += D);
        }
        return { nome: i.nome, lp: w, porToken: b };
      }),
      z = Math.max(...M.map((i) => i.lp)),
      l = M.map((i) => Math.exp(i.lp - z)),
      v = l.reduce((i, p) => i + p, 0),
      y = M.map((i, p) => ({ nome: i.nome, p: l[p] / v })).sort(
        (i, p) => p.p - i.p,
      ),
      E = y[0].p,
      T = y[1]?.p ?? 0,
      B =
        o.length >= 2 && C.length > 0 && E >= u && E - T >= f
          ? y[0].nome
          : null,
      V = M.find((i) => i.nome === y[0].nome),
      c = M.filter((i) => i !== V),
      S = C.filter(({ token: i }) => V.porToken.get(i).c > 0)
        .map(({ token: i }) => {
          let p =
            c.reduce((b, w) => b + w.porToken.get(i).v, 0) /
            Math.max(1, c.length);
          return { token: i, vantagem: V.porToken.get(i).v - p };
        })
        .filter((i) => i.vantagem > 0)
        .sort((i, p) => p.vantagem - i.vantagem)
        .slice(0, 3)
        .map((i) => i.token.replace(/_/g, " "));
    return { ranking: y, sugestao: B, porque: S };
  }
  function Zt(e, o, t) {
    for (let { token: a, peso: r } of o) {
      let n = et(a),
        s = e.contagens[n] || (e.contagens[n] = {});
      (s[t] = (s[t] || 0) + r),
        (e.totais[t] = (e.totais[t] || 0) + r),
        (e.suporte[n] = (e.suporte[n] || 0) + 1);
    }
    return e;
  }
  var ke = {
    menu_indisponivel: () => 'O menu "Mover para" não abriu. Nada foi movido.',
    nao_confirmado: () =>
      "Não foi possível confirmar a movimentação. Verifique o ticket no Blip.",
    pasta_ambigua: (e, o) =>
      `Mais de uma pasta do Blip combina com "${e}": ${o.join(", ")}. Nada foi movido.`,
    pasta_nao_encontrada: (e, o) =>
      `A pasta "${e}" não apareceu no Blip. Pastas vistas: ${o.join(", ") || "nenhuma"}.`,
  };
  function Yt({
    dom: e,
    estado: o,
    salvar: t,
    ui: a,
    ruidos: r,
    sleep: n,
    teams: s,
  }) {
    let u = !1,
      f = 0,
      m = null,
      d = null,
      h = 0,
      P = new Set(),
      A = {
        confirmados: 0,
        corrigidos: 0,
        escolhidos: 0,
        pulados: 0,
        automaticos: 0,
      },
      x = (v) => t.registro(_t(o.registro(), v, o.config().maxRegistro));
    function C(v) {
      let y = u;
      if (((u = !1), f++, m)) {
        let E = m;
        (m = null), E({ cancelado: !0 });
      }
      y &&
        (a.status(v, "aviso"),
        a.mostrarTriagem({ modo: "parado", contadores: { ...A } }));
    }
    function M(v) {
      if (v.tipo === "pausar")
        return u ? (C("Pausado pelo atendente."), !0) : !1;
      if (!m || !d) return !1;
      let y = null;
      if (v.tipo === "confirmar") {
        if (!d.sugestao) return !1;
        y = { pasta: d.sugestao, acao: "confirmou" };
      } else if (v.tipo === "confirmar_teams") {
        let T = d.sugestaoTeams;
        if (!T || !o.pastas().some((B) => B.nome === T.pasta)) return !1;
        y = { pasta: T.pasta, acao: "escolheu", fonte: "copilot_teams" };
      } else if (v.tipo === "escolher") {
        let T = d.alternativas[v.indice];
        if (!T) return !1;
        y = { pasta: T.nome, acao: d.sugestao ? "corrigiu" : "escolheu" };
      } else v.tipo === "pular" && (y = { pasta: null, acao: "pulou" });
      if (!y) return !1;
      let E = m;
      return (m = null), E(y), !0;
    }
    async function z(v) {
      let y = () => u && v === f,
        E = o.config(),
        T = e.proximoTicket(P);
      if ((T || (e.rolarLista(), await n(1e3), (T = e.proximoTicket(P))), !T)) {
        (u = !1),
          a.mostrarTriagem({ modo: "concluido", contadores: { ...A } }),
          a.status("Lista concluída.", "ok");
        return;
      }
      a.mostrarTriagem({ modo: "carregando", ticket: T, contadores: { ...A } });
      let B = await e.abrirTicket(T, E.esperas);
      if (!y()) return;
      if (B !== "ok") {
        P.add(T),
          h++,
          x(tt({ ticketHash: mt(T), acao: "falha_carregar", temResumo: !1 })),
          a.log(`Ticket ${T} não carregou (${B}).`),
          h >= E.maxFalhasSeguidas &&
            C(`${h} tickets seguidos não carregaram. Verifique o Blip.`);
        return;
      }
      (h = 0), e.liberarFoco();
      let V = await e.garantirResumo(E.esperas.resumo);
      if (!y()) return;
      if (e.lerTicketAberto() !== T) {
        C("O ticket aberto mudou. Nada foi movido.");
        return;
      }
      let c = V ? e.lerResumo() : null,
        { mensagens: S } = Ht(e.lerMensagens(), {
          padroesRuido: r,
          maxTotal: E.maxMensagens,
          maxAntesDivisor: E.maxAntesDivisor,
        }),
        i = Wt(
          {
            motivo: c?.motivo || null,
            anteriores: c?.motivosAnteriores || null,
            mensagensCliente: S.filter((R) => R.lado === "cliente").map(
              (R) => R.texto,
            ),
          },
          E.pesos,
        ),
        p = Xt(i, o.pastas(), o.modelo(), E),
        b = St(p.ranking, p.sugestao),
        w = p.ranking[0]?.p ?? null,
        $ = !p.sugestao && p.porque.length ? p.ranking[0].nome : null,
        k = { sugestao: p.sugestao, alternativas: b, sugestaoTeams: null };
      d = k;
      let q = {
        modo: p.sugestao ? "sugestao" : "escolha",
        ticket: T,
        sugestao: p.sugestao,
        palpite: $,
        confianca: p.sugestao || $ ? w : null,
        porque: p.porque,
        motivo: c?.motivo || null,
        temResumo: !!c,
        alternativas: b,
        contadores: { ...A },
        auto: !1,
      };
      // Envio automático: só com sugestão e confiança >= limite escolhido.
      let auto =
        E.autoEnviar === !0 &&
        !!p.sugestao &&
        w != null &&
        w >= E.autoConfianca;
      auto && ((q.auto = !0), (q.autoAtrasoMs = E.autoAtrasoMs));
      a.mostrarTriagem(q);
      let D = new Promise((R) => {
          m = R;
        }),
        K = null,
        autoTimer = auto
          ? setTimeout(() => {
              if (!y() || d !== k || !m) return;
              let R = m;
              (m = null),
                R({ pasta: p.sugestao, acao: "automatico", fonte: "auto" });
            }, E.autoAtrasoMs)
          : null;
      if (!p.sugestao && E.copilotTeams === !0)
        try {
          K =
            s?.consultar({
              ticket: T,
              pastas: o.pastas().map((R) => R.nome),
              motivo: c?.motivo,
              mensagens: S,
            }) || null;
        } catch (R) {
          a.log(`Ponte do Teams falhou: ${R?.message || R}`);
        }
      K
        ? (a.mostrarTriagem({ ...q, teams: "consultando" }),
          K.resposta.then((R) => {
            !y() ||
              d !== k ||
              !m ||
              e.lerTicketAberto() !== T ||
              ((k.sugestaoTeams =
                R && o.pastas().some((ne) => ne.nome === R.pasta) ? R : null),
              a.mostrarTriagem({
                ...q,
                teams: k.sugestaoTeams ? "sugeriu" : "indisponivel",
                sugestaoTeams: k.sugestaoTeams,
              }));
          }))
        : !p.sugestao &&
          E.copilotTeams === !0 &&
          a.mostrarTriagem({ ...q, teams: "indisponivel" });
      let L = await D;
      if ((clearTimeout(autoTimer), K && K.cancelar(), d === k && (d = null), L.cancelado || !y()))
        return;
      let ft = {
        ticketHash: mt(T),
        sugerida: p.sugestao,
        confianca: w,
        temResumo: !!c,
        palpite: $,
        sugeridaTeams: k.sugestaoTeams?.pasta ?? null,
      };
      if (L.acao === "pulou") {
        P.add(T),
          A.pulados++,
          x(tt({ ...ft, acao: "pulou" })),
          a.log(`Ticket ${T} pulado.`);
        return;
      }
      if (e.lerTicketAberto() !== T) {
        C("O ticket aberto mudou. Nada foi movido.");
        return;
      }
      a.status(`Movendo para ${L.pasta}…`, "");
      let ot = await e.moverParaPasta(T, L.pasta, E.esperas.mover);
      if (ot.status !== "movido") {
        C(
          (ke[ot.status] || (() => "Falha ao mover. Nada foi movido."))(
            L.pasta,
            ot.pastasVistas || [],
          ),
        );
        return;
      }
      P.add(T),
        // Envio automático não ensina o modelo: só decisões humanas reforçam.
        L.acao !== "automatico" && t.modelo(Zt(o.modelo(), i, L.pasta)),
        x(tt({ ...ft, final: L.pasta, acao: L.acao, fonte: L.fonte })),
        A[
          {
            confirmou: "confirmados",
            corrigiu: "corrigidos",
            escolheu: "escolhidos",
            automatico: "automaticos",
          }[L.acao]
        ]++,
        a.log(
          L.acao === "automatico"
            ? `Ticket ${T} enviado sozinho para ${L.pasta} (${U(w)}).`
            : `Ticket ${T} movido para ${L.pasta}.`,
        ),
        a.status("Em execução.", "ok");
    }
    async function l() {
      if (u) return;
      if (o.pastas().length < 2) {
        a.status("Cadastre pelo menos 2 pastas antes de iniciar.", "erro");
        return;
      }
      let v = e.testeSaude();
      if (v.length) {
        a.status(`Blip mudou: ${v.join(", ")} não encontrado.`, "erro");
        return;
      }
      u = !0;
      let y = ++f;
      for (h = 0, a.status("Em execução.", "ok"); u && y === f; )
        try {
          await z(y);
        } catch (E) {
          a.log(`Erro inesperado: ${E?.message || E}`),
            y === f &&
              C(
                "Erro inesperado. Confira o ticket no Blip: ele pode ter sido movido.",
              );
        }
    }
    return {
      iniciar: l,
      pausar: C,
      decidir: M,
      get rodando() {
        return u;
      },
    };
  }
  function Qt(e, o) {
    if (!o.includes(e?.pasta)) return null;
    let t = [],
      a = new Set(),
      r = new Set(o.map(N));
    for (let n of Array.isArray(e.palavrasChave) ? e.palavrasChave : []) {
      if (typeof n != "string") continue;
      let s = n.trim().replace(/\s+/g, " ");
      if (s.length > 60 || !/^[\p{L}]+(?:[ -][\p{L}]+){0,4}$/u.test(s))
        continue;
      let u = I(s);
      if (
        !(!Z(s).length || a.has(u) || r.has(N(s))) &&
        (a.add(u), t.push(s), t.length === 2)
      )
        break;
    }
    return { pasta: e.pasta, palavrasChave: t };
  }
  var te = 55e3,
    Te = 7500;
  function ee(e) {
    return String(e || "")
      .replace(/(?:https?:\/\/|www\.)\S+/gi, "[link]")
      .replace(/[\w.+-]+@[\w.-]+\.[\w-]+/g, "[email]")
      .replace(
        /\b(?:cpf|cnpj|titular|nome(?: completo)?|senha|chave pix|c[oó]digo(?: de (?:acesso|seguran[cç]a))?)\s*[:=]\s*[^\r\n;]+/gi,
        "[dado]",
      )
      .replace(
        /\b(?:[Mm]eu nome (?:é|e)|[Mm]e chamo)\s+[A-ZÀ-Ý][\p{L}'-]*(?:\s+(?:d[aeo]s?\s+)?[A-ZÀ-Ý][\p{L}'-]*){0,3}/gu,
        "[nome]",
      )
      .replace(/\bR\$\s*[\d.,]+/gi, "[valor]")
      .replace(/\+?\d[\d.()/\s-]*\d|\d/g, "[num]")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 600);
  }
  function oe(e, o, t) {
    return {
      consultar({ ticket: a, pastas: r, motivo: n, mensagens: s }) {
        let u = o.dataset,
          f = Date.now(),
          m = Number(u.teamsPulso);
        if (!e.crypto?.randomUUID || !m || f - m > Te) return null;
        let d = s
            .filter((l) => l.lado === "cliente" && !l.midia)
            .slice(-10)
            .map((l) => ee(l.texto))
            .filter(Boolean),
          h = ee(n);
        if (!h && !d.length) return null;
        let P = e.crypto.randomUUID();
        delete u.teamsEmConsulta, delete u.teamsResposta;
        let A = JSON.stringify({
          id: P,
          expira: f + te,
          pastas: r,
          motivo: h,
          mensagens: d,
        });
        u.teamsPedido = A;
        let x,
          C = new Promise((l) => {
            x = l;
          });
        function M(l = null) {
          clearInterval(z),
            u.teamsPedido === A &&
              (delete u.teamsPedido,
              delete u.teamsResposta,
              delete u.teamsEmConsulta),
            x(l);
        }
        let z = setInterval(() => {
          if (!o.isConnected || t() !== a || Date.now() - f >= te) {
            M();
            return;
          }
          if (!u.teamsResposta) return;
          let l;
          try {
            l = JSON.parse(u.teamsResposta);
          } catch {
            return;
          }
          l?.id === P && M(Qt(l, r));
        }, 250);
        return { resposta: C, cancelar: M };
      },
    };
  }
  var ae = (e) => e && typeof e.nome == "string" && Array.isArray(e.palavras);
  function re(e = document, o = window) {
    typeof o.__rfCopilotoCleanup == "function" && o.__rfCopilotoCleanup();
    let t = zt(o.localStorage),
      a = {
        ...t,
        gravar(l, v) {
          let y = t.gravar(l, v);
          return (
            y ||
              x?.status(
                "Não foi possível salvar no navegador. O que foi feito nesta sessão pode ser perdido.",
                "erro",
              ),
            y
          );
        },
      },
      r = a.ler(j.pastas, []);
    (!Array.isArray(r) || !r.every(ae)) && (r = []);
    let n = a.ler(j.modelo, null);
    it(n) || (n = st());
    let s = a.ler(j.config, {});
    (!s || typeof s != "object") && (s = {});
    let u = nt(s),
      f = a.ler(j.registro, []);
    Array.isArray(f) || (f = []),
      (f = f.filter((l) => l && typeof l == "object"));
    let m = null,
      d = null,
      h = () => x.mostrarPastas(r, m),
      P = () => {
        a.gravar(j.pastas, r), h();
      },
      x = Bt(e, {
        async iniciar() {
          try {
            d = await o.navigator?.wakeLock?.request?.("screen");
          } catch {
            d = null;
          }
          await C.iniciar();
          try {
            await d?.release?.();
          } catch {}
          d = null;
        },
        pausar: () => C.pausar("Pausado pelo atendente."),
        confirmarTeams: () => C.decidir({ tipo: "confirmar_teams" }),
        decidir: (l) => C.decidir(l),
        fechar: () => o.__rfCopilotoCleanup?.(),
        salvarPasta(l) {
          let v = kt(l, r);
          return (
            v.ok &&
              ((r = [...r, { nome: l.nome.trim(), palavras: l.palavras }]),
              (m = null),
              P()),
            v
          );
        },
        removerPasta(l) {
          (r = r.filter((v) => v.nome !== l)), P();
        },
        adicionarPalavra(l, v) {
          let y = wt(r, l, v);
          return y.ok ? ((r = y.pastas), P(), { ok: !0 }) : y;
        },
        removerPalavra(l, v) {
          (r = Pt(r, l, v)), P();
        },
        async conferirPastas() {
          let l = G(e)[0];
          if (!l) {
            x.status(
              'Nenhum ticket na lista para abrir o menu "Mover para".',
              "aviso",
            );
            return;
          }
          let v = await $t(l, e);
          if (!v) {
            x.status('O menu "Mover para" não abriu.', "erro");
            return;
          }
          (m = Tt(r, v)), h(), x.status("Pastas conferidas com o Blip.", "ok");
        },
        exportar: () =>
          pt(
            e,
            "rod-bot-copiloto-aprendizado.json",
            JSON.stringify({ versao: 1, pastas: r, modelo: n }),
            "application/json",
          ),
        importar(l) {
          try {
            let v = JSON.parse(l);
            if (
              !Array.isArray(v.pastas) ||
              !v.pastas.every(ae) ||
              !it(v.modelo)
            )
              throw new Error("formato");
            (r = v.pastas),
              (n = v.modelo),
              a.gravar(j.modelo, n),
              P(),
              x.status("Aprendizado importado.", "ok");
          } catch {
            x.status("Arquivo inválido. Nada foi alterado.", "erro");
          }
        },
        zerar() {
          o.confirm(
            "Zerar todo o aprendizado? As pastas cadastradas continuam.",
          ) &&
            ((n = st()),
            a.gravar(j.modelo, n),
            x.status("Aprendizado zerado.", "ok"));
        },
        salvarConfig(l) {
          (s = { ...s, ...l }),
            (u = nt(s)),
            a.gravar(j.config, s),
            x.mostrarConfig(u),
            x.status("Ajustes salvos.", "ok");
        },
        exportarCSV: () =>
          pt(
            e,
            "rod-bot-copiloto-registro.csv",
            Nt(f),
            "text/csv;charset=utf-8",
          ),
      }),
      C = Yt({
        dom: {
          testeSaude: () => jt(e),
          proximoTicket: (l) => Rt(l, e),
          abrirTicket: (l, v) => Dt(l, e, v),
          lerTicketAberto: () => J(e),
          garantirResumo: (l) => ht(e, l),
          lerResumo: () => bt(e),
          lerMensagens: () => xt(e),
          moverParaPasta: (l, v, y) => qt(l, v, e, y),
          rolarLista: () => Lt(e),
          liberarFoco: () => Mt(e),
        },
        estado: {
          pastas: () => r,
          modelo: () => n,
          config: () => u,
          registro: () => f,
        },
        salvar: {
          modelo: (l) => {
            (n = l), a.gravar(j.modelo, l);
          },
          registro: (l) => {
            (f = l),
              a.gravar(j.registro, l),
              x.mostrarRegistro(ct(l), lt(l), ut(l));
          },
        },
        ui: x,
        teams: oe(o, x.raiz, () => J(e)),
        ruidos: dt.padroes,
        sleep: H,
      }),
      M = Ft(e, (l) => C.decidir(l)),
      z = () => {
        e.hidden &&
          C.rodando &&
          x.status("Mantenha esta aba visível enquanto o laço roda.", "aviso");
      };
    return (
      e.addEventListener("visibilitychange", z),
      h(),
      x.mostrarRegistro(ct(f), lt(f), ut(f)),
      x.mostrarConfig(u),
      e.querySelector(g.painelRodBot) &&
        x.status(
          "O rod bot está aberto. Não rode os dois laços ao mesmo tempo.",
          "aviso",
        ),
      (o.__rfCopilotoCleanup = () => {
        C.pausar("Painel fechado."),
          M.desligar(),
          e.removeEventListener("visibilitychange", z),
          x.destruir();
        try {
          d?.release?.();
        } catch {}
        delete o.__rfCopilotoCleanup;
      }),
      { painel: x, laco: C }
    );
  }
  re();
})();
