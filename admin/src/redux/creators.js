import {appendQuizTemplate, removeQuizTemplate, setQuizTemplates, setQuizzes} from "./actions";

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
