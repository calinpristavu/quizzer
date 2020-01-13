import {
  SET_STAT_AVG_RESULT,
  SET_STAT_AVG_TIME,
  SET_STAT_BEST_RESULT,
  SET_STAT_TOTAL_ATTEMPTS,
  SET_STAT_TOTAL_INCOMPLETE
} from "redux/actionTypes";
import moment from "moment";

// TODO: Find a way to sync BE and FE dates .. Good Luck with that one.
const initialState = {
  avgResult: {},
  avgTimeToComplete: {},
  bestResult: {},
  totalAttempts: {},
  totalIncomplete: {},
  from: moment().subtract(4, 'weeks').hour(2).minute(0).second(0).millisecond(0)
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_STAT_AVG_RESULT: {
      return {
        ...state,
        avgResult: dateAsKey(action.payload)
      }
    }
    case SET_STAT_AVG_TIME: {
      return {
        ...state,
        avgTimeToComplete: dateAsKey(action.payload)
      }
    }
    case SET_STAT_BEST_RESULT: {
      return {
        ...state,
        bestResult: dateAsKey(action.payload)
      }
    }
    case SET_STAT_TOTAL_ATTEMPTS: {
      return {
        ...state,
        totalAttempts: dateAsKey(action.payload)
      }
    }
    case SET_STAT_TOTAL_INCOMPLETE: {
      return {
        ...state,
        totalIncomplete: dateAsKey(action.payload)
      }
    }

    default:
      return state;
  }
}

function dateAsKey(array) {
  const dictionary = {};
  array.forEach(e => {
    dictionary[moment(e.Date).format('Y-M-D')] = e.Number
  });

  return dictionary
}
