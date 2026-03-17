import { Difficulty, Question } from "../types/Question";
import { historyEvents } from "../data/datasets";

export function generateHistoryQuestion(difficulty: Difficulty): Omit<Question, "id" | "genre"> {
  const templates = [
    generateEventYearQuestion,
    generateReverseEventYearQuestion,
    generateEventCountryQuestion
  ];

  const template = templates[Math.floor(Math.random() * templates.length)];
  return template(difficulty);
}

function getEventPool(difficulty: Difficulty) {
  if (difficulty === "easy") return historyEvents.slice(0, 58);
  if (difficulty === "medium") return historyEvents.slice(58, 116);
  return historyEvents.slice(116);
}

function generateEventYearQuestion(difficulty: Difficulty) {
  const pool = getEventPool(difficulty);
  const event = pool[Math.floor(Math.random() * pool.length)];
  const answer = event.year.toString();
  const options = [answer];
  
  while (options.length < 4) {
    const randomYear = (event.year + Math.floor(Math.random() * 50) - 25).toString();
    if (!options.includes(randomYear)) {
      options.push(randomYear);
    }
  }
  
  return {
    difficulty,
    question: `In what year did the ${event.event} take place?`,
    answer,
    options
  };
}

function generateReverseEventYearQuestion(difficulty: Difficulty) {
  const pool = getEventPool(difficulty);
  const event = pool[Math.floor(Math.random() * pool.length)];
  const answer = event.event;
  const options = [answer];
  
  while (options.length < 4) {
    const randomEvent = historyEvents[Math.floor(Math.random() * historyEvents.length)];
    if (!options.includes(randomEvent.event)) {
      options.push(randomEvent.event);
    }
  }
  
  return {
    difficulty,
    question: `Which of the following historical events took place in ${event.year}?`,
    answer,
    options
  };
}

function generateEventCountryQuestion(difficulty: Difficulty) {
  const pool = getEventPool(difficulty);
  const event = pool[Math.floor(Math.random() * pool.length)];
  const answer = event.country;
  const options = [answer];
  
  while (options.length < 4) {
    const randomEvent = historyEvents[Math.floor(Math.random() * historyEvents.length)];
    if (!options.includes(randomEvent.country)) {
      options.push(randomEvent.country);
    }
  }
  
  return {
    difficulty,
    question: `Which country/region is primarily associated with the ${event.event}?`,
    answer,
    options
  };
}
