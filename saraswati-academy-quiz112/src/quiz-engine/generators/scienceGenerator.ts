import { Difficulty, Question } from "../types/Question";
import { elements } from "../data/datasets";

export function generateScienceQuestion(difficulty: Difficulty): Omit<Question, "id" | "genre"> {
  const templates = [
    generateElementSymbolQuestion,
    generateElementNumberQuestion,
    generateReverseSymbolQuestion
  ];

  const template = templates[Math.floor(Math.random() * templates.length)];
  return template(difficulty);
}

function getElementPool(difficulty: Difficulty) {
  if (difficulty === "easy") return elements.slice(0, 56);
  if (difficulty === "medium") return elements.slice(56, 112);
  return elements.slice(112);
}

function generateElementSymbolQuestion(difficulty: Difficulty) {
  const pool = getElementPool(difficulty);
  const element = pool[Math.floor(Math.random() * pool.length)];
  const answer = element.symbol;
  const options = [answer];
  
  while (options.length < 4) {
    const randomElement = elements[Math.floor(Math.random() * elements.length)];
    if (!options.includes(randomElement.symbol)) {
      options.push(randomElement.symbol);
    }
  }
  
  return {
    difficulty,
    question: `What is the chemical symbol for ${element.name}?`,
    answer,
    options
  };
}

function generateElementNumberQuestion(difficulty: Difficulty) {
  const pool = getElementPool(difficulty);
  const element = pool[Math.floor(Math.random() * pool.length)];
  const answer = element.number.toString();
  const options = [answer];
  
  while (options.length < 4) {
    const randomNum = (element.number + Math.floor(Math.random() * 10) - 5).toString();
    if (!options.includes(randomNum) && parseInt(randomNum) > 0) {
      options.push(randomNum);
    }
  }
  
  return {
    difficulty,
    question: `What is the atomic number of ${element.name}?`,
    answer,
    options
  };
}

function generateReverseSymbolQuestion(difficulty: Difficulty) {
  const pool = getElementPool(difficulty);
  const element = pool[Math.floor(Math.random() * pool.length)];
  const answer = element.name;
  const options = [answer];
  
  while (options.length < 4) {
    const randomElement = elements[Math.floor(Math.random() * elements.length)];
    if (!options.includes(randomElement.name)) {
      options.push(randomElement.name);
    }
  }
  
  return {
    difficulty,
    question: `Which element has the chemical symbol '${element.symbol}'?`,
    answer,
    options
  };
}
