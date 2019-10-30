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
  page: 1,
  perPage: 2,
  noItems: 1,
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_QUIZZES: {
      return {
        ...state,
        list: Map(action.payload.Items.map(e => [e.ID, e])),
        page: action.payload.Page,
        perPage: action.payload.PerPage,
        noItems: action.payload.NoItems,
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
        viewedItem: {
          ...state.viewedItem,
          CorrectingByID: action.payload
        }
      }
    }
    case SET_QUESTION_SCORE: {
      const questionIndex = state.viewedItem.Questions.indexOf(action.payload.question);
      state.viewedItem.Questions[questionIndex].Score = action.payload.score;

      return {
        ...state,
        viewedItem: {
          ...state.viewedItem,
        },
      }
    }
    case SET_QUESTION_NOTE: {
      const questionIndex = state.viewedItem.Questions.indexOf(action.payload.question);
      state.viewedItem.Questions[questionIndex].Notes = action.payload.note;

      return {
        ...state,
        viewedItem: {
          ...state.viewedItem,
        }
      }
    }

    default:
      return state;
  }
}
