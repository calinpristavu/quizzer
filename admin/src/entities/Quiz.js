import {Record} from 'immutable';
import User from "entities/User";
import Question from "entities/Question";
import moment from "moment";

export default class Quiz extends Record({
  ID: null,
  CreatedAt: null,
  UpdatedAt: null,
  Duration: null,
  Corrected: false,
  Active: false,
  Score: 0.0,
  Name: null,
  CorrectingByID: null,
  User: null,
  Questions: [],
}){
  constructor(data = {}) {
    data.User = new User(data.User);
    data.Questions = data.Questions.map(q => new Question(q));
    data.CreatedAt = moment(data.CreatedAt);
    data.UpdatedAt = moment(data.UpdatedAt);

    super(data);
  }

  getPercentCompleted = () => {
    return (this.Questions.reduce(
      (carry, q) => carry + (q.IsAnswered ? 1 : 0),
      0
    ) * 100 / this.Questions.length) || 0
  };

  getTimeSpent = () => moment.duration(moment(this.UpdatedAt).diff(moment(this.CreatedAt)));
}
