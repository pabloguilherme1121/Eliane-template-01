# Publicação segura · Eliane Fashion Expo

## Estado da entrega

Este é um protótipo com dados demonstrativos. **Publicar o código no GitHub não publica a loja na internet** nem ativa pagamentos.

## Etapas para um deploy real

1. Instalar dependências a partir de `pnpm-lock.yaml`; corrigir eventuais incompatibilidades de versões.
2. Executar `pnpm test:logic`, `pnpm check`, `pnpm lint` e `pnpm test`. Gerar o pacote web com `pnpm exec expo export --platform web --output-dir dist-web-check` e conferir as rotas estáticas com `node --experimental-strip-types scripts/verify-web-export.mjs dist-web-check`. A homologação Android continua separada.
3. Validar fluxo de busca, detalhes, tamanhos, favoritos, sacola e WhatsApp em 320/390 px e Android físico.
4. Substituir placeholders por fotografias próprias/autorizadas e confirmar preços, descrições, disponibilidade e número de atendimento.
5. Revisar política de privacidade, formas de entrega, trocas e avisos comerciais.
6. Antes de conectar vendas reais, implementar autenticação, autorização por função, validação no servidor, registros de auditoria e backups.
7. Definir hospedagem, domínio, HTTPS e observar erros após implantação.

## Segurança

- Nunca versionar `.env`, tokens de OAuth, chaves de API ou dados pessoais de clientes.
- O painel administrativo é uma demonstração local e não deve ser apresentado como protegido.
- O servidor limita a 1 MB o corpo das requisições JSON e URL-encoded. Rotas que precisem de upload maior devem usar fluxos próprios e seguros.
- Mensagens de terceiros no preview iframe só são processadas quando originadas pela janela pai e pelo canal esperado.

## Rotas dos produtos no modo estático

A configuração `web.output: "static"` exige gerar antecipadamente as páginas com IDs conhecidos. A rota `app/product/[id].tsx` exporta `generateStaticParams` a partir do catálogo; o workflow falha se não encontrar `index.html` e os arquivos HTML de cada produto. Ao adicionar uma peça, verifique se o novo ID está no catálogo e se a exportação gera sua página. Isso verifica geração de arquivos, não a navegação real no navegador.
