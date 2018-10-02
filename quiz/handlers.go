package quiz

import (
	"fmt"
	"html/template"
	"log"
	"net/http"

	"github.com/calinpristavu/quizzer/user"
	"github.com/gorilla/mux"
	"github.com/jinzhu/gorm"
)

type handler struct {
	db         *gorm.DB
	templating struct {
		question *template.Template
		finished *template.Template
	}
}

var h *handler

func Init(db *gorm.DB, r *mux.Router) {
	h = &handler{
		db: db,
	}

	r.HandleFunc("/question", question)
	r.HandleFunc("/finished", finished)

	h.db.AutoMigrate(&Quiz{}, &Question{}, &Answer{}, &AnsweredQuestion{})

	var err error
	h.templating.question, err = template.ParseFiles("quiz/question.gtpl", "header.gtpl", "footer.gtpl")
	if err != nil {
		log.Fatalf("could not parse template: %v", err)
	}

	h.templating.finished, err = template.ParseFiles("quiz/finished.gtpl", "header.gtpl", "footer.gtpl")
	if err != nil {
		log.Fatalf("could not parse template: %v", err)
	}
}

func question(w http.ResponseWriter, r *http.Request) {
	u := r.Context().Value("user")

	quiz := findActiveByUser(u.(*user.User))

	question, err := quiz.getNextQuestion()
	if err != nil {
		http.Redirect(w, r, "/finished", http.StatusMovedPermanently)
		return
	}

	if r.FormValue("answer[]") != "" {
		err = question.saveAnswersForQuiz(r.Form["answer[]"], &quiz)
		if err != nil {
			fmt.Fprintf(w, "could not save answers: %v", err)
		}

		question, err = quiz.getNextQuestion()
		if err != nil {
			http.Redirect(w, r, "/finished", http.StatusMovedPermanently)
			return
		}
	}

	err = h.templating.question.Execute(w, question)
	if err != nil {
		fmt.Fprintf(w, "could not execute template: %v", err)
	}
}

func finished(w http.ResponseWriter, r *http.Request) {
	u := r.Context().Value("user")

	quiz := findActiveByUser(u.(*user.User))

	if r.Method == http.MethodPost {
		quiz.close()

		http.Redirect(w, r, "/", http.StatusMovedPermanently)
		return
	}

	err := h.templating.finished.Execute(w, quiz)
	if err != nil {
		fmt.Fprintf(w, "could not execute template: %v", err)
	}
}
