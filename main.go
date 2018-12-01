package main

import (
	"flag"
	"fmt"
	"log"
	"net/http"

	"github.com/qor/admin"
	"github.com/qor/qor"

	"github.com/calinpristavu/quizzer/webapp"

	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"

	"github.com/jinzhu/gorm"

	_ "github.com/jinzhu/gorm/dialects/mysql"
)

func main() {
	// TODO: ADD PROPPER CORS HANDLING!!!!!
	headersOk := handlers.AllowedHeaders([]string{"X-Requested-With", ""})
	originsOk := handlers.AllowedOrigins([]string{"*"})
	methodsOk := handlers.AllowedMethods([]string{"GET", "HEAD", "POST", "PUT", "OPTIONS"})

	appPort := flag.String("appPort", "8000", "app port")
	dbHost := flag.String("dbHost", "127.0.0.1", "db host")
	dbUser := flag.String("dbUser", "root", "db user")
	dbPass := flag.String("dbPass", "", "db password")
	flag.Parse()

	db := initDb(*dbHost, *dbUser, *dbPass)

	r := mux.NewRouter()

	webapp.Init(db, r)

	// addAdmin(db, r)
	addAPI(db, r)

	fmt.Printf("App running on: %s\n", *appPort)
	err := http.ListenAndServe(fmt.Sprintf(":%s", *appPort), handlers.CORS(originsOk, headersOk, methodsOk)(r))
	if err != nil {
		panic(err)
	}
}

func initDb(host, user, pass string) *gorm.DB {
	var err error
	db, err := gorm.Open("mysql", fmt.Sprintf("%s:%s@tcp(%s)/quizzer?charset=utf8&parseTime=True", user, pass, host))

	if err != nil {
		log.Fatalf("could not connect to db: %v", err)
	}

	return db.Debug()
}

func addAdmin(db *gorm.DB, r *mux.Router) {
	Admin := admin.New(&admin.AdminConfig{DB: db})

	Admin.AddResource(&webapp.User{})
	questionAdmin := Admin.AddResource(&webapp.QuestionTemplate{})
	questionAdmin.Meta(&admin.Meta{
		Name: "Type",
		Config: &admin.SelectOneConfig{
			Collection: [][]string{
				{"1", "Checkboxes"},
				{"2", "Free text"},
				{"3", "Flow Diagram"},
			},
		},
	})
	Admin.AddResource(&webapp.ChoiceAnswerTemplate{})
	quizAdmin := Admin.AddResource(&webapp.QuizTemplate{})
	quizAdmin.Meta(&admin.Meta{
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

func addAPI(db *gorm.DB, r *mux.Router) {
	API := admin.New(&qor.Config{DB: db})
	API.AddResource(&webapp.User{})
	API.AddResource(&webapp.QuizTemplate{})
	question := API.AddResource(&webapp.QuestionTemplate{})
	_, _ = question.AddSubResource("ChoiceAnswerTemplates")

	m := http.NewServeMux()
	API.MountTo("/api", m)

	r.PathPrefix("/api").Handler(m)
}
