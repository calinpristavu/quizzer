package model

import (
	"fmt"
	"log"
	"os"

	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/mysql"
	"github.com/joho/godotenv"
)

var db *gorm.DB

func init() {
	db = initDb()
	migrateDb()
}

func migrateDb() *gorm.DB {
	return db.AutoMigrate(
		&User{},
		&Quiz{},
		&Question{},
		&QuestionFeedback{},
		&CheckboxAnswer{},
		&RadioAnswer{},
		&TextAnswer{},
		&FlowDiagramAnswer{},
		&QuizTemplate{},
		&QuestionTemplate{},
		&QuizQuestionTemplate{},
		&CheckboxAnswerTemplate{},
		&RadioAnswerTemplate{},
		&FlowDiagramAnswerTemplate{},
	)
}

func initDb() *gorm.DB {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	user := os.Getenv("DB_USER")
	host := os.Getenv("DB_HOST")
	pass := os.Getenv("DB_PASSWORD")

	db, err := gorm.Open("mysql", fmt.Sprintf("%s:%s@tcp(%s)/quizzer?charset=utf8&parseTime=True", user, pass, host))

	if err != nil {
		log.Fatalf("could not connect to db: %v", err)
	}

	return db.LogMode(true)
}
