import {Record} from "immutable";
import moment from "moment";
import QuizQuestionTemplate from "entities/QuizQuestionTemplate";

export default class QuizTemplate extends Record({
  ID: null,
  CreatedAt: null,
  UpdatedAt: null,
  DeletedAt: null,
  Enabled: false,
  Name: null,
  QuizQuestions: [],
  Duration: null,
}) {
  constructor(data = {}) {
    super(data);
    this.set('CreatedAt', this.CreatedAt !== null ? moment(this.CreatedAt) : null);
    this.set('UpdatedAt', this.UpdatedAt !== null ? moment(this.UpdatedAt) : null);
    this.set('DeletedAt', this.DeletedAt !== null ? moment(this.DeletedAt) : null);
    this.set('QuizQuestions', this.QuizQuestions.map(qq => new QuizQuestionTemplate(qq)));
  }
}
