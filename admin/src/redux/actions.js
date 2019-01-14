import {
  APPEND_QUESTION_TEMPLATE,
  APPEND_QUIZ_TEMPLATE, LOGIN,
  LOGOUT,
  REMOVE_QUESTION_TEMPLATE,
  REMOVE_QUIZ_TEMPLATE,
  SET_QUESTION_TEMPLATES,
  SET_QUIZ_TEMPLATES,
  SET_QUIZZES, SET_STAT_AVG_RESULT, SET_STAT_BEST_RESULT,
  SET_USERS, SET_USERS_ONLINE, SET_VIEWED_USER
} from "./actionTypes";

export const logout = () => {
  localStorage.clear();

  return {
    type: LOGOUT
  }
};

export function getQuizTemplates() {
  return (dispatch, getState) => {
    if (getState().quizTemplate.list.length > 0) {
      return;
    }
    return fetch("/quiz-templates")
      .then(r => r.json())
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
      .then(r => r.json())
      .then(r => dispatch({
        type: APPEND_QUIZ_TEMPLATE,
        payload: r
      }));
  }
}

export function getQuestionTemplates() {
  return (dispatch, getState) => {
    if (getState().questionTemplate.list.length > 0) {
      return;
    }

    return fetch("/question-templates")
      .then(r => r.json())
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
      .then(r => r.json())
      .then(r => dispatch({
        type: APPEND_QUESTION_TEMPLATE,
        payload: r
      }));
  }
}

export function getQuizzes() {
  return dispatch => {
    return fetch("/quizzes")
      .then(r => r.json())
      .then(r => dispatch({
        type: SET_QUIZZES,
        payload: r
      }))
  }
}

export function getUsers() {
  return (dispatch, getState) => {
    if (getState().user.all.length > 0) {
      return;
    }

    return fetch("/users")
      .then(r => r.json())
      .then(r => dispatch({
        type: SET_USERS,
        payload: r
      }))
  }
}

export function getUser(id) {
  return dispatch => {
    return fetch("/users/" + id)
      .then(r => r.json())
      .then(r => dispatch({
        type: SET_VIEWED_USER,
        payload: r
      }))
  }
}

export function getUsersOnline() {
  return dispatch => {
    return fetch("/users-logged-in")
      .then(r => r.json())
      .then(r => {
        if (null !== r) {
          dispatch({
            type: SET_USERS_ONLINE,
            payload: r
          })
        }
      })
  }
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
      .then(r => r.json())
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
      .then(r => r.json())
      .then(r => dispatch({
        type: SET_STAT_AVG_RESULT,
        payload: r
      }))
  }
}

export function getStatBestResult() {
  return dispatch => {
    return fetch('/stats/best-result')
      .then(r => r.json())
      .then(r => dispatch({
        type: SET_STAT_BEST_RESULT,
        payload: r
      }))
  }
}
