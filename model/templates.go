package model

import (
	"time"

	"github.com/jinzhu/gorm"
)

type QuizTemplate struct {
	gorm.Model
	Name          string
	QuizQuestions []*QuizQuestionTemplate `gorm:"foreignkey:QuizID"`
	Duration      Duration                `sql:"type:VARCHAR(50)"`
}

type QuestionTemplate struct {
	gorm.Model
	Text                      string `sql:"type:longtext"`
	Type                      uint
	QuizQuestions             []*QuizQuestionTemplate `gorm:"foreignkey:QuestionID"`
	CheckboxAnswerTemplates   []*CheckboxAnswerTemplate
	RadioAnswerTemplates      []*RadioAnswerTemplate
	FlowDiagramAnswerTemplate *FlowDiagramAnswerTemplate
	Usages                    []Question
}

type QuizQuestionTemplate struct {
	ID         uint
	Quiz       *QuizTemplate
	QuizID     uint
	Question   *QuestionTemplate
	QuestionID uint
	Weight     uint
}

type CheckboxAnswerTemplate struct {
	gorm.Model
	QuestionTemplateID uint
	Text               string
	IsCorrect          bool
}

type RadioAnswerTemplate struct {
	gorm.Model
	QuestionTemplateID uint
	Text               string
	IsCorrect          bool
}

type FlowDiagramAnswerTemplate struct {
	gorm.Model
	QuestionTemplateID uint
	Text               string
}

func (qt QuizTemplate) Start(u *User) *Quiz {
	q := &Quiz{
		UserID:         u.ID,
		Name:           qt.Name,
		Active:         true,
		QuizTemplateID: qt.ID,
		Duration:       qt.Duration,
		// Corrected:      false,
	}

	db.Save(&q)

	for _, qq := range qt.QuizQuestions {
		qq.Question.addToQuiz(q, qq.Weight)
	}

	return q
}

func FindQuizTemplate(id int) (QuizTemplate, bool) {
	var qt QuizTemplate
	res := db.
		Model(&qt).
		Preload("QuizQuestions").
		Preload("QuizQuestions.Question").
		Preload("QuizQuestions.Question.CheckboxAnswerTemplates").
		Preload("QuizQuestions.Question.RadioAnswerTemplates").
		Preload("QuizQuestions.Question.FlowDiagramAnswerTemplate").
		First(&qt, id)

	return qt, !res.RecordNotFound()
}

func FindQuizTemplates() []QuizTemplate {
	var qts []QuizTemplate
	db.
		Model(&qts).
		Preload("QuizQuestions").
		Preload("QuizQuestions.Question").
		Preload("QuizQuestions.Question.CheckboxAnswerTemplates").
		Preload("QuizQuestions.Question.RadioAnswerTemplates").
		Preload("QuizQuestions.Question.FlowDiagramAnswerTemplate").
		Find(&qts)

	return qts
}

func FindQuestionTemplate(id uint) (QuestionTemplate, bool) {
	var qt QuestionTemplate
	res := db.
		Model(&qt).
		Preload("CheckboxAnswerTemplates").
		Preload("RadioAnswerTemplates").
		Preload("FlowDiagramAnswerTemplate").
		Preload("Usages").
		First(&qt, id)

	return qt, !res.RecordNotFound()
}

func FindQuestionTemplates() []QuestionTemplate {
	var qts []QuestionTemplate
	db.
		Preload("QuizQuestions").
		Preload("QuizQuestions.Quiz").
		Preload("CheckboxAnswerTemplates").
		Preload("RadioAnswerTemplates").
		Preload("FlowDiagramAnswerTemplate").
		Preload("Usages").
		Preload("Usages.Feedback").
		Order("id desc").
		Find(&qts)

	return qts
}

func (qt QuestionTemplate) addToQuiz(quiz *Quiz, weight uint) {
	q := &Question{
		IsAnswered:         false,
		QuizID:             quiz.ID,
		Text:               qt.Text,
		Type:               qt.Type,
		QuestionTemplateID: qt.ID,
		Weight:             weight,
		Notes:              "",
	}

	db.Save(&q)

	q.TextAnswer = &TextAnswer{Text: "", QuestionID: q.ID}
	q.FlowDiagramAnswer = &FlowDiagramAnswer{Text: "", SVG: "", QuestionID: q.ID}
	for _, cat := range qt.CheckboxAnswerTemplates {
		ca := &CheckboxAnswer{
			QuestionID: q.ID,
			Text:       cat.Text,
			IsCorrect:  cat.IsCorrect,
			IsSelected: false,
		}
		db.Save(&ca)
		q.CheckboxAnswers = append(q.CheckboxAnswers, ca)
	}
	for _, rat := range qt.RadioAnswerTemplates {
		ra := &RadioAnswer{
			QuestionID: q.ID,
			Text:       rat.Text,
			IsCorrect:  rat.IsCorrect,
			IsSelected: false,
		}
		db.Save(&ra)
		q.RadioAnswers = append(q.RadioAnswers, ra)
	}

	quiz.Questions = append(quiz.Questions, q)
}

func (qt *QuizTemplate) Create() {
	qt.CreatedAt = time.Now()
	db.Create(qt)
}

func (qt *QuizTemplate) Delete() {
	db.Delete(qt, qt.ID)
}

func (qt *QuestionTemplate) Create() {
	qt.CreatedAt = time.Now()
	db.Create(qt)
}

func (qt *QuestionTemplate) Delete() {
	db.Delete(qt, qt.ID)
}

func (qt *QuizTemplate) Save() {
	db.Set("gorm:association_autoupdate", false).Save(qt)
	db.Model(qt).
		Association("QuizQuestions").
		Replace(qt.QuizQuestions)
}

func (qt *QuestionTemplate) Save() {
	db.Set("gorm:association_autoupdate", false).Save(qt)
	db.Model(qt).Association("CheckboxAnswerTemplates").Replace(qt.CheckboxAnswerTemplates)
	db.Model(qt).Association("RadioAnswerTemplates").Replace(qt.RadioAnswerTemplates)
	db.Model(qt).Association("FlowDiagramAnswerTemplate").Replace(qt.FlowDiagramAnswerTemplate)
}