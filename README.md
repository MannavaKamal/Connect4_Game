
# Connect4 game(https://connect4-game-delta.vercel.app/)


A modern implementation of the classic Connect 4 game featuring real-time multiplayer gameplay and AI opponent, built with React + Vite frontend and Golang backend.
   
## 🚀 frontend

-  Download and install the latest version of Node.js
- Navigate to the frontend directory:  cd path/Connect4_Game/frontend
- Install dependencies: npm install
- Start the development server: npm run dev


## 🔧 Backend Setup
- Download and install Golang version 1.25.3
- Navigate to the backend directory: cd path/Connect4_Game/middleware_golang/
- Verify Golang installation: go version
- Run the server: go run server.go

  
## 🎮 Game Instructions

- Game Modes
1. One vs One: Play against another human opponent
2. One vs Bot: Play against an AI opponent

- Getting Started
1. Authentication: Login or sign up using Google authentication
2. Start Game: Click "Start Game" after successful authentication
3. Color Selection: Choose your preferred color and your opponent's color
4. Enter Game: Click "Enter" to begin playing

- Matchmaking System
1. If another player is waiting within 30 seconds, a 1vs1 match will start automatically

2. If no opponent is found within 30 seconds, you'll be matched with an AI bot

- Game Rules & Features
1. Win Condition: Connect four of your colored discs horizontally, vertically, or diagonally before your opponent

2. Disconnection Policy: If disconnected during a game, you have 30 seconds to reconnect, otherwise your opponent wins automatically

3. Game History: All your game data is recorded and displayed in your personal play history

4. Leaderboard: Global rankings are displayed on the home page

5. Real-time Gameplay: Experience smooth, real-time game interactions

- Winning Strategies
1. Plan both offensive and defensive moves

2. Watch for potential vertical, horizontal, and diagonal connections

3. Block your opponent's potential winning moves

4. Create multiple winning opportunities simultaneously
