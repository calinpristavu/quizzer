import {
  APPEND_QUESTION_TEMPLATE,
  APPEND_QUIZ_TEMPLATE,
  APPEND_USER,
  LOGIN,
  LOGOUT,
  OPEN_QUESTION_TEMPLATE_VIEW,
  OPEN_QUIZ_VIEW,
  SET_USER_CREATE,
  REMOVE_QUESTION_TEMPLATE,
  REMOVE_QUIZ_TEMPLATE,
  SET_QUESTION_TEMPLATES,
  SET_QUIZ_TEMPLATES,
  SET_QUIZZES,
  SET_STAT_AVG_RESULT,
  SET_STAT_BEST_RESULT,
  SET_USERS,
  SET_VIEWED_USER,
  SET_QUESTION_SCORE,
  SET_QUESTION_TEMPLATE_CREATE,
  SET_QUESTION_NOTE,
  UPDATE_USER,
  SET_CANDIDATES, OPEN_QUESTION_TEMPLATE_EDIT, SET_QUIZ_TEMPLATE_CREATE
} from "./actionTypes";
import Noty from "noty";

export const logout = () => {
  localStorage.clear();

  return {
    type: LOGOUT
  }
};

export function getQuizTemplates() {
  return (dispatch, getState) => {
    if (getState().quizTemplate.list.size > 0) {
      return Promise.resolve();
    }
    return fetch("/quiz-templates")
      .then(r => dispatch({
        type: SET_QUIZ_TEMPLATES,
        payload: r
      }))
  }
}

export function deleteQuizTemplate(id) {
  return dispatch => {
    return fetch('/quiz-templates/' + id, {
      method: "DELETE"
    })
      .then(() => dispatch({
        type: REMOVE_QUIZ_TEMPLATE,
        payload: id
      }));
  }
}

export function createQuizTemplate(quizTemplate) {
  return dispatch => {
    return fetch("/quiz-templates", {
      method: "POST",
      body: JSON.stringify(quizTemplate)
    })
      .then(r => dispatch({
        type: APPEND_QUIZ_TEMPLATE,
        payload: r
      }));
  }
}

export function updateQuizTemplate(quizTemplate) {
  return dispatch => {
    return fetch("/quiz-templates/" + quizTemplate.ID, {
      method: "PUT",
      body: JSON.stringify(quizTemplate)
    })
      .then(r => {
        dispatch({
          type: APPEND_QUIZ_TEMPLATE,
          payload: r
        });
      });
  }
}

export function setQuizTemplateCreate(item) {
  return dispatch => dispatch({
    type: SET_QUIZ_TEMPLATE_CREATE,
    payload: item
  })
}

export function getQuestionTemplates() {
  return (dispatch, getState) => {
    if (getState().questionTemplate.list.size > 0) {
      return Promise.resolve();
    }

    return fetch("/question-templates")
      .then(r => dispatch({
        type: SET_QUESTION_TEMPLATES,
        payload: r
      }))
  }
}

export function deleteQuestionTemplate(id) {
  return dispatch => {
    return fetch('/question-templates/' + id, {
      method: "DELETE"
    })
      .then(() => dispatch({
        type: REMOVE_QUESTION_TEMPLATE,
        payload: id
      }));
  }
}

export function createQuestionTemplate(questionTemplate) {
  return dispatch => {
    return fetch("/question-templates", {
      method: "POST",
      body: JSON.stringify(questionTemplate)
    })
      .then(r => dispatch({
        type: APPEND_QUESTION_TEMPLATE,
        payload: r
      }));
  }
}

export function updateQuestionTemplate(questionTemplate) {
  return dispatch => {
    return fetch("/question-templates/" + questionTemplate.ID, {
      method: "PUT",
      body: JSON.stringify(questionTemplate)
    })
      .then(r => {
        dispatch({
          type: APPEND_QUESTION_TEMPLATE,
          payload: r
        });
        dispatch({
          type: OPEN_QUESTION_TEMPLATE_EDIT,
          payload: null
        })
      });
  }
}

export function setQuestionTemplateCreate(val) {
  return dispatch => dispatch({type: SET_QUESTION_TEMPLATE_CREATE, payload: val})
}

export function getQuizzes() {
  return dispatch => {
    return fetch("/quizzes")
      .then(r => dispatch({
        type: SET_QUIZZES,
        payload: r
      }))
  }
}

export function getUsers() {
  return (dispatch, getState) => {
    if (getState().user.all.size > 0) {
      return Promise.resolve();
    }

    return fetch("/users")
      .then(r => dispatch({
        type: SET_USERS,
        payload: r
      }))
  }
}

export function getCandidates() {
  return (dispatch, getState) => {
    if (getState().user.candidates.size > 0) {
      return Promise.resolve();
    }

    return fetch("/recruitee/find-candidates")
      .then(r => dispatch({
        type: SET_CANDIDATES,
        payload: r
      }))
  }
}

export function createUser(u) {
  return dispatch => {
    return fetch("/users", {
      method: "POST",
      body: JSON.stringify(u)
    })
      .then(r => dispatch({
        type: APPEND_USER,
        payload: r
      }))
  }
}

export function updateUser(id, changedFields) {
  return dispatch => {
    return fetch(`/users/${id}`, {
      method: "PATCH",
      body: JSON.stringify(changedFields)
    })
      .then(r => dispatch({
        type: UPDATE_USER,
        payload: r
      }))
  }
}

export function getUser(id) {
  return dispatch => {
    return fetch("/users/" + id)
      .then(r => dispatch({
        type: SET_VIEWED_USER,
        payload: r.ID
      }))
  }
}

export function setUserCreate(val) {
  return dispatch => dispatch({type: SET_USER_CREATE, payload: val})
}

export function getToken(username, password) {
  return dispatch => {
    return fetch('/token', {
      method: "POST",
      body: JSON.stringify({
        Username: username,
        Password: password
      })
    })
      .then(r => {
        localStorage.setItem('token', r.token);
        dispatch({
          type: LOGIN,
          payload: r.token
        });
      })
  }
}

export function getStatAvgResult() {
  return dispatch => {
    return fetch('/stats/avg-result')
      .then(r => dispatch({
        type: SET_STAT_AVG_RESULT,
        payload: r
      }))
  }
}

export function getStatBestResult() {
  return dispatch => {
    return fetch('/stats/best-result')
      .then(r => dispatch({
        type: SET_STAT_BEST_RESULT,
        payload: r
      }))
  }
}

export function openQuestionTemplateView(qt) {
  return dispatch => {
    return dispatch({
        type: OPEN_QUESTION_TEMPLATE_VIEW,
        payload: qt
      })
  }
}

export function openQuestionTemplateEdit(qt) {
  return dispatch => {
    return dispatch({
        type: OPEN_QUESTION_TEMPLATE_EDIT,
        payload: qt
      })
  }
}

export function openQuizView(q) {
  return dispatch => {
    return dispatch({
        type: OPEN_QUIZ_VIEW,
        payload: q
      })
  }
}

export function setQuestionScore(question, score) {
  return dispatch => {
    return dispatch({
      type: SET_QUESTION_SCORE,
      payload: {
        question: question,
        score: score
      }
    })
  }
}

export function setQuestionNote(question, note) {
  return dispatch => {
    return dispatch({
      type: SET_QUESTION_NOTE,
      payload: {
        question: question,
        note: note
      }
    })
  }
}

export function saveScores(quiz) {
  return () => {
    fetch('/quizzes/save-scores', {
      method: "POST",
      body: JSON.stringify(quiz)
    })
      .then(r => {
        new Noty({
          text: r,
          type: 'success',
        }).show();
      })
  }
}
