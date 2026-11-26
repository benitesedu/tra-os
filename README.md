# TRAÇOS 0.1.0
Nem tudo precisa estar desenhado.

## Executar no Windows / VS Code
Requer Node.js 22+. Abra a pasta tracos e execute `npm install`, depois `npm run dev`. Acesse http://localhost:3000. Em outro terminal `npm run studio` abre http://localhost:3001. `npm test` executa testes do motor. `npm run build` compila os dois apps.

## Estado real
Protótipo local jogável, sem credenciais. Vinte conceitos, três idiomas, tutorial, dicas, tentativas, histórico local, compartilhamento de texto e Studio somente leitura. A API usa conteúdo JSON no servidor. O cliente controla contadores na demonstração: NÃO é seguro para ranking competitivo. Não publicar Studio nem usar ranking real antes de implementar autenticação e sessões autoritativas. Não há integração Supabase ativa. Migration e seed SQL são ponto de partida; aplicar em projeto de desenvolvimento e revisar antes de produção. O calendário usa UTC e rotação de vinte conceitos; repetição é esperada. Não há anúncios.

## Supabase
Execute `npm run seed` para regenerar supabase/seed.sql. Aplique a migration e depois seed no SQL Editor de um projeto de teste. Os desenhos ficam em JSONB privado, inicialmente draft. Próxima etapa: API server-only com conexão PostgreSQL ou RPC restrita, autenticação, transações de sessão, aprovação e calendário. Não exponha schema private nem chaves privilegiadas.

## Arquitetura
apps/play e apps/studio; packages/drawing-engine, drawing-schema, game-engine, database, i18n; content/concepts e drawings; scripts; supabase; tests; docs.
