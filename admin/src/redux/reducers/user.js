import {SET_USERS, SET_USERS_ONLINE, SET_VIEWED_USER} from "../actionTypes";

const initialState = {
  all: [],
  online: [],
  viewedUser: null,
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_VIEWED_USER: {
      return {
        ...state,
        viewedUser: action.payload
      }
    }
    case SET_USERS: {
      return {
        ...state,
        all: action.payload
      }
    }
    case SET_USERS_ONLINE: {
      return {
        ...state,
        online: action.payload
      }
    }

    default:
      return state;
  }
}
