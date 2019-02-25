package webapp

import (
	"encoding/json"
	"log"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"

	"github.com/calinpristavu/quizzer/model"
)

func getQuizTemplates(w http.ResponseWriter, _ *http.Request) {
	qts := model.FindQuizTemplates()

	jsonResponse(w, qts, http.StatusOK)
}

func postQuizTemplates(w http.ResponseWriter, r *http.Request) {
	var qt model.QuizTemplate
	err := json.NewDecoder(r.Body).Decode(&qt)

	if err != nil {
		log.Printf("could not decode QT: %v", err)
		w.WriteHeader(422)

		return
	}

	qt.Create()

	jsonResponse(w, qt, http.StatusCreated)
}

func getQuizTemplate(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.Atoi(mux.Vars(r)["id"])
	if err != nil {
		w.WriteHeader(404)

		return
	}

	qt, ok := model.FindQuizTemplate(id)
	if !ok {
		w.WriteHeader(404)

		return
	}

	jsonResponse(w, qt, http.StatusOK)
}

func putQuizTemplate(w http.ResponseWriter, r *http.Request) {
	var qt model.QuizTemplate

	err := json.NewDecoder(r.Body).Decode(&qt)
	if err != nil {
		w.WriteHeader(422)

		return
	}

	qt.Save()
}

func deleteQuizTemplate(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.Atoi(mux.Vars(r)["id"])
	if err != nil {
		w.WriteHeader(404)

		return
	}

	qt, ok := model.FindQuizTemplate(id)
	if !ok {
		w.WriteHeader(404)

		return
	}
	qt.Delete()

	w.WriteHeader(http.StatusNoContent)
}

func getQuestionTemplates(w http.ResponseWriter, _ *http.Request) {
	qts := model.FindQuestionTemplates()

	jsonResponse(w, qts, http.StatusOK)
}

func postQuestionTemplates(w http.ResponseWriter, r *http.Request) {
	var qt model.QuestionTemplate
	err := json.NewDecoder(r.Body).Decode(&qt)

	if err != nil {
		w.WriteHeader(422)

		return
	}

	qt.Create()

	qt, ok := model.FindQuestionTemplate(qt.ID)
	if !ok {
		jsonResponse(w, nil, http.StatusNotFound)
	}

	jsonResponse(w, qt, http.StatusCreated)
}

func getQuestionTemplate(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.Atoi(mux.Vars(r)["id"])
	if err != nil {
		w.WriteHeader(404)

		return
	}

	qt, ok := model.FindQuestionTemplate(uint(id))
	if !ok {
		w.WriteHeader(404)

		return
	}

	jsonResponse(w, qt, http.StatusOK)
}

func putQuestionTemplate(w http.ResponseWriter, r *http.Request) {
	var qt model.QuestionTemplate

	err := json.NewDecoder(r.Body).Decode(&qt)
	if err != nil {
		w.WriteHeader(422)

		return
	}

	qt.Save()

	jsonResponse(w, qt, http.StatusOK)
}

func deleteQuestionTemplate(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.Atoi(mux.Vars(r)["id"])
	if err != nil {
		w.WriteHeader(404)

		return
	}

	qt, ok := model.FindQuestionTemplate(uint(id))
	if !ok {
		w.WriteHeader(404)

		return
	}

	qt.Delete()

	w.WriteHeader(http.StatusNoContent)
}

func getUsers(w http.ResponseWriter, _ *http.Request) {
	us := model.FindUsers()

	jsonResponse(w, us, http.StatusOK)
}

func getUsersLoggedIn(w http.ResponseWriter, _ *http.Request) {
	var us []model.User

	for _, u := range LoggedIn {
		us = append(us, *u)
	}

	jsonResponse(w, us, http.StatusOK)
}

func getUser(w http.ResponseWriter, r *http.Request) {
	var u model.User

	id, err := strconv.Atoi(mux.Vars(r)["id"])
	if err != nil {
		w.WriteHeader(404)

		return
	}

	u, ok := model.FindUser(uint(id))
	if !ok {
		w.WriteHeader(404)

		return
	}

	jsonResponse(w, u, http.StatusOK)
}

func postUser(w http.ResponseWriter, r *http.Request) {
	var u model.User

	err := json.NewDecoder(r.Body).Decode(&u)
	if err != nil {
		w.WriteHeader(422)

		return
	}

	res := u.Create()
	if res != nil {
		jsonResponse(w, "Username already exists", http.StatusUnprocessableEntity)

		return
	}

	jsonResponse(w, u, http.StatusCreated)
}

func patchUser(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.Atoi(mux.Vars(r)["id"])
	if err != nil {
		w.WriteHeader(404)

		return
	}

	u, ok := model.FindUser(uint(id))
	if !ok {
		w.WriteHeader(404)

		return
	}

	err = json.NewDecoder(r.Body).Decode(&u)
	if err != nil {
		w.WriteHeader(422)

		return
	}

	u.Save()

	jsonResponse(w, u, http.StatusOK)
}

func getQuizzes(w http.ResponseWriter, _ *http.Request) {
	qs := model.FindQuizzes()

	jsonResponse(w, qs, http.StatusOK)
}

func saveScores(w http.ResponseWriter, r *http.Request) {
	var quiz model.Quiz

	err := json.NewDecoder(r.Body).Decode(&quiz)
	if err != nil {
		jsonResponse(w, "Error in request", http.StatusBadRequest)
		return
	}

	for _, q := range quiz.Questions {
		q.SaveFields(model.Question{
			Score: q.Score,
			Notes: q.Notes,
		})
	}

	quiz.UpdateScore()
	jsonResponse(w, "Scores updated.", http.StatusOK)
}

func postToken(w http.ResponseWriter, r *http.Request) {
	var postData struct {
		Username string
		Password string
	}

	err := json.NewDecoder(r.Body).Decode(&postData)
	if err != nil {
		jsonResponse(w, "Error in request", http.StatusBadRequest)
		return
	}

	user, err := model.FindByUsernameAndPassword(postData.Username, postData.Password)
	if err != nil {
		jsonResponse(w, "Invalid credentials", http.StatusForbidden)
		return
	}

	tokenString, err := newToken(user)
	if err != nil {
		jsonResponse(w, "Error while signing the token", http.StatusInternalServerError)
		return
	}

	jsonResponse(
		w,
		struct {
			T string `json:"token"`
		}{tokenString},
		http.StatusOK,
	)
}

func statsTotalAttempts(w http.ResponseWriter, _ *http.Request) {
	stats := model.FindStatsTotalAttempts()

	jsonResponse(w, stats, http.StatusOK)
}

func statsAvgResult(w http.ResponseWriter, _ *http.Request) {
	stats := model.FindStatsAvgResult()

	jsonResponse(w, stats, http.StatusOK)
}

func statsBestResult(w http.ResponseWriter, _ *http.Request) {
	stats := model.FindStatsBestResult()

	jsonResponse(w, stats, http.StatusOK)
}

func getCandidatesFromRecruitee(w http.ResponseWriter, _ *http.Request) {
	jsonResponse(w, findInRecruitee(), http.StatusOK)
}

// Helper to send json responses
func jsonResponse(w http.ResponseWriter, payload interface{}, status int) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	err := json.NewEncoder(w).Encode(payload)
	if err != nil {
		panic(err)
	}
}
