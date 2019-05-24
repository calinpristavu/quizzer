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

func migrateDb() {
	db.AutoMigrate(
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
		&QuestionTemplateTag{},
		&QuizQuestionTemplate{},
		&CheckboxAnswerTemplate{},
		&RadioAnswerTemplate{},
		&FlowDiagramAnswerTemplate{},
	)

	db.Model(&Question{}).AddForeignKey("quiz_id", "quizzes(id)", "CASCADE", "NO ACTION")
	db.Model(&QuestionFeedback{}).AddForeignKey("question_id", "questions(id)", "CASCADE", "NO ACTION")
	db.Model(&CheckboxAnswer{}).AddForeignKey("question_id", "questions(id)", "CASCADE", "NO ACTION")
	db.Model(&RadioAnswer{}).AddForeignKey("question_id", "questions(id)", "CASCADE", "NO ACTION")
	db.Model(&TextAnswer{}).AddForeignKey("question_id", "questions(id)", "CASCADE", "NO ACTION")
	db.Model(&FlowDiagramAnswer{}).AddForeignKey("question_id", "questions(id)", "CASCADE", "NO ACTION")
}

func initDb() *gorm.DB {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	user := os.Getenv("DB_USER")
	host := os.Getenv("DB_HOST")
	pass := os.Getenv("DB_PASSWORD")
	env := os.Getenv("APP_ENV")

	db, err := gorm.Open("mysql", fmt.Sprintf("%s:%s@tcp(%s)/quizzer?charset=utf8&parseTime=True", user, pass, host))

	if err != nil {
		log.Fatalf("could not connect to db: %v", err)
	}

	return db.LogMode(env == "dev")
}
