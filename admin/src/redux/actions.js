import {SET_QUIZ_TEMPLATES} from "./actionTypes";

export const setQuizTemplates = quizzes => ({
  type: SET_QUIZ_TEMPLATES,
  payload: {
    list: quizzes
  }
});
