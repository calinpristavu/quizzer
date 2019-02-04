import React, { Component } from 'react';
import moment from 'moment';
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Input,
  Row,
  Table
} from 'reactstrap';
import {connect} from "react-redux";
import {getUser, setUserComments} from "../../redux/actions";
import PropTypes from 'prop-types';

class User extends Component {
  static propTypes = {
    viewUser: PropTypes.shape({
      ID: PropTypes.number.isRequired,
      Username: PropTypes.string.isRequired,
      Role: PropTypes.shape({
        Name: PropTypes.string.isRequired
      }).isRequired,
      CreatedAt: PropTypes.string.isRequired,
      UpdatedAt: PropTypes.string,
      DeletedAt: PropTypes.string,
      CurrentQuizID: PropTypes.number,
      Comments: PropTypes.string.isRequired,
    })
  };

  state = {
    shouldSave: false
  };

  commentsRef = React.createRef();

  componentDidMount() {
    this.props.getUser(this.props.match.params.id)
  }

  saveComments = () => {
    this.setState({shouldSave: false});
    this.props
      .setUserComments(this.props.viewUser.ID, this.commentsRef.current.value);
  };

  render() {
    const user = this.props.viewUser;

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
                    <tr>
                      <td>Comments</td>
                      <td style={{postion: "absolute"}}>
                        <Input
                          innerRef={this.commentsRef}
                          type="textarea"
                          rows="9"
                          defaultValue={user.Comments}
                          onChange={() => this.setState({shouldSave: true})}
                          placeholder="Content..." />

                        {this.state.shouldSave &&
                          <h2 className="float-right text-primary">
                            <i
                              className="fa fa-save"
                              onClick={this.saveComments}
                              style={{cursor: "pointer"}}/>
                          </h2>
                        }
                      </td>
                    </tr>
                    <tr>
                      <td>Overall feeling</td>
                      <td>
                        1 - 2 - 3 - 4 - 5
                      </td>
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
    viewUser: state.user.viewUser
  }),
  {getUser, setUserComments}
)(User);
