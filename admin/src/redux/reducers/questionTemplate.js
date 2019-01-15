import {
  APPEND_QUESTION_TEMPLATE, OPEN_QUESTION_TEMPLATE_VIEW,
  REMOVE_QUESTION_TEMPLATE,
  SET_QUESTION_TEMPLATES
} from "../actionTypes";

const initialState = {
  list: [],
  viewedItem: null,
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
    case OPEN_QUESTION_TEMPLATE_VIEW: {
      return {
        ...state,
        viewedItem: action.payload
      }
    }

    default:
      return state;
  }
}
