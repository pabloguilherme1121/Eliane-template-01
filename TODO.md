# Eliane Fashion V3 · Estado atual

## Concluído no código entregue

- [x] Vitrine, catálogo, favoritos, sacola e consulta por WhatsApp separados de backend real.
- [x] Regras de persistência da sacola validadas, com limite técnico e filtros de tamanhos/IDs inválidos.
- [x] Busca tolerante a acentos, diferenças de caixa e espaços extras, com ação de limpar.
- [x] Filtros de produto, seleção de tamanho e estado de miniatura.
- [x] Fallback editorial para fotos ausentes, sem solicitar imagens legadas `/manus-storage`.
- [x] Painel de teste identificado e indicadores derivados dos dados locais, sem crescimento inventado.
- [x] Sanitização dos dados restaurados de pedidos, preços e configuração do painel.
- [x] Relatórios CSV/HTML protegidos de injeção básica de fórmula e marcação.
- [x] Controles maiores e rolagem horizontal para navegação administrativa.
- [x] 19 testes de lógica aprovados, 87 arquivos TS/TSX analisados sintaticamente e checagem estrita dos módulos puros.

## Pendente para homologar

- [ ] Instalar dependências e executar `pnpm check`, `pnpm lint`, `pnpm test` e o build Expo.
- [ ] Testar telas em Chromium/WebKit/Firefox nas larguras 320, 390, 768 e desktop, verificando quebra, foco e áreas de toque.
- [ ] Testar dispositivo Android real, instalação, restaurar favoritos/sacola, navegação e WhatsApp.
- [ ] Substituir placeholders por fotografias comerciais autorizadas.
- [ ] Validar catálogo, preços, estoque, contato, frete, termos de troca e privacidade com a loja.
- [ ] Implantar backend, autenticação do painel e sincronização antes de usar pedidos reais.
- [ ] Fazer testes de abuso e revisão de permissões no backend antes de publicar.

O checklist histórico anterior foi preservado em `docs/todo-v2-historico.md` e não deve ser interpretado como estado de produção.
