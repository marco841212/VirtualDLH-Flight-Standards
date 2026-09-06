export interface LightState {
  beacon: boolean;
  strobe: boolean;
  landing: boolean;
  taxi: boolean;
  nav: boolean;
}

export function evaluateLights(state: LightState) {
  let points = 0;
  const issues: string[] = [];

  if (state.beacon) points += 5;
  else issues.push('Beacon light not configured correctly');

  if (state.nav) points += 5;
  if (state.strobe) points += 5;

  return { points, issues };
}
