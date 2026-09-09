# n8n vs Agente de Código — o que muda ao portar um prompt

Use esta tabela para revisar rapidamente um briefing e identificar quais
suposições "estilo n8n" precisam ser traduzidas antes de gerar o prompt
final para um agente de código.

| Dimensão | Prompt para n8n (AI Agent node) | Prompt para agente de código |
|---|---|---|
| **Declaração de tools** | Tools são nós visuais autodescritos — o modelo "descobre" cada tool pela configuração do nó, sem precisar que o prompt explique nada. | Tools são schemas JSON reais (`{type:"function", function:{name, description, parameters}}`) definidos no código. O prompt precisa referenciar cada uma pelo `name` exato e explicar quando/como chamar. |
| **Interpolação de variável** | Sintaxe de expressão embutida direto no texto do prompt, ex: `{{ $json.nome }}`, `{{ $now }}`. | Não existe sintaxe de expressão dentro do prompt. O runtime injeta blocos de contexto inteiros (JSON, resumos, listas) ANTES/DEPOIS do prompt base, em tempo de execução. O prompt só precisa dizer como interpretar esses blocos quando chegarem. |
| **Formato de chamada** | Single-shot: uma execução do node por evento, geralmente sem loop de ferramentas complexo. | Loop multi-turno de tool-calling: o modelo pode chamar várias ferramentas em sequência antes de responder ao usuário final. O prompt precisa orientar o comportamento durante e depois do loop. |
| **Formatação/restrições** | Configuradas no próprio nó ou fixas no texto do prompt (regras estáticas). | Parte das regras vive no código (ex: `max_response_chars`, split de mensagem por linha em branco, sanitização de saída) — o prompt deve declarar essas regras como parâmetros configuráveis por canal, não como suposições fixas. |
| **Anti-vazamento (anti-leak)** | Raramente necessário — é uma única chamada, sem "narração" de passos internos. | Obrigatório — como o agente pode narrar ações entre turnos de tool calls, é preciso proibir explicitamente menções a "sistema", "ferramenta", "IA", "bot", "webhook", "API", "n8n", nomes literais de função, e qualquer meta-comentário sobre a própria execução. |
| **Artefato de saída** | Export JSON de workflow n8n (ou texto para colar no campo "System Message" do node). | Texto puro pronto para colar numa coluna de banco (`system_prompt`), constante de código, ou arquivo `.md` — nunca JSON de workflow, nunca sintaxe de expressão de nenhuma engine. |

## Sinal de alerta

Se o briefing do usuário mencionar "nó", "workflow", "node do n8n", "webhook
do Make/Zapier" ou pedir explicitamente uma automação visual, pare e avise:
este skill gera prompts para agentes de código com function calling real —
sugira ao usuário um gerador orientado a n8n para esse caso.
