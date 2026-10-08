// Fixed timestep. Real frame time goes in; whole fixed steps come out.
// The step count depends on elapsed time, not on how fast the frames run.
export class FixedStepper {
  private acc = 0;

  constructor(readonly dt: number, private readonly maxSteps = 10) {}

  advance(frameDt: number, step: (dt: number) => void): number {
    this.acc += Math.max(0, frameDt);
    let n = 0;
    while (this.acc >= this.dt && n < this.maxSteps) {
      step(this.dt);
      this.acc -= this.dt;
      n += 1;
    }
    if (n === this.maxSteps) this.acc = 0; // drop the backlog after a long stall
    return n;
  }

  reset(): void {
    this.acc = 0;
  }
}
