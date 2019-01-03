package webapp

import (
	"fmt"

	"github.com/jinzhu/gorm"
)

type User struct {
	gorm.Model
	Username      string
	Password      string `json:"-"`
	Role          int    `sql:"DEFAULT:0"` // fixme: for now, 0 is user, 1 is admin
	CurrentQuizID *uint
	CurrentQuiz   *Quiz
}

var LoggedIn map[string]*User

func init() {
	LoggedIn = make(map[string]*User, 5)
}

func FindByUsername(uname string) (*User, error) {
	u := &User{Username: uname}

	res := g.db.Where(&u).
		Preload("CurrentQuiz", "active = ?", true).
		Preload("CurrentQuiz.Questions").
		Preload("CurrentQuiz.Questions.ChoiceAnswers").
		Preload("CurrentQuiz.Questions.TextAnswer").
		Preload("CurrentQuiz.Questions.FlowDiagramAnswer").
		First(&u)
	if res.RecordNotFound() {
		return nil, fmt.Errorf("No user with username %s\n", uname)
	}

	return u, nil
}

func FindByUsernameAndPassword(uname, pass string) (*User, error) {
	u := &User{
		Username: uname,
		Password: pass,
	}

	res := g.db.Where(&u).
		Preload("CurrentQuiz", "active = ?", true).
		Preload("CurrentQuiz.Questions").
		Preload("CurrentQuiz.Questions.ChoiceAnswers").
		Preload("CurrentQuiz.Questions.TextAnswer").
		Preload("CurrentQuiz.Questions.FlowDiagramAnswer").
		First(&u)
	if res.RecordNotFound() {
		return nil, fmt.Errorf("Bad credentials: %s, %s\n", uname, pass)
	}

	return u, nil
}

func (u *User) Save() {
	g.db.Save(u)
}

type Role struct {
	ID int
}

func (u User) IsGranted(r Role) bool {
	// TODO: implement role hierarchy

	return u.Role == r.ID
}
