package main

import (
	"flag"
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/mux"
	_ "github.com/jinzhu/gorm/dialects/mysql"
	"github.com/rs/cors"

	"github.com/calinpristavu/quizzer/webapp"
)

func init() {
	log.SetFlags(log.LstdFlags | log.Lshortfile)
}

func main() {
	appPort := flag.String("appPort", "8000", "app port")
	flag.Parse()

	r := mux.NewRouter()

	webapp.Init(r)

	bootWs(r, *appPort)
}

func bootWs(r *mux.Router, port string) {
	serveStaticResources(r)

	// TODO: ADD PROPPER CORS HANDLING!!!!!
	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"*"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Authorization", "Content-Type"},
		AllowCredentials: true,
	})

	fmt.Printf("App running on: %s\n", port)
	err := http.ListenAndServe(
		fmt.Sprintf(":%s", port),
		c.Handler(r),
	)
	if err != nil {
		panic(err)
	}
}

func serveStaticResources(r *mux.Router) {
	resources := http.FileServer(http.Dir("resources"))
	r.PathPrefix("/resources/").Handler(http.StripPrefix("/resources/", resources))

	fonts := http.FileServer(http.Dir("webfonts"))
	r.PathPrefix("/webfonts/").Handler(http.StripPrefix("/webfonts/", fonts))
}
