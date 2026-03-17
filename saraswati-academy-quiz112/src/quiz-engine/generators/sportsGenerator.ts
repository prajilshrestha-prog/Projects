import { Difficulty, Question } from "../types/Question";
import { sportsList } from "../data/datasets";

export function generateSportsQuestion(difficulty: Difficulty): Omit<Question, "id" | "genre"> {
  const templates = [
    generatePlayersQuestion,
    generateOriginQuestion,
    generateEquipmentQuestion
  ];

  const template = templates[Math.floor(Math.random() * templates.length)];
  return template(difficulty);
}

function getSportPool(difficulty: Difficulty) {
  if (difficulty === "easy") return sportsList.slice(0, 33);
  if (difficulty === "medium") return sportsList.slice(33, 66);
  return sportsList.slice(66);
}

function generatePlayersQuestion(difficulty: Difficulty) {
  const pool = getSportPool(difficulty);
  const sport = pool[Math.floor(Math.random() * pool.length)];
  const answer = sport.players.toString();
  const options = [answer];
  
  while (options.length < 4) {
    const randomPlayers = (sport.players + Math.floor(Math.random() * 6) - 3).toString();
    if (!options.includes(randomPlayers) && parseInt(randomPlayers) > 0) {
      options.push(randomPlayers);
    }
  }
  
  return {
    difficulty,
    question: `How many players are on the field/court for one team in a standard game of ${sport.sport}?`,
    answer,
    options
  };
}

function generateOriginQuestion(difficulty: Difficulty) {
  const pool = getSportPool(difficulty);
  const sport = pool[Math.floor(Math.random() * pool.length)];
  const answer = sport.origin;
  const options = [answer];
  
  while (options.length < 4) {
    const randomSport = sportsList[Math.floor(Math.random() * sportsList.length)];
    if (!options.includes(randomSport.origin)) {
      options.push(randomSport.origin);
    }
  }
  
  return {
    difficulty,
    question: `In which country/region did the modern version of ${sport.sport} originate?`,
    answer,
    options
  };
}

function generateEquipmentQuestion(difficulty: Difficulty) {
  const pool = getSportPool(difficulty);
  const sport = pool[Math.floor(Math.random() * pool.length)];
  const answer = sport.equipment;
  const options = [answer];
  
  while (options.length < 4) {
    const randomSport = sportsList[Math.floor(Math.random() * sportsList.length)];
    if (!options.includes(randomSport.equipment)) {
      options.push(randomSport.equipment);
    }
  }
  
  return {
    difficulty,
    question: `Which of the following equipment is primarily used in ${sport.sport}?`,
    answer,
    options
  };
}
