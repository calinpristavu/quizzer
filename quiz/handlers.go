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

	h.db.AutoMigrate(&Quiz{}, &Question{}, &Answer{})
}

func question(w http.ResponseWriter, r *http.Request) {
	u := r.Context().Value("user").(*user.User)

	q := findActiveByUser(u)

	t, err := template.ParseFiles("quiz/question.gtpl")
	if err != nil {
		fmt.Fprintf(w, "could not parse template: %v", err)
	}

	err = t.Execute(w, q)
	if err != nil {
		fmt.Fprintf(w, "could not execute template: %v", err)
	}
}
