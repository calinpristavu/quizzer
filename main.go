package main

import (
	"flag"
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

	webapp.Init(db, r)

	addAdmin(db, r)

	appPort := flag.String("appPort", "8000", "app port")
	flag.Parse()
	fmt.Printf("App running on: %s\n", *appPort)
	if err := http.ListenAndServe(fmt.Sprintf(":%s", *appPort), r); err != nil {
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

func addAdmin(db *gorm.DB, r *mux.Router) {
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
	Admin.MountTo("/admin", m)
	r.PathPrefix("/admin").Handler(m)
}
