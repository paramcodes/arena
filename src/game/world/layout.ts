// Fixed world data: where things are and what they do. Positions are in meters.
// Y is up. The player walks on the XZ plane.

export const SPAWN: [number, number, number] = [-18, 2, 4];

export const PLAYER = { radius: 0.4, halfHeight: 0.5, moveSpeed: 6, jumpSpeed: 6.5 } as const;
export const CAMERA = { distance: 7, height: 2.5 } as const;
export const GROUND_HALF = 60;

// The wall in the Physics Lab. Its visible mesh is always drawn.
export const WALL = { cx: -18, cy: 1.5, cz: -12, hx: 3, hy: 1.5, hz: 0.3 } as const;
export const LAB = { cx: -18, cz: -14, hx: 9, hz: 9 } as const;

export interface Building {
  id: string;
  position: [number, number, number];
  half: [number, number, number];
  color: string;
}

export const BUILDINGS: Building[] = [
  { id: 'house-a', position: [6, 1.5, 6], half: [1.5, 1.5, 1.5], color: '#e2b07a' },
  { id: 'house-b', position: [-8, 1, 8], half: [1, 1, 1], color: '#f4d19b' },
  { id: 'tower', position: [12, 2, -6], half: [2, 2, 2], color: '#94a3b8' },
  { id: 'shed', position: [-6, 1.5, -6], half: [1.5, 1.5, 1.5], color: '#b45309' },
];

export type ZoneStatus = 'open' | 'coming';

export interface Zone {
  id: string;
  name: string;
  position: [number, number, number];
  status: ZoneStatus;
}

export const ZONES: Zone[] = [
  { id: 'physics-lab', name: 'Physics Lab', position: [-22, 0, -18], status: 'open' },
  { id: 'graphics-forest', name: 'Graphics Forest', position: [22, 0, -24], status: 'open' },
  { id: 'animation-studio', name: 'Animation Studio', position: [36, 0, 0], status: 'coming' },
  { id: 'ai-village', name: 'AI Village', position: [24, 0, 22], status: 'coming' },
  { id: 'performance-mine', name: 'Performance Mine', position: [-6, 0, 36], status: 'open' },
  { id: 'multiplayer-arena', name: 'Multiplayer Arena', position: [-30, 0, 12], status: 'coming' },
  { id: 'audio-cave', name: 'Audio Cave', position: [-36, 0, -2], status: 'coming' },
  { id: 'world-builder', name: 'World Builder', position: [14, 0, 36], status: 'coming' },
  { id: 'web-observatory', name: 'Web Observatory', position: [0, 0, -40], status: 'coming' },
];

export type InteractableKind = 'sign' | 'terminal' | 'material' | 'performance';

export interface Interactable {
  id: string;
  kind: InteractableKind;
  label: string;
  title: string;
  body: string[];
  position: [number, number, number];
  radius: number;
  mission?: { missionId: string; stepId: string };
}

export const INTERACTABLES: Interactable[] = [
  {
    id: 'welcome-sign',
    kind: 'sign',
    label: 'Read sign',
    title: 'Welcome sign',
    body: [
      'Welcome to the hub.',
      'Walk around, jump, and look at things. The Physics Lab is ahead and to the left.',
    ],
    position: [-15, 0, 2],
    radius: 2.2,
  },
  {
    id: 'collider-terminal',
    kind: 'terminal',
    label: 'Use terminal',
    title: 'Physics Lab terminal',
    body: [
      'SYSTEM LOG',
      'Wall-01 has a visible mesh. Its collider status is shown below.',
    ],
    position: [-23, 0, -14],
    radius: 2.2,
    mission: { missionId: 'wall-that-isnt-a-wall', stepId: 'read-terminal' },
  },
  {
    id: 'material-panel',
    kind: 'material',
    label: 'Use material panel',
    title: 'Material panel',
    body: [
      'Two sliders change how light bounces off the orange sphere.',
      'Roughness: smooth reflects a sharp highlight, rough spreads it out. Metalness: metals reflect the room; plastics do not.',
    ],
    position: [19, 0, -20],
    radius: 2.2,
  },
  {
    id: 'perf-panel',
    kind: 'performance',
    label: 'Use performance panel',
    title: 'Performance panel',
    body: [
      'Every tree costs the GPU work. Choose a number of trees, then toggle instancing to see what it changes.',
      'The numbers in the panel are measured in your browser.',
    ],
    position: [-3, 0, 34],
    radius: 2.2,
  },
];

export function nearestInteractable(x: number, z: number): Interactable | null {
  let best: Interactable | null = null;
  let bestDist = Infinity;
  for (const it of INTERACTABLES) {
    const d = Math.hypot(it.position[0] - x, it.position[2] - z);
    if (d <= it.radius && d < bestDist) {
      best = it;
      bestDist = d;
    }
  }
  return best;
}
