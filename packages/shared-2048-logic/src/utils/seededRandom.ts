import seedrandom from "seedrandom";

export function getRng(seed: string) {
  return seedrandom(seed);
}



export function generateSeed(): [string, seedrandom.PRNG] {
  const seed = crypto.randomUUID(); // or Date.now().toString()
  const rng = seedrandom(seed);

  return [seed, rng]
}

