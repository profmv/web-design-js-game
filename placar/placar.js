/**
 * autor: Prof. Marcos V. Moraes
 * proposito: Controlador do Placar Ao Vivo do Professor (valida codigos SNC1. para 8 missoes, calcula pontuacao e exporta CSV)
 * criado: 2026-11-12T16:26:00-03:00
 * atualizado: 2026-11-12T17:30:00-03:00
 * versao: 2.0.0
 */

const TOTAL_MISSOES = 8;
const PLACAR_STORAGE = "estudio-oito:placar-snc-codigos";
const $ = (id) => document.getElementById(id);

function calcularAssinatura(payloadStr) {
  let h = 2166136261;
  const texto = payloadStr + "|ESTUDIO-OITO-SNC-2026";
  for (let i = 0; i < texto.length; i++) {
    h ^= texto.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(16).toUpperCase().padStart(8, "0");
}

function escaparHtml(str) {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function decodificarCodigo(codigoBruto) {
  const limpo = codigoBruto.trim();
  if (!limpo.startsWith("SNC1.")) return null;
  const partes = limpo.split(".");
  if (partes.length !== 3) return null;
  const [, b64, sig] = partes;
  const sigEsperada = calcularAssinatura(b64);
  const seloValido = sig.toUpperCase() === sigEsperada;
  try {
    const json = decodeURIComponent(escape(atob(b64)));
    const dados = JSON.parse(json);
    const errosTotal = (dados.erros || []).reduce((a, b) => a + (Number(b) || 0), 0);
    const dicasTotal = (dados.dicas || []).reduce((a, b) => a + (Number(b) || 0), 0);
    const concluidas = Number(dados.n) || 0;
    const basePontos = concluidas * 150 + (concluidas === TOTAL_MISSOES ? 200 : 0);
    const descontos = errosTotal * 5 + dicasTotal * 10;
    const pontos = Math.max(concluidas * 80, basePontos - descontos);
    const okNorm = Array.from({ length: TOTAL_MISSOES }, (_, i) => (Array.isArray(dados.ok) && dados.ok[i] ? 1 : 0));

    return {
      codigo: limpo,
      seloValido,
      squad: dados.sq || "Squad",
      membros: Array.isArray(dados.membros) ? dados.membros : [],
      ok: okNorm,
      concluidas,
      erros: errosTotal,
      dicas: dicasTotal,
      segundos: Math.max(1, Number(dados.seg) || 1),
      pontos,
    };
  } catch {
    return null;
  }
}

let listaCodigos = carregarCodigos();

function carregarCodigos() {
  try {
    return JSON.parse(localStorage.getItem(PLACAR_STORAGE) || "[]");
  } catch {
    return [];
  }
}

function salvarCodigos() {
  try {
    localStorage.setItem(PLACAR_STORAGE, JSON.stringify(listaCodigos));
  } catch {
    /* ignore */
  }
}

function formatarTempo(seg) {
  const m = Math.floor(seg / 60);
  const s = String(seg % 60).padStart(2, "0");
  return `${m}:${s}`;
}

let ultimoRanking = [];

function renderizarPlacar() {
  const avaliados = listaCodigos.map(decodificarCodigo).filter(Boolean);

  // Deduplica pelo nome do squad mantendo o maior progresso
  const porSquad = new Map();
  for (const item of avaliados) {
    const ch = item.squad.toLowerCase();
    const atual = porSquad.get(ch);
    if (!atual || item.pontos > atual.pontos || item.concluidas > atual.concluidas) {
      porSquad.set(ch, item);
    }
  }

  const ranking = [...porSquad.values()].sort(
    (a, b) => b.pontos - a.pontos || b.concluidas - a.concluidas || a.segundos - b.segundos
  );
  ultimoRanking = ranking;

  const tbody = $("tabela-ranking");
  if (!ranking.length) {
    tbody.innerHTML = `<tr><td colspan="7" style="color:var(--tx-3); text-align:center; padding:24px;">Nenhum código adicionado ainda. Cole os códigos <code>SNC1.</code> gerados pelos Squads na caixa ao lado.</td></tr>`;
    return;
  }

  tbody.innerHTML = ranking
    .map((r, idx) => {
      const bolinhas = Array.from({ length: TOTAL_MISSOES }, (_, i) => i)
        .map((i) => `<span class="dot ${r.ok[i] ? "dot-ok" : ""}" title="Missão ${i + 1}"></span>`)
        .join("");
      const statusHtml = !r.seloValido
        ? `<span class="chip chip-bad">[FAIL] Código adulterado</span>`
        : r.concluidas === TOTAL_MISSOES
          ? `<span class="chip chip-ok">[OK] ${TOTAL_MISSOES}/${TOTAL_MISSOES} Concluídas</span>`
          : `<span class="chip chip-select">[EM CURSO] ${r.concluidas}/${TOTAL_MISSOES}</span>`;

      return `
        <tr>
          <td><strong>${idx + 1}º</strong></td>
          <td>
            <strong>${escaparHtml(r.squad)}</strong><br>
            <span style="font-size:12px; color:var(--tx-2);">${escaparHtml(r.membros.join(" · "))}</span>
          </td>
          <td><div style="white-space:nowrap;">${bolinhas}</div><span style="font-size:12px;">(${r.concluidas}/${TOTAL_MISSOES})</span></td>
          <td><strong style="font-family:var(--ff-mono); font-size:16px;">${r.pontos} pts</strong></td>
          <td style="font-family:var(--ff-mono);">${formatarTempo(r.segundos)}</td>
          <td style="font-size:12px;">${r.erros} erro(s) / ${r.dicas} dica(s)</td>
          <td>${statusHtml}</td>
        </tr>
      `;
    })
    .join("");
}

$("btn-processar-codigos").addEventListener("click", () => {
  const texto = $("input-codigos").value;
  const encontrados = texto.match(/SNC1\.[A-Za-z0-9+/=]+\.[0-9A-Fa-f]{8}/g) || [];
  if (!encontrados.length) {
    $("msg-placar").textContent = "[WARN] Nenhum código SNC1 válido encontrado no texto colado.";
    return;
  }
  listaCodigos = [...new Set([...listaCodigos, ...encontrados])];
  salvarCodigos();
  $("input-codigos").value = "";
  $("msg-placar").textContent = `[OK] ${encontrados.length} código(s) processado(s) com sucesso!`;
  renderizarPlacar();
});

$("btn-limpar-placar").addEventListener("click", () => {
  if (confirm("Deseja limpar todos os códigos do Placar?")) {
    listaCodigos = [];
    salvarCodigos();
    renderizarPlacar();
  }
});

$("btn-toggle-gabarito").addEventListener("click", () => {
  const g = $("caixa-gabarito");
  g.hidden = !g.hidden;
});

$("btn-exportar-csv").addEventListener("click", () => {
  const linhas = [["posicao", "squad", "integrantes", "fechaduras", "pontos", "tempo_s", "erros", "dicas", "selo_valido"]];
  ultimoRanking.forEach((r, i) => {
    linhas.push([i + 1, r.squad, r.membros.join(" / "), r.concluidas, r.pontos, r.segundos, r.erros, r.dicas, r.seloValido ? "SIM" : "NAO"]);
  });
  // Runtime Encoding Exception: UTF-8 with BOM required by Excel pt-BR to read accents properly
  const csv = "\uFEFF" + linhas.map((l) => l.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(";")).join("\r\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = "placar-operacao-estudio-oito.csv";
  document.body.append(a);
  a.click();
  a.remove();
});

renderizarPlacar();
