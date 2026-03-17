import { Difficulty, Question } from "../types/Question";

export function generateMathQuestion(difficulty: Difficulty): Omit<Question, "id" | "genre"> {
  const templates = [
    generateAddition,
    generateSubtraction,
    generateMultiplication,
    generateDivision,
    generateSquare,
    generateSquareRoot,
    generateAlgebra,
    generatePercentage,
    generateFractionAddition,
    generatePower
  ];

  const template = templates[Math.floor(Math.random() * templates.length)];
  return template(difficulty);
}

function generateAddition(difficulty: Difficulty) {
  const max = difficulty === "easy" ? 50 : difficulty === "medium" ? 500 : 5000;
  const a = Math.floor(Math.random() * max) + 1;
  const b = Math.floor(Math.random() * max) + 1;
  const answer = a + b;
  return createMathResponse(difficulty, `What is ${a} + ${b}?`, answer);
}

function generateSubtraction(difficulty: Difficulty) {
  const max = difficulty === "easy" ? 50 : difficulty === "medium" ? 500 : 5000;
  const a = Math.floor(Math.random() * max) + 20;
  const b = Math.floor(Math.random() * a);
  const answer = a - b;
  return createMathResponse(difficulty, `What is ${a} - ${b}?`, answer);
}

function generateMultiplication(difficulty: Difficulty) {
  const maxA = difficulty === "easy" ? 10 : difficulty === "medium" ? 50 : 200;
  const maxB = difficulty === "easy" ? 10 : difficulty === "medium" ? 20 : 100;
  const a = Math.floor(Math.random() * maxA) + 2;
  const b = Math.floor(Math.random() * maxB) + 2;
  const answer = a * b;
  return createMathResponse(difficulty, `What is ${a} × ${b}?`, answer);
}

function generateDivision(difficulty: Difficulty) {
  const maxB = difficulty === "easy" ? 10 : difficulty === "medium" ? 20 : 50;
  const b = Math.floor(Math.random() * maxB) + 2;
  const answer = Math.floor(Math.random() * (difficulty === "easy" ? 10 : difficulty === "medium" ? 50 : 200)) + 2;
  const a = answer * b;
  return createMathResponse(difficulty, `What is ${a} ÷ ${b}?`, answer);
}

function generateSquare(difficulty: Difficulty) {
  const max = difficulty === "easy" ? 10 : difficulty === "medium" ? 25 : 100;
  const a = Math.floor(Math.random() * max) + 2;
  const answer = a * a;
  return createMathResponse(difficulty, `What is ${a}²?`, answer);
}

function generateSquareRoot(difficulty: Difficulty) {
  const max = difficulty === "easy" ? 10 : difficulty === "medium" ? 25 : 100;
  const answer = Math.floor(Math.random() * max) + 2;
  const a = answer * answer;
  return createMathResponse(difficulty, `What is the square root of ${a}?`, answer);
}

function generateAlgebra(difficulty: Difficulty) {
  const x = Math.floor(Math.random() * (difficulty === "easy" ? 10 : difficulty === "medium" ? 20 : 50)) + 1;
  const a = Math.floor(Math.random() * (difficulty === "easy" ? 5 : difficulty === "medium" ? 10 : 20)) + 1;
  const b = Math.floor(Math.random() * (difficulty === "easy" ? 20 : difficulty === "medium" ? 50 : 100)) + 1;
  const c = a * x + b;
  return createMathResponse(difficulty, `Solve for x: ${a}x + ${b} = ${c}`, x);
}

function generatePercentage(difficulty: Difficulty) {
  const percent = (Math.floor(Math.random() * 19) + 1) * 5; // 5, 10, 15... 95
  const base = (Math.floor(Math.random() * (difficulty === "easy" ? 10 : difficulty === "medium" ? 50 : 200)) + 1) * 10;
  const answer = (percent / 100) * base;
  return createMathResponse(difficulty, `What is ${percent}% of ${base}?`, answer);
}

function generateFractionAddition(difficulty: Difficulty) {
  const denoms = difficulty === "easy" ? [2, 3, 4, 5] : difficulty === "medium" ? [6, 7, 8, 9, 10] : [11, 12, 13, 14, 15];
  const denom = denoms[Math.floor(Math.random() * denoms.length)];
  const num1 = Math.floor(Math.random() * (denom - 1)) + 1;
  const num2 = Math.floor(Math.random() * (denom - 1)) + 1;
  const answerNum = num1 + num2;
  
  const answer = `${answerNum}/${denom}`;
  const fake1 = `${answerNum + 1}/${denom}`;
  const fake2 = `${answerNum - 1 > 0 ? answerNum - 1 : answerNum + 2}/${denom}`;
  const fake3 = `${answerNum}/${denom + 1}`;
  
  return {
    difficulty,
    question: `What is ${num1}/${denom} + ${num2}/${denom}?`,
    answer,
    options: [answer, fake1, fake2, fake3]
  };
}

function generatePower(difficulty: Difficulty) {
  const baseMax = difficulty === "easy" ? 3 : difficulty === "medium" ? 5 : 10;
  const expMax = difficulty === "easy" ? 3 : difficulty === "medium" ? 4 : 5;
  const base = Math.floor(Math.random() * baseMax) + 2;
  const exp = Math.floor(Math.random() * expMax) + 2;
  const answer = Math.pow(base, exp);
  return createMathResponse(difficulty, `What is ${base} to the power of ${exp}?`, answer);
}

function createMathResponse(difficulty: Difficulty, question: string, answer: number) {
  const offset1 = Math.floor(Math.random() * 10) + 1;
  const offset2 = Math.floor(Math.random() * 20) + 1;
  const offset3 = Math.floor(Math.random() * 5) + 1;
  
  const options = [
    answer.toString(),
    (answer + offset1).toString(),
    (answer - offset2).toString(),
    (answer + offset3 * (Math.random() > 0.5 ? 1 : -1)).toString()
  ];
  
  const uniqueOptions = Array.from(new Set(options));
  while (uniqueOptions.length < 4) {
    uniqueOptions.push((answer + Math.floor(Math.random() * 50) + 1).toString());
  }
  
  return {
    difficulty,
    question,
    answer: answer.toString(),
    options: uniqueOptions.slice(0, 4)
  };
}
