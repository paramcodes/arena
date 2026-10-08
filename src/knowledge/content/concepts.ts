import { z } from 'zod';
import { ConceptSchema, type Concept } from '../schemas';

// Content is data. It is validated when this module loads, so bad content fails fast.
const RAW: z.input<typeof ConceptSchema>[] = [
  {
    id: 'game-loop',
    name: 'Game loop',
    plain: 'The game repeats the same steps again and again: read input, update the world, draw the picture.',
    technical: 'Game loop',
    mechanism: 'Every pass through the loop is a frame. The loop runs as fast as the screen and the machine allow.',
    district: 'systems',
  },
  {
    id: 'delta-time',
    name: 'Delta time',
    plain: 'The time since the last frame. Movement uses it so a fast computer and a slow one move the same distance per second.',
    technical: 'Delta time',
    mechanism: 'Speed times delta time gives the distance moved this frame.',
    district: 'systems',
  },
  {
    id: 'fixed-timestep',
    name: 'Fixed timestep',
    plain: 'The physics advances in equal small steps, no matter how fast the screen draws.',
    technical: 'Fixed timestep',
    mechanism: 'Time is collected in an accumulator. The simulation runs one fixed step each time a full step of time has built up, so results do not depend on frame rate.',
    district: 'systems',
    related: [{ id: 'game-loop', relation: 'depends_on' }],
  },
  {
    id: 'gravity',
    name: 'Gravity',
    plain: 'Things without support fall down, and they keep speeding up while they fall.',
    technical: 'Gravity',
    mechanism: 'Each step, the downward velocity grows by gravity times delta time. The position then moves by the new velocity.',
    district: 'physics',
    related: [{ id: 'fixed-timestep', relation: 'depends_on' }],
  },
  {
    id: 'collider',
    name: 'Collider',
    plain: 'An invisible shape that tells the game where something is solid.',
    technical: 'Collider',
    mechanism: 'A collider is a geometric shape attached to a body. The physics engine uses colliders, not the visible mesh, to decide what blocks movement.',
    district: 'physics',
    related: [{ id: 'rigid-body', relation: 'depends_on' }],
  },
  {
    id: 'rigid-body',
    name: 'Rigid body',
    plain: 'Something the physics engine moves and reacts to.',
    technical: 'Rigid body',
    mechanism: 'A rigid body has mass and velocity and keeps its shape while it moves. Colliders attach to it. A fixed body never moves.',
    district: 'physics',
  },
  {
    id: 'collision',
    name: 'Collision',
    plain: 'Two solid things touch, and the game has to decide what happens next.',
    technical: 'Collision detection',
    mechanism: 'Each step, the engine finds which shapes overlap, then pushes them apart or reports the contact.',
    district: 'physics',
    related: [{ id: 'collider', relation: 'depends_on' }],
  },
  {
    id: 'broad-phase',
    name: 'Broad phase',
    plain: 'A quick first check that throws away pairs of objects that are far apart.',
    technical: 'Broad phase',
    mechanism: 'Simple boxes around each shape are compared cheaply. Only pairs whose boxes overlap move on to the exact test.',
    district: 'physics',
    related: [{ id: 'narrow-phase', relation: 'causes' }],
  },
  {
    id: 'narrow-phase',
    name: 'Narrow phase',
    plain: 'The exact check, run only on the few pairs that might really touch.',
    technical: 'Narrow phase',
    mechanism: 'The exact shapes are tested against each other to find the real contact points and how deep they overlap.',
    district: 'physics',
  },
];

export const CONCEPTS: Concept[] = z.array(ConceptSchema).parse(RAW);
export const CONCEPT_BY_ID = new Map<string, Concept>(CONCEPTS.map((c) => [c.id, c]));
