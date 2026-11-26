import fs from 'node:fs';
import path from 'node:path';

const q = (value) => `'${value.replaceAll("'", "''")}'`;
const root = path.resolve('.');
const source = path.join(root, 'tracos-20-desenhos', 'tracos-20.json');
const entries = JSON.parse(fs.readFileSync(source, 'utf8'));
let sql = 'begin;\n';

for (const entry of entries) {
  const concept = { id: entry.id, category: 'general', translations: entry.translations };
  fs.writeFileSync(path.join(root, 'content', 'concepts', `${entry.id}.json`), `${JSON.stringify(concept, null, 2)}\n`);
  fs.writeFileSync(path.join(root, 'content', 'drawings', `${entry.id}.json`), `${JSON.stringify(entry.drawing_data, null, 2)}\n`);
  sql += `insert into private.concepts values (${q(entry.id)},'general') on conflict do nothing;\n`;
  for (const [locale, answer] of Object.entries(entry.translations)) {
    sql += `insert into private.concept_translations(concept_id,locale,answer) values (${q(entry.id)},${q(locale)},${q(answer)}) on conflict do nothing;\n`;
  }
  sql += `insert into private.drawings(concept_id,drawing_data) values (${q(entry.id)},${q(JSON.stringify(entry.drawing_data))}::jsonb) on conflict (concept_id,version) do update set drawing_data=excluded.drawing_data;\n`;
}

fs.writeFileSync(path.join(root, 'supabase', 'seed.sql'), `${sql}commit;\n`);
