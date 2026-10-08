// Browser capability checks. The probe runs in the browser; the rules are pure and tested.

export interface PlatformEnv {
  webgl2: boolean;
  webgpu: boolean;
  wasm: boolean;
  workers: boolean;
  offscreenCanvas: boolean;
  sharedArrayBuffer: boolean;
  pointerLock: boolean;
  gamepad: boolean;
  webAudio: boolean;
  webxr: boolean;
}

export type FeatureId = keyof PlatformEnv;

export const FEATURE_INFO: Record<FeatureId, { name: string; constraint: string; explanation: string }> = {
  webgl2: {
    name: 'WebGL 2',
    constraint: 'Draw 3D on the GPU from JavaScript, in any modern browser.',
    explanation: 'The main 3D path. Every browser that can show this page can usually use it.',
  },
  webgpu: {
    name: 'WebGPU',
    constraint: 'Newer GPU API with compute shaders and less driver overhead.',
    explanation: 'Preferred when present. Not yet everywhere, so the game falls back to WebGL 2.',
  },
  wasm: {
    name: 'WebAssembly',
    constraint: 'Run compiled code (C, C++, Rust) at near-native speed in the browser.',
    explanation: 'Used for heavy code such as physics or codecs, where JavaScript is too slow.',
  },
  workers: {
    name: 'Web Workers',
    constraint: 'JavaScript runs on another thread, so the main thread keeps drawing.',
    explanation: 'Keeps long jobs such as level generation from freezing frames.',
  },
  offscreenCanvas: {
    name: 'OffscreenCanvas',
    constraint: 'Draw to a canvas from a worker.',
    explanation: 'Lets rendering move off the main thread entirely.',
  },
  sharedArrayBuffer: {
    name: 'SharedArrayBuffer',
    constraint: 'Threads share memory. Needs the page to be cross-origin isolated (special headers).',
    explanation: 'Only works when the server sends the isolation headers. Without them it is missing, even on a modern browser.',
  },
  pointerLock: {
    name: 'Pointer Lock',
    constraint: 'Capture the mouse for first-person look.',
    explanation: 'The cursor disappears and mouse movement turns the camera without limit.',
  },
  gamepad: {
    name: 'Gamepad API',
    constraint: 'Read controller sticks and buttons.',
    explanation: 'Controllers show up only after a button is pressed on them.',
  },
  webAudio: {
    name: 'Web Audio',
    constraint: 'Play and shape sound with precise timing and positions.',
    explanation: 'Browsers block audio until the player interacts with the page.',
  },
  webxr: {
    name: 'WebXR',
    constraint: 'Run in VR or AR headsets.',
    explanation: 'Needs a headset or a compatible device. Usually absent on desktops.',
  },
};

export interface FeatureStatus {
  id: FeatureId;
  name: string;
  available: boolean;
  constraint: string;
  explanation: string;
}

export function featuresFrom(env: PlatformEnv): FeatureStatus[] {
  return (Object.keys(FEATURE_INFO) as FeatureId[]).map((id) => ({
    id,
    available: env[id],
    ...FEATURE_INFO[id],
  }));
}

export type Renderer = 'webgpu' | 'webgl2' | 'none';

export function pickRenderer(env: PlatformEnv): Renderer {
  if (env.webgpu) return 'webgpu';
  if (env.webgl2) return 'webgl2';
  return 'none';
}

// The renderer the game actually uses. WebGPU is detected, but the WebGPU renderer is not built yet,
// so the game always draws with WebGL 2 when it is available.
export function rendererInUse(env: PlatformEnv): 'webgl2' | 'none' {
  return env.webgl2 ? 'webgl2' : 'none';
}

export function emptyEnv(): PlatformEnv {
  return {
    webgl2: false, webgpu: false, wasm: false, workers: false, offscreenCanvas: false,
    sharedArrayBuffer: false, pointerLock: false, gamepad: false, webAudio: false, webxr: false,
  };
}

// Reads the browser. Pass a window-like object in tests; in the app it defaults to the real one.
export function probeEnvironment(win: any = typeof window !== 'undefined' ? window : undefined): PlatformEnv {
  if (!win) return emptyEnv();
  const nav = win.navigator;
  const doc = win.document;
  let webgl2 = false;
  try {
    webgl2 = !!doc.createElement('canvas').getContext('webgl2');
  } catch {
    webgl2 = false;
  }
  return {
    webgl2,
    webgpu: !!nav?.gpu,
    wasm: typeof win.WebAssembly === 'object',
    workers: typeof win.Worker === 'function',
    offscreenCanvas: typeof win.OffscreenCanvas === 'function',
    sharedArrayBuffer: typeof win.SharedArrayBuffer === 'function' && win.crossOriginIsolated === true,
    pointerLock: typeof doc?.body?.requestPointerLock === 'function',
    gamepad: typeof nav?.getGamepads === 'function',
    webAudio: typeof win.AudioContext === 'function' || typeof win.webkitAudioContext === 'function',
    webxr: !!nav?.xr,
  };
}
