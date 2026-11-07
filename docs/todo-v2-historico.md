# TODO — Eliane Fashion Mobile

## Descoberta e navegação

- [x] A Home usa a linguagem de moda, estilo e tendências da referência pública e apresenta hero, novidades, categorias e um CTA de atendimento pelo WhatsApp.
- [x] A Home apresenta uma seção de depoimentos de clientes com nome, cidade, avaliação e comentário, usando dados demonstrativos locais.
- [x] A Home apresenta um feed simulado do Instagram com cabeçalho de perfil, imagem, ações, curtidas e legenda, sem copiar posts reais.
- [x] A Home apresenta um banner promocional de frete grátis na primeira compra, com ação para abrir a vitrine.
- [x] O app mostra um pop-up de captura de e-mail para primeira compra, valida o formato do e-mail, mostra confirmação e persiste dispensa ou cadastro localmente.
- [x] A navegação inferior apresenta Início, Catálogo, Favoritos, Sacola e Perfil, com estado ativo legível e alvos de toque adequados para uso com uma mão.

## Catálogo e descoberta de looks

- [x] O Catálogo lista produtos de demonstração nas categorias Vestidos, Macaquinhos, Tricot, Moletons, Fitness e Saias.
- [x] O Catálogo permite busca textual, filtro por categoria, filtro avançado por cor, tamanho e faixa de preço, ordenação e estado vazio com recuperação.

## Detalhe e compra assistida

- [x] A página de detalhe mostra galeria de imagens, nome, descrição, preço, tamanhos e ação de adicionar à sacola.
- [x] O detalhe oferece compra assistida pelo WhatsApp com o nome do produto e tamanho selecionado.
- [x] A Sacola permite alterar quantidade, remover itens, visualizar subtotal, avançar para um resumo demonstrativo e continuar pelo WhatsApp.
- [x] O fluxo navegável foi validado com inclusão de produto, aumento de quantidade, subtotal dinâmico, checkout demonstrativo e estado vazio após remoção.

## Favoritos e persistência local

- [x] A pessoa pode incluir e remover produtos dos Favoritos a partir das listas e do detalhe.
- [x] Favoritos e Sacola persistem localmente no dispositivo usando AsyncStorage e são restaurados ao reabrir o app.

## Perfil, pedidos e atendimento

- [x] O Perfil mostra informações demonstrativas da cliente, pedidos com status e atalhos de conta.
- [x] O atalho de Atendimento no Perfil abre o WhatsApp oficial informado no perfil de referência.

## Painel administrativo

- [x] A rota administrativa está acessível pelo Perfil e apresenta indicadores de produtos ativos, pedidos e vendas demonstrativas.
- [x] A aba Produtos permite buscar, filtrar por categoria, editar preço na sessão e alternar cada produto entre Ativo e Oculto.
- [x] A aba Pedidos permite filtrar por status e avançar o status de um pedido por toque, mantendo o fluxo Recebido, Em separação, Em trânsito, Enviado e Entregue.
- [x] O painel informa claramente que os dados são demonstrativos e que a integração persistente com autenticação e banco fica preparada para uma próxima etapa.

## Arquitetura e próxima integração

- [x] Produtos, pedidos, carrinho, favoritos e contato ficam separados em módulos de dados e estado, com pontos claros para futura conexão a backend, autenticação e pagamentos.
- [x] As imagens de Home, vitrine, detalhe, feed e sacola usam cache persistente `memory-disk`, e a imagem hero usa prioridade alta.
- [ ] Ao conectar uma API, adicionar estados de carregamento e erro nas telas que hoje usam dados locais.
- [x] A implementação preserva o starter Expo/React Native/TypeScript e os listeners fixos 8081/3000.

## Notificações e relatórios administrativos

- [x] O painel apresenta indicador de monitoramento ativo, contador de notificações não lidas e um centro de notificações com pedido, valor e horário.
- [x] A chegada de pedidos é simulada localmente por evento automático e pelo botão “Simular novo pedido”, com inserção imediata na lista, atualização de totais e alerta visual.
- [x] A aba Relatórios apresenta variação de vendas, quantidade de pedidos, vendas por dia em gráfico de barras, mix por categoria em barras horizontais e uma leitura rápida dos dados.
- [x] A interface informa que notificações, vendas e alterações são demonstrativas até a conexão com eventos reais, autenticação e banco.

## Persistência e exportação

- [x] Produtos, pedidos, filtros de categoria/status e seção selecionada são salvos no LocalStorage no Preview Web e carregados novamente ao abrir o painel.
- [x] O aplicativo nativo usa AsyncStorage como fallback compatível, preservando os mesmos dados do painel entre sessões.
- [x] A aba Relatórios possui ação Exportar CSV, gera arquivo com colunas de pedido, data, status, itens e total, e dispara o download no navegador.
- [x] A aba Relatórios possui ação Gerar PDF, abre uma versão formatada para impressão/salvamento como PDF no navegador e informa quando a função depende do Preview Web.

## Reformulação profissional do painel

- [x] O painel abre em uma Visão geral operacional com contexto da loja, resumo do dia, KPIs e estado de atividade.
- [x] A seção “Precisa de atenção” prioriza pedidos em andamento e os atalhos direcionam para pedidos, vitrine e desempenho.
- [x] A navegação foi reorganizada em Visão geral, Pedidos, Produtos e Relatórios, preservando as ações já implementadas.
- [x] A direção visual combina a assinatura quente da Eliane Fashion com estrutura de dashboard mais precisa, espaçada e legível no celular.
- [x] As referências de Shopify, Nuvemshop e Square foram registradas em `admin-benchmark.md` e convertidas em decisões originais de interface.
