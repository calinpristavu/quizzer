package webapp

import (
	"fmt"
	"net/http"
	"strconv"

	"github.com/jinzhu/gorm"
)

const questionsPerQuiz = 10

type Quiz struct {
	gorm.Model
	Name           string
	UserID         uint
	User           *User
	Questions      []*Question
	Active         bool
	Score          uint
	QuizTemplateID uint
}

type Question struct {
	gorm.Model
	QuizID             uint
	Text               string `sql:"type:longtext"`
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
		Order("id desc").
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

func (q *Question) saveChoices(answerIds []string) error {
	err := q.markChoicesAsSelected(answerIds)
	if err != nil {
		return fmt.Errorf("invalid answers: %v", err)
	}

	correct := true
	for _, a := range q.ChoiceAnswers {
		if a.IsCorrect != a.IsSelected {
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

func (q *Question) saveText(text string) error {
	q.TextAnswer.Text = text
	q.IsAnswered = true
	g.db.Save(q)

	return nil
}

func (q *Question) saveFlowDiagram(json string, svg string) error {
	q.FlowDiagramAnswer.Text = json
	q.FlowDiagramAnswer.SVG = svg
	q.IsAnswered = true
	g.db.Save(q)

	return nil
}

func (q *Question) SaveAnswer(r *http.Request) error {
	var err error

	switch q.Type {
	case 1:
		err = q.saveChoices(r.Form["answer[]"])
	case 2:
		err = q.saveText(r.FormValue("answer"))
	case 3:
		err = q.saveFlowDiagram(r.FormValue("flow_diagram_json"), r.FormValue("flow_diagram_svg"))
	default:
		err = fmt.Errorf("unhandled question type %v", q.Type)
	}

	return err
}

func (u *User) finishQuiz() {
	u.CurrentQuiz.Active = false

	for _, q := range u.CurrentQuiz.Questions {
		u.CurrentQuiz.Score += q.Score
	}
	u.CurrentQuiz.Score = u.CurrentQuiz.Score / uint(len(u.CurrentQuiz.Questions))
	g.db.Save(&u.CurrentQuiz)

	u.CurrentQuiz = nil
	u.CurrentQuizID = nil
	g.db.Save(&u)
}
