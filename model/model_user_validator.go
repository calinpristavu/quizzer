package model

import (
	"errors"
	"net/url"
)

type Validator struct {
	validationErrors map[string]interface{}
	err              error
}

func ChangeUsernameFormValidator(form url.Values) (map[string]interface{}, error) {
	validator := Validator{err: usernameValidator(form.Get("username"))}
	if validator.err != nil {
		validator.setErrorMessage("username")

		return validator.validationErrors, errors.New("username validation error")
	}

	return validator.validationErrors, nil
}

func ChangePasswordFormValidator(form url.Values) (map[string]interface{}, error) {
	validator := Validator{}
	validator.err = samePassword(form.Get("password"), form.Get("repeated"))
	if validator.err != nil {
		validator.setErrorMessage("password")

		return validator.validationErrors, errors.New("password validation error")
	}

	validator.err = passwordValidator(form.Get("password"))
	if validator.err != nil {
		validator.setErrorMessage("password")

		return validator.validationErrors, errors.New("password validation error")
	}

	return validator.validationErrors, nil
}

func (validator *Validator) setErrorMessage(key string) {
	if validator.validationErrors == nil {
		validator.validationErrors = make(map[string]interface{})
	}

	validator.validationErrors[key] = validator.err.Error()
}

func (validator *Validator) hasErrors() bool {
	if 0 == len(validator.validationErrors) {
		return false
	}

	return true
}

func usernameValidator(username string) error {
	if len(username) < 3 || len(username) > 255 {
		return errors.New("the username must have at least 3 and not more than 255 characters")
	}
	return nil
}

func passwordValidator(password string) error {
	if len(password) < 3 || len(password) > 255 {
		return errors.New("the password must have at least 3 and not more than 255 characters")
	}
	return nil
}

func samePassword(password, repeated string) error {
	if password != repeated {
		return errors.New("the passwords must be the same")
	}
	return nil
}
