import { combineReducers } from "redux";
import quizTemplate from "store/reducers/quizTemplate";
import quiz from "store/reducers/quiz";
import questionTemplate from "store/reducers/questionTemplate";
import tags from "store/reducers/tags";
import user from "store/reducers/user";
import stats from "store/reducers/stats";

export default combineReducers({ quizTemplate, quiz, questionTemplate, tags, user, stats });
