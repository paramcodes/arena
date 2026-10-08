'use client';

import { useFeelStore } from '@/game/store/feelStore';
import { performAttack, NO_FEEL, type FeelFlags } from '@/feel/state';
import { ConceptCard } from './ConceptCard';

const LABELS: Array<[keyof FeelFlags, string]> = [
  ['shake', 'Camera shake'],
  ['hitStop', 'Hit stop'],
  ['recoil', 'Recoil'],
  ['particles', 'Particles'],
];

export function FeelControls() {
  const flags = useFeelStore((s) => ({ shake: s.shake, hitStop: s.hitStop, recoil: s.recoil, particles: s.particles }));
  const attacks = useFeelStore((s) => s.attacks);
  const toggle = useFeelStore((s) => s.toggle);
  const countAttack = useFeelStore((s) => s.countAttack);

  const attack = (juiced: boolean) => {
    performAttack(juiced ? flags : NO_FEEL);
    countAttack();
  };

  return (
    <>
      <p>
        Hit the cube two ways and compare. A plain attack does only the damage. A juiced attack adds the feedback you have switched on.
      </p>
      <div className="row">
        <button type="button" onClick={() => attack(false)}>Plain attack</button>
        <button type="button" onClick={() => attack(true)}>Juiced attack</button>
      </div>
      <div className="row">
        {LABELS.map(([key, label]) => (
          <button key={key} type="button" aria-pressed={flags[key]} onClick={() => toggle(key)}>
            {label}: {flags[key] ? 'on' : 'off'}
          </button>
        ))}
      </div>
      <p>Attacks so far: {attacks}</p>
      <ConceptCard id="game-feel" />
      <ConceptCard id="hit-stop" />
      <ConceptCard id="screen-shake" />
      <ConceptCard id="recoil" />
    </>
  );
}
