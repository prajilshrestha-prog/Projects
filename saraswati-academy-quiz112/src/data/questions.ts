import { generateQuestion } from "../quiz-engine/engine/questionEngine";
import { Difficulty as EngineDifficulty } from "../quiz-engine/types/Question";
import { questionTracker } from "../quiz-engine/engine/questionTracker";

export type Difficulty = "Easy" | "Medium" | "Hard";
export type Genre =
  | "Science"
  | "Mathematics"
  | "History"
  | "Geography"
  | "General Knowledge";

export interface Question {
  id: string;
  genre: Genre;
  difficulty: Difficulty;
  question: string;
  options: string[];
  answer: string;
}

const ASKED_QUESTIONS_KEY = "saraswati_asked_questions";

export const getAskedQuestionIds = (): string[] => {
  try {
    const stored = localStorage.getItem(ASKED_QUESTIONS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    return [];
  }
};

export const markQuestionsAsAsked = (ids: string[]) => {
  try {
    const asked = getAskedQuestionIds();
    const newAsked = Array.from(new Set([...asked, ...ids]));
    localStorage.setItem(ASKED_QUESTIONS_KEY, JSON.stringify(newAsked));
  } catch (e) {
    console.error("Failed to save asked questions", e);
  }
};

export const resetAskedQuestions = () => {
  try {
    localStorage.removeItem(ASKED_QUESTIONS_KEY);
  } catch (e) {
    console.error("Failed to reset asked questions", e);
  }
};

export const getQuestions = (
  genre: Genre,
  difficulty: Difficulty,
  count: number
): Question[] => {
  const engineDifficulty = difficulty.toLowerCase() as EngineDifficulty;
  
  let askedIds = questionTracker.getAskedIds(genre, difficulty);
  const generatedQuestions: Question[] = [];
  const newAskedIds: string[] = [];
  
  // Generate a large pool of candidates to ensure we can find enough unique ones
  // Since the finite pools (Geography, Science, History) have ~120-130 questions per difficulty,
  // generating 2000 random candidates will almost certainly cover the entire pool.
  const candidatesMap = new Map<string, Question>();
  let attempts = 0;
  const maxCandidates = genre === "Mathematics" ? count * 10 : 2000; 
  
  while (candidatesMap.size < count * 2 && attempts < maxCandidates) {
    attempts++;
    const engineQ = generateQuestion(genre, engineDifficulty);
    if (!candidatesMap.has(engineQ.id)) {
      candidatesMap.set(engineQ.id, {
        id: engineQ.id,
        genre,
        difficulty,
        question: engineQ.question,
        options: engineQ.options,
        answer: engineQ.answer,
      });
    }
  }

  // Filter out the ones we've already asked
  let availableCandidates = Array.from(candidatesMap.values()).filter(q => !askedIds.includes(q.id));

  // If we don't have enough unasked candidates, we've exhausted the pool for this user.
  // Reset the history for this specific genre/difficulty.
  if (availableCandidates.length < count) {
    console.warn(`Exhausted unique questions pool for ${genre} ${difficulty}. Resetting history.`);
    questionTracker.clear(genre, difficulty);
    askedIds = [];
    availableCandidates = Array.from(candidatesMap.values());
  }

  // Shuffle the available candidates to ensure randomness
  availableCandidates.sort(() => Math.random() - 0.5);

  // Pick the required number of questions
  for (let i = 0; i < count && i < availableCandidates.length; i++) {
    generatedQuestions.push(availableCandidates[i]);
    newAskedIds.push(availableCandidates[i].id);
  }

  // Fallback: If we STILL don't have enough (e.g., requested 100 but the absolute maximum pool size is 90),
  // we generate completely random ones and force unique IDs to fulfill the count and avoid breaking the app.
  while (generatedQuestions.length < count) {
    const engineQ = generateQuestion(genre, engineDifficulty);
    const forcedId = engineQ.id + "-" + Math.random().toString(36).substring(2, 9);
    generatedQuestions.push({
      id: forcedId,
      genre,
      difficulty,
      question: engineQ.question,
      options: engineQ.options,
      answer: engineQ.answer,
    });
    newAskedIds.push(forcedId);
  }

  // Save the new asked IDs
  questionTracker.addMultiple(newAskedIds, genre, difficulty);

  return generatedQuestions;
};
