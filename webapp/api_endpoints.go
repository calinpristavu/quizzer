package webapp

import (
	"encoding/json"
	"net/http"
	"strconv"
	"time"

	"github.com/gorilla/mux"
)

func getQuizTemplates(w http.ResponseWriter, _ *http.Request) {
	var qts []QuizTemplate
	g.db.
		Preload("Questions").
		Order("id desc").
		Find(&qts)

	jsonResponse(w, qts, http.StatusOK)
}

func postQuizTemplates(w http.ResponseWriter, r *http.Request) {
	var qt QuizTemplate
	err := json.NewDecoder(r.Body).Decode(&qt)
	qt.CreatedAt = time.Now()

	if err != nil {
		w.WriteHeader(422)

		return
	}

	g.db.Create(&qt)

	jsonResponse(w, qt, http.StatusCreated)
}

func getQuizTemplate(w http.ResponseWriter, r *http.Request) {
	var qt QuizTemplate

	id, err := strconv.Atoi(mux.Vars(r)["id"])
	if err != nil {
		w.WriteHeader(404)

		return
	}

	res := g.db.Preload("Questions").First(&qt, id)
	if res.RecordNotFound() {
		w.WriteHeader(404)

		return
	}

	jsonResponse(w, qt, http.StatusOK)
}

func putQuizTemplate(w http.ResponseWriter, r *http.Request) {
	var qt QuizTemplate

	id, err := strconv.Atoi(mux.Vars(r)["id"])

	res := g.db.First(&qt, id)
	if res.RecordNotFound() {
		w.WriteHeader(404)

		return
	}

	err = json.NewDecoder(r.Body).Decode(&qt)
	if err != nil {
		w.WriteHeader(422)

		return
	}

	qt.ID = uint(id)

	res.Association("Questions").Replace(qt.Questions)
	g.db.Save(&qt)

	jsonResponse(w, qt, http.StatusOK)
}

func deleteQuizTemplate(w http.ResponseWriter, r *http.Request) {
	var qt QuizTemplate

	id, err := strconv.Atoi(mux.Vars(r)["id"])
	if err != nil {
		w.WriteHeader(404)

		return
	}

	res := g.db.Delete(&qt, id)
	if res.RowsAffected == 0 {
		w.WriteHeader(404)

		return
	}

	w.WriteHeader(http.StatusNoContent)
}

func getQuestionTemplates(w http.ResponseWriter, _ *http.Request) {
	var qts []QuestionTemplate
	g.db.
		Preload("ChoiceAnswerTemplates").
		Preload("FlowDiagramAnswerTemplate").
		Preload("Usages").
		Order("id desc").
		Find(&qts)

	jsonResponse(w, qts, http.StatusOK)
}

func postQuestionTemplates(w http.ResponseWriter, r *http.Request) {
	var qt QuestionTemplate
	err := json.NewDecoder(r.Body).Decode(&qt)
	qt.CreatedAt = time.Now()

	if err != nil {
		w.WriteHeader(422)

		return
	}

	g.db.Create(&qt)

	jsonResponse(w, qt, http.StatusCreated)
}

func getQuestionTemplate(w http.ResponseWriter, r *http.Request) {
	var qt QuestionTemplate

	id, err := strconv.Atoi(mux.Vars(r)["id"])
	if err != nil {
		w.WriteHeader(404)

		return
	}

	res := g.db.Preload("ChoiceAnswerTemplates").Preload("FlowDiagramAnswerTemplate").First(&qt, id)
	if res.RecordNotFound() {
		w.WriteHeader(404)

		return
	}

	jsonResponse(w, qt, http.StatusOK)
}

func putQuestionTemplate(w http.ResponseWriter, r *http.Request) {
	var qt QuestionTemplate

	id, err := strconv.Atoi(mux.Vars(r)["id"])

	res := g.db.First(&qt, id)
	if res.RecordNotFound() {
		w.WriteHeader(404)

		return
	}

	err = json.NewDecoder(r.Body).Decode(&qt)
	if err != nil {
		w.WriteHeader(422)

		return
	}

	qt.ID = uint(id)

	res.Association("ChoiceAnswerTemplates").Replace(qt.ChoiceAnswerTemplates)
	res.Association("FlowDiagramAnswerTemplate").Replace(qt.FlowDiagramAnswerTemplate)
	g.db.Save(&qt)

	jsonResponse(w, qt, http.StatusOK)
}

func deleteQuestionTemplate(w http.ResponseWriter, r *http.Request) {
	var qt QuestionTemplate

	id, err := strconv.Atoi(mux.Vars(r)["id"])
	if err != nil {
		w.WriteHeader(404)

		return
	}

	res := g.db.Delete(&qt, id)
	if res.RowsAffected == 0 {
		w.WriteHeader(404)

		return
	}

	w.WriteHeader(http.StatusNoContent)
}

func getUsers(w http.ResponseWriter, _ *http.Request) {
	var us []User
	g.db.
		Find(&us)

	jsonResponse(w, us, http.StatusOK)
}

func getUsersLoggedIn(w http.ResponseWriter, _ *http.Request) {
	var us []User

	for _, u := range LoggedIn {
		us = append(us, *u)
	}

	jsonResponse(w, us, http.StatusOK)
}

func getUser(w http.ResponseWriter, r *http.Request) {
	var u User

	id, err := strconv.Atoi(mux.Vars(r)["id"])
	if err != nil {
		w.WriteHeader(404)

		return
	}

	res := g.db.
		First(&u, id)
	if res.RecordNotFound() {
		w.WriteHeader(404)

		return
	}

	jsonResponse(w, u, http.StatusOK)
}

func postUsers(w http.ResponseWriter, r *http.Request) {
	var u User

	err := json.NewDecoder(r.Body).Decode(&u)
	if err != nil {
		w.WriteHeader(422)

		return
	}

	u.CreatedAt = time.Now()

	res := g.db.Create(&u)
	if res.Error != nil {
		jsonResponse(w, "Username already exists", http.StatusUnprocessableEntity)

		return
	}

	jsonResponse(w, u, http.StatusCreated)
}

func getQuizzes(w http.ResponseWriter, _ *http.Request) {
	var qs []Quiz
	g.db.
		Preload("Questions").
		Preload("Questions.ChoiceAnswers").
		Preload("Questions.TextAnswer").
		Preload("Questions.FlowDiagramAnswer").
		Preload("User").
		Order("id desc").
		Find(&qs)

	jsonResponse(w, qs, http.StatusOK)
}

func saveScores(w http.ResponseWriter, r *http.Request) {
	var qs []Question

	err := json.NewDecoder(r.Body).Decode(&qs)
	if err != nil {
		jsonResponse(w, "Error in request", http.StatusBadRequest)
		return
	}

	for _, q := range qs {
		g.db.Model(&q).Select("score").Updates(q)
	}

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

	user, err := FindByUsernameAndPassword(postData.Username, postData.Password)
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
	var stats []struct {
		Date   time.Time
		Number int
	}

	g.db.Raw(`
SELECT 
	COUNT(*) as number,
	DATE(updated_at) as date
FROM quizzes
GROUP BY DATE(updated_at)
`).Scan(&stats)

	jsonResponse(w, stats, http.StatusOK)
}

func statsAvgResult(w http.ResponseWriter, _ *http.Request) {
	var stats []struct {
		Date   time.Time
		Number float32
	}

	g.db.Raw(`
SELECT 
	AVG(score) as number,
	DATE(updated_at) as date
FROM quizzes
WHERE score IS NOT NULL
GROUP BY DATE(updated_at)
`).Scan(&stats)

	jsonResponse(w, stats, http.StatusOK)
}

func statsBestResult(w http.ResponseWriter, _ *http.Request) {
	var stats []struct {
		Date   time.Time
		Number float32
	}

	g.db.Raw(`
SELECT 
	MAX(score) as number,
	DATE(updated_at) as date
FROM quizzes
WHERE score IS NOT NULL
GROUP BY DATE(updated_at)
`).Scan(&stats)

	jsonResponse(w, stats, http.StatusOK)
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
