import {Record} from 'immutable';
import Question from "entities/Question";

export default class QuizQuestionTemplate extends Record({
  ID: null,
  Quiz: null,
  QuizID: null,
  Question: null,
  QuestionID: null,
  Weight: 10,
}) {
  constructor(data = {}) {
    if (data.Question !== null || !(data.Question instanceof Question)) {
      data.Question = new Question(data.Question);
    }

    super(data);
  }
}
