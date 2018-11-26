package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/qor/admin"

	"github.com/calinpristavu/quizzer/webapp"

	"github.com/gorilla/mux"

	"github.com/jinzhu/gorm"

	_ "github.com/jinzhu/gorm/dialects/mysql"
)

func main() {
	db := initDb()

	r := mux.NewRouter()

	securedRouter := r.NewRoute().Subrouter()
	webapp.Init(db, securedRouter)

	go addAdmin(db)

	fmt.Println("App running on: 8000")
	if err := http.ListenAndServe(":8000", r); err != nil {
		panic(err)
	}
}

func initDb() *gorm.DB {
	var (
		connectionName = getEnv("CLOUDSQL_CONNECTION_NAME")
		usr            = getEnv("CLOUDSQL_USER")
		password       = os.Getenv("CLOUDSQL_PASSWORD") // NOTE: password may be empty
	)
	var err error
	db, err := gorm.Open("mysql", fmt.Sprintf("%s:%s@%s/quizzer?charset=utf8&parseTime=True", usr, password, connectionName))

	if err != nil {
		log.Fatalf("could not connect to db: %v", err)
	}

	return db.Debug()
}

func getEnv(k string) string {
	v := os.Getenv(k)
	if v == "" {
		log.Panicf("%s environment variable not set.", k)
	}
	return v
}

func addAdmin(db *gorm.DB) {
	Admin := admin.New(&admin.AdminConfig{DB: db})

	Admin.AddResource(&webapp.User{})
	Admin.AddResource(&webapp.QuestionTemplate{})
	Admin.AddResource(&webapp.ChoiceAnswerTemplate{})
	qtAdmin := Admin.AddResource(&webapp.QuizTemplate{})
	qtAdmin.Meta(&admin.Meta{
		Name: "Questions",
		Config: &admin.SelectManyConfig{
			Placeholder: "Chose a question",
			Collection: func(_ interface{}, context *admin.Context) (options [][]string) {
				var qts []*webapp.QuestionTemplate
				context.GetDB().Find(&qts)

				for _, qt := range qts {
					idStr := fmt.Sprintf("%d", qt.ID)
					var option = []string{idStr, qt.Text}
					options = append(options, option)
				}

				return options
			},
		},
	})

	m := http.NewServeMux()
	Admin.MountTo("/", m)

	fmt.Println("Admin running on: 9000")
	if err := http.ListenAndServe(":9000", m); err != nil {
		panic(err)
	}
}
