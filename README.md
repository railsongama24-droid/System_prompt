# System_prompt

**Prompt Architect for Code Agents** — uma skill `SKILL.md` (padrão cross-tool
usado por Claude Code, Codex CLI e OpenCode) que gera system prompts para
agentes de IA escritos em código próprio (function calling real), em vez de
agentes visuais como n8n, Make ou Zapier.

## O problema

Prompts gerados para o nó AI Agent do n8n assumem um modelo mental específico:
tools autodescritas nos próprios nós visuais, variáveis resolvidas por
expressões `{{ $json.campo }}` embutidas no texto, e uma execução single-shot
por evento. Um agente de IA rodando dentro de um backend próprio (por exemplo,
um agente de WhatsApp em TypeScript/Deno com function calling real) funciona
de um jeito bem diferente:

- As ferramentas são schemas JSON reais (`{type:"function", function:{name,
  description, parameters}}`), chamadas pelo `name` exato definido no código.
- O runtime injeta blocos de contexto (JSON de dados vivos, resumo de
  conversa, catálogo) ao redor do prompt base, em tempo de execução — não há
  sintaxe de expressão embutida no prompt.
- Existe um loop de tool-calling multi-turno, o que exige regras explícitas
  de anti-vazamento (o agente não pode narrar suas próprias ações internas
  nem citar "sistema", "ferramenta", "IA", "bot", "webhook", "API", "n8n").
- Restrições de formatação (limite de caracteres, quebra de mensagem,
  caracteres proibidos) costumam já existir no código e precisam ser
  parametrizadas por canal, não assumidas como fixas.

Reaproveitar um prompt pensado para n8n num sistema desse tipo faz o agente
"não ser bem reconhecido" pelo runtime — o formato simplesmente não bate com
o que o código espera. Este projeto resolve isso com uma skill dedicada.

## O que a skill produz

Um prompt XML-tagged (`<core_identity><psique>...</psique></core_identity>`,
`<protocolo_de_conhecimento>`, `<functions_and_rules>`, `<interaction_flow>`,
`<response_requirements>`, `<restrictions>`, `<support_info>`) pronto para
colar numa coluna `system_prompt` de banco de dados ou numa constante de
código, com:

- Ferramentas referenciadas pelos nomes reais de função do seu backend.
- Regras explícitas de anti-vazamento / anti-meta-comentário.
- Restrições de formatação configuráveis por canal (WhatsApp hoje,
  extensível para outros canais).
- Uma checklist de perguntas obrigatórias que a skill faz antes de gerar o
  prompt, para não assumir nada sobre suas tools, seu contexto injetado em
  runtime ou seu canal de saída.

Veja o skill completo em
[`skill/code-agent-prompt-architect/SKILL.md`](skill/code-agent-prompt-architect/SKILL.md).

## Instalação

```
npm install -g git+https://github.com/railsongama24-droid/System_prompt.git
```

O `postinstall` copia automaticamente a skill para as pastas pessoais das
três ferramentas suportadas (escopo global — fica disponível em qualquer
projeto):

- `~/.claude/skills/code-agent-prompt-architect`
- `~/.codex/skills/code-agent-prompt-architect`
- `~/.config/opencode/skills/code-agent-prompt-architect`
- `~/.agents/skills/code-agent-prompt-architect` (pasta compartilhada,
  também lida pelo OpenCode)

Se o `postinstall` não rodar (por exemplo com `--ignore-scripts`), ou se você
instalar uma ferramenta nova depois, reexecute manualmente a qualquer
momento:

```
prompt-architect-install
```

## Uso por ferramenta

- **Claude Code**: a skill é descoberta automaticamente a partir de
  `~/.claude/skills/code-agent-prompt-architect/SKILL.md`. Peça um system
  prompt para um agente de código e ela dispara sozinha, ou invoque
  explicitamente.
- **Codex CLI**: descoberta a partir de `~/.codex/skills/`.
- **OpenCode**: descoberta a partir de `~/.config/opencode/skills/` (e
  também lê os fallbacks compartilhados `~/.agents/skills/` e
  `~/.claude/skills/`).

## Verificando a instalação

```
# macOS / Linux
ls ~/.claude/skills/code-agent-prompt-architect
ls ~/.codex/skills/code-agent-prompt-architect
ls ~/.config/opencode/skills/code-agent-prompt-architect
ls ~/.agents/skills/code-agent-prompt-architect
```

```powershell
# Windows (PowerShell)
Get-ChildItem "$env:USERPROFILE\.claude\skills\code-agent-prompt-architect"
Get-ChildItem "$env:USERPROFILE\.codex\skills\code-agent-prompt-architect"
Get-ChildItem "$env:USERPROFILE\.config\opencode\skills\code-agent-prompt-architect"
Get-ChildItem "$env:USERPROFILE\.agents\skills\code-agent-prompt-architect"
```

## Atualizando / desinstalando

Atualizar (repuxa a versão mais recente do git e reinstala):

```
npm install -g git+https://github.com/railsongama24-droid/System_prompt.git
```

Desinstalar (remove a skill das 4 pastas via `preuninstall`):

```
npm uninstall -g prompt-architect-code-agents
```

## Estrutura do repositório

```
System_prompt/
├── README.md
├── package.json
├── LICENSE
├── prompts/             # arquivo dos prompts gerados com a skill (não vai no pacote npm)
│   ├── README.md        # índice, com o runtime de destino de cada prompt
│   └── *.md             # um arquivo por prompt, versionado
├── scripts/
│   ├── install.js       # copia a skill para as 4 pastas de destino
│   └── uninstall.js     # remove a skill das 4 pastas de destino
└── skill/
    └── code-agent-prompt-architect/
        ├── SKILL.md                              # a skill em si
        └── references/
            ├── n8n-vs-code-agent-cheatsheet.md    # tabela comparativa n8n vs código
            └── worked-example-code-agent-prompt.md # exemplo completo gerado pela skill
```

## Licença

MIT
