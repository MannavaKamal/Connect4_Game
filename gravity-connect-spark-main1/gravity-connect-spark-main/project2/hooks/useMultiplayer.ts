import { useState, useEffect, useRef, useCallback } from 'react';

export type GameMode = 'waiting' | 'bot' | 'multiplayer';
export type PlayerType = 'local' | 'remote' | 'bot';

interface MultiplayerState {
  mode: GameMode;
  opponentConnected: boolean;
  timeRemaining: number;
  opponentMove: number | null;
}

export const useMultiplayer = (onOpponentMove?: (column: number) => void) => {
  const [state, setState] = useState<MultiplayerState>({
    mode: 'waiting',
    opponentConnected: false,
    timeRemaining: 30,
    opponentMove: null,
  });

  const wsRef = useRef<WebSocket | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const connectWebSocket = useCallback(() => {
    // Simulated WebSocket connection
    // In production, replace with actual WebSocket URL
    console.log('Attempting to connect to multiplayer server...');
    
    // Simulate connection delay
    setTimeout(() => {
      const randomConnect = Math.random() > 0.7; // 30% chance of finding opponent
      
      if (randomConnect) {
        setState(prev => ({
          ...prev,
          mode: 'multiplayer',
          opponentConnected: true,
          timeRemaining: 0,
        }));
        console.log('Opponent connected!');
      }
    }, 2000);
  }, []);

  const startWaiting = useCallback(() => {
    setState({
      mode: 'waiting',
      opponentConnected: false,
      timeRemaining: 30,
      opponentMove: null,
    });

    // Start countdown timer
    timerRef.current = setInterval(() => {
      setState(prev => {
        const newTime = prev.timeRemaining - 1;
        
        if (newTime <= 0) {
          // Timer expired, switch to bot mode
          if (timerRef.current) clearInterval(timerRef.current);
          return {
            ...prev,
            mode: 'bot',
            timeRemaining: 0,
            opponentConnected: true,
          };
        }
        
        return {
          ...prev,
          timeRemaining: newTime,
        };
      });
    }, 1000);

    connectWebSocket();
  }, [connectWebSocket]);

  const sendMove = useCallback((column: number) => {
    if (state.mode === 'multiplayer' && wsRef.current) {
      console.log('Sending move to opponent:', column);
      // wsRef.current.send(JSON.stringify({ type: 'move', column }));
    }
  }, [state.mode]);

  const getBotMove = useCallback((board: (string | null)[][]): number => {
    // Simple bot logic: find random valid column
    const validColumns = [];
    for (let col = 0; col < 7; col++) {
      if (board[0][col] === null) {
        validColumns.push(col);
      }
    }
    
    if (validColumns.length === 0) return -1;
    
    // Random selection from valid columns
    return validColumns[Math.floor(Math.random() * validColumns.length)];
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (wsRef.current) wsRef.current.close();
    };
  }, []);

  return {
    ...state,
    startWaiting,
    sendMove,
    getBotMove,
  };
};
