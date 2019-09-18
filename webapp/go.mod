module github.com/calinpristavu/quizzer/webapp

go 1.12

replace github.com/calinpristavu/quizzer/model => ../model

require (
	github.com/calinpristavu/quizzer/model v0.0.0
	github.com/dgrijalva/jwt-go v3.2.0+incompatible
	github.com/gorilla/mux v1.7.3
	github.com/sirupsen/logrus v1.4.2
	golang.org/x/crypto v0.0.0-20190911031432-227b76d455e7
)
