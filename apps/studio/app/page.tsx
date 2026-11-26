 'use client';

import { useState } from 'react';
import { library } from '../../../packages/database/content';
import { DrawingView } from '../../../packages/drawing-engine';

const levels = [1, 2, 3, 4, 5];

export default function Studio() {
  const [idx, setIdx] = useState(0);
  const [level, setLevel] = useState(5);
  const concept = library[idx];

  return (
    <main>
      <header><img src="/logo.svg" alt="Traços" /><strong>TRAÇOS STUDIO</strong></header>
      <section>
        <h1>Biblioteca · {library.length} conceitos</h1>
        <p className="muted">Prévia local somente leitura. Não publicar este ambiente.</p>
        <select value={idx} onChange={(event) => setIdx(Number(event.target.value))}>
          {library.map((item, index) => <option key={item.id} value={index}>{item.translations.pt}</option>)}
        </select>

        <h2>Visualização selecionada</h2>
        <DrawingView drawing={concept.drawing} level={level} />
        <input type="range" min={1} max={5} value={level} onChange={(event) => setLevel(Number(event.target.value))} />
        <p>Camada {level}/5</p>

        <h2>Comparação das camadas</h2>
        <div className="comparison-grid">
          {levels.map((itemLevel) => (
            <article className="comparison-item" key={itemLevel}>
              <h3>Camada {itemLevel}/5</h3>
              <DrawingView drawing={concept.drawing} level={itemLevel} />
            </article>
          ))}
        </div>

        {Object.entries(concept.translations).map(([language, answer]) => <p key={language}>{language}: {answer}</p>)}
        <button onClick={() => navigator.clipboard.writeText(JSON.stringify(concept.drawing, null, 2))}>Copiar JSON</button>
        <pre style={{ overflow: 'auto', fontSize: 12 }}>{JSON.stringify(concept.drawing, null, 2)}</pre>
      </section>
    </main>
  );
}
