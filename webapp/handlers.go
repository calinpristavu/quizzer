package webapp

import (
	"fmt"
	"html/template"
	"log"
	"net/http"
	"strconv"
	"time"

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

	h.db.AutoMigrate(
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

func startQuiz(w http.ResponseWriter, r *http.Request) {
	u := r.Context().Value("user").(*User)

	u.CurrentQuiz = newQuiz(u, questionsPerQuiz)
	h.db.Save(&u)

	http.Redirect(w, r, "/question", 302)
}

// fixme: This method looks ... like .. shit.
func question(w http.ResponseWriter, r *http.Request) {
	u := r.Context().Value("user").(*User)

	quiz := u.CurrentQuiz
	if quiz == nil {
		log.Printf("no active quiz for user %s\n", u.Username)
		http.Redirect(w, r, "/", 302)

		return
	}

	question, err := quiz.getNextQuestion()
	if err != nil {
		log.Println("No questions left. Redirecting to /finished")
		http.Redirect(w, r, "/finished", 302)
		return
	}

	if r.FormValue("answer[]") != "" {
		err = question.saveChoices(r.Form["answer[]"], quiz)
		if err != nil {
			log.Fatalf("could not save answers: %v", err)
		}

		question, err = quiz.getNextQuestion()
		if err != nil {
			log.Println("No questions left. Redirecting to /finished")
			http.Redirect(w, r, "/finished", 302)
			return
		}
	}

	if r.FormValue("answer") != "" {
		err = question.saveText(r.FormValue("answer"), quiz)
		if err != nil {
			log.Fatalf("could not save answer: %v", err)
		}

		question, err = quiz.getNextQuestion()
		if err != nil {
			log.Println("No questions left. Redirecting to /finished")
			http.Redirect(w, r, "/finished", 302)
			return
		}
	}

	if r.FormValue("flow_diagram") != "" {
		log.Println(r.FormValue("flow_diagram"))
		err = question.saveFlowDiagram(r.FormValue("flow_diagram"), quiz)
		if err != nil {
			log.Fatalf("could not save answer: %v", err)
		}

		question, err = quiz.getNextQuestion()
		if err != nil {
			log.Println("No questions left. Redirecting to /finished")
			http.Redirect(w, r, "/finished", 302)
			return
		}
	}

	err = renderQuestion(question, u, w)
	if err != nil {
		log.Fatal(err)
	}
}

func finished(w http.ResponseWriter, r *http.Request) {
	u := r.Context().Value("user").(*User)

	quiz := u.CurrentQuiz

	if r.Method == http.MethodPost {
		quiz.close()
		h.db.Model(&u).Association("CurrentQuiz").Clear()

		http.Redirect(w, r, "/", 302)
		return
	}

	err := h.templating.finished.Execute(w, struct {
		Quiz Quiz
		User interface{}
	}{Quiz: *quiz, User: u})
	if err != nil {
		log.Fatalf("could not execute template: %v", err)
	}
}

func history(w http.ResponseWriter, r *http.Request) {
	u := r.Context().Value("user")

	qs := findAllFinishedForUser(u.(*User))

	err := h.templating.quizHistory.Execute(w, struct {
		Quizzes []Quiz
		Current *Quiz
		User    interface{}
	}{Quizzes: qs, User: u, Current: nil})
	if err != nil {
		log.Fatalf("could not execute template: %v", err)
	}
}

func viewQuiz(w http.ResponseWriter, r *http.Request) {
	u := r.Context().Value("user")
	vars := mux.Vars(r)
	id, _ := strconv.Atoi(vars["id"])

	qs := findAllFinishedForUser(u.(*User))

	err := h.templating.quizHistory.Execute(w, struct {
		Quizzes []Quiz
		Current Quiz
		User    interface{}
	}{
		Quizzes: qs,
		User:    u,
		Current: find(id),
	})
	if err != nil {
		log.Fatalf("could not execute template: %v", err)
	}
}

func renderQuestion(q *Question, u *User, w http.ResponseWriter) error {
	switch q.Type {
	case 1:
		return h.templating.choiceQuestion.Execute(w, struct {
			Question Question
			User     interface{}
		}{Question: *q, User: u})
	case 2:
		return h.templating.textQuestion.Execute(w, struct {
			Question Question
			User     interface{}
		}{Question: *q, User: u})
	case 3:
		return h.templating.flowDiagramQuestion.Execute(w, struct {
			Question Question
			User     interface{}
		}{Question: *q, User: u})
	default:
		return fmt.Errorf("unhandled question type %v", q.Type)
	}
}

func home(w http.ResponseWriter, r *http.Request) {
	u := r.Context().Value("user").(*User)

	if u.CurrentQuiz != nil {
		http.Redirect(w, r, "/question", 301)

		return
	}

	err := h.templating.home.Execute(w, struct {
		User User
	}{User: *u})

	if err != nil {
		log.Printf("could not render template: %v", err)
	}
}

func logout(w http.ResponseWriter, r *http.Request) {
	cookie, err := r.Cookie("user")
	if err == nil {
		delete(LoggedIn, cookie.Value)
	}
	http.SetCookie(w, &http.Cookie{
		Name:    "user",
		Value:   "",
		Expires: time.Now(),
	})

	http.Redirect(w, r, "/login", 301)
}

func myAccount(w http.ResponseWriter, r *http.Request) {
	validationErrors := make(map[string]interface{}, 1)
	u := r.Context().Value("user")

	if r.FormValue("save") != "" {
		u.(*User).Username = r.FormValue("username")
		u.(*User).Save()
	}

	err := h.templating.myAccount.Execute(w, struct {
		User   interface{}
		Errors map[string]interface{}
	}{
		User:   u,
		Errors: validationErrors,
	})

	if err != nil {
		log.Printf("could not render template: %v", err)
	}
}

func page(w http.ResponseWriter, r *http.Request) {
	var errors []string

	uname := r.FormValue("username")

	if r.FormValue("username") != "" {
		pass := r.FormValue("password")

		u, err := FindByUsernameAndPassword(uname, pass)
		if err == nil {
			LoggedIn[uname] = u

			cookie := &http.Cookie{
				Domain: "localhost",
				Name:   "user",
				Value:  u.Username,
			}
			http.SetCookie(w, cookie)

			http.Redirect(w, r, "/", 301)
			return
		}

		errors = append(errors, "Invalid username or password.")
	}

	err := h.templating.login.Execute(w, struct {
		Errors   []string
		PrevData struct {
			Username string
		}
	}{Errors: errors, PrevData: struct{ Username string }{Username: uname}})

	if err != nil {
		log.Fatalf("could not exec template login: %v", err)
	}
}
