package webapp

import (
	"html/template"

	"github.com/gorilla/mux"
	"github.com/sirupsen/logrus"

	"github.com/calinpristavu/quizzer/model"
)

var LoggedIn map[string]*model.User

var g struct {
	templating *template.Template
}

func init() {
	LoggedIn = make(map[string]*model.User, 5)
	registerTemplates()
}

func Init(r *mux.Router) {
	registerRoutes(r)
}

func registerTemplates() {
	customFunctions := template.FuncMap{
		"raw": func(s string) template.HTML {
			return template.HTML(s)
		},
	}

	var err error
	g.templating, err = template.
		New("all").
		Funcs(customFunctions).
		ParseGlob("./templates/*.gohtml")
	if err != nil {
		logrus.Fatalf("could not load templates: %v", err)
	}
}

func registerRoutes(public *mux.Router) {
	public.HandleFunc("/login", login)
	public.HandleFunc("/login-guest", loginGuest)
	public.HandleFunc("/complete-registration", completeRegistration)

	quiz := public.NewRoute().Subrouter()
	quiz.Use(UserSession)
	quiz.HandleFunc("/question/{idx}", question)
	quiz.HandleFunc("/question/{idx}/feedback", addQuestionFeedback)
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

	api.Path("/new-api/question-template-tags").Methods("GET").HandlerFunc(getQuestionTemplateTags)

	api.Path("/new-api/users").Methods("GET").HandlerFunc(getUsers)
	api.Path("/new-api/users").Methods("POST").HandlerFunc(postUser)
	api.Path("/new-api/users-logged-in").Methods("GET").HandlerFunc(getUsersLoggedIn)
	api.Path("/new-api/users/{id}").Methods("GET").HandlerFunc(getUser)
	api.Path("/new-api/users/{id}").Methods("PATCH").HandlerFunc(patchUser)

	api.Path("/new-api/quizzes").Methods("GET").HandlerFunc(getQuizzes)

	// todo: the next 2 routes should contain the quizID
	api.Path("/new-api/quizzes/save-scores").Methods("POST").HandlerFunc(saveScores)
	api.Path("/new-api/quizzes/start-correcting").Methods("POST").HandlerFunc(startCorrecting)

	api.Path("/new-api/stats/quizzes-per-day").Methods("GET").HandlerFunc(statsTotalAttempts)
	api.Path("/new-api/stats/avg-result").Methods("GET").HandlerFunc(statsAvgResult)
	api.Path("/new-api/stats/best-result").Methods("GET").HandlerFunc(statsBestResult)

	api.Path("/new-api/recruitee/find-candidates").Methods("GET").HandlerFunc(getCandidatesFromRecruitee)
}
