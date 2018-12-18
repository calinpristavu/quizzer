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
	h.db.Preload("Questions").Find(&qts)

	jsonResponse(w, qts)
}

func postQuizTemplates(w http.ResponseWriter, r *http.Request) {
	var qt QuizTemplate
	err := json.NewDecoder(r.Body).Decode(&qt)
	qt.CreatedAt = time.Now()

	if err != nil {
		w.WriteHeader(422)

		return
	}

	h.db.Create(&qt)

	w.WriteHeader(http.StatusCreated)
	jsonResponse(w, qt)
}

func getQuizTemplate(w http.ResponseWriter, r *http.Request) {
	var qt QuizTemplate

	id, err := strconv.Atoi(mux.Vars(r)["id"])
	if err != nil {
		w.WriteHeader(404)

		return
	}

	res := h.db.Preload("Questions").First(&qt, id)
	if res.RecordNotFound() {
		w.WriteHeader(404)

		return
	}

	jsonResponse(w, qt)
}

func putQuizTemplate(w http.ResponseWriter, r *http.Request) {
	var qt QuizTemplate

	id, err := strconv.Atoi(mux.Vars(r)["id"])

	res := h.db.First(&qt, id)
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
	h.db.Save(&qt)

	w.WriteHeader(http.StatusOK)
	jsonResponse(w, qt)
}

func deleteQuizTemplate(w http.ResponseWriter, r *http.Request) {
	var qt QuizTemplate

	id, err := strconv.Atoi(mux.Vars(r)["id"])
	if err != nil {
		w.WriteHeader(404)

		return
	}

	res := h.db.Preload("Questions").Delete(&qt, id)
	if res.RowsAffected == 0 {
		w.WriteHeader(404)

		return
	}

	w.WriteHeader(http.StatusNoContent)
}

// Helper to send json responses
func jsonResponse(w http.ResponseWriter, payload interface{}) {
	w.Header().Set("Content-Type", "application/json")
	err := json.NewEncoder(w).Encode(payload)
	if err != nil {
		panic(err)
	}
}
