import {Record} from 'immutable';
import QuizQuestionTemplate from "entities/QuizQuestionTemplate";

export default class QuestionTemplate extends Record({
  ID: null,
  CreatedAt: null,
  UpdatedAt: null,
  DeletedAt: null,
  Text: null,
  Type: null,
  Order: null,
  CheckboxAnswerTemplates: null,
  RadioAnswerTemplates: null,
  FlowDiagramAnswerTemplate: null,
  CodeAnswerTemplate: null,
  Usages: null,
  Tags: null,
  usage: 0,
  QuizQuestions: [],
}) {
  constructor(data) {
    super(data);
    this.set('QuizQuestions', this.QuizQuestions === null
      ? []
      : this.QuizQuestions.map(qq => new QuizQuestionTemplate(qq))
    );
  }
}
