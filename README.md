<!--
autor: Prof. Marcos V. Moraes
proposito: Guia rapido do projeto Operacao Estudio Oito (UI/UX Figma + Desenvolvimento Web JavaScript)
criado: 2026-11-12T16:27:00-03:00
atualizado: 2026-11-12T19:38:00-03:00
versao: 2.2.0
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

## 3. Pontuação e Limitação do Código `SNC1.`

- **Cálculo:** `150 pts` por fechadura + `200 pts` de bônus ao completar `8/8`, descontando `-5 pts` por erro no cofre, `-10 pts` por dica revelada e `-5 pts` por uso de *Completar sintaxe* (piso de `80 pts` por missão concluída). Códigos inconsistentes ou com `8/8` em menos de 60 segundos são marcados como `[FAIL] Código inconsistente` e ordenados abaixo dos válidos.
- **Limitação (app estático):** como toda a aplicação roda no navegador sem backend, a chave de assinatura do selo `SNC1.` reside no cliente e serve apenas para detectar edição acidental. O professor deve sempre conferir a Folha A4 #1 assinada e o tempo observado na bancada.
