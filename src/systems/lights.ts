export function evaluateLights(state: any) {
  let points = 0;
  const issues: string[] = [];

  if (state.beacon) points += 5;
  else issues.push('Beacon procedure missing');

  if (state.phase === 'TAKEOFF' && state.strobes) points += 10;
  if (state.altitude < 10000 && state.landingLights) points += 10;
  if (state.onGround && state.taxiLights) points += 5;

  return { points, issues };
}
