import { Direction } from "./Direction";
import { TileData } from "./TileData";

export type  TileMove = {
  type: 'init' | 'move'
  move: Direction | undefined;
  spawnedTile: TileData
}