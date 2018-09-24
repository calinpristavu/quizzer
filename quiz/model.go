package quiz

import (
	"github.com/calinpristavu/quizzer/user"
	"github.com/jinzhu/gorm"
)

type Quiz struct {
	gorm.Model
	UserID    uint
	Active    bool
	Questions []Question `gorm:"many2many:quiz_question_mm;auto_preload"`
}

type Question struct {
	gorm.Model
	Text    string
	Answers []Answer
}

type Answer struct {
	gorm.Model
	QuestionID uint
	Text       string
	Correct    bool
}

func findActiveByUser(u *user.User) *Quiz {
	q := &Quiz{
		UserID: u.ID,
		Active: true,
	}

	notFound := h.db.
		Preload("Questions").
		Preload("Questions.Answers").
		Where(q).First(q).
		RecordNotFound()

	if notFound {
		h.db.Model(&Quiz{}).NewRecord(q)
		populateQuizWithQuestions(q)

		h.db.
			Set("gorm:association_autoupdate", false).
			Save(q)
	}

	return q
}

func populateQuizWithQuestions(q *Quiz) {
	h.db.
		Model(&Question{}).
		Preload("Answers").
		Order(gorm.Expr("rand()")).
		Limit(2).
		Find(&q.Questions)
}
