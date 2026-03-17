import { Difficulty } from "../types/Question";

export function getDifficultyMultiplier(difficulty: Difficulty): number {
  switch (difficulty) {
    case "easy":
      return 1;
    case "medium":
      return 2;
    case "hard":
      return 3;
    default:
      return 1;
  }
}
