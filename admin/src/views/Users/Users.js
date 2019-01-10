import React, { Component } from 'react';
import {Col, Row} from 'reactstrap';
import {connect} from "react-redux";
import {getUsers, getUsersOnline} from "../../redux/creators";
import UserList from "./List";

class Users extends Component {
  componentDidMount() {
    this.props.getUsers();
    this.props.getUsersOnline();
  }

  render() {
    return (
      <div className="animated fadeIn">
        <Row>
          <Col xl={6}>
            <UserList
              title="All"
              users={this.props.all}/>
          </Col>
          <Col xl={6}>
            <UserList
              title="Currently Online"
              users={this.props.online}/>
          </Col>
        </Row>
      </div>
    )
  }
}

export default connect(
  state => ({
    all: state.user.all,
    online: state.user.online,
  }),
  {getUsers, getUsersOnline}
)(Users);
