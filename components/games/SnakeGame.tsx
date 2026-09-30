"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";

const BOARD_SIZE = 20;

type Position = { x: number; y: number };
type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";
type Difficulty = "EASY" | "MEDIUM" | "HARD";

const SPEEDS: Record<Difficulty, number> = {
  EASY: 160,
  MEDIUM: 110,
  HARD: 70,
};

const INITIAL_SNAKE: Position[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];

const generateFood = (snake: Position[], currentFood?: Position): Position => {
  let newFood: Position;
  while (true) {
    newFood = {
      x: Math.floor(Math.random() * BOARD_SIZE),
      y: Math.floor(Math.random() * BOARD_SIZE),
    };
    const isOnSnake = snake.some((segment) => segment.x === newFood.x && segment.y === newFood.y);
    const isSameAsCurrent = currentFood && newFood.x === currentFood.x && newFood.y === currentFood.y;
    if (!isOnSnake && !isSameAsCurrent) break;
  }
  return newFood;
};

// --- Sintetizador de Sonidos con Web Audio API ---
const playSound = (type: "eat" | "bonus" | "gameover" | "pause", muted: boolean) => {
  if (muted || typeof window === "undefined") return;
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;

    if (type === "eat") {
      osc.type = "square";
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(600, now + 0.08);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.08);
      osc.start(now);
      osc.stop(now + 0.08);
    } else if (type === "bonus") {
      osc.type = "triangle";
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.15);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.15);
      osc.start(now);
      osc.stop(now + 0.15);
    } else if (type === "gameover") {
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(60, now + 0.3);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.3);
      osc.start(now);
      osc.stop(now + 0.3);
    } else if (type === "pause") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(400, now);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.05);
      osc.start(now);
      osc.stop(now + 0.05);
    }
  } catch (e) {
    console.error("Audio error", e);
  }
};

export default function SnakeGame() {
  const [snake, setSnake] = useState<Position[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Position>(() => generateFood(INITIAL_SNAKE));
  const [bonusFood, setBonusFood] = useState<Position | null>(null);
  const [bonusTimer, setBonusTimer] = useState<number>(0);
  const [score, setScore] = useState(0);
  const [difficulty, setDifficulty] = useState<Difficulty>("MEDIUM");
  const [isMuted, setIsMuted] = useState(false);
  const [highScore, setHighScore] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("snake_highscore");
      return saved ? parseInt(saved, 10) : 0;
    }
    return 0;
  });
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Referencias para control preciso de la dirección y buffer de entradas
  const directionRef = useRef<Direction>("UP");
  const inputQueueRef = useRef<Direction[]>([]);
  const foodEatenCountRef = useRef<number>(0);

  const addScore = useCallback((points: number) => {
    setScore((prev) => {
      const newScore = prev + points;
      setHighScore((prevHigh) => {
        if (newScore > prevHigh) {
          if (typeof window !== "undefined") {
            localStorage.setItem("snake_highscore", newScore.toString());
          }
          return newScore;
        }
        return prevHigh;
      });
      return newScore;
    });
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    directionRef.current = "UP";
    inputQueueRef.current = [];
    foodEatenCountRef.current = 0;
    setFood(generateFood(INITIAL_SNAKE));
    setBonusFood(null);
    setBonusTimer(0);
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
  };

  const handleDirectionChange = useCallback((newDir: Direction) => {
    const lastDir = inputQueueRef.current.length > 0 
      ? inputQueueRef.current[inputQueueRef.current.length - 1] 
      : directionRef.current;

    const isOpposite =
      (newDir === "UP" && lastDir === "DOWN") ||
      (newDir === "DOWN" && lastDir === "UP") ||
      (newDir === "LEFT" && lastDir === "RIGHT") ||
      (newDir === "RIGHT" && lastDir === "LEFT");

    if (!isOpposite && lastDir !== newDir && inputQueueRef.current.length < 2) {
      inputQueueRef.current.push(newDir);
    }
  }, []);

  const moveSnake = useCallback(() => {
    if (gameOver || isPaused) return;

    // Procesar la siguiente dirección válida de la cola
    if (inputQueueRef.current.length > 0) {
      directionRef.current = inputQueueRef.current.shift()!;
    }

    setSnake((prevSnake) => {
      const head = { ...prevSnake[0] };

      switch (directionRef.current) {
        case "UP":
          head.y -= 1;
          break;
        case "DOWN":
          head.y += 1;
          break;
        case "LEFT":
          head.x -= 1;
          break;
        case "RIGHT":
          head.x += 1;
          break;
      }

      // 1. Colisión con bordes
      if (
        head.x < 0 ||
        head.x >= BOARD_SIZE ||
        head.y < 0 ||
        head.y >= BOARD_SIZE
      ) {
        setGameOver(true);
        playSound("gameover", isMuted);
        return prevSnake;
      }

      // 2. Comer alimento normal
      const ateFood = head.x === food.x && head.y === food.y;
      
      // 3. Colisión con el propio cuerpo (sin incluir la cola que se retira si no ha comido)
      const bodyToCheck = ateFood ? prevSnake : prevSnake.slice(0, -1);
      if (bodyToCheck.some((segment) => segment.x === head.x && segment.y === head.y)) {
        setGameOver(true);
        playSound("gameover", isMuted);
        return prevSnake;
      }

      const newSnake = [head, ...prevSnake];

      if (ateFood) {
        addScore(10);
        playSound("eat", isMuted);
        foodEatenCountRef.current += 1;

        // Generar fruta de bonificación cada 5 comidas normales
        if (foodEatenCountRef.current % 5 === 0 && !bonusFood) {
          const bFood = generateFood(newSnake, food);
          setBonusFood(bFood);
          setBonusTimer(25); // Dura 25 ticks del juego
        }

        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }

      // 4. Comer alimento de bonificación
      if (bonusFood && head.x === bonusFood.x && head.y === bonusFood.y) {
        addScore(30);
        playSound("bonus", isMuted);
        setBonusFood(null);
        setBonusTimer(0);
      }

      return newSnake;
    });

    // Control del temporizador de la fruta especial
    setBonusTimer((prev) => {
      if (prev <= 1) {
        setBonusFood(null);
        return 0;
      }
      return prev - 1;
    });
  }, [addScore, bonusFood, food, gameOver, isMuted, isPaused]);

  // Bucle principal
  useEffect(() => {
    if (gameOver || isPaused) return;

    // Aumenta progresivamente la velocidad con la puntuación
    const speed = Math.max(40, SPEEDS[difficulty] - Math.floor(score / 50) * 5);
    const interval = setInterval(moveSnake, speed);

    return () => clearInterval(interval);
  }, [moveSnake, gameOver, isPaused, score, difficulty]);

  // Manejador de eventos de teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " ", "Enter"].includes(e.key)) {
        e.preventDefault();
      }

      if (gameOver) {
        if (e.key === " " || e.key === "Enter") {
          resetGame();
        }
        return;
      }

      switch (e.key) {
        case "ArrowUp":
        case "w":
        case "W":
          handleDirectionChange("UP");
          break;
        case "ArrowDown":
        case "s":
        case "S":
          handleDirectionChange("DOWN");
          break;
        case "ArrowLeft":
        case "a":
        case "A":
          handleDirectionChange("LEFT");
          break;
        case "ArrowRight":
        case "d":
        case "D":
          handleDirectionChange("RIGHT");
          break;
        case "p":
        case "P":
        case " ":
          setIsPaused((prev) => {
            playSound("pause", isMuted);
            return !prev;
          });
          break;
        case "m":
        case "M":
          setIsMuted((prev) => !prev);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameOver, handleDirectionChange, isMuted]);

  return (
    <div className="my-4 p-4 bg-[#0d0e12] border border-zinc-800 rounded-xl text-xs font-mono select-none max-w-fit mx-auto shadow-2xl text-zinc-300">
      {/* Encabezado */}
      <div className="flex items-center justify-between mb-3 text-zinc-400 border-b border-zinc-800/80 pb-2 gap-4">
        <div className="flex items-center gap-2 font-bold text-zinc-200">
          <span>🐍 TERMINAL SNAKE</span>
        </div>

        <div className="flex items-center gap-4">
          <span>Score: <strong className="text-emerald-400 font-bold">{score}</strong></span>
          <span>Top: <strong className="text-purple-400 font-bold">{highScore}</strong></span>
          
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-1 text-zinc-500 hover:text-zinc-200 transition-colors"
            title={isMuted ? "Unmute (M)" : "Mute (M)"}
          >
            {isMuted ? "🔇" : "🔊"}
          </button>
        </div>
      </div>

      {/* Dificultad y Estado */}
      <div className="flex justify-between items-center mb-3">
        <div className="flex gap-1 bg-zinc-900/80 p-1 rounded border border-zinc-800">
          {(["EASY", "MEDIUM", "HARD"] as Difficulty[]).map((d) => (
            <button
              key={d}
              onClick={() => {
                setDifficulty(d);
                resetGame();
              }}
              className={`px-2 py-0.5 rounded text-[10px] transition-all font-semibold ${
                difficulty === d
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              {d}
            </button>
          ))}
        </div>

        {bonusTimer > 0 && (
          <div className="text-[10px] text-amber-400 animate-pulse font-bold">
            ⭐ BONUS: {bonusTimer}
          </div>
        )}
      </div>

      {/* Tablero de Juego */}
      <div className="relative">
        <div
          className="bg-black/80 p-1 border border-zinc-800 rounded grid gap-0.5"
          style={{
            gridTemplateColumns: `repeat(${BOARD_SIZE}, minmax(0, 1fr))`,
          }}
        >
          {Array.from({ length: BOARD_SIZE * BOARD_SIZE }).map((_, index) => {
            const x = index % BOARD_SIZE;
            const y = Math.floor(index / BOARD_SIZE);

            const isHead = snake[0].x === x && snake[0].y === y;
            const isBody = snake.slice(1).some((s) => s.x === x && s.y === y);
            const isFood = food.x === x && food.y === y;
            const isBonus = bonusFood && bonusFood.x === x && bonusFood.y === y;

            let cellStyle = "bg-zinc-900/40";
            if (isHead) {
              cellStyle = "bg-emerald-400 shadow-md shadow-emerald-400/50 rounded-[2px]";
            } else if (isBody) {
              cellStyle = "bg-emerald-600/80 rounded-[1px]";
            } else if (isBonus) {
              cellStyle = "bg-amber-400 animate-bounce rounded-full shadow-md shadow-amber-400/50";
            } else if (isFood) {
              cellStyle = "bg-red-500 animate-pulse rounded-full shadow-md shadow-red-500/50";
            }

            return (
              <div
                key={index}
                className={`w-4 h-4 sm:w-5 sm:h-5 transition-all duration-75 ${cellStyle}`}
              />
            );
          })}
        </div>

        {/* Overlay de Pausa */}
        {isPaused && !gameOver && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center rounded">
            <span className="text-amber-400 font-bold text-sm tracking-widest animate-pulse">PAUSED</span>
            <span className="text-zinc-500 text-[10px] mt-1">Press P or SPACE to resume</span>
          </div>
        )}

        {/* Overlay de Game Over */}
        {gameOver && (
          <div className="absolute inset-0 bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center rounded p-2 text-center">
            <span className="text-red-500 font-bold text-base tracking-widest mb-1">GAME OVER</span>
            <span className="text-zinc-400 text-[11px] mb-3">Final Score: {score}</span>
            <button
              onClick={resetGame}
              className="px-4 py-1.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded hover:bg-emerald-500/30 transition-all font-semibold active:scale-95"
            >
              Play Again [SPACE]
            </button>
          </div>
        )}
      </div>

      {/* Controles Táctiles Móviles */}
      <div className="mt-4 flex flex-col items-center gap-1 sm:hidden border-t border-zinc-800 pt-3">
        <button
          onClick={() => handleDirectionChange("UP")}
          className="w-10 h-10 bg-zinc-800 active:bg-emerald-600 rounded flex items-center justify-center text-lg font-bold"
        >
          ▲
        </button>
        <div className="flex gap-4">
          <button
            onClick={() => handleDirectionChange("LEFT")}
            className="w-10 h-10 bg-zinc-800 active:bg-emerald-600 rounded flex items-center justify-center text-lg font-bold"
          >
            ◀
          </button>
          <button
            onClick={() => setIsPaused((prev) => !prev)}
            className="w-10 h-10 bg-zinc-900 border border-zinc-700 active:bg-zinc-800 rounded flex items-center justify-center text-xs text-zinc-400"
          >
            {isPaused ? "▶" : "❚❚"}
          </button>
          <button
            onClick={() => handleDirectionChange("RIGHT")}
            className="w-10 h-10 bg-zinc-800 active:bg-emerald-600 rounded flex items-center justify-center text-lg font-bold"
          >
            ▶
          </button>
        </div>
        <button
          onClick={() => handleDirectionChange("DOWN")}
          className="w-10 h-10 bg-zinc-800 active:bg-emerald-600 rounded flex items-center justify-center text-lg font-bold"
        >
          ▼
        </button>
      </div>

      {/* Instrucciones en Desktop */}
      <div className="hidden sm:flex justify-between items-center text-zinc-500 text-[10px] mt-3 border-t border-zinc-800/80 pt-2">
        <span>WASD / Arrow keys : Move</span>
        <span>P / SPACE : Pause</span>
        <span>M : Sound</span>
      </div>
    </div>
  );
}