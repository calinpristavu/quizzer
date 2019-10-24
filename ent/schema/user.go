package schema

import (
	"github.com/facebookincubator/ent"
	"github.com/facebookincubator/ent/schema/edge"
	"github.com/facebookincubator/ent/schema/field"
)

// User holds the schema definition for the User entity.
type User struct {
	ent.Schema
}

// Fields of the User.
func (User) Fields() []ent.Field {
	return []ent.Field{
		field.String("username").
			Unique(),
		field.String("password").
			Sensitive(),
		field.Int("role_id").
			Default(0),
		field.Bool("is_enabled").
			Default(false),
		field.Int("should_start_id").
			Optional(),
		field.Text("comments"),
		field.Int("recruitee_id"),
	}
}

// Edges of the User.
func (User) Edges() []ent.Edge {
	return []ent.Edge{
		edge.To("current_quiz", Quiz.Type).
			Unique(),
	}
}

func (User) Config() ent.Config {
	return ent.Config{
		Table: "ent_users",
	}
}
