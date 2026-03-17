import { Difficulty, Question } from "../types/Question";
import { countries } from "../data/datasets";

export function generateGeographyQuestion(difficulty: Difficulty): Omit<Question, "id" | "genre"> {
  const templates = [
    generateCapitalQuestion,
    generateReverseCapitalQuestion
  ];

  const template = templates[Math.floor(Math.random() * templates.length)];
  return template(difficulty);
}

function getCountryPool(difficulty: Difficulty) {
  if (difficulty === "easy") return countries.slice(0, 86);
  if (difficulty === "medium") return countries.slice(86, 172);
  return countries.slice(172);
}

function generateCapitalQuestion(difficulty: Difficulty) {
  const pool = getCountryPool(difficulty);
  const country = pool[Math.floor(Math.random() * pool.length)];
  const answer = country.capital;
  const options = [answer];
  
  while (options.length < 4) {
    const randomCountry = countries[Math.floor(Math.random() * countries.length)]; // Options can come from anywhere
    if (!options.includes(randomCountry.capital)) {
      options.push(randomCountry.capital);
    }
  }
  
  return {
    difficulty,
    question: `What is the capital of ${country.country}?`,
    answer,
    options
  };
}

function generateReverseCapitalQuestion(difficulty: Difficulty) {
  const pool = getCountryPool(difficulty);
  const country = pool[Math.floor(Math.random() * pool.length)];
  const answer = country.country;
  const options = [answer];
  
  while (options.length < 4) {
    const randomCountry = countries[Math.floor(Math.random() * countries.length)];
    if (!options.includes(randomCountry.country)) {
      options.push(randomCountry.country);
    }
  }
  
  return {
    difficulty,
    question: `${country.capital} is the capital of which country?`,
    answer,
    options
  };
}
