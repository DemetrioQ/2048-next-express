import React, { useState } from 'react';
import AnimatedNumber from '@/components/AnimatedNumber';
import { useFlash } from '@/hooks/useFlash';
import { Undo2, RotateCcw } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface ScoreBoardProps {
  score: number;
  bestScore: number;
  undosLeft: number;
  maxUndos: number;
  resetGame: () => void
  onUndo: () => void
}

const SCORE_BG = '#bbada0';
const SCORE_BG_FLASH = '#a39787';

const ScoreBoard: React.FC<ScoreBoardProps> = ({ score, bestScore, undosLeft, maxUndos, resetGame, onUndo }) => {
  const scoreFlash = useFlash(score);
  const bestFlash = useFlash(bestScore);
  const [confirmReset, setConfirmReset] = useState(false);

  const handleResetClick = () => {
    if (score === 0) {
      resetGame();
      return;
    }
    setConfirmReset(true);
  };

  const handleConfirmReset = () => {
    setConfirmReset(false);
    resetGame();
  };

  const undoTitle = undosLeft > 0
    ? `Undo (${undosLeft} of ${maxUndos} left)`
    : 'Merge tiles to 128 to earn an undo';

  return (
    <>
      <div className="mb-4 w-full">
        {/* Score row */}
        <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-2 sm:mb-3">
          <div
            className="text-white rounded-lg px-4 py-2 text-center"
            style={{ backgroundColor: scoreFlash ? SCORE_BG_FLASH : SCORE_BG, transition: 'background-color 200ms' }}
          >
            <div className="text-xs uppercase tracking-wide">SCORE</div>
            <div className="text-2xl font-bold"><AnimatedNumber value={score} /></div>
          </div>
          <div
            className="text-white rounded-lg px-4 py-2 text-center"
            style={{ backgroundColor: bestFlash ? SCORE_BG_FLASH : SCORE_BG, transition: 'background-color 200ms' }}
          >
            <div className="text-xs uppercase tracking-wide">BEST</div>
            <div className="text-2xl font-bold"><AnimatedNumber value={bestScore} /></div>
          </div>
        </div>

        {/* Actions row */}
        <div className="grid grid-cols-2 gap-2 sm:gap-4 items-start">
          <div className="flex flex-col items-center gap-1.5">
            <button
              onClick={onUndo}
              disabled={undosLeft === 0}
              title={undoTitle}
              className={`w-full bg-[#d6cdc4] text-[#776e65] rounded-lg py-3 px-4 text-sm sm:text-base font-medium transition-colors flex items-center justify-center gap-2 whitespace-nowrap ${undosLeft > 0 ? 'hover:bg-[#c4b9ae]' : 'opacity-60 cursor-not-allowed'
                }`}
            >
              <Undo2 className="w-4 h-4" />
              <span className="hidden sm:inline">Undo</span>
              <span className="sr-only">{undoTitle}</span>
            </button>
            <span className="flex items-center gap-1.5" aria-hidden="true">
              {Array.from({ length: maxUndos }).map((_, i) => (
                <span
                  key={i}
                  className="w-2 h-2 rounded-full transition-colors"
                  style={{ backgroundColor: i < undosLeft ? '#776e65' : 'rgba(119, 110, 101, 0.25)' }}
                />
              ))}
            </span>
          </div>
          <button
            onClick={handleResetClick}
            title="New Game"
            className="w-full bg-[#8f7a66] text-white rounded-lg py-3 px-4 text-sm sm:text-base font-medium hover:bg-[#9f8b77] transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline">New Game</span>
            <span className="sr-only sm:hidden">New Game</span>
          </button>
        </div>
      </div>

      <Dialog open={confirmReset} onOpenChange={setConfirmReset}>
        <DialogContent className="max-w-sm rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-center">Start a new game?</DialogTitle>
            <DialogDescription className="text-center">
              Your current progress will be lost.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 mt-2">
            <Button variant="ghost" onClick={() => setConfirmReset(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmReset}>
              <RotateCcw className="w-4 h-4" />
              New Game
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
export default ScoreBoard;
