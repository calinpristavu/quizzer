import {
  APPEND_QUIZ_TEMPLATE,
  SET_QUIZ_TEMPLATE_CREATE,
  REMOVE_QUIZ_TEMPLATE,
  SET_QUIZ_TEMPLATES,
  SET_QUIZ_TEMPLATE_EDIT,
} from "redux/actionTypes";
import {Map} from 'immutable';

const initialState = {
  list: Map(),
  createItem: null,
  editItem: null,
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_QUIZ_TEMPLATES: {
      return {
        ...state,
        list: Map(action.payload.map(q => [q.ID, q])).sort((a, b) =>
          // sort DESC
          a.ID > b.ID ? -1
            : a.ID === b.ID ? 0
            : 1
        ),
      }
    }
    case REMOVE_QUIZ_TEMPLATE: {
      return {
        ...state,
        list: state.list.delete(action.payload)
      }
    }
    case APPEND_QUIZ_TEMPLATE: {
      return {
        ...state,
        list: state.list
          .asMutable()
          .set(action.payload.ID, action.payload).sort((a, b) =>
            // sort DESC
            a.ID > b.ID ? -1
              : a.ID === b.ID ? 0
                : 1
          )
          .asImmutable()
      }
    }

    case SET_QUIZ_TEMPLATE_CREATE: {
      return {
        ...state,
        createItem: action.payload
      }
    }

    case SET_QUIZ_TEMPLATE_EDIT: {
      return {
        ...state,
        editItem: action.payload
      }
    }

    default:
      return state;
  }
}
