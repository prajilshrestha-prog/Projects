import { Difficulty, Question } from "../types/Question";
import { books } from "../data/datasets";

export function generateLiteratureQuestion(difficulty: Difficulty): Omit<Question, "id" | "genre"> {
  const templates = [
    generateAuthorQuestion,
    generateBookYearQuestion,
    generateReverseAuthorQuestion
  ];

  const template = templates[Math.floor(Math.random() * templates.length)];
  return template(difficulty);
}

function getBookPool(difficulty: Difficulty) {
  if (difficulty === "easy") return books.slice(0, 37);
  if (difficulty === "medium") return books.slice(37, 74);
  return books.slice(74);
}

function generateAuthorQuestion(difficulty: Difficulty) {
  const pool = getBookPool(difficulty);
  const book = pool[Math.floor(Math.random() * pool.length)];
  const answer = book.author;
  const options = [answer];
  
  while (options.length < 4) {
    const randomBook = books[Math.floor(Math.random() * books.length)];
    if (!options.includes(randomBook.author)) {
      options.push(randomBook.author);
    }
  }
  
  return {
    difficulty,
    question: `Who wrote the book "${book.title}"?`,
    answer,
    options
  };
}

function generateBookYearQuestion(difficulty: Difficulty) {
  const pool = getBookPool(difficulty);
  const book = pool[Math.floor(Math.random() * pool.length)];
  const answer = book.year > 0 ? book.year.toString() : `${Math.abs(book.year)} BC`;
  const options = [answer];
  
  while (options.length < 4) {
    const randomYear = book.year > 0 
      ? (book.year + Math.floor(Math.random() * 50) - 25).toString()
      : `${Math.abs(book.year) + Math.floor(Math.random() * 100) - 50} BC`;
      
    if (!options.includes(randomYear)) {
      options.push(randomYear);
    }
  }
  
  return {
    difficulty,
    question: `In what year was "${book.title}" published?`,
    answer,
    options
  };
}

function generateReverseAuthorQuestion(difficulty: Difficulty) {
  const pool = getBookPool(difficulty);
  const book = pool[Math.floor(Math.random() * pool.length)];
  const answer = book.title;
  const options = [answer];
  
  while (options.length < 4) {
    const randomBook = books[Math.floor(Math.random() * books.length)];
    if (!options.includes(randomBook.title)) {
      options.push(randomBook.title);
    }
  }
  
  return {
    difficulty,
    question: `Which of the following books was written by ${book.author}?`,
    answer,
    options
  };
}
