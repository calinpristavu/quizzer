// Code generated by entc, DO NOT EDIT.

package ent

import (
	"context"
	"errors"

	"github.com/calinpristavu/quizzer/ent/user"
	"github.com/facebookincubator/ent/dialect/sql"
)

// UserCreate is the builder for creating a User entity.
type UserCreate struct {
	config
	username        *string
	password        *string
	role_id         *int
	is_enabled      *bool
	should_start_id *int
	comments        *string
	recruitee_id    *int
}

// SetUsername sets the username field.
func (uc *UserCreate) SetUsername(s string) *UserCreate {
	uc.username = &s
	return uc
}

// SetPassword sets the password field.
func (uc *UserCreate) SetPassword(s string) *UserCreate {
	uc.password = &s
	return uc
}

// SetRoleID sets the role_id field.
func (uc *UserCreate) SetRoleID(i int) *UserCreate {
	uc.role_id = &i
	return uc
}

// SetNillableRoleID sets the role_id field if the given value is not nil.
func (uc *UserCreate) SetNillableRoleID(i *int) *UserCreate {
	if i != nil {
		uc.SetRoleID(*i)
	}
	return uc
}

// SetIsEnabled sets the is_enabled field.
func (uc *UserCreate) SetIsEnabled(b bool) *UserCreate {
	uc.is_enabled = &b
	return uc
}

// SetNillableIsEnabled sets the is_enabled field if the given value is not nil.
func (uc *UserCreate) SetNillableIsEnabled(b *bool) *UserCreate {
	if b != nil {
		uc.SetIsEnabled(*b)
	}
	return uc
}

// SetShouldStartID sets the should_start_id field.
func (uc *UserCreate) SetShouldStartID(i int) *UserCreate {
	uc.should_start_id = &i
	return uc
}

// SetNillableShouldStartID sets the should_start_id field if the given value is not nil.
func (uc *UserCreate) SetNillableShouldStartID(i *int) *UserCreate {
	if i != nil {
		uc.SetShouldStartID(*i)
	}
	return uc
}

// SetComments sets the comments field.
func (uc *UserCreate) SetComments(s string) *UserCreate {
	uc.comments = &s
	return uc
}

// SetRecruiteeID sets the recruitee_id field.
func (uc *UserCreate) SetRecruiteeID(i int) *UserCreate {
	uc.recruitee_id = &i
	return uc
}

// Save creates the User in the database.
func (uc *UserCreate) Save(ctx context.Context) (*User, error) {
	if uc.username == nil {
		return nil, errors.New("ent: missing required field \"username\"")
	}
	if uc.password == nil {
		return nil, errors.New("ent: missing required field \"password\"")
	}
	if uc.role_id == nil {
		v := user.DefaultRoleID
		uc.role_id = &v
	}
	if uc.is_enabled == nil {
		v := user.DefaultIsEnabled
		uc.is_enabled = &v
	}
	if uc.comments == nil {
		return nil, errors.New("ent: missing required field \"comments\"")
	}
	if uc.recruitee_id == nil {
		return nil, errors.New("ent: missing required field \"recruitee_id\"")
	}
	return uc.sqlSave(ctx)
}

// SaveX calls Save and panics if Save returns an error.
func (uc *UserCreate) SaveX(ctx context.Context) *User {
	v, err := uc.Save(ctx)
	if err != nil {
		panic(err)
	}
	return v
}

func (uc *UserCreate) sqlSave(ctx context.Context) (*User, error) {
	var (
		res sql.Result
		u   = &User{config: uc.config}
	)
	tx, err := uc.driver.Tx(ctx)
	if err != nil {
		return nil, err
	}
	builder := sql.Dialect(uc.driver.Dialect()).
		Insert(user.Table).
		Default()
	if value := uc.username; value != nil {
		builder.Set(user.FieldUsername, *value)
		u.Username = *value
	}
	if value := uc.password; value != nil {
		builder.Set(user.FieldPassword, *value)
		u.Password = *value
	}
	if value := uc.role_id; value != nil {
		builder.Set(user.FieldRoleID, *value)
		u.RoleID = *value
	}
	if value := uc.is_enabled; value != nil {
		builder.Set(user.FieldIsEnabled, *value)
		u.IsEnabled = *value
	}
	if value := uc.should_start_id; value != nil {
		builder.Set(user.FieldShouldStartID, *value)
		u.ShouldStartID = *value
	}
	if value := uc.comments; value != nil {
		builder.Set(user.FieldComments, *value)
		u.Comments = *value
	}
	if value := uc.recruitee_id; value != nil {
		builder.Set(user.FieldRecruiteeID, *value)
		u.RecruiteeID = *value
	}
	query, args := builder.Query()
	if err := tx.Exec(ctx, query, args, &res); err != nil {
		return nil, rollback(tx, err)
	}
	id, err := res.LastInsertId()
	if err != nil {
		return nil, rollback(tx, err)
	}
	u.ID = int(id)
	if err := tx.Commit(); err != nil {
		return nil, err
	}
	return u, nil
}
