export function evaluateEngines(state:any){
  let points = 0;
  const issues:string[] = [];

  if(state.correctStartSequence){
    points += 25;
  } else {
    issues.push("Incorrect engine start sequence");
  }

  return { points, issues };
}
