package quiz

import "github.com/jinzhu/gorm"

type QuizTemplate struct {
	gorm.Model
	Name      string
	Questions []*QuestionTemplate `gorm:"many2many:quiz_quesiton_templates;"`
}

type QuestionTemplate struct {
	gorm.Model
	Text                  string
	Type                  uint // choice / text / ...
	ChoiceAnswerTemplates []*ChoiceAnswerTemplate
}

type ChoiceAnswerTemplate struct {
	gorm.Model
	QuestionTemplateID uint
	Text               string
	IsCorrect          bool
}
