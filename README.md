
# Connect4 game[Abblix/Oidc.Server](https://github.com/Abblix/Oidc.Server#readme)(https://connect4-game-delta.vercel.app/)
> A curated list of awesome READMEs
> 

A modern implementation of the classic Connect 4 game featuring real-time multiplayer gameplay and AI opponent, built with React + Vite frontend and Golang backend.
   
## 🚀 frontend

-  Download and install the latest version of Node.js
- Navigate to the frontend directory:  cd path/Connect4_Game/frontend
- Install dependencies: npm install
- Start the development server: npm run dev

  
- ## 🔧 Backend Setup
- Navigate to the backend directory: cd path/Connect4_Game/middleware_golang/
- Verify Golang installation: go version
- Run the server: go run server.go

  
## 🎮 Game Instructions
Download and install Golang version 1.25.3
    ## Game Modes
     -One vs One: Play against another human opponent
     -One vs Bot: Play against an AI opponent

Getting Started
Authentication: Login or sign up using Google authentication

Start Game: Click "Start Game" after successful authentication

Color Selection: Choose your preferred color and your opponent's color

Enter Game: Click "Enter" to begin playing

Matchmaking System
If another player is waiting within 30 seconds, a 1vs1 match will start automatically

If no opponent is found within 30 seconds, you'll be matched with an AI bot

Game Rules & Features
Win Condition: Connect four of your colored discs horizontally, vertically, or diagonally before your opponent

Disconnection Policy: If disconnected during a game, you have 30 seconds to reconnect, otherwise your opponent wins automatically

Game History: All your game data is recorded and displayed in your personal play history

Leaderboard: Global rankings are displayed on the home page

Real-time Gameplay: Experience smooth, real-time game interactions

Winning Strategies
Plan both offensive and defensive moves

Watch for potential vertical, horizontal, and diagonal connections

Block your opponent's potential winning moves

Create multiple winning opportunities simultaneously
