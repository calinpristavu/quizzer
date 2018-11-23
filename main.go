package main

import (
	"fmt"
	"net/http"

	"github.com/qor/admin"

	"github.com/calinpristavu/quizzer/quiz"

	"github.com/calinpristavu/quizzer/auth"

	"github.com/gorilla/mux"

	"github.com/jinzhu/gorm"

	"github.com/calinpristavu/quizzer/user"

	_ "github.com/jinzhu/gorm/dialects/mysql"
)

func main() {
	db := initDb()
	go addAdmin(db)

	r := mux.NewRouter()

	auth.Init(r)

	securedRouter := r.NewRoute().Subrouter()
	user.Init(db, securedRouter)
	quiz.Init(db, securedRouter)

	fmt.Println("App running on: 8000")
	if err := http.ListenAndServe(":8000", r); err != nil {
		panic(err)
	}
}

func initDb() *gorm.DB {
	db, err := gorm.Open("mysql", "root:V0n_Kesh@/quizzer?charset=utf8&parseTime=True&loc=Local")
	if err != nil {
		fmt.Printf("could not connect to db: %v", err)
	}
	return db.Debug()
}

func addAdmin(db *gorm.DB) {
	Admin := admin.New(&admin.AdminConfig{DB: db})

	Admin.AddResource(&user.User{})
	Admin.AddResource(&quiz.QuestionTemplate{})
	Admin.AddResource(&quiz.ChoiceAnswerTemplate{})

	m := http.NewServeMux()
	Admin.MountTo("/", m)

	fmt.Println("Admin running on: 9000")
	if err := http.ListenAndServe(":9000", m); err != nil {
		panic(err)
	}
}
