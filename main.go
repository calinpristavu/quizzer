package main

import (
	"flag"
	"fmt"
	"log"
	"net/http"

	"github.com/qor/admin"

	"github.com/calinpristavu/quizzer/webapp"

	"github.com/gorilla/mux"

	"github.com/jinzhu/gorm"

	_ "github.com/jinzhu/gorm/dialects/mysql"
)

func main() {

	appPort := flag.String("appPort", "8000", "app port")
	dbHost := flag.String("dbHost", "127.0.0.1", "db host")
	dbUser := flag.String("dbUser", "root", "db user")
	dbPass := flag.String("dbPass", "", "db password")
	flag.Parse()

	db := initDb(*dbHost, *dbUser, *dbPass)

	r := mux.NewRouter()

	webapp.Init(db, r)

	addAdmin(db, r)
	fmt.Printf("App running on: %s\n", *appPort)
	if err := http.ListenAndServe(fmt.Sprintf(":%s", *appPort), r); err != nil {
		panic(err)
	}
}

func initDb(host, user, pass string) *gorm.DB {
	var err error
	db, err := gorm.Open("mysql", fmt.Sprintf("%s:%s@tcp(%s:3306)/quizzer?charset=utf8&parseTime=True", user, pass, host))

	if err != nil {
		log.Fatalf("could not connect to db: %v", err)
	}

	return db.Debug()
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
