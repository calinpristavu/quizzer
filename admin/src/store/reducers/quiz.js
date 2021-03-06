import {
  OPEN_QUIZ_VIEW,
  SET_QUESTION_NOTE,
  SET_QUESTION_SCORE,
  SET_QUIZ_CORRECTING_BY, SET_QUIZ_FILTER, SET_QUIZ_SORTING,
  SET_QUIZZES
} from "store/actionTypes";
import {Map} from 'immutable';
import Quiz from "entities/Quiz";

const initialState = {
  list: Map(),
  viewedItem: null,
  page: 1,
  perPage: 5,
  noItems: 5,
  sortBy: null,
  sortDir: "asc",
  filters: Map(),
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_QUIZZES: {
      return {
        ...state,
        list: Map(action.payload.Items.map(e => [e.ID, new Quiz(e)])),
        page: action.payload.Page,
        perPage: action.payload.PerPage,
        noItems: action.payload.NoItems,
      }
    }
    case OPEN_QUIZ_VIEW: {
      return {
        ...state,
        viewedItem: action.payload !== null ? new Quiz(action.payload) : null,
      }
    }
    case SET_QUIZ_CORRECTING_BY: {
      return {
        ...state,
        viewedItem: state.viewedItem.set('CorrectingByID', action.payload),
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
    case SET_QUIZ_FILTER: {
      if (action.payload.values.length < 1) {
        return {
          ...state,
          filters: state.filters.delete(action.payload.field)
        }
      }

      return {
        ...state,
        filters: state.filters.set(action.payload.field, action.payload.values)
      }
    }
    case SET_QUIZ_SORTING: {
      return {
        ...state,
        sortBy: action.payload.sortBy,
        sortDir: action.payload.sortDir,
      }
    }
    default:
      return state;
  }
}
