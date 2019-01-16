import {OPEN_QUIZ_VIEW, SET_QUESTION_SCORE, SET_QUIZZES} from "../actionTypes";

const initialState = {
  list: [],
  viewedItem: null,
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_QUIZZES: {
      return {
        ...state,
        list: action.payload
      }
    }
    case OPEN_QUIZ_VIEW: {
      return {
        ...state,
        viewedItem: action.payload
      }
    }
    case SET_QUESTION_SCORE: {
      const Questions = state.viewedItem.Questions;

      Questions[Questions.indexOf(action.payload.question)].Score = action.payload.score;

      return {
        ...state,
        viewedItem: {
          ...state.viewedItem,
          Questions: [...Questions]
        },
        list: [
          ...state.list
        ]
      }
    }

    default:
      return state;
  }
}
