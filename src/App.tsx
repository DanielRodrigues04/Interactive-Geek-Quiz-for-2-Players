import React, { useState, useEffect } from 'react';
import { Trophy, Gamepad2, ArrowRight } from 'lucide-react';
import { questions } from './questions';
import type { GameState, Player } from './types';

function App() {
  const [gameState, setGameState] = useState<GameState>({
    players: [],
    currentQuestion: 0,
    questions: questions, // Initialize with questions array
    gameOver: false
  });
  const [player1Name, setPlayer1Name] = useState('');
  const [player2Name, setPlayer2Name] = useState('');
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    if (gameStarted) {
      const shuffledQuestions = [...questions].sort(() => Math.random() - 0.5);
      setGameState({
        players: [
          { name: player1Name, score: 0, currentTurn: true },
          { name: player2Name, score: 0, currentTurn: false }
        ],
        currentQuestion: 0,
        questions: shuffledQuestions,
        gameOver: false
      });
    }
  }, [gameStarted, player1Name, player2Name]);

  const handleAnswer = (optionIndex: number) => {
    const currentQuestion = gameState.questions[gameState.currentQuestion];
    const currentPlayerIndex = gameState.players.findIndex(p => p.currentTurn);
    
    const newPlayers = [...gameState.players];
    if (optionIndex === currentQuestion.correctAnswer) {
      newPlayers[currentPlayerIndex].score += 100;
    }
    
    // Switch turns
    newPlayers[currentPlayerIndex].currentTurn = false;
    newPlayers[(currentPlayerIndex + 1) % 2].currentTurn = true;

    const isGameOver = gameState.currentQuestion === gameState.questions.length - 1;
    
    setGameState({
      ...gameState,
      players: newPlayers,
      currentQuestion: isGameOver ? gameState.currentQuestion : gameState.currentQuestion + 1,
      gameOver: isGameOver
    });
  };

  const startNewGame = () => {
    if (player1Name && player2Name) {
      setGameStarted(true);
    }
  };

  const resetGame = () => {
    setGameStarted(false);
    setPlayer1Name('');
    setPlayer2Name('');
    setGameState({
      players: [],
      currentQuestion: 0,
      questions: questions, // Reset with initial questions
      gameOver: false
    });
  };

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-700 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
          <div className="flex items-center justify-center mb-6">
            <Gamepad2 className="w-12 h-12 text-purple-600" />
          </div>
          <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Quiz Geek</h1>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Jogador 1
              </label>
              <input
                type="text"
                value={player1Name}
                onChange={(e) => setPlayer1Name(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Digite o nome"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Jogador 2
              </label>
              <input
                type="text"
                value={player2Name}
                onChange={(e) => setPlayer2Name(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Digite o nome"
              />
            </div>
            <button
              onClick={startNewGame}
              disabled={!player1Name || !player2Name}
              className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Começar Jogo
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (gameState.gameOver) {
    const winner = gameState.players.reduce((prev, current) => 
      prev.score > current.score ? prev : current
    );
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-700 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
          <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4 text-gray-800">Fim de Jogo!</h2>
          <p className="text-xl mb-6">
            Vencedor: <span className="font-bold text-purple-600">{winner.name}</span>
          </p>
          <div className="space-y-4">
            {gameState.players.map((player) => (
              <div key={player.name} className="bg-gray-50 p-4 rounded-lg">
                <p className="font-medium">{player.name}</p>
                <p className="text-2xl font-bold text-purple-600">{player.score} pontos</p>
              </div>
            ))}
          </div>
          <button
            onClick={resetGame}
            className="mt-8 bg-purple-600 text-white py-2 px-6 rounded-md hover:bg-purple-700 transition duration-200"
          >
            Jogar Novamente
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = gameState.questions[gameState.currentQuestion];
  const currentPlayer = gameState.players.find(p => p.currentTurn);

  // Add safety check for currentQuestion
  if (!currentQuestion) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-2xl w-full">
        <div className="flex justify-between mb-8">
          {gameState.players.map((player) => (
            <div
              key={player.name}
              className={`p-4 rounded-lg ${
                player.currentTurn ? 'bg-purple-100 border-2 border-purple-500' : 'bg-gray-50'
              }`}
            >
              <p className="font-medium">{player.name}</p>
              <p className="text-2xl font-bold text-purple-600">{player.score}</p>
            </div>
          ))}
        </div>
        
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-medium text-gray-500">
              Questão {gameState.currentQuestion + 1} de {gameState.questions.length}
            </span>
            <span className="text-sm font-medium text-purple-600">
              • {currentQuestion.category}
            </span>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-6">
            {currentQuestion.question}
          </h2>
          <div className="grid grid-cols-1 gap-4">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                className="text-left p-4 border-2 border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition duration-200"
              >
                <div className="flex items-center justify-between">
                  <span>{option}</span>
                  <ArrowRight className="w-5 h-5 text-gray-400" />
                </div>
              </button>
            ))}
          </div>
        </div>
        
        <div className="text-center text-gray-600">
          Vez de: <span className="font-bold text-purple-600">{currentPlayer?.name}</span>
        </div>
      </div>
    </div>
  );
}

export default App;