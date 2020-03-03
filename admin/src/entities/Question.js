import {Record} from 'immutable';

export default class Question extends Record({
  ID: null,
  IsAnswered: false,
  IsCorrect: false,
  Type: null,
  Text: null,
  Score: null,
  CheckboxAnswers: [],
  RadioAnswers: [],
  CodeAnswer: null,
  FlowDiagramAnswer: null,
  Notes: null,
}, 'Question') {
}
