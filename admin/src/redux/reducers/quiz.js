import {
  OPEN_QUIZ_VIEW,
  SET_QUESTION_NOTE,
  SET_QUESTION_SCORE,
  SET_QUIZ_CORRECTING_BY,
  SET_QUIZZES
} from "../actionTypes";
import {Map} from 'immutable';

const initialState = {
  list: Map(),
  viewedItem: null,
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_QUIZZES: {
      return {
        ...state,
        list: Map(action.payload.map(e => [e.ID, e])).sort((a, b) =>
          // sort DESC
          a.ID > b.ID ? -1
            : a.ID === b.ID ? 0
            : 1
        ),
      }
    }
    case OPEN_QUIZ_VIEW: {
      return {
        ...state,
        viewedItem: action.payload
      }
    }
    case SET_QUIZ_CORRECTING_BY: {
      return {
        ...state,
        list: state.list.setIn([
          state.viewedItem,
          "CorrectingByID"
        ], action.payload),
      }
    }
    case SET_QUESTION_SCORE: {
      return {
        ...state,
        list: state.list.setIn([
          state.viewedItem,
          "Questions",
          state.list.get(state.viewedItem).Questions.indexOf(action.payload.question),
          "Score"
        ], action.payload.score),
      }
    }
    case SET_QUESTION_NOTE: {
      return {
        ...state,
        list: state.list.setIn([
          state.viewedItem,
          "Questions",
          state.list.get(state.viewedItem).Questions.indexOf(action.payload.question),
          "Notes"
        ], action.payload.note),
      }
    }

    default:
      return state;
  }
}
