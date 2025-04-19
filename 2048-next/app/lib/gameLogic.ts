export const createEmptyGrid = () => Array(4).fill(null).map(() => Array(4).fill(null));

export const moveLeft = (grid: (number | null)[][]): (number | null)[][] => {
    return grid.map(row => {
      const filtered = row.filter(Boolean) as number[];
  
      const merged: (number | null)[] = [];
      let skip = false;
  
      for (let i = 0; i < filtered.length; i++) {
        if (skip) {
          skip = false;
          continue;
        }
  
        if (i + 1 < filtered.length && filtered[i] === filtered[i + 1]) {
          merged.push(filtered[i] * 2);
          skip = true;
        } else {
          merged.push(filtered[i]);
        }
      }
  
      while (merged.length < 4) {
        merged.push(null);
      }
  
      return merged;
    });
  };
  

  export const moveRight = (grid: (number | null)[][]): (number | null)[][] => {
    return grid.map(row => {
      const reversed = [...row].reverse();
      const merged = moveLeft([reversed])[0];
      return merged.reverse();
    });
  };
  

const transpose = (grid: (number | null)[][]): (number | null)[][] =>
  grid[0].map((_, colIndex) => grid.map(row => row[colIndex]));

export const moveUp = (grid: (number | null)[][]): (number | null)[][] => {
    const transposed = transpose(grid);
    const moved = transposed.map(row => moveLeft([row])[0]);
    return transpose(moved);
  };
  
export const moveDown = (grid: (number | null)[][]): (number | null)[][] => {
    const transposed = transpose(grid);
    const moved = transposed.map(row => moveRight([row])[0]);
    return transpose(moved);
  };
  

export const addSpecificTile = (
    grid: (number | null)[][],
    value: number
  ): (number | null)[][] => {
    const emptyCells: [number, number][] = [];
  
    grid.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell === null) emptyCells.push([rowIndex, colIndex]);
      });
    });
  
    if (emptyCells.length === 0) return grid;
  
    const [row, col] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const newGrid = [...grid.map(row => [...row])];
    newGrid[row][col] = value;
  
    return newGrid;
  };
