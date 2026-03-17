import React, { useState } from "react";
import { AnimatePresence } from "motion/react";
import { Home } from "./pages/Home";
import { Quiz } from "./pages/Quiz";
import { Result } from "./pages/Result";
import { Genre, Difficulty, Question, getQuestions } from "./data/questions";

type GameState = "home" | "quiz" | "result";

export default function App() {
  const [gameState, setGameState] = useState<GameState>("home");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [score, setScore] = useState(0);

  const handleStart = (genre: Genre, difficulty: Difficulty, count: number) => {
    const selectedQuestions = getQuestions(genre, difficulty, count);
    setQuestions(selectedQuestions);
    setScore(0);
    setGameState("quiz");
  };

  const handleComplete = (finalScore: number) => {
    setScore(finalScore);
    setGameState("result");
  };

  const handleRestart = () => {
    // Restart with same settings, but get new random questions
    if (questions.length > 0) {
      const newQuestions = getQuestions(
        questions[0].genre,
        questions[0].difficulty,
        questions.length,
      );
      setQuestions(newQuestions);
      setScore(0);
      setGameState("quiz");
    } else {
      setGameState("home");
    }
  };

  const handleHome = () => {
    setGameState("home");
    setQuestions([]);
    setScore(0);
  };

  return (
    <div className="min-h-screen w-full font-sans selection:bg-neon-blue/30">
      {/* Global Header */}
      <header className="w-full p-6 flex justify-between items-center absolute top-0 left-0 z-50 pointer-events-none">
        <div className="text-neon-blue font-mono font-bold tracking-widest text-sm opacity-50">
          SYS.VER.4.2.0
        </div>
        <div className="flex gap-2">
          <div className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse"></div>
          <div
            className="w-2 h-2 rounded-full bg-neon-purple animate-pulse"
            style={{ animationDelay: "0.5s" }}
          ></div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="pt-20 pb-10 px-4 min-h-screen flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          {gameState === "home" && <Home key="home" onStart={handleStart} />}
          {gameState === "quiz" && questions.length > 0 && (
            <Quiz
              key="quiz"
              questions={questions}
              onComplete={handleComplete}
            />
          )}
          {gameState === "result" && (
            <Result
              key="result"
              score={score}
              total={questions.length}
              onRestart={handleRestart}
              onHome={handleHome}
            />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
