import {APPEND_QUIZ_TEMPLATE, REMOVE_QUIZ_TEMPLATE, SET_QUIZ_TEMPLATES} from "../actionTypes";

const initialState = {
  list: []
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_QUIZ_TEMPLATES: {
      return {
        ...state,
        list: action.payload
      }
    }
    case REMOVE_QUIZ_TEMPLATE: {
      return {
        ...state,
        list: state.list.filter(e => e.ID !== action.payload)
      }
    }
    case APPEND_QUIZ_TEMPLATE: {
      return {
        ...state,
        list: [
          action.payload,
          ...state.list
        ]
      }
    }

    default:
      return state;
  }
}
