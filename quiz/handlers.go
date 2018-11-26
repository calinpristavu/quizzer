package quiz

import (
	"fmt"
	"html/template"
	"log"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
	"github.com/jinzhu/gorm"

	"github.com/calinpristavu/quizzer/user"
)

type handler struct {
	db         *gorm.DB
	templating struct {
		choiceQuestion      *template.Template
		textQuestion        *template.Template
		flowDiagramQuestion *template.Template
		finished            *template.Template
		quizHistory         *template.Template
	}
}

var h *handler

func Init(db *gorm.DB, r *mux.Router) {
	h = &handler{
		db: db,
	}

	r.HandleFunc("/question", question)
	r.HandleFunc("/finished", finished)
	r.HandleFunc("/quiz-history", history)
	r.HandleFunc("/quiz-history/{id}", viewQuiz)

	h.db.AutoMigrate(
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
	h.templating.choiceQuestion, err = template.ParseFiles("quiz/choice_question.gohtml", "header.gohtml", "footer.gohtml")
	if err != nil {
		log.Fatalf("could not parse template: %v", err)
	}

	h.templating.textQuestion, err = template.ParseFiles("quiz/text_question.gohtml", "header.gohtml", "footer.gohtml")
	if err != nil {
		log.Fatalf("could not parse template: %v", err)
	}

	h.templating.flowDiagramQuestion, err = template.ParseFiles(
		"quiz/flow_diagram_question.gohtml",
		"quiz/flow_diagram_js.gohtml",
		"header.gohtml",
		"footer.gohtml",
	)
	if err != nil {
		log.Fatalf("could not parse template: %v", err)
	}

	h.templating.finished, err = template.ParseFiles(
		"quiz/finished.gohtml",
		"quiz/flow_diagram_js.gohtml",
		"header.gohtml",
		"footer.gohtml",
	)
	if err != nil {
		log.Fatalf("could not parse template: %v", err)
	}

	h.templating.quizHistory, err = template.ParseFiles(
		"quiz/history.gohtml",
		"quiz/flow_diagram_js.gohtml",
		"header.gohtml",
		"footer.gohtml",
		"account_nav.gohtml",
	)
	if err != nil {
		log.Fatalf("could not parse template: %v", err)
	}
}

// fixme: This method looks ... like .. shit.
func question(w http.ResponseWriter, r *http.Request) {
	u := r.Context().Value("user")

	quiz := findActiveByUser(u.(*user.User))

	question, err := quiz.getNextQuestion()
	if err != nil {
		log.Println("No questions left. Redirecting to /finished")
		http.Redirect(w, r, "/finished", 302)
		return
	}

	if r.FormValue("answer[]") != "" {
		err = question.saveChoices(r.Form["answer[]"], &quiz)
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
		err = question.saveText(r.FormValue("answer"), &quiz)
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
		err = question.saveFlowDiagram(r.FormValue("flow_diagram"), &quiz)
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

	err = renderQuestion(question, u.(*user.User), w)
	if err != nil {
		log.Fatal(err)
	}
}

func finished(w http.ResponseWriter, r *http.Request) {
	u := r.Context().Value("user")

	quiz := findActiveByUser(u.(*user.User))

	if r.Method == http.MethodPost {
		quiz.close()

		http.Redirect(w, r, "/", 302)
		return
	}

	err := h.templating.finished.Execute(w, struct {
		Quiz Quiz
		User interface{}
	}{Quiz: quiz, User: u})
	if err != nil {
		log.Fatalf("could not execute template: %v", err)
	}
}

func history(w http.ResponseWriter, r *http.Request) {
	u := r.Context().Value("user")

	qs := findAllFinishedForUser(u.(*user.User))

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

	qs := findAllFinishedForUser(u.(*user.User))

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

func renderQuestion(q *Question, u *user.User, w http.ResponseWriter) error {
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
