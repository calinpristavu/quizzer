package webapp

import (
	"fmt"
	"strconv"

	"github.com/jinzhu/gorm"
)

const questionsPerQuiz = 10

type Quiz struct {
	gorm.Model
	Name      string
	UserID    uint
	User      *User
	Questions []*Question
	Active    bool
	Score     uint
}

type Question struct {
	gorm.Model
	QuizID             uint
	Text               string
	Type               uint
	IsAnswered         bool `gorm:"not null";sql:"DEFAULT:0"`
	IsCorrect          bool `gorm:"not null";sql:"DEFAULT:0"`
	Score              uint `sql:"default:0"`
	ChoiceAnswers      []*ChoiceAnswer
	TextAnswer         *TextAnswer
	FlowDiagramAnswer  *FlowDiagramAnswer
	QuestionTemplateID uint
}

type ChoiceAnswer struct {
	gorm.Model
	QuestionID uint
	Text       string
	IsCorrect  bool
	IsSelected bool
}

type TextAnswer struct {
	gorm.Model
	QuestionID uint
	Text       string `sql:"size:999999"`
	IsCorrect  bool
}

type FlowDiagramAnswer struct {
	gorm.Model
	QuestionID uint
	Text       string `sql:"size:999999"`
	SVG        string `sql:"size:999999"`
	IsCorrect  bool
}

func newQuiz(u *User, noQ int) *Quiz {
	q := &Quiz{
		UserID: u.ID,
		Name:   "Generated",
		Active: true,
	}

	g.db.Save(&q)

	var qts []QuestionTemplate

	g.db.
		Model(&QuestionTemplate{}).
		Preload("ChoiceAnswerTemplates").
		Order(gorm.Expr("rand()")).
		Limit(noQ).
		Find(&qts)

	for _, qt := range qts {
		qt.addToQuiz(q)
	}

	return q
}

func findAllFinishedForUser(u *User) []Quiz {
	var qs []Quiz

	g.db.Model(&Quiz{}).
		Preload("Questions").
		Preload("Questions.ChoiceAnswers").
		Preload("Questions.TextAnswer").
		Preload("Questions.FlowDiagramAnswer").
		Where("user_id = ?", u.ID).
		Where("active = 0").
		Find(&qs)

	return qs
}

func find(id int) Quiz {
	var q Quiz
	g.db.
		Model(Quiz{}).
		Preload("Questions").
		Preload("Questions.ChoiceAnswers").
		Preload("Questions.TextAnswer").
		Preload("Questions.FlowDiagramAnswer").
		First(&q, id)

	return q
}

func (q *Question) markChoicesAsSelected(ids []string) error {
	for _, aID := range ids {
		for _, a := range q.ChoiceAnswers {
			id, err := strconv.Atoi(aID)
			if err != nil {
				return fmt.Errorf("invalid answer id given %v: %v", aID, err)
			}

			if a.ID == uint(id) {
				a.IsSelected = true
			}
		}
	}

	return nil
}

func (q *Question) saveChoices(answerIds []string, quiz *Quiz) error {
	err := q.markChoicesAsSelected(answerIds)
	if err != nil {
		return fmt.Errorf("invalid answers: %v", err)
	}

	correct := true
	for _, a := range q.ChoiceAnswers {
		if a.IsCorrect != a.IsCorrect {
			correct = false
		}
	}
	q.IsCorrect = correct
	if q.IsCorrect {
		q.Score = 100
	}
	q.IsAnswered = true
	g.db.Save(q)

	return nil
}

func (q *Question) saveText(text string, quiz *Quiz) error {
	q.TextAnswer.Text = text
	q.IsAnswered = true
	g.db.Save(q)

	return nil
}

func (q *Question) saveFlowDiagram(json string, svg string, quiz *Quiz) error {
	q.FlowDiagramAnswer.Text = json
	q.FlowDiagramAnswer.SVG = svg
	q.IsAnswered = true
	g.db.Save(q)

	return nil
}

func (q *Quiz) getNextQuestion() (*Question, error) {
	for _, question := range q.Questions {
		if !question.IsAnswered {
			return question, nil
		}
	}

	return nil, fmt.Errorf("all questions have been answered")
}

func (u *User) finishQuiz() {
	u.CurrentQuiz.Active = false
	g.db.Save(&u.CurrentQuiz)

	u.CurrentQuiz = nil
	u.CurrentQuizID = nil
	g.db.Save(&u)
}

func (qt QuestionTemplate) addToQuiz(quiz *Quiz) {
	q := &Question{
		IsAnswered:         false,
		QuizID:             quiz.ID,
		Text:               qt.Text,
		Type:               qt.Type,
		QuestionTemplateID: qt.ID,
	}

	g.db.Save(&q)

	q.TextAnswer = &TextAnswer{Text: "", QuestionID: q.ID}
	q.FlowDiagramAnswer = &FlowDiagramAnswer{Text: "", SVG: "", QuestionID: q.ID}
	for _, cat := range qt.ChoiceAnswerTemplates {
		ca := &ChoiceAnswer{
			QuestionID: q.ID,
			Text:       cat.Text,
			IsCorrect:  cat.IsCorrect,
			IsSelected: false,
		}
		g.db.Save(&ca)
		q.ChoiceAnswers = append(q.ChoiceAnswers, ca)
	}

	quiz.Questions = append(quiz.Questions, q)
}
