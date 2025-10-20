import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Column from "./Column";
import Disc from "./Disc";
import type { GameMode } from "@/hooks/useMultiplayer";

const ROWS = 6;
const COLS = 7;

type Cell = string | null;
type Board = Cell[][];

interface GameBoardProps {
  player1Color: string;
  player2Color: string;
  onWin: (winner: 1 | 2) => void;
  onMove?: (column: number, player: 1 | 2) => void;
  onTurnChange?: (player: 1 | 2) => void;
  mode?: GameMode;
  getBotMove?: (board: Board) => number;
}

const GameBoard = ({ 
  player1Color, 
  player2Color, 
  onWin, 
  onMove,
  onTurnChange,
  mode = 'waiting',
  getBotMove
}: GameBoardProps) => {
  const [board, setBoard] = useState<Board>(
    Array(ROWS)
      .fill(null)
      .map(() => Array(COLS).fill(null))
  );
  const [currentPlayer, setCurrentPlayer] = useState<1 | 2>(1);
  const [hoveredColumn, setHoveredColumn] = useState<number | null>(null);
  const [winningCells, setWinningCells] = useState<Set<string>>(new Set());
  const [isAnimating, setIsAnimating] = useState(false);

  const checkWin = useCallback((board: Board, row: number, col: number, color: string): boolean => {
    const directions = [
      [0, 1],  // horizontal
      [1, 0],  // vertical
      [1, 1],  // diagonal down-right
      [1, -1], // diagonal down-left
    ];

    for (const [dx, dy] of directions) {
      let count = 1;
      const cells = [`${row}-${col}`];

      // Check positive direction
      for (let i = 1; i < 4; i++) {
        const newRow = row + dx * i;
        const newCol = col + dy * i;
        if (
          newRow >= 0 &&
          newRow < ROWS &&
          newCol >= 0 &&
          newCol < COLS &&
          board[newRow][newCol] === color
        ) {
          count++;
          cells.push(`${newRow}-${newCol}`);
        } else break;
      }

      // Check negative direction
      for (let i = 1; i < 4; i++) {
        const newRow = row - dx * i;
        const newCol = col - dy * i;
        if (
          newRow >= 0 &&
          newRow < ROWS &&
          newCol >= 0 &&
          newCol < COLS &&
          board[newRow][newCol] === color
        ) {
          count++;
          cells.push(`${newRow}-${newCol}`);
        } else break;
      }

      if (count >= 4) {
        setWinningCells(new Set(cells));
        return true;
      }
    }

    return false;
  }, []);

  const dropDisc = useCallback(
    async (colIndex: number) => {
      if (isAnimating) return;

      // Find the lowest empty row in this column
      let targetRow = -1;
      for (let row = ROWS - 1; row >= 0; row--) {
        if (board[row][colIndex] === null) {
          targetRow = row;
          break;
        }
      }

      if (targetRow === -1) return; // Column is full

      setIsAnimating(true);

      const color = currentPlayer === 1 ? player1Color : player2Color;
      const newBoard = board.map((row) => [...row]);
      newBoard[targetRow][colIndex] = color;

      setBoard(newBoard);
      
      // Notify parent of move
      onMove?.(colIndex, currentPlayer);

      // Wait for animation to complete
      setTimeout(() => {
        if (checkWin(newBoard, targetRow, colIndex, color)) {
          onWin(currentPlayer);
        } else {
          const nextPlayer = currentPlayer === 1 ? 2 : 1;
          setCurrentPlayer(nextPlayer);
          onTurnChange?.(nextPlayer);
        }
        setIsAnimating(false);
      }, 400);
    },
    [board, currentPlayer, player1Color, player2Color, checkWin, onWin, onMove, onTurnChange, isAnimating]
  );

  // Bot move logic
  useEffect(() => {
    if (mode === 'bot' && currentPlayer === 2 && !isAnimating && getBotMove) {
      const timer = setTimeout(() => {
        const botColumn = getBotMove(board);
        if (botColumn !== -1) {
          dropDisc(botColumn);
        }
      }, 800); // Bot thinks for 800ms
      
      return () => clearTimeout(timer);
    }
  }, [currentPlayer, mode, isAnimating, board, getBotMove, dropDisc]);

  const isColumnFull = (colIndex: number) => {
    return board[0][colIndex] !== null;
  };

  return (
    <div className="bg-game-frame rounded-3xl p-8 shadow-2xl">
      <div className="flex gap-3">
        {Array.from({ length: COLS }).map((_, colIndex) => (
          <Column
            key={colIndex}
            onClick={() => dropDisc(colIndex)}
            isHovered={hoveredColumn === colIndex}
            onHoverChange={(hovered) => setHoveredColumn(hovered ? colIndex : null)}
            isFull={isColumnFull(colIndex)}
            currentPlayerColor={currentPlayer === 1 ? player1Color : player2Color}
          >
            {Array.from({ length: ROWS }).map((_, rowIndex) => {
              const cell = board[rowIndex][colIndex];
              const cellKey = `${rowIndex}-${colIndex}`;
              const isWinning = winningCells.has(cellKey);

              return (
                <div
                  key={cellKey}
                  className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-game-empty p-1.5"
                >
                  <AnimatePresence>
                    {cell && (
                      <motion.div
                        initial={{ y: -400, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 25,
                          mass: 0.8,
                        }}
                        className="w-full h-full"
                      >
                        <Disc color={cell} isWinning={isWinning} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </Column>
        ))}
      </div>
    </div>
  );
};

export default GameBoard;
