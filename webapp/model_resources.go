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
		UserID: u.ID,
		Name:   qt.Name,
		Active: true,
	}

	g.db.Save(&q)

	for _, questionTemplate := range qt.Questions {
		questionTemplate.addToQuiz(q)
	}

	return q
}
