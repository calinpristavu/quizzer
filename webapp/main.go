package webapp

import (
	"html/template"
	"log"

	"github.com/gorilla/mux"
	"github.com/jinzhu/gorm"
)

type handler struct {
	db         *gorm.DB
	templating struct {
		choiceQuestion      *template.Template
		textQuestion        *template.Template
		flowDiagramQuestion *template.Template
		finished            *template.Template
		quizHistory         *template.Template
		login               *template.Template
		home                *template.Template
		myAccount           *template.Template
	}
}

var h *handler

func Init(db *gorm.DB, r *mux.Router) {
	h = &handler{
		db: db,
	}

	registerRoutes(r)
	migrateDb()
	registerTemplates()
}

func registerTemplates() {
	var err error
	h.templating.choiceQuestion, err = template.ParseFiles("templates/choice_question.gohtml", "header.gohtml", "footer.gohtml")
	if err != nil {
		log.Fatalf("could not parse template: %v", err)
	}
	h.templating.textQuestion, err = template.ParseFiles("templates/text_question.gohtml", "header.gohtml", "footer.gohtml")
	if err != nil {
		log.Fatalf("could not parse template: %v", err)
	}
	h.templating.login, err = template.ParseFiles("templates/login.gohtml")
	if err != nil {
		log.Fatalf("could not parse template: %v", err)
	}
	h.templating.home, err = template.ParseFiles("templates/home.gohtml", "header.gohtml", "footer.gohtml")
	if err != nil {
		log.Fatalf("could not parse template: %v", err)
	}
	h.templating.myAccount, err = template.ParseFiles("templates/myAccount.gohtml", "header.gohtml", "footer.gohtml", "account_nav.gohtml")
	if err != nil {
		log.Fatalf("could not parse template: %v", err)
	}
	h.templating.flowDiagramQuestion, err = template.ParseFiles(
		"templates/flow_diagram_question.gohtml",
		"templates/flow_diagram_js.gohtml",
		"header.gohtml",
		"footer.gohtml",
	)
	if err != nil {
		log.Fatalf("could not parse template: %v", err)
	}
	h.templating.finished, err = template.ParseFiles(
		"templates/finished.gohtml",
		"templates/flow_diagram_js.gohtml",
		"header.gohtml",
		"footer.gohtml",
	)
	if err != nil {
		log.Fatalf("could not parse template: %v", err)
	}
	h.templating.quizHistory, err = template.ParseFiles(
		"templates/history.gohtml",
		"templates/flow_diagram_js.gohtml",
		"header.gohtml",
		"footer.gohtml",
		"account_nav.gohtml",
	)
	if err != nil {
		log.Fatalf("could not parse template: %v", err)
	}
}

func migrateDb() *gorm.DB {
	return h.db.AutoMigrate(
		&User{},
		&Quiz{},
		&Question{},
		&ChoiceAnswer{},
		&TextAnswer{},
		&FlowDiagramAnswer{},
		&QuizTemplate{},
		&QuestionTemplate{},
		&ChoiceAnswerTemplate{},
	)
}

func registerRoutes(r *mux.Router) {
	r.HandleFunc("/login", page)
	sr := r.NewRoute().Subrouter()
	sr.Use(AuthMiddleware)
	sr.HandleFunc("/question", question)
	sr.HandleFunc("/finished", finished)
	sr.HandleFunc("/quiz-history", history)
	sr.HandleFunc("/quiz-history/{id}", viewQuiz)
	sr.HandleFunc("/start", startQuiz)
	sr.HandleFunc("/", home)
	sr.HandleFunc("/me", myAccount)
	sr.HandleFunc("/logout", logout)
}
