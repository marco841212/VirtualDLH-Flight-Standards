export function calculateFlightScore(data:any){
  let score = 0;

  score += (data.procedures || 0) * 0.30;
  score += (data.safety || 0) * 0.25;
  score += (data.landing || 0) * 0.20;
  score += (data.efficiency || 0) * 0.15;
  score += (data.professionalism || 0) * 0.10;

  return Math.round(score);
}
