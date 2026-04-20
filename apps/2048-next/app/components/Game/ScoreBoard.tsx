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
    <div className="grid grid-cols-2 gap-2 sm:flex sm:gap-4 mb-4">
      <div className="bg-[#bbada0] text-white rounded-lg px-4 py-2 text-center sm:min-w-[100px]">
        <div className="text-xs uppercase tracking-wide">SCORE</div>
        <div className="text-2xl font-bold">{score}</div>
      </div>
      <div className="bg-[#bbada0] text-white rounded-lg px-4 py-2 text-center sm:min-w-[100px]">
        <div className="text-xs uppercase tracking-wide">BEST</div>
        <div className="text-2xl font-bold">{bestScore}</div>
      </div>
      <button
        onClick={onUndo}
        disabled={undosLeft === 0}
        className={`w-full bg-[#d6cdc4] text-[#776e65] rounded py-2 px-3 text-sm sm:text-base transition-colors ${undosLeft > 0 ? 'hover:bg-[#c4b9ae]' : 'opacity-50 cursor-not-allowed'
          }`}
      >
        {undosLeft > 0 ? (
          <>
            <span className="hidden sm:inline">Undo ({undosLeft} left)</span>
            <span className="sm:hidden">Undo ({undosLeft})</span>
          </>
        ) : (
          <>
            <span className="hidden sm:inline">Merge tiles to 128 to gain undos!</span>
            <span className="sm:hidden">Undo</span>
          </>
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
