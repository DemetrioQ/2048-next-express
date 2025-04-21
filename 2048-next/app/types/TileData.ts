export type TileData = {
    id: string;
    value: number;
    row: number;
    col: number;
    isNew?: boolean;
    isMerged?: boolean;
    mergedFrom?: string[];
  };
  