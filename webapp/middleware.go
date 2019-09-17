package webapp

import (
	"context"
	"net/http"

	"github.com/calinpristavu/quizzer/model"
	"github.com/sirupsen/logrus"
)

func UserSession(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		cookie, err := r.Cookie("user")
		if err != nil {
			logrus.Printf("error with user cookie: %v", err)
			http.Redirect(w, r, "/login", http.StatusSeeOther)

			return
		}

		username := cookie.Value

		if _, ok := LoggedIn[username]; !ok {
			LoggedIn[username], err = model.FindByUsername(username)
			if err != nil {
				logrus.Printf("could not find user for username %s", username)
				http.Redirect(w, r, "/login", http.StatusSeeOther)

				return
			}
		}

		if !LoggedIn[username].IsGranted(model.RoleUser) {
			http.Redirect(w, r, "/login", http.StatusSeeOther)

			return
		}

		ctx := context.WithValue(r.Context(), "user", LoggedIn[username])

		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

func ValidateJwtToken(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		tokenHeader := r.Header.Get("Authorization")

		_, err := extractTokenClaims(tokenHeader)

		if err != nil {
			http.Error(w, err.Error(), http.StatusForbidden)
			return
		}

		next.ServeHTTP(w, r)
	})
}
