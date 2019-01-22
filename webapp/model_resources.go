package webapp

import "github.com/jinzhu/gorm"

type QuizTemplate struct {
	gorm.Model
	Name          string
	QuizQuestions []*QuizQuestionTemplate `gorm:"foreignkey:QuizID"`
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

func (qt QuizTemplate) start(u *User) *Quiz {
	q := &Quiz{
		UserID:         u.ID,
		Name:           qt.Name,
		Active:         true,
		QuizTemplateID: qt.ID,
	}

	g.db.Save(&q)

	for _, qq := range qt.QuizQuestions {
		qq.Question.addToQuiz(q)
	}

	return q
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
	for _, cat := range qt.CheckboxAnswerTemplates {
		ca := &CheckboxAnswer{
			QuestionID: q.ID,
			Text:       cat.Text,
			IsCorrect:  cat.IsCorrect,
			IsSelected: false,
		}
		g.db.Save(&ca)
		q.CheckboxAnswers = append(q.CheckboxAnswers, ca)
	}
	for _, rat := range qt.RadioAnswerTemplates {
		ra := &RadioAnswer{
			QuestionID: q.ID,
			Text:       rat.Text,
			IsCorrect:  rat.IsCorrect,
			IsSelected: false,
		}
		g.db.Save(&ra)
		q.RadioAnswers = append(q.RadioAnswers, ra)
	}

	quiz.Questions = append(quiz.Questions, q)
}
