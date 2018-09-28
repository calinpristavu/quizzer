package quiz

import (
	"fmt"
	"html/template"
	"net/http"

	"github.com/calinpristavu/quizzer/user"
	"github.com/gorilla/mux"
	"github.com/jinzhu/gorm"
)

type handler struct {
	db *gorm.DB
}

var h *handler

func Init(db *gorm.DB, r *mux.Router) {
	h = &handler{
		db: db,
	}

	r.HandleFunc("/question", question)

	h.db.AutoMigrate(&Quiz{}, &Question{}, &Answer{}, &AnsweredQuestion{})
}

func question(w http.ResponseWriter, r *http.Request) {
	u := r.Context().Value("user")
	fmt.Printf("user %T \n", u)

	quiz := findActiveByUser(u.(*user.User))

	t, err := template.ParseFiles("quiz/question.gtpl", "header.gtpl", "footer.gtpl")
	if err != nil {
		fmt.Fprintf(w, "could not parse template: %v", err)
	}

	question, err := quiz.getNextQuestion()
	if err != nil {
		fmt.Fprintf(w, "could not fetch next q: %v", err)

		return
	}

	if r.FormValue("answer[]") != "" {
		err = question.saveAnswersForQuiz(r.Form["answer[]"], quiz)
		if err != nil {
			fmt.Fprintf(w, "could not save answers: %v", err)
		}

		question, err = quiz.getNextQuestion()
		if err != nil {
			fmt.Fprintf(w, "could not fetch next q: %v", err)

			return
		}
	}

	err = t.Execute(w, question)
	if err != nil {
		fmt.Fprintf(w, "could not execute template: %v", err)
	}
}
