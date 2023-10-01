import * as timer from "../../helpers/timer";

function constructSolve(
  solvingTime: number,
  inspectionTime: number,
  scramble = ""
): Solve {
  return {
    solvingTime,
    inspectionTime,
    scramble,
    isDNF: inspectionTime > 17,
    isPlusTwo: inspectionTime > 15 && inspectionTime <= 17,
  };
}

let solves: Solve[] = [
  constructSolve(0.1, 12),
  constructSolve(0.1, 12),
  constructSolve(0.5, 12),
  constructSolve(0.5, 12),
  constructSolve(0.5, 12),
  constructSolve(0.7, 12),
];

test("calculates avg of solves without penalties correctly", () => {
  expect(timer.avg(solves, 5)).toBe(0.5);
});

test("calculates avg with one DNF correctly", () => {
  solves = [
    constructSolve(0.1, 12),
    constructSolve(0.1, 12),
    constructSolve(0.5, 12),
    constructSolve(0.5, 12),
    constructSolve(0.5, 12),
    constructSolve(0.7, 18),
  ];
  expect(timer.avg(solves, 5)).toBe(0.5);
});

test("calculates avg with two DNFs correctly", () => {
  solves = [
    constructSolve(0.1, 12),
    constructSolve(0.1, 12),
    constructSolve(0.5, 12),
    constructSolve(0.5, 12),
    constructSolve(0.5, 18),
    constructSolve(0.7, 18),
  ];
  expect(timer.avg(solves, 5)).toBe(Number.MAX_VALUE);
});

test("calculates avg with a +2 correctly", () => {
  solves = [
    constructSolve(0.1, 12),
    constructSolve(3, 12),
    constructSolve(3, 12),
    constructSolve(1, 16),
    constructSolve(0.5, 12),
    constructSolve(4, 12),
  ];
  expect(timer.avg(solves, 5)).toBe(3);
});

test("calculates best avg with a +2 correctly", () => {
  solves = [
    constructSolve(1, 12),
    constructSolve(2, 12),
    constructSolve(3, 12),
    constructSolve(4, 12),
    constructSolve(5, 12),
    constructSolve(0.5, 16),
  ];
  expect(timer.bestAvg(solves, 5).bestAvgValue).toBe(3);
});
