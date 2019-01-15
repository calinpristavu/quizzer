import {OPEN_QUIZ_VIEW, SET_QUIZZES} from "../actionTypes";

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

    default:
      return state;
  }
}
