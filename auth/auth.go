package auth

import (
	"html/template"
	"log"
	"net/http"

	"github.com/calinpristavu/quizzer/user"

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
	var errors []string

	t, err := template.ParseFiles("auth/login.gtpl")
	if err != nil {
		log.Printf("could not parse template: %v", err)
	}

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

	t.Execute(w, struct {
		Errors   []string
		PrevData struct {
			Username string
		}
	}{Errors: errors, PrevData: struct{ Username string }{Username: uname}})
}
