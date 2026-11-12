<!--
autor: Prof. Marcos V. Moraes
proposito: Guia rapido do projeto Operacao Estudio Oito (UI/UX Figma + Desenvolvimento Web JavaScript)
criado: 2026-11-12T16:27:00-03:00
atualizado: 2026-11-12T18:40:00-03:00
versao: 2.1.0
-->
# Operação Estúdio Oito — UI/UX (Figma) & JavaScript

Aplicação web educacional e material de apoio impresso para unir **Design de UI/UX (Figma)** e **Desenvolvimento Web (JavaScript)** em desafios práticos por Squads.

## 1. Como Iniciar Localmente

No Windows, dê dois cliques em `iniciar.bat` ou execute no terminal:

```powershell
.\iniciar.bat
```

O servidor local abrirá automaticamente em `http://localhost:8080/`.

## 2. Estrutura do Projeto

- `index.html`: Portal de entrada com papéis do Squad e atalhos para as missões, materiais impressos e placar.
- `quest/index.html`: **Bancada do Estúdio** com 8 Fechaduras em 3 Atos + Desafio Final (Bancada UI/UX + Editor e Test Runner JavaScript + Cofre de 3 chaves).
- `impressos/prancheta-conselheiro.html`: **Folha #1** para o *Product Owner / Conselheiro*, contendo regras de referência, cola rápida de JS, os 8 códigos verificadores e o Contrato de Handoff.
- `impressos/passaporte-qa.html`: **Folha #2** para o *QA Hunter* auditar outros 2 Squads.
- `placar/index.html`: **Placar Ao Vivo & Guia do Professor**, com validador de códigos `SNC1.` (8/8 missões), exportação CSV, roteiro da aula e gabarito ocultável.
