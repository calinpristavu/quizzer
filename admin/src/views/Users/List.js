import PropTypes from "prop-types";
import {Card, CardBody, CardHeader, Table} from "reactstrap";
import UserRow from "./UserRow";
import React, {Component} from "react";

class UserList extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    users: PropTypes.arrayOf(PropTypes.object).isRequired
  };

  render() {
    return (
      <Card>
        <CardHeader>
          <i className="fa fa-align-justify"/> {this.props.title} <small className="text-muted">list</small>
        </CardHeader>
        <CardBody>
          <Table responsive hover>
            <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Name</th>
              <th scope="col">Registered</th>
              <th scope="col">Role</th>
              <th scope="col">Status</th>
            </tr>
            </thead>
            <tbody>
            {this.props.users.map((user, index) =>
              <UserRow key={index} user={user}/>
            )}
            </tbody>
          </Table>
        </CardBody>
      </Card>
    );
  }
}

export default UserList;
