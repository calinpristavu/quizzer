// Code generated by entc, DO NOT EDIT.

package migrate

import (
	"github.com/calinpristavu/quizzer/ent/quiz"
	"github.com/calinpristavu/quizzer/ent/user"

	"github.com/facebookincubator/ent/dialect/sql/schema"
	"github.com/facebookincubator/ent/schema/field"
)

var (
	// QuizsColumns holds the columns for the "quizs" table.
	QuizsColumns = []*schema.Column{
		{Name: "id", Type: field.TypeInt, Increment: true},
		{Name: "name", Type: field.TypeString},
		{Name: "active", Type: field.TypeBool, Default: quiz.DefaultActive},
		{Name: "score", Type: field.TypeUint},
		{Name: "corrected", Type: field.TypeBool, Default: quiz.DefaultCorrected},
	}
	// QuizsTable holds the schema information for the "quizs" table.
	QuizsTable = &schema.Table{
		Name:        "quizs",
		Columns:     QuizsColumns,
		PrimaryKey:  []*schema.Column{QuizsColumns[0]},
		ForeignKeys: []*schema.ForeignKey{},
	}
	// UsersColumns holds the columns for the "users" table.
	UsersColumns = []*schema.Column{
		{Name: "id", Type: field.TypeInt, Increment: true},
		{Name: "username", Type: field.TypeString, Unique: true},
		{Name: "password", Type: field.TypeString},
		{Name: "role_id", Type: field.TypeInt, Default: user.DefaultRoleID},
		{Name: "is_enabled", Type: field.TypeBool, Default: user.DefaultIsEnabled},
		{Name: "should_start_id", Type: field.TypeInt, Nullable: true},
		{Name: "comments", Type: field.TypeString, Size: 2147483647},
		{Name: "recruitee_id", Type: field.TypeInt},
	}
	// UsersTable holds the schema information for the "users" table.
	UsersTable = &schema.Table{
		Name:        "users",
		Columns:     UsersColumns,
		PrimaryKey:  []*schema.Column{UsersColumns[0]},
		ForeignKeys: []*schema.ForeignKey{},
	}
	// Tables holds all the tables in the schema.
	Tables = []*schema.Table{
		QuizsTable,
		UsersTable,
	}
)

func init() {
}
