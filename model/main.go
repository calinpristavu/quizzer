package model

import (
	"fmt"
	"os"

	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/mysql"
	"github.com/joho/godotenv"
	"github.com/sirupsen/logrus"
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
		&CodeAnswer{},
		&FlowDiagramAnswer{},
		&QuizTemplate{},
		&QuestionTemplate{},
		&QuestionTemplateTag{},
		&QuizQuestionTemplate{},
		&CheckboxAnswerTemplate{},
		&RadioAnswerTemplate{},
		&FlowDiagramAnswerTemplate{},
		&CodeAnswerTemplate{},
	)

	db.Model(&Question{}).AddForeignKey("quiz_id", "quizzes(id)", "CASCADE", "NO ACTION")
	db.Model(&QuestionFeedback{}).AddForeignKey("question_id", "questions(id)", "CASCADE", "NO ACTION")
	db.Model(&CheckboxAnswer{}).AddForeignKey("question_id", "questions(id)", "CASCADE", "NO ACTION")
	db.Model(&RadioAnswer{}).AddForeignKey("question_id", "questions(id)", "CASCADE", "NO ACTION")
	db.Model(&CodeAnswer{}).AddForeignKey("question_id", "questions(id)", "CASCADE", "NO ACTION")
	db.Model(&FlowDiagramAnswer{}).AddForeignKey("question_id", "questions(id)", "CASCADE", "NO ACTION")

	statsAvgResultQuery := `
CREATE OR REPLACE VIEW stats_avg_result AS SELECT 
	AVG(score) as number,
	DATE(updated_at) as date
FROM quizzes
WHERE score IS NOT NULL
GROUP BY DATE(updated_at)
`
	if r := db.Exec(statsAvgResultQuery); r.Error != nil {
		logrus.Fatalf("create view stats_avg_result: %v", r.Error)
	}

	statsBestResultQuery := `
CREATE OR REPLACE VIEW stats_best_result AS 
SELECT 
	MAX(score) as number,
	DATE(updated_at) as date
FROM quizzes
WHERE score IS NOT NULL
GROUP BY DATE(updated_at)
`
	if r := db.Exec(statsBestResultQuery); r.Error != nil {
		logrus.Fatalf("create view stats_best_result: %v", r.Error)
	}
}

func initDb() *gorm.DB {
	err := godotenv.Load()
	if err != nil {
		logrus.Fatal("Error loading .env file")
	}

	user := os.Getenv("DB_USER")
	host := os.Getenv("DB_HOST")
	pass := os.Getenv("DB_PASSWORD")
	env := os.Getenv("APP_ENV")

	db, err := gorm.Open("mysql", fmt.Sprintf("%s:%s@tcp(%s)/quizzer?charset=utf8&parseTime=True", user, pass, host))

	if err != nil {
		logrus.Fatalf("could not connect to db: %v", err)
	}

	return db.LogMode(env == "dev")
}
