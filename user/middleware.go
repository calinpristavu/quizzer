package user

import (
	"context"
	"log"
	"net/http"
)

func AuthMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		cookie, err := r.Cookie("user")
		if err != nil {
			log.Printf("error with user cookie: %v", err)
			http.Redirect(w, r, "/login", http.StatusPermanentRedirect)

			return
		}

		username := cookie.Value

		u, ok := LoggedIn[username]
		if !ok {
			u, err = FindByUsername(username)
			if err != nil {
				log.Printf("could not find user for username %s", username)
				http.Redirect(w, r, "/login", http.StatusPermanentRedirect)

				return
			}
		}
		ctx := context.WithValue(r.Context(), "user", u)

		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
