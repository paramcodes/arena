import { z } from 'zod';
import { MissionSchema, type Mission } from '../schemas';

export const WALL_MISSION_ID = 'wall-that-isnt-a-wall';

const RAW: z.input<typeof MissionSchema>[] = [
  {
    id: WALL_MISSION_ID,
    title: "The Wall That Isn't a Wall",
    district: 'physics',
    intro: 'Walk toward the pale wall in the Physics Lab. Something about it is wrong.',
    concepts: ['collider', 'rigid-body', 'collision', 'broad-phase', 'narrow-phase'],
    objectives: [
      {
        id: 'see-the-problem',
        text: 'Find out why you can pass through the wall',
        steps: [
          {
            id: 'walk-through',
            text: 'Walk into the wall',
            hints: [
              { level: 1, text: 'Walk straight toward the pale wall.' },
              { level: 2, text: 'Keep walking. Does anything stop you?' },
              { level: 3, text: 'The wall has no collider yet. The terminal explains why.' },
            ],
          },
        ],
      },
      {
        id: 'fix-the-wall',
        text: 'Make the wall solid',
        steps: [
          {
            id: 'read-terminal',
            text: 'Read the terminal in the lab',
            hints: [
              { level: 1, text: 'The terminal is on the left side of the lab.' },
              { level: 2, text: 'Walk up to the dark box and press E.' },
            ],
          },
          {
            id: 'enable-collider',
            text: 'Turn the collider on',
            hints: [
              { level: 1, text: 'Open the terminal and look for the option that turns the collider on.' },
              { level: 2, text: 'Choose "Turn collider on". A cyan outline shows the invisible shape.' },
            ],
          },
        ],
      },
      {
        id: 'prove-it',
        text: 'Prove the wall stops you',
        steps: [
          {
            id: 'bump-wall',
            text: 'Walk back into the wall',
            hints: [
              { level: 1, text: 'Turn around and walk back to the wall.' },
              { level: 2, text: 'Keep pressing forward. Notice where you stop.' },
            ],
          },
        ],
      },
    ],
    reward: {
      label: 'Collider Badge',
      description: 'You now know why a wall needs an invisible shape.',
    },
    unlocks: ['physics-lab-raycast'],
  },
];

export const MISSIONS: Mission[] = RAW.map((m) => MissionSchema.parse(m));
export const MISSION_BY_ID = new Map<string, Mission>(MISSIONS.map((m) => [m.id, m]));

const wall = MISSION_BY_ID.get(WALL_MISSION_ID);
if (!wall) throw new Error(`Missing mission ${WALL_MISSION_ID}`);
export const WALL_MISSION: Mission = wall;
