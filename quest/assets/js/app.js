/**
 * autor: Prof. Marcos V. Moraes
 * proposito: Controlador da aplicacao de 8 Missoes Simbioticas + Oficina Capstone (jornada minima de 3 horas)
 * criado: 2026-11-12T16:24:00-03:00
 * atualizado: 2026-11-12T19:38:00-03:00
 * versao: 2.1.0
 */

import { MISSOES } from "./missoes.js";

const TOTAL_MISSOES = MISSOES.length; // 8
const STORAGE_KEY = "estudio-oito:fusao-snc-v2";
const MSG_UI_NEUTRA = "Ajuste a Bancada de UI para gerar o token.";
const MSG_JS_NEUTRA = 'Programe e clique em "Testar Código JS & Gerar Token" para gerar o token.';
const $ = (id) => document.getElementById(id);

function criarEstadoInicial() {
  return {
    squad: {
      nome: "Squad Alpha",
      ui: "Arquiteto(a) UI",
      js: "Dev JavaScript",
      po: "Conselheiro(a) PO / QA",
    },
    inicio: Date.now(),
    concluidoEm: null,
    etapaAtual: 0,
    concluidas: Array(TOTAL_MISSOES).fill(false),
    geradoUI: Array(TOTAL_MISSOES).fill(false),
    geradoJS: Array(TOTAL_MISSOES).fill(false),
    erros: Array(TOTAL_MISSOES).fill(0),
    dicas: Array(TOTAL_MISSOES).fill(0),
    sintaxe: Array(TOTAL_MISSOES).fill(0),
    codigosJS: MISSOES.map((m) => m.codigoInicialJS),
  };
}

let estado = carregarEstado();

function garantirArrayTamanho(valor, fallback) {
  return Array.isArray(valor) && valor.length === TOTAL_MISSOES ? valor : fallback;
}

function carregarEstado() {
  try {
    const base = criarEstadoInicial();
    const salvo = localStorage.getItem(STORAGE_KEY);
    if (!salvo) return base;
    const parsed = JSON.parse(salvo);
    if (!Array.isArray(parsed.concluidas) || parsed.concluidas.length !== TOTAL_MISSOES) {
      return base;
    }
    const merged = {
      ...base,
      ...parsed,
      concluidas: garantirArrayTamanho(parsed.concluidas, base.concluidas),
      geradoUI: garantirArrayTamanho(parsed.geradoUI, base.geradoUI),
      geradoJS: garantirArrayTamanho(parsed.geradoJS, base.geradoJS),
      erros: garantirArrayTamanho(parsed.erros, base.erros),
      dicas: garantirArrayTamanho(parsed.dicas, base.dicas),
      sintaxe: garantirArrayTamanho(parsed.sintaxe, base.sintaxe),
      codigosJS: garantirArrayTamanho(parsed.codigosJS, base.codigosJS),
    };
    // Preserve compatibility with saved v2 states that lack geradoUI/geradoJS
    for (let i = 0; i < TOTAL_MISSOES; i++) {
      if (merged.concluidas[i]) {
        merged.geradoUI[i] = true;
        merged.geradoJS[i] = true;
      }
    }
    return merged;
  } catch {
    return criarEstadoInicial();
  }
}

function salvarEstado() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(estado));
  } catch {
    /* localStorage indisponivel */
  }
}

function escaparHtml(str) {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/* ---------- GERADOR DE CODIGO VERIFICAVEL DO PLACAR (SNC1.) ---------- */

export function calcularAssinatura(payloadStr) {
  let h = 2166136261;
  const texto = payloadStr + "|ESTUDIO-OITO-SNC-2026";
  for (let i = 0; i < texto.length; i++) {
    h ^= texto.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(16).toUpperCase().padStart(8, "0");
}

function gerarCodigoPlacar() {
  const concluidasCount = estado.concluidas.filter(Boolean).length;
  const fim = estado.concluidoEm || Date.now();
  const segundos = Math.max(1, Math.floor((fim - estado.inicio) / 1000));
  const payload = {
    v: 3,
    sq: estado.squad.nome,
    membros: [estado.squad.ui, estado.squad.js, estado.squad.po].filter(Boolean),
    ok: estado.concluidas.map((c) => (c ? 1 : 0)),
    n: concluidasCount,
    erros: estado.erros,
    dicas: estado.dicas,
    sx: estado.sintaxe,
    seg: segundos,
  };
  const json = JSON.stringify(payload);
  const b64 = btoa(unescape(encodeURIComponent(json)));
  const sig = calcularAssinatura(b64);
  return `SNC1.${b64}.${sig}`;
}

/* ---------- RELOGIO DA TOOLBAR ---------- */

setInterval(() => {
  const fim = estado.concluidoEm || Date.now();
  const seg = Math.max(0, Math.floor((fim - estado.inicio) / 1000));
  const m = String(Math.floor(seg / 60)).padStart(2, "0");
  const s = String(seg % 60).padStart(2, "0");
  const el = $("toolbar-tempo");
  if (el) el.textContent = `${m}:${s}`;
}, 1000);

/* ---------- RENDERIZACAO GERAL ---------- */

function renderizarTudo() {
  const concluidasCount = estado.concluidas.filter(Boolean).length;
  $("trilha-progresso").textContent = `${concluidasCount}/${TOTAL_MISSOES}`;
  $("toolbar-squad").textContent = `${estado.squad.nome} (${estado.squad.ui} + ${estado.squad.js} + ${estado.squad.po})`;

  const pilotos = [
    "M1: UI Escala Modular | JS Múltiplos de 4",
    "M2: Troca piloto | UI Peso Visual | JS .sort()",
    "M3: UI Ritmo 8px | JS Coordenadas Y",
    "M4: UI Estados WCAG | JS Máquina de Vagas",
    "M5: UI Jakob & Dark Patterns | JS .filter()",
    "M6: UI Wireframe Low-Fi | JS .map()",
    "M7: QA Cruzado | UI Nielsen | JS Validação",
    "M8: Boss | UI Auto Layout | JS 328x296-N11",
  ];
  $("toolbar-piloto").textContent = pilotos[estado.etapaAtual] || "Desafio Final & Entrega!";

  // Resumo Squad
  $("resumo-squad").innerHTML = `
    <div><strong>Squad:</strong> ${escaparHtml(estado.squad.nome)}</div>
    <div><strong>UI/Figma:</strong> ${escaparHtml(estado.squad.ui)}</div>
    <div><strong>Web/JS:</strong> ${escaparHtml(estado.squad.js)}</div>
    <div><strong>PO/QA (Sem PC):</strong> ${escaparHtml(estado.squad.po)}</div>
  `;

  // Lista da Trilha
  const listaTrilha = $("lista-trilha");
  listaTrilha.innerHTML = "";
  MISSOES.forEach((m, idx) => {
    const liberada = idx === 0 || estado.concluidas[idx - 1] || estado.concluidas[idx];
    const concluida = estado.concluidas[idx];
    const li = document.createElement("li");
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `trail-btn ${estado.etapaAtual === idx ? "is-current" : ""} ${concluida ? "is-done" : ""}`;
    btn.disabled = !liberada;
    btn.innerHTML = `
      <span class="trail-status">${concluida ? "[OK]" : liberada ? `[M${idx + 1}]` : "[LOCK]"}</span>
      <span>
        <strong>Missão ${idx + 1}</strong>
        <span class="trail-sub">${escaparHtml(m.pilarUI.split("+")[0].trim())}</span>
      </span>
    `;
    btn.addEventListener("click", () => {
      estado.etapaAtual = idx;
      salvarEstado();
      renderizarTudo();
    });
    li.append(btn);
    listaTrilha.append(li);
  });

  if (concluidasCount === TOTAL_MISSOES) {
    const liFinal = document.createElement("li");
    const btnFinal = document.createElement("button");
    btnFinal.type = "button";
    btnFinal.className = `trail-btn ${estado.etapaAtual === TOTAL_MISSOES ? "is-current" : ""} is-done`;
    btnFinal.innerHTML = `
      <span class="trail-status">[WIN]</span>
      <span>
        <strong>Oficina &amp; Placar</strong>
        <span class="trail-sub">Desafio Final</span>
      </span>
    `;
    btnFinal.addEventListener("click", () => {
      estado.etapaAtual = TOTAL_MISSOES;
      salvarEstado();
      renderizarTudo();
    });
    liFinal.append(btnFinal);
    listaTrilha.append(liFinal);
  }

  // Mochila
  const mochila = $("lista-mochila");
  const itensMochila = MISSOES.filter((_, i) => estado.concluidas[i]);
  if (!itensMochila.length) {
    mochila.innerHTML = `<li style="color:var(--tx-3);">Destrave as fechaduras para acumular os 8 pares de tokens (UI + JS) do Squad.</li>`;
  } else {
    mochila.innerHTML = itensMochila
      .map(
        (m) => `
      <li>
        <strong>M${m.id + 1}:</strong> ${escaparHtml(m.mochilaResumo)}<br>
        <code>${escaparHtml(m.tokenUIEsperado)}</code> + <code>${escaparHtml(m.tokenJSEsperado)}</code>
      </li>`
      )
      .join("");
  }

  if (estado.etapaAtual === TOTAL_MISSOES) {
    renderizarTelaFinal();
    $("secao-cofre").hidden = true;
    if ($("secao-dica")) $("secao-dica").hidden = true;
    $("cofre-badge").textContent = "8/8 Concluídas";
    return;
  }

  $("secao-cofre").hidden = false;
  if ($("secao-dica")) $("secao-dica").hidden = false;
  const missao = MISSOES[estado.etapaAtual];
  $("cofre-badge").textContent = `Fechadura ${estado.etapaAtual + 1}/${TOTAL_MISSOES}`;

  if (estado.concluidas[estado.etapaAtual]) {
    $("input-token-ui").value = missao.tokenUIEsperado;
    $("input-token-js").value = missao.tokenJSEsperado;
    $("input-token-po").value = missao.tokenPOEsperado;
    $("status-token-ui").innerHTML = `<strong style="color:var(--ok);">[OK] ${escaparHtml(missao.tokenUIEsperado)}</strong>`;
    $("status-token-js").innerHTML = `<strong style="color:var(--ok);">[OK] ${escaparHtml(missao.tokenJSEsperado)}</strong>`;
    $("feedback-fechadura").innerHTML = `<div class="callout callout-ok"><strong>[OK] Fechadura ${estado.etapaAtual + 1} já aberta!</strong> Vocês podem revisar a bancada ou avançar na trilha à esquerda.</div>`;
  } else {
    $("input-token-ui").value = "";
    $("input-token-js").value = "";
    $("input-token-po").value = "";
    $("status-token-ui").textContent = MSG_UI_NEUTRA;
    $("status-token-js").textContent = MSG_JS_NEUTRA;
    $("feedback-fechadura").innerHTML = "";
  }

  const dicaJaRevelada = estado.dicas[estado.etapaAtual] > 0;
  $("caixa-dica-texto").textContent = dicaJaRevelada
    ? missao.dica
    : "Consulte primeiro a Folha A4 #1 do Conselheiro. Se o Squad precisar da fórmula completa, clique em Revelar Dica.";
  $("btn-pedir-dica").textContent = dicaJaRevelada ? "Dica revelada" : "Revelar Dica (-10 pts)";
  $("btn-pedir-dica").disabled = dicaJaRevelada;

  renderizarCanvasMissao(missao);
}

/* ---------- RENDERIZACAO DE CADA MISSAO NO CANVAS CENTRAL ---------- */

function renderizarCanvasMissao(missao) {
  const host = $("canvas-conteudo");
  const concluida = Boolean(estado.concluidas[missao.id]);
  const badgeStyleOk = concluida ? ' style="background:var(--ok-soft); color:var(--ok);"' : "";
  const textoBadgeUI = concluida ? `Token: ${escaparHtml(missao.tokenUIEsperado)}` : "Aguardando ajuste...";
  const textoBadgeJS = concluida ? `Token: ${escaparHtml(missao.tokenJSEsperado)}` : "Aguardando testes...";
  host.innerHTML = `
    <section class="mission-head">
      <div class="mission-badges">
        <span class="chip chip-component">${escaparHtml(missao.ato)}</span>
        <span class="chip chip-select">[UI/UX] ${escaparHtml(missao.pilarUI)}</span>
        <span class="chip chip-js">[DEV JS] ${escaparHtml(missao.pilarJS)}</span>
      </div>
      <h1>${escaparHtml(missao.titulo)}</h1>
      <p class="mission-brief">${escaparHtml(missao.briefing)}</p>
    </section>

    <div class="workbench-split">
      <!-- METADE ESQUERDA: BANCADA DE UI/UX -->
      <section class="bench-card bench-card-ui" aria-label="Bancada do Arquiteto de UI e UX">
        <div class="bench-head">
          <h2><span class="chip chip-select">1. BANCADA UI/UX</span> Especificação Visual</h2>
          <span class="token-pill" id="badge-token-ui"${badgeStyleOk}>${textoBadgeUI}</span>
        </div>
        <div class="bench-body" id="corpo-bancada-ui"></div>
      </section>

      <!-- METADE DIREITA: BANCADA DE JAVASCRIPT -->
      <section class="bench-card bench-card-js" aria-label="Bancada do Engenheiro JavaScript">
        <div class="bench-head">
          <h2><span class="chip chip-js">2. BANCADA DEV JS</span> Algoritmo &amp; DOM</h2>
          <span class="token-pill" id="badge-token-js"${badgeStyleOk}>${textoBadgeJS}</span>
        </div>
        <div class="bench-body">
          <div class="code-editor-wrap">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <label class="ws-label" for="editor-js" style="margin:0;">Código JavaScript da Missão ${missao.id + 1}:</label>
              <div style="display:flex; gap:6px;">
                <button type="button" class="btn btn-ghost btn-sm" id="btn-reset-js">Restaurar inicial</button>
                <button type="button" class="btn btn-secondary btn-sm" id="btn-ajuda-js" title="Preenche a estrutura guiada se o grupo travar na sintaxe">Completar sintaxe (-5 pts)</button>
              </div>
            </div>
            <textarea class="code-editor" id="editor-js" spellcheck="false">${escaparHtml(estado.codigosJS[missao.id])}</textarea>
            <div style="display:flex; gap:8px; align-items:center; justify-content:space-between; flex-wrap:wrap;">
              <button type="button" class="btn btn-primary" id="btn-rodar-js">
                Testar Código JS &amp; Gerar Token
              </button>
              <button type="button" class="btn btn-secondary btn-sm" id="btn-enviar-token-js" ${concluida ? "" : "disabled"}>
                Focar no Cofre &rarr;
              </button>
            </div>
            <div class="console-output" id="saida-console-js">
              <span>${concluida ? `[OK] Missão já concluída com token <strong>${escaparHtml(missao.tokenJSEsperado)}</strong>.` : 'Console pronto. Clique em "Testar Código JS".'}</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  `;

  if (concluida) {
    $("btn-enviar-token-js").onclick = () => $("input-token-po").focus();
  }

  const corpoUI = $("corpo-bancada-ui");
  if (missao.id === 0) montarBancadaUI_M1(corpoUI);
  if (missao.id === 1) montarBancadaUI_M2(corpoUI);
  if (missao.id === 2) montarBancadaUI_M3(corpoUI);
  if (missao.id === 3) montarBancadaUI_M4(corpoUI);
  if (missao.id === 4) montarBancadaUI_M5(corpoUI);
  if (missao.id === 5) montarBancadaUI_M6(corpoUI);
  if (missao.id === 6) montarBancadaUI_M7(corpoUI);
  if (missao.id === 7) montarBancadaUI_M8(corpoUI);

  const editor = $("editor-js");
  editor.addEventListener("input", () => {
    estado.codigosJS[missao.id] = editor.value;
    salvarEstado();
  });

  $("btn-reset-js").addEventListener("click", () => {
    editor.value = missao.codigoInicialJS;
    estado.codigosJS[missao.id] = editor.value;
    salvarEstado();
  });

  $("btn-ajuda-js").addEventListener("click", async () => {
    editor.value = missao.solucaoGuiadaJS;
    estado.codigosJS[missao.id] = editor.value;
    estado.sintaxe[missao.id] = (estado.sintaxe[missao.id] || 0) + 1;
    salvarEstado();
    await executarTestesJS(missao);
  });

  $("btn-rodar-js").addEventListener("click", () => executarTestesJS(missao));
}

function atualizarTokenUI(token, valido, mensagem) {
  const badge = $("badge-token-ui");
  const statusCofre = $("status-token-ui");
  if (valido) {
    estado.geradoUI[estado.etapaAtual] = true;
    salvarEstado();
    badge.textContent = `Token: ${token}`;
    badge.style.background = "var(--ok-soft)";
    badge.style.color = "var(--ok)";
    statusCofre.innerHTML = `<strong style="color:var(--ok);">[OK] ${escaparHtml(token)}</strong>`;
    $("input-token-ui").value = token;
  } else {
    badge.textContent = "Ajuste incompleto";
    badge.style.background = "var(--warn-soft)";
    badge.style.color = "var(--warn)";
    statusCofre.textContent = mensagem || "Continue ajustando a bancada de UI.";
  }
}

/* ---------- M1: ESCALA TIPOGRAFICA MODULAR ---------- */
function montarBancadaUI_M1(container) {
  container.innerHTML = `
    <div class="sim-frame">
      <div class="live-event-card" style="padding:20px;">
        <div style="font-size:12px; font-weight:700; color:#2f5bd3;">WORKSHOP</div>
        <div id="m1-prev-titulo" style="font-size:15px; line-height:20px; font-weight:700; margin-top:6px;">Dia do Design</div>
        <div id="m1-prev-data" style="font-size:15px; font-weight:600; color:#444c5a; margin-top:6px;">16 de maio, Auditório B</div>
        <div style="font-size:16px; color:#5c6474; margin-top:12px;">Oficinas, revisão de portfólio e integração com devs JS.</div>
      </div>
    </div>
    <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:8px;">
      <div>
        <label class="ws-label" for="m1-titulo">Título (+3 passos):</label>
        <select class="field" id="m1-titulo">
          <option value="15">15px</option>
          <option value="24">24px</option>
          <option value="31">31.25px</option>
          <option value="32">32px</option>
          <option value="36">36px</option>
        </select>
      </div>
      <div>
        <label class="ws-label" for="m1-data">Data (+1 passo):</label>
        <select class="field" id="m1-data">
          <option value="15">15px</option>
          <option value="16">16px</option>
          <option value="20">20px</option>
          <option value="24">24px</option>
        </select>
      </div>
      <div>
        <label class="ws-label" for="m1-lh">Entrelinha do Título:</label>
        <select class="field" id="m1-lh">
          <option value="32">32px</option>
          <option value="39">39.06px</option>
          <option value="40">40px</option>
          <option value="48">48px</option>
        </select>
      </div>
    </div>
    <div id="m1-fb" class="callout callout-info">Ajuste os 3 seletores seguindo a regra da Escala Modular na Folha A4 #1.</div>
  `;
  const check = () => {
    const t = $("m1-titulo").value;
    const d = $("m1-data").value;
    const lh = $("m1-lh").value;
    $("m1-prev-titulo").style.fontSize = `${t}px`;
    $("m1-prev-titulo").style.lineHeight = `${lh}px`;
    $("m1-prev-data").style.fontSize = `${d}px`;

    if (t === "32" && d === "20" && lh === "40") {
      const tok = "UI1-32-20-40";
      $("m1-fb").className = "callout callout-ok";
      $("m1-fb").innerHTML = `<strong>[OK] Escala Modular perfeita!</strong> Token gerado: <code>${tok}</code>.`;
      atualizarTokenUI(tok, true);
    } else {
      const msg =
        t === "31" || lh === "39"
          ? "Vocês usaram o valor decimal bruto: a regra do Estúdio Oito arredonda todo tamanho e entrelinha para múltiplo de 4!"
          : lh === "48"
            ? "48px seria 1.5x (entrelinha de texto corrido). Títulos usam 1.25x arredondado para múltiplo de 4."
            : "Calculem cada valor: base 16px x 1.25 elevado ao número de passos; entrelinha do título = tamanho x 1.25; tudo arredondado para múltiplo de 4.";
      $("m1-fb").className = "callout callout-warn";
      $("m1-fb").textContent = msg;
      atualizarTokenUI("", false, msg);
    }
  };
  ["m1-titulo", "m1-data", "m1-lh"].forEach((id) => $(id).addEventListener("change", check));
}

/* ---------- M2: PESO VISUAL E ORDEM DE LEITURA ---------- */
function montarBancadaUI_M2(container) {
  container.innerHTML = `
    <p style="margin:0; font-size:13px; color:var(--tx-2);">
      Inspecione as 7 camadas do card abaixo. Ordene da mais pesada para a mais leve usando a regra: <strong>1º Tamanho &gt; 2º Peso da fonte &gt; 3º Contraste &gt; 4º Posição (F/Z)</strong>:
    </p>
    <table class="sheet-table" style="font-size:12px; width:100%; border-collapse:collapse;">
      <thead>
        <tr style="background:var(--ws-panel-alt);">
          <th style="padding:6px; border:1px solid var(--ws-border);">ID</th>
          <th style="padding:6px; border:1px solid var(--ws-border);">Elemento</th>
          <th style="padding:6px; border:1px solid var(--ws-border);">Tamanho</th>
          <th style="padding:6px; border:1px solid var(--ws-border);">Peso</th>
          <th style="padding:6px; border:1px solid var(--ws-border);">Contraste</th>
          <th style="padding:6px; border:1px solid var(--ws-border);">Posição</th>
        </tr>
      </thead>
      <tbody>
        <tr><td style="padding:5px; border:1px solid var(--ws-border);"><strong>A</strong></td><td style="padding:5px; border:1px solid var(--ws-border);">Tag "WORKSHOP"</td><td>12px</td><td>700</td><td>7.2:1</td><td>Topo Esq.</td></tr>
        <tr><td style="padding:5px; border:1px solid var(--ws-border);"><strong>B</strong></td><td style="padding:5px; border:1px solid var(--ws-border);">Título "Dia do Design"</td><td>32px</td><td>700</td><td>17.4:1</td><td>Topo</td></tr>
        <tr><td style="padding:5px; border:1px solid var(--ws-border);"><strong>C</strong></td><td style="padding:5px; border:1px solid var(--ws-border);">Data "16 de maio"</td><td>20px</td><td>600</td><td>8.6:1</td><td>Meio</td></tr>
        <tr><td style="padding:5px; border:1px solid var(--ws-border);"><strong>D</strong></td><td style="padding:5px; border:1px solid var(--ws-border);">Descrição do evento</td><td>16px</td><td>400</td><td>5.9:1</td><td>Meio</td></tr>
        <tr><td style="padding:5px; border:1px solid var(--ws-border);"><strong>E</strong></td><td style="padding:5px; border:1px solid var(--ws-border);">Botão "Inscrever-se"</td><td>16px</td><td>600</td><td>5.9:1</td><td>Base Esq.</td></tr>
        <tr><td style="padding:5px; border:1px solid var(--ws-border);"><strong>F</strong></td><td style="padding:5px; border:1px solid var(--ws-border);">Link "Ver programação"</td><td>16px</td><td>600</td><td>5.9:1</td><td>Base Dir.</td></tr>
        <tr><td style="padding:5px; border:1px solid var(--ws-border);"><strong>G</strong></td><td style="padding:5px; border:1px solid var(--ws-border);">Preço "Gratuito" (verde)</td><td>20px</td><td>600</td><td>5.4:1</td><td>Topo Dir.</td></tr>
      </tbody>
    </table>
    <div>
      <label class="ws-label" for="m2-ordem">Selecione a sequência das 7 letras na ordem de leitura:</label>
      <select class="field field-mono" id="m2-ordem">
        <option value="">-- Escolha a sequência analisada --</option>
        <option value="AGBCDEF">A-G-B-C-D-E-F</option>
        <option value="BGCEFDA">B-G-C-E-F-D-A</option>
        <option value="BCGDEFA">B-C-G-D-E-F-A</option>
        <option value="BCGFEDA">B-C-G-F-E-D-A</option>
        <option value="BCGEFDA">B-C-G-E-F-D-A</option>
      </select>
    </div>
    <div id="m2-fb" class="callout callout-info">Compare 1º Tamanho (32 &gt; 20 &gt; 16 &gt; 12), 2º Peso (600 &gt; 400), 3º Contraste (8.6 &gt; 5.4) e 4º Posição (Esq &gt; Dir).</div>
  `;
  $("m2-ordem").addEventListener("change", () => {
    const v = $("m2-ordem").value;
    if (v === "BCGEFDA") {
      const tok = "UI2-BCGEFDA";
      $("m2-fb").className = "callout callout-ok";
      $("m2-fb").innerHTML = `<strong>[OK] Ordem de leitura comprovada!</strong> Token gerado: <code>${tok}</code>.`;
      atualizarTokenUI(tok, true);
    } else {
      const msgs = {
        AGBCDEF: "Posição só desempata quando tamanho, peso e contraste empatam! A tag A tem apenas 12px.",
        BGCEFDA: "O verde chama atenção, mas matiz não é contraste: C tem 8.6:1 contra 5.4:1 de G!",
        BCGDEFA: "D, E e F têm 16px, mas E e F têm peso 600 (seminegrito) enquanto D tem peso 400!",
        BCGFEDA: "E e F empatam em tudo (16px, peso 600, 5.9:1). Pelo padrão F/Z, esquerda (E) vem antes da direita (F)!",
      };
      const msg = msgs[v] || "Escolha a sequência correta de 7 letras.";
      $("m2-fb").className = "callout callout-warn";
      $("m2-fb").textContent = msg;
      atualizarTokenUI("", false, msg);
    }
  });
}

/* ---------- M3: RITMO DE 8PX E COORDENADAS Y ---------- */
function montarBancadaUI_M3(container) {
  container.innerHTML = `
    <p style="margin:0; font-size:13px; color:var(--tx-2);">
      Aplique a Receita de Ritmo do Estúdio Oito e leia no Inspetor as coordenadas Y resultantes (Alturas fixas: Título = 40px, Data = 24px, Descrição = 48px):
    </p>
    <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">
      <div>
        <label class="ws-label" for="m3-pad">Padding do Card:</label>
        <select class="field" id="m3-pad">
          <option value="13">13px</option>
          <option value="16">16px</option>
          <option value="24">24px</option>
          <option value="32">32px</option>
        </select>
      </div>
      <div>
        <label class="ws-label" for="m3-g1">Espaço Título &rarr; Data:</label>
        <select class="field" id="m3-g1">
          <option value="5">5px</option>
          <option value="8">8px</option>
          <option value="16">16px</option>
        </select>
      </div>
      <div>
        <label class="ws-label" for="m3-g2">Espaço Data &rarr; Descrição:</label>
        <select class="field" id="m3-g2">
          <option value="8">8px</option>
          <option value="16">16px</option>
          <option value="21">21px</option>
        </select>
      </div>
      <div>
        <label class="ws-label" for="m3-g3">Espaço p/ Botão / Altura Botão:</label>
        <select class="field" id="m3-g3">
          <option value="11-37">11px / Botão 37px</option>
          <option value="24-44">24px / Botão 44px</option>
          <option value="24-48">24px / Botão 48px</option>
        </select>
      </div>
    </div>
    <div class="sim-frame" style="padding:14px; gap:10px;">
      <div id="m3-live-card" class="live-event-card" style="padding:13px;">
        <div style="font-size:20px; font-weight:800; line-height:24px;">Dia do Design</div>
        <div id="m3-prev-data" style="font-size:14px; color:var(--tx-2); margin-top:5px;">16 de maio, 14h</div>
        <div id="m3-prev-desc" style="font-size:13px; color:var(--tx-3); margin-top:8px;">Oficinas de Figma e desafios JS com os Squads.</div>
        <button id="m3-prev-btn" type="button" class="btn btn-primary" style="width:100%; min-height:37px; margin-top:11px;">Inscrever-se</button>
      </div>
      <div id="m3-inspetor" style="font-family:var(--ff-mono); font-size:12px; color:var(--ac-redline); font-weight:700;">
        [INSPETOR REDLINE] Ajuste os controles acima para medir Y...
      </div>
    </div>
    <div id="m3-fb" class="callout callout-info">Lembre da Gestalt (Proximidade): 8px dentro do grupo, 16px entre grupos, 24px antes da ação, padding 24px e botão 48px.</div>
  `;
  const ids = ["m3-pad", "m3-g1", "m3-g2", "m3-g3"];
  const check = () => {
    const pad = Number($("m3-pad").value);
    const g1 = Number($("m3-g1").value);
    const g2 = Number($("m3-g2").value);
    const [g3, btn] = $("m3-g3").value.split("-").map(Number);

    const yData = pad + 40 + g1;
    const yDesc = yData + 24 + g2;
    const yBtn = yDesc + 48 + g3;
    const h = yBtn + btn + pad;

    $("m3-live-card").style.padding = `${pad}px`;
    $("m3-prev-data").style.marginTop = `${g1}px`;
    $("m3-prev-desc").style.marginTop = `${g2}px`;
    $("m3-prev-btn").style.marginTop = `${g3}px`;
    $("m3-prev-btn").style.minHeight = `${btn}px`;
    $("m3-inspetor").textContent = `[INSPETOR] yData: ${yData}px | yDesc: ${yDesc}px | yBtn: ${yBtn}px | Altura Card: ${h}px`;

    if (pad === 24 && g1 === 8 && g2 === 16 && g3 === 24 && btn === 48) {
      const tok = `UI3-${yData}-${yDesc}-${yBtn}-${h}`;
      $("m3-fb").className = "callout callout-ok";
      $("m3-fb").innerHTML = `<strong>[OK] Ritmo de 8px cravado!</strong> Token gerado: <code>${tok}</code>.`;
      atualizarTokenUI(tok, true);
    } else {
      const msg = `Coordenadas atuais (${yData}-${yDesc}-${yBtn}-${h}) ainda não seguem a receita: Padding=24, Título>Data=8, Data>Descrição=16, Descrição>Botão=24 e Botão=48.`;
      $("m3-fb").className = "callout callout-warn";
      $("m3-fb").textContent = msg;
      atualizarTokenUI("", false, msg);
    }
  };
  ids.forEach((id) => $(id).addEventListener("change", check));
}

/* ---------- M4: OS 5 ESTADOS DO BOTAO & CONTRASTE WCAG ---------- */
function montarBancadaUI_M4(container) {
  container.innerHTML = `
    <p style="margin:0; font-size:13px; color:var(--tx-2);">
      Tabela de Contraste da Paleta Azul contra texto/card branco (<code>#FFFFFF</code>):<br>
      <code>400: 2.5:1</code> &middot; <code>500: 3.9:1</code> &middot; <code>600: 5.9:1</code> &middot; <code>700: 8.1:1</code> &middot; <code>800: 10.6:1</code>
    </p>
    <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">
      <div>
        <label class="ws-label" for="m4-def">1. Default (&ge; 4.5:1 mais claro):</label>
        <select class="field" id="m4-def">
          <option value="500">Tom 500 (3.9:1)</option>
          <option value="600">Tom 600 (5.9:1)</option>
          <option value="700">Tom 700 (8.1:1)</option>
        </select>
      </div>
      <div>
        <label class="ws-label" for="m4-hov">2. Hover (+1) e Pressed (+2):</label>
        <select class="field" id="m4-hov">
          <option value="500-400">Hover 500 / Pressed 400</option>
          <option value="700-800">Hover 700 / Pressed 800</option>
          <option value="800-900">Hover 800 / Pressed 900</option>
        </select>
      </div>
      <div>
        <label class="ws-label" for="m4-foc">3. Anel de Foco (&ge; 3:1 mais claro):</label>
        <select class="field" id="m4-foc">
          <option value="400">Tom 400 (2.5:1)</option>
          <option value="500">Tom 500 (3.9:1)</option>
          <option value="600">Tom 600 (5.9:1)</option>
        </select>
      </div>
      <div>
        <label class="ws-label" for="m4-dis">4. Estratégia Disabled:</label>
        <select class="field" id="m4-dis">
          <option value="A">A: Só mudar fundo para cinza</option>
          <option value="B">B: Cinza + rótulo "Inscrições encerradas" + cursor not-allowed</option>
          <option value="C">C: Ocultar o botão da tela</option>
        </select>
      </div>
    </div>
    <div class="sim-frame" style="padding:12px; gap:8px; flex-direction:row; flex-wrap:wrap;">
      <button type="button" id="m4-prev-def" class="btn btn-lg" style="background:#4d74e1; color:#fff;">Default</button>
      <button type="button" id="m4-prev-foc" class="btn btn-lg" style="background:#2f5bd3; color:#fff; box-shadow:0 0 0 2px #fff, 0 0 0 4px #8ba6ef;">Focus</button>
      <button type="button" id="m4-prev-dis" class="btn btn-lg" style="background:#d9dde4; color:#5c6474;">Inscrever-se</button>
    </div>
    <div id="m4-fb" class="callout callout-info">Texto normal (16px) exige 4.5:1 (WCAG 1.4.3); anel de foco é não-texto e exige 3:1 (WCAG 1.4.11).</div>
  `;
  const ids = ["m4-def", "m4-hov", "m4-foc", "m4-dis"];
  const tons = { "400": "#8ba6ef", "500": "#4d74e1", "600": "#2f5bd3", "700": "#2449b0", "800": "#1c3a8e" };
  const check = () => {
    const def = $("m4-def").value;
    const hov = $("m4-hov").value;
    const foc = $("m4-foc").value;
    const dis = $("m4-dis").value;
    $("m4-prev-def").style.background = tons[def] || "#2f5bd3";
    $("m4-prev-foc").style.background = tons[def] || "#2f5bd3";
    $("m4-prev-foc").style.boxShadow = `0 0 0 2px #fff, 0 0 0 4px ${tons[foc] || "#4d74e1"}`;
    $("m4-prev-dis").style.display = dis === "C" ? "none" : "inline-flex";
    $("m4-prev-dis").textContent = dis === "B" ? "Inscrições encerradas" : "Inscrever-se";
    $("m4-prev-dis").style.cursor = dis === "B" ? "not-allowed" : "pointer";
    const cod = `${def}-${hov}-${foc}-${dis}`;
    if (cod === "600-700-800-500-B") {
      const tok = `UI4-${cod}`;
      $("m4-fb").className = "callout callout-ok";
      $("m4-fb").innerHTML = `<strong>[OK] 5 Estados WCAG especificados!</strong> Token gerado: <code>${tok}</code>.`;
      atualizarTokenUI(tok, true);
    } else {
      const errCount = [def !== "600", hov !== "700-800", foc !== "500", dis !== "B"].filter(Boolean).length;
      const msg = `${errCount} de 4 escolhas ainda incorretas. Default = tom mais claro com >= 4.5:1; Hover/Pressed = 1 e 2 tons mais escuros; Foco = tom mais claro com >= 3:1; Disabled nunca depende só de cor.`;
      $("m4-fb").className = "callout callout-warn";
      $("m4-fb").textContent = msg;
      atualizarTokenUI("", false, msg);
    }
  };
  ids.forEach((id) => $(id).addEventListener("change", check));
}

/* ---------- M5: AUDITORIA DE PADROES (8 MARCADORES) ---------- */
function montarBancadaUI_M5(container) {
  const itens = [
    { id: "A", t: "A. Lupa no topo da lista para busca" },
    { id: "B", t: "B. Engrenagem usada para abrir filtros da lista" },
    { id: "C", t: "C. Faixa 'Restam 2 vagas' que reinicia a cada F5" },
    { id: "D", t: "D. Botão secundário com contorno ao lado do primário" },
    { id: "E", t: "E. Ícone de disquete para favoritar onde na tela 1 era coração" },
    { id: "F", t: "F. Botão de recusar escrito 'Não, prefiro ficar para trás'" },
    { id: "G", t: "G. Caixa 'Receber spam de parceiros' já marcada por padrão" },
    { id: "H", t: "H. Taxa extra de R$ 4,90 revelada só no último clique" },
  ];
  container.innerHTML = `
    <div style="display:flex; flex-direction:column; gap:6px;">
      ${itens
        .map(
          (it) => `
        <div class="audit-item">
          <span>${escaparHtml(it.t)}</span>
          <select class="field m5-sel" aria-label="${escaparHtml(it.t)}">
            <option value="">-- Classificar --</option>
            <option value="0">0 - OK (Padrão)</option>
            <option value="1">1 - Inconsistência</option>
            <option value="2">2 - Dark Pattern</option>
          </select>
        </div>`
        )
        .join("")}
    </div>
    <div id="m5-fb" class="callout callout-info">Classifique os 8 marcadores (0 = OK, 1 = Inconsistência externa/interna, 2 = Dark Pattern).</div>
  `;
  const sels = container.querySelectorAll(".m5-sel");
  const check = () => {
    const vals = Array.from(sels).map((s) => s.value);
    if (vals.includes("")) return atualizarTokenUI("", false, "Classifique todos os 8 itens.");
    const str = vals.join("");
    if (str === "01201222") {
      const tok = `UI5-${str}`;
      $("m5-fb").className = "callout callout-ok";
      $("m5-fb").innerHTML = `<strong>[OK] Auditoria de 8 marcadores aprovada!</strong> Token gerado: <code>${tok}</code>.`;
      atualizarTokenUI(tok, true);
    } else {
      const esperadoM5 = "01201222";
      const errCount = vals.filter((v, i) => v !== esperadoM5[i]).length;
      const msg = `${errCount} de 8 classificações incorretas. 0 = segue o padrão esperado; 1 = quebra a consistência externa (Lei de Jakob) ou interna; 2 = engana ou pressiona o usuário.`;
      $("m5-fb").className = "callout callout-warn";
      $("m5-fb").textContent = msg;
      atualizarTokenUI("", false, msg);
    }
  };
  sels.forEach((s) => s.addEventListener("change", check));
}

/* ---------- M6: ESQUELETO LOW-FI (WIREFRAME) ---------- */
function montarBancadaUI_M6(container) {
  container.innerHTML = `
    <p style="margin:0; font-size:13px; color:var(--tx-2);">
      A tela inicial colorida do app tem, de cima para baixo:<br>
      1. Topo com título e menu (<strong>AB</strong>) &rarr; 2. Busca (<strong>BU</strong>) &rarr; 3. Pílulas de categoria (<strong>CH</strong>) &rarr; 4. Destaque grande do Dia do Design (<strong>BA</strong>) &rarr; 5. <em>Onda decorativa sem função (IM)</em> &rarr; 6. Duas linhas de eventos na lista (<strong>IL</strong> e <strong>IL</strong>) &rarr; 7. Um card com superfície e botão próprios (<strong>CA</strong>) &rarr; 8. Botão redondo '+' flutuando acima do rodapé (<strong>FB</strong>) &rarr; 9. Barra inferior de navegação (<strong>TA</strong>).
    </p>
    <div>
      <label class="ws-label" for="m6-pilha">Escolha a pilha correta de blocos do Wireframe Low-Fi:</label>
      <select class="field field-mono" id="m6-pilha">
        <option value="">-- Selecione a pilha de regiões --</option>
        <option value="AB-BU-CH-BA-IM-IL-IL-CA-FB-TA">AB-BU-CH-BA-IM-IL-IL-CA-FB-TA</option>
        <option value="AB-BU-CH-BA-IL-CA-FB-TA">AB-BU-CH-BA-IL-CA-FB-TA</option>
        <option value="AB-BU-CH-BA-IL-IL-CA-TA-FB">AB-BU-CH-BA-IL-IL-CA-TA-FB</option>
        <option value="AB-BU-CH-BA-IL-IL-CA-FB-TA">AB-BU-CH-BA-IL-IL-CA-FB-TA</option>
      </select>
    </div>
    <div id="m6-fb" class="callout callout-info">Regra do Wireframe: um bloco por região funcional de cima para baixo, itens repetidos 1x por ocorrência, zero enfeites!</div>
  `;
  $("m6-pilha").addEventListener("change", () => {
    const v = $("m6-pilha").value;
    if (v === "AB-BU-CH-BA-IL-IL-CA-FB-TA") {
      const tok = `UI6-${v}`;
      $("m6-fb").className = "callout callout-ok";
      $("m6-fb").innerHTML = `<strong>[OK] Esqueleto Low-Fi validado!</strong> Token gerado: <code>${tok}</code>.`;
      atualizarTokenUI(tok, true);
    } else {
      const msg = "Revise a regra: um bloco por região funcional, de cima para baixo; itens repetidos entram uma vez por ocorrência; enfeites não entram; elementos flutuantes entram pela posição vertical.";
      $("m6-fb").className = "callout callout-warn";
      $("m6-fb").textContent = msg;
      atualizarTokenUI("", false, msg);
    }
  });
}

/* ---------- M7: TRIBUNAL DAS 10 HEURISTICAS DE NIELSEN (7 PROBLEMAS) ---------- */
function montarBancadaUI_M7(container) {
  const probs = [
    { id: "P1", t: "P1. Clicou em 'Enviar matrícula' e a tela fica branca por 20s sem indicador." },
    { id: "P2", t: "P2. Campo de data é texto livre e deixa enviar '31/02/2026' sem bloquear ANTES." },
    { id: "P3", t: "P3. Quando falha, mostra 'Erro 0x80041: syscall' sem explicar como resolver DEPOIS." },
    { id: "P4", t: "P4. Obriga o aluno a digitar de memória o código 'ADS-204' em vez de listar as disciplinas." },
    { id: "P5", t: "P5. O botão chama-se 'Salvar' (azul) na tela 1 e 'Gravar' (verde) na tela 2." },
    { id: "P6", t: "P6. Clicou em 'Remover disciplina' e ela some na hora sem botão 'Desfazer'." },
    { id: "P7", t: "P7. O menu chama a matrícula de 'Submeter requerimento de vínculo discente'." },
  ];
  const ops = [
    { v: "", t: "-- Heurística --" },
    { v: "1", t: "#1 Status do sistema" },
    { v: "2", t: "#2 Mundo real" },
    { v: "3", t: "#3 Controle e liberdade" },
    { v: "4", t: "#4 Consistência e padrões" },
    { v: "5", t: "#5 Prevenção de erros (ANTES)" },
    { v: "6", t: "#6 Reconhecer em vez de lembrar" },
    { v: "9", t: "#9 Recuperar de erros (DEPOIS)" },
  ];
  container.innerHTML = `
    <div style="display:flex; flex-direction:column; gap:6px;">
      ${probs
        .map(
          (p) => `
        <div class="audit-item">
          <span>${escaparHtml(p.t)}</span>
          <select class="field m7-sel" aria-label="${escaparHtml(p.t)}">
            ${ops.map((o) => `<option value="${o.v}">${escaparHtml(o.t)}</option>`).join("")}
          </select>
        </div>`
        )
        .join("")}
    </div>
    <div id="m7-fb" class="callout callout-info">Consulte as 10 Heurísticas de Nielsen na Folha A4 #1 do Conselheiro.</div>
  `;
  const sels = container.querySelectorAll(".m7-sel");
  const check = () => {
    const vals = Array.from(sels).map((s) => s.value);
    if (vals.includes("")) return atualizarTokenUI("", false, "Julgue todos os 7 problemas.");
    const seq = vals.join("-");
    if (seq === "1-5-9-6-4-3-2") {
      const tok = `UI7-${seq}`;
      $("m7-fb").className = "callout callout-ok";
      $("m7-fb").innerHTML = `<strong>[OK] Parecer Heurístico Completo!</strong> Token gerado: <code>${tok}</code>.`;
      atualizarTokenUI(tok, true);
    } else {
      const esperadoM7 = ["1", "5", "9", "6", "4", "3", "2"];
      const errCount = vals.filter((v, i) => v !== esperadoM7[i]).length;
      const msg = `${errCount} de 7 julgamentos incorretos. Revise com a Folha A4: #5 previne o erro ANTES; #9 ajuda a recuperar DEPOIS.`;
      $("m7-fb").className = "callout callout-warn";
      $("m7-fb").textContent = msg;
      atualizarTokenUI("", false, msg);
    }
  };
  sels.forEach((s) => s.addEventListener("change", check));
}

/* ---------- M8: AUTO LAYOUT ANINHADO FIGMA (328x296-N11) ---------- */
function montarBancadaUI_M8(container) {
  container.innerHTML = `
    <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">
      <div>
        <label class="ws-label" for="m8-larg">1. Largura Fixed do Card (Frame 360 - 2x16):</label>
        <select class="field" id="m8-larg">
          <option value="360">360px</option>
          <option value="340">340px</option>
          <option value="328">328px</option>
        </select>
      </div>
      <div>
        <label class="ws-label" for="m8-chips">2. Direção do frame 'chips':</label>
        <select class="field" id="m8-chips">
          <option value="soltos">Vertical empilhado</option>
          <option value="horizontal">Horizontal (gap 8px)</option>
        </select>
      </div>
      <div>
        <label class="ws-label" for="m8-fill">3. Redimensionamento de 'conteudo' e 'descricao':</label>
        <select class="field" id="m8-fill">
          <option value="hug">Hug contents</option>
          <option value="fill">Fill container</option>
        </select>
      </div>
      <div>
        <label class="ws-label" for="m8-nomes">4. Nomenclatura das 11 camadas:</label>
        <select class="field" id="m8-nomes">
          <option value="8">Genérica (Text 1, Frame 2)</option>
          <option value="11">11 Nomes Semânticos</option>
        </select>
      </div>
    </div>
    <div class="sim-frame" style="padding:12px;">
      <div id="m8-prev-card" class="live-event-card" style="max-width:360px; padding:16px; display:flex; flex-direction:column; gap:12px;">
        <div id="m8-prev-chips" style="display:flex; flex-direction:column; gap:6px; align-items:flex-start;">
          <span class="chip chip-ok">Gratuito</span>
          <span class="chip chip-select">Presencial</span>
        </div>
        <div id="m8-prev-desc" style="font-size:13px; color:var(--tx-2); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">Oficina de Auto Layout aninhado com entrega de protótipo e código JS.</div>
        <div id="m8-prev-meta" style="font-family:var(--ff-mono); font-size:11px; color:var(--ac-redline);">Largura: 360px | Camadas: genéricas</div>
      </div>
    </div>
    <div id="m8-fb" class="callout callout-info">Configure os 4 parâmetros do Auto Layout para gerar a assinatura 328x296-N11.</div>
  `;
  const ids = ["m8-larg", "m8-chips", "m8-fill", "m8-nomes"];
  const check = () => {
    const l = $("m8-larg").value;
    const c = $("m8-chips").value;
    const f = $("m8-fill").value;
    const n = $("m8-nomes").value;
    $("m8-prev-card").style.maxWidth = `${l}px`;
    $("m8-prev-chips").style.flexDirection = c === "horizontal" ? "row" : "column";
    $("m8-prev-desc").style.whiteSpace = f === "fill" ? "normal" : "nowrap";
    $("m8-prev-meta").textContent = `Largura: ${l}px | Chips: ${c} | Texto: ${f} | Camadas: ${n === "11" ? "11 semânticas" : "genéricas"}`;
    if (l === "328" && c === "horizontal" && f === "fill" && n === "11") {
      const tok = "UI8-328x296-N11";
      $("m8-fb").className = "callout callout-ok";
      $("m8-fb").innerHTML = `<strong>[OK] Componente Card/Evento pronto para o Figma!</strong> Token gerado: <code>${tok}</code>.`;
      atualizarTokenUI(tok, true);
    } else {
      const errCount = [l !== "328", c !== "horizontal", f !== "fill", n !== "11"].filter(Boolean).length;
      const msg = `${errCount} de 4 parâmetros ainda incorretos. Revise largura (frame menos as margens), direção dos chips, redimensionamento do texto e nomenclatura das camadas.`;
      $("m8-fb").className = "callout callout-warn";
      $("m8-fb").textContent = msg;
      atualizarTokenUI("", false, msg);
    }
  };
  ids.forEach((id) => $(id).addEventListener("change", check));
}

/* ---------- MOTOR DE TESTES AUTOMATIZADOS DE JAVASCRIPT (8 MISSOES) ---------- */

function registrarWorkerTestes() {
  self.onmessage = (ev) => {
    const { missaoId, codigo } = ev.data;
    try {
      if (missaoId === 0) {
        const fn = new Function(`${codigo}\n return typeof calcularEscala === "function" ? calcularEscala : null;`)();
        if (!fn) throw new Error("Função calcularEscala(base, razao, passo, ehTitulo) não encontrada.");
        const rTitulo = fn(16, 1.25, 3, true);
        const rData = fn(16, 1.25, 1, false);
        if (!rTitulo || rTitulo.tamanho !== 32 || rTitulo.entrelinha !== 40) {
          throw new Error(`Teste 1 falhou: para (16, 1.25, 3, true) esperava { tamanho: 32, entrelinha: 40 }, obteve ${JSON.stringify(rTitulo)}`);
        }
        if (!rData || rData.tamanho !== 20 || rData.entrelinha !== 32) {
          throw new Error(`Teste 2 falhou: para (16, 1.25, 1, false) esperava { tamanho: 20, entrelinha: 32 }, obteve ${JSON.stringify(rData)}`);
        }
      } else if (missaoId === 1) {
        const fn = new Function(`${codigo}\n return typeof ordenarPorPesoVisual === "function" ? ordenarPorPesoVisual : null;`)();
        if (!fn) throw new Error("Função ordenarPorPesoVisual(elementos) não encontrada.");
        const amostra = [
          { id: "A", tamanho: 12, peso: 700, contraste: 7.2 },
          { id: "G", tamanho: 20, peso: 600, contraste: 5.4 },
          { id: "B", tamanho: 32, peso: 700, contraste: 17.4 },
          { id: "C", tamanho: 20, peso: 600, contraste: 8.6 },
          { id: "D", tamanho: 16, peso: 400, contraste: 5.9 },
          { id: "E", tamanho: 16, peso: 600, contraste: 6.0 },
          { id: "F", tamanho: 16, peso: 600, contraste: 5.9 },
        ];
        const res = fn(amostra);
        if (res !== "BCGEFDA") {
          throw new Error(`Teste falhou: esperava "BCGEFDA", mas sua função retornou "${res}". Desempatou pelo contraste (b.contraste - a.contraste)?`);
        }
      } else if (missaoId === 2) {
        const fn = new Function(`${codigo}\n return typeof calcularBoxModel === "function" ? calcularBoxModel : null;`)();
        if (!fn) throw new Error("Função calcularBoxModel(cfg) não encontrada.");
        const res = fn({ pad: 24, g1: 8, g2: 16, g3: 24, btn: 48 });
        if (!res || res.yData !== 72 || res.yDesc !== 112 || res.yBtn !== 184 || res.alturaCard !== 256) {
          throw new Error(`Teste falhou: esperava { yData: 72, yDesc: 112, yBtn: 184, alturaCard: 256 }, obteve ${JSON.stringify(res)}`);
        }
      } else if (missaoId === 3) {
        const fn = new Function(`${codigo}\n return typeof processarInscricao === "function" ? processarInscricao : null;`)();
        if (!fn) throw new Error("Função processarInscricao(vagasAtuais) não encontrada.");
        const r1 = fn(2);
        const r0 = fn(1);
        if (!r1 || r1.vagas !== 1 || r1.bloqueado !== false) {
          throw new Error("Teste 1 falhou: de 2 para 1 vaga o botão deve continuar desbloqueado (bloqueado: false).");
        }
        if (!r0 || r0.vagas !== 0 || r0.bloqueado !== true || r0.rotulo !== "Inscrições encerradas") {
          throw new Error(`Teste 2 falhou: ao zerar vagas, esperava { vagas: 0, bloqueado: true, rotulo: "Inscrições encerradas" }, obteve ${JSON.stringify(r0)}`);
        }
      } else if (missaoId === 4) {
        const fn = new Function(`${codigo}\n return typeof filtrarEventosSeguros === "function" ? filtrarEventosSeguros : null;`)();
        if (!fn) throw new Error("Função filtrarEventosSeguros(eventos, categoriaAtiva, textoBusca) não encontrada.");
        const lista = [
          { titulo: "Oficina de Figma", categoria: "Workshop", darkPattern: false },
          { titulo: "Curso Suspeito Só Hoje", categoria: "Workshop", darkPattern: true },
          { titulo: "Aulão de JavaScript", categoria: "Oficina", darkPattern: false },
        ];
        const r1 = fn(lista, "Todas", "figma");
        const r2 = fn(lista, "Workshop", "");
        if (!Array.isArray(r1) || r1.length !== 1 || r1[0].titulo !== "Oficina de Figma") {
          throw new Error("Teste 1 falhou: buscando 'figma' em 'Todas' deveria retornar apenas 'Oficina de Figma'.");
        }
        if (r2.length !== 1) {
          throw new Error("Teste 2 falhou: eventos com darkPattern: true devem ser descartados!");
        }
      } else if (missaoId === 5) {
        const fn = new Function(`${codigo}\n return typeof compilarWireframe === "function" ? compilarWireframe : null;`)();
        if (!fn) throw new Error("Função compilarWireframe(camadas) não encontrada.");
        const camadas = [
          { sigla: "AB", decorativo: false },
          { sigla: "IM", decorativo: true },
          { sigla: "CA", decorativo: false },
        ];
        const res = fn(camadas);
        if (res !== "AB-CA") {
          throw new Error(`Teste falhou: esperava "AB-CA" (sem a camada decorativa IM), mas obteve "${res}".`);
        }
      } else if (missaoId === 6) {
        const fn = new Function(`${codigo}\n return typeof validarMatriculaAcad === "function" ? validarMatriculaAcad : null;`)();
        if (!fn) throw new Error("Função validarMatriculaAcad(dados) não encontrada.");
        const rCursoRuim = fn({ nome: "Lucas", data: "16/05/2026", curso: "ADS-999" });
        const rOk = fn({ nome: "Lucas", data: "16/05/2026", curso: "Web JS" });
        if (!rCursoRuim || rCursoRuim.valido !== false || rCursoRuim.heuristica !== 6) {
          throw new Error("Teste falhou: quando o curso não está na lista ['UI/UX', 'Web JS', 'Redes'], deve retornar { valido: false, heuristica: 6 }.");
        }
        if (!rOk || rOk.valido !== true) {
          throw new Error("Teste falhou: dados válidos deveriam retornar { valido: true }.");
        }
      } else if (missaoId === 7) {
        const fn = new Function(`${codigo}\n return typeof calcularAutoLayout === "function" ? calcularAutoLayout : null;`)();
        if (!fn) throw new Error("Função calcularAutoLayout(arvore) não encontrada.");
        const res = fn({
          larguraFrame: 360,
          margemGrid: 16,
          padCard: 24,
          gapCab: 8,
          gapCont: 16,
          gapCard: 24,
          altTitulo: 40,
          altData: 24,
          altChips: 24,
          altDescDuasLinhas: 56,
          altBotao: 48,
          camadasNomeadas: 11,
        });
        if (!res || res.assinatura !== "328x296-N11") {
          throw new Error(`Teste falhou: esperava assinatura "328x296-N11", mas retornou ${JSON.stringify(res)}.`);
        }
      }
      self.postMessage({ ok: true });
    } catch (err) {
      self.postMessage({ ok: false, mensagem: err && err.message ? err.message : String(err) });
    }
  };
}

function executarNoWorkerComTimeout(missaoId, codigo, timeoutMs = 2000) {
  return new Promise((resolve) => {
    const src = `(${registrarWorkerTestes.toString()})();`;
    const blobUrl = URL.createObjectURL(new Blob([src], { type: "application/javascript" }));
    const worker = new Worker(blobUrl);
    let encerrado = false;

    const finalizar = (resultado) => {
      if (encerrado) return;
      encerrado = true;
      clearTimeout(timer);
      worker.terminate();
      URL.revokeObjectURL(blobUrl);
      resolve(resultado);
    };

    const timer = setTimeout(() => {
      finalizar({
        ok: false,
        mensagem: "Tempo esgotado: seu código demorou demais (possível laço infinito).",
      });
    }, timeoutMs);

    worker.onmessage = (ev) => finalizar(ev.data || { ok: false, mensagem: "Resposta inválida dos testes." });
    worker.onerror = (ev) => finalizar({ ok: false, mensagem: ev.message || "Erro ao executar código JavaScript." });
    worker.postMessage({ missaoId, codigo });
  });
}

async function executarTestesJS(missao) {
  const codigo = $("editor-js").value;
  const saida = $("saida-console-js");
  const badge = $("badge-token-js");
  const btnEnviar = $("btn-enviar-token-js");
  const btnRodar = $("btn-rodar-js");
  const btnAjuda = $("btn-ajuda-js");

  if (btnRodar) btnRodar.disabled = true;
  if (btnAjuda) btnAjuda.disabled = true;

  try {
    const resultado = await executarNoWorkerComTimeout(missao.id, codigo, 2000);
    if (estado.etapaAtual !== missao.id) return;

    if (resultado.ok) {
      estado.geradoJS[missao.id] = true;
      salvarEstado();
      const tok = missao.tokenJSEsperado;
      badge.textContent = `Token: ${tok}`;
      badge.style.background = "var(--ok-soft)";
      badge.style.color = "var(--ok)";
      saida.innerHTML = `<span style="color:#58d68d;">[OK] Todos os testes JS da Missão ${missao.id + 1} passaram! Token: <strong>${tok}</strong></span>`;
      $("status-token-js").innerHTML = `<strong style="color:var(--ok);">[OK] ${tok}</strong>`;
      $("input-token-js").value = tok;
      btnEnviar.disabled = false;
      btnEnviar.onclick = () => $("input-token-po").focus();
    } else {
      badge.textContent = "Teste falhou";
      badge.style.background = "var(--bad-soft)";
      badge.style.color = "var(--bad)";
      saida.innerHTML = `<span style="color:#ff8080;">[ERRO JS] ${escaparHtml(resultado.mensagem)}</span>`;
    }
  } finally {
    if (estado.etapaAtual === missao.id) {
      if ($("btn-rodar-js")) $("btn-rodar-js").disabled = false;
      if ($("btn-ajuda-js")) $("btn-ajuda-js").disabled = false;
    }
  }
}

/* ---------- SUBMISSAO DO COFRE SIMBIOTICO ---------- */

$("form-fechadura").addEventListener("submit", (ev) => {
  ev.preventDefault();
  const missao = MISSOES[estado.etapaAtual];
  if (!missao) return;

  const ui = $("input-token-ui").value.trim().toUpperCase();
  const js = $("input-token-js").value.trim().toUpperCase();
  const po = $("input-token-po").value.trim().toUpperCase();
  const fb = $("feedback-fechadura");

  const uiMatch = ui === missao.tokenUIEsperado.toUpperCase();
  const jsMatch = js === missao.tokenJSEsperado.toUpperCase();
  const poMatch = po === missao.tokenPOEsperado.toUpperCase();
  const uiGerado = Boolean(estado.geradoUI[missao.id] || estado.concluidas[missao.id]);
  const jsGerado = Boolean(estado.geradoJS[missao.id] || estado.concluidas[missao.id]);

  if (uiMatch && jsMatch && poMatch && uiGerado && jsGerado) {
    estado.concluidas[missao.id] = true;
    if (estado.concluidas.every(Boolean) && !estado.concluidoEm) {
      estado.concluidoEm = Date.now();
    }
    salvarEstado();

    fb.innerHTML = `
      <div class="callout callout-ok anim-pop">
        <div>
          <strong>[OK] Fechadura ${missao.id + 1}/${TOTAL_MISSOES} Destravada!</strong><br>
          Anote na Prancheta A4 #1, reveze o piloto do teclado/mouse e avance!
          <div style="margin-top:8px;">
            <button type="button" class="btn btn-primary btn-sm" id="btn-avancar-missao">
              ${missao.id < TOTAL_MISSOES - 1 ? `Ir para Missão ${missao.id + 2} &rarr;` : "Abrir Oficina Capstone &amp; Código do Placar &rarr;"}
            </button>
          </div>
        </div>
      </div>
    `;
    $("btn-avancar-missao").addEventListener("click", () => {
      estado.etapaAtual = missao.id < TOTAL_MISSOES - 1 ? missao.id + 1 : TOTAL_MISSOES;
      salvarEstado();
      renderizarTudo();
    });
  } else {
    estado.erros[missao.id] = (estado.erros[missao.id] || 0) + 1;
    salvarEstado();
    const falhas = [];
    if (!uiMatch) {
      falhas.push("1. Token UI/UX incorreto (complete a bancada UI/UX)");
    } else if (!uiGerado) {
      falhas.push("1. O token UI precisa ser gerado na Bancada UI/UX deste computador");
    }
    if (!jsMatch) {
      falhas.push("2. Token JS incorreto (rode os testes na bancada Dev JS)");
    } else if (!jsGerado) {
      falhas.push("2. O token JS precisa ser gerado rodando os testes na Bancada Dev JS deste computador");
    }
    if (!poMatch) {
      falhas.push("3. Código do Conselheiro incorreto (consulte a coluna 'Cod. Papel' na Folha A4 #1)");
    }

    fb.innerHTML = `
      <div class="callout callout-bad anim-shake">
        <div>
          <strong>[FAIL] A fechadura não abriu:</strong><br>
          ${falhas.map((f) => `&bull; ${escaparHtml(f)}`).join("<br>")}
        </div>
      </div>
    `;
  }
});

$("btn-pedir-dica").addEventListener("click", () => {
  const missao = MISSOES[estado.etapaAtual];
  if (!missao) return;
  if (!estado.dicas[missao.id]) {
    estado.dicas[missao.id] = 1;
    salvarEstado();
  }
  $("btn-pedir-dica").textContent = "Dica revelada";
  $("btn-pedir-dica").disabled = true;
  $("caixa-dica-texto").textContent = missao.dica;
});

/* ---------- TELA FINAL: OFICINA CAPSTONE (ATO IV) & ENTREGA ---------- */

function renderizarTelaFinal() {
  const codigo = gerarCodigoPlacar();
  const host = $("canvas-conteudo");
  host.innerHTML = `
    <section class="mission-head" style="border-top:4px solid var(--ok);">
      <div class="mission-badges">
        <span class="chip chip-ok">[8/8 FECHADURAS ABERTAS]</span>
        <span class="chip chip-component">Ato IV — Desafio Final &amp; Pitch</span>
      </div>
      <h1>Parabéns, ${escaparHtml(estado.squad.nome)}! Missões concluídas!</h1>
      <p class="mission-brief">
        Vocês destravaram as 8 fechaduras. Copiem o código oficial abaixo para o Placar e concluam o Desafio Final no Figma antes do Pitch de 2 minutos!
      </p>

      <div class="callout callout-ok" style="flex-direction:column; gap:8px;">
        <strong>1. Código Oficial do Squad para o Placar do Professor (8/8 Fechaduras):</strong>
        <textarea class="field field-mono" rows="3" readonly id="codigo-final-inline">${escaparHtml(codigo)}</textarea>
        <div style="display:flex; gap:8px; flex-wrap:wrap;">
          <button type="button" class="btn btn-primary" id="btn-copiar-final">Copiar Código SNC1.</button>
          <a class="btn btn-secondary" href="../placar/index.html" target="_blank">Abrir Placar do Professor</a>
        </div>
      </div>

      <div class="workbench-split" style="margin-top:8px;">
        <div class="bench-card bench-card-ui">
          <div class="bench-head"><h2>Etapa Prática no Figma (Ou Verso da Folha A4 #1)</h2></div>
          <div class="bench-body" style="font-size:14px; color:var(--tx-2);">
            <ol style="margin:0; padding-left:18px; display:flex; flex-direction:column; gap:6px;">
              <li>Criem um Frame <code>360x800</code> com Layout Grid de 4 colunas (margem 16px, gutter 16px).</li>
              <li>Construam o componente <code>Card/Evento</code> (<code>328x296</code>) com Auto Layout aninhado usando exatamente os 11 nomes semânticos.</li>
              <li>Criem a variante do botão para <code>Estado=Default (#2f5bd3)</code> e <code>Estado=Disabled ("Inscrições encerradas")</code>.</li>
            </ol>
          </div>
        </div>

        <div class="bench-card bench-card-js">
          <div class="bench-head"><h2>Auditoria Cruzada &amp; Pitch de 2 Minutos</h2></div>
          <div class="bench-body" style="font-size:14px; color:var(--tx-2);">
            <ol style="margin:0; padding-left:18px; display:flex; flex-direction:column; gap:6px;">
              <li>O <strong>QA Hunter</strong> finaliza a inspeção de 2 outros Squads usando a <strong>Folha A4 #2</strong> e colhe o visto de um auditor visitante na <strong>Folha A4 #1</strong> do grupo.</li>
              <li>Preparem um <strong>Pitch de 2 minutos</strong>: o Designer mostra como estruturou a hierarquia/Figma, o Dev JS mostra o algoritmo funcionando e o Conselheiro/QA relata qual bug de usabilidade acharam na sala!</li>
            </ol>
          </div>
        </div>
      </div>
    </section>
  `;

  $("btn-copiar-final").addEventListener("click", () => {
    navigator.clipboard?.writeText(codigo);
    $("btn-copiar-final").textContent = "[OK] Código copiado!";
  });
}

/* ---------- CADASTRO DO SQUAD E MODAL DO PLACAR ---------- */

function pedirIdentificacaoSquad() {
  const nome = prompt("Nome do Squad / Estação (ex.: Squad Phoenix):", estado.squad.nome);
  if (nome !== null && nome.trim()) estado.squad.nome = nome.trim();

  const ui = prompt("Nome do(a) Arquiteto(a) de UI/Figma:", estado.squad.ui);
  if (ui !== null && ui.trim()) estado.squad.ui = ui.trim();

  const js = prompt("Nome do(a) Engenheiro(a) Web / JavaScript:", estado.squad.js);
  if (js !== null && js.trim()) estado.squad.js = js.trim();

  const po = prompt("Nome do(a) Conselheiro(a) PO & QA Hunter (alunos com a Folha A4):", estado.squad.po);
  if (po !== null && po.trim()) estado.squad.po = po.trim();

  salvarEstado();
  renderizarTudo();
}

$("btn-editar-squad").addEventListener("click", pedirIdentificacaoSquad);

const modal = $("modal-placar");
$("btn-codigo-placar").addEventListener("click", () => {
  $("texto-codigo-placar").value = gerarCodigoPlacar();
  modal.showModal();
});

$("btn-fechar-modal").addEventListener("click", () => modal.close());

$("btn-copiar-placar").addEventListener("click", () => {
  navigator.clipboard?.writeText($("texto-codigo-placar").value);
  $("btn-copiar-placar").textContent = "[OK] Copiado!";
  setTimeout(() => {
    $("btn-copiar-placar").textContent = "Copiar Código";
  }, 2000);
});

$("btn-resetar-progresso").addEventListener("click", () => {
  if (confirm("Deseja realmente reiniciar todo o progresso deste computador?")) {
    estado = criarEstadoInicial();
    salvarEstado();
    modal.close();
    renderizarTudo();
  }
});

renderizarTudo();
