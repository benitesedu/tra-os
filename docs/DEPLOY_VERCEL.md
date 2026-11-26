# Deploy na Vercel

O projeto principal da aplicação é `apps/play`. A configuração de raiz em
`vercel.json` mantém o monorepo disponível durante o build e instrui a Vercel
a compilar somente o Play.

## Configuração recomendada

1. Importe `benitesedu/tra-os` na Vercel.
2. Mantenha o **Root Directory** como `.`.
3. Use o framework `Next.js`.
4. Não configure `outputDirectory`; o runtime Next.js da Vercel deve gerenciar
   as rotas server-rendered e a API.
5. O build será executado por `npm run build -w @tracos/play`.

O Studio não é publicado junto com o Play. Se for necessário publicá-lo,
crie um segundo projeto Vercel apontando para o mesmo repositório e altere o
build para `npm run build -w @tracos/studio`.

## Variáveis de ambiente

Não há variáveis obrigatórias no protótipo atual. Não publique chaves
privilegiadas do Supabase; a integração Supabase ainda não está ativa.
