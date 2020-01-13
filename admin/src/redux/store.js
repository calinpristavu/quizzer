import {applyMiddleware, compose, createStore} from "redux";
import thunkMiddleware from 'redux-thunk';
import rootReducer from "redux/reducers";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(
    thunkMiddleware
  )),
);
