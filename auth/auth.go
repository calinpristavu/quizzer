package auth

import (
	"html/template"
	"log"
	"net/http"

	"github.com/gorilla/mux"
)

type Login struct {
}

func Init(mux *mux.Router) *Login {
	l := &Login{}

	mux.HandleFunc("/login", l.page)

	return l
}

func (l *Login) page(w http.ResponseWriter, r *http.Request) {
	t, err := template.ParseFiles("auth/login.gtpl")
	if err != nil {
		log.Printf("could not parse template: %v", err)
	}

	t.Execute(w, nil)
}
