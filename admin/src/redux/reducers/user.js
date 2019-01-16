import {
  APPEND_USER,
  LOGIN,
  LOGOUT,
  SET_USERS,
  SET_USERS_ONLINE,
  SET_VIEWED_USER
} from "../actionTypes";

const initialState = {
  all: [],
  online: [],
  viewedUser: null,
  token: localStorage.getItem('token')
};

export default function(state = initialState, action) {
  switch (action.type) {
    case LOGIN: {
      return {
        ...state,
        token: action.payload
      }
    }
    case LOGOUT: {
      return {
        ...state,
        token: null
      }
    }
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
    case APPEND_USER: {
      return {
        ...state,
        all: [
          action.payload,
          ...state.all
        ]
      }
    }

    default:
      return state;
  }
}
