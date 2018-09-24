package user

import (
	"context"
	"html/template"
	"log"
	"net/http"
	"time"

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
	r.Use(AuthMiddleware)

	r.HandleFunc("/", h.home)
	r.HandleFunc("/login_check", h.loginCheck)
	r.HandleFunc("/logout", h.logout)

	h.db.AutoMigrate(&User{})
}

func (h *handler) home(w http.ResponseWriter, r *http.Request) {
	u := r.Context().Value("user")

	t, err := template.ParseFiles("user/home.gtpl")
	if err != nil {
		log.Printf("could not parse template: %v", err)
	}

	err = t.Execute(w, u)
	if err != nil {
		log.Printf("could not render template: %v", err)
	}
}

func (h *handler) loginCheck(w http.ResponseWriter, r *http.Request) {
	uname := r.PostFormValue("username")
	pass := r.PostFormValue("password")

	u, err := FindByUsernameAndPassword(uname, pass)
	if err != nil {
		http.Redirect(w, r, "/login", 301)

		return
	}

	LoggedIn[uname] = u

	cookie := &http.Cookie{
		Domain: "localhost",
		Name:   "user",
		Value:  u.Username,
	}
	http.SetCookie(w, cookie)

	http.Redirect(w, r, "/", 301)
}

func (h *handler) logout(w http.ResponseWriter, r *http.Request) {
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

///// TODO: BAD move this to middleware.go

func AuthMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		cookie, err := r.Cookie("user")
		if err != nil {
			log.Printf("error with user cookie: %v", err)
			// TODO: redirect when user is needed for req
			next.ServeHTTP(w, r)

			return
		}

		username := cookie.Value

		u, ok := LoggedIn[username]
		if !ok {
			u, err = FindByUsername(username)
			if err != nil {
				u = nil
			}
		}
		ctx := context.WithValue(r.Context(), "user", u)

		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
