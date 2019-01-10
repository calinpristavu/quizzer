import {Link} from "react-router-dom";
import moment from "moment";
import {Badge} from "reactstrap";
import React, {Component} from "react";
import PropTypes from 'prop-types';

class UserRow extends Component {
  static propTypes = {
    user: PropTypes.object.isRequired
  };

  // Todo: Do we need this?
  getBadge = (status) => {
    return status === 'Active' ? 'success' :
      status === 'Inactive' ? 'secondary' :
        status === 'Pending' ? 'warning' :
          status === 'Banned' ? 'danger' :
            'primary'
  };

  render() {
    const user = this.props.user;
    const userLink = `/users/${user.ID}`;

    return (
      <tr key={user.ID}>
        <th scope="row">
          <Link to={userLink}>{user.ID}</Link>
        </th>
        <td>
          <Link to={userLink}>{user.Username}</Link>
        </td>
        <td>{moment(user.CreatedAt).format('DD-MM-YYYY [at] k:mm')}</td>
        <td>{user.Role.Name}</td>
        <td>
          <Link to={userLink}>
            {/*<Badge color={getBadge(user.status)}>{user.status}</Badge>*/}
            <Badge color={this.getBadge("Banned")}>Banned</Badge>
          </Link>
        </td>
      </tr>
    )
  }
}

export default UserRow;
