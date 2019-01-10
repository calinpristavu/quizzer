import {SET_QUIZ_TEMPLATES, SET_QUIZZES} from "./actionTypes";

export const setQuizTemplates = quizzes => ({
  type: SET_QUIZ_TEMPLATES,
  payload: quizzes
});

export const setQuizzes = quizzes => ({
  type: SET_QUIZZES,
  payload: quizzes
});
