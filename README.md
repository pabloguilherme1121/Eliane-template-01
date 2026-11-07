# Eliane Fashion · Aplicativo experimental (Expo)

Aplicativo demonstrativo para celular e web, desenvolvido com **Expo Router, React Native, TypeScript e NativeWind**. O foco é explorar peças, favoritar, montar uma sacola e **consultar disponibilidade pelo WhatsApp**. O painel administrativo contém apenas **dados locais de exemplo**.

> **Não é uma loja publicada:** não há pagamentos, reservas de estoque, autenticação de administradores nem sincronização com pedidos reais. Não use o painel com dados pessoais de clientes.

## Funcionalidades

- Vitrine, catálogo com busca e filtros, detalhes das peças e tamanhos.
- Favoritos e sacola persistidos localmente, com validação de itens e quantidades.
- Mensagem de consulta de pedido para WhatsApp, sem prometer cobrança ou frete.
- Painel demonstrativo com indicadores calculados a partir dos dados de exemplo.
- Controles móveis responsivos e placeholders quando faltam fotografias.

## Executar

Requisitos: Node.js 22, pnpm 9.12.0 e ferramentas Expo compatíveis.

```bash
corepack enable
pnpm install --frozen-lockfile
pnpm test:logic
pnpm check
pnpm lint
pnpm test
pnpm dev
```

Use `pnpm dev:metro` para iniciar somente a interface quando o servidor não for necessário. A integração OAuth/Manus e serviços associados exigem configuração própria. Consulte `.env.example` para os nomes de variáveis, sem inserir segredos nos arquivos versionados.

## Limitações e validação

- Os preços e os produtos são **dados demonstrativos**, a confirmar antes do uso comercial.
- A sacola prepara uma mensagem. O pedido depende de confirmação manual pelo atendimento.
- As fotografias comerciais originais não vieram no pacote; cartões de reserva sinalizam a ausência.
- A UI Expo Web e Android precisa ser testada em ambiente com dependências instaladas antes de qualquer deploy.
- Os testes de lógica não substituem testes E2E, acessibilidade e integração real.

Veja [README-QUALIDADE.md](README-QUALIDADE.md) para evidências anteriores e [docs/PUBLICACAO.md](docs/PUBLICACAO.md) para critérios de publicação.

## Repositórios relacionados

Este código é um **protótipo Expo separado** da [vitrine web Eliane Fashion](https://github.com/pabloguilherme1121/dainty-horse-23162a) e do [template Netlify](https://github.com/pabloguilherme1121/elianefashion-netlify-template). Evite copiar um projeto sobre o outro sem plano de migração.
