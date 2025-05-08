export const getTileColor = (value: number): string => {
  const colors: Record<number, string> = {
    2: '#eee4da',
    4: '#ede0c8',
    8: '#f2b179',
    16: '#f59563',
    32: '#f67c5f',
    64: '#f65e3b',
    128: '#edcf72',
    256: '#edcc61',
    512: '#edc850',
    1024: '#edc53f',
    2048: '#edc22e',
  };
  return colors[value] || '#3c3a32';
};

export const getTileStyle = (value: number): React.CSSProperties => {
  return {
    color: value <= 4 ? '#776e65' : '#f9f6f2',
    fontSize: value >= 1024 ? 20 : 24,
  };
};
