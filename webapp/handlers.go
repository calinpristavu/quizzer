package webapp

import (
	"fmt"
	"html/template"
	"net/http"
	"sort"
	"strconv"
	"time"

	"github.com/gorilla/mux"
	"github.com/sirupsen/logrus"

	"github.com/calinpristavu/quizzer/model"
)

const questionsPerQuiz = 10

func startQuiz(w http.ResponseWriter, r *http.Request) {
	u := r.Context().Value("user").(*model.User)

	if id, ok := mux.Vars(r)["id"]; ok {
		intId, err := strconv.Atoi(id)
		if err != nil {
			logrus.Fatalf("cannot interpret %s as int: %v", id, err)
		}

		qt, ok := model.FindQuizTemplate(intId)
		if !ok {
			http.Redirect(w, r, "/", http.StatusFound)

			return
		}

		u.CurrentQuiz = qt.Start(u)
	} else {
		u.CurrentQuiz = model.NewQuiz(u, questionsPerQuiz)
	}

	u.CurrentQuizID = &u.CurrentQuiz.ID
	u.Save()

	http.Redirect(w, r, "/question/0", http.StatusFound)
}

func question(w http.ResponseWriter, r *http.Request) {
	u := r.Context().Value("user").(*model.User)

	if u.CurrentQuizID == nil {
		logrus.Printf("no active quiz for user %s\n", u.Username)
		http.Redirect(w, r, "/", http.StatusFound)

		return
	}

	qIdx, err := strconv.Atoi(mux.Vars(r)["idx"])
	if err != nil {
		logrus.Printf("invalid question index\n")
		http.Error(w, "Invalid question index", http.StatusNotFound)

		return
	}

	if u.CurrentQuiz == nil {
		currentQuiz := model.FindQuiz(int(*u.CurrentQuizID))

		sort.Sort(model.QuestionsByOrder(currentQuiz.Questions))

		u.CurrentQuiz = &currentQuiz
		LoggedIn[u.Username] = u
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
			Question     model.Question
			AllQuestions []*model.Question
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

func getTemplateForQuestion(question *model.Question) *template.Template {
	switch question.Type {
	case 1:
		return g.templating.Lookup("checkbox_question.gohtml")
	case 2:
		return g.templating.Lookup("code_question.gohtml")
	case 3:
		return g.templating.Lookup("flow_diagram_question.gohtml")
	case 4:
		return g.templating.Lookup("radio_question.gohtml")
	default:
		logrus.Fatalf("unhandled question type %v", question.Type)
	}

	return nil
}

func finished(w http.ResponseWriter, r *http.Request) {
	u := r.Context().Value("user").(*model.User)

	quiz := u.CurrentQuiz

	if r.Method == http.MethodPost {
		u.FinishQuiz()

		http.Redirect(w, r, "/", http.StatusFound)
		return
	}

	referer := r.Header.Get("Referer")

	err := g.templating.Lookup("finished.gohtml").Execute(w, struct {
		Quiz    model.Quiz
		User    interface{}
		Referer string
	}{Quiz: *quiz, User: u, Referer: referer})
	if err != nil {
		logrus.Fatalf("could not execute template: %v", err)
	}
}

func history(w http.ResponseWriter, r *http.Request) {
	u := r.Context().Value("user")

	qs := u.(*model.User).FindFinishedQuizzes()

	err := g.templating.Lookup("history.gohtml").Execute(w, struct {
		Quizzes []model.Quiz
		Current *model.Quiz
		User    interface{}
	}{Quizzes: qs, User: u, Current: nil})
	if err != nil {
		logrus.Fatalf("could not execute template: %v", err)
	}
}

func viewQuiz(w http.ResponseWriter, r *http.Request) {
	u := r.Context().Value("user").(*model.User)
	vars := mux.Vars(r)
	id, _ := strconv.Atoi(vars["id"])

	qs := u.FindFinishedQuizzes()

	current := u.FindQuiz(uint(id))
	err := g.templating.Lookup("history.gohtml").Execute(w, struct {
		Quizzes []model.Quiz
		Current *model.Quiz
		User    model.User
	}{
		Quizzes: qs,
		Current: &current,
		User:    *u,
	})
	if err != nil {
		logrus.Fatalf("could not execute template: %v", err)
	}
}

func home(w http.ResponseWriter, r *http.Request) {
	u := r.Context().Value("user").(*model.User)

	if u.CurrentQuizID != nil {
		http.Redirect(w, r, "/question/0", http.StatusFound)

		return
	}

	var qts []model.QuizTemplate

	if u.ShouldStartID != nil {
		qt, ok := model.FindQuizTemplate(int(*u.ShouldStartID))
		if !ok {
			logrus.Fatalf("could not find quiz template: %d", *u.ShouldStartID)
		}
		qts = []model.QuizTemplate{qt}
	} else {
		qts = model.FindEnabledQuizTemplates()

		// remove empty quizzes
		for i, qt := range qts {
			if len(qt.QuizQuestions) == 0 {
				logrus.Printf("quiz template #%d doesn't have questions. skipping ...", qt.ID)
				qts = append(qts[:i], qts[i+1:]...)
			}
		}
	}

	err := g.templating.Lookup("home.gohtml").Execute(w, struct {
		User        model.User
		Quizzes     []model.QuizTemplate
		CanGenerate bool
	}{
		User:        *u,
		Quizzes:     qts,
		CanGenerate: u.ShouldStartID == nil,
	})

	if err != nil {
		logrus.Printf("could not render template: %v", err)
	}
}

func myAccount(w http.ResponseWriter, r *http.Request) {
	validationErrors := make(map[string]interface{}, 2)
	var err, hashingErr error
	user := r.Context().Value("user").(*model.User)

	if r.FormValue("change-username") != "" {
		validationErrors, err = model.ChangeUsernameFormValidator(r.Form)
		if err == nil {
			user.Username = r.FormValue("username")
			user.Save()
		}
	}

	if r.FormValue("change-password") != "" {
		validationErrors, err = model.ChangePasswordFormValidator(r.Form)

		password := r.FormValue("password")
		user.Password, hashingErr = HashPassword(password)
		if hashingErr != nil {
			http.Error(w, "Password cannot be hashed", http.StatusInternalServerError)
			logrus.Printf("The password %s for user %s cannot be hashed", password, user.Username)

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
		logrus.Printf("could not render template: %v", err)
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
	var errors = make(map[string]interface{})

	uname := r.FormValue("username")

	if uname != "" {
		pass := r.FormValue("password")

		u, err := model.FindByUsernameAndPassword(uname, pass)
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

		errors["login"] = "Invalid username or password."
	}

	renderLoginTemplate(w, errors, uname)
}

func loginGuest(w http.ResponseWriter, r *http.Request) {
	var errors = make(map[string]interface{})
	u, err := model.CreateGuest()
	if err == nil {
		LoggedIn[u.Username] = u
		cookie := &http.Cookie{
			Name:  "user",
			Value: u.Username,
		}
		http.SetCookie(w, cookie)

		http.Redirect(w, r, "/", http.StatusFound)

		return
	}
	errors["login-guest"] = "Something broke. Please try again and if is not working, contact the platform administrator."
	renderLoginTemplate(w, errors, "")
}

func completeRegistration(w http.ResponseWriter, r *http.Request) {
	var errors = make(map[string]interface{}, 1)

	uname := r.FormValue("username")

	if uname == "" {
		http.Error(w, "Empty username", http.StatusBadRequest)

		return
	}

	pass := r.FormValue("password")
	repeated := r.FormValue("repeated")

	if pass == "" || pass != repeated {
		errors["registration"] = "Passwords do not match or are invalid."
		renderLoginTemplate(w, errors, uname)

		return
	}

	u, err := model.FindByUsername(uname)
	if err != nil {
		errors["registration"] = "No user with that username."
		renderLoginTemplate(w, errors, uname)

		return
	}

	if u.Password != "" {
		errors["registration"] = "You already have a password set, please sign in."
		renderLoginTemplate(w, errors, uname)

		return
	}

	u.Password, err = HashPassword(pass)
	if err != nil {
		http.Error(w, "Password cannot be hashed", http.StatusInternalServerError)
		logrus.Printf("The password %s for user %s cannot be hashed", pass, uname)

		return
	}
	u.IsEnabled = true
	u.Save()

	login(w, r)
}

func addQuestionFeedback(w http.ResponseWriter, r *http.Request) {
	feedback := r.FormValue("feedback")
	if feedback == "" {
		return
	}

	u := r.Context().Value("user").(*model.User)

	if u.CurrentQuiz == nil {
		logrus.Printf("no active quiz for user %s\n", u.Username)

		return
	}

	qIdx, err := strconv.Atoi(mux.Vars(r)["idx"])
	if err != nil {
		logrus.Printf("invalid question index: %v\n", err)

		return
	}

	if qIdx > len(u.CurrentQuiz.Questions)-1 {
		logrus.Printf("invalid question index: %d\n", qIdx)
		return
	}

	question := u.CurrentQuiz.Questions[qIdx]

	err = question.AddFeedback(feedback)
	if err != nil {
		logrus.Printf("could not save feedback: %v\n", err)
		return
	}

	jsonResponse(w, question.Feedback[len(question.Feedback)-1], http.StatusCreated)
}

func renderLoginTemplate(w http.ResponseWriter, errors map[string]interface{}, username string) {
	err := g.templating.Lookup("login.gohtml").Execute(w, struct {
		Errors   map[string]interface{}
		PrevData struct {
			Username string
		}
	}{Errors: errors, PrevData: struct{ Username string }{Username: username}})

	if err != nil {
		logrus.Fatalf("could not exec template login: %v", err)
	}
}
