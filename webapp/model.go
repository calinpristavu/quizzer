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
	IsAnswered         bool   `gorm:"not null";sql:"DEFAULT:0"`
	IsCorrect          bool   `gorm:"not null";sql:"DEFAULT:0"`
	Score              uint   `sql:"default:0"`
	Weight             uint   `sql:"default:1"`
	Notes              string `sql:"type:longtext"`
	CheckboxAnswers    []*CheckboxAnswer
	RadioAnswers       []*RadioAnswer
	TextAnswer         *TextAnswer
	FlowDiagramAnswer  *FlowDiagramAnswer
	QuestionTemplateID uint
}

type CheckboxAnswer struct {
	gorm.Model
	QuestionID uint
	Text       string
	IsCorrect  bool
	IsSelected bool
}

type RadioAnswer struct {
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
		Preload("QuizQuestions").
		Preload("QuizQuestions.Quiz").
		Preload("CheckboxAnswerTemplates").
		Preload("RadioAnswerTemplates").
		Order(gorm.Expr("rand()")).
		Limit(noQ).
		Find(&qts)

	averageWeight := uint(100 / len(qts))
	for _, qt := range qts {
		qt.addToQuiz(q, averageWeight)
	}

	return q
}

func findAllFinishedForUser(u *User) []Quiz {
	var qs []Quiz

	g.db.Model(&Quiz{}).
		Preload("Questions").
		Preload("Questions.CheckboxAnswers").
		Preload("Questions.RadioAnswers").
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
		Preload("Questions.CheckboxAnswers").
		Preload("Questions.RadioAnswers").
		Preload("Questions.TextAnswer").
		Preload("Questions.FlowDiagramAnswer").
		First(&q, id)

	return q
}

func (q *Question) markCheckboxesAsSelected(ids []string) error {
	for _, aID := range ids {
		for _, a := range q.CheckboxAnswers {
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

func (q *Question) saveCheckboxes(answerIds []string) error {
	err := q.markCheckboxesAsSelected(answerIds)
	if err != nil {
		return fmt.Errorf("invalid answers: %v", err)
	}

	correct := true
	for _, a := range q.CheckboxAnswers {
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

func (q *Question) saveRadios(answerId string) error {
	id, err := strconv.Atoi(answerId)
	if err != nil {
		return fmt.Errorf("could not convert %s to int: %v", answerId, err)
	}

	correct := true
	for _, a := range q.RadioAnswers {
		a.IsSelected = false
		if a.ID == uint(id) {
			a.IsSelected = true
		}
		g.db.Save(&a)

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
		err = q.saveCheckboxes(r.Form["answer[]"])
	case 2:
		err = q.saveText(r.FormValue("answer"))
	case 3:
		err = q.saveFlowDiagram(r.FormValue("flow_diagram_json"), r.FormValue("flow_diagram_svg"))
	case 4:
		err = q.saveRadios(r.FormValue("answer"))
	default:
		err = fmt.Errorf("unhandled question type %v", q.Type)
	}

	return err
}

func (q *Quiz) UpdateScore() {
	totalWeight := uint(0)
	weightedScore := uint(0)
	for _, q := range q.Questions {
		weightedScore += q.Score * q.Weight
		totalWeight += q.Weight
	}
	q.Score = weightedScore / totalWeight
}

func (u *User) finishQuiz() {
	u.CurrentQuiz.Active = false
	u.CurrentQuiz.UpdateScore()

	g.db.Save(&u.CurrentQuiz)

	u.CurrentQuiz = nil
	u.CurrentQuizID = nil
	g.db.Save(&u)
}
