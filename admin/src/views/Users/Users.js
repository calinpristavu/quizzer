import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {
  Badge,
  Card,
  CardBody,
  CardHeader,
  Col,
  Row,
  Table
} from 'reactstrap';

function UserRow(props) {
  const user = props.user;
  const userLink = `/users/${user.ID}`;

  const getBadge = (status) => {
    return status === 'Active' ? 'success' :
      status === 'Inactive' ? 'secondary' :
        status === 'Pending' ? 'warning' :
          status === 'Banned' ? 'danger' :
            'primary'
  };

  return (
    <tr key={user.ID}>
      <th scope="row">
        <Link to={userLink}>{user.ID}</Link>
      </th>
      <td>
        <Link to={userLink}>{user.Username}</Link>
      </td>
      <td>{user.CreatedAt}</td>
      {/*<td>{user.role}</td>*/}
      <td>Smecher</td>
      <td>
        <Link to={userLink}>
          {/*<Badge color={getBadge(user.status)}>{user.status}</Badge>*/}
          <Badge color={getBadge("Banned")}>Banned</Badge>
        </Link>
      </td>
    </tr>
  )
}

class UserList extends Component {
  render() {
    return <Col xl={6}>
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
    </Col>;
  }
}

class Users extends Component {
  state = {
    all: [],
    online: []
  };

  componentDidMount() {
    fetch("http://localhost:8001/new-api/users")
      .then(r => r.json())
      .then(r => {
        this.setState({
          all: r
        })
      });

    fetch("http://localhost:8001/new-api/users-logged-in")
      .then(r => r.json())
      .then(r => {
        this.setState({
          online: r ? r : []
        })
      })
  }

  render() {
    return (
      <div className="animated fadeIn">
        <Row>
          <UserList
            title="All"
            users={this.state.all}/>
          <UserList
            title="Currently Online"
            users={this.state.online}/>
        </Row>
      </div>
    )
  }
}

export default Users;
