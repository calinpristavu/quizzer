import React, { Component } from 'react';
import {Col, Row} from 'reactstrap';
import UserList from "./List";
import Create from "./Create";

const views = {
  create: 1,
  edit: 2,
  view: 3
};

class Users extends Component {
  state = {
    openedView: 1
  };

  render() {
    return (
      <div className="animated fadeIn">
        <Row>
          <Col xl={6}>
            <UserList
              openCreateView={() => this.setState({openedView: views.create})}/>
          </Col>
          <Col xl={6}>
            {this.state.openedView === views.create ?
              <Create/> : null
            }
          </Col>
        </Row>
      </div>
    )
  }
}

export default Users;
