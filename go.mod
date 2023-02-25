module github.com/calinpristavu/quizzer

go 1.13

replace github.com/calinpristavu/quizzer/webapp => ./webapp

replace github.com/calinpristavu/quizzer/model => ./model

require (
	github.com/dgrijalva/jwt-go v3.2.0+incompatible
	github.com/gorilla/mux v1.7.3
	github.com/jinzhu/gorm v1.9.10
	github.com/joho/godotenv v1.3.0
	github.com/rs/cors v1.6.0
	github.com/sirupsen/logrus v1.2.0
	golang.org/x/crypto v0.1.0
)
