package webapp

import (
	"crypto/rsa"
	"fmt"
	"io/ioutil"
	"log"
	"strings"
	"time"

	"github.com/dgrijalva/jwt-go"
	"golang.org/x/crypto/bcrypt"
)

const (
	privKeyPath = "jwt/webapp"
	pubKeyPath  = "jwt/webapp.pub"
)

var (
	SignKey   *rsa.PrivateKey
	VerifyKey *rsa.PublicKey
)

func init() {
	k, err := ioutil.ReadFile(privKeyPath)
	if err != nil {
		log.Fatal("Error reading private key. Generate it in folder ./jwt using `openssl genrsa -out webapp 1024`")
		return
	}

	SignKey, _ = jwt.ParseRSAPrivateKeyFromPEM(k)

	v, err := ioutil.ReadFile(pubKeyPath)
	if err != nil {
		log.Fatal("Error reading public key. Generate it in folder ./jwt using `openssl rsa -in webapp -pubout > webapp.pub`")
		return
	}

	VerifyKey, _ = jwt.ParseRSAPublicKeyFromPEM(v)
}

type TokenClaims struct {
	ID uint `json:"id"`
	jwt.StandardClaims
}

func newToken(user *User) (string, error) {
	claims := TokenClaims{
		user.ID,
		jwt.StandardClaims{
			ExpiresAt: time.Now().Add(time.Duration(24 * time.Hour)).Unix(),
			Issuer:    "webapp",
		},
	}

	signer := jwt.NewWithClaims(jwt.GetSigningMethod("RS256"), claims)
	tokenString, err := signer.SignedString(SignKey)
	if err != nil {
		log.Printf("Error signing token: %v\n", err)
	}

	return tokenString, err
}

func extractTokenClaims(tokenHeader string) (*TokenClaims, error) {
	if tokenHeader == "" {
		return nil, fmt.Errorf("missing token")
	}

	splitted := strings.Split(tokenHeader, " ")
	if len(splitted) != 2 {
		return nil, fmt.Errorf("invalid/malformed auth token")
	}

	claims := &TokenClaims{}

	token, err := jwt.ParseWithClaims(splitted[1], claims, func(token *jwt.Token) (interface{}, error) {
		return VerifyKey, nil
	})

	if err != nil {
		return nil, fmt.Errorf("unauthorised access to this resource")
	}

	if !token.Valid {
		return nil, fmt.Errorf("token is not valid")
	}

	return claims, nil
}

func HashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)

	return string(bytes), err
}

func CheckPassword(expectedPasswordHashed, password string) bool {
	check := bcrypt.CompareHashAndPassword([]byte((expectedPasswordHashed)), []byte(password))

	return check == nil
}
