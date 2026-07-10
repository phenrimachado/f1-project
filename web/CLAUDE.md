@AGENTS.md

# Convenções de front-end

## Mobile-first (obrigatório)

Todo layout novo ou alteração de layout é construído mobile-first:
estilos base (sem prefixo) valem pro menor breakpoint, e classes `sm:`
`md:` `lg:` `xl:` do Tailwind adicionam/ajustam pra telas maiores —
nunca o caminho inverso (nunca estilizar pra desktop primeiro e depois
"consertar" com `max-*` ou breakpoints negativos).

Checklist ao criar/alterar uma tela:
- Grid/flex: definir a coluna única (mobile) primeiro, expandir com
  `sm:grid-cols-2`, `lg:grid-cols-3` etc.
- Tabelas largas (ex: laps com setores): garantir scroll horizontal
  (`overflow-x-auto`) em telas estreitas em vez de espremer colunas.
- Espaçamento/tamanho de fonte: base pensada pro mobile, aumentar em
  breakpoints maiores quando fizer sentido (`text-sm md:text-base`).
- Testar (ou pelo menos revisar) a tela na largura mínima antes de
  considerar a task concluída.
