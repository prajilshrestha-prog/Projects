import { Difficulty, Question } from "../types/Question";
import { generateGeographyQuestion } from "./geographyGenerator";
import { generateHistoryQuestion } from "./historyGenerator";
import { generateScienceQuestion } from "./scienceGenerator";
import { generateMathQuestion } from "./mathGenerator";
import { generateLiteratureQuestion } from "./literatureGenerator";
import { generateSportsQuestion } from "./sportsGenerator";

export function generateGKQuestion(difficulty: Difficulty): Omit<Question, "id" | "genre"> {
  const generators = [
    generateGeographyQuestion,
    generateHistoryQuestion,
    generateScienceQuestion,
    generateMathQuestion,
    generateLiteratureQuestion,
    generateSportsQuestion
  ];

  const generator = generators[Math.floor(Math.random() * generators.length)];
  return generator(difficulty);
}
