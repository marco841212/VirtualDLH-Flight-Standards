export interface LeverState {
  throttle: number;
  flaps: number;
  gearDown: boolean;
  spoilersArmed: boolean;
}

export function evaluateLevers(state: LeverState) {
  let points = 0;
  const issues: string[] = [];

  if (state.gearDown) points += 10;
  if (state.spoilersArmed) points += 10;

  if (state.flaps >= 0) points += 5;

  return { points, issues };
}
