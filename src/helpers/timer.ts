import _ from "lodash";

/**
 * Calculates an average of the given array of solves. Cuts off the best and worst time.
 * @param solves
 * @returns
 */
export function avg(solvingTimes: number[]) {
  if (_.countBy(solvingTimes)[Number.MAX_VALUE] > 1) return "DNF";

  const bestIdx = solvingTimes.indexOf(Math.min(...solvingTimes));
  const worstIdx = solvingTimes.indexOf(Math.max(...solvingTimes));

  const idxFilter = [bestIdx, worstIdx];
  const cleanSolvingTimes = solvingTimes.filter(
    (val, index) => !idxFilter.includes(index)
  );

  console.log({ bestIdx, worstIdx, idxFilter, cleanSolvingTimes, solvingTimes });
  return _.mean(cleanSolvingTimes);
}
