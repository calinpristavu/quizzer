package webapp

import (
	"fmt"

	"github.com/jinzhu/gorm"
)

type User struct {
	gorm.Model
	Username      string `gorm:"unique_index"`
	Password      string `json:"-"`
	RoleID        int    `sql:"DEFAULT:0"`
	Role          Role   `sql:"-"`
	IsEnabled     bool   `sql:"DEFAULT:0"`
	CurrentQuizID *uint
	CurrentQuiz   *Quiz
	Comments      string `sql:"type:longtext"`
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
		Preload("CurrentQuiz.Questions.CheckboxAnswers").
		Preload("CurrentQuiz.Questions.RadioAnswers").
		Preload("CurrentQuiz.Questions.TextAnswer").
		Preload("CurrentQuiz.Questions.FlowDiagramAnswer").
		First(&u)
	if res.RecordNotFound() {
		return nil, fmt.Errorf("No user with username %s\n", uname)
	}

	r, err := roleRoot.findChildWithId(u.RoleID)
	if err != nil {
		return nil, fmt.Errorf("could not assign role to user %d: %v", u.ID, err)
	}

	u.Role = r
	return u, nil
}

func FindByUsernameAndPassword(uname, pass string) (*User, error) {
	u := &User{}

	res := g.db.Where(&u).
		Preload("CurrentQuiz", "active = ?", true).
		Preload("CurrentQuiz.Questions").
		Preload("CurrentQuiz.Questions.CheckboxAnswers").
		Preload("CurrentQuiz.Questions.RadioAnswers").
		Preload("CurrentQuiz.Questions.TextAnswer").
		Preload("CurrentQuiz.Questions.FlowDiagramAnswer").
		Where("Username = ?", uname).
		First(&u)

	checkPass := CheckPassword(u.Password, pass)

	if res.RecordNotFound() || checkPass == false {
		return nil, fmt.Errorf("Bad credentials: %s, %s\n", uname, pass)
	}

	r, err := roleRoot.findChildWithId(u.RoleID)
	if err != nil {
		return nil, fmt.Errorf("could not assign role to user %d: %v", u.ID, err)
	}

	u.Role = r

	return u, nil
}

func (u *User) Save() {
	g.db.Save(u)
}

type Role struct {
	ID       int
	Name     string
	Children []Role
}

// Roles
var (
	roleDumb  = Role{ID: 999, Name: "dumb", Children: []Role{}}
	roleAdmin = Role{ID: 1, Name: "admin_only", Children: []Role{}}
	roleUser  = Role{ID: 2, Name: "user", Children: []Role{roleDumb}}
	roleRoot  = Role{
		ID:   0,
		Name: "root",
		Children: []Role{
			roleAdmin,
			roleUser,
		},
	}
)

func (u User) IsGranted(r Role) bool {
	_, err := u.Role.findChildWithId(r.ID)

	return err == nil
}

func (r Role) findChildWithId(id int) (Role, error) {
	if r.ID == id {
		return r, nil
	}

	for _, c := range r.Children {
		found, err := c.findChildWithId(id)
		if err == nil {
			return found, nil
		}
	}

	return Role{}, fmt.Errorf("role %d not found", id)
}
