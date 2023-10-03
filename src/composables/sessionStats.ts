import { computed } from "vue";
import {
  getBestSessionStats,
  getCurrentSessionStats,
  timeInSecondsToDisplay,
} from "../helpers/timer";
import { useSolveStore } from "../stores/solves";


export function useSessionStats() {
  const solveStore = useSolveStore();
  
  const currentStats = computed<CurrentSessionStats>(() => {
    return getCurrentSessionStats(solveStore.solves);
  });

  const bestStats = computed<BestSessionStats>(() => {
    return getBestSessionStats(solveStore.solves);
  });

  function statsDisplayTime(solvingTime: number): string {
    return solvingTime == Number.MAX_VALUE
      ? "DNF"
      : timeInSecondsToDisplay(solvingTime);
  }
  const statsDisplayed = computed(() => {
    return {
      best: statsDisplayTime(bestStats.value.best),
      worst: statsDisplayTime(bestStats.value.worst),
      currentAvg5: statsDisplayTime(currentStats.value.avg5),
      currentAvg12: statsDisplayTime(currentStats.value.avg12),
      currentAvg100: statsDisplayTime(currentStats.value.avg100),
      bestAvg5: statsDisplayTime(bestStats.value.avg5),
      bestAvg12: statsDisplayTime(bestStats.value.avg12),
      bestAvg100: statsDisplayTime(bestStats.value.avg100),
    };
  });

  return {
    currentStats,
    bestStats,
    statsDisplayed,
  };
}
