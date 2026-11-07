# Publicação segura · Eliane Fashion Expo

## Estado da entrega

Este é um protótipo com dados demonstrativos. **Publicar o código no GitHub não publica a loja na internet** nem ativa pagamentos.

## Etapas para um deploy real

1. Instalar dependências a partir de `pnpm-lock.yaml`; corrigir eventuais incompatibilidades de versões.
2. Executar `pnpm test:logic`, `pnpm check`, `pnpm lint`, `pnpm test` e build Expo para web e Android.
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
