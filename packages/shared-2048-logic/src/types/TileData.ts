export type TileData = {
    id: string;
    value: number;
    kind?: string;
    row: number;
    col: number;
    isNew?: boolean;
    isMerged?: boolean;
    mergedFrom?: string[];
  };
