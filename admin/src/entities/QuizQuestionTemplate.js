import {Record} from 'immutable';

export default class QuizQuestionTemplate extends Record({
  ID: null,
  Quiz: null,
  QuizID: null,
  Question: null,
  QuestionID: null,
  Weight: 10,
}) {
  constructor(data = {}) {
    super(data);
  }
}
