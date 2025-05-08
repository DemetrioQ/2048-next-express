import { TileData } from "./TileData";

export type MoveResult =  {
  tiles: TileData[];
  score: number;
  moved: boolean;
}