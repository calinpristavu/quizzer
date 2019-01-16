import {Card, CardBody, CardHeader, Table} from "reactstrap";
import UserRow from "./UserRow";
import React, {Component} from "react";
import {connect} from "react-redux";
import {getUsers} from "../../redux/actions";

class UserList extends Component {
  componentDidMount() {
    this.props.getUsers();
  }

  render() {
    return (
      <Card>
        <CardHeader>
          <span className="float-right">
            <i
              onClick={this.props.openCreateView}
              className="fa fa-plus-circle text-success"
              style={{cursor: "pointer"}}/>
          </span>
          <i className="fa fa-align-justify"/> Users <small className="text-muted">list</small>
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
              {this.props.list.map((user, index) =>
                <UserRow key={index} user={user}/>
              )}
            </tbody>
          </Table>
        </CardBody>
      </Card>
    );
  }
}

export default connect(
  state => ({
    list: state.user.all,
  }),
  {getUsers}
)(UserList);
