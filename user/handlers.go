package user

import (
	"html/template"
	"log"
	"net/http"
	"time"

	"github.com/gorilla/mux"

	"github.com/jinzhu/gorm"
)

type handler struct {
	db         *gorm.DB
	templating struct {
		home *template.Template
	}
}

var h *handler

func Init(db *gorm.DB, r *mux.Router) {
	h = &handler{
		db: db,
	}

	r.Use(AuthMiddleware)

	r.HandleFunc("/", h.home)
	r.HandleFunc("/logout", h.logout)

	h.db.AutoMigrate(&User{})

	var err error
	h.templating.home, err = template.ParseFiles("user/home.gtpl", "header.gtpl", "footer.gtpl")
	if err != nil {
		log.Fatalf("could not parse template: %v", err)
	}
}

func (h *handler) home(w http.ResponseWriter, r *http.Request) {
	u := r.Context().Value("user")

	err := h.templating.home.Execute(w, u)
	if err != nil {
		log.Printf("could not render template: %v", err)
	}
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
