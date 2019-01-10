import {
  APPEND_QUESTION_TEMPLATE,
  APPEND_QUIZ_TEMPLATE, REMOVE_QUESTION_TEMPLATE,
  REMOVE_QUIZ_TEMPLATE,
  SET_QUESTION_TEMPLATES,
  SET_QUIZ_TEMPLATES,
  SET_QUIZZES
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
