package model

import (
	"fmt"
	"net/http"
	"sort"
	"strconv"
	"time"

	"github.com/jinzhu/gorm"
)

type Quiz struct {
	gorm.Model
	Name           string
	UserID         uint
	User           *User `gorm:"association_autoupdate:false;association_autocreate:false"`
	Questions      []*Question
	Active         bool
	Score          uint
	QuizTemplateID uint
	Duration       Duration `sql:"type:VARCHAR(50)"`
	Corrected      bool     `sql:"DEFAULT:0"`
	CorrectingByID uint
	CorrectingBy   *User `gorm:"association_autoupdate:false;association_autocreate:false"`
}

type Question struct {
	gorm.Model
	QuizID     uint
	Text       string `sql:"type:longtext"`
	Type       uint
	IsAnswered bool   `gorm:"not null";sql:"DEFAULT:0"`
	IsCorrect  bool   `gorm:"not null";sql:"DEFAULT:0"`
	Score      uint   `sql:"default:0"`
	Weight     uint   `sql:"default:1"`
	Notes      string `sql:"type:longtext"`
	Order      int    `sql:"default:1"`

	Feedback           []*QuestionFeedback
	CheckboxAnswers    []*CheckboxAnswer
	RadioAnswers       []*RadioAnswer
	CodeAnswer         *CodeAnswer
	FlowDiagramAnswer  *FlowDiagramAnswer
	QuestionTemplateID uint
}

type QuestionFeedback struct {
	gorm.Model
	QuestionID uint
	Question   *Question `gorm:"association_autoupdate:false;association_autocreate:false"`
	Text       string    `sql:"type:longtext"`
}

type CheckboxAnswer struct {
	gorm.Model
	QuestionID uint
	Text       string `sql:"type:longtext"`
	IsCorrect  bool
	IsSelected bool
}

type RadioAnswer struct {
	gorm.Model
	QuestionID uint
	Text       string `sql:"type:longtext"`
	IsCorrect  bool
	IsSelected bool
}

type CodeAnswer struct {
	gorm.Model
	QuestionID uint
	Text       string `sql:"type:longtext"`
	IsCorrect  bool
}

type FlowDiagramAnswer struct {
	gorm.Model
	QuestionID uint
	Text       string `sql:"type:longtext"`
	SVG        string `sql:"type:longtext"`
	IsCorrect  bool
}

func NewQuiz(u *User, noQ int) *Quiz {
	q := &Quiz{
		UserID:    u.ID,
		Name:      "Generated",
		Active:    true,
		Corrected: false,
	}

	db.Save(&q)

	var qts []QuestionTemplate

	db.
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

	sort.Sort(QuestionsByOrder(q.Questions))

	return q
}

func FindQuizByCriteria(qID, userID uint) Quiz {
	var q Quiz
	db.
		Model(Quiz{}).
		Preload("Questions").
		Preload("Questions.CheckboxAnswers").
		Preload("Questions.RadioAnswers").
		Preload("Questions.CodeAnswer").
		Preload("Questions.FlowDiagramAnswer").
		Preload("Questions.Feedback").
		Where("id = ?", qID).
		Where("user_id = ?", userID).
		First(&q)

	return q
}

func FindQuiz(id int) Quiz {
	var q Quiz
	db.
		Model(Quiz{}).
		Preload("Questions").
		Preload("Questions.CheckboxAnswers").
		Preload("Questions.RadioAnswers").
		Preload("Questions.CodeAnswer").
		Preload("Questions.FlowDiagramAnswer").
		Preload("Questions.Feedback").
		Preload("User").
		First(&q, id)

	return q
}

func FindQuizzes(pager Pager, qf QuizFilter, sorter Sorter) ([]Quiz, int) {
	queryBuilder := db.
		Model(Quiz{}).
		Preload("Questions").
		Preload("Questions.CheckboxAnswers").
		Preload("Questions.RadioAnswers").
		Preload("Questions.CodeAnswer").
		Preload("Questions.FlowDiagramAnswer").
		Preload("Questions.Feedback").
		Preload("User")

	queryBuilder = qf.AttachWhereClauses(queryBuilder)
	queryBuilder = sorter.AttachSorterClauses(queryBuilder)

	var qs []Quiz
	pager.AttachPagerClauses(queryBuilder).Find(&qs)

	var totalQs int
	queryBuilder.Count(&totalQs)

	return qs, totalQs
}

func FindStatsTotalAttempts() interface{} {
	var stats []struct {
		Date   time.Time
		Number int
	}

	db.Raw(`
SELECT 
	COUNT(*) as number,
	DATE(updated_at) as date
FROM quizzes
GROUP BY DATE(updated_at)
`).Scan(&stats)

	return stats
}

func FindStatsAvgResult() interface{} {
	var stats []struct {
		Date   time.Time
		Number float32
	}

	db.Raw("SELECT * FROM stats_avg_result").Scan(&stats)

	return stats
}

func FindStatsBestResult() interface{} {
	var stats []struct {
		Date   time.Time
		Number float32
	}

	db.Raw("SELECT * FROM stats_best_result").Scan(&stats)

	return stats
}

func (q *Question) AddFeedback(text string) error {
	qf := &QuestionFeedback{
		QuestionID: q.ID,
		Text:       text,
	}
	db.Save(&qf)

	q.Feedback = append(q.Feedback, qf)

	return nil
}

func (q *Question) SaveAnswer(r *http.Request) error {
	var err error

	switch q.Type {
	case 1:
		err = q.saveCheckboxes(r.Form["answer[]"])
	case 2:
		err = q.saveCode(r.FormValue("answer"))
	case 3:
		err = q.saveFlowDiagram(r.FormValue("flow_diagram_json"), r.FormValue("flow_diagram_svg"))
	case 4:
		err = q.saveRadios(r.FormValue("answer"))
	default:
		err = fmt.Errorf("unhandled question type %v", q.Type)
	}

	return err
}

func (q *Question) UpdateScore(score uint) {
	q.Score = score

	db.Debug().Model(q).
		Set("gorm:association_autoupdate", false).
		Update("score", q.Score)
}

func (q *Question) UpdateNotes(notes string) {
	q.Notes = notes

	db.Debug().Model(q).
		Set("gorm:association_autoupdate", false).
		Update("notes", q.Notes)
}

func (q *Quiz) UpdateScore() {
	totalWeight := uint(0)
	weightedScore := uint(0)
	for _, q := range q.Questions {
		weightedScore += q.Score * q.Weight
		totalWeight += q.Weight
	}

	if totalWeight == 0 {
		totalWeight = 1
	}

	q.Score = weightedScore / totalWeight
	db.Model(q).
		Set("gorm:association_autoupdate", false).
		Update("score", q.Score)
}

func (q *Quiz) MarkAsCorrected() {
	q.Corrected = true
	q.CorrectingBy = nil
	q.CorrectingByID = 0

	db.Model(q).
		Set("gorm:association_autoupdate", false).
		Update("corrected", q.Corrected).
		Update("correcting_by_id", q.CorrectingByID)
}

func (q *Quiz) StartCorrecting(u *User) {
	q.CorrectingByID = u.ID
	q.CorrectingBy = u

	db.Model(q).
		Set("gorm:association_autoupdate", false).
		Update("correcting_by_id", q.CorrectingByID)
}

func (q *Question) markCheckboxesAsSelected(ids []string) error {
	for _, a := range q.CheckboxAnswers {
		a.IsSelected = false
		for _, aID := range ids {
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
	db.Save(q)

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
		db.Save(&a)

		if a.IsCorrect != a.IsSelected {
			correct = false
		}
	}
	q.IsCorrect = correct
	if q.IsCorrect {
		q.Score = 100
	}
	q.IsAnswered = true
	db.Save(q)

	return nil
}

func (q *Question) saveCode(text string) error {
	q.CodeAnswer.Text = text
	q.IsAnswered = true
	db.Save(q)

	return nil
}

func (q *Question) saveFlowDiagram(json string, svg string) error {
	q.FlowDiagramAnswer.Text = json
	q.FlowDiagramAnswer.SVG = svg
	q.IsAnswered = true
	db.Save(q)

	return nil
}
