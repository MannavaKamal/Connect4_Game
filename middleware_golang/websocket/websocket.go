package websocket

import (
    // "github.com/MannavaKamal/emitterassignment/config"
    // "github.com/MannavaKamal/emitterassignment/handlers"
    "github.com/gin-gonic/gin"
	"net/http"
    "fmt"
    "time"
    "encoding/json"
    
	"math"
	"math/rand"
	
    // "sync/atomic"
    "github.com/gorilla/websocket"
	"github.com/google/uuid"
   
)

// struct for the game
type Game struct {
    GameID       string
    Player1 string  // iam storing only the client id in client id the websocket connection is there
    Player2 string
    Chance int
    }

type ClientInfo struct {
    Conn        *websocket.Conn
    DeleteStatus int
    Username     string
}
// data if 2 users connected success fully
type Mic struct {  // message if client connected and game id is formed
    Type int `json:"type"`
    GameID string `json:"gameId"`
    OpponentName string `json:"opponentName"`
    Chance int `json:"chance"`
}

type Testtype struct {
	Type int `json:"type"`
}

type Coldata struct {
	Type     int    `json:"type"`
	GameId   string `json:"gameId"`
	Chance   int    `json:"chance"`
	ColIndex int    `json:"colIndex"`
    Position int     `json:"position"`
}

type WatingClient struct {  // data have to wating client
    Type int `json:"type"`
    // GameID string `json:"gameId"`
    // OpponentName string `json:"opponentName"`
    Chance int `json:"chance"`
    ColIndex int `json:"colIndex"`
}

type Bot struct {
	Type   int         `json:"type"`
	GameID string      `json:"gameId"`
	Grid   [][]int     `json:"grid"`
}


var games = make([]Game, 0)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true 
	},
}
var clients = make(map[string]*ClientInfo)

var keys = make([]string,0)
var waitingkeys = make([]string,0)



func WsHandler(c *gin.Context) {
    conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
    if err != nil {
		//fmt.Println("Remote Address  ",conn.RemoteAddr().String())
        fmt.Println("Upgrade error:", err)
        return
    }
     email := c.Query("email") // get email from query parameter
      username := c.Query("username")
    fmt.Println("New connection from email:", email)
    fmt.Println("new username", username)
    clientID := email                              
                    clients[clientID] = &ClientInfo{
                                                                Conn: conn,
                                                                DeleteStatus: 0, // initial status
                                                                Username:username,
                                                                }
                    
                    
                    fmt.Println("clients length", len(clients))
                // sending conformation 2nd player is available or not
                if len(waitingkeys) == 0 {
                    fmt.Println("No opponent")
                    waitingkeys = append(waitingkeys, clientID)
                    pmsg :=  Mic{
                                    Type: 1,
                                GameID    : "",
                                OpponentName : "",
                                Chance :  1,
                                }
                                
                                data3, _ := json.Marshal(pmsg)
                               fmt.Println(string(data3))
                    err = conn.WriteMessage(websocket.TextMessage, []byte(string(data3)))
                    if err != nil {
                        fmt.Println("Write error:", err)
                    }

                } else {
                    fmt.Println("Opponent found, starting game")
                    gameid := uuid.New().String()

                    var player1 *websocket.Conn
                    var player2 *websocket.Conn

                    p1, ok := clients[waitingkeys[0]]
                    if ok {
                        fmt.Println("Client found for waiting key:", waitingkeys[0])
                        player1 = p1.Conn
                    } else {
                        fmt.Println("Client not found in waiting keys")
                        return // exit if something went wrong
                    }

                    player2 = conn
                    
                    newGame := Game{
                        GameID:  gameid,
                        Player1: waitingkeys[0], // client ID
                        Player2: clientID,
                    }

                    games = append(games, newGame)
                    // message for player1
                    pmsg1 :=  Mic{
                                    Type: 2,
                                GameID    : gameid,
                                OpponentName : username,
                                Chance :  1,
                                }
                                
                                data, _ := json.Marshal(pmsg1)
                               fmt.Println(string(data))
                    // Notify player 1
                    err = player1.WriteMessage(websocket.TextMessage, []byte(string(data)))
                    if err != nil {
                        fmt.Println("Write error:", err)
                    }

                    // Notify player 2
                     // message for player2
                     pmsg2 :=  Mic{
                                    Type: 2,
                                GameID    : gameid,
                                OpponentName : p1.Username,
                                Chance :  0,
                                }
                                data1, _ := json.Marshal(pmsg2)
                               fmt.Println(string(data1))
                    err = player2.WriteMessage(websocket.TextMessage, []byte(string(data1)))
                    if err != nil {
                        fmt.Println("Write error:", err)
                    }

                    // Remove the first waiting key since game started
                    waitingkeys = waitingkeys[1:]
                }

                        
                    fmt.Println("Client connected:", clientID, conn.RemoteAddr().String())
                    fmt.Println("Remote Address  ",conn.RemoteAddr().String())

                    


                    defer conn.Close()

    for {
        // Read message from client
        _, msg, err := conn.ReadMessage()
        if err != nil {
                        fmt.Println("⚠️ Error in email:", email)

                        var des int = 0
                        var game1 Game

                        // 🔍 Find and remove game associated with this client
                        for i := range games {
                            if games[i].Player1 == clientID || games[i].Player2 == clientID {
                                des = 1
                                game1 = games[i]

                                // safely remove the game from slice
                                if i >= 0 && i < len(games) {
                                    games = append(games[:i], games[i+1:]...)
                                }
                                break
                            }
                        }

                        // 🎮 If a game was found involving this client
                        if des == 1 {
                            w_c_m1 := WatingClient{
                                Type:     100,
                                Chance:   0,
                                ColIndex: -1,
                            }
                            data911, _ := json.Marshal(w_c_m1)

                            // 🧩 Notify the other player depending on who disconnected
                            if game1.Player1 == clientID && !(game1.Player2 == "bot") {
                                // Check if Player2 exists and is connected
                               // if c2, ok := clients[game1.Player2]; ok && c2 != nil && c2.Conn != nil {
                                    if err := clients[game1.Player2].Conn.WriteMessage(websocket.TextMessage, data911); err != nil {
                                        fmt.Printf("⚠️ Failed to send disconnect message to Player2 (%v): %v\n", game1.Player2, err)
                                    }
                                // } else {
                                //     fmt.Printf("⚠️ Player2 (%v) not connected or nil\n", game1.Player2)
                                // }
                                delete(clients, game1.Player2)
                                delete(clients, clientID)

                            } 
                             if game1.Player2 == "bot" {
                                fmt.Println("🤖 Bot match cleanup:", game1.GameID, game1.Player2, game1.Player1)

                            } 
                            if game1.Player2 == clientID {
                                // Check if Player1 exists and is connected
                                if c1, ok := clients[game1.Player1]; ok && c1 != nil && c1.Conn != nil {
                                    if err := c1.Conn.WriteMessage(websocket.TextMessage, data911); err != nil {
                                        fmt.Printf("⚠️ Failed to send disconnect message to Player1 (%v): %v\n", game1.Player1, err)
                                    }
                                } else {
                                    fmt.Printf("⚠️ Player1 (%v) not connected or nil\n", game1.Player1)
                                }

                                delete(clients, game1.Player1)
                                delete(clients, clientID)
                            }
                        }

                        // 🕹️ Remove from waiting keys safely
                        for i, id := range waitingkeys {
                            if id == clientID {
                                fmt.Println("client id found in waitingkeys — removing:", clientID)
                                waitingkeys = append(waitingkeys[:i], waitingkeys[i+1:]...)
                                break
                            }
                        }

                        // 🧹 Log disconnection
                        fmt.Println("Client disconnected:", clientID)
                        delete(clients, clientID)
                        fmt.Println("Read error:", err)
                         fmt.Println("length of wating keys ", len(waitingkeys))
                            fmt.Println("length of clients ", len(clients))
                            fmt.Println("length of games ", len(games))
                        break
                    }

        fmt.Println("Received from client:", string(msg))
        var testtype Testtype
         json.Unmarshal(msg, &testtype)
         switch testtype.Type {           
		case 11:
			fmt.Println("Type 11 received! Handle accordingly.")
            var colidx Coldata
             json.Unmarshal(msg, &colidx)
             cgameid := colidx.GameId
             chance := colidx.Chance
             colIndex := colidx.ColIndex
             cposition := colidx.Position
             fmt.Println(string(msg))
             fmt.Println(cgameid,chance,colIndex,cposition)
              var cgameid1 Game
             for i := range games {
        if games[i].GameID == cgameid  {
             cgameid1 = games[i]
            break
        }}
             if cposition == 1 { // if position 1 first player
                fmt.Println(cgameid1.Player2)
                fmt.Println(cgameid1.Player1)
              w_client := clients[cgameid1.Player2] // wating client
              w_c_m :=  WatingClient{
                                    Type: 91,
                                Chance :  -1,
                                ColIndex : colIndex,
                                }                                
                                data91, _ := json.Marshal(w_c_m)
                               fmt.Println(string(data91))
              w_client.Conn.WriteMessage(websocket.TextMessage, []byte(string(data91)))
              w_c_m3 :=  WatingClient{
                                    Type: 91,
                                Chance :  1,
                                ColIndex : -1,
                                }
                                
                                data913, _ := json.Marshal(w_c_m3)
                               fmt.Println(string(data913))
              w_client.Conn.WriteMessage(websocket.TextMessage, []byte(string(data913)))
              w_c_m1 :=  WatingClient{  // message for source
                                    Type: 91,
                                Chance :  0,
                                ColIndex : -1,
                                }
                                
                                data911, _ := json.Marshal(w_c_m1)
                               fmt.Println(string(data911))
                               fmt.Println(email)
              conn.WriteMessage(websocket.TextMessage, []byte(string(data911)))        
             } else {
                fmt.Println(cgameid1.Player1)
                fmt.Println(cgameid1.Player2)
              w_client := clients[cgameid1.Player1] // wating client
              w_c_m :=  WatingClient{
                                    Type: 91,
                                Chance :  -1,
                                ColIndex : colIndex,
                                }
                                
                                data91, _ := json.Marshal(w_c_m)
                               fmt.Println(string(data91))
              w_client.Conn.WriteMessage(websocket.TextMessage, []byte(string(data91)))
              w_c_m3 :=  WatingClient{
                                    Type: 91,
                                Chance :  1,
                                ColIndex : -1,
                                }
                                
                                data913, _ := json.Marshal(w_c_m3)
                               fmt.Println(string(data913))
              w_client.Conn.WriteMessage(websocket.TextMessage, []byte(string(data913)))
              w_c_m1 :=  WatingClient{  // message for source
                                    Type: 91,
                                Chance :  0,
                                ColIndex : -1,
                                }
                                
                                data911, _ := json.Marshal(w_c_m1)
                               fmt.Println(string(data911))
              conn.WriteMessage(websocket.TextMessage, []byte(string(data911)))  
             }
             break
         case 21 :
            gameid := uuid.New().String()
            fmt.Println(email,gameid)

            clients[clientID] = &ClientInfo{
                                                                Conn: conn,
                                                                DeleteStatus: 0, // initial status
                                                                Username:username,
                                                                }
                                                              
                 newGame := Game{
                        GameID:  gameid,
                        Player1: clientID, // client ID
                        Player2: "bot",
                    } 
                                                                       
            games = append(games, newGame)  
            pmsg1 :=  Mic{
                                    Type: 22,
                                GameID    : gameid,
                                Chance :  1,
                                }
                                
                                data, _ := json.Marshal(pmsg1)
                               fmt.Println(string(data))
                    // Notify player 1
                    err = conn.WriteMessage(websocket.TextMessage, []byte(string(data)))
            waitingkeys = waitingkeys[1:]
            break
         case 22 :
            fmt.Println("grid recived:", string(msg))
            var bot Bot
            err := json.Unmarshal(msg, &bot)
            if err != nil {
                fmt.Println("Error unmarshalling grid message:", err)
                return
            }
            fmt.Printf("Grid received from game %s:\n", bot.GameID)
            _ , botCol, _ := BotPlay(bot.Grid)
            fmt.Println(botCol)
            
              
              w_c_m :=  WatingClient{
                                    Type: 91,
                                Chance :  -1,
                                ColIndex : botCol,
                                }
                                
                                data91, _ := json.Marshal(w_c_m)
                               fmt.Println(string(data91))
              conn.WriteMessage(websocket.TextMessage, []byte(string(data91)))
            //   w_c_m3 :=  WatingClient{
            //                         Type: 91,
            //                     Chance :  1,
            //                     ColIndex : -1,
            //                     }
                                
            //                     data913, _ := json.Marshal(w_c_m3)
            //                    fmt.Println(string(data913))
            //   conn.WriteMessage(websocket.TextMessage, []byte(string(data913))) 
            break    
		default:
			fmt.Println("Unknown type")
		}
        // // Echo message back to client
        // err = conn.WriteMessage(websocket.TextMessage, []byte("Server received: "+string(msg)))
        // if err != nil {
        //     fmt.Println("Write error:", err)
        //     break
        // }
        fmt.Println("length of wating keys ", len(waitingkeys))
         fmt.Println("length of clients ", len(clients))
          fmt.Println("length of games ", len(games))
    }
}



// bot game



const (
	ROWS         = 6
	COLS         = 7
	PLAYER_PIECE = 1
	BOT_PIECE    = 2
	EMPTY        = 0

	// Adjust search depth: 4 or 5 are common. Larger -> stronger but slower.
	SEARCH_DEPTH = 4
)

// ---------- Utility ----------
func copyBoard(board [][]int) [][]int {
	newBoard := make([][]int, ROWS)
	for r := 0; r < ROWS; r++ {
		newBoard[r] = append([]int{}, board[r]...)
	}
	return newBoard
}

func isValidLocation(board [][]int, col int) bool {
	return col >= 0 && col < COLS && board[0][col] == EMPTY
}

func getValidLocations(board [][]int) []int {
	cols := make([]int, 0, COLS)
	for c := 0; c < COLS; c++ {
		if isValidLocation(board, c) {
			cols = append(cols, c)
		}
	}
	return cols
}

func getNextOpenRow(board [][]int, col int) int {
	for r := ROWS - 1; r >= 0; r-- {
		if board[r][col] == EMPTY {
			return r
		}
	}
	return -1
}

func dropPiece(board [][]int, row, col, piece int) {
	board[row][col] = piece
}

// ---------- Win detection ----------
func winningMove(board [][]int, piece int) bool {
	// Horizontal
	for r := 0; r < ROWS; r++ {
		for c := 0; c < COLS-3; c++ {
			if board[r][c] == piece && board[r][c+1] == piece &&
				board[r][c+2] == piece && board[r][c+3] == piece {
				return true
			}
		}
	}
	// Vertical
	for r := 0; r < ROWS-3; r++ {
		for c := 0; c < COLS; c++ {
			if board[r][c] == piece && board[r+1][c] == piece &&
				board[r+2][c] == piece && board[r+3][c] == piece {
				return true
			}
		}
	}
	// Positive diagonal
	for r := 0; r < ROWS-3; r++ {
		for c := 0; c < COLS-3; c++ {
			if board[r][c] == piece && board[r+1][c+1] == piece &&
				board[r+2][c+2] == piece && board[r+3][c+3] == piece {
				return true
			}
		}
	}
	// Negative diagonal
	for r := 3; r < ROWS; r++ {
		for c := 0; c < COLS-3; c++ {
			if board[r][c] == piece && board[r-1][c+1] == piece &&
				board[r-2][c+2] == piece && board[r-3][c+3] == piece {
				return true
			}
		}
	}
	return false
}

// ---------- Heuristic (evaluation) ----------
func evaluateWindow(window []int, piece int) int {
	score := 0
	opp := PLAYER_PIECE
	if piece == PLAYER_PIECE {
		opp = BOT_PIECE
	}

	countPiece, countOpp, countEmpty := 0, 0, 0
	for _, v := range window {
		if v == piece {
			countPiece++
		} else if v == opp {
			countOpp++
		} else {
			countEmpty++
		}
	}

	// Prioritize 4-in-row, 3-in-row with open, etc.
	if countPiece == 4 {
		score += 1000
	} else if countPiece == 3 && countEmpty == 1 {
		score += 50
	} else if countPiece == 2 && countEmpty == 2 {
		score += 10
	}

	// Block opponent
	if countOpp == 3 && countEmpty == 1 {
		score -= 80
	} else if countOpp == 2 && countEmpty == 2 {
		score -= 5
	}

	return score
}

func scorePosition(board [][]int, piece int) int {
	score := 0

	// Center column preference
	centerCol := COLS / 2
	centerCount := 0
	for r := 0; r < ROWS; r++ {
		if board[r][centerCol] == piece {
			centerCount++
		}
	}
	score += centerCount * 6

	// Horizontal windows
	for r := 0; r < ROWS; r++ {
		for c := 0; c < COLS-3; c++ {
			window := []int{board[r][c], board[r][c+1], board[r][c+2], board[r][c+3]}
			score += evaluateWindow(window, piece)
		}
	}
	// Vertical windows
	for c := 0; c < COLS; c++ {
		for r := 0; r < ROWS-3; r++ {
			window := []int{board[r][c], board[r+1][c], board[r+2][c], board[r+3][c]}
			score += evaluateWindow(window, piece)
		}
	}
	// Positive diagonals
	for r := 0; r < ROWS-3; r++ {
		for c := 0; c < COLS-3; c++ {
			window := []int{board[r][c], board[r+1][c+1], board[r+2][c+2], board[r+3][c+3]}
			score += evaluateWindow(window, piece)
		}
	}
	// Negative diagonals
	for r := 3; r < ROWS; r++ {
		for c := 0; c < COLS-3; c++ {
			window := []int{board[r][c], board[r-1][c+1], board[r-2][c+2], board[r-3][c+3]}
			score += evaluateWindow(window, piece)
		}
	}

	return score
}

// ---------- Minimax with alpha-beta ----------
func minimax(board [][]int, depth int, alpha int, beta int, maximizing bool) (int, int) {
	validCols := getValidLocations(board)
	isTerminal := winningMove(board, PLAYER_PIECE) || winningMove(board, BOT_PIECE) || len(validCols) == 0

	if depth == 0 || isTerminal {
		if isTerminal {
			if winningMove(board, BOT_PIECE) {
				return -1, 1000000 // very large positive for bot winning
			} else if winningMove(board, PLAYER_PIECE) {
				return -1, -1000000 // very large negative for player winning
			} else {
				return -1, 0 // draw
			}
		} else {
			// heuristic evaluation
			return -1, scorePosition(board, BOT_PIECE)
		}
	}

	if maximizing {
		value := math.MinInt32
		bestCol := validCols[rand.Intn(len(validCols))] // random init tie-break
		for _, col := range validCols {
			row := getNextOpenRow(board, col)
			if row == -1 {
				continue
			}
			bCopy := copyBoard(board)
			dropPiece(bCopy, row, col, BOT_PIECE)
			_, newScore := minimax(bCopy, depth-1, alpha, beta, false)
			if newScore > value {
				value = newScore
				bestCol = col
			}
			if value > alpha {
				alpha = value
			}
			if alpha >= beta {
				break // prune
			}
		}
		return bestCol, value
	} else {
		value := math.MaxInt32
		bestCol := validCols[rand.Intn(len(validCols))]
		for _, col := range validCols {
			row := getNextOpenRow(board, col)
			if row == -1 {
				continue
			}
			bCopy := copyBoard(board)
			dropPiece(bCopy, row, col, PLAYER_PIECE)
			_, newScore := minimax(bCopy, depth-1, alpha, beta, true)
			if newScore < value {
				value = newScore
				bestCol = col
			}
			if value < beta {
				beta = value
			}
			if alpha >= beta {
				break
			}
		}
		return bestCol, value
	}
}

// ---------- BotPlay using minimax ----------
func BotPlay(board [][]int) ([][]int, int, string) {
	newBoard := copyBoard(board)
	rand.Seed(time.Now().UnixNano())

	validCols := getValidLocations(newBoard)
	if len(validCols) == 0 {
		return newBoard, -1, "Draw"
	}

	// First quick checks: if bot can win in one move, take it.
	for _, col := range validCols {
		row := getNextOpenRow(newBoard, col)
		bCopy := copyBoard(newBoard)
		dropPiece(bCopy, row, col, BOT_PIECE)
		if winningMove(bCopy, BOT_PIECE) {
			dropPiece(newBoard, row, col, BOT_PIECE)
			return newBoard, col, "Bot"
		}
	}
	// If player can win in one move, block it.
	for _, col := range validCols {
		row := getNextOpenRow(newBoard, col)
		bCopy := copyBoard(newBoard)
		dropPiece(bCopy, row, col, PLAYER_PIECE)
		if winningMove(bCopy, PLAYER_PIECE) {
			// block
			dropPiece(newBoard, row, col, BOT_PIECE)
			// check winner after block (unlikely immediate bot win)
			if winningMove(newBoard, BOT_PIECE) {
				return newBoard, col, "Bot"
			}
			return newBoard, col, ""
		}
	}

	// Use minimax to choose best column
	bestCol, _ := minimax(newBoard, SEARCH_DEPTH, math.MinInt32/2, math.MaxInt32/2, true)
	// If minimax returns an invalid column (rare), pick random valid
	if !isValidLocation(newBoard, bestCol) {
		bestCol = validCols[rand.Intn(len(validCols))]
	}
	row := getNextOpenRow(newBoard, bestCol)
	if row != -1 {
		dropPiece(newBoard, row, bestCol, BOT_PIECE)
	}

	// Determine winner/draw
	winner := ""
	if winningMove(newBoard, BOT_PIECE) {
		winner = "Bot"
	} else if winningMove(newBoard, PLAYER_PIECE) {
		winner = "Player"
	} else if len(getValidLocations(newBoard)) == 0 {
		winner = "Draw"
	}

	return newBoard, bestCol, winner
}

// ---------- Example usage ----------
// func main() {
// 	// Example board input (6 rows × 7 cols).
// 	// Rows listed top-to-bottom (row 0 is top).
// 	board := [][]int{
// 		{0, 0, 0, 0, 0, 0, 0}, // top
// 		{0, 0, 0, 0, 0, 0, 0},
// 		{2, 2, 0, 0, 0, 0, 0},
// 		{1, 1, 0, 0, 0, 0, 0},
// 		{1, 2, 0, 0, 0, 0, 0},
// 		{1, 2, 1, 0, 0, 0, 0}, // bottom (row 5)
// 	}

// 	newBoard, botCol, winner := BotPlay(board)

// 	fmt.Printf("Bot played column: %d\n", botCol)
// 	fmt.Println("Updated board (top->bottom rows):")
// 	for _, row := range newBoard {
// 		fmt.Println(row)
// 	}
// 	if winner != "" {
// 		fmt.Println("Winner:", winner)
// 	} else {
// 		fmt.Println("No winner yet.")
// 	}
// }