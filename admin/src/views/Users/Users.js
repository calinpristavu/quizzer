import React, { Component } from 'react';
import {Col, Row} from 'reactstrap';
import UserList from "./List";
import Create from "./Create";

export const roles = {
  0: "Root",
  1: "Admin",
  2: "User",
};

class Users extends Component {
  render() {
    return (
      <div className="animated fadeIn">
        <Row>
          <Col xl={6}>
            <UserList/>
          </Col>
          <Col xl={6}>
            <Create/>
          </Col>
        </Row>
      </div>
    )
  }
}

export default Users;
