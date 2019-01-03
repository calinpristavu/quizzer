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
		ctx := context.WithValue(r.Context(), "user", LoggedIn[username])

		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

func RoleUser(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		u := r.Context().Value("user").(*User)

		if !u.IsGranted(roleUser) {
			http.Error(w, "Forbidden", http.StatusForbidden)

			return
		}

		next.ServeHTTP(w, r)
	})
}
