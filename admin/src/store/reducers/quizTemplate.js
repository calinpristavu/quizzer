import {
  APPEND_QUIZ_TEMPLATE,
  SET_QUIZ_TEMPLATE_CREATE,
  REMOVE_QUIZ_TEMPLATE,
  SET_QUIZ_TEMPLATES,
  SET_QUIZ_TEMPLATE_EDIT,
} from "store/actionTypes";
import {Map} from 'immutable';
import QuizTemplate from "entities/QuizTemplate";

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
        list: Map(action.payload.map(q => [q.ID, new QuizTemplate(q)])).sort((a, b) =>
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
        list: state.list.delete(action.payload),
        // also close editItem if item was deleted
        editItem: state.editItem.ID !== action.payload ? state.editItem : null,
      }
    }
    case APPEND_QUIZ_TEMPLATE: {
      return {
        ...state,
        list: state.list
          .asMutable()
          .set(action.payload.ID, new QuizTemplate(action.payload)).sort((a, b) =>
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
        editItem: action.payload !== null ? new QuizTemplate(action.payload) : null
      }
    }

    default:
      return state;
  }
}
