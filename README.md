# Connect4_Game

Connect 4 Game
A modern implementation of the classic Connect 4 game featuring real-time multiplayer gameplay and AI opponent, built with React + Vite frontend and Golang backend.

🚀 Frontend Setup
Prerequisites
Download and install the latest version of Node.js

Installation & Development
The frontend is developed using React + Vite.

Navigate to the frontend directory:

bash
cd path/Connect4_Game/frontend
Install dependencies:

bash
npm install
Start the development server:

bash
npm run dev
The application will be available at the local development server (typically http://localhost:5173).

🔧 Backend Setup
Prerequisites
Download and install Golang version 1.25.3

Installation & Execution
Navigate to the backend directory:

bash
cd path/Connect4_Game/middleware_golang/
Verify Golang installation:

bash
go version
This command checks the Golang environment on your system.

Run the server:

bash
go run server.go
🎮 Game Instructions
Game Modes
One vs One: Play against another human opponent

One vs Bot: Play against an AI opponent

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

📁 Project Structure
text
Connect4_Game/
├── frontend/          # React + Vite application
├── middleware_golang/ # Golang backend server
└── README.md         # Project documentation
🛠️ Technologies Used
Frontend: React, Vite, Modern JavaScript

Backend: Golang 1.25.3

Authentication: Google OAuth

Real-time Communication: WebSockets

Database: (Specify if applicable)
