import {
  APPEND_QUESTION_TEMPLATE,
  APPEND_QUIZ_TEMPLATE, LOGIN, LOGOUT, REMOVE_QUESTION_TEMPLATE,
  REMOVE_QUIZ_TEMPLATE,
  SET_QUESTION_TEMPLATES,
  SET_QUIZ_TEMPLATES,
  SET_QUIZZES,
  SET_USERS, SET_USERS_ONLINE, SET_VIEWED_USER
} from "./actionTypes";

export const setQuizTemplates = quizzes => ({
  type: SET_QUIZ_TEMPLATES,
  payload: quizzes
});

export const removeQuizTemplate = id => ({
  type: REMOVE_QUIZ_TEMPLATE,
  payload: id
});

export const appendQuizTemplate = q => ({
  type: APPEND_QUIZ_TEMPLATE,
  payload: q
});

export const setQuestionTemplates = questions => ({
  type: SET_QUESTION_TEMPLATES,
  payload: questions
});

export const removeQuestionTemplate = id => ({
  type: REMOVE_QUESTION_TEMPLATE,
  payload: id
});

export const appendQuestionTemplate = q => ({
  type: APPEND_QUESTION_TEMPLATE,
  payload: q
});

export const setQuizzes = quizzes => ({
  type: SET_QUIZZES,
  payload: quizzes
});

export const setUsers = users => ({
  type: SET_USERS,
  payload: users
});

export const setUsersOnline = users => ({
  type: SET_USERS_ONLINE,
  payload: users
});

export const setViewedUser = user => ({
  type: SET_VIEWED_USER,
  payload: user
});

export const login = token => ({
  type: LOGIN,
  payload: token
});

export const logout = () => {
  localStorage.clear();
  return {
    type: LOGOUT
  }
};
