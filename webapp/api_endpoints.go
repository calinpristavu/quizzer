package webapp

import (
	"encoding/json"
	"log"
	"net/http"
	"strconv"
	"time"

	"github.com/gorilla/mux"
)

func getQuizTemplates(w http.ResponseWriter, _ *http.Request) {
	var qts []QuizTemplate
	g.db.
		Model(&qts).
		Preload("QuizQuestions").
		Preload("QuizQuestions.Question").
		Order("id desc").
		Find(&qts)

	jsonResponse(w, qts, http.StatusOK)
}

func postQuizTemplates(w http.ResponseWriter, r *http.Request) {
	var qt QuizTemplate
	err := json.NewDecoder(r.Body).Decode(&qt)
	qt.CreatedAt = time.Now()

	if err != nil {
		log.Printf("could not decode QT: %v", err)
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

	res.Association("QuizQuestions").Replace(qt.QuizQuestions)
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
		Preload("QuizQuestions").
		Preload("QuizQuestions.Quiz").
		Preload("CheckboxAnswerTemplates").
		Preload("RadioAnswerTemplates").
		Preload("FlowDiagramAnswerTemplate").
		Preload("Usages").
		Preload("Usages.Feedback").
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

	g.db.
		Model(&qt).
		Preload("CheckboxAnswerTemplates").
		Preload("RadioAnswerTemplates").
		Preload("FlowDiagramAnswerTemplate").
		Preload("Usages").
		First(&qt)

	jsonResponse(w, qt, http.StatusCreated)
}

func getQuestionTemplate(w http.ResponseWriter, r *http.Request) {
	var qt QuestionTemplate

	id, err := strconv.Atoi(mux.Vars(r)["id"])
	if err != nil {
		w.WriteHeader(404)

		return
	}

	res := g.db.
		Preload("CheckboxAnswerTemplates").
		Preload("RadioAnswerTemplates").
		Preload("FlowDiagramAnswerTemplate").
		First(&qt, id)
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

	res.Association("CheckboxAnswerTemplates").Replace(qt.CheckboxAnswerTemplates)
	res.Association("RadioAnswerTemplates").Replace(qt.RadioAnswerTemplates)
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

func postUser(w http.ResponseWriter, r *http.Request) {
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

func patchUser(w http.ResponseWriter, r *http.Request) {
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

	err = json.NewDecoder(r.Body).Decode(&u)
	if err != nil {
		w.WriteHeader(422)

		return
	}

	u.UpdatedAt = time.Now()

	g.db.Save(&u)

	jsonResponse(w, u, http.StatusOK)
}

func getQuizzes(w http.ResponseWriter, _ *http.Request) {
	var qs []Quiz
	g.db.
		Preload("Questions").
		Preload("Questions.CheckboxAnswers").
		Preload("Questions.RadioAnswers").
		Preload("Questions.TextAnswer").
		Preload("Questions.FlowDiagramAnswer").
		Preload("Questions.Feedback").
		Preload("User").
		Order("id desc").
		Find(&qs)

	jsonResponse(w, qs, http.StatusOK)
}

func saveScores(w http.ResponseWriter, r *http.Request) {
	var quiz Quiz

	err := json.NewDecoder(r.Body).Decode(&quiz)
	if err != nil {
		jsonResponse(w, "Error in request", http.StatusBadRequest)
		return
	}

	for _, q := range quiz.Questions {
		g.db.Model(&q).
			Set("gorm:association_autoupdate", false).
			Update("score", q.Score).
			Update("notes", q.Notes)
	}

	quiz.UpdateScore()
	g.db.Model(&quiz).
		Set("gorm:association_autoupdate", false).
		Update("score", quiz.Score).
		Update("corrected", true)

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
