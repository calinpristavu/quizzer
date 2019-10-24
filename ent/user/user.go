// Code generated by entc, DO NOT EDIT.

package user

import (
	"github.com/calinpristavu/quizzer/ent/schema"
)

const (
	// Label holds the string label denoting the user type in the database.
	Label = "user"
	// FieldID holds the string denoting the id field in the database.
	FieldID = "id"
	// FieldUsername holds the string denoting the username vertex property in the database.
	FieldUsername = "username"
	// FieldPassword holds the string denoting the password vertex property in the database.
	FieldPassword = "password"
	// FieldRoleID holds the string denoting the role_id vertex property in the database.
	FieldRoleID = "role_id"
	// FieldIsEnabled holds the string denoting the is_enabled vertex property in the database.
	FieldIsEnabled = "is_enabled"
	// FieldShouldStartID holds the string denoting the should_start_id vertex property in the database.
	FieldShouldStartID = "should_start_id"
	// FieldComments holds the string denoting the comments vertex property in the database.
	FieldComments = "comments"
	// FieldRecruiteeID holds the string denoting the recruitee_id vertex property in the database.
	FieldRecruiteeID = "recruitee_id"

	// Table holds the table name of the user in the database.
	Table = "users"
)

// Columns holds all SQL columns are user fields.
var Columns = []string{
	FieldID,
	FieldUsername,
	FieldPassword,
	FieldRoleID,
	FieldIsEnabled,
	FieldShouldStartID,
	FieldComments,
	FieldRecruiteeID,
}

var (
	fields = schema.User{}.Fields()

	// descRoleID is the schema descriptor for role_id field.
	descRoleID = fields[2].Descriptor()
	// DefaultRoleID holds the default value on creation for the role_id field.
	DefaultRoleID = descRoleID.Default.(int)

	// descIsEnabled is the schema descriptor for is_enabled field.
	descIsEnabled = fields[3].Descriptor()
	// DefaultIsEnabled holds the default value on creation for the is_enabled field.
	DefaultIsEnabled = descIsEnabled.Default.(bool)
)
