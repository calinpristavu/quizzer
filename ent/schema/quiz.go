package schema

import (
	"github.com/facebookincubator/ent"
	"github.com/facebookincubator/ent/schema/edge"
	"github.com/facebookincubator/ent/schema/field"
)

// Quiz holds the schema definition for the Quiz entity.
type Quiz struct {
	ent.Schema
}

// Fields of the Quiz.
func (Quiz) Fields() []ent.Field {
	return []ent.Field{
		field.String("name"),
		field.Bool("active").
			Default(true),
		field.Uint("score"),
		field.Bool("corrected").
			Default(false),
	}
}

// Edges of the Quiz.
func (Quiz) Edges() []ent.Edge {
	return []ent.Edge{
		edge.From("user", User.Type).
			Unique(),
	}
}

func (Quiz) Config() ent.Config {
	return ent.Config{
		Table: "ent_quizzes",
	}
}
