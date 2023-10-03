import * as _ from "lodash";
import moment from "moment";

//TODO change avg functions to take solves array and calculate DNFs and +2
export function avg(solves: Solve[], scope: number): number {
  const solvingTimes = solvesToNumValues(solves);
  if (solvingTimes.length < scope) return Number.MAX_VALUE;

  const lastNTimes = solvingTimes.slice(-scope);
  if (_.countBy(lastNTimes)[Number.MAX_VALUE] > 1) return Number.MAX_VALUE;

  const bestIdx = lastNTimes.indexOf(Math.min(...lastNTimes));
  const worstIdx = lastNTimes.indexOf(Math.max(...lastNTimes));

  const idxFilter = [bestIdx, worstIdx];
  const cleanSolvingTimes = lastNTimes.filter(
    (_val, index) => !idxFilter.includes(index)
  );

  return _.mean(cleanSolvingTimes);
}

export function bestAvg(
  solves: Solve[],
  scope: number
): { bestAvgValue: number; startingIndex: number } {
  let bestAvgValue = Number.MAX_VALUE;
  let startingIndex = -1;

  [...Array(Math.max(solves.length - scope + 1, 0)).keys()].forEach((i) => {
    let currentAvg = avg(solves.slice(i, i + scope), scope);
    if (currentAvg < bestAvgValue) {
      bestAvgValue = currentAvg;
      startingIndex = i;
    }
  });

  return { bestAvgValue, startingIndex };
}

function solvesToNumValues(solves: Solve[]): number[] {
  return solves.map((solve: Solve) => {
    if (solve.isDNF) return Number.MAX_VALUE;
    else if (solve.isPlusTwo) return solve.solvingTime + 2;
    else return solve.solvingTime;
  });
}

export function getBestSessionStats(solves: Solve[]): BestSessionStats {
  const solvingTimes = solvesToNumValues(solves);
  const best = Math.min(...solvingTimes);
  const resultsWithoutDNFs = solvingTimes.filter((x) => x != Number.MAX_VALUE);
  const worst =
    resultsWithoutDNFs.length > 0
      ? Math.max(...resultsWithoutDNFs)
      : Number.MAX_VALUE;

  const avg5Stats = bestAvg(solves, 5);
  const avg12Stats = bestAvg(solves, 12);
  const avg100Stats = bestAvg(solves, 100);

  return {
    best: best,
    worst: worst,
    avg5: avg5Stats.bestAvgValue,
    avg5Start: avg5Stats.startingIndex,
    avg12: avg12Stats.bestAvgValue,
    avg12Start: avg12Stats.startingIndex,
    avg100: avg100Stats.bestAvgValue,
    avg100Start: avg100Stats.startingIndex,
  };
}

export function getCurrentSessionStats(solves: Solve[]): CurrentSessionStats {
  const avg5 = avg(solves, 5);
  const avg12 = avg(solves, 12);
  const avg100 = avg(solves, 100);

  return {
    avg5,
    avg12,
    avg100,
  };
}

export function timeInSecondsToDisplay(time: number): string {
  let format;

  if (time < 10) format = "s.SS";
  else if (time < 60) format = "ss.SS";
  else if (time < 10 * 60) format = "m:ss.SS";
  else if (time < 3600) format = "mm:ss.SS";
  else if (time < 10 * 3600) format = "H:mm:ss.SS";
  else format = "HH:mm:ss.SS";

  return moment.utc(time * 1000).format(format);
}

export function solveToString(solve: Solve) {
  if (solve.isDNF) return `DNF(${timeInSecondsToDisplay(solve.solvingTime)})`;
  else if (solve.isPlusTwo)
    return `${timeInSecondsToDisplay(solve.solvingTime + 2)}+`;
  else return timeInSecondsToDisplay(solve.solvingTime);
}
