import * as _ from "lodash";
//TODO change avg functions to take solves array and calculate DNFs and +2
export function avg(solvingTimes: number[], scope: number): number {
  if (solvingTimes.length < scope) return Number.MAX_VALUE;
  if (_.countBy(solvingTimes)[Number.MAX_VALUE] > 1) return Number.MAX_VALUE;

  const lastNTimes = solvingTimes.slice(-scope);

  const bestIdx = lastNTimes.indexOf(Math.min(...lastNTimes));
  const worstIdx = lastNTimes.indexOf(Math.max(...lastNTimes));

  const idxFilter = [bestIdx, worstIdx];
  const cleanSolvingTimes = lastNTimes.filter(
    (_val, index) => !idxFilter.includes(index)
  );

  return _.mean(cleanSolvingTimes);
}

export function bestAvg(
  solvingTimes: number[],
  scope: number
): { bestAvgValue: number; startingIndex: number } {
  let bestAvgValue = Number.MAX_VALUE;
  let startingIndex = -1;

  [...Array(Math.max(solvingTimes.length - scope + 1, 0)).keys()].forEach((i) => {
    let currentAvg = avg(solvingTimes.slice(i, i + scope), scope);
    if (currentAvg < bestAvgValue) {
      bestAvgValue = currentAvg;
      startingIndex = i;
    }
  });

  return { bestAvgValue, startingIndex };
}

export function getBestSessionStats(solvingTimes: number[]): BestSessionStats {
  const avg5Stats = bestAvg(solvingTimes, 5);
  const avg12Stats = bestAvg(solvingTimes, 12);
  const avg100Stats = bestAvg(solvingTimes, 100);

  return {
    avg5: avg5Stats.bestAvgValue,
    avg5Start: avg5Stats.startingIndex,
    avg12: avg12Stats.bestAvgValue,
    avg12Start: avg12Stats.startingIndex,
    avg100: avg100Stats.bestAvgValue,
    avg100Start: avg100Stats.startingIndex,
  };
}

export function getCurrentSessionStats(
  solvingTimes: number[]
): CurrentSessionStats {
  const avg5 = avg(solvingTimes, 5);
  const avg12 = avg(solvingTimes, 12);
  const avg100 = avg(solvingTimes, 100);

  return {
    avg5,
    avg12,
    avg100,
  };
}
