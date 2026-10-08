'use client';

import { useEffect, useState } from 'react';
import { WALL_MISSION } from '@/knowledge/content/missions';
import { useMissionStore } from '@/missions/missionStore';
import { isComplete, isStepDone, openSteps } from '@/missions/engine';
import { ConceptCard } from './ConceptCard';

export function MissionPanel() {
  const mission = WALL_MISSION;
  const progress = useMissionStore((s) => s.progress[mission.id]);
  const ensure = useMissionStore((s) => s.ensure);
  const hint = useMissionStore((s) => s.hint);
  const unlocked = useMissionStore((s) => s.unlocked);
  const [shown, setShown] = useState<{ stepId: string; text: string } | null>(null);
  const [exhaustedFor, setExhaustedFor] = useState<string | null>(null);

  useEffect(() => {
    if (!progress) ensure(mission.id);
  }, [progress, ensure, mission.id]);

  if (!progress) return null;

  const complete = isComplete(mission, progress);
  const next = openSteps(mission, progress)[0];
  const currentHint = shown && next && shown.stepId === next.id ? shown.text : null;
  const showConcepts = complete || (next !== undefined && exhaustedFor === next.id);

  const askForHint = () => {
    if (!next) return;
    const text = hint(mission.id, next.id);
    if (text === null) setExhaustedFor(next.id);
    else setShown({ stepId: next.id, text });
  };

  return (
    <aside className="panel mission" aria-labelledby="mission-title">
      <h2 id="mission-title">Mission: {mission.title}</h2>
      <p>{mission.intro}</p>
      <ol>
        {mission.objectives.map((o) => (
          <li key={o.id}>
            <strong>{o.text}</strong>
            <ul className="steps">
              {o.steps.map((s) => {
                const done = isStepDone(progress, s.id);
                return (
                  <li key={s.id}>
                    <span aria-hidden="true">{done ? '✓' : '○'}</span> {s.text}
                    {done ? <span className="sr-only"> (done)</span> : null}
                  </li>
                );
              })}
            </ul>
          </li>
        ))}
      </ol>

      {!complete && next ? (
        <div>
          <button type="button" onClick={askForHint}>Give me a hint</button>
          {currentHint ? <p role="status">Hint: {currentHint}</p> : null}
          {exhaustedFor === next.id ? <p role="status">No more hints. Read the concept cards below.</p> : null}
        </div>
      ) : null}

      {complete ? (
        <section aria-label="Mission reward">
          <h3>Done: {mission.reward.label}</h3>
          <p>{mission.reward.description}</p>
          {unlocked.length > 0 ? <p>Unlocked: {unlocked.join(', ')} (coming in a later phase)</p> : null}
        </section>
      ) : null}

      {showConcepts ? (
        <section aria-label="Concept cards">
          {mission.concepts.map((id) => (
            <ConceptCard key={id} id={id} />
          ))}
        </section>
      ) : null}
    </aside>
  );
}
