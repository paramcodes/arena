'use client';

import { CONCEPTS, CONCEPT_BY_ID } from '@/knowledge/content/concepts';
import { buildEdges, layout, readyToLearn, reviewDue } from '@/knowledge/graph';
import { dayNumber, useLearningStore } from '@/game/store/learningStore';

const COL = 110;
const ROW = 26;
const PAD = 14;
const COLOR = { unseen: '#64748b', seen: '#f59e0b', learned: '#22c55e' } as const;

export function LearningMapControls() {
  const records = useLearningStore((s) => s.records);
  const markReviewed = useLearningStore((s) => s.markReviewed);
  const positions = layout(CONCEPTS);
  const status = (id: string) => records[id]?.status ?? 'unseen';
  const learned = new Set(CONCEPTS.map((c) => c.id).filter((id) => status(id) === 'learned'));
  const ready = readyToLearn(CONCEPTS, learned).map((id) => CONCEPT_BY_ID.get(id)!.name);
  const today = dayNumber();
  const due = CONCEPTS.filter((c) => {
    const r = records[c.id];
    return r?.status === 'learned' && reviewDue(r.lastDay, r.reviews, today);
  });

  const maxX = Math.max(...[...positions.values()].map((p) => p.x));
  const maxY = Math.max(...[...positions.values()].map((p) => p.y));
  const width = PAD * 2 + (maxX + 1) * COL;
  const height = PAD * 2 + (maxY + 1) * ROW;
  const at = (id: string) => {
    const p = positions.get(id)!;
    return { x: PAD + p.x * COL + 8, y: PAD + p.y * ROW + 8 };
  };

  return (
    <>
      <p>
        Learned {learned.size} of {CONCEPTS.length}. Columns are districts. Lines show how concepts depend on each other.
      </p>
      <svg role="img" aria-label={`Concept map: ${learned.size} of ${CONCEPTS.length} learned`} viewBox={`0 0 ${width} ${height}`} width="100%" style={{ background: '#020617', borderRadius: 8 }}>
        {buildEdges(CONCEPTS).map((e, i) => {
          const a = at(e.from);
          const b = at(e.to);
          return <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#334155" strokeWidth={1} />;
        })}
        {CONCEPTS.map((c) => {
          const p = at(c.id);
          return (
            <g key={c.id}>
              <circle cx={p.x} cy={p.y} r={6} fill={COLOR[status(c.id)]} />
              <text x={p.x + 10} y={p.y + 4} fontSize={10} fill="#e2e8f0">{c.name}</text>
            </g>
          );
        })}
      </svg>
      <p>Grey: not seen. Amber: read. Green: learned.</p>

      <p><strong>Ready to learn next:</strong> {ready.length ? ready.slice(0, 6).join(', ') : 'finish a mission to unlock more'}</p>

      <p><strong>Due for review:</strong></p>
      {due.length === 0 ? <p>Nothing due today.</p> : null}
      <div className="row">
        {due.map((c) => (
          <button key={c.id} type="button" onClick={() => markReviewed(c.id)}>Review {c.name}</button>
        ))}
      </div>
    </>
  );
}
