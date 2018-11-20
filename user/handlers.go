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
		home      *template.Template
		myAccount *template.Template
	}
}

var h *handler

func Init(db *gorm.DB, r *mux.Router) {
	h = &handler{
		db: db,
	}

	r.Use(AuthMiddleware)

	r.HandleFunc("/", home)
	r.HandleFunc("/me", myAccount)
	r.HandleFunc("/logout", logout)

	h.db.AutoMigrate(&User{})

	var err error
	h.templating.home, err = template.ParseFiles("user/home.gohtml", "header.gohtml", "footer.gohtml")
	if err != nil {
		log.Fatalf("could not parse template: %v", err)
	}
	h.templating.myAccount, err = template.ParseFiles("user/myAccount.gohtml", "header.gohtml", "footer.gohtml", "account_nav.gohtml")
	if err != nil {
		log.Fatalf("could not parse template: %v", err)
	}
}

func home(w http.ResponseWriter, r *http.Request) {
	// TODO: find out how to type assert *user.User instead of using interface{}
	err := h.templating.home.Execute(w, struct {
		User interface{}
	}{User: r.Context().Value("user")})

	if err != nil {
		log.Printf("could not render template: %v", err)
	}
}

func logout(w http.ResponseWriter, r *http.Request) {
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

func myAccount(w http.ResponseWriter, r *http.Request) {
	validationErrors := make(map[string]interface{}, 1)
	u := r.Context().Value("user")

	if r.FormValue("save") != "" {
		u.(*User).Username = r.FormValue("username")
		u.(*User).Save()
	}

	err := h.templating.myAccount.Execute(w, struct {
		User   interface{}
		Errors map[string]interface{}
	}{
		User:   u,
		Errors: validationErrors,
	})

	if err != nil {
		log.Printf("could not render template: %v", err)
	}
}
