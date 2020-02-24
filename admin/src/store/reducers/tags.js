import {Set} from 'immutable';
import {SET_QUESTION_TAGS} from "store/actionTypes";

const initialState = {
  list: Set()
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_QUESTION_TAGS:
      return {
        ...state,
        list: Set(action.payload),
      };
    default:
      return state;
  }
}
