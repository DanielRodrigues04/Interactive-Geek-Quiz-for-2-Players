export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  category: string;
}

export interface Player {
  name: string;
  score: number;
  currentTurn: boolean;
}

export interface GameState {
  players: Player[];
  currentQuestion: number;
  questions: Question[];
  gameOver: boolean;
}