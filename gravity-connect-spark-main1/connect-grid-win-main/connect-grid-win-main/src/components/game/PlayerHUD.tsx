import { motion } from "framer-motion";

interface PlayerHUDProps {
  player1Name: string;
  player2Name: string;
  player1Color: string;
  player2Color: string;
  player1Score: number;
  player2Score: number;
  currentPlayer: 1 | 2;
  lastColumn?: number | null;
}

const PlayerHUD = ({
  player1Name,
  player2Name,
  player1Color,
  player2Color,
  player1Score,
  player2Score,
  currentPlayer,
  lastColumn = null,
}: PlayerHUDProps) => {
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

  const PlayerCard = ({
    name,
    color,
    score,
    isActive,
    playerNum,
  }: {
    name: string;
    color: string;
    score: number;
    isActive: boolean;
    playerNum: 1 | 2;
  }) => (
    <motion.div
      className={`relative bg-card rounded-2xl p-6 transition-all ${
        isActive ? "ring-4 ring-primary shadow-lg shadow-primary/30" : "opacity-60"
      }`}
      animate={isActive ? { scale: 1.05 } : { scale: 1 }}
    >
      <div className="flex items-center gap-4">
        <div className={`w-14 h-14 rounded-full ${getColorClass(color)} ${
          isActive ? "shadow-lg animate-pulse-glow" : ""
        }`} />
        <div>
          <h3 className="text-xl font-bold text-foreground">{name}</h3>
          <p className="text-sm text-muted-foreground">Score: {score}</p>
        </div>
      </div>
      
      {/* Column indicator */}
      {isActive && lastColumn !== null && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute -top-3 -right-3 bg-primary text-primary-foreground rounded-full w-10 h-10 flex items-center justify-center font-bold shadow-lg"
        >
          {lastColumn + 1}
        </motion.div>
      )}
    </motion.div>
  );

  return (
    <div className="w-full max-w-4xl grid grid-cols-2 gap-6 mb-8">
      <PlayerCard
        name={player1Name}
        color={player1Color}
        score={player1Score}
        isActive={currentPlayer === 1}
        playerNum={1}
      />
      <PlayerCard
        name={player2Name}
        color={player2Color}
        score={player2Score}
        isActive={currentPlayer === 2}
        playerNum={2}
      />
    </div>
  );
};

export default PlayerHUD;
