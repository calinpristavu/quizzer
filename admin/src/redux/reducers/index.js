import { combineReducers } from "redux";
import quizTemplate from './quizTemplate';
import quiz from "./quiz";
import questionTemplate from "./questionTemplate";

export default combineReducers({ quizTemplate, quiz, questionTemplate });
