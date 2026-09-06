export function generateFeedback(score: number, issues: string[]) {
  return {
    score,
    strengths: score >= 90 ? ['Excellent operational discipline'] : [],
    improvements: issues,
    recommendation: issues.length
      ? 'Review applicable VirtualDLH SOP procedures'
      : 'Continue maintaining operational standards'
  };
}
