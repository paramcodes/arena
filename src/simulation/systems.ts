import type { SimulationEntity, SimulationSystem } from './engine';

// Gravity: velocity grows downward, then position moves by the new velocity (semi-implicit Euler).
export function gravitySystem(g = 9.81): SimulationSystem {
  return {
    name: 'gravity',
    update(entities, dt) {
      const out: Record<string, SimulationEntity> = {};
      for (const [id, e] of Object.entries(entities)) {
        if (e.grounded && e.velocity.y === 0) {
          out[id] = e;
          continue;
        }
        const vy = e.velocity.y - g * dt;
        out[id] = {
          ...e,
          grounded: false,
          velocity: { ...e.velocity, y: vy },
          position: { ...e.position, y: e.position.y + vy * dt },
        };
      }
      return out;
    },
  };
}

// Ground: the floor sits at floorY. Falling bodies bounce with restitution, then settle.
export function groundSystem(restitution = 0.6, floorY = 0): SimulationSystem {
  return {
    name: 'ground',
    update(entities, _dt, emit) {
      const out: Record<string, SimulationEntity> = {};
      for (const [id, e] of Object.entries(entities)) {
        if (e.position.y > floorY) {
          out[id] = e;
          continue;
        }
        let vy = e.velocity.y;
        let grounded = e.grounded;
        if (vy < 0) {
          const bounced = -vy * restitution;
          if (bounced < 0.05) {
            vy = 0;
            grounded = true;
            emit('settled', id);
          } else {
            vy = bounced;
            emit('bounce', id);
          }
        }
        out[id] = {
          ...e,
          grounded,
          position: { ...e.position, y: floorY },
          velocity: { ...e.velocity, y: vy },
        };
      }
      return out;
    },
  };
}

export function createBall(height = 5, id = 'ball'): SimulationEntity {
  return {
    id,
    position: { x: 0, y: height, z: 0 },
    velocity: { x: 0, y: 0, z: 0 },
    grounded: false,
    health: 100,
  };
}
