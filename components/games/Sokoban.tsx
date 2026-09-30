"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { ORIGINAL_PLUS_EXTRA_LEVELS } from "@/components/Sokoban/levels";

type Position = { x: number; y: number };

const LEVELS = ORIGINAL_PLUS_EXTRA_LEVELS;

// Función pura para parsear el mapa y encontrar la posición inicial del jugador
const parseLevel = (levelIdx: number) => {
  const rawMap = LEVELS[levelIdx]?.grid || [];
  let playerPos: Position = { x: 0, y: 0 };

  const grid = rawMap.map((rowStr, y) => {
    const row = rowStr.split("");
    row.forEach((char, x) => {
      if (char === "@" || char === "+") {
        playerPos = { x, y };
      }
    });
    return row;
  });

  return { grid, playerPos };
};

export default function SokobanGame() {
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);

  // Inicialización perezosa de estado basada en el nivel actual
  const [{ grid, playerPos }, setGameState] = useState(() =>
    parseLevel(0)
  );

  const [moves, setMoves] = useState(0);
  const [pushes, setPushes] = useState(0);
  const [history, setHistory] = useState<
    { grid: string[][]; playerPos: Position; moves: number; pushes: number }[]
  >([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Persistent AudioContext Ref
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Swipe gesture Ref
  const touchStartPosRef = useRef<{ x: number; y: number } | null>(null);

  const getAudioContext = useCallback(() => {
    if (typeof window === "undefined") return null;
    if (!audioCtxRef.current) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      if (AudioCtx) {
        audioCtxRef.current = new AudioCtx();
      }
    }
    if (audioCtxRef.current && audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  }, []);

  const playSound = useCallback(
    (type: "step" | "push" | "target" | "win") => {
      if (isMuted) return;
      try {
        const ctx = getAudioContext();
        if (!ctx) return;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        const now = ctx.currentTime;

        if (type === "step") {
          osc.type = "sine";
          osc.frequency.setValueAtTime(180, now);
          osc.frequency.exponentialRampToValueAtTime(100, now + 0.04);
          gain.gain.setValueAtTime(0.04, now);
          gain.gain.linearRampToValueAtTime(0.001, now + 0.04);
          osc.start(now);
          osc.stop(now + 0.04);
        } else if (type === "push") {
          osc.type = "triangle";
          osc.frequency.setValueAtTime(240, now);
          osc.frequency.exponentialRampToValueAtTime(120, now + 0.08);
          gain.gain.setValueAtTime(0.08, now);
          gain.gain.linearRampToValueAtTime(0.001, now + 0.08);
          osc.start(now);
          osc.stop(now + 0.08);
        } else if (type === "target") {
          osc.type = "square";
          osc.frequency.setValueAtTime(440, now);
          osc.frequency.exponentialRampToValueAtTime(880, now + 0.12);
          gain.gain.setValueAtTime(0.08, now);
          gain.gain.linearRampToValueAtTime(0.001, now + 0.12);
          osc.start(now);
          osc.stop(now + 0.12);
        } else if (type === "win") {
          osc.type = "triangle";
          osc.frequency.setValueAtTime(300, now);
          osc.frequency.setValueAtTime(400, now + 0.1);
          osc.frequency.setValueAtTime(500, now + 0.2);
          osc.frequency.setValueAtTime(600, now + 0.3);
          gain.gain.setValueAtTime(0.12, now);
          gain.gain.linearRampToValueAtTime(0.001, now + 0.45);
          osc.start(now);
          osc.stop(now + 0.45);
        }
      } catch (e) {
        console.error("Audio error", e);
      }
    },
    [isMuted, getAudioContext]
  );

  // Cargar un nivel y resetear los contadores
  const handleSelectLevel = useCallback((levelIdx: number) => {
    setCurrentLevelIndex(levelIdx);
    const parsed = parseLevel(levelIdx);
    setGameState(parsed);
    setMoves(0);
    setPushes(0);
    setHistory([]);
    setIsCompleted(false);
  }, []);

  // Verificar condición de victoria
  const checkWinCondition = (currentGrid: string[][]) => {
    for (let r = 0; r < currentGrid.length; r++) {
      for (let c = 0; c < currentGrid[r].length; c++) {
        if (currentGrid[r][c] === "$") {
          return false;
        }
      }
    }
    return true;
  };

  const movePlayer = useCallback(
    (dx: number, dy: number) => {
      if (isCompleted) return;
      getAudioContext();

      const newGrid = grid.map((row) => [...row]);
      const targetX = playerPos.x + dx;
      const targetY = playerPos.y + dy;

      if (
        targetY < 0 ||
        targetY >= newGrid.length ||
        targetX < 0 ||
        targetX >= newGrid[targetY].length
      ) {
        return;
      }

      const targetCell = newGrid[targetY][targetX];

      if (targetCell === "#") return;

      let isPushing = false;
      let nextBoxCell = "";
      const boxTargetX = targetX + dx;
      const boxTargetY = targetY + dy;

      if (targetCell === "$" || targetCell === "*") {
        isPushing = true;
        if (
          boxTargetY < 0 ||
          boxTargetY >= newGrid.length ||
          boxTargetX < 0 ||
          boxTargetX >= newGrid[boxTargetY].length
        ) {
          return;
        }

        nextBoxCell = newGrid[boxTargetY][boxTargetX];

        if (
          nextBoxCell === "#" ||
          nextBoxCell === "$" ||
          nextBoxCell === "*"
        ) {
          return;
        }
      }

      setHistory((prev) => [
        ...prev,
        {
          grid: grid.map((r) => [...r]),
          playerPos,
          moves,
          pushes,
        },
      ]);

      if (isPushing) {
        const isBoxOnGoal = nextBoxCell === ".";
        newGrid[boxTargetY][boxTargetX] = isBoxOnGoal ? "*" : "$";

        if (isBoxOnGoal) {
          playSound("target");
        } else {
          playSound("push");
        }
      } else {
        playSound("step");
      }

      const currentCell = newGrid[playerPos.y][playerPos.x];
      newGrid[playerPos.y][playerPos.x] = currentCell === "+" ? "." : " ";

      const isTargetGoal = targetCell === "." || targetCell === "*";
      newGrid[targetY][targetX] = isTargetGoal ? "+" : "@";

      setGameState({ grid: newGrid, playerPos: { x: targetX, y: targetY } });
      setMoves((m) => m + 1);
      if (isPushing) setPushes((p) => p + 1);

      if (checkWinCondition(newGrid)) {
        setIsCompleted(true);
        playSound("win");
      }
    },
    [
      grid,
      playerPos,
      moves,
      pushes,
      isCompleted,
      getAudioContext,
      playSound,
    ]
  );

  const handleUndo = useCallback(() => {
    if (history.length === 0 || isCompleted) return;
    getAudioContext();
    const lastState = history[history.length - 1];
    setGameState({ grid: lastState.grid, playerPos: lastState.playerPos });
    setMoves(lastState.moves);
    setPushes(lastState.pushes);
    setHistory((prev) => prev.slice(0, -1));
  }, [history, isCompleted, getAudioContext]);

  // Manejo de Teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        [
          "ArrowUp",
          "ArrowDown",
          "ArrowLeft",
          "ArrowRight",
          " ",
          "Enter",
        ].includes(e.key)
      ) {
        e.preventDefault();
      }

      getAudioContext();

      if (e.key === "u" || e.key === "U" || e.key === "z" || e.key === "Z") {
        handleUndo();
        return;
      }

      if (e.key === "r" || e.key === "R") {
        handleSelectLevel(currentLevelIndex);
        return;
      }

      if (e.key === "m" || e.key === "M") {
        setIsMuted((prev) => !prev);
        return;
      }

      switch (e.key) {
        case "ArrowUp":
        case "w":
        case "W":
          movePlayer(0, -1);
          break;
        case "ArrowDown":
        case "s":
        case "S":
          movePlayer(0, 1);
          break;
        case "ArrowLeft":
        case "a":
        case "A":
          movePlayer(-1, 0);
          break;
        case "ArrowRight":
        case "d":
        case "D":
          movePlayer(1, 0);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    movePlayer,
    handleUndo,
    handleSelectLevel,
    currentLevelIndex,
    getAudioContext,
  ]);

  // Controles Táctiles (Swipe)
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartPosRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartPosRef.current) return;
    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStartPosRef.current.x;
    const deltaY = touch.clientY - touchStartPosRef.current.y;
    const minSwipeDistance = 20;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (Math.abs(deltaX) > minSwipeDistance) {
        movePlayer(deltaX > 0 ? 1 : -1, 0);
      }
    } else {
      if (Math.abs(deltaY) > minSwipeDistance) {
        movePlayer(0, deltaY > 0 ? 1 : -1);
      }
    }
    touchStartPosRef.current = null;
  };

  const currentLevelData = LEVELS[currentLevelIndex];
  const maxCols = Math.max(...grid.map((r) => r.length), 1);

  return (
    <div className="my-4 p-4 bg-[#0d0e12] border border-zinc-800 rounded-xl text-xs font-mono select-none max-w-fit mx-auto shadow-2xl text-zinc-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 text-zinc-400 border-b border-zinc-800/80 pb-2 gap-4">
        <div className="flex items-center gap-2 font-bold text-zinc-200">
          <span className="tracking-wider">SOKOBAN TERMINAL</span>
          <span className="text-[10px] bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded">
            Lvl {currentLevelIndex + 1}/{LEVELS.length} ({currentLevelData?.difficulty})
          </span>
        </div>

        <div className="flex items-center gap-4">
          <span>
            Moves: <strong className="text-emerald-400 font-bold">{moves}</strong>
          </span>
          <span>
            Pushes: <strong className="text-purple-400 font-bold">{pushes}</strong>
          </span>

          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-1 text-zinc-500 hover:text-zinc-200 transition-colors"
            title={isMuted ? "Unmute (M)" : "Mute (M)"}
          >
            {isMuted ? (
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M3.63 3.63a.996.996 0 00-1.41 0 .996.996 0 000 1.41l4.07 4.07H3c-.55 0-1 .45-1 1v6c0 .55.45 1 1 1h4l5 5c.67.67 1.81.2 1.81-.75v-3.88l4.47 4.47c-.52.33-1.09.61-1.7.82-.41.14-.68.52-.68.95 0 .66.62 1.18 1.26.96.92-.32 1.78-.77 2.57-1.32l1.63 1.63a.996.996 0 001.41 0 .996.996 0 000-1.41L3.63 3.63zM12 4c0-.95-1.14-1.42-1.81-.75L7.29 6.16l4.71 4.71V4zm7 8c0-1.77-.77-3.29-2-4.3-.43-.37-1.07-.3-1.42.13-.33.41-.26 1.01.13 1.35.8.68 1.29 1.66 1.29 2.82 0 .58-.13 1.12-.34 1.62l1.55 1.55C18.73 14.28 19 13.18 19 12z" />
              </svg>
            ) : (
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-.77-3.29-2-4.3-.43-.37-1.07-.3-1.42.13-.33.41-.26 1.01.13 1.35.8.68 1.29 1.66 1.29 2.82s-.49 2.14-1.29 2.82c-.39.34-.46.94-.13 1.35.35.43.99.5 1.42.13 1.23-1.01 2-2.53 2-4.3z" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Selector Desplegable de Niveles y Botones Anterior/Siguiente */}
      <div className="flex justify-between items-center mb-3 gap-2">
        <div className="flex items-center gap-1">
          <button
            onClick={() => handleSelectLevel(Math.max(0, currentLevelIndex - 1))}
            disabled={currentLevelIndex === 0}
            className="px-2 py-0.5 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-400 border border-zinc-800 rounded text-[10px] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            &lt;
          </button>

          <select
            value={currentLevelIndex}
            onChange={(e) => handleSelectLevel(Number(e.target.value))}
            className="bg-zinc-900/80 border border-zinc-800 text-zinc-300 text-[10px] rounded px-2 py-0.5 outline-none cursor-pointer hover:border-zinc-700 transition-colors"
          >
            {LEVELS.map((lvl, idx) => (
              <option key={idx} value={idx}>
                Lvl {idx + 1} - {lvl.name} ({lvl.difficulty})
              </option>
            ))}
          </select>

          <button
            onClick={() => handleSelectLevel(Math.min(LEVELS.length - 1, currentLevelIndex + 1))}
            disabled={currentLevelIndex === LEVELS.length - 1}
            className="px-2 py-0.5 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-400 border border-zinc-800 rounded text-[10px] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            &gt;
          </button>
        </div>

        <div className="flex gap-1">
          <button
            onClick={handleUndo}
            disabled={history.length === 0 || isCompleted}
            className="px-2 py-0.5 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-400 border border-zinc-800 rounded text-[10px] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            Undo
          </button>
          <button
            onClick={() => handleSelectLevel(currentLevelIndex)}
            className="px-2 py-0.5 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-400 border border-zinc-800 rounded text-[10px] transition-all"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Rejilla / Tablero Sokoban */}
      <div
        className="relative touch-none flex justify-center items-center bg-black/80 p-2 border border-zinc-800 rounded min-h-[220px]"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="grid gap-0.5"
          style={{
            gridTemplateColumns: `repeat(${maxCols}, minmax(0, 1fr))`,
          }}
        >
          {grid.map((row, rIdx) =>
            Array.from({ length: maxCols }).map((_, cIdx) => {
              const char = row[cIdx] || " ";

              let cellStyle = "bg-transparent";
              let childComponent: React.ReactNode = null;

              if (char === "#") {
                cellStyle = "bg-zinc-800 border border-zinc-700/60 rounded-[2px]";
              } else if (char === " ") {
                cellStyle = "bg-zinc-950/40";
              } else if (char === ".") {
                cellStyle = "bg-zinc-900/90 border border-amber-500/20 rounded-[2px]";
                childComponent = (
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500/70" />
                );
              } else if (char === "$") {
                cellStyle = "bg-amber-700/80 border border-amber-500 shadow-md shadow-amber-900/40 rounded-[2px]";
                childComponent = (
                  <div className="w-2.5 h-2.5 border border-amber-400/60 rounded-[1px]" />
                );
              } else if (char === "*") {
                cellStyle = "bg-emerald-600 border border-emerald-400 shadow-md shadow-emerald-900/50 rounded-[2px]";
                childComponent = (
                  <svg className="w-3 h-3 text-emerald-100 fill-current" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                );
              } else if (char === "@" || char === "+") {
                cellStyle = "bg-indigo-600 border border-indigo-400 shadow-md shadow-indigo-900/50 rounded-[2px]";
                childComponent = (
                  <div className="w-2 h-2 rounded-full bg-indigo-100" />
                );
              }

              return (
                <div
                  key={`${rIdx}-${cIdx}`}
                  className={`w-5 h-5 sm:w-6 sm:h-6 transition-all duration-75 flex items-center justify-center ${cellStyle}`}
                >
                  {childComponent}
                </div>
              );
            })
          )}
        </div>

        {/* Level Complete Overlay */}
        {isCompleted && (
          <div className="absolute inset-0 bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center rounded p-2 text-center">
            <span className="text-emerald-400 font-bold text-base tracking-widest mb-1">
              LEVEL CLEARED
            </span>
            <span className="text-zinc-400 text-[11px] mb-3">
              Moves: {moves} | Pushes: {pushes}
            </span>
            {currentLevelIndex < LEVELS.length - 1 ? (
              <button
                onClick={() => handleSelectLevel(currentLevelIndex + 1)}
                className="px-4 py-1.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded hover:bg-emerald-500/30 transition-all font-semibold active:scale-95"
              >
                Next Level
              </button>
            ) : (
              <span className="text-amber-400 font-bold text-xs">
                ALL LEVELS COMPLETED
              </span>
            )}
          </div>
        )}
      </div>

      {/* Controles Táctiles Auxiliares */}
      <div className="mt-4 flex flex-col items-center gap-1 sm:hidden border-t border-zinc-800 pt-3">
        <button
          onClick={() => movePlayer(0, -1)}
          className="w-10 h-10 bg-zinc-800 active:bg-indigo-600 rounded flex items-center justify-center text-zinc-300 font-bold"
        >
          &uarr;
        </button>
        <div className="flex gap-4">
          <button
            onClick={() => movePlayer(-1, 0)}
            className="w-10 h-10 bg-zinc-800 active:bg-indigo-600 rounded flex items-center justify-center text-zinc-300 font-bold"
          >
            &larr;
          </button>
          <button
            onClick={handleUndo}
            disabled={history.length === 0 || isCompleted}
            className="w-10 h-10 bg-zinc-900 border border-zinc-700 active:bg-zinc-800 rounded flex items-center justify-center text-xs text-zinc-400 disabled:opacity-40"
          >
            Undo
          </button>
          <button
            onClick={() => movePlayer(1, 0)}
            className="w-10 h-10 bg-zinc-800 active:bg-indigo-600 rounded flex items-center justify-center text-zinc-300 font-bold"
          >
            &rarr;
          </button>
        </div>
        <button
          onClick={() => movePlayer(0, 1)}
          className="w-10 h-10 bg-zinc-800 active:bg-indigo-600 rounded flex items-center justify-center text-zinc-300 font-bold"
        >
          &darr;
        </button>
        <span className="text-[9px] text-zinc-600 mt-1">
          You can also swipe on the screen
        </span>
      </div>

      {/* Atajos Teclado */}
      <div className="hidden sm:flex justify-between items-center text-zinc-500 text-[10px] mt-3 border-t border-zinc-800/80 pt-2">
        <span>WASD / Arrows : Move</span>
        <span>U / Z : Undo</span>
        <span>R : Restart</span>
        <span>M : Mute</span>
      </div>
    </div>
  );
}