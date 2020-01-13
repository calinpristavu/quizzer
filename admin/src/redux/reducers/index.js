import { combineReducers } from "redux";
import quizTemplate from "redux/reducers/quizTemplate";
import quiz from "redux/reducers/quiz";
import questionTemplate from "redux/reducers/questionTemplate";
import tags from "redux/reducers/tags";
import user from "redux/reducers/user";
import stats from "redux/reducers/stats";

export default combineReducers({ quizTemplate, quiz, questionTemplate, tags, user, stats });
