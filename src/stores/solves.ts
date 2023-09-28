import { defineStore } from "pinia";

export const useSolveStore = defineStore("solveStore", {
  state: () => ({
    solves: [] as Solve[],
  }),
  getters: {
    /**
     * @returns {Solve}
     */
    lastSolve(state) {
      return state.solves.at(-1);
    },
    /**
     * @returns {Solve[]}
     */
    solvingTimes(state) {
      return state.solves.map((solve: Solve) => solve.solvingTime);
    },
  },
  actions: {
    addSolve(scramble: string, solvingTime: number, inspectionTime: number) {
      // you can directly mutate the state
      this.solves.push({ scramble, solvingTime, inspectionTime });
    },
    removeSolve(id: Number) {
      this.solves.splice(id, 1);
    },
    reset() {
      this.solves = [];
    },
  },
});
