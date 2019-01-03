package webapp

import (
	"log"
	"net/http"
	"strconv"
	"time"

	"github.com/gorilla/mux"
)

func startQuiz(w http.ResponseWriter, r *http.Request) {
	u := r.Context().Value("user").(*User)

	if id, ok := mux.Vars(r)["id"]; ok {
		intId, err := strconv.Atoi(id)
		if err != nil {
			log.Fatalf("cannot interpret %s as int: %v", id, err)
		}

		var qt QuizTemplate

		g.db.
			Preload("Questions").
			Preload("Questions.ChoiceAnswerTemplates").
			Preload("Questions.FlowDiagramAnswerTemplate").
			First(&qt, intId)

		u.CurrentQuiz = qt.start(u)
	} else {
		u.CurrentQuiz = newQuiz(u, questionsPerQuiz)
	}

	u.CurrentQuizID = &u.CurrentQuiz.ID
	g.db.Save(&u)

	http.Redirect(w, r, "/question", 302)
}

func getQuestion(w http.ResponseWriter, r *http.Request) {
	u := r.Context().Value("user").(*User)

	quiz := u.CurrentQuiz
	if quiz == nil {
		log.Printf("no active quiz for user %s\n", u.Username)
		http.Redirect(w, r, "/", 302)

		return
	}

	question, err := quiz.getNextQuestion()
	if err != nil {
		log.Printf("No questions left. Redirecting to /finished: %v \n", err)
		http.Redirect(w, r, "/finished", 302)
		return
	}

	switch question.Type {
	case 1:
		choiceQuestion(w, r, question)
		break
	case 2:
		textQuestion(w, r, question)
		break
	case 3:
		flowDiagramQuestion(w, r, question)
		break
	default:
		log.Fatalf("unhandled question type %v", question.Type)
		break
	}
}

func choiceQuestion(w http.ResponseWriter, r *http.Request, question *Question) {
	u := r.Context().Value("user").(*User)

	quiz := u.CurrentQuiz

	var err error

	if r.Method == http.MethodPost {
		err = r.ParseForm()
		if err != nil {
			log.Fatalf("could not parse form: %v", err)
		}
		err = question.saveChoices(r.Form["answer[]"], quiz)
		if err != nil {
			log.Fatalf("could not save answers: %v", err)
		}

		r.Method = http.MethodGet
		getQuestion(w, r)

		return
	}

	err = g.templating.Lookup("choice_question.gohtml").Execute(w, struct {
		Question Question
		User     interface{}
	}{Question: *question, User: u})

	if err != nil {
		log.Fatalf("could not render choice question template: %v", err)
	}
}

func textQuestion(w http.ResponseWriter, r *http.Request, question *Question) {
	u := r.Context().Value("user").(*User)

	quiz := u.CurrentQuiz

	var err error

	if r.Method == http.MethodPost {
		err = r.ParseForm()
		if err != nil {
			log.Fatalf("could not parse form: %v", err)
		}
		err = question.saveText(r.FormValue("answer"), quiz)
		if err != nil {
			log.Fatalf("could not save answer: %v", err)
		}

		r.Method = http.MethodGet
		getQuestion(w, r)

		return
	}

	err = g.templating.Lookup("text_question.gohtml").Execute(w, struct {
		Question Question
		User     interface{}
	}{Question: *question, User: u})

	if err != nil {
		log.Fatalf("could not render text question template: %v", err)
	}
}

func flowDiagramQuestion(w http.ResponseWriter, r *http.Request, question *Question) {
	u := r.Context().Value("user").(*User)

	quiz := u.CurrentQuiz

	var err error

	if r.Method == http.MethodPost {
		err = r.ParseForm()
		if err != nil {
			log.Fatalf("could not parse form: %v", err)
		}
		err = question.saveFlowDiagram(
			r.FormValue("flow_diagram_json"),
			r.FormValue("flow_diagram_svg"),
			quiz,
		)
		if err != nil {
			log.Fatalf("could not save answer: %v", err)
		}

		r.Method = http.MethodGet
		getQuestion(w, r)

		return
	}

	err = g.templating.Lookup("flow_diagram_question.gohtml").Execute(w, struct {
		Question Question
		User     interface{}
	}{Question: *question, User: u})

	if err != nil {
		log.Fatalf("could not render flow diagram question template: %v", err)
	}
}

func finished(w http.ResponseWriter, r *http.Request) {
	u := r.Context().Value("user").(*User)

	quiz := u.CurrentQuiz

	if r.Method == http.MethodPost {
		u.finishQuiz()

		http.Redirect(w, r, "/", 302)
		return
	}

	err := g.templating.Lookup("finished.gohtml").Execute(w, struct {
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

	err := g.templating.Lookup("history.gohtml").Execute(w, struct {
		Quizzes []Quiz
		Current *Quiz
		User    interface{}
	}{Quizzes: qs, User: u, Current: nil})
	if err != nil {
		log.Fatalf("could not execute template: %v", err)
	}
}

func viewQuiz(w http.ResponseWriter, r *http.Request) {
	u := r.Context().Value("user").(*User)
	vars := mux.Vars(r)
	id, _ := strconv.Atoi(vars["id"])

	qs := findAllFinishedForUser(u)

	current := find(id)
	err := g.templating.Lookup("history.gohtml").Execute(w, struct {
		Quizzes []Quiz
		Current *Quiz
		User    User
	}{
		Quizzes: qs,
		Current: &current,
		User:    *u,
	})
	if err != nil {
		log.Fatalf("could not execute template: %v", err)
	}
}

func home(w http.ResponseWriter, r *http.Request) {
	u := r.Context().Value("user").(*User)

	if u.CurrentQuiz != nil {
		http.Redirect(w, r, "/question", 301)

		return
	}

	var qts []QuizTemplate
	g.db.
		Preload("Questions").
		Find(&qts)

	err := g.templating.Lookup("home.gohtml").Execute(w, struct {
		User    User
		Quizzes []QuizTemplate
	}{User: *u, Quizzes: qts})

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
	u := r.Context().Value("user").(*User)

	if r.FormValue("save") != "" {
		u.Username = r.FormValue("username")
		u.Save()
	}

	err := g.templating.Lookup("my_account.gohtml").Execute(w, struct {
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
				Name:  "user",
				Value: u.Username,
			}
			http.SetCookie(w, cookie)

			http.Redirect(w, r, "/", 301)
			return
		}

		errors = append(errors, "Invalid username or password.")
	}

	err := g.templating.Lookup("login.gohtml").Execute(w, struct {
		Errors   []string
		PrevData struct {
			Username string
		}
	}{Errors: errors, PrevData: struct{ Username string }{Username: uname}})

	if err != nil {
		log.Fatalf("could not exec template login: %v", err)
	}
}
