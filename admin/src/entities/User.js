import {Record} from 'immutable';
import moment from "moment";

export default class User extends Record({
  ID: null,
  RecruiteeId: null,
  Username: null,
  IsEnabled: false,
  CreatedAt: null,
  UpdatedAt: null,
  DeletedAt: null,
  CurrentQuizID: null,
  RoleID: null,
  Role: null,
  Attitude: null,
  Comments: null,
}) {
  constructor(data) {
    data.CreatedAt = moment(data.CreatedAt);
    data.UpdatedAt = data.UpdatedAt !== null ? moment(data.UpdatedAt) : null;
    data.DeletedAt = data.DeletedAt !== null ? moment(data.DeletedAt) : null;

    super(data);
  }

  static roles = {
    0: "Root",
    1: "Admin",
    2: "Candidate",
  };

  static attitudes = {
    1: "fa fa-frown-open",
    2: "fa fa-frown",
    3: "fa fa-meh",
    4: "fa fa-smile",
    5: "fa fa-grin-beam",
  };

  static load() {
    return new this(JSON.parse(localStorage.getItem('user')));
  }
}
