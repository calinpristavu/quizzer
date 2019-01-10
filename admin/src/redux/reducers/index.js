import { combineReducers } from "redux";
import quizTemplate from './quizTemplate';
import quiz from "./quiz";
import questionTemplate from "./questionTemplate";
import user from "./user";

export default combineReducers({ quizTemplate, quiz, questionTemplate, user });
