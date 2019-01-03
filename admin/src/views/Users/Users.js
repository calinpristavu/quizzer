import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import PropTypes from 'prop-types'
import {
  Badge,
  Card,
  CardBody,
  CardHeader,
  Col,
  Row,
  Table
} from 'reactstrap';

class Users extends Component {
  state = {
    all: [],
    online: []
  };

  componentDidMount() {
    fetch(process.env.REACT_APP_API_BASE_URL + "/users")
      .then(r => r.json())
      .then(r => {
        this.setState({
          all: r
        })
      });

    fetch(process.env.REACT_APP_API_BASE_URL + "/users-logged-in")
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

function UserRow(props) {
  const user = props.user;
  const userLink = `/users/${user.ID}`;

  // Todo: Do we need this?
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
      <td>{moment(user.CreatedAt).format('DD-MM-YYYY [at] k:mm')}</td>
      <td>{user.Role}</td>
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
  static propTypes = {
    title: PropTypes.string,
    users: PropTypes.arrayOf(PropTypes.object)
  };

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

export default Users;
