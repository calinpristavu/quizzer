package webapp

import (
	"fmt"
	"html/template"
	"log"
	"net/http"
	"strconv"
	"time"

	"github.com/gorilla/mux"
)

func startQuiz(w http.ResponseWriter, r *http.Request) {
	u := r.Context().Value("user").(*User)

	if id, ok := mux.Vars(r)["id"]; ok {
		intId, err := strconv.Atoi(id)
		if err != nil {
			log.Fatalf("cannot interpret %s as int: %v", id, err)
		}

		var qt QuizTemplate

		g.db.
			Preload("QuizQuestions").
			Preload("QuizQuestions.Question").
			Preload("QuizQuestions.Question").
			Preload("QuizQuestions.Question.CheckboxAnswerTemplates").
			Preload("QuizQuestions.Question.RadioAnswerTemplates").
			Preload("QuizQuestions.Question.FlowDiagramAnswerTemplate").
			First(&qt, intId)

		u.CurrentQuiz = qt.start(u)
	} else {
		u.CurrentQuiz = newQuiz(u, questionsPerQuiz)
	}

	u.CurrentQuizID = &u.CurrentQuiz.ID
	g.db.Save(&u)

	http.Redirect(w, r, "/question/0", http.StatusFound)
}

func question(w http.ResponseWriter, r *http.Request) {
	u := r.Context().Value("user").(*User)

	if u.CurrentQuiz == nil {
		log.Printf("no active quiz for user %s\n", u.Username)
		http.Redirect(w, r, "/", http.StatusFound)

		return
	}

	qIdx, err := strconv.Atoi(mux.Vars(r)["idx"])
	if err != nil {
		log.Printf("invalid question index\n")
		http.Error(w, "Invalid question index", http.StatusNotFound)

		return
	}

	if qIdx > len(u.CurrentQuiz.Questions)-1 {
		http.Redirect(w, r, "/finished", http.StatusFound)

		return
	}

	question := u.CurrentQuiz.Questions[qIdx]

	deadline := ""
	if u.CurrentQuiz.Duration.Duration.Nanoseconds() != 0 {
		deadline = u.CurrentQuiz.CreatedAt.
			Add(time.Duration(u.CurrentQuiz.Duration.Nanoseconds())).
			Format(time.RFC3339)
	}

	if r.Method == http.MethodGet {
		err := getTemplateForQuestion(question).Execute(w, struct {
			Question     Question
			AllQuestions []*Question
			User         interface{}
			Qidx         int
			PrevIdx      int
			Deadline     string
		}{
			Question:     *question,
			AllQuestions: u.CurrentQuiz.Questions,
			User:         u,
			Qidx:         qIdx,
			PrevIdx:      qIdx - 1,
			Deadline:     deadline,
		})
		if err != nil {
			http.Error(w, "could not render template for question", http.StatusInternalServerError)
		}

		return
	}

	if r.Method == http.MethodPost {

		if err := r.ParseForm(); err != nil {
			http.Error(w, "could not parse form", http.StatusBadRequest)
		}

		if err := question.SaveAnswer(r); err != nil {
			http.Error(w, "could not save answers", http.StatusBadRequest)
			return
		}

		http.Redirect(w, r, fmt.Sprintf("/question/%d", qIdx+1), http.StatusFound)
		return
	}
}

func getTemplateForQuestion(question *Question) *template.Template {
	switch question.Type {
	case 1:
		return g.templating.Lookup("checkbox_question.gohtml")
	case 2:
		return g.templating.Lookup("text_question.gohtml")
	case 3:
		return g.templating.Lookup("flow_diagram_question.gohtml")
	case 4:
		return g.templating.Lookup("radio_question.gohtml")
	default:
		log.Fatalf("unhandled question type %v", question.Type)
	}

	return nil
}

func finished(w http.ResponseWriter, r *http.Request) {
	u := r.Context().Value("user").(*User)

	quiz := u.CurrentQuiz

	if r.Method == http.MethodPost {
		u.finishQuiz()

		http.Redirect(w, r, "/", http.StatusFound)
		return
	}

	err := g.templating.Lookup("finished.gohtml").Execute(w, struct {
		Quiz Quiz
		User interface{}
	}{Quiz: *quiz, User: u})
	if err != nil {
		log.Fatalf("could not execute template: %v", err)
	}
}

func history(w http.ResponseWriter, r *http.Request) {
	u := r.Context().Value("user")

	qs := findAllFinishedForUser(u.(*User))

	err := g.templating.Lookup("history.gohtml").Execute(w, struct {
		Quizzes []Quiz
		Current *Quiz
		User    interface{}
	}{Quizzes: qs, User: u, Current: nil})
	if err != nil {
		log.Fatalf("could not execute template: %v", err)
	}
}

func viewQuiz(w http.ResponseWriter, r *http.Request) {
	u := r.Context().Value("user").(*User)
	vars := mux.Vars(r)
	id, _ := strconv.Atoi(vars["id"])

	qs := findAllFinishedForUser(u)

	current := find(id)
	err := g.templating.Lookup("history.gohtml").Execute(w, struct {
		Quizzes []Quiz
		Current *Quiz
		User    User
	}{
		Quizzes: qs,
		Current: &current,
		User:    *u,
	})
	if err != nil {
		log.Fatalf("could not execute template: %v", err)
	}
}

func home(w http.ResponseWriter, r *http.Request) {
	u := r.Context().Value("user").(*User)

	if u.CurrentQuizID != nil {
		http.Redirect(w, r, "/question/0", http.StatusFound)

		return
	}

	var qts []QuizTemplate
	queryBuilder := g.db.
		Model(&qts).
		Preload("QuizQuestions").
		Order("id desc")

	if u.ShouldStartID != nil {
		queryBuilder = queryBuilder.Where("id = ?", u.ShouldStartID)
	}

	queryBuilder.Find(&qts)

	err := g.templating.Lookup("home.gohtml").Execute(w, struct {
		User        User
		Quizzes     []QuizTemplate
		CanGenerate bool
	}{
		User:        *u,
		Quizzes:     qts,
		CanGenerate: u.ShouldStartID == nil,
	})

	if err != nil {
		log.Printf("could not render template: %v", err)
	}
}

func myAccount(w http.ResponseWriter, r *http.Request) {
	validationErrors := make(map[string]interface{}, 2)
	var err, hashingErr error
	user := r.Context().Value("user").(*User)

	if r.FormValue("change-username") != "" {
		validationErrors, err = ChangeUsernameFormValidator(r.Form)
		if err == nil {
			user.Username = r.FormValue("username")
			user.Save()
		}
	}

	if r.FormValue("change-password") != "" {
		validationErrors, err = ChangePasswordFormValidator(r.Form)

		password := r.FormValue("password")
		user.Password, hashingErr = HashPassword(password)
		if hashingErr != nil {
			http.Error(w, "Password cannot be hashed", http.StatusInternalServerError)
			log.Printf("The password %s for user %s cannot be hashed", password, user.Username)

			return
		}

		if err == nil {
			user.Save()
		}
	}

	err = g.templating.Lookup("my_account.gohtml").Execute(w, struct {
		User   interface{}
		Errors map[string]interface{}
	}{
		User:   user,
		Errors: validationErrors,
	})

	if err != nil {
		log.Printf("could not render template: %v", err)
	}
}

func logout(w http.ResponseWriter, r *http.Request) {
	cookie, err := r.Cookie("user")
	if err == nil {
		delete(LoggedIn, cookie.Value)
	}
	http.SetCookie(w, &http.Cookie{
		Name:    "user",
		Value:   "",
		Expires: time.Now(),
	})

	http.Redirect(w, r, "/login", http.StatusFound)
}

func login(w http.ResponseWriter, r *http.Request) {
	var errors []string

	uname := r.FormValue("username")

	if uname != "" {
		pass := r.FormValue("password")

		u, err := FindByUsernameAndPassword(uname, pass)
		if err == nil {
			LoggedIn[uname] = u

			cookie := &http.Cookie{
				Name:  "user",
				Value: u.Username,
			}
			http.SetCookie(w, cookie)

			http.Redirect(w, r, "/", http.StatusFound)
			return
		}

		errors = append(errors, "Invalid username or password.")
	}

	err := g.templating.Lookup("login.gohtml").Execute(w, struct {
		Errors   []string
		PrevData struct {
			Username string
		}
	}{Errors: errors, PrevData: struct{ Username string }{Username: uname}})

	if err != nil {
		log.Fatalf("could not exec template login: %v", err)
	}
}

func completeRegistration(w http.ResponseWriter, r *http.Request) {
	uname := r.FormValue("username")

	if uname == "" {
		http.Error(w, "Empty username", http.StatusBadRequest)

		return
	}

	pass := r.FormValue("password")
	repeated := r.FormValue("repeated")

	if pass == "" || pass != repeated {
		http.Error(w, "Passwords do not match or are invalid", http.StatusBadRequest)

		return
	}

	u, err := FindByUsername(uname)
	if err != nil {
		http.Error(w, "No user with that username", http.StatusNotFound)

		return
	}

	u.Password, err = HashPassword(pass)
	if err != nil {
		http.Error(w, "Password cannot be hashed", http.StatusInternalServerError)
		log.Printf("The password %s for user %s cannot be hashed", pass, uname)

		return
	}
	u.IsEnabled = true
	g.db.Save(u)

	login(w, r)
}

func addQuestionFeedback(w http.ResponseWriter, r *http.Request) {
	feedback := r.FormValue("feedback")
	if feedback == "" {
		return
	}

	u := r.Context().Value("user").(*User)

	if u.CurrentQuiz == nil {
		log.Printf("no active quiz for user %s\n", u.Username)

		return
	}

	qIdx, err := strconv.Atoi(mux.Vars(r)["idx"])
	if err != nil {
		log.Printf("invalid question index: %v\n", err)

		return
	}

	if qIdx > len(u.CurrentQuiz.Questions)-1 {
		log.Printf("invalid question index: %d\n", qIdx)
		return
	}

	question := u.CurrentQuiz.Questions[qIdx]

	err = question.addFeedback(feedback)
	if err != nil {
		log.Printf("could not save feedback: %v\n", err)
		return
	}

	jsonResponse(w, question.Feedback[len(question.Feedback)-1], http.StatusCreated)
}
