package webapp

import (
	"context"
	"log"
	"net/http"
)

func UserSession(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		cookie, err := r.Cookie("user")
		if err != nil {
			log.Printf("error with user cookie: %v", err)
			http.Redirect(w, r, "/login", http.StatusUnauthorized)

			return
		}

		username := cookie.Value

		if _, ok := LoggedIn[username]; !ok {
			LoggedIn[username], err = FindByUsername(username)
			if err != nil {
				log.Printf("could not find user for username %s", username)
				http.Redirect(w, r, "/login", http.StatusUnauthorized)

				return
			}
		}

		if !LoggedIn[username].IsGranted(roleUser) {
			http.Error(w, "Forbidden", http.StatusForbidden)

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
