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
	h.templating.choiceQuestion, err = template.ParseFiles(
		"templates/choice_question.gohtml",
		"templates/header.gohtml",
		"templates/footer.gohtml",
	)
	if err != nil {
		log.Fatalf("could not parse template: %v", err)
	}
	h.templating.textQuestion, err = template.ParseFiles(
		"templates/text_question.gohtml",
		"templates/header.gohtml",
		"templates/footer.gohtml",
	)
	if err != nil {
		log.Fatalf("could not parse template: %v", err)
	}
	h.templating.login, err = template.ParseFiles("templates/login.gohtml")
	if err != nil {
		log.Fatalf("could not parse template: %v", err)
	}
	h.templating.home, err = template.ParseFiles(
		"templates/home.gohtml",
		"templates/header.gohtml",
		"templates/footer.gohtml",
	)
	if err != nil {
		log.Fatalf("could not parse template: %v", err)
	}
	h.templating.myAccount, err = template.ParseFiles(
		"templates/myAccount.gohtml",
		"templates/header.gohtml",
		"templates/footer.gohtml",
		"templates/account_nav.gohtml",
	)
	if err != nil {
		log.Fatalf("could not parse template: %v", err)
	}
	h.templating.flowDiagramQuestion, err = template.ParseFiles(
		"templates/flow_diagram_question.gohtml",
		"templates/flow_diagram_js.gohtml",
		"templates/header.gohtml",
		"templates/footer.gohtml",
	)
	if err != nil {
		log.Fatalf("could not parse template: %v", err)
	}
	h.templating.finished, err = template.ParseFiles(
		"templates/finished.gohtml",
		"templates/flow_diagram_js.gohtml",
		"templates/header.gohtml",
		"templates/footer.gohtml",
	)
	if err != nil {
		log.Fatalf("could not parse template: %v", err)
	}
	h.templating.quizHistory, err = template.ParseFiles(
		"templates/history.gohtml",
		"templates/flow_diagram_js.gohtml",
		"templates/header.gohtml",
		"templates/footer.gohtml",
		"templates/account_nav.gohtml",
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
		&FlowDiagramAnswerTemplate{},
	)
}

func registerRoutes(public *mux.Router) {
	public.HandleFunc("/login", page)

	quiz := public.NewRoute().Subrouter()
	quiz.Use(UserSession)
	quiz.Use(RoleUser)
	quiz.HandleFunc("/question", getQuestion)
	quiz.HandleFunc("/finished", finished)
	quiz.HandleFunc("/quiz-history", history)
	quiz.HandleFunc("/quiz-history/{id}", viewQuiz)
	quiz.HandleFunc("/start", startQuiz)
	quiz.HandleFunc("/start/{id}", startQuiz)
	quiz.HandleFunc("/", home)
	quiz.HandleFunc("/me", myAccount)
	quiz.HandleFunc("/logout", logout)

	api := public.NewRoute().Subrouter()
	api.Path("/new-api/quiz-templates").Methods("GET").HandlerFunc(getQuizTemplates)
	api.Path("/new-api/quiz-templates").Methods("POST").HandlerFunc(postQuizTemplates)
	api.Path("/new-api/quiz-templates/{id}").Methods("GET").HandlerFunc(getQuizTemplate)
	api.Path("/new-api/quiz-templates/{id}").Methods("PUT").HandlerFunc(putQuizTemplate)
	api.Path("/new-api/quiz-templates/{id}").Methods("DELETE").HandlerFunc(deleteQuizTemplate)

	api.Path("/new-api/question-templates").Methods("GET").HandlerFunc(getQuestionTemplates)
	api.Path("/new-api/question-templates").Methods("POST").HandlerFunc(postQuestionTemplates)
	api.Path("/new-api/question-templates/{id}").Methods("GET").HandlerFunc(getQuestionTemplate)
	api.Path("/new-api/question-templates/{id}").Methods("PUT").HandlerFunc(putQuestionTemplate)
	api.Path("/new-api/question-templates/{id}").Methods("DELETE").HandlerFunc(deleteQuestionTemplate)

	api.Path("/new-api/users").Methods("GET").HandlerFunc(getUsers)
	api.Path("/new-api/users-logged-in").Methods("GET").HandlerFunc(getUsersLoggedIn)
	api.Path("/new-api/users/{id}").Methods("GET").HandlerFunc(getUser)

	api.Path("/new-api/quizzes").Methods("GET").HandlerFunc(getQuizzes)
}
