import React, { Component } from 'react';
import {Col, Row} from 'reactstrap';
import UserList from "views/Users/List";
import Create from "views/Users/Create";
import Recruitee from "views/Users/Recruitee";

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
            <Recruitee/>
          </Col>
        </Row>
      </div>
    )
  }
}

export default Users;
