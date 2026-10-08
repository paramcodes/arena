# Domain: Concepts and Relations

Concepts are the canonical vocabulary. Each has: id, name, plain-language explanation, technical name, district, prerequisites, and related concepts.

Relation types: prerequisite, causes, mitigates, alternative, depends_on, observed_by.

## Vocabulary by district

**Core loop:** game loop, frame, FPS, frame time, delta time, tick, simulation tick, render loop, fixed timestep, variable timestep, determinism, replay.

**3D foundations:** scene, scene graph, Object3D, transform, local space, world space, screen space, vector, matrix, quaternion, Euler angles, parent, child, hierarchy, mesh, geometry, material, texture, UV, normal, tangent.

**Rendering:** PBR, albedo/base color, roughness, metalness, specular, ambient occlusion, emissive, environment map, HDRI, shadow map, lighting.

**GPU:** vertex shader, fragment shader, uniform, attribute, varying, shader, TSL, WebGL, WebGPU, render target, post-processing, bloom, depth of field, color grading.

**Cameras:** perspective, orthographic, third-person, first-person, orbit, follow, spring arm, look-at, camera lag, damping, FOV, camera collision, camera shake.

**Physics:** rigid body, collider, static/dynamic/kinematic body, mass, gravity, velocity, angular velocity, force, impulse, torque, friction, restitution, joint, raycast, shape cast, continuous collision detection.

**Collision:** broad phase, narrow phase, AABB, bounding sphere, BVH, spatial partition, sweep and prune.

**Animation:** clip, keyframe, skeleton, rig, bone, skinning, morph target, blend, crossfade, animation state machine, locomotion.

**Character movement:** character controller, grounded, slope limit, step height, acceleration, deceleration, air control, jump impulse, ground snapping.

**AI:** FSM, state, transition, behavior tree, selector, sequence, decorator, blackboard, utility AI, NavMesh, pathfinding, A*, steering, obstacle avoidance.

**VFX:** particle system, emitter, spawn rate, lifetime, velocity, sprite sheet, billboard, GPU particles, trail, beam, burst.

**Performance:** draw call, GPU bound, CPU bound, fill rate, overdraw, frustum culling, occlusion culling, distance culling, LOD, HLOD, instancing, batching, texture atlas, asset streaming, world streaming, memory budget.

**Architecture:** ECS, entity, component, system, object pool, event bus, message bus, command, subsystem, data-driven design, resource manager, asset manager.

**Multiplayer:** authoritative server, client prediction, server reconciliation, interpolation, extrapolation, snapshot, tick rate, lag compensation, rollback, input history, interest management, entity replication, latency, jitter, packet loss.

**Web platform:** WebAssembly, Emscripten, Web Worker, OffscreenCanvas, SharedArrayBuffer, Atomics, Pointer Lock, Gamepad API, Web Audio, WebXR.

**World building:** POI, landmark, encounter, traversal space, combat space, hub world, set piece, checkpoint, trigger volume, spawn point, procedural generation, seed, noise, heightmap, biome, world partition, cell, chunk, floating origin.

**Game feel:** game feel, juice, hit stop, hit pause, screen shake, recoil, squash and stretch, anticipation, follow-through, secondary motion, impact feedback, time dilation, slow motion.

**UI/HUD:** HUD, crosshair, reticle, minimap, quest marker, damage indicator, world-space UI, screen-space UI, diegetic UI, non-diegetic UI, radial menu, inventory, dialogue.
