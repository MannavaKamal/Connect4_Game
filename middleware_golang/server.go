package main

import (
    // "github.com/MannavaKamal/emitterassignment/config"
    // "github.com/MannavaKamal/emitterassignment/handlers"
    "github.com/gin-gonic/gin"
    "time"
    
	
    
    "github.com/MannavaKamal/emitterassignment/db_restAPI"
    "github.com/MannavaKamal/emitterassignment/websocket"
    "github.com/gin-contrib/cors"
)



//var clients = wating

func main() {

    
    // Connect DB
   // config.ConnectDB()
   db_restAPI.InitDB()

     
    // Create router
    r := gin.Default()
    r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"}, // Allow all origins
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

    // REST API routes
    r.GET("/players", )

    // r.POST("/players", handlers.CreatePlayer)

    r.GET("/users", db_restAPI.GetUsers)
	r.POST("/insertplayer", db_restAPI.CreateUser)
    r.POST("/insertgame", db_restAPI.CreateGame)
	r.GET("/users/:id", db_restAPI.GetUser)
	r.PUT("/users/:id", db_restAPI.UpdateUser)
	r.DELETE("/users/:id", db_restAPI.DeleteUser)

    // // WebSocket endpoint
     r.GET("/ws", websocket.WsHandler)
	 

    // Run server
    r.Run(":8081")
}

// wsHandler upgrades the HTTP connection and sets up the client registration.
// f


