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

	h.db.Create(&qt)

	jsonResponse(w, qt, http.StatusCreated)
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

	jsonResponse(w, qt, http.StatusOK)
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

	jsonResponse(w, qt, http.StatusOK)
}

func deleteQuizTemplate(w http.ResponseWriter, r *http.Request) {
	var qt QuizTemplate

	id, err := strconv.Atoi(mux.Vars(r)["id"])
	if err != nil {
		w.WriteHeader(404)

		return
	}

	res := h.db.Delete(&qt, id)
	if res.RowsAffected == 0 {
		w.WriteHeader(404)

		return
	}

	w.WriteHeader(http.StatusNoContent)
}

func getQuestionTemplates(w http.ResponseWriter, _ *http.Request) {
	var qts []QuestionTemplate
	h.db.Preload("ChoiceAnswerTemplates").Preload("FlowDiagramAnswerTemplate").Find(&qts)

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

	h.db.Create(&qt)

	jsonResponse(w, qt, http.StatusCreated)
}

func getQuestionTemplate(w http.ResponseWriter, r *http.Request) {
	var qt QuestionTemplate

	id, err := strconv.Atoi(mux.Vars(r)["id"])
	if err != nil {
		w.WriteHeader(404)

		return
	}

	res := h.db.Preload("ChoiceAnswerTemplates").Preload("FlowDiagramAnswerTemplate").First(&qt, id)
	if res.RecordNotFound() {
		w.WriteHeader(404)

		return
	}

	jsonResponse(w, qt, http.StatusOK)
}

func putQuestionTemplate(w http.ResponseWriter, r *http.Request) {
	var qt QuestionTemplate

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

	res.Association("ChoiceAnswerTemplates").Replace(qt.ChoiceAnswerTemplates)
	res.Association("FlowDiagramAnswerTemplate").Replace(qt.FlowDiagramAnswerTemplate)
	h.db.Save(&qt)

	jsonResponse(w, qt, http.StatusOK)
}

func deleteQuestionTemplate(w http.ResponseWriter, r *http.Request) {
	var qt QuestionTemplate

	id, err := strconv.Atoi(mux.Vars(r)["id"])
	if err != nil {
		w.WriteHeader(404)

		return
	}

	res := h.db.Delete(&qt, id)
	if res.RowsAffected == 0 {
		w.WriteHeader(404)

		return
	}

	w.WriteHeader(http.StatusNoContent)
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
