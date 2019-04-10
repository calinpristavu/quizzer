package model

type QuestionsByOrder []*Question

func (a QuestionsByOrder) Len() int           { return len(a) }
func (a QuestionsByOrder) Less(i, j int) bool { return a[i].Order < a[j].Order }
func (a QuestionsByOrder) Swap(i, j int)      { a[i], a[j] = a[j], a[i] }
