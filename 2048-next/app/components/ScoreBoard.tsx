import React from 'react';

interface ScoreBoardProps {
  score: number;
  bestScore: number;
  undosLeft: number;
  resetGame: () => void
  onUndo: () => void
}

const ScoreBoard: React.FC<ScoreBoardProps> = ({ score, bestScore, undosLeft, resetGame, onUndo }) => {
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
      <button
        onClick={onUndo}
        disabled={undosLeft === 0}
        className={`w-full bg-[#d6cdc4] text-[#776e65] rounded py-2 px-4 transition-colors ${undosLeft > 0 ? 'hover:bg-[#c4b9ae]' : 'opacity-50 cursor-not-allowed'
          }`}
      >
        {undosLeft > 0 ? (
          `Undo (${undosLeft} left)`
        ) : (
          'Merge tiles to 128 to gain undos!'
        )}
      </button>
      <button
        onClick={resetGame}
        className="bg-[#8f7a66] text-white rounded-lg px-4 py-2 text-center hover:bg-[#9f8b77] transition-colors"
      >
        New Game
      </button>

    </div>
  );
};
export default ScoreBoard;
