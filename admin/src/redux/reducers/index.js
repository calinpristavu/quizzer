import { combineReducers } from "redux";
import quizTemplate from './quizTemplate';
import quiz from "./quiz";
import questionTemplate from "./questionTemplate";
import user from "./user";
import stats from "./stats";
import tags from "./tags";

export default combineReducers({ quizTemplate, quiz, questionTemplate, tags, user, stats });
