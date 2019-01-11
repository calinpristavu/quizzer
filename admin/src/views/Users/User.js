import React, { Component } from 'react';
import moment from 'moment';
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Row,
  Table
} from 'reactstrap';
import {connect} from "react-redux";
import {getUser} from "../../redux/actions";
import PropTypes from 'prop-types';

class User extends Component {
  static propTypes = {
    user: PropTypes.shape({
      ID: PropTypes.number.isRequired,
      Username: PropTypes.string.isRequired,
      Role: PropTypes.shape({
        Name: PropTypes.string.isRequired
      }).isRequired,
      CreatedAt: PropTypes.string.isRequired,
      UpdatedAt: PropTypes.string.isRequired,
      DeletedAt: PropTypes.string.isRequired,
      CurrentQuizID: PropTypes.number.isRequired,
    })
  };

  componentDidMount() {
    this.props.getUser(this.props.match.params.id)
  }

  render() {
    const user = this.props.viewedUser;

    if (null === user) {
      return null;
    }

    return (
      <div className="animated fadeIn">
        <Row>
          <Col lg={6}>
            <Card>
              <CardHeader>
                <strong>
                  <i className="icon-info pr-1" />User id: {user.ID}
                </strong>
              </CardHeader>
              <CardBody>
                  <Table responsive striped>
                    <tbody>
                      <tr>
                        <td>ID:</td>
                        <td><strong>{user.ID}</strong></td>
                      </tr>
                      <tr>
                        <td>Username</td>
                        <td><strong>{user.Username}</strong></td>
                      </tr>
                      <tr>
                        <td>Role</td>
                        <td><strong>{user.Role && user.Role.Name}</strong></td>
                      </tr>
                      <tr>
                        <td>Created At:</td>
                        <td><strong>{moment(user.CreatedAt).format('DD-MM-YYYY [at] k:mm')}</strong></td>
                      </tr>
                      <tr>
                        <td>Updated At:</td>
                        <td>
                          <strong>
                            {user.UpdatedAt && moment(user.UpdatedAt).format('DD-MM-YYYY [at] k:mm')}
                          </strong>
                        </td>
                      </tr>
                      <tr>
                        <td>Deleted At:</td>
                        <td>
                          <strong>
                            {user.DeletedAt && moment(user.DeletedAt).format('DD-MM-YYYY [at] k:mm')}
                          </strong>
                        </td>
                      </tr>
                      <tr>
                        <td>Current Quiz ID</td>
                        <td><strong>{user.CurrentQuizID}</strong></td>
                      </tr>
                    </tbody>
                  </Table>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    )
  }
}

export default connect(
  state => ({
    viewedUser: state.user.viewedUser
  }),
  {getUser}
)(User);
