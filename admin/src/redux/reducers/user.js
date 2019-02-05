import {
  APPEND_USER,
  LOGIN,
  LOGOUT, SET_USER_CREATE,
  SET_USERS,
  SET_USERS_ONLINE,
  SET_VIEWED_USER
} from "../actionTypes";
import {Map} from 'immutable';

const initialState = {
  all: Map(),
  online: Map(),
  viewUser: null,
  createUser: true,
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
        viewUser: action.payload
      }
    }
    case SET_USERS: {
      return {
        ...state,
        all: Map(action.payload.map(u => [u.ID, u])),
      }
    }
    case SET_USERS_ONLINE: {
      return {
        ...state,
        online: Map(action.payload.map(u => [u.ID, u])),
      }
    }
    case APPEND_USER: {
      return {
        ...state,
        all: state.all.set(action.payload.ID, action.payload)
      }
    }
    case SET_USER_CREATE: {
      return {
        ...state,
        createUser: action.payload
      }
    }

    default:
      return state;
  }
}
