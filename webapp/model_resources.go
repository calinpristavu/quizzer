package webapp

import "github.com/jinzhu/gorm"

type QuizTemplate struct {
	gorm.Model
	Name      string
	Questions []*QuestionTemplate `gorm:"many2many:quiz_quesiton_templates;association_autoupdate:false;"`
}

type QuestionTemplate struct {
	gorm.Model
	Text                      string `sql:"type:longtext"`
	Type                      uint   // choice / text / ...
	ChoiceAnswerTemplates     []*ChoiceAnswerTemplate
	FlowDiagramAnswerTemplate *FlowDiagramAnswerTemplate
	Usages                    []Question
}

type ChoiceAnswerTemplate struct {
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

	for _, questionTemplate := range qt.Questions {
		questionTemplate.addToQuiz(q)
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
