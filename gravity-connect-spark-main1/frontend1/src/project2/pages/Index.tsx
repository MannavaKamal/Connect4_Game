import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GameBoard from "@project2/components/game/GameBoard";
import PlayerHUD from "@project2/components/game/PlayerHUD";
import { Button } from "@project2/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@project2/components/ui/dialog";
import { Label } from "@project2/components/ui/label";
import { useToast } from "@project2/hooks/use-toast";
import { useMultiplayer } from "@project2/hooks/useMultiplayer";
import { Loader2 } from "lucide-react";

const AVAILABLE_COLORS = ["red", "yellow", "blue", "green"];

const Index = () => {
  const { toast } = useToast();
  const [gameState, setGameState] = useState<'setup' | 'waiting' | 'playing'>('setup');
  
  const [player1Color, setPlayer1Color] = useState("red");
  const [player2Color, setPlayer2Color] = useState("yellow");
  
  const [player1Score, setPlayer1Score] = useState(0);
  const [player2Score, setPlayer2Score] = useState(0);
  
  const [showWinModal, setShowWinModal] = useState(false);
  const [winner, setWinner] = useState<1 | 2 | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState<1 | 2>(1);
  const [lastColumn, setLastColumn] = useState<number | null>(null);
  
  const { mode, opponentConnected, timeRemaining, startWaiting, sendMove, getBotMove } = useMultiplayer();

  const handleEnterGame = () => {
    if (player1Color === player2Color) {
      toast({
        title: "Invalid colors",
        description: "Players must choose different colors!",
        variant: "destructive",
      });
      return;
    }
    setGameState('waiting');
    startWaiting();
  };

  const handleGameReady = () => {
    setGameState('playing');
    setCurrentPlayer(1);
    setLastColumn(null);
  };

  const handleWin = (winningPlayer: 1 | 2) => {
    setWinner(winningPlayer);
    if (winningPlayer === 1) {
      setPlayer1Score((prev) => prev + 1);
    } else {
      setPlayer2Score((prev) => prev + 1);
    }
    setShowWinModal(true);
    
    toast({
      title: `${winningPlayer === 1 ? "Player 1" : "Player 2"} wins!`,
      description: "🎉 Four in a row!",
    });
  };

  const handleMove = (column: number, player: 1 | 2) => {
    setLastColumn(column);
    if (player === 1) {
      sendMove(column);
    }
  };

  const handleRestart = () => {
    setShowWinModal(false);
    setGameState('waiting');
    setCurrentPlayer(1);
    setLastColumn(null);
    startWaiting();
  };

  const handleNewGame = () => {
    setShowWinModal(false);
    setGameState('setup');
    setPlayer1Score(0);
    setPlayer2Score(0);
    setCurrentPlayer(1);
    setLastColumn(null);
  };

  const getColorClass = (color: string) => {
    switch (color) {
      case "red":
        return "bg-player-red";
      case "yellow":
        return "bg-player-yellow";
      case "blue":
        return "bg-player-blue";
      case "green":
        return "bg-player-green";
      default:
        return "bg-muted";
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-5xl">
        <motion.h1
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-5xl md:text-6xl font-bold text-center mb-8 bg-gradient-to-r from-player-red via-player-yellow to-player-blue bg-clip-text text-transparent"
        >
          Connect 4
        </motion.h1>

        {/* Waiting Screen */}
        {gameState === 'waiting' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-8"
          >
            <div className="bg-card rounded-3xl p-12 shadow-2xl text-center max-w-md">
              <h2 className="text-3xl font-bold mb-6 text-foreground">
                Player 1 vs Player 2
              </h2>
              
              {!opponentConnected ? (
                <>
                  <div className="flex items-center justify-center gap-3 mb-6">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    <p className="text-xl text-muted-foreground">
                      Searching for opponent...
                    </p>
                  </div>
                  
                  <div className="text-6xl font-bold text-primary mb-2">
                    {timeRemaining}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {timeRemaining > 0 ? "seconds remaining" : "Starting with bot..."}
                  </p>
                </>
              ) : (
                <>
                  <div className="text-2xl font-bold text-green-500 mb-4">
                    {mode === 'bot' ? '🤖 Bot Opponent Ready!' : '👤 Opponent Found!'}
                  </div>
                  <Button
                    onClick={handleGameReady}
                    size="lg"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    Start Game
                  </Button>
                </>
              )}
            </div>
          </motion.div>
        )}

        {/* Game Screen */}
        {gameState === 'playing' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-8"
          >
            <PlayerHUD
              player1Name="Player 1"
              player2Name={mode === 'bot' ? 'Bot' : 'Player 2'}
              player1Color={player1Color}
              player2Color={player2Color}
              player1Score={player1Score}
              player2Score={player2Score}
              currentPlayer={currentPlayer}
              lastColumn={lastColumn}
            />

            <GameBoard
              player1Color={player1Color}
              player2Color={player2Color}
              onWin={handleWin}
              onMove={handleMove}
              onTurnChange={setCurrentPlayer}
              mode={mode}
              getBotMove={getBotMove}
            />

            <Button
              onClick={handleRestart}
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Restart Game
            </Button>
          </motion.div>
        )}

        {/* Color Picker Modal */}
        <Dialog open={gameState === 'setup'} onOpenChange={() => {}}>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-2xl text-foreground">Choose Your Colors</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Select your favorite color and opponent's color!
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {/* Player 1 Setup */}
              <div className="space-y-4">
                <h3 className="font-semibold text-foreground">Your Color (Player 1)</h3>
                <div className="flex gap-3 justify-center">
                  {AVAILABLE_COLORS.map((color) => (
                    <button
                      key={color}
                      onClick={() => setPlayer1Color(color)}
                      className={`w-16 h-16 rounded-full ${getColorClass(color)} ${
                        player1Color === color ? "ring-4 ring-primary scale-110" : "opacity-60 hover:opacity-100"
                      } transition-all`}
                      aria-label={`Select ${color} for Player 1`}
                    />
                  ))}
                </div>
              </div>

              {/* Player 2 Setup */}
              <div className="space-y-4">
                <h3 className="font-semibold text-foreground">Opponent Color (Player 2)</h3>
                <div className="flex gap-3 justify-center">
                  {AVAILABLE_COLORS.map((color) => (
                    <button
                      key={color}
                      onClick={() => setPlayer2Color(color)}
                      className={`w-16 h-16 rounded-full ${getColorClass(color)} ${
                        player2Color === color ? "ring-4 ring-primary scale-110" : "opacity-60 hover:opacity-100"
                      } transition-all`}
                      aria-label={`Select ${color} for Player 2`}
                    />
                  ))}
                </div>
              </div>

              <Button
                onClick={handleEnterGame}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                size="lg"
              >
                Enter Game
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Win Modal */}
        <Dialog open={showWinModal} onOpenChange={setShowWinModal}>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-3xl text-center text-foreground">
                🎉 {winner === 1 ? "Player 1" : (mode === 'bot' ? "Bot" : "Player 2")} Wins!
              </DialogTitle>
              <DialogDescription className="text-center text-muted-foreground text-lg">
                Four in a row! Congratulations!
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-3 py-4">
              <Button
                onClick={handleRestart}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
                size="lg"
              >
                Play Again
              </Button>
              <Button
                onClick={handleNewGame}
                variant="outline"
                size="lg"
              >
                New Game (Change Colors)
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Index;
