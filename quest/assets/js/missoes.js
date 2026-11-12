/**
 * autor: Prof. Marcos V. Moraes
 * proposito: Especificacao das 8 Missoes Simbioticas + Capstone para jornada de no minimo 3 horas (180-210 min)
 * criado: 2026-11-12T16:23:00-03:00
 * atualizado: 2026-11-12T19:38:00-03:00
 * versao: 2.1.0
 */

export const MISSOES = [
  /* ================= ATO I: FUNDACOES VISUAIS & LOGICA DE DADOS (0h15 - 1h15) ================= */
  {
    id: 0,
    ato: "Ato I — Fundações",
    slug: "escala-tipografica",
    titulo: "Missão 1: Escala Tipográfica Modular & Motor de Arredondamento JS",
    pilarUI: "Escala Modular (Terça Maior 1.25) + Entrelinha",
    pilarJS: "Math.pow + Math.round + Regra de Múltiplos de 4",
    briefing:
      "O Prof. Ramos mandou o card do evento com todo o texto em 15px: ninguém sabe o que ler primeiro! O Arquiteto de UI deve montar a escala modular (base 16px, razão Terça Maior 1.25), definir o título 3 passos acima e a data 1 passo acima, arredondando para múltiplo de 4 e calculando a altura de linha do título (1.25x). Em seguida, o Engenheiro JS programa a função matemática que calcula qualquer passo da escala modular automaticamente.",
    tokenUIEsperado: "UI1-32-20-40",
    tokenJSEsperado: "JS1-SCALE-OK",
    tokenPOEsperado: "PO-MOD4",
    dica: "Na Bancada UI: Base = 16px, Razão = 1.25 (Terça Maior). Título (+3 passos): 16 * 1.25^3 = 31.25 -> arredondado para múltiplo de 4 vira 32px. Altura de linha do título (1.25x): 32 * 1.25 = 40px. Data (+1 passo): 16 * 1.25 = 20px. No JS: calcule `const bruto = base * Math.pow(razao, passo)` e arredonde para múltiplo de 4 com `Math.round(bruto / 4) * 4`.",
    codigoInicialJS: `// MISSÃO 1 (DEV JS): Crie o calculador oficial de Escala Modular!
// Regras:
// 1. Calcule o tamanho bruto: base * Math.pow(razao, passo)
// 2. Arredonde o tamanho para o múltiplo de 4 mais próximo
// 3. Calcule a altura de linha (entrelinha), também arredondada para múltiplo de 4:
//    - Se 'ehTitulo' for true, multiplique o tamanho pelo fator 1.25
//    - Se 'ehTitulo' for false, multiplique o tamanho pelo fator 1.5

function calcularEscala(base, razao, passo, ehTitulo) {
  const bruto = base * Math.pow(razao, passo);
  const tamanho = Math.round(bruto / 4) * 4;

  const fatorLinha = ehTitulo ? 1.25 : 1.5;
  // Implemente abaixo o cálculo da entrelinha arredondada para múltiplo de 4:
  const entrelinha = 0;

  return {
    tamanho: tamanho,
    entrelinha: entrelinha
  };
}`,
    solucaoGuiadaJS: `function calcularEscala(base, razao, passo, ehTitulo) {
  const bruto = base * Math.pow(razao, passo);
  const tamanho = Math.round(bruto / 4) * 4;
  const fatorLinha = ehTitulo ? 1.25 : 1.5;
  const entrelinha = Math.round((tamanho * fatorLinha) / 4) * 4;

  return {
    tamanho: tamanho,
    entrelinha: entrelinha
  };
}`,
    mochilaResumo: "Escala Modular (32px/20px/40px) + Algoritmo JS de Múltiplos de 4",
  },
  {
    id: 1,
    ato: "Ato I — Fundações",
    slug: "peso-visual-leitura",
    titulo: "Missão 2: Peso Visual, Padrão F/Z & Ordenador de Feed JS",
    pilarUI: "Hierarquia de Peso Visual (Tamanho > Peso > Contraste > Posição)",
    pilarJS: "Array .sort() Multicritério + Desempate",
    briefing:
      "Em qual ordem o olho humano percorre os 7 elementos do card? Cor chamativa sozinha não manda: a regra do Estúdio Oito compara 1º Tamanho da fonte, 2º Peso da fonte (negrito), 3º Contraste com o fundo e, só se empatar tudo, 4º Posição (cima para baixo, esquerda para direita). O Designer descobre a sequência de leitura dos elementos A..G e o Dev JS programa o algoritmo `.sort()` que ordena qualquer lista de camadas por peso visual!",
    tokenUIEsperado: "UI2-BCGEFDA",
    tokenJSEsperado: "JS2-SORT-OK",
    tokenPOEsperado: "PO-PESO7",
    dica: "Na Bancada UI: B (Título 32px) é o maior -> 1º. Depois empatam em 20px e peso 600: C (Data, contraste 8.6:1) vence G (Preço verde, contraste 5.4:1) -> B, C, G. Depois vêm os de 16px: E (Botão peso 600, esq) e F (Link peso 600, dir) vencem D (Descrição peso 400) -> E, F, D. Por último A (Tag 12px) -> BCGEFDA! No JS: se ` b.tamanho !== a.tamanho `, retorne ` b.tamanho - a.tamanho `; senão se ` b.peso !== a.peso `, retorne ` b.peso - a.peso `; senão retorne ` b.contraste - a.contraste `.",
    codigoInicialJS: `// MISSÃO 2 (DEV JS): Ordene a lista de elementos do mais pesado ao mais leve!
// Cada item tem: { id: "B", tamanho: 32, peso: 700, contraste: 17.4 }
// Regra de comparação (do maior para o menor):
// 1º Maior 'tamanho' vence
// 2º Se empatar em tamanho, maior 'peso' vence
// 3º Se empatar em peso, maior 'contraste' vence

function ordenarPorPesoVisual(elementos) {
  const copia = [...elementos];
  copia.sort((a, b) => {
    if (b.tamanho !== a.tamanho) {
      return b.tamanho - a.tamanho;
    }
    if (b.peso !== a.peso) {
      return b.peso - a.peso;
    }
    // Complete o 3º critério de desempate pelo contraste (do maior para o menor):
    return 0;
  });
  return copia.map((item) => item.id).join("");
}`,
    solucaoGuiadaJS: `function ordenarPorPesoVisual(elementos) {
  const copia = [...elementos];
  copia.sort((a, b) => {
    if (b.tamanho !== a.tamanho) return b.tamanho - a.tamanho;
    if (b.peso !== a.peso) return b.peso - a.peso;
    return b.contraste - a.contraste;
  });
  return copia.map((item) => item.id).join("");
}`,
    mochilaResumo: "Ordem de Leitura (BCGEFDA) + Motor JS .sort() de Hierarquia",
  },
  {
    id: 2,
    ato: "Ato I — Fundações",
    slug: "ritmo-8px",
    titulo: "Missão 3: Ritmo de 8px, Proximidade Gestalt & Inspetor de Coordenadas Y",
    pilarUI: "Grid de 8px + Proximidade Gestalt + Alvo de Toque 48px",
    pilarJS: "Cálculo Cumulativo de Coordenadas Y no Box Model",
    briefing:
      "Os espaços do card vieram no chute (13px, 5px, 21px). Pela Lei da Proximidade (Gestalt), itens do mesmo grupo ficam mais perto (8px), grupos diferentes ficam a 16px, antes da ação principal usamos 24px, o padding do card iguala o maior espaço interno (24px) e o botão exige alvo de toque de 48px. O Designer ajusta o ritmo e lê as coordenadas Y no inspetor; o Dev JS programa o motor de layout que calcula a posição Y de cada camada e a altura total do card!",
    tokenUIEsperado: "UI3-72-112-184-256",
    tokenJSEsperado: "JS3-BOX-OK",
    tokenPOEsperado: "PO-RITMO8",
    dica: "Com padding = 24, título (altura 40) começa em Y=24. Com g1 = 8, Y da data = 24 + 40 + 8 = 72. Com data (altura 24) e g2 = 16, Y da descrição = 72 + 24 + 16 = 112. Com descrição (altura 48) e g3 = 24, Y do botão = 112 + 48 + 24 = 184. Com botão (48) + padding inferior (24), altura do card = 184 + 48 + 24 = 256! Código UI: UI3-72-112-184-256.",
    codigoInicialJS: `// MISSÃO 3 (DEV JS): Calcule as coordenadas verticais (Y) e a altura final do Card!
// Alturas fixas das camadas: titulo = 40, data = 24, descricao = 48.
// Parâmetros recebidos em 'cfg': { pad, g1, g2, g3, btn }
// Fórmulas do Inspetor:
// - yData = pad + 40 + g1
// - yDesc = yData + 24 + g2
// - yBtn  = yDesc + 48 + g3
// - alturaCard = yBtn + btn + pad

function calcularBoxModel(cfg) {
  const yData = cfg.pad + 40 + cfg.g1;
  const yDesc = yData + 24 + cfg.g2;
  const yBtn = yDesc + 48 + cfg.g3;
  // Calcule a altura total do card somando yBtn + altura do botão + padding inferior:
  const alturaCard = 0;

  return { yData, yDesc, yBtn, alturaCard };
}`,
    solucaoGuiadaJS: `function calcularBoxModel(cfg) {
  const yData = cfg.pad + 40 + cfg.g1;
  const yDesc = yData + 24 + cfg.g2;
  const yBtn = yDesc + 48 + cfg.g3;
  const alturaCard = yBtn + cfg.btn + cfg.pad;

  return { yData, yDesc, yBtn, alturaCard };
}`,
    mochilaResumo: "Coordenadas Y no Grid 8px (72-112-184-256) + Box Model JS",
  },

  /* ================= ATO II: INTERACAO, ACESSIBILIDADE & PADROES (1h15 - 2h15) ================= */
  {
    id: 3,
    ato: "Ato II — Interação & Padrões",
    slug: "estados-contraste",
    titulo: "Missão 4: Os 5 Estados do Botão, Contraste WCAG & Máquina de Estados JS",
    pilarUI: "Affordance + Signifiers + Contraste 4.5:1 (Texto) e 3:1 (Foco)",
    pilarJS: "Gerenciamento de Estado + Decremento de Vagas + Disabled Semântico",
    briefing:
      "O cliente pediu o azul mais claro possível no botão 'Inscrever-se' sem reprovar na acessibilidade WCAG 2.2 AA! O Designer deve escolher na paleta o tom mais claro para Default (mínimo 4.5:1 com texto branco), Hover (1 tom mais escuro), Pressed (2 tons mais escuros), Anel de Foco (mínimo 3:1 contra o card branco) e a estratégia correta de Disabled. Depois, o Dev JS programa o contador interativo de vagas que atualiza os estados do botão em tempo real!",
    tokenUIEsperado: "UI4-600-700-800-500-B",
    tokenJSEsperado: "JS4-STATE-OK",
    tokenPOEsperado: "PO-WCAG45",
    dica: "Na paleta azul: o tom 500 tem contraste 3.9:1 (reprova para texto normal de 16px, mas passa em 3:1 para o anel de foco!). O tom mais claro que passa em 4.5:1 é o 600 (5.9:1). Logo: Default = 600, Hover = 700, Pressed = 800, Foco = 500, Disabled = Estratégia B (nunca só cor!). Token UI: UI4-600-700-800-500-B.",
    codigoInicialJS: `// MISSÃO 4 (DEV JS): Controle o estado do botão e o contador de vagas!
// Quando o usuário clica em Inscrever-se:
// 1. Diminua 1 vaga de 'vagasAtuais' (sem deixar ficar menor que 0).
// 2. Se restarem 0 vagas, retorne:
//    { vagas: 0, estado: "disabled", bloqueado: true, rotulo: "Inscrições encerradas", tomHex: "#d9dde4" }
// 3. Se ainda houver vagas (> 0), retorne:
//    { vagas: novasVagas, estado: "default", bloqueado: false, rotulo: "Inscrever-se", tomHex: "#2f5bd3" }

function processarInscricao(vagasAtuais) {
  let novasVagas = vagasAtuais - 1;
  if (novasVagas <= 0) {
    return {
      vagas: 0,
      estado: "disabled",
      bloqueado: false, // Ajuste conforme a regra 2 acima
      rotulo: "Inscrever-se", // Ajuste o rótulo conforme a regra 2 acima
      tomHex: "#d9dde4"
    };
  }

  return {
    vagas: novasVagas,
    estado: "default",
    bloqueado: false,
    rotulo: "Inscrever-se",
    tomHex: "#2f5bd3"
  };
}`,
    solucaoGuiadaJS: `function processarInscricao(vagasAtuais) {
  let novasVagas = vagasAtuais - 1;
  if (novasVagas <= 0) {
    return {
      vagas: 0,
      estado: "disabled",
      bloqueado: true,
      rotulo: "Inscrições encerradas",
      tomHex: "#d9dde4"
    };
  }
  return {
    vagas: novasVagas,
    estado: "default",
    bloqueado: false,
    rotulo: "Inscrever-se",
    tomHex: "#2f5bd3"
  };
}`,
    mochilaResumo: "Paleta WCAG (600-700-800-500-B) + Máquina de Estado JS",
  },
  {
    id: 4,
    ato: "Ato II — Interação & Padrões",
    slug: "consistencia-darkpatterns",
    titulo: "Missão 5: Auditoria de Padrões (Lei de Jakob), Dark Patterns & Busca JS",
    pilarUI: "Consistência Externa/Interna + Expurgo de Dark Patterns",
    pilarJS: "Filtragem Combinada de Arrays (.filter + .includes)",
    briefing:
      "Antes de liberar o feed de eventos, o Squad precisa auditar 8 elementos espalhados em 3 telas do app, separando o que é Padrão Correto (0), Inconsistência contra a Lei de Jakob ou interna (1) e Dark Pattern anti-usuário (2). Em seguida, o Engenheiro JS deve programar o motor de busca e filtragem que também remove automaticamente qualquer evento marcado com `darkPattern: true`!",
    tokenUIEsperado: "UI5-01201222",
    tokenJSEsperado: "JS5-FILTER-OK",
    tokenPOEsperado: "PO-JAKOB8",
    dica: "Auditoria dos 8 marcadores: A (Lupa na busca) = 0; B (Engrenagem para abrir filtro) = 1; C (Cronômetro falso que reinicia) = 2; D (Secundário com contorno ao lado do primário) = 0; E (Disquete para salvar onde antes era coração) = 1; F ('Não, prefiro continuar desatualizado') = 2; G (Caixa de ofertas já marcada) = 2; H (Taxa de R$ 4,90 revelada só no último passo) = 2. Código: UI5-01201222.",
    codigoInicialJS: `// MISSÃO 5 (DEV JS): Filtre os eventos por categoria, busca textual E remova Dark Patterns!
// Cada item de 'eventos' tem: { titulo, categoria, darkPattern: boolean }
// Regras:
// 1. Se 'item.darkPattern' for true, descarte o item imediatamente!
// 2. Se 'categoriaAtiva' !== "Todas", exija item.categoria === categoriaAtiva.
// 3. Se 'textoBusca' não for vazio, exija que item.titulo (em minúsculas) inclua o termo buscado.

function filtrarEventosSeguros(eventos, categoriaAtiva, textoBusca) {
  const termo = (textoBusca || "").trim().toLowerCase();

  return eventos.filter((item) => {
    if (item.darkPattern === true) return false;
    const bateCategoria = (categoriaAtiva === "Todas") || (item.categoria === categoriaAtiva);
    // Complete a busca por texto no título (ignorando maiúsculas/minúsculas):
    const bateBusca = true;

    return bateCategoria && bateBusca;
  });
}`,
    solucaoGuiadaJS: `function filtrarEventosSeguros(eventos, categoriaAtiva, textoBusca) {
  const termo = (textoBusca || "").trim().toLowerCase();

  return eventos.filter((item) => {
    if (item.darkPattern === true) return false;
    const bateCategoria = (categoriaAtiva === "Todas") || (item.categoria === categoriaAtiva);
    const bateBusca = termo === "" || item.titulo.toLowerCase().includes(termo);
    return bateCategoria && bateBusca;
  });
}`,
    mochilaResumo: "Auditoria 8 Marcadores (01201222) + Filtro JS Anti-DarkPattern",
  },
  {
    id: 5,
    ato: "Ato II — Interação & Padrões",
    slug: "wireframe-lowfi",
    titulo: "Missão 6: Esqueleto Low-Fi (Wireframe) & Compilador de Regiões DOM",
    pilarUI: "Abstração de Wireframe (1 Bloco por Região Funcional, Sem Enfeites)",
    pilarJS: "Pipeline de Transformação de Dados (.filter + .map)",
    briefing:
      "O cliente quer redesenhar a tela inicial do app e pediu o wireframe de baixa fidelidade da tela atual. No wireframe, cada região funcional vira um bloco de cima para baixo, itens repetidos entram uma vez por ocorrência, elementos flutuantes entram pela posição vertical e ilustrações meramente decorativas são ignoradas! O Designer monta a pilha de regiões e o Dev JS programa o gerador que transforma a árvore de regiões em blocos semânticos!",
    tokenUIEsperado: "UI6-AB-BU-CH-BA-IL-IL-CA-FB-TA",
    tokenJSEsperado: "JS6-WIRE-OK",
    tokenPOEsperado: "PO-WIRE9",
    dica: "De cima para baixo na tela: 1. App bar (AB) -> 2. Campo de busca (BU) -> 3. Chips de filtro (CH) -> 4. Banner hero (BA) -> (ignore a ilustração decorativa IM!) -> 5. Item de lista 1 (IL) -> 6. Item de lista 2 (IL) -> 7. Card em destaque (CA) -> 8. Botão flutuante (FB, flutua acima da barra inferior) -> 9. Barra de abas (TA). Sequência: AB-BU-CH-BA-IL-IL-CA-FB-TA.",
    codigoInicialJS: `// MISSÃO 6 (DEV JS): Compile a lista de camadas da tela em uma pilha limpa de Wireframe!
// Cada item de 'camadas' tem: { sigla: "AB", funcao: "navegar", decorativo: false }
// Regras do Wireframe:
// 1. Remova qualquer camada onde 'decorativo === true' (enfeite não vira bloco!).
// 2. Extraia apenas a propriedade 'sigla' de cada camada funcional e junte com hífen "-".

function compilarWireframe(camadas) {
  const funcionais = camadas.filter((c) => {
    // Retorne true apenas quando a camada NÃO for decorativa:
    return true;
  });

  return funcionais.map((c) => c.sigla).join("-");
}`,
    solucaoGuiadaJS: `function compilarWireframe(camadas) {
  const funcionais = camadas.filter((c) => c.decorativo !== true);
  return funcionais.map((c) => c.sigla).join("-");
}`,
    mochilaResumo: "Pilha Wireframe (AB-BU-CH-BA-IL-IL-CA-FB-TA) + Compilador DOM JS",
  },

  /* ================= ATO III: USABILIDADE, PONTE FIGMA & PROJETO CAPSTONE (2h15 - 3h15+) ================= */
  {
    id: 6,
    ato: "Ato III — Usabilidade & Figma",
    slug: "tribunal-nielsen",
    titulo: "Missão 7: Tribunal das 10 Heurísticas de Nielsen & Formulário Blindado JS",
    pilarUI: "Diagnóstico de Usabilidade (Heurísticas #1 a #10 de Nielsen)",
    pilarJS: "Validação de Formulário + Prevenção (#5) e Recuperação (#9)",
    briefing:
      "Chegou a hora da Rodada de Inspeção Cruzada! Enquanto os QA Hunters (alunos com a Folha A4 #2) visitam os Squads vizinhos, a bancada julga 7 violações reais do Portal Acadêmico usando as 10 Heurísticas de Nielsen (cuidado para não confundir #5 Prevenção antes do erro com #9 Recuperação depois do erro!). Ao mesmo tempo, o Engenheiro JS blinda o validador de matrícula com mensagens humanas e claras.",
    tokenUIEsperado: "UI7-1-5-9-6-4-3-2",
    tokenJSEsperado: "JS7-NIELSEN-OK",
    tokenPOEsperado: "PO-NIELSEN10",
    dica: "Julgamento dos 7 problemas (veja a Folha A4 #1): P1 (Tela em branco 20s esperando) = #1 Status; P2 (Campo aceita data '31/02/2026') = #5 Prevenção; P3 ('Erro 0x80041' sem instrução) = #9 Recuperação; P4 (Exigir decorar código 'ADS-204' sem lista) = #6 Reconhecer em vez de lembrar; P5 ('Salvar' azul na tela 1 e 'Gravar' verde na tela 2) = #4 Consistência; P6 (Apagar sem botão Desfazer) = #3 Controle e liberdade; P7 ('Submeter requerimento de vínculo discente') = #2 Mundo real. Código: UI7-1-5-9-6-4-3-2.",
    codigoInicialJS: `// MISSÃO 7 (DEV JS): Valide o formulário aplicando as Heurísticas #5, #6 e #9 de Nielsen!
// Regras:
// 1. Se 'dados.nome' estiver vazio, retorne { valido: false, heuristica: 5, erro: "Informe seu nome completo." }
// 2. Se 'dados.data' for "31/02/2026", retorne { valido: false, heuristica: 5, erro: "Data inexistente: escolha um dia válido de fevereiro." }
// 3. Se 'dados.curso' não estiver na lista ["UI/UX", "Web JS", "Redes"], retorne { valido: false, heuristica: 6, erro: "Selecione um curso válido da lista visível." }
// 4. Se tudo estiver certo, retorne { valido: true, heuristica: 1, mensagem: "Matrícula enviada! Acompanhe o protocolo na tela." }

function validarMatriculaAcad(dados) {
  const cursosValidos = ["UI/UX", "Web JS", "Redes"];
  const nome = (dados.nome || "").trim();
  const data = (dados.data || "").trim();

  if (nome === "") {
    return { valido: false, heuristica: 5, erro: "Informe seu nome completo." };
  }
  if (data === "31/02/2026") {
    return { valido: false, heuristica: 5, erro: "Data inexistente: escolha um dia válido de fevereiro." };
  }
  // Adicione a verificação se dados.curso NÃO está em cursosValidos (!cursosValidos.includes(dados.curso)):


  return { valido: true, heuristica: 1, mensagem: "Matrícula enviada! Acompanhe o protocolo na tela." };
}`,
    solucaoGuiadaJS: `function validarMatriculaAcad(dados) {
  const cursosValidos = ["UI/UX", "Web JS", "Redes"];
  const nome = (dados.nome || "").trim();
  const data = (dados.data || "").trim();

  if (nome === "") {
    return { valido: false, heuristica: 5, erro: "Informe seu nome completo." };
  }
  if (data === "31/02/2026") {
    return { valido: false, heuristica: 5, erro: "Data inexistente: escolha um dia válido de fevereiro." };
  }
  if (!cursosValidos.includes(dados.curso)) {
    return { valido: false, heuristica: 6, erro: "Selecione um curso válido da lista visível." };
  }
  return { valido: true, heuristica: 1, mensagem: "Matrícula enviada! Acompanhe o protocolo na tela." };
}`,
    mochilaResumo: "Parecer de Nielsen (1-5-9-6-4-3-2) + Validador Completo JS",
  },
  {
    id: 7,
    ato: "Ato III — Usabilidade & Figma",
    slug: "autolayout-capstone",
    titulo: "Missão 8 (Boss Final): Auto Layout Figma & Motor de Componentes JS",
    pilarUI: "Auto Layout Aninhado + Fixed/Hug/Fill + Nomenclatura Semântica (11 Camadas)",
    pilarJS: "Cálculo Estrutural de Auto Layout + Contrato JSON de Handoff",
    briefing:
      "Última fechadura antes do Desafio Final! O Arquiteto de UI estrutura o componente 'Card/Evento' com 3 níveis de Auto Layout aninhados (Card/Evento > conteudo > cabecalho > chips), respeitando as margens de 16px de um frame mobile de 360px e configurando Fixed, Hug e Fill container para que a descrição quebre em 2 linhas. O Engenheiro JS programa o motor de cálculo de Auto Layout que valida a árvore de 11 nomes semânticos e exporta a assinatura do componente.",
    tokenUIEsperado: "UI8-328x296-N11",
    tokenJSEsperado: "JS8-AUTOLAYOUT-OK",
    tokenPOEsperado: "PO-FIG328",
    dica: "Cálculo da altura com Auto Layout aninhado: Frame 'chips' horizontal tem altura 24. Frame 'cabecalho' (vertical, gap 8) soma: título (40) + gap (8) + data (24) + gap (8) + chips (24) = 104px. Frame 'conteudo' (vertical, gap 16, Fill container) soma: cabecalho (104) + gap (16) + descricao em 2 linhas (56) = 176px. Frame 'Card/Evento' (largura 360 - 2x16 = 328px, padding 24, gap 24) soma: pad (24) + conteudo (176) + gap (24) + botao (48) + pad (24) = 296px. Na bancada, completando os 4 ajustes corretos com 11 camadas nomeadas, o token é UI8-328x296-N11!",
    codigoInicialJS: `// MISSÃO 8 (DEV JS): Calcule as dimensões do componente com Auto Layout Aninhado!
// Recebe 'arvore':
// { larguraFrame: 360, margemGrid: 16, padCard: 24, gapCab: 8, gapCont: 16, gapCard: 24,
//   altTitulo: 40, altData: 24, altChips: 24, altDescDuasLinhas: 56, altBotao: 48, camadasNomeadas: 11 }
// Calcule:
// 1. larguraCard = larguraFrame - (2 * margemGrid)  --> 328
// 2. altCabecalho = altTitulo + gapCab + altData + gapCab + altChips  --> 104
// 3. altConteudo = altCabecalho + gapCont + altDescDuasLinhas  --> 176
// 4. alturaCard = padCard + altConteudo + gapCard + altBotao + padCard  --> 296
// 5. Retorne a assinatura no formato: \`\${larguraCard}x\${alturaCard}-N\${arvore.camadasNomeadas}\`

function calcularAutoLayout(arvore) {
  const larguraCard = arvore.larguraFrame - (2 * arvore.margemGrid);
  const altCabecalho = arvore.altTitulo + arvore.gapCab + arvore.altData + arvore.gapCab + arvore.altChips;
  const altConteudo = altCabecalho + arvore.gapCont + arvore.altDescDuasLinhas;
  // Calcule a alturaCard somando padCard (topo) + altConteudo + gapCard + altBotao + padCard (base):
  const alturaCard = 0;

  return {
    largura: larguraCard,
    altura: alturaCard,
    assinatura: \`\${larguraCard}x\${alturaCard}-N\${arvore.camadasNomeadas}\`
  };
}`,
    solucaoGuiadaJS: `function calcularAutoLayout(arvore) {
  const larguraCard = arvore.larguraFrame - (2 * arvore.margemGrid);
  const altCabecalho = arvore.altTitulo + arvore.gapCab + arvore.altData + arvore.gapCab + arvore.altChips;
  const altConteudo = altCabecalho + arvore.gapCont + arvore.altDescDuasLinhas;
  const alturaCard = arvore.padCard + altConteudo + arvore.gapCard + arvore.altBotao + arvore.padCard;

  return {
    largura: larguraCard,
    altura: alturaCard,
    assinatura: \`\${larguraCard}x\${alturaCard}-N\${arvore.camadasNomeadas}\`
  };
}`,
    mochilaResumo: "Auto Layout Aninhado (328x296-N11) + Motor de Handoff Figma->JS",
  },
];
