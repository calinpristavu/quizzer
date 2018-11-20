package quiz

import (
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
		question    *template.Template
		finished    *template.Template
		quizHistory *template.Template
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
		&QuestionTemplate{},
		&ChoiceAnswerTemplate{},
	)

	var err error
	h.templating.question, err = template.ParseFiles("quiz/question.gohtml", "header.gohtml", "footer.gohtml")
	if err != nil {
		log.Fatalf("could not parse template: %v", err)
	}

	h.templating.finished, err = template.ParseFiles("quiz/finished.gohtml", "header.gohtml", "footer.gohtml")
	if err != nil {
		log.Fatalf("could not parse template: %v", err)
	}

	h.templating.quizHistory, err = template.ParseFiles("quiz/history.gohtml", "header.gohtml", "footer.gohtml", "account_nav.gohtml")
	if err != nil {
		log.Fatalf("could not parse template: %v", err)
	}
}

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
		err = question.saveAnswersForQuiz(r.Form["answer[]"], &quiz)
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

	err = h.templating.question.Execute(w, struct {
		Question Question
		User     interface{}
	}{Question: *question, User: u})
	if err != nil {
		log.Fatalf("could not execute template: %v", err)
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
