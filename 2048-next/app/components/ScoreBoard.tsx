import React from 'react';

interface ScoreBoardProps {
  score: number;
  bestScore: number;
}

const ScoreBoard: React.FC<ScoreBoardProps> = ({ score, bestScore }) => {
    return (
      <div className="flex gap-4 mb-4">
        <div className="bg-[#bbada0] text-white rounded-lg px-4 py-2 text-center min-w-[100px]">
          <div className="text-xs uppercase tracking-wide">SCORE</div>
          <div className="text-2xl font-bold">{score}</div>
        </div>
        <div className="bg-[#bbada0] text-white rounded-lg px-4 py-2 text-center min-w-[100px]">
          <div className="text-xs uppercase tracking-wide">BEST</div>
          <div className="text-2xl font-bold">{bestScore}</div>
        </div>
        {/* ... */}
      </div>
    );
  };
export default ScoreBoard;
