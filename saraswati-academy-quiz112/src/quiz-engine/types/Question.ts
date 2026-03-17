export type Difficulty = "easy" | "medium" | "hard";

export interface Question {
  id: string;
  genre: string;
  difficulty: Difficulty;
  question: string;
  options: string[];
  answer: string;
}
