import {SET_QUIZZES} from "../actionTypes";

const initialState = {
  list: []
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_QUIZZES: {
      return {
        ...state,
        list: action.payload
      }
    }

    default:
      return state;
  }
}
