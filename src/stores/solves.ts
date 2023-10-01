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
      return state.solves[state.solves.length - 1];
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
      const isDNF = inspectionTime > 17;
      const isPlusTwo = inspectionTime > 15 && inspectionTime <= 17;
      this.solves.push({ scramble, solvingTime, inspectionTime, isDNF, isPlusTwo });
    },
    removeSolve(id: number) {
      this.solves.splice(id, 1);
    },
    reset() {
      this.solves = [];
    },
    setLastSolveDNF() {
      const newLastSolve = { ...this.lastSolve, isDNF: true, isPlusTwo: false };
      this.solves.splice(-1, 1, newLastSolve)
    },
    setLastSolveNoPenalty() {
      const newLastSolve = {
        ...this.lastSolve,
        isPlusTwo: false,
        isDNF: false,
      };
      this.solves.splice(-1, 1, newLastSolve)
    },
    setLastSolvePlusTwo() {
      const newLastSolve = { ...this.lastSolve, isPlusTwo: true, isDNF: false };
      this.solves.splice(-1, 1, newLastSolve)
    },
  },
});
