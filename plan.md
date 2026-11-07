# Plano — Eliane Fashion Mobile

## Direção de produto

O app é uma boutique mobile de social commerce para a Eliane Fashion. A referência principal é o perfil público `@elianefashionmoda`, que se apresenta com “moda • estilo • tendências” e direciona compras para o WhatsApp. O produto deve ser mais caloroso e direto que um e-commerce editorial tradicional: a cliente descobre um look, entende rapidamente preço e tamanho e consegue pedir ajuda ou finalizar pelo WhatsApp.

A navegação principal continua com Início, Catálogo, Favoritos, Sacola e Perfil. A Home destaca tendências e cria dois caminhos claros: explorar produtos ou falar com a equipe. Ela também inclui prova social com depoimentos demonstrativos, um feed simulado do Instagram e um banner de frete grátis na primeira compra. O Catálogo trabalha categorias que aparecem nos destaques e no conteúdo público do perfil, como Vestidos, Macaquinhos, Tricot, Moletons e Fitness, com filtros avançados por cor, tamanho e faixa de preço. O detalhe combina galeria, tamanhos, preço, sacola e compra assistida. Favoritos e sacola são persistidos localmente; os pedidos continuam demonstrativos.

## Direção visual atual

O estilo escolhido é **boutique social-commerce brasileira**. A identidade usa fundo creme claro, coral como cor de ação, azul-petróleo escuro para contraste e cartões brancos para facilitar leitura. As imagens mostram mulheres reais e curvas naturais em poses simples, com luz clara, produto visível e clima de loja acessível. A tipografia combina títulos serifados com sans-serif para preço, tamanhos e ações.

O layout é vertical e fácil de usar com uma mão. A primeira dobra apresenta a promessa “Moda que combina com você”, seguida pelo benefício de frete grátis, contato via WhatsApp, novidades e categorias. O pop-up de primeira compra valida o e-mail, reserva o benefício e grava a decisão localmente para não reaparecer. O app evita excesso de texto e usa CTAs concretos: “Falar no WhatsApp”, “Comprar pelo WhatsApp”, “Adicionar à sacola” e “Ver novidades”. O feedback aparece em banner curto depois das ações.

## Implementação

O projeto preserva o starter Expo Router / React Native / TypeScript do WebDev e seus listeners fixos 8081/3000. `lib/catalog.ts` concentra produtos, categorias, preços e pedidos demonstrativos. `lib/store.tsx` concentra favoritos, carrinho e persistência AsyncStorage. `lib/contact.ts` centraliza o número e a abertura do WhatsApp. As telas em `app/(tabs)` compõem a experiência principal; `app/product/[id].tsx` cuida do detalhe; `app/admin.tsx` oferece uma visão administrativa local para operação da loja.

O painel administrativo fica acessível pelo Perfil e usa duas abas. Em Produtos, a equipe busca e filtra itens por categoria, edita preço na sessão e alterna entre Ativo e Oculto. Em Pedidos, filtra por status e toca em um pedido para avançar o fluxo Recebido, Em separação, Em trânsito, Enviado e Entregue. O painel exibe indicadores simples de produtos ativos, pedidos e vendas demonstrativas. A tela informa que as alterações são locais até a futura conexão com autenticação, banco e API.

As imagens da nova versão são assets originais gerados para o app e mantêm uma linguagem própria, sem reproduzir posts do Instagram. As imagens usam `expo-image` com `cachePolicy="memory-disk"`, e a imagem hero recebe prioridade alta para reduzir recarregamentos em navegação mobile. A arquitetura permanece preparada para trocar dados locais por API, conectar autenticação, registrar pedidos e substituir o checkout demonstrativo por pagamento depois.

## Operação, notificações e relatórios

O painel administrativo agora possui um monitor de pedidos com estado ao vivo, contador de não lidos, centro de notificações e alerta visual para cada novo pedido. Como o projeto ainda usa dados locais, o modo atual simula um evento automático após alguns segundos e oferece a ação “Simular novo pedido”; o ponto de integração para eventos reais permanece isolado em `receiveDemoOrder`, pronto para ser substituído por WebSocket, SSE ou assinatura de backend.

A aba Relatórios usa componentes nativos leves, sem biblioteca pesada: cards de variação e pedidos, gráfico de barras de vendas dos últimos sete dias, barras horizontais de participação por categoria e uma leitura rápida de desempenho. Os valores são demonstrativos e devem ser substituídos por agregações persistidas quando o banco estiver conectado.

## Persistência e exportação

`lib/admin-storage.ts` centraliza a persistência do painel. No Preview Web usa `window.localStorage`; no aplicativo nativo usa o `AsyncStorage` já instalado, mantendo a mesma chave e o mesmo formato JSON. Produtos, pedidos e configurações de aba/filtros são carregados na abertura e salvos após cada alteração.

`lib/report-export.ts` gera um CSV com BOM, separador compatível com planilhas brasileiras e colunas de pedido, data, status, itens e total. No Web também gera um relatório HTML formatado em nova janela e dispara a impressão do navegador, permitindo salvar como PDF sem dependência pesada.

## Reformulação profissional do painel

A área administrativa passa a abrir em uma Visão geral operacional, em vez de iniciar diretamente no catálogo. O topo comunica contexto e estado da loja; o bloco escuro editorial funciona como assinatura da Eliane Fashion; os KPIs usam uma grade curta; a seção “Precisa de atenção” prioriza pedidos pendentes; e os atalhos levam a Pedidos, Produtos e Relatórios. A navegação mantém quatro áreas claras e preserva as funções existentes.

A referência de mercado foi traduzida, não copiada: cards e drill-down de Shopify, foco em etapas e alertas de pedidos da Nuvemshop e decisões rápidas em tempo real do Square. A chave de configurações foi versionada para que a nova Visão geral seja a entrada padrão da reformulação, sem apagar produtos e pedidos persistidos.
