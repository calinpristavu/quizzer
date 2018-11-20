package auth

import (
	"html/template"
	"log"
	"net/http"

	"github.com/calinpristavu/quizzer/user"

	"github.com/gorilla/mux"
)

var templating struct {
	login *template.Template
}

func Init(mux *mux.Router) {
	mux.HandleFunc("/login", page)

	var err error
	templating.login, err = template.ParseFiles("auth/login.gohtml")
	if err != nil {
		log.Fatalf("could not parse template: %v", err)
	}
}

func page(w http.ResponseWriter, r *http.Request) {
	var errors []string

	uname := r.FormValue("username")

	if r.FormValue("username") != "" {
		pass := r.FormValue("password")

		u, err := user.FindByUsernameAndPassword(uname, pass)
		if err == nil {
			user.LoggedIn[uname] = u

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

	err := templating.login.Execute(w, struct {
		Errors   []string
		PrevData struct {
			Username string
		}
	}{Errors: errors, PrevData: struct{ Username string }{Username: uname}})

	if err != nil {
		log.Fatalf("could not exec template login: %v", err)
	}
}
