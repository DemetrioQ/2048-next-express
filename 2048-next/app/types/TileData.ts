export type TileData = {
    id: string;
    value: number;
    row: number;
    col: number;
    previousRow?: number;
    previousCol?: number;
    isMergingFrom?: boolean; 
    mergeDestination?: { row: number; col: number };
    isNew?: boolean;
    isMerged?: boolean;
    mergedFrom?: string[];
  };
  