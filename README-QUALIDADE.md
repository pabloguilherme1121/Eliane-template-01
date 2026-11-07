# Eliane Fashion · Revisão de qualidade V3

**Data:** 07/11/2026  
**Origem:** continuação da V2, baseada no `elianefashion(1).zip` fornecido anteriormente.  
**Escopo:** correções no projeto Expo/React Native existente. Não houve publicação nem alteração de repositórios ou dados de uma loja real.

## O que mudou na V3

### Confiabilidade do painel demonstrativo

- Gráficos antigos com crescimento fixo de `+18%`, vendas fictícias por dia e participação de categorias sem fonte foram substituídos por distribuições **calculadas a partir dos pedidos de teste e dos produtos ativos no dispositivo**.
- A tela inicial do painel não afirma mais haver vendas reais, crescimento semanal ou operação em tempo real. Os valores continuam demonstrativos e a interface informa isso.
- Restauração da memória local agora normaliza campos do painel. Apenas produtos cadastrados no catálogo inicial são aceitos; nome, tamanhos e descrição não podem ser trocados por conteúdo arbitrário da memória local. Preços e flags de ativação são validados.
- Pedidos restaurados: limite de entradas, IDs sem duplicação, status conhecidos, valores finitos e textos com limites de tamanho. Configurações de filtros e seção são limitadas às opções suportadas.
- Novos IDs demonstrativos levam em conta os pedidos persistidos, impedindo colisões após fechar e reabrir o painel. A data dos novos pedidos de teste é registrada em formato local em vez de “Agora”.
- Abas do painel passam a rolar horizontalmente em telas estreitas. Blocos de estatísticas, KPIs e atalhos passam a quebrar linha. Os controles de edição e ações de produto têm alvos maiores para toque.

### Vitrine e interação

- Busca do catálogo passou a ignorar acentos, caixa e excesso de espaços e também consulta a descrição. Há um controle para limpar a busca, sem perder o foco do campo.
- Filtros avançados comunicam corretamente estado expandido/recolhido; a contagem de resultados usa anúncio de acessibilidade quando aplicável.
- Se a navegação reutilizar a tela de um produto para outra peça, a imagem e o tamanho selecionados são reiniciados. A seleção de miniaturas informa o estado selecionado.
- O botão do detalhe agora diz “Consultar pelo WhatsApp”, em vez de dar a entender que um pagamento acontece imediatamente. O texto da consulta pede confirmação da disponibilidade e do valor final.
- Controles de remoção da sacola, botões de estado vazio e outras ações tiveram áreas de toque ampliadas.
- O selo decorativo da home foi ajustado para manter contraste mesmo sem a fotografia original e não afirmar que a loja é um ateliê.

### Imagens e desempenho

- Os caminhos `/manus-storage/...` das fotografias ausentes no ZIP deixaram de ser solicitados automaticamente. Isso elimina requisições sabidamente indisponíveis e reduz mensagens de erro e trabalho de rede.
- Um cartão de reserva mais consistente identifica claramente a foto não disponível, com marca e categoria da peça. Itens compactos usam reserva visual menor.
- Novas imagens HTTPS ou imagens locais válidas podem ser informadas no catálogo. Não foram inventadas fotografias reais nem atribuída disponibilidade comercial a peças fictícias.

## Verificações realizadas

| Verificação | Resultado | Escopo |
|---|---|---|
| Testes de lógica (`npm run test:logic`) | **19 aprovados** | Sacola, armazenamento, moeda, exportação, painel, busca e política de imagem |
| Parser TypeScript | **87 arquivos sem erros de sintaxe** | Todos os `.ts` e `.tsx` no projeto, inclusive servidor |
| TypeScript com `--strict` | **Aprovado** | 7 módulos puros, sem dependências Expo |
| Arquivos/ZIP | Integridade verificada no empacotamento | Fonte e documentação |
| Build Expo, verificação completa de tipos e testes de UI | **Não executados** | Dependências externas não estão instaladas; acesso ao registro npm indisponível (`EAI_AGAIN`) |
| Navegador, Android físico e publicação | **Não executados** | Exigem instalação e ambiente de execução |

As verificações não equivalem a uma aprovação de produção. Os testes de layout em React Native e o comportamento real do WhatsApp continuam pendentes.

## Como executar no ambiente de desenvolvimento

```bash
corepack pnpm install --frozen-lockfile
npm run test:logic
corepack pnpm check
corepack pnpm lint
corepack pnpm test
npm run dev
```

Se `pnpm` não estiver habilitado, execute `corepack enable` antes.

## Pendências antes de usar comercialmente

1. **Fotografias e conteúdo:** incluir fotos próprias/autorizadas e confirmar a disponibilidade e os preços de cada peça. Os placeholders não são imagens para venda.
2. **Administração:** o painel é uma **demonstração local sem autenticação**, banco de pedidos ou sincronização. As mudanças na tela administrativa não publicam preços nem alterações no catálogo real para outros usuários.
3. **Pedidos:** a sacola apenas prepara uma consulta por WhatsApp, sem finalizar pagamento, reservar estoque ou confirmar entrega.
4. **Dados e políticas:** confirmar o número de atendimento, condições de troca, frete e privacidade com a empresa.
5. **QA do app:** executar build Expo, `tsc`, lint, Vitest, validações Web/Android e fluxos ponta a ponta no ambiente com dependências disponíveis.
6. **Segurança:** remover ou restringir adequadamente a rota de painel demonstrativo antes de uma futura conexão a dados reais de clientes.

**Aviso:** Os dados de teste ficam somente no dispositivo. O código nesta entrega não foi publicado em produção.

## Atualização V4 (07/11/2026)

- Sacola restaura no máximo 100 linhas distintas, agrega quantidades repetidas em tempo linear e rejeita estado local superior a 200 mil caracteres.
- O canal de preview passa a aceitar `setSafeAreaInsets` somente da janela pai e do tipo de mensagem esperado.
- Servidor reduz o limite geral do corpo JSON/URL-encoded de 50 MB para 1 MB.
- Workflow GitHub Actions acrescentado para testes de lógica, TypeScript, lint e testes da aplicação.
- Documentação de publicação segura e `.env.example` sem credenciais.
- Resultado local de `npm run test:logic`: 21 testes aprovados. Instalação/build Expo ainda não executados neste ambiente.

## Atualização V5 (07/11/2026)

Esta rodada melhora a usabilidade sem mudar preços, pedidos demonstrativos ou integrações comerciais.

- **Grades responsivas:** catálogo e favoritos usam duas colunas em celulares, três em tablets e quatro em telas maiores, respeitando a largura máxima do conteúdo; a função pura é testada em 280, 320, 390, 640, 768, 960 e 1440 px.
- **Detalhes:** a altura da imagem principal agora varia com a largura do dispositivo e tem limite de 520 px no desktop; a fotografia de cada peça continua pendente, sinalizada por placeholder.
- **Sacola:** a interface não afirma mais ter adicionado um produto se a seleção é inválida ou se o limite técnico foi atingido. Atualizações rápidas usam uma referência sincronizada para evitar perda de quantidades entre toques.
- **Inicialização:** ações de favoritos e sacola são protegidas até a recuperação do armazenamento local terminar, evitando que uma seleção seja sobrescrita.
- **Testes de regressão:** 3 cenários novos verificam grade, imagem responsiva e mensagens ligadas aos limites de itens.

**Validação:** GitHub Actions executa os testes de lógica e a suíte com TypeScript, lint e Vitest. Na primeira execução de V5, os 24 testes de lógica e as etapas TypeScript/lint passaram; verificar o status do mesmo commit no GitHub antes de integrar.

**Pendente:** testes visuais reais no navegador e Android físico, fotografias autorizadas, dados comerciais verificados e autenticação de qualquer painel destinado à operação real. Publicar o código no GitHub não constitui publicação da loja.

## Atualização V6 (07/11/2026)

- **Sacola, favoritos e perfil:** telas não apresentam estado vazio definitivo nem métricas zeradas enquanto a seleção local ainda está sendo recuperada.
- **Clareza dos valores:** linhas da sacola com mais de uma unidade exibem o preço unitário e o total daquela linha. O cálculo valida tamanho, preço e quantidade e arredonda em centavos.
- **Responsividade:** controles de quantidade e remoção podem quebrar linha em telas estreitas; revisão do pedido pode ser expandida ou recolhida, com estado acessível.
- **Testes de regressão:** novo caso para total por linha, incluindo valores inválidos e limite técnico de quantidade.

**Limite da validação:** os checks automáticos verificam regras, tipos, lint, Vitest e exportação web, mas não substituem a inspeção visual em 320/390 px ou os testes em Android físico. A sacola apenas prepara consultas pelo WhatsApp e não reserva estoque.

## Atualização V7 (07/11/2026)

### Persistência local
- Uma fila sequencial evita gravações concorrentes do mesmo registro de favoritos/sacola. Enquanto uma gravação está em andamento, a fila mantém somente o estado mais recente em espera.
- Se a leitura inicial falhar, nenhuma seleção vazia será gravada por engano sobre dados existentes. O aplicativo continua em modo de sessão, mas não persiste novas mudanças até conseguir ler o armazenamento em uma sessão posterior.
- O aviso de falha de leitura é exibido até ser dispensado, sem fingir que o armazenamento foi recuperado. Leituras canceladas após desmontagem do componente não atualizam a interface.
- A chave local `eliane-fashion-store-v1` e o formato de dados permanecem compatíveis com a V6.

### Atendimento
- Link de consulta do WhatsApp separado em função pura com validação do número e codificação de caracteres reservados.
- Falhas ao abrir o aplicativo ou navegador são capturadas e comunicadas ao usuário, sem tratar a consulta como pedido confirmado.

### Verificação
- Testes de regressão simulam gravação concorrente, seleção mais recente, erro de escrita, falha de leitura, restauração válida e URL de WhatsApp.
- Gate GitHub Actions: `npm run test:logic`, `pnpm check`, `pnpm lint`, `pnpm test`, exportação estática e verificação das rotas.
- **Não substitui** inspeção visual de 320/390 px, Android físico, validação de fotografias e homologação comercial.

## Atualização V8 (07/11/2026)

### Proteção contra dados locais corrompidos

- A recuperação distingue **ausência de dados** (primeiro uso) de **JSON salvo corrompido** ou estrutura incompatível.
- Somente seleção com arrays `favorites` e `cart` é restaurada; itens individuais inválidos continuam sendo descartados com segurança pelas regras da sacola.
- Se o conteúdo local não puder ser interpretado, a leitura é tratada como falha e a sessão não regrava a chave original. Assim, um estado vazio não substitui automaticamente os dados anteriores.
- Novos testes de regressão cobrem JSON quebrado, estrutura incompatível, limite de caracteres, primeiro acesso e saneamento de itens válidos.

### Mobile

- O banner de aviso considera a `safe area` superior, respeitando o recorte do aparelho sem ficar acima da margem mínima existente.

### Limites

- A mensagem de erro não é recuperação automática do conteúdo original: se os dados já estiverem inválidos, será necessário lidar com eles numa etapa apropriada.
- O CI verifica TypeScript, lint, testes, exportação web e rotas; **não substitui** a inspeção visual em 320/390 px, o teste em Android físico ou fotografias reais.

## Atualização V9 (07/11/2026)

- **Favoritos com toques rápidos:** o estado é atualizado a partir de uma referência sincronizada, evitando que dois toques consecutivos anunciem a mesma operação. A função pura de alternância é coberta por testes de repetição e imutabilidade.
- **Falha de gravação:** erro ao salvar a seleção agora gera aviso persistente. A mensagem só é retirada automaticamente após uma gravação posterior bem-sucedida; a fila de gravação continua sequencial.
- **Comunicação:** o perfil não afirma que todos os dados foram guardados quando o armazenamento local pode estar indisponível.
- **Compatibilidade:** formato `eliane-fashion-store-v1` preservado. Sem mudanças em catálogo, estoque, preços, autenticação ou checkout.

A validação automática abrange testes de lógica, TypeScript, lint, Vitest, exportação Expo Web e rotas estáticas. Não substitui inspeção visual em 320/390 px nem homologação em Android físico. As fotografias comerciais continuam pendentes.
