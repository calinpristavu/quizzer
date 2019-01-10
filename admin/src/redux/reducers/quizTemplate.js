import {SET_QUIZ_TEMPLATES} from "../actionTypes";

const initialState = {
  list: []
};

export default function(state = initialState, action) {
  switch (action) {
    case SET_QUIZ_TEMPLATES: {
      return {
        ...state,
        list: action.payload.list
      }
    }
    default:
      return state;
  }
}
