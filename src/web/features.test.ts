import { describe, expect, it } from 'vitest';
import { emptyEnv, featuresFrom, pickRenderer, probeEnvironment, rendererInUse, FEATURE_INFO } from './features';

describe('pickRenderer', () => {
  it('prefers WebGPU, falls back to WebGL 2, then none', () => {
    expect(pickRenderer({ ...emptyEnv(), webgpu: true, webgl2: true })).toBe('webgpu');
    expect(pickRenderer({ ...emptyEnv(), webgl2: true })).toBe('webgl2');
    expect(pickRenderer(emptyEnv())).toBe('none');
  });
});

describe('featuresFrom', () => {
  it('lists every feature with its constraint and availability', () => {
    const list = featuresFrom({ ...emptyEnv(), wasm: true });
    expect(list).toHaveLength(Object.keys(FEATURE_INFO).length);
    expect(list.find((f) => f.id === 'wasm')?.available).toBe(true);
    expect(list.find((f) => f.id === 'webxr')?.available).toBe(false);
  });

  it('explains that SharedArrayBuffer needs cross-origin isolation', () => {
    expect(FEATURE_INFO.sharedArrayBuffer.explanation.toLowerCase()).toContain('headers');
  });
});

describe('probeEnvironment', () => {
  it('reports nothing when there is no window (for example during server rendering)', () => {
    expect(probeEnvironment(undefined)).toEqual(emptyEnv());
  });

  it('reads capabilities from a window-like object', () => {
    const fakeDoc = {
      createElement: () => ({ getContext: (k: string) => (k === 'webgl2' ? {} : null) }),
      body: { requestPointerLock: () => {} },
    };
    const env = probeEnvironment({
      navigator: { gpu: undefined, getGamepads: () => [] },
      document: fakeDoc,
      WebAssembly: {},
      SharedArrayBuffer: function () {},
      crossOriginIsolated: false,
    });
    expect(env.webgl2).toBe(true);
    expect(env.wasm).toBe(true);
    expect(env.pointerLock).toBe(true);
    expect(env.sharedArrayBuffer).toBe(false); // present, but the page is not isolated
  });
});

describe('rendererInUse', () => {
  it('uses WebGL 2 even when WebGPU is detected, because the WebGPU renderer is not built', () => {
    expect(rendererInUse({ ...emptyEnv(), webgpu: true, webgl2: true })).toBe('webgl2');
    expect(rendererInUse({ ...emptyEnv(), webgpu: true })).toBe('none');
  });
});
