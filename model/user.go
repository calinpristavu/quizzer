package model

import (
	"fmt"
	"math/rand"
	"strconv"
	"strings"
	"time"

	"github.com/jinzhu/gorm"
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

var animals = [20]string{
	"Hamster", "Ape", "Bald", "Eagle Eye", "Starfish", "Ibex", "Cow", "Tapir", "Dog", "Addax",
	"Impala", "Squirrel", "Shrew", "Sugar", "Jackal", "Armadillo", "Baboon", "Skunk", "Ox", "Rooster",
}
var programmingJargon = [20]string{
	"Algorithm", "State Machine", "Cobol", "Loop", "Elixir", "TeX", "IDE", "CamelCase", "Mongoose", "DB",
	"Groovy", "Prolog", "Hex", "Erlang", "Ruby", "The Pascal", "Kotlin", "Basic", "Assembly", "Visual",
}

func FindByUsername(uname string) (*User, error) {
	u := &User{Username: uname}

	res := db.Where(&u).
		Preload("CurrentQuiz", "active = ?", true).
		Preload("CurrentQuiz.Questions").
		Preload("CurrentQuiz.Questions.CheckboxAnswers").
		Preload("CurrentQuiz.Questions.RadioAnswers").
		Preload("CurrentQuiz.Questions.TextAnswer").
		Preload("CurrentQuiz.Questions.FlowDiagramAnswer").
		Preload("CurrentQuiz.Questions.Feedback").
		First(&u)
	if res.RecordNotFound() {
		return nil, fmt.Errorf("No user with username %s\n", uname)
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
		Preload("CurrentQuiz.Questions.TextAnswer").
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

func (u *User) Save() {
	db.Save(u)
}

func (u *User) Create() error {
	u.CreatedAt = time.Now()
	res := db.Save(u)

	return res.Error
}

func CreateGuest() (*User, error) {
	var u User
	rand.Seed(time.Now().UnixNano())
	uname := strings.Join([]string{
		animals[rand.Intn(len(animals)-1)],
		programmingJargon[rand.Intn(len(programmingJargon)-1)],
		strconv.Itoa(rand.Intn(999))},
		" ")
	u.Username = uname
	u.CreatedAt = time.Now()
	u.RoleID = RoleGuest.ID

	r, err := RoleGuest.FindChildWithId(u.RoleID)
	if err != nil {
		return nil, fmt.Errorf("could not assign role to user %d: %v", u.ID, err)
	}

	u.Role = r

	res := db.Save(&u)

	return &u, res.Error
}

type Role struct {
	ID       int
	Name     string
	Children []Role
}

// Roles
var (
	RoleRoot = Role{
		ID:   0,
		Name: "root",
		Children: []Role{
			RoleAdmin,
		},
	}
	RoleAdmin       = Role{ID: 1, Name: "admin_only", Children: []Role{RoleGuest}}
	RoleGuest       = Role{ID: 2, Name: "guest", Children: []Role{RoleContributor}}
	RoleContributor = Role{ID: 3, Name: "contrib", Children: []Role{RoleUser}}
	RoleUser        = Role{ID: 4, Name: "user", Children: []Role{}}
)

func (u User) IsGranted(r Role) bool {
	_, err := u.Role.FindChildWithId(r.ID)

	return err == nil
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

func (u *User) FinishQuiz() {
	u.CurrentQuiz.Active = false
	// u.CurrentQuiz.Corrected = false
	u.CurrentQuiz.UpdateScore()

	db.Save(&u.CurrentQuiz)

	u.CurrentQuiz = nil
	u.CurrentQuizID = nil
	db.Save(&u)
}

func (u *User) FindFinishedQuizzes() []Quiz {
	var qs []Quiz

	db.Model(&Quiz{}).
		Preload("Questions").
		Preload("Questions.CheckboxAnswers").
		Preload("Questions.RadioAnswers").
		Preload("Questions.TextAnswer").
		Preload("Questions.FlowDiagramAnswer").
		Preload("Questions.Feedback").
		Where("user_id = ?", u.ID).
		Where("active = 0").
		Order("id desc").
		Find(&qs)

	return qs
}

func CheckPassword(expectedPasswordHashed, password string) bool {
	check := bcrypt.CompareHashAndPassword([]byte((expectedPasswordHashed)), []byte(password))

	return check == nil
}
