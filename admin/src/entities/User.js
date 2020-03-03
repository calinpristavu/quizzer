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
  constructor(data = {}) {
    super(data);
    this.set('CreatedAt', moment(data.CreatedAt));
    this.set('UpdatedAt', moment(data.UpdatedAt));
    this.set('DeletedAt', moment(data.DeletedAt));
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
    const storedUser = localStorage.getItem('user');
    if (null === storedUser) {
      return null;
    }
    return new this(JSON.parse(storedUser));
  }
}
