module github.com/calinpristavu/quizzer

replace github.com/calinpristavu/quizzer/webapp => ./webapp

replace github.com/calinpristavu/quizzer/model => ./model

require (
	github.com/calinpristavu/quizzer/webapp v0.0.0
	github.com/gorilla/mux v1.7.3
	github.com/jinzhu/gorm v1.9.10
	github.com/rs/cors v1.6.0
)
