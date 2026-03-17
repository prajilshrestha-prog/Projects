import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { playSound } from '../utils/sounds';
import { Trophy, RotateCcw, Home as HomeIcon, Star, Save, List } from 'lucide-react';

interface ResultProps {
  score: number;
  total: number;
  onRestart: () => void;
  onHome: () => void;
}

interface LeaderboardEntry {
  name: string;
  score: number;
  date: string;
}

export const Result: React.FC<ResultProps> = ({ score, total, onRestart, onHome }) => {
  const maxScore = total * 10;
  const percentage = (score / maxScore) * 100;
  
  let grade = 'F';
  let colorClass = 'text-red-500';
  let message = 'Simulation Failed. Retraining required.';
  
  if (percentage >= 90) {
    grade = 'S';
    colorClass = 'text-neon-purple';
    message = 'Outstanding! Neural link optimized.';
  } else if (percentage >= 80) {
    grade = 'A';
    colorClass = 'text-neon-blue';
    message = 'Excellent performance. High accuracy achieved.';
  } else if (percentage >= 70) {
    grade = 'B';
    colorClass = 'text-neon-cyan';
    message = 'Good result. Minor recalibration needed.';
  } else if (percentage >= 60) {
    grade = 'C';
    colorClass = 'text-yellow-400';
    message = 'Acceptable. Further study recommended.';
  } else if (percentage >= 50) {
    grade = 'D';
    colorClass = 'text-orange-500';
    message = 'Suboptimal. Barely passed the threshold.';
  }

  const [playerName, setPlayerName] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('smartquiz_leaderboard');
      if (stored) {
        setLeaderboard(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load leaderboard', e);
    }
  }, []);

  const handleSaveScore = () => {
    if (!playerName.trim() || isSaved) return;
    playSound('tick');
    
    const newEntry: LeaderboardEntry = {
      name: playerName.trim(),
      score,
      date: new Date().toLocaleDateString()
    };
    
    const newLeaderboard = [...leaderboard, newEntry]
      .sort((a, b) => b.score - a.score)
      .slice(0, 5); // Keep top 5
      
    setLeaderboard(newLeaderboard);
    try {
      localStorage.setItem('smartquiz_leaderboard', JSON.stringify(newLeaderboard));
    } catch (e) {
      console.error('Failed to save leaderboard', e);
    }
    setIsSaved(true);
    setShowLeaderboard(true);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-4xl mx-auto p-6 flex flex-col items-center justify-center min-h-[80vh]"
    >
      <div className="glass-panel rounded-3xl p-8 md:p-12 w-full relative overflow-hidden">
        {/* Decorative background glow */}
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full blur-[100px] opacity-20 ${colorClass.replace('text-', 'bg-')}`}></div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Column: Score & Grade */}
          <div className="text-center flex flex-col items-center justify-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: 360 }}
              transition={{ type: "spring", duration: 1.5 }}
              className="inline-block mb-8 relative"
            >
              <Trophy className={`w-32 h-32 ${colorClass} drop-shadow-[0_0_20px_currentColor]`} />
              {percentage >= 90 && (
                <motion.div 
                  animate={{ opacity: [0, 1, 0], scale: [0.8, 1.2, 0.8] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute -top-4 -right-4"
                >
                  <Star className="w-12 h-12 text-yellow-300 fill-yellow-300" />
                </motion.div>
              )}
            </motion.div>

            <h2 className="text-3xl font-light text-gray-300 mb-2 uppercase tracking-widest">Final Assessment</h2>
            
            <div className="flex items-center justify-center gap-8 my-8">
              <div className="text-center">
                <div className="text-gray-500 font-mono text-sm uppercase tracking-widest mb-2">Score</div>
                <div className="text-5xl font-black text-white">
                  {score}<span className="text-2xl text-gray-600">/{maxScore}</span>
                </div>
              </div>
              
              <div className="w-px h-16 bg-white/10"></div>
              
              <div className="text-center">
                <div className="text-gray-500 font-mono text-sm uppercase tracking-widest mb-2">Grade</div>
                <div className={`text-6xl font-black ${colorClass} drop-shadow-[0_0_15px_currentColor]`}>
                  {grade}
                </div>
              </div>
            </div>

            <p className="text-lg text-gray-400 font-mono mb-8">
              &gt; {message}
            </p>
          </div>

          {/* Right Column: Leaderboard & Actions */}
          <div className="flex flex-col justify-center border-t md:border-t-0 md:border-l border-white/10 pt-8 md:pt-0 md:pl-12">
            {!showLeaderboard ? (
              <div className="space-y-6 mb-8">
                <h3 className="text-xl font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Save className="w-5 h-5 text-neon-blue" /> Save Record
                </h3>
                {!isSaved ? (
                  <div className="flex flex-col gap-4">
                    <input 
                      type="text" 
                      placeholder="Enter your name..." 
                      value={playerName}
                      onChange={(e) => setPlayerName(e.target.value)}
                      maxLength={15}
                      className="bg-black/50 border border-white/20 rounded-xl p-4 text-white focus:outline-none focus:border-neon-blue transition-colors"
                    />
                    <button 
                      onClick={handleSaveScore}
                      disabled={!playerName.trim()}
                      className="py-4 rounded-xl bg-neon-blue/20 border border-neon-blue text-white font-bold uppercase tracking-wider hover:bg-neon-blue/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Submit Score
                    </button>
                  </div>
                ) : (
                  <div className="p-4 bg-green-500/20 border border-green-500 rounded-xl text-green-400 text-center font-bold">
                    Score Saved Successfully!
                  </div>
                )}
                
                <button 
                  onClick={() => setShowLeaderboard(true)}
                  className="w-full py-4 rounded-xl bg-white/5 border border-white/10 text-gray-300 font-bold uppercase tracking-wider hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                >
                  <List className="w-5 h-5" /> View Leaderboard
                </button>
              </div>
            ) : (
              <div className="space-y-4 mb-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-neon-purple uppercase tracking-wider flex items-center gap-2">
                    <Trophy className="w-5 h-5" /> Top Records
                  </h3>
                  {!isSaved && score > 0 && (
                    <button 
                      onClick={() => setShowLeaderboard(false)}
                      className="text-sm text-neon-blue hover:underline"
                    >
                      Save Mine
                    </button>
                  )}
                </div>
                
                {leaderboard.length === 0 ? (
                  <div className="text-gray-500 text-center py-8 font-mono">No records found.</div>
                ) : (
                  <div className="space-y-3">
                    {leaderboard.map((entry, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-black/40 rounded-lg border border-white/5">
                        <div className="flex items-center gap-3">
                          <span className={`font-black ${idx === 0 ? 'text-yellow-400' : idx === 1 ? 'text-gray-300' : idx === 2 ? 'text-orange-400' : 'text-gray-600'}`}>
                            #{idx + 1}
                          </span>
                          <span className="font-bold text-white truncate max-w-[120px]">{entry.name}</span>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="font-black text-neon-cyan">{entry.score}</span>
                          <span className="text-xs text-gray-500 font-mono">{entry.date}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 mt-auto">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => { playSound('tick'); onRestart(); }}
                className="py-4 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-sm md:text-base uppercase tracking-wider flex flex-col items-center justify-center gap-2 hover:bg-white/10 transition-all"
              >
                <RotateCcw className="w-5 h-5" />
                Retry
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => { playSound('tick'); onHome(); }}
                className="py-4 rounded-xl bg-gradient-to-r from-neon-blue to-neon-purple text-white font-bold text-sm md:text-base uppercase tracking-wider flex flex-col items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,243,255,0.3)] hover:shadow-[0_0_30px_rgba(188,19,254,0.5)] transition-all"
              >
                <HomeIcon className="w-5 h-5" />
                Menu
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
