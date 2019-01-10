import {
  appendQuestionTemplate,
  appendQuizTemplate,
  removeQuestionTemplate,
  removeQuizTemplate,
  setQuestionTemplates,
  setQuizTemplates,
  setQuizzes
} from "./actions";

export function getQuizTemplates() {
  return dispatch => {
    return fetch("/quiz-templates")
      .then(r => r.json())
      .then(r => dispatch(setQuizTemplates(r)))
  }
}

export function deleteQuizTemplate(id) {
  return dispatch => {
    return fetch('/quiz-templates/' + id, {
      method: "DELETE"
    })
      .then(() => dispatch(removeQuizTemplate(id)));
  }
}

export function createQuizTemplate(quizTemplate) {
  return dispatch => {
    return fetch("/quiz-templates", {
      method: "POST",
      body: JSON.stringify(quizTemplate)
    })
      .then(r => r.json())
      .then(r => dispatch(appendQuizTemplate(r)));
  }
}

export function getQuizzes() {
  return dispatch => {
    return fetch("/quizzes")
      .then(r => r.json())
      .then(r => dispatch(setQuizzes(r)))
  }
}

export function getQuestionTemplates() {
  return dispatch => {
    return fetch("/question-templates")
      .then(r => r.json())
      .then(r => dispatch(setQuestionTemplates(r)))
  }
}

export function deleteQuestionTemplate(id) {
  return dispatch => {
    return fetch('/question-templates/' + id, {
      method: "DELETE"
    })
      .then(() => dispatch(removeQuestionTemplate(id)));
  }
}

export function createQuestionTemplate(questionTemplate) {
  return dispatch => {
    return fetch("/question-templates", {
      method: "POST",
      body: JSON.stringify(questionTemplate)
    })
      .then(r => r.json())
      .then(r => dispatch(appendQuestionTemplate(r)));
  }
}
