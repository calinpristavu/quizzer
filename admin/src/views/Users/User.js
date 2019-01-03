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

class User extends Component {
  state = {
    user: {
      ID: null,
      Username: null,
      Role: null,
      CreatedAt: null,
      UpdatedAt: null,
      DeletedAt: null,
      CurrentQuizID: null
    }
  };

  componentDidMount() {
    fetch("http://localhost:8001/new-api/users/" + this.props.match.params.id)
      .then((response) => response.json())
      .then((response) => {
        this.setState({
          user: response
        })
      })
  }

  render() {

    const user = this.state.user;

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
                        <td><strong>{user.Role}</strong></td>
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

export default User;
