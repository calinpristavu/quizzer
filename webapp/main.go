package webapp

import (
	"html/template"

	"github.com/gorilla/mux"
	"github.com/jinzhu/gorm"
)

type globals struct {
	db         *gorm.DB
	templating *template.Template
}

var g *globals

func Init(db *gorm.DB, r *mux.Router) {
	g = &globals{
		db: db,
	}

	registerRoutes(r)
	migrateDb()
	registerTemplates()
}

func registerTemplates() {
	customFunctions := template.FuncMap{
		"raw": func(s string) template.HTML {
			return template.HTML(s)
		},
	}

	g.templating = template.Must(
		template.
			New("all").
			Funcs(customFunctions).
			ParseGlob("./templates/*.gohtml"),
	)
}

func migrateDb() *gorm.DB {
	return g.db.AutoMigrate(
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
	public.HandleFunc("/login", login)
	public.HandleFunc("/complete-registration", completeRegistration)

	quiz := public.NewRoute().Subrouter()
	quiz.Use(UserSession)
	quiz.HandleFunc("/question/{idx}", question)
	quiz.HandleFunc("/finished", finished)
	quiz.HandleFunc("/quiz-history", history)
	quiz.HandleFunc("/quiz-history/{id}", viewQuiz)
	quiz.HandleFunc("/start", startQuiz)
	quiz.HandleFunc("/start/{id}", startQuiz)
	quiz.HandleFunc("/", home)
	quiz.HandleFunc("/me", myAccount)
	quiz.HandleFunc("/logout", logout)

	apiJwt := public.NewRoute().Subrouter()
	apiJwt.Path("/new-api/token").Methods("POST").HandlerFunc(postToken)

	api := public.NewRoute().Subrouter()
	api.Use(ValidateJwtToken)
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
	api.Path("/new-api/users").Methods("POST").HandlerFunc(postUsers)
	api.Path("/new-api/users-logged-in").Methods("GET").HandlerFunc(getUsersLoggedIn)
	api.Path("/new-api/users/{id}").Methods("GET").HandlerFunc(getUser)

	api.Path("/new-api/quizzes").Methods("GET").HandlerFunc(getQuizzes)
	api.Path("/new-api/quizzes/save-scores").Methods("POST").HandlerFunc(saveScores)

	api.Path("/new-api/stats/quizzes-per-day").Methods("GET").HandlerFunc(statsTotalAttempts)
	api.Path("/new-api/stats/avg-result").Methods("GET").HandlerFunc(statsAvgResult)
	api.Path("/new-api/stats/best-result").Methods("GET").HandlerFunc(statsBestResult)
}
