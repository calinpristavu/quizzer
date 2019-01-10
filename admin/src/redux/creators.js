import {setQuizTemplates, setQuizzes} from "./actions";

export function getQuizTemplates() {
  return dispatch => {
    return fetch("/quiz-templates")
      .then(r => r.json())
      .then(r => dispatch(setQuizTemplates(r)))
  }
}

export function getQuizzes() {
  return dispatch => {
    return fetch("/quizzes")
      .then(r => r.json())
      .then(r => dispatch(setQuizzes(r)))
  }
}
