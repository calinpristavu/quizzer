package model

import (
	"fmt"
	"sort"
	"time"

	"github.com/jinzhu/gorm"
	"github.com/sirupsen/logrus"
	"golang.org/x/crypto/bcrypt"
)

type User struct {
	gorm.Model
	Username      string `gorm:"unique_index" valid:"length(3|255)~The username must have at least 3 and not more than 255 characters"`
	Password      string `json:"-"`
	RoleID        int    `sql:"DEFAULT:0"`
	Role          Role   `sql:"-"`
	IsEnabled     bool   `sql:"DEFAULT:0"`
	CurrentQuizID *uint
	CurrentQuiz   *Quiz
	ShouldStartID *uint
	Comments      string `sql:"type:longtext"`
	Attitude      int    `sql:"DEFAULT:3"`
	RecruiteeID   *int
}

type Role struct {
	ID       int
	Name     string
	Children []Role
}

var (
	RoleRoot = Role{
		ID:   0,
		Name: "root",
		Children: []Role{
			RoleAdmin,
		},
	}
	RoleAdmin       = Role{ID: 1, Name: "admin_only", Children: []Role{RoleContributor}}
	RoleGuest       = Role{ID: 997, Name: "guest", Children: []Role{RoleContributor}}
	RoleContributor = Role{ID: 998, Name: "contrib", Children: []Role{RoleUser}}
	RoleUser        = Role{ID: 2, Name: "user", Children: []Role{}}
)

func FindByUsername(uname string) (*User, error) {
	u := &User{Username: uname}

	res := db.Where(&u).
		Preload("CurrentQuiz", "active = ?", true).
		Preload("CurrentQuiz.Questions").
		Preload("CurrentQuiz.Questions.CheckboxAnswers").
		Preload("CurrentQuiz.Questions.RadioAnswers").
		Preload("CurrentQuiz.Questions.CodeAnswer").
		Preload("CurrentQuiz.Questions.FlowDiagramAnswer").
		Preload("CurrentQuiz.Questions.Feedback").
		First(&u)
	if res.RecordNotFound() {
		return nil, fmt.Errorf("No user with username %s\n", uname)
	}

	if u.CurrentQuiz != nil {
		sort.Sort(QuestionsByOrder(u.CurrentQuiz.Questions))
	}

	r, err := RoleRoot.FindChildWithId(u.RoleID)
	if err != nil {
		return nil, fmt.Errorf("could not assign role to user %d: %v", u.ID, err)
	}

	u.Role = r
	return u, nil
}

func FindByUsernameAndPassword(uname, pass string) (*User, error) {
	u := &User{}

	res := db.Model(&u).
		Preload("CurrentQuiz", "active = ?", true).
		Preload("CurrentQuiz.Questions").
		Preload("CurrentQuiz.Questions.CheckboxAnswers").
		Preload("CurrentQuiz.Questions.RadioAnswers").
		Preload("CurrentQuiz.Questions.CodeAnswer").
		Preload("CurrentQuiz.Questions.FlowDiagramAnswer").
		Preload("CurrentQuiz.Questions.Feedback").
		Where("Username = ?", uname).
		First(&u)

	checkPass := CheckPassword(u.Password, pass)

	if res.RecordNotFound() || checkPass == false {
		return nil, fmt.Errorf("Bad credentials: %s, %s\n", uname, pass)
	}

	r, err := RoleRoot.FindChildWithId(u.RoleID)
	if err != nil {
		return nil, fmt.Errorf("could not assign role to user %d: %v", u.ID, err)
	}

	u.Role = r

	return u, nil
}

func FindUsers() []User {
	var us []User

	db.Find(&us)

	return us
}

func FindUser(id uint) (User, bool) {
	var u User

	res := db.Find(&u, id)

	return u, !res.RecordNotFound()
}

func CheckPassword(expectedPasswordHashed, password string) bool {
	check := bcrypt.CompareHashAndPassword([]byte(expectedPasswordHashed), []byte(password))

	return check == nil
}

func (u *User) Save() {
	db.Save(u)
}

func (u *User) Create() error {
	u.CreatedAt = time.Now()
	res := db.Save(u)

	return res.Error
}

func (u User) IsAdmin() bool {
	_, err := u.Role.FindChildWithId(RoleAdmin.ID)

	return err == nil
}

func (u User) IsGuest() bool {
	_, err := u.Role.FindChildWithId(RoleGuest.ID)

	return err == nil
}

func (u User) IsContributor() bool {
	_, err := u.Role.FindChildWithId(RoleContributor.ID)

	return err == nil
}

func (u User) IsGranted(r Role) bool {
	_, err := u.Role.FindChildWithId(r.ID)

	return err == nil
}

func (u *User) FinishQuiz() {
	u.CurrentQuiz.Active = false
	u.CurrentQuiz.UpdateScore()

	db.Save(&u.CurrentQuiz)

	u.CurrentQuiz = nil
	u.CurrentQuizID = nil
	db.Save(&u)

	logrus.Printf("finished quiz: %v", u.CurrentQuiz)
}

func (u *User) FindFinishedQuizzes() []Quiz {
	var qs []Quiz

	db.Model(&Quiz{}).
		Preload("Questions").
		Preload("Questions.CheckboxAnswers").
		Preload("Questions.RadioAnswers").
		Preload("Questions.CodeAnswer").
		Preload("Questions.FlowDiagramAnswer").
		Preload("Questions.Feedback").
		Where("user_id = ?", u.ID).
		Where("active = 0").
		Order("id desc").
		Find(&qs)

	return qs
}

func (u *User) FindQuiz(qID uint) Quiz {
	return FindQuizByCriteria(qID, u.ID)
}

func (r Role) FindChildWithId(id int) (Role, error) {
	if r.ID == id {
		return r, nil
	}

	for _, c := range r.Children {
		found, err := c.FindChildWithId(id)
		if err == nil {
			return found, nil
		}
	}

	return Role{}, fmt.Errorf("role %d not found", id)
}
