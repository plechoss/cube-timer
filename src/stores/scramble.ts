import { defineStore } from "pinia";
import { ScrambleType } from "../types/enums";
import { randomScrambleForEvent } from "cubing/scramble";

export const useScrambleStore = defineStore("scrambleStore", {
  state: () => ({
    currentScramble: "",
  }),
  getters: {
    /**
     * @returns {Solve}
     */
    getCurrentScramble(state) {
      return state.currentScramble;
    },
  },
  actions: {
    generateNextScramble(scrambleType: ScrambleType) {
      randomScrambleForEvent(scrambleType).then(
        (res: any) => (this.currentScramble = res.toString())
      );
    },
  },
});
