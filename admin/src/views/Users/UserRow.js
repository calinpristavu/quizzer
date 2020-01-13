import {Link} from "react-router-dom";
import moment from "moment";
import {Badge} from "reactstrap";
import React, {Component} from "react";
import PropTypes from 'prop-types';
import {attitudes, roles} from "views/Users/Users";

class UserRow extends Component {
  static propTypes = {
    user: PropTypes.shape({
      ID: PropTypes.number.isRequired,
      IsEnabled: PropTypes.bool.isRequired,
      Username: PropTypes.string.isRequired,
      CreatedAt: PropTypes.string.isRequired,
      RoleID: PropTypes.number.isRequired,
      Attitude: PropTypes.number.isRequired,
      Role: PropTypes.shape({
        Name: PropTypes.string.isRequired
      }).isRequired,
    }).isRequired
  };

  static getBadge = (status) => {
    return status === 'Active' ? 'success' :
      status === 'Inactive' ? 'secondary' :
        status === 'Pending' ? 'warning' :
          status === 'Banned' ? 'danger' :
            'primary'
  };

  getStatus = () => {
    return this.props.user.IsEnabled
      ? "Active"
      : "Inactive";
  };

  render() {
    const user = this.props.user;
    const userLink = `/users/${user.ID}`;
    const status = this.getStatus();

    return (
      <tr key={user.ID}>
        <th scope="row">
          <Link to={userLink}>{user.ID}</Link>
        </th>
        <td>
          <Link to={userLink}>{user.Username}</Link>
        </td>
        <td>{moment(user.CreatedAt).format('DD-MM-YYYY [at] k:mm')}</td>
        <td>
          <h2 className="attitude">
            <i
              className={`${attitudes[user.Attitude]} active`}/>
          </h2>
        </td>
        <td>{roles[user.RoleID]}</td>
        <td>
          <Link to={userLink}>
            <Badge color={UserRow.getBadge(status)}>{status}</Badge>
          </Link>
        </td>
      </tr>
    )
  }
}

export default UserRow;
