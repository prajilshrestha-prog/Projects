import React from "react";
import { motion } from "motion/react";
import { Genre, Difficulty } from "../data/questions";
import { playSound } from "../utils/sounds";
import { BrainCircuit, Zap, Settings2, Hash } from "lucide-react";

interface HomeProps {
  onStart: (genre: Genre, difficulty: Difficulty, count: number) => void;
}

const GENRES: Genre[] = [
  "Science",
  "Mathematics",
  "History",
  "Geography",
  "General Knowledge",
];

const DIFFICULTIES: Difficulty[] = ["Easy", "Medium", "Hard"];
const COUNTS = [10, 20, 50, 100];

export const Home: React.FC<HomeProps> = ({ onStart }) => {
  const [genre, setGenre] = React.useState<Genre>("Science");
  const [difficulty, setDifficulty] = React.useState<Difficulty>("Medium");
  const [count, setCount] = React.useState<number>(10);

  const handleStart = () => {
    playSound("tick");
    onStart(genre, difficulty, count);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full max-w-4xl mx-auto p-6 flex flex-col items-center justify-center min-h-[80vh]"
    >
      <div className="text-center mb-12">
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="inline-block mb-4"
        >
          <BrainCircuit className="w-24 h-24 text-neon-blue drop-shadow-[0_0_15px_rgba(0,243,255,0.8)]" />
        </motion.div>
        <h1 className="text-6xl md:text-7xl font-black tracking-tighter mb-4 uppercase">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple neon-text-blue">
            Saraswati Academy
          </span>
          <br />
          <span className="text-4xl md:text-5xl text-white tracking-widest font-light">
            QUIZ
          </span>
        </h1>
        <p className="text-gray-400 text-lg max-w-lg mx-auto font-mono">
          Made by Saraswati Academy students
        </p>
      </div>

      <div className="glass-panel rounded-3xl p-8 w-full max-w-2xl grid gap-8 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-neon-blue to-transparent opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-neon-purple to-transparent opacity-50"></div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Genre Selection */}
          <div className="space-y-3">
            <label className="flex items-center text-neon-blue font-mono text-sm uppercase tracking-wider">
              <Zap className="w-4 h-4 mr-2" /> Subject Domain
            </label>
            <div className="relative">
              <select
                value={genre}
                onChange={(e) => {
                  playSound("tick");
                  setGenre(e.target.value as Genre);
                }}
                className="w-full bg-black/50 border border-neon-blue/30 rounded-xl p-4 text-white appearance-none focus:outline-none focus:border-neon-blue neon-border-hover transition-all cursor-pointer font-medium text-lg"
              >
                {GENRES.map((g) => (
                  <option key={g} value={g} className="bg-dark-bg">
                    {g}
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-neon-blue">
                ▼
              </div>
            </div>
          </div>

          {/* Difficulty Selection */}
          <div className="space-y-3">
            <label className="flex items-center text-neon-purple font-mono text-sm uppercase tracking-wider">
              <Settings2 className="w-4 h-4 mr-2" /> Threat Level
            </label>
            <div className="relative">
              <select
                value={difficulty}
                onChange={(e) => {
                  playSound("tick");
                  setDifficulty(e.target.value as Difficulty);
                }}
                className="w-full bg-black/50 border border-neon-purple/30 rounded-xl p-4 text-white appearance-none focus:outline-none focus:border-neon-purple neon-border-purple-hover transition-all cursor-pointer font-medium text-lg"
              >
                {DIFFICULTIES.map((d) => (
                  <option key={d} value={d} className="bg-dark-bg">
                    {d}
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-neon-purple">
                ▼
              </div>
            </div>
          </div>

          {/* Count Selection */}
          <div className="space-y-3 md:col-span-2">
            <label className="flex items-center text-neon-cyan font-mono text-sm uppercase tracking-wider">
              <Hash className="w-4 h-4 mr-2" /> Sequence Length
            </label>
            <div className="flex gap-4">
              {COUNTS.map((c) => (
                <button
                  key={c}
                  onClick={() => {
                    playSound("tick");
                    setCount(c);
                  }}
                  className={`flex-1 py-4 rounded-xl font-bold text-xl transition-all ${
                    count === c
                      ? "bg-neon-blue/20 border-2 border-neon-blue text-white neon-border"
                      : "bg-black/50 border border-white/10 text-gray-400 hover:border-neon-blue/50 hover:text-white"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleStart}
          className="w-full mt-4 py-6 rounded-2xl bg-gradient-to-r from-neon-blue to-neon-purple text-white font-black text-2xl uppercase tracking-widest shadow-[0_0_30px_rgba(0,243,255,0.4)] hover:shadow-[0_0_50px_rgba(188,19,254,0.6)] transition-all border border-white/20"
        >
          Initialize Sequence
        </motion.button>
      </div>
    </motion.div>
  );
};
