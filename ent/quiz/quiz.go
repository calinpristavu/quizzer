// Code generated by entc, DO NOT EDIT.

package quiz

import (
	"github.com/calinpristavu/quizzer/ent/schema"
)

const (
	// Label holds the string label denoting the quiz type in the database.
	Label = "quiz"
	// FieldID holds the string denoting the id field in the database.
	FieldID = "id"
	// FieldName holds the string denoting the name vertex property in the database.
	FieldName = "name"
	// FieldActive holds the string denoting the active vertex property in the database.
	FieldActive = "active"
	// FieldScore holds the string denoting the score vertex property in the database.
	FieldScore = "score"
	// FieldCorrected holds the string denoting the corrected vertex property in the database.
	FieldCorrected = "corrected"

	// Table holds the table name of the quiz in the database.
	Table = "quizs"
)

// Columns holds all SQL columns are quiz fields.
var Columns = []string{
	FieldID,
	FieldName,
	FieldActive,
	FieldScore,
	FieldCorrected,
}

var (
	fields = schema.Quiz{}.Fields()

	// descActive is the schema descriptor for active field.
	descActive = fields[1].Descriptor()
	// DefaultActive holds the default value on creation for the active field.
	DefaultActive = descActive.Default.(bool)

	// descCorrected is the schema descriptor for corrected field.
	descCorrected = fields[3].Descriptor()
	// DefaultCorrected holds the default value on creation for the corrected field.
	DefaultCorrected = descCorrected.Default.(bool)
)
