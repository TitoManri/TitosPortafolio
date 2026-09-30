"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;

type Board = (string | null)[][];

interface Tetromino {
  shape: number[][];
  color: string;
}

interface Piece {
  type: string;
  shape: number[][];
  color: string;
  x: number;
  y: number;
  rotation: number;
}

const TETROMINOS: Record<string, Tetromino> = {
  I: { shape: [[0,0,0,0], [1,1,1,1], [0,0,0,0], [0,0,0,0]], color: "bg-cyan-500 shadow-cyan-500/50" },
  J: { shape: [[1,0,0], [1,1,1], [0,0,0]], color: "bg-blue-500 shadow-blue-500/50" },
  L: { shape: [[0,0,1], [1,1,1], [0,0,0]], color: "bg-orange-500 shadow-orange-500/50" },
  O: { shape: [[1,1], [1,1]], color: "bg-yellow-500 shadow-yellow-500/50" },
  S: { shape: [[0,1,1], [1,1,0], [0,0,0]], color: "bg-green-500 shadow-green-500/50" },
  T: { shape: [[0,1,0], [1,1,1], [0,0,0]], color: "bg-purple-500 shadow-purple-500/50" },
  Z: { shape: [[1,1,0], [0,1,1], [0,0,0]], color: "bg-red-500 shadow-red-500/50" },
};

const createEmptyBoard = (): Board =>
  Array.from({ length: BOARD_HEIGHT }, () => Array(BOARD_WIDTH).fill(null));

const generateBag = (): string[] => {
  const keys = Object.keys(TETROMINOS);
  for (let i = keys.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [keys[i], keys[j]] = [keys[j], keys[i]];
  }
  return keys;
};

const getSpeedForLevel = (level: number): number => {
  return Math.max(50, Math.floor(1000 * Math.pow(0.8, level - 1)));
};

class SoundEffects {
  private ctx: AudioContext | null = null;
  public isMuted: boolean = false;

  private initCtx() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
  }

  playMove() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "square";
    osc.frequency.setValueAtTime(150, this.ctx.currentTime);
    gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.05);
  }

  playDrop() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(300, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(80, this.ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.1);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.1);
  }

  playClear() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, i) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + i * 0.06);
      gain.gain.setValueAtTime(0.1, this.ctx.currentTime + i * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + i * 0.06 + 0.1);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(this.ctx.currentTime + i * 0.06);
      osc.stop(this.ctx.currentTime + i * 0.06 + 0.1);
    });
  }

  playGameOver() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(200, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(50, this.ctx.currentTime + 0.4);
    gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.4);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.4);
  }
}

const sfx = new SoundEffects();

export default function TetrisGame() {
  const [board, setBoard] = useState<Board>(createEmptyBoard);
  const [score, setScore] = useState(0);

  const [highScore, setHighScore] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("tetris_highscore");
      return saved ? parseInt(saved, 10) : 0;
    }
    return 0;
  });

  const [lines, setLines] = useState(0);
  const [level, setLevel] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [actionText, setActionText] = useState<string | null>(null);
  const [clearingRows, setClearingRows] = useState<number[]>([]);

  const addScore = useCallback((points: number) => {
    setScore((prevScore) => {
      const newScore = prevScore + points;
      setHighScore((prevHigh) => {
        if (newScore > prevHigh) {
          if (typeof window !== "undefined") {
            localStorage.setItem("tetris_highscore", newScore.toString());
          }
          return newScore;
        }
        return prevHigh;
      });
      return newScore;
    });
  }, []);

  const [bag, setBag] = useState<string[]>(() => [...generateBag(), ...generateBag()]);
  const [holdPieceType, setHoldPieceType] = useState<string | null>(null);
  const [canHold, setCanHold] = useState(true);

  const lastMoveWasRotateRef = useRef<boolean>(false);
  const lockTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lockResetsRef = useRef(0);
  const MAX_LOCK_RESETS = 15;

  const popNextPiece = useCallback((): { nextType: string; remainingBag: string[] } => {
    let currentBag = [...bag];
    if (currentBag.length <= 7) {
      currentBag = [...currentBag, ...generateBag()];
    }
    const nextType = currentBag[0];
    const remainingBag = currentBag.slice(1);
    setBag(remainingBag);
    return { nextType, remainingBag };
  }, [bag]);

  const [piece, setPiece] = useState<Piece>(() => {
    const initialBag = generateBag();
    const first = initialBag[0];
    return {
      type: first,
      shape: TETROMINOS[first].shape,
      color: TETROMINOS[first].color,
      x: 3,
      y: 0,
      rotation: 0,
    };
  });

  const checkCollision = useCallback(
    (shape: number[][], offsetX: number, offsetY: number, currentBoard: Board) => {
      for (let r = 0; r < shape.length; r++) {
        for (let c = 0; c < shape[r].length; c++) {
          if (shape[r][c] !== 0) {
            const newX = offsetX + c;
            const newY = offsetY + r;

            if (newX < 0 || newX >= BOARD_WIDTH || newY >= BOARD_HEIGHT) {
              return true;
            }
            if (newY >= 0 && currentBoard[newY][newX] !== null) {
              return true;
            }
          }
        }
      }
      return false;
    },
    []
  );

  const checkTSpin = useCallback(
    (currentPiece: Piece, currentBoard: Board): boolean => {
      if (currentPiece.type !== "T" || !lastMoveWasRotateRef.current) return false;

      const centerX = currentPiece.x + 1;
      const centerY = currentPiece.y + 1;

      const corners = [
        { x: centerX - 1, y: centerY - 1 },
        { x: centerX + 1, y: centerY - 1 },
        { x: centerX - 1, y: centerY + 1 },
        { x: centerX + 1, y: centerY + 1 },
      ];

      let occupiedCorners = 0;
      for (const corner of corners) {
        if (
          corner.x < 0 ||
          corner.x >= BOARD_WIDTH ||
          corner.y >= BOARD_HEIGHT ||
          (corner.y >= 0 && currentBoard[corner.y][corner.x] !== null)
        ) {
          occupiedCorners++;
        }
      }

      return occupiedCorners >= 3;
    },
    []
  );

  const clearLockTimeout = useCallback(() => {
    if (lockTimeoutRef.current) {
      clearTimeout(lockTimeoutRef.current);
      lockTimeoutRef.current = null;
    }
  }, []);

  const spawnNewPiece = useCallback(
    (typeToSpawn?: string) => {
      clearLockTimeout();
      lockResetsRef.current = 0;

      let type = typeToSpawn;
      if (!type) {
        const { nextType } = popNextPiece();
        type = nextType;
      }

      const newPiece: Piece = {
        type,
        shape: TETROMINOS[type].shape,
        color: TETROMINOS[type].color,
        x: 3,
        y: 0,
        rotation: 0,
      };

      lastMoveWasRotateRef.current = false;

      setBoard((currentBoard) => {
        if (checkCollision(newPiece.shape, newPiece.x, newPiece.y, currentBoard)) {
          setGameOver(true);
          sfx.playGameOver();
        }
        return currentBoard;
      });

      setPiece(newPiece);
      setCanHold(true);
    },
    [checkCollision, clearLockTimeout, popNextPiece]
  );

  const mergePieceToBoard = useCallback(() => {
    clearLockTimeout();

    setBoard((prevBoard) => {
      const isTSpin = checkTSpin(piece, prevBoard);
      const newBoard = prevBoard.map((row) => [...row]);

      piece.shape.forEach((row, r) => {
        row.forEach((value, c) => {
          if (value !== 0) {
            const boardY = piece.y + r;
            const boardX = piece.x + c;
            if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
              newBoard[boardY][boardX] = piece.color;
            }
          }
        });
      });

      const fullRowIndices: number[] = [];
      newBoard.forEach((row, r) => {
        if (row.every((cell) => cell !== null)) {
          fullRowIndices.push(r);
        }
      });

      let pointsEarned = 0;
      let textNotice = "";
      const cleared = fullRowIndices.length;

      if (isTSpin) {
        if (cleared === 0) {
          pointsEarned = 400;
          textNotice = "T-SPIN!";
        } else if (cleared === 1) {
          pointsEarned = 800;
          textNotice = "T-SPIN SINGLE!";
        } else if (cleared === 2) {
          pointsEarned = 1200;
          textNotice = "T-SPIN DOUBLE!";
        } else if (cleared === 3) {
          pointsEarned = 1600;
          textNotice = "T-SPIN TRIPLE!";
        }
      } else {
        const linePoints = [0, 100, 300, 500, 800];
        pointsEarned = linePoints[cleared] || cleared * 200;
        if (cleared === 4) textNotice = "TETRIS!";
      }

      if (textNotice) {
        setActionText(textNotice);
        setTimeout(() => setActionText(null), 1200);
      }

      if (pointsEarned > 0) {
        addScore(pointsEarned * level);
      }

      if (cleared > 0) {
        sfx.playClear();
        setClearingRows(fullRowIndices);

        setTimeout(() => {
          setBoard((b) => {
            const filteredBoard = b.filter((_, idx) => !fullRowIndices.includes(idx));
            while (filteredBoard.length < BOARD_HEIGHT) {
              filteredBoard.unshift(Array(BOARD_WIDTH).fill(null));
            }
            return filteredBoard;
          });
          setClearingRows([]);

          setLines((prevLines) => {
            const newLines = prevLines + cleared;
            const newLevel = Math.floor(newLines / 10) + 1;
            setLevel(newLevel);
            return newLines;
          });

          spawnNewPiece();
        }, 200);

        return newBoard;
      }

      spawnNewPiece();
      return newBoard;
    });
  }, [addScore, checkTSpin, clearLockTimeout, level, piece, spawnNewPiece]);

  const handleLockDelayOnMove = useCallback(
    (newPiece: Piece) => {
      const isTouchingGround = checkCollision(newPiece.shape, newPiece.x, newPiece.y + 1, board);

      if (isTouchingGround) {
        if (lockResetsRef.current < MAX_LOCK_RESETS) {
          clearLockTimeout();
          lockResetsRef.current += 1;
          lockTimeoutRef.current = setTimeout(() => {
            mergePieceToBoard();
          }, 500);
        } else if (!lockTimeoutRef.current) {
          mergePieceToBoard();
        }
      } else {
        clearLockTimeout();
      }
    },
    [board, checkCollision, clearLockTimeout, mergePieceToBoard]
  );

  const moveDown = useCallback((isManualSoftDrop = false) => {
    if (gameOver || isPaused) return;

    if (!checkCollision(piece.shape, piece.x, piece.y + 1, board)) {
      setPiece((prev) => ({ ...prev, y: prev.y + 1 }));
      lastMoveWasRotateRef.current = false;
      if (isManualSoftDrop) {
        addScore(1);
        sfx.playMove();
      }
      clearLockTimeout();
    } else {
      if (!lockTimeoutRef.current) {
        lockTimeoutRef.current = setTimeout(() => {
          mergePieceToBoard();
        }, 500);
      }
    }
  }, [addScore, board, checkCollision, clearLockTimeout, gameOver, isPaused, mergePieceToBoard, piece]);

  const moveLeft = () => {
    if (gameOver || isPaused) return;
    if (!checkCollision(piece.shape, piece.x - 1, piece.y, board)) {
      const nextPiece = { ...piece, x: piece.x - 1 };
      setPiece(nextPiece);
      sfx.playMove();
      lastMoveWasRotateRef.current = false;
      handleLockDelayOnMove(nextPiece);
    }
  };

  const moveRight = () => {
    if (gameOver || isPaused) return;
    if (!checkCollision(piece.shape, piece.x + 1, piece.y, board)) {
      const nextPiece = { ...piece, x: piece.x + 1 };
      setPiece(nextPiece);
      sfx.playMove();
      lastMoveWasRotateRef.current = false;
      handleLockDelayOnMove(nextPiece);
    }
  };

  const rotatePiece = () => {
    if (gameOver || isPaused) return;

    const rotated = piece.shape[0].map((_, index) =>
      piece.shape.map((row) => row[index]).reverse()
    );

    const nextRotation = (piece.rotation + 1) % 4;

    if (piece.type === "O") {
      if (!checkCollision(rotated, piece.x, piece.y, board)) {
        const nextPiece = { ...piece, shape: rotated, rotation: nextRotation };
        setPiece(nextPiece);
        sfx.playMove();
        lastMoveWasRotateRef.current = true;
        handleLockDelayOnMove(nextPiece);
      }
      return;
    }

    let kicks: number[][] = [];

    if (piece.type === "I") {
      const I_KICKS: Record<number, number[][]> = {
        0: [[0, 0], [-2, 0], [1, 0], [-2, 1], [1, -2]],
        1: [[0, 0], [-1, 0], [2, 0], [-1, -2], [2, 1]],
        2: [[0, 0], [2, 0], [-1, 0], [2, -1], [-1, 2]],
        3: [[0, 0], [1, 0], [-2, 0], [1, 2], [-2, -1]],
      };
      kicks = I_KICKS[piece.rotation];
    } else {
      const JLSTZ_KICKS: Record<number, number[][]> = {
        0: [[0, 0], [-1, 0], [-1, -1], [0, 2], [-1, 2]],
        1: [[0, 0], [1, 0], [1, 1], [0, -2], [1, -2]],
        2: [[0, 0], [1, 0], [1, -1], [0, 2], [1, 2]],
        3: [[0, 0], [-1, 0], [-1, 1], [0, -2], [-1, -2]],
      };
      kicks = JLSTZ_KICKS[piece.rotation];
    }

    for (const [offsetX, offsetY] of kicks) {
      const newX = piece.x + offsetX;
      const newY = piece.y + offsetY;

      if (!checkCollision(rotated, newX, newY, board)) {
        const nextPiece = {
          ...piece,
          shape: rotated,
          x: newX,
          y: newY,
          rotation: nextRotation,
        };
        setPiece(nextPiece);
        sfx.playMove();
        lastMoveWasRotateRef.current = true;
        handleLockDelayOnMove(nextPiece);
        return;
      }
    }
  };

  const hardDrop = () => {
    if (gameOver || isPaused) return;
    sfx.playDrop();

    let currentY = piece.y;
    while (!checkCollision(piece.shape, piece.x, currentY + 1, board)) {
      currentY++;
    }

    const dropDistance = currentY - piece.y;
    addScore(dropDistance * 2);

    const finalPiece = { ...piece, y: currentY };
    setPiece(finalPiece);

    setBoard((prevBoard) => {
      const isTSpin = checkTSpin(finalPiece, prevBoard);
      const newBoard = prevBoard.map((row) => [...row]);

      finalPiece.shape.forEach((row, r) => {
        row.forEach((value, c) => {
          if (value !== 0) {
            const boardY = finalPiece.y + r;
            const boardX = finalPiece.x + c;
            if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
              newBoard[boardY][boardX] = finalPiece.color;
            }
          }
        });
      });

      const fullRowIndices: number[] = [];
      newBoard.forEach((row, r) => {
        if (row.every((cell) => cell !== null)) {
          fullRowIndices.push(r);
        }
      });

      let pointsEarned = 0;
      let textNotice = "";
      const cleared = fullRowIndices.length;

      if (isTSpin) {
        if (cleared === 0) {
          pointsEarned = 400;
          textNotice = "T-SPIN!";
        } else if (cleared === 1) {
          pointsEarned = 800;
          textNotice = "T-SPIN SINGLE!";
        } else if (cleared === 2) {
          pointsEarned = 1200;
          textNotice = "T-SPIN DOUBLE!";
        } else if (cleared === 3) {
          pointsEarned = 1600;
          textNotice = "T-SPIN TRIPLE!";
        }
      } else {
        const linePoints = [0, 100, 300, 500, 800];
        pointsEarned = linePoints[cleared] || cleared * 200;
        if (cleared === 4) textNotice = "TETRIS!";
      }

      if (textNotice) {
        setActionText(textNotice);
        setTimeout(() => setActionText(null), 1200);
      }

      if (pointsEarned > 0) {
        addScore(pointsEarned * level);
      }

      if (cleared > 0) {
        sfx.playClear();
        setClearingRows(fullRowIndices);

        setTimeout(() => {
          setBoard((b) => {
            const filteredBoard = b.filter((_, idx) => !fullRowIndices.includes(idx));
            while (filteredBoard.length < BOARD_HEIGHT) {
              filteredBoard.unshift(Array(BOARD_WIDTH).fill(null));
            }
            return filteredBoard;
          });
          setClearingRows([]);

          setLines((prevLines) => {
            const newLines = prevLines + cleared;
            const newLevel = Math.floor(newLines / 10) + 1;
            setLevel(newLevel);
            return newLines;
          });

          spawnNewPiece();
        }, 200);

        return newBoard;
      }

      spawnNewPiece();
      return newBoard;
    });
  };

  const holdCurrentPiece = () => {
    if (gameOver || isPaused || !canHold) return;
    sfx.playMove();

    const currentType = piece.type;
    if (holdPieceType === null) {
      setHoldPieceType(currentType);
      spawnNewPiece();
    } else {
      setHoldPieceType(currentType);
      spawnNewPiece(holdPieceType);
    }
    setCanHold(false);
  };

  const toggleMute = () => {
    sfx.isMuted = !isMuted;
    setIsMuted(!isMuted);
  };

  const resetGame = () => {
    clearLockTimeout();
    lockResetsRef.current = 0;

    const newBag = [...generateBag(), ...generateBag()];
    const emptyBoard = createEmptyBoard();
    setBoard(emptyBoard);
    setScore(0);
    setLines(0);
    setLevel(1);
    setGameOver(false);
    setIsPaused(false);
    setActionText(null);
    setHoldPieceType(null);
    setCanHold(true);

    const first = newBag[0];
    setBag(newBag.slice(1));
    setPiece({
      type: first,
      shape: TETROMINOS[first].shape,
      color: TETROMINOS[first].color,
      x: 3,
      y: 0,
      rotation: 0,
    });
  };

  useEffect(() => {
    if (gameOver || isPaused) return;
    const speed = getSpeedForLevel(level);
    const interval = setInterval(() => moveDown(false), speed);
    return () => clearInterval(interval);
  }, [moveDown, gameOver, isPaused, level]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameOver) return;

      // Se eliminó la tecla 'c' / 'C' de los preventDefault para permitir escritura
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " ", "Shift"].includes(e.key)) {
        e.preventDefault();
      }

      switch (e.key) {
        case "ArrowLeft":
        case "a":
        case "A":
          moveLeft();
          break;
        case "ArrowRight":
        case "d":
        case "D":
          moveRight();
          break;
        case "ArrowDown":
        case "s":
        case "S":
          moveDown(true);
          break;
        case "ArrowUp":
        case "w":
        case "W":
          rotatePiece();
          break;
        case " ":
          hardDrop();
          break;
        case "Shift": // Exclusivamente Shift para Guardar/Hold
          holdCurrentPiece();
          break;
        case "p":
        case "P":
          setIsPaused((prev) => !prev);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [moveDown, gameOver, isPaused, piece, board, canHold, holdPieceType]);

  let ghostY = piece.y;
  while (!checkCollision(piece.shape, piece.x, ghostY + 1, board)) {
    ghostY++;
  }

  const displayBoard = board.map((row) => [...row]);

  if (!gameOver) {
    piece.shape.forEach((row, r) => {
      row.forEach((val, c) => {
        if (val !== 0) {
          const boardY = ghostY + r;
          const boardX = piece.x + c;
          if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
            if (displayBoard[boardY][boardX] === null) {
              displayBoard[boardY][boardX] = "ghost";
            }
          }
        }
      });
    });

    piece.shape.forEach((row, r) => {
      row.forEach((val, c) => {
        if (val !== 0) {
          const boardY = piece.y + r;
          const boardX = piece.x + c;
          if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
            displayBoard[boardY][boardX] = piece.color;
          }
        }
      });
    });
  }

  const renderMiniPreview = (typeKey: string | null) => {
    if (!typeKey) return <div className="w-14 h-10 bg-black/40 rounded border border-zinc-800/80" />;
    const target = TETROMINOS[typeKey];
    return (
      <div className="bg-black/40 p-1.5 rounded border border-zinc-800/80 flex items-center justify-center min-w-[60px] min-h-[50px] transition-all">
        <div
          className="grid gap-0.5"
          style={{ gridTemplateColumns: `repeat(${target.shape[0].length}, minmax(0, 1fr))` }}
        >
          {target.shape.map((row, r) =>
            row.map((val, c) => (
              <div
                key={`${r}-${c}`}
                className={`w-2.5 h-2.5 rounded-[1px] ${val !== 0 ? target.color : "bg-transparent"}`}
              />
            ))
          )}
        </div>
      </div>
    );
  };

  const nextQueue = bag.slice(0, 3);

  return (
    <div className="my-2 p-4 bg-[#0d0e12] border border-zinc-800 rounded-lg text-xs font-mono select-none max-w-fit mx-auto shadow-2xl">
      <div className="flex items-center justify-between mb-3 text-zinc-400 border-b border-zinc-800 pb-2">
        <div className="flex items-center gap-2">
          <span>🎮 Terminal Tetris</span>
          <button
            onClick={toggleMute}
            className="px-1.5 py-0.5 text-[10px] bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded border border-zinc-700 transition-colors"
            title="Toggle Sound"
          >
            {isMuted ? "🔇" : "🔊"}
          </button>
        </div>

        <div className="flex gap-3">
          <span>Lvl: <strong className="text-amber-400">{level}</strong></span>
          <span>Lines: <strong className="text-cyan-400">{lines}</strong></span>
          <span>Score: <strong className="text-emerald-400">{score}</strong></span>
          <span title="High Score">Top: <strong className="text-purple-400">{highScore}</strong></span>
        </div>
      </div>

      <div className="flex gap-4 items-start justify-center">
        <div className="flex flex-col items-center gap-1 text-zinc-400">
          <span className="text-[10px] uppercase tracking-wider font-semibold">Hold</span>
          {renderMiniPreview(holdPieceType)}
        </div>

        <div className="relative">
          <div className="bg-black/60 p-1 border border-zinc-800 rounded grid grid-cols-10 gap-0.5">
            {displayBoard.map((row, r) => {
              const isClearing = clearingRows.includes(r);
              return row.map((cell, c) => {
                let cellStyle = "bg-zinc-900/60";
                if (isClearing) {
                  cellStyle = "bg-white opacity-90 scale-95 transition-all duration-150 ease-out";
                } else if (cell === "ghost") {
                  cellStyle = "border border-zinc-500/40 bg-zinc-800/10";
                } else if (cell) {
                  cellStyle = `${cell} transition-all duration-75 shadow-sm`;
                }

                return (
                  <div
                    key={`${r}-${c}`}
                    className={`w-4 h-4 rounded-[1px] ${cellStyle}`}
                  />
                );
              });
            })}
          </div>

          {actionText && (
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 text-center bg-black/90 text-amber-300 font-bold py-1 text-xs tracking-widest border-y border-amber-500/50 shadow-lg transition-all duration-200 animate-pulse">
              {actionText}
            </div>
          )}

          {isPaused && !gameOver && (
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center rounded transition-all">
              <span className="text-amber-400 font-bold text-sm tracking-widest animate-pulse">PAUSED</span>
              <span className="text-zinc-500 text-[10px] mt-1">Press P to resume</span>
            </div>
          )}

          {gameOver && (
            <div className="absolute inset-0 bg-black/85 backdrop-blur-sm flex flex-col items-center justify-center rounded p-2 text-center transition-all">
              <span className="text-red-500 font-bold text-sm tracking-widest mb-1">GAME OVER</span>
              <span className="text-zinc-400 text-[10px] mb-3">Score: {score}</span>
              <button
                onClick={resetGame}
                className="px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded hover:bg-emerald-500/30 transition-all font-semibold"
              >
                Play Again
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3 text-zinc-400">
          <div className="flex flex-col items-center gap-1.5">
            <span className="text-[10px] uppercase tracking-wider font-semibold">Next</span>
            <div className="flex flex-col gap-1">
              {nextQueue.map((type, idx) => (
                <div key={idx} className={idx === 0 ? "scale-100 transition-transform" : "scale-90 opacity-70 transition-transform"}>
                  {renderMiniPreview(type)}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-1 text-[11px]">
            <p className="text-zinc-200 font-semibold mb-1">Controls:</p>
            <p>← / → : Move</p>
            <p>↑ (W) : Rotate (SRS)</p>
            <p>↓ (S) : Soft drop</p>
            <p>Space : Hard drop</p>
            <p>Shift : Hold</p>
            <p>P : Pause</p>
          </div>
        </div>
      </div>
    </div>
  );
}