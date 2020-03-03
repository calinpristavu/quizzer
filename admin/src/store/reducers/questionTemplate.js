import {
  APPEND_QUESTION_TEMPLATE,
  OPEN_QUESTION_TEMPLATE_EDIT,
  OPEN_QUESTION_TEMPLATE_VIEW,
  REMOVE_QUESTION_TEMPLATE,
  SET_QUESTION_TEMPLATE_CREATE,
  SET_QUESTION_TEMPLATES,
} from "store/actionTypes";
import {Map} from 'immutable';
import QuestionTemplate from "entities/QuestionTemplate";

const initialState = {
  list: Map(),
  viewedItem: null,
  editItem: null,
  createQuestionTemplate: null,
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_QUESTION_TEMPLATES: {
      return {
        ...state,
        list: Map(action.payload.map(e => [e.ID, new QuestionTemplate(e)])).sort((a, b) =>
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
      const qt = state.list
        .get(action.payload.ID, new QuestionTemplate())
        .merge(action.payload);

      return {
        ...state,
        list: state.list
          .asMutable()
          .set(qt.ID, qt)
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
