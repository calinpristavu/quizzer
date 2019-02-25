import {
  APPEND_QUESTION_TEMPLATE, OPEN_QUESTION_TEMPLATE_EDIT, OPEN_QUESTION_TEMPLATE_VIEW,
  REMOVE_QUESTION_TEMPLATE, SET_QUESTION_TEMPLATE_CREATE,
  SET_QUESTION_TEMPLATES
} from "../actionTypes";
import {Map} from 'immutable';

const initialState = {
  list: Map(),
  viewedItem: null,
  editItem: null,
  createQuestionTemplate: true,
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_QUESTION_TEMPLATES: {
      return {
        ...state,
        list: Map(action.payload.map(e => [e.ID, e])).sort((a, b) =>
          // sort DESC
          a.ID > b.ID ? -1
            : a.ID === b.ID ? 0
            : 1
        )
      }
    }
    case REMOVE_QUESTION_TEMPLATE: {
      return {
        ...state,
        list: state.list.remove(action.payload)
      }
    }
    case APPEND_QUESTION_TEMPLATE: {
      return {
        ...state,
        list: state.list
          .asMutable()
          .set(action.payload.ID, action.payload)
          .sort((a, b) =>
            // sort DESC
            a.ID > b.ID ? -1
              : a.ID === b.ID ? 0
              : 1
          )
          .asImmutable(),
      }
    }
    case OPEN_QUESTION_TEMPLATE_VIEW: {
      return {
        ...state,
        viewedItem: action.payload
      }
    }
    case OPEN_QUESTION_TEMPLATE_EDIT: {
      return {
        ...state,
        editItem: action.payload
      }
    }
    case SET_QUESTION_TEMPLATE_CREATE: {
      return {
        ...state,
        createQuestionTemplate: action.payload
      }
    }

    default:
      return state;
  }
}
