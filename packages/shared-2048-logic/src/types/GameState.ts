import { GameHistory } from "./GameHistory";
import { TileData } from "./TileData";

export type GameState =  {
  tiles: TileData[];
  score: number;
  moves: number;
  undosLeft: number;
  undoHistory: GameHistory[];
  gameOver: boolean;
}

