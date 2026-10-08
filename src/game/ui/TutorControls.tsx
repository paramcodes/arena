'use client';

import { useState } from 'react';
import { CONCEPTS, CONCEPT_BY_ID } from '@/knowledge/content/concepts';
import { buildEdges } from '@/knowledge/graph';
import { tutorReply, type TutorRequest } from '@/tutor/tutor';

const REQUESTS: Array<[TutorRequest, string]> = [
  ['hint', 'Hint'],
  ['explain-simply', 'Explain simply'],
  ['explain-technically', 'Explain technically'],
  ['compare', 'Compare'],
  ['quiz', 'Quiz me'],
  ['diagnose', 'Check my answer'],
];

export function TutorControls() {
  const [conceptId, setConceptId] = useState(CONCEPTS[0].id);
  const [hints, setHints] = useState<Record<string, number>>({});
  const [answer, setAnswer] = useState('');
  const [reply, setReply] = useState<string>('Pick a concept and a kind of help.');

  const concept = CONCEPT_BY_ID.get(conceptId)!;
  const neighbourId = buildEdges(CONCEPTS).find((e) => e.from === conceptId)?.to;
  const neighbour = neighbourId ? CONCEPT_BY_ID.get(neighbourId) : undefined;

  const ask = (kind: TutorRequest) => {
    const given = hints[conceptId] ?? 0;
    const r = tutorReply(kind, concept, { hintsGiven: given, neighbour, answer });
    setHints({ ...hints, [conceptId]: r.nextHintLevel });
    setReply(r.text);
  };

  return (
    <>
      <p>
        This tutor is rule-based. Every reply comes from the concept cards in the game. It gives hints in order and does not give the answer straight away.
      </p>
      <label>
        Concept{' '}
        <select value={conceptId} onChange={(e) => { setConceptId(e.target.value); setReply('Pick a kind of help.'); }}>
          {CONCEPTS.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </label>
      <div className="row">
        {REQUESTS.map(([kind, label]) => (
          <button key={kind} type="button" onClick={() => ask(kind)}>{label}</button>
        ))}
      </div>
      <label>
        Your answer (for Check my answer){' '}
        <input type="text" value={answer} onChange={(e) => setAnswer(e.target.value)} style={{ width: '100%' }} />
      </label>
      <p role="status">{reply}</p>
      <p>Hints given for this concept: {hints[conceptId] ?? 0} of 3.</p>
    </>
  );
}
