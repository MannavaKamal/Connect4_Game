package db_restAPI

import (
	"net/http"
	"log"

	"github.com/gin-gonic/gin"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"fmt"
)

var DB *gorm.DB

// User model
type User struct {
	ID    string   `gorm:"primaryKey" json:"id"`
	Name  string `json:"username"`
	Email string `json:"email" gorm:"unique"`
}
// game model
type Game struct {
	GameID   string `gorm:"primaryKey" json:"gameid"`
	Opponent string `json:"opponent"`
	Win      bool   `json:"win"`
}


// Initialize DB
func InitDB() {
    dsn := "host=pg-313ab3e5-kluniversity-dcde.c.aivencloud.com user=avnadmin password=AVNS_iWHRVuygCreL_PvxBog dbname=connect4 port=28421 sslmode=require"
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	// Auto-migrate the schema
	db.AutoMigrate(&User{})

	DB = db
	fmt.Println("Database connected!")
}

// Handlers
func GetUsers(c *gin.Context) {
	var users []User
	DB.Find(&users)
	c.JSON(http.StatusOK, users)
}

func CreateUser(c *gin.Context) {
	var user User
   fmt.Println("kamal")
	// Bind incoming JSON body to User struct
	if err := c.ShouldBindJSON(&user); err != nil {
		fmt.Println("in first error")
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Check if email already exists
	var existing User
	if err := DB.Where("email = ?", user.Email).First(&existing).Error; err == nil {
		// Record found => email exists
		fmt.Println("in 2nd error")
		c.JSON(http.StatusConflict, gin.H{"error": "Email already exists"})
		return
	}

	// Insert the new user
	if err := DB.Create(&user).Error; err != nil {
		fmt.Println("in 3rd error")
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, user)
}

func CreateGame(c *gin.Context) {
	var game Game

	// Bind incoming JSON body
	if err := c.ShouldBindJSON(&game); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Check if GameID already exists
	var existing Game
	if err := DB.Where("game_id = ?", game.GameID).First(&existing).Error; err == nil {
		c.JSON(http.StatusConflict, gin.H{"error": "GameID already exists"})
		return
	}

	// Insert into DB
	if err := DB.Create(&game).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, game)
}


func GetUser(c *gin.Context) {
	id := c.Param("id")
	var user User
	if err := DB.First(&user, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}
	c.JSON(http.StatusOK, user)
}

func UpdateUser(c *gin.Context) {
	id := c.Param("id")
	var user User
	if err := DB.First(&user, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	var input User
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	user.Name = input.Name
	user.Email = input.Email
	DB.Save(&user)
	c.JSON(http.StatusOK, user)
}

func DeleteUser(c *gin.Context) {
	id := c.Param("id")
	if err := DB.Delete(&User{}, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "User deleted"})
}
