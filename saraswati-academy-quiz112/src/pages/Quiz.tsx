import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Question } from '../data/questions';
import { playSound } from '../utils/sounds';
import { Timer, CheckCircle2, XCircle, ChevronRight } from 'lucide-react';

interface QuizProps {
  questions: Question[];
  onComplete: (score: number, total: number) => void;
}

export const Quiz: React.FC<QuizProps> = ({ questions, onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const autoNextTimeout = useRef<NodeJS.Timeout | null>(null);

  const currentQuestion = questions[currentIndex];
  
  // Determine time based on difficulty
  const getTimeForDifficulty = (diff: string) => {
    if (diff === 'Easy') return 15;
    if (diff === 'Medium') return 30;
    return 60; // Hard
  };

  useEffect(() => {
    if (!currentQuestion) return;
    setTimeLeft(getTimeForDifficulty(currentQuestion.difficulty));
    setSelectedOption(null);
    setIsAnswered(false);
  }, [currentIndex, currentQuestion]);

  const handleNext = useCallback(() => {
    if (autoNextTimeout.current) clearTimeout(autoNextTimeout.current);
    playSound('tick');
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      playSound('finish');
      onComplete(score, questions.length);
    }
  }, [currentIndex, questions.length, score, onComplete]);

  useEffect(() => {
    if (isAnswered) return;
    
    if (timeLeft <= 0) {
      playSound('wrong');
      setIsAnswered(true);
      setSelectedOption('TIMEOUT');
      autoNextTimeout.current = setTimeout(() => {
        handleNext();
      }, 2000);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isAnswered, handleNext]);

  useEffect(() => {
    return () => {
      if (autoNextTimeout.current) clearTimeout(autoNextTimeout.current);
    };
  }, []);

  const handleOptionSelect = (option: string) => {
    if (isAnswered) return;
    
    setSelectedOption(option);
    setIsAnswered(true);
    
    if (option === currentQuestion.answer) {
      playSound('correct');
      setScore(prev => prev + 10);
    } else {
      playSound('wrong');
    }
  };

  if (!currentQuestion) return null;

  const progress = (currentIndex / questions.length) * 100;
  const timeProgress = (timeLeft / getTimeForDifficulty(currentQuestion.difficulty)) * 100;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      className="w-full max-w-5xl mx-auto p-4 md:p-8 min-h-[80vh] flex flex-col"
    >
      {/* Header Stats */}
      <div className="flex justify-between items-end mb-8">
        <div className="space-y-2">
          <div className="text-neon-blue font-mono text-sm uppercase tracking-widest">
            {currentQuestion.genre} // {currentQuestion.difficulty}
          </div>
          <div className="text-3xl font-bold text-white">
            Question <span className="text-neon-purple">{currentIndex + 1}</span>
            <span className="text-gray-500 text-xl">/{questions.length}</span>
          </div>
        </div>
        <div className="text-right space-y-2">
          <div className="text-gray-400 font-mono text-sm uppercase tracking-widest">Score</div>
          <div className="text-3xl font-bold text-neon-cyan">{score}</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-black/50 rounded-full overflow-hidden mb-12 border border-white/10">
        <motion.div 
          className="h-full bg-gradient-to-r from-neon-blue to-neon-purple"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* Main Quiz Area */}
      <div className="flex-1 grid lg:grid-cols-[1fr_300px] gap-8">
        <div className="space-y-8">
          {/* Question Card */}
          <div className="glass-panel rounded-3xl p-8 md:p-12 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-neon-blue"></div>
            <h2 className="text-2xl md:text-4xl font-medium leading-tight text-white">
              {currentQuestion.question}
            </h2>
          </div>

          {/* Options Grid */}
          <div className="grid sm:grid-cols-2 gap-4">
            <AnimatePresence mode="wait">
              {currentQuestion.options.map((option, idx) => {
                const isSelected = selectedOption === option;
                const isCorrect = option === currentQuestion.answer;
                const showCorrect = isAnswered && isCorrect;
                const showWrong = isAnswered && isSelected && !isCorrect;
                
                let btnClass = "glass-panel p-6 rounded-2xl text-left text-lg md:text-xl font-medium transition-all relative overflow-hidden border-2 ";
                
                if (!isAnswered) {
                  btnClass += "border-transparent hover:border-neon-blue hover:bg-neon-blue/10 cursor-pointer";
                } else if (showCorrect) {
                  btnClass += "border-green-500 bg-green-500/20 text-white shadow-[0_0_20px_rgba(34,197,94,0.4)]";
                } else if (showWrong) {
                  btnClass += "border-red-500 bg-red-500/20 text-white opacity-80";
                } else {
                  btnClass += "border-transparent opacity-50";
                }

                return (
                  <motion.button
                    key={`${option}-${idx}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    disabled={isAnswered}
                    onClick={() => handleOptionSelect(option)}
                    className={btnClass}
                  >
                    <div className="flex items-center justify-between">
                      <span>{option}</span>
                      {showCorrect && <CheckCircle2 className="w-6 h-6 text-green-400" />}
                      {showWrong && <XCircle className="w-6 h-6 text-red-400" />}
                    </div>
                  </motion.button>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

        {/* Sidebar / Timer */}
        <div className="flex flex-col gap-6">
          <div className="glass-panel rounded-3xl p-8 flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-neon-blue/5 to-transparent"></div>
            <Timer className={`w-12 h-12 mb-4 ${timeLeft <= 5 ? 'text-red-500 animate-pulse' : 'text-neon-cyan'}`} />
            <div className={`text-6xl font-black font-mono ${timeLeft <= 5 ? 'text-red-500' : 'text-white'}`}>
              {timeLeft}
            </div>
            <div className="text-gray-400 uppercase tracking-widest text-sm mt-2">Seconds Left</div>
            
            {/* Circular Timer Progress */}
            <div className="w-full h-1 bg-black/50 rounded-full mt-6 overflow-hidden">
              <motion.div 
                className={`h-full ${timeLeft <= 5 ? 'bg-red-500' : 'bg-neon-cyan'}`}
                animate={{ width: `${timeProgress}%` }}
                transition={{ duration: 1, ease: "linear" }}
              />
            </div>
          </div>

          {isAnswered && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleNext}
              className="w-full py-6 rounded-2xl bg-white text-black font-black text-xl uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors"
            >
              {currentIndex < questions.length - 1 ? 'Next Question' : 'View Results'}
              <ChevronRight className="w-6 h-6" />
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

