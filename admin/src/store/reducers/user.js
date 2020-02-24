import {
  APPEND_USER,
  LOGIN,
  LOGOUT, SET_CANDIDATES, SET_USER_CREATE,
  SET_USERS,
  SET_USERS_ONLINE,
  SET_VIEWED_USER,
  UPDATE_USER,
} from "store/actionTypes";
import {Set, Map} from 'immutable';

const initialState = {
  all: Map(),
  online: Map(),
  candidates: Set(),
  viewUser: null,
  createUser: true,
  token: localStorage.getItem('token'),
  loggedInUser: JSON.parse(localStorage.getItem('user'))
};

export default function(state = initialState, action) {
  switch (action.type) {
    case LOGIN: {
      return {
        ...state,
        token: action.payload.token,
        loggedInUser: action.payload.user,
      }
    }
    case LOGOUT: {
      return {
        ...state,
        token: null,
        loggedInUser: null
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
        all: Map(action.payload.map(u => [u.ID, u])).sort((a, b) =>
          // sort DESC
          a.ID > b.ID ? -1
            : a.ID === b.ID ? 0
            : 1
        ),
      }
    }
    case SET_CANDIDATES: {
      return {
        ...state,
        candidates: Set(action.payload.map(c => ({
          id: c.id,
          name: c.emails[0],
          username: c.emails[0].toLowerCase().trim().replace(" ", ".")
        }))),
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
        all: state.all.asMutable()
          .set(action.payload.ID, action.payload)
          .sort((a, b) =>
            // sort DESC
            a.ID > b.ID ? -1
              : a.ID === b.ID ? 0
              : 1
          )
          .asImmutable()
      }
    }
    case UPDATE_USER: {
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
