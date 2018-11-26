package webapp

import (
	"fmt"

	"github.com/jinzhu/gorm"
)

type User struct {
	gorm.Model
	Username    string
	Password    string
	CurrentQuiz *Quiz
}

var LoggedIn map[string]*User

func init() {
	LoggedIn = make(map[string]*User, 5)
}

func FindByUsername(uname string) (*User, error) {
	u := &User{Username: uname}

	var err error
	if h.db.Where(u).First(u).RecordNotFound() {
		err = fmt.Errorf("No user with username %s\n", uname)
	}

	return u, err
}

func FindByUsernameAndPassword(uname, pass string) (*User, error) {
	u := &User{
		Username: uname,
		Password: pass,
	}

	var err error
	if h.db.Where(u).First(u).RecordNotFound() {
		err = fmt.Errorf("Bad credentials: %s, %s\n", uname, pass)
	}

	return u, err
}

func (u *User) Save() {
	h.db.Save(u)
}
