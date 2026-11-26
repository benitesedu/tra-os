# Deploy na Vercel

O projeto principal da aplicação é `apps/play`. A configuração de Vercel fica
em `apps/play/vercel.json`, para que o Next gere `.next` dentro do diretório
correto do app.

## Configuração recomendada

1. Importe `benitesedu/tra-os` na Vercel.
2. Configure **Root Directory** como `apps/play`.
3. Use o framework `Next.js`.
4. Não configure `outputDirectory`; o runtime Next.js da Vercel deve gerenciar
   as rotas server-rendered e a API.
5. O install será executado por `npm install --workspace=@tracos/play`.
6. O build será executado por `npm run build` dentro de `apps/play`.

O Studio não é publicado junto com o Play. Se for necessário publicá-lo,
crie um segundo projeto Vercel apontando para o mesmo repositório, configure o
Root Directory como `apps/studio` e use `npm run build` como build.

## Variáveis de ambiente

Não há variáveis obrigatórias no protótipo atual. Não publique chaves
privilegiadas do Supabase; a integração Supabase ainda não está ativa.
