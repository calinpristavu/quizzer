package main

import (
	"fmt"
	"net/http"

	"github.com/calinpristavu/quizzer/quiz"

	"github.com/calinpristavu/quizzer/auth"

	"github.com/gorilla/mux"

	"github.com/jinzhu/gorm"

	"github.com/calinpristavu/quizzer/user"

	_ "github.com/jinzhu/gorm/dialects/mysql"
)

func main() {
	db := initDb().Debug()

	r := mux.NewRouter()

	auth.Init(r)
	user.Init(db, r)
	quiz.Init(db, r)

	http.ListenAndServe(":3030", r)
}

func initDb() *gorm.DB {
	db, err := gorm.Open("mysql", "root:V0n_Kesh@/quizzer?charset=utf8&parseTime=True&loc=Local")
	if err != nil {
		fmt.Printf("could not connect to db: %v", err)
	}
	return db
}
