import {APPEND_QUIZ_TEMPLATE, REMOVE_QUIZ_TEMPLATE, SET_QUIZ_TEMPLATES, SET_QUIZZES} from "./actionTypes";

export const setQuizTemplates = quizzes => ({
  type: SET_QUIZ_TEMPLATES,
  payload: quizzes
});

export const setQuizzes = quizzes => ({
  type: SET_QUIZZES,
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
