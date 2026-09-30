export type Position = { x: number; y: number };
export type LevelDifficulty = "EASY" | "MEDIUM" | "HARD";

export interface LevelData {
  id: number;
  name?: string;
  difficulty: LevelDifficulty;
  grid: string[];
}