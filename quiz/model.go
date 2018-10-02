package quiz

import (
	"fmt"
	"strconv"

	"github.com/calinpristavu/quizzer/user"
	"github.com/jinzhu/gorm"
)

type Quiz struct {
	gorm.Model
	UserID     uint
	Active     bool
	UnAnswered []Question `gorm:"many2many:quiz_unanswered_mm;"`
	Answered   []AnsweredQuestion
}

type AnsweredQuestion struct {
	gorm.Model
	QuizID          uint
	Quiz            Quiz
	QuestionID      uint
	Question        Question
	SelectedAnswers []Answer `gorm:"many2many:question_selected_answer_mm;"`
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

func findActiveByUser(u *user.User) Quiz {
	q := Quiz{
		UserID: u.ID,
		Active: true,
	}

	h.db.
		Preload("UnAnswered").
		Preload("UnAnswered.Answers").
		Preload("Answered").
		Preload("Answered.SelectedAnswers").
		Preload("Answered.Question").
		Where(&q).FirstOrCreate(&q)

	if q.UnAnswered == nil && len(q.Answered) == 0 {
		populateQuizWithQuestions(&q)
		for _, question := range q.UnAnswered {
			h.db.Model(&q).Association("UnAnswered").Append(question)
		}
	}

	return q
}

func populateQuizWithQuestions(q *Quiz) {
	h.db.
		Model(&Question{}).
		Preload("Answers").
		Order(gorm.Expr("rand()")).
		Limit(2).
		Find(&q.UnAnswered)
}

func (q *Question) filterAnswersByStringIds(ids []string) ([]Answer, error) {
	var choices []Answer

	for _, aID := range ids {
		for _, a := range q.Answers {
			id, err := strconv.Atoi(aID)
			if err != nil {
				return nil, fmt.Errorf("invalid answer id given %v: %v", aID, err)
			}

			if a.ID == uint(id) {
				choices = append(choices, a)
			}
		}
	}

	return choices, nil
}

func (q *Question) saveAnswersForQuiz(answerIds []string, quiz *Quiz) error {
	as, err := q.filterAnswersByStringIds(answerIds)
	if err != nil {
		return fmt.Errorf("invalid answers: %v", err)
	}

	h.db.Model(&quiz).Association("Answered").Append(&AnsweredQuestion{
		QuestionID:      q.ID,
		QuizID:          quiz.ID,
		SelectedAnswers: as,
	})
	h.db.Model(&quiz).Association("UnAnswered").Delete(&q)

	return nil
}

func (q *Quiz) getNextQuestion() (Question, error) {
	if len(q.UnAnswered) == 0 {
		return Question{}, fmt.Errorf("all questions have been answered")
	}

	return q.UnAnswered[0], nil
}

func (q *Quiz) close() {
	q.Active = false
	h.db.Save(&q)
}
