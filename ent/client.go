// Code generated by entc, DO NOT EDIT.

package ent

import (
	"context"
	"fmt"
	"log"

	"github.com/calinpristavu/quizzer/ent/migrate"

	"github.com/calinpristavu/quizzer/ent/quiz"
	"github.com/calinpristavu/quizzer/ent/user"

	"github.com/facebookincubator/ent/dialect"
	"github.com/facebookincubator/ent/dialect/sql"
)

// Client is the client that holds all ent builders.
type Client struct {
	config
	// Schema is the client for creating, migrating and dropping schema.
	Schema *migrate.Schema
	// Quiz is the client for interacting with the Quiz builders.
	Quiz *QuizClient
	// User is the client for interacting with the User builders.
	User *UserClient
}

// NewClient creates a new client configured with the given options.
func NewClient(opts ...Option) *Client {
	c := config{log: log.Println}
	c.options(opts...)
	return &Client{
		config: c,
		Schema: migrate.NewSchema(c.driver),
		Quiz:   NewQuizClient(c),
		User:   NewUserClient(c),
	}
}

// Open opens a connection to the database specified by the driver name and a
// driver-specific data source name, and returns a new client attached to it.
// Optional parameters can be added for configuring the client.
func Open(driverName, dataSourceName string, options ...Option) (*Client, error) {
	switch driverName {
	case dialect.MySQL, dialect.SQLite:
		drv, err := sql.Open(driverName, dataSourceName)
		if err != nil {
			return nil, err
		}
		return NewClient(append(options, Driver(drv))...), nil

	default:
		return nil, fmt.Errorf("unsupported driver: %q", driverName)
	}
}

// Tx returns a new transactional client.
func (c *Client) Tx(ctx context.Context) (*Tx, error) {
	if _, ok := c.driver.(*txDriver); ok {
		return nil, fmt.Errorf("ent: cannot start a transaction within a transaction")
	}
	tx, err := newTx(ctx, c.driver)
	if err != nil {
		return nil, fmt.Errorf("ent: starting a transaction: %v", err)
	}
	cfg := config{driver: tx, log: c.log, debug: c.debug}
	return &Tx{
		config: cfg,
		Quiz:   NewQuizClient(cfg),
		User:   NewUserClient(cfg),
	}, nil
}

// Debug returns a new debug-client. It's used to get verbose logging on specific operations.
//
//	client.Debug().
//		Quiz.
//		Query().
//		Count(ctx)
//
func (c *Client) Debug() *Client {
	if c.debug {
		return c
	}
	cfg := config{driver: dialect.Debug(c.driver, c.log), log: c.log, debug: true}
	return &Client{
		config: cfg,
		Schema: migrate.NewSchema(cfg.driver),
		Quiz:   NewQuizClient(cfg),
		User:   NewUserClient(cfg),
	}
}

// Close closes the database connection and prevents new queries from starting.
func (c *Client) Close() error {
	return c.driver.Close()
}

// QuizClient is a client for the Quiz schema.
type QuizClient struct {
	config
}

// NewQuizClient returns a client for the Quiz from the given config.
func NewQuizClient(c config) *QuizClient {
	return &QuizClient{config: c}
}

// Create returns a create builder for Quiz.
func (c *QuizClient) Create() *QuizCreate {
	return &QuizCreate{config: c.config}
}

// Update returns an update builder for Quiz.
func (c *QuizClient) Update() *QuizUpdate {
	return &QuizUpdate{config: c.config}
}

// UpdateOne returns an update builder for the given entity.
func (c *QuizClient) UpdateOne(q *Quiz) *QuizUpdateOne {
	return c.UpdateOneID(q.ID)
}

// UpdateOneID returns an update builder for the given id.
func (c *QuizClient) UpdateOneID(id int) *QuizUpdateOne {
	return &QuizUpdateOne{config: c.config, id: id}
}

// Delete returns a delete builder for Quiz.
func (c *QuizClient) Delete() *QuizDelete {
	return &QuizDelete{config: c.config}
}

// DeleteOne returns a delete builder for the given entity.
func (c *QuizClient) DeleteOne(q *Quiz) *QuizDeleteOne {
	return c.DeleteOneID(q.ID)
}

// DeleteOneID returns a delete builder for the given id.
func (c *QuizClient) DeleteOneID(id int) *QuizDeleteOne {
	return &QuizDeleteOne{c.Delete().Where(quiz.ID(id))}
}

// Create returns a query builder for Quiz.
func (c *QuizClient) Query() *QuizQuery {
	return &QuizQuery{config: c.config}
}

// Get returns a Quiz entity by its id.
func (c *QuizClient) Get(ctx context.Context, id int) (*Quiz, error) {
	return c.Query().Where(quiz.ID(id)).Only(ctx)
}

// GetX is like Get, but panics if an error occurs.
func (c *QuizClient) GetX(ctx context.Context, id int) *Quiz {
	q, err := c.Get(ctx, id)
	if err != nil {
		panic(err)
	}
	return q
}

// UserClient is a client for the User schema.
type UserClient struct {
	config
}

// NewUserClient returns a client for the User from the given config.
func NewUserClient(c config) *UserClient {
	return &UserClient{config: c}
}

// Create returns a create builder for User.
func (c *UserClient) Create() *UserCreate {
	return &UserCreate{config: c.config}
}

// Update returns an update builder for User.
func (c *UserClient) Update() *UserUpdate {
	return &UserUpdate{config: c.config}
}

// UpdateOne returns an update builder for the given entity.
func (c *UserClient) UpdateOne(u *User) *UserUpdateOne {
	return c.UpdateOneID(u.ID)
}

// UpdateOneID returns an update builder for the given id.
func (c *UserClient) UpdateOneID(id int) *UserUpdateOne {
	return &UserUpdateOne{config: c.config, id: id}
}

// Delete returns a delete builder for User.
func (c *UserClient) Delete() *UserDelete {
	return &UserDelete{config: c.config}
}

// DeleteOne returns a delete builder for the given entity.
func (c *UserClient) DeleteOne(u *User) *UserDeleteOne {
	return c.DeleteOneID(u.ID)
}

// DeleteOneID returns a delete builder for the given id.
func (c *UserClient) DeleteOneID(id int) *UserDeleteOne {
	return &UserDeleteOne{c.Delete().Where(user.ID(id))}
}

// Create returns a query builder for User.
func (c *UserClient) Query() *UserQuery {
	return &UserQuery{config: c.config}
}

// Get returns a User entity by its id.
func (c *UserClient) Get(ctx context.Context, id int) (*User, error) {
	return c.Query().Where(user.ID(id)).Only(ctx)
}

// GetX is like Get, but panics if an error occurs.
func (c *UserClient) GetX(ctx context.Context, id int) *User {
	u, err := c.Get(ctx, id)
	if err != nil {
		panic(err)
	}
	return u
}
