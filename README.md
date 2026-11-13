<!--
autor: Prof. Marcos V. Moraes
proposito: Guia rapido do projeto Operacao Estudio Oito (UI/UX Figma + Desenvolvimento Web JavaScript)
criado: 2026-11-12T16:27:00-03:00
atualizado: 2026-11-12T21:04:00-03:00
versao: 2.2.2
-->
# Operação Estúdio Oito — UI/UX (Figma) & JavaScript

Aplicação web educacional e material de apoio impresso para unir **Design de UI/UX (Figma)** e **Desenvolvimento Web (JavaScript)** em desafios práticos por Squads.

## 1. Como Iniciar Localmente

No Windows, dê dois cliques em `iniciar.bat` ou execute no terminal:

```powershell
.\iniciar.bat
```

Depois, abra `http://localhost:8080/` no navegador.

## 2. Estrutura do Projeto (Edição Pública dos Alunos)

- `index.html`: Portal de entrada com papéis do Squad e atalho para a bancada das missões.
- `quest/index.html`: **Bancada do Estúdio** com 8 Fechaduras em 3 Atos + Desafio Final (Bancada UI/UX + Editor e Test Runner JavaScript + Cofre de 3 chaves).
- `iniciar.bat`: Servidor HTTP local na porta `8080` para testes offline no Windows.

> Os materiais de apoio impressos (`impressos/prancheta-conselheiro.html`, `impressos/passaporte-qa.html`) e o placar com gabarito (`placar/index.html`) ficam mantidos exclusivamente no repositório privado do professor para abertura local em sala via `iniciar.bat`.

## 3. Pontuação e Limitação do Código `SNC1.`

- **Cálculo:** `150 pts` por fechadura + `200 pts` de bônus ao completar `8/8`, descontando `-5 pts` por erro no cofre, `-10 pts` por dica revelada e `-5 pts` por uso de *Completar sintaxe* (piso de `80 pts` por missão concluída). Códigos inconsistentes ou com `8/8` em menos de 60 segundos são marcados como `[FAIL] Código inconsistente` e ordenados abaixo dos válidos.
- **Limitação (app estático):** como toda a aplicação roda no navegador sem backend, a chave de assinatura do selo `SNC1.` reside no cliente e serve apenas para detectar edição acidental. O professor deve sempre conferir a Folha A4 #1 assinada e o tempo observado na bancada.
- **Separação de placar e gabarito (opção a aplicada):** os arquivos `placar/` e `impressos/` não são publicados neste repositório público nem no GitHub Pages, permanecendo apenas no repositório privado do docente para execução local via `iniciar.bat`. Ainda assim, `quest/assets/js/missoes.js` é código cliente carregado no navegador durante o jogo; por isso, a atividade é conduzida de forma presencial e supervisionada com validação na Folha A4 #1.
