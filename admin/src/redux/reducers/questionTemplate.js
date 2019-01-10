import {
  APPEND_QUESTION_TEMPLATE,
  REMOVE_QUESTION_TEMPLATE,
  SET_QUESTION_TEMPLATES
} from "../actionTypes";

const initialState = {
  list: []
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_QUESTION_TEMPLATES: {
      return {
        ...state,
        list: action.payload
      }
    }
    case REMOVE_QUESTION_TEMPLATE: {
      return {
        ...state,
        list: state.list.filter(e => e.ID !== action.payload)
      }
    }
    case APPEND_QUESTION_TEMPLATE: {
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
