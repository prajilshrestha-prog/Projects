import { Difficulty, Question } from "../types/Question";
import { shuffleOptions } from "./optionShuffler";
import { questionTracker } from "./questionTracker";

import { generateMathQuestion } from "../generators/mathGenerator";
import { generateScienceQuestion } from "../generators/scienceGenerator";
import { generateHistoryQuestion } from "../generators/historyGenerator";
import { generateGeographyQuestion } from "../generators/geographyGenerator";
import { generateSportsQuestion } from "../generators/sportsGenerator";
import { generateGKQuestion } from "../generators/gkGenerator";
import { generateTechnologyQuestion } from "../generators/technologyGenerator";
import { generateLiteratureQuestion } from "../generators/literatureGenerator";

export function generateQuestion(genre: string, difficulty: Difficulty): Question {
  let questionData: Omit<Question, "id" | "genre">;
  
  switch (genre.toLowerCase()) {
    case "math":
    case "mathematics":
      questionData = generateMathQuestion(difficulty);
      break;
    case "science":
      questionData = generateScienceQuestion(difficulty);
      break;
    case "history":
      questionData = generateHistoryQuestion(difficulty);
      break;
    case "geography":
      questionData = generateGeographyQuestion(difficulty);
      break;
    case "sports":
      questionData = generateSportsQuestion(difficulty);
      break;
    case "general knowledge":
    case "gk":
      questionData = generateGKQuestion(difficulty);
      break;
    case "technology":
      questionData = generateTechnologyQuestion(difficulty);
      break;
    case "literature":
      questionData = generateLiteratureQuestion(difficulty);
      break;
    default:
      questionData = generateGKQuestion(difficulty);
  }

  // Generate a unique ID based on the question text and answer
  const rawId = `${genre}-${difficulty}-${questionData.question}-${questionData.answer}`;
  const id = btoa(encodeURIComponent(rawId));

  // If we've seen this exact question recently, try generating another one
  // (We limit retries to avoid infinite loops)
  let retries = 0;
  let finalQuestionData = questionData;
  let finalId = id;
  
  while (questionTracker.has(finalId, genre, difficulty) && retries < 5) {
    retries++;
    switch (genre.toLowerCase()) {
      case "math":
      case "mathematics": finalQuestionData = generateMathQuestion(difficulty); break;
      case "science": finalQuestionData = generateScienceQuestion(difficulty); break;
      case "history": finalQuestionData = generateHistoryQuestion(difficulty); break;
      case "geography": finalQuestionData = generateGeographyQuestion(difficulty); break;
      case "sports": finalQuestionData = generateSportsQuestion(difficulty); break;
      case "general knowledge":
      case "gk": finalQuestionData = generateGKQuestion(difficulty); break;
      case "technology": finalQuestionData = generateTechnologyQuestion(difficulty); break;
      case "literature": finalQuestionData = generateLiteratureQuestion(difficulty); break;
      default: finalQuestionData = generateGKQuestion(difficulty);
    }
    const newRawId = `${genre}-${difficulty}-${finalQuestionData.question}-${finalQuestionData.answer}`;
    finalId = btoa(encodeURIComponent(newRawId));
  }

  // We don't add it to the tracker here anymore, because we want to add it only when it's actually asked.
  // Wait, if we don't add it here, the `while` loop won't prevent duplicates within the same batch.
  // But wait, `src/data/questions.ts` generates a pool of candidates and deduplicates them using a Map.
  // So we don't need `questionTracker.add` here.
  // Let's just remove `questionTracker.add(finalId);` from here, or we can keep it but it's better to add them in `src/data/questions.ts`.
  // Wait, `src/data/questions.ts` generates 2000 candidates. If we add them all to the tracker here, we will fill up the tracker with unasked questions!
  // Yes! `questionTracker.add` should NOT be called in `generateQuestion`. It should be called in `getQuestions` when they are actually selected.
  
  return {
    id: finalId,
    genre,
    difficulty,
    question: finalQuestionData.question,
    answer: finalQuestionData.answer,
    options: shuffleOptions(finalQuestionData.options)
  };
}
