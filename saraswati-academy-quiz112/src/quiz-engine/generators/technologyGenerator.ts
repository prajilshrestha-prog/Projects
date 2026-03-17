import { Difficulty, Question } from "../types/Question";
import { techTerms } from "../data/datasets";

export function generateTechnologyQuestion(difficulty: Difficulty): Omit<Question, "id" | "genre"> {
  const templates = [
    generateAcronymQuestion,
    generateReverseAcronymQuestion
  ];

  const template = templates[Math.floor(Math.random() * templates.length)];
  return template(difficulty);
}

function generateAcronymQuestion(difficulty: Difficulty) {
  const term = techTerms[Math.floor(Math.random() * techTerms.length)];
  const answer = term.meaning;
  const options = [answer];
  
  while (options.length < 4) {
    const randomTerm = techTerms[Math.floor(Math.random() * techTerms.length)];
    if (!options.includes(randomTerm.meaning)) {
      options.push(randomTerm.meaning);
    }
  }
  
  return {
    difficulty,
    question: `What does the acronym ${term.term} stand for?`,
    answer,
    options
  };
}

function generateReverseAcronymQuestion(difficulty: Difficulty) {
  const term = techTerms[Math.floor(Math.random() * techTerms.length)];
  const answer = term.term;
  const options = [answer];
  
  while (options.length < 4) {
    const randomTerm = techTerms[Math.floor(Math.random() * techTerms.length)];
    if (!options.includes(randomTerm.term)) {
      options.push(randomTerm.term);
    }
  }
  
  return {
    difficulty,
    question: `What is the common acronym for "${term.meaning}"?`,
    answer,
    options
  };
}
