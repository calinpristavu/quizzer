package model

import (
	"fmt"

	"github.com/jinzhu/gorm"
)

type Pager struct {
	Page    int
	PerPage int
}

func (p Pager) AttachPagerClauses(qb *gorm.DB) *gorm.DB {
	return qb.
		Offset((p.Page - 1) * p.PerPage).
		Limit(p.PerPage)
}

type Sorter struct {
	By        string
	Direction string
}

func (s Sorter) AttachSorterClauses(qb *gorm.DB) *gorm.DB {
	if s.By == "" {
		s.By = "id"
		s.Direction = "desc"
	}

	if s.Direction == "" {
		s.Direction = "desc"
	}
	return qb.Order(fmt.Sprintf("%s %s", s.By, s.Direction))
}

type QuizFilter struct {
	UserIds         []int
	QuizTemplateIds []int
	Active          []int
	Corrected       []int
}

func (qf QuizFilter) AttachWhereClauses(qb *gorm.DB) *gorm.DB {
	if len(qf.UserIds) > 0 {
		qb = qb.Where("user_id IN (?)", qf.UserIds)
	}

	if len(qf.QuizTemplateIds) > 0 {
		qb = qb.Where("quiz_template_id IN (?)", qf.QuizTemplateIds)
	}

	if len(qf.Active) > 0 {
		qb = qb.Where("active IN (?)", qf.Active)
	}

	if len(qf.Corrected) > 0 {
		qb = qb.Where("corrected IN (?)", qf.Corrected)
	}

	return qb
}
