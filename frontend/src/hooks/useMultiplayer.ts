import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from "react-router-dom";
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
   
   const navigate = useNavigate();

  const wsRef = useRef<WebSocket | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const [gameState, setGameState] = useState<'setup' | 'waiting' | 'playing'>('setup');
  const [player2,setPlayer2] = useState("");
  const [currentPlayer, setCurrentPlayer] = useState<1 | 2>(1);
  const [gameId,setGameId] = useState("")
  const [position,setPosition] = useState<1 | 2>(1);
  const [col,setCol] = useState(-1)
  const [moveTrigger, setMoveTrigger] = useState(0);

  const connectWebSocket = useCallback(() => {
    // Simulated WebSocket connection
    // In production, replace with actual WebSocket URL
    console.log('Attempting to connect to multiplayer server...');
    
    if (wsRef.current) {
      console.log("Already connected");
      return;
    }
        const userData = JSON.parse(localStorage.getItem('userSession'));
        if(!userData){
          navigate("/")
          return
        }  
    const socket = new WebSocket(`wss://connect4-game-b45r.onrender.com/ws?email=${encodeURIComponent(userData.email)}&username=${encodeURIComponent(userData.username)}`);
    
    socket.onopen = () => {
      console.log("✅ Connected to server");
      console.log(timerRef.current)   
      //setIsConnected(true);
    };

    socket.onmessage = (event) => {
      
      const res = JSON.parse(event.data)
      if(res.type === 1){
       console.log("📩 Message:", event.data);
       setGameState('waiting')
      }else if(res.type === 2){
        
        const condata = res
        setGameId(condata.gameId)
        if(condata.chance === 0){
          setMoveTrigger((t) => t + generateRandom());
        setPosition(2)              
        setCurrentPlayer(2)
        }
        setMoveTrigger((t) => t + generateRandom());
        setPlayer2(condata.opponentName)
       clearTimeout(timerRef.current)
        console.log(timerRef.current)
        setState({
      mode : 'multiplayer',
      opponentConnected: true,
      timeRemaining: 0,
      opponentMove: null,
    });
        setGameState('waiting')  
    }else if(res.type === 91){
      console.log(res)
          if(res.chance === -1 ){
            setMoveTrigger((t) => {
        const rv = t + generateRandom()
         console.log("in 1r "+rv)
        return rv });
           
             setCol(res.colIndex)
          }
     else if(res.chance == 1){ 
      setMoveTrigger((t) => {
        const rv = t + generateRandom()
        console.log("in 2r "+rv)
        return rv });
       setCol(-1)            
       setMoveTrigger((t) => {
        const rv = t + generateRandom()
         console.log("in 3r "+rv)
        return rv });
      } else if(res.chance == 0){
       setMoveTrigger((t) => {
        const rv = t + generateRandom()
         console.log("in 4r "+rv)
        return rv });
        console.log("in 0")
        setCol(-1)
        setCurrentPlayer(2)
      }
    }else if(res.type === 22){
      if(res.chance === 1){
        setCurrentPlayer(1)
      }
     setGameId(res.gameId)
    }
    else if(res.type === 100){
     console.log("you won the game")
     alert("client disconencted so you won the game")
     //navigate("/")
    }
      
    };

    socket.onclose = () => {
      console.log("❌ Disconnected from server");
     // setIsConnected(false);
      wsRef.current = null;
    };
console.log("after onclose")
   wsRef.current = socket;
    
    // Simulate connection delay
    // setTimeout(() => {
    //   const randomConnect = Math.random() > 0.7; // 30% chance of finding opponent
      
    //   if (randomConnect) {
    //     setState(prev => ({
    //       ...prev,
    //       mode: 'multiplayer',
    //       opponentConnected: true,
    //       timeRemaining: 0,
    //     }));
    //     console.log('Opponent connected!');
    //   }
    // }, 2000);
  }, []);

  const startWaiting = useCallback(() => {
    console.log("in startwating = "+state.opponentConnected)
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
        console.log("in startwating setIntervel = "+state.opponentConnected)
        if (newTime === 0 && !state.opponentConnected) {
         
          if (timerRef.current) clearInterval(timerRef.current);   
           const botreq = {
            type : 21
          }
          wsRef.current.send(JSON.stringify(botreq));    
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

   const generateRandom = () => {
    // Generate a random 6-digit number between 100000 and 999999
    const random = Math.floor(100000 + Math.random() * 900000);
    return random;
  };

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
    gameState,
    player2,
    currentPlayer,
    wsRef,
    gameId,
    position,
    col,
    moveTrigger,
    setCurrentPlayer,
    setGameState,
    startWaiting,
    sendMove,
    getBotMove,
    
  };
};
