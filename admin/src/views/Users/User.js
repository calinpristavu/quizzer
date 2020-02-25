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
import PropTypes from 'prop-types';
import {getUser, getUsers, updateUser} from "store/actions";
import {viewedUser} from "store/selectors";
import UserEntity from 'entities/User';

class User extends Component {
  static propTypes = {
    user: PropTypes.instanceOf(UserEntity)
  };

  static defaultProps = {
    user: null,
  };

  state = {
    shouldSave: false,
    Comments: "",
  };

  commentsRef = React.createRef();

  componentDidMount() {
    this.props.getUsers()
      .then(() => {
        this.props.getUser(this.props.match.params.id)
          .then(() => {
            this.setState({Comments: this.props.user.Comments})
          });
      });
  }

  saveComments = () => {
    this.setState({shouldSave: false});
    this.props.updateUser(
      this.props.user.ID,
      {
        Comments: this.commentsRef.current.value
      }
    );
  };

  saveAttitude = (attitude) => {
    if (this.props.user.Attitude === attitude) {
      return;
    }
    this.props.updateUser(this.props.user.ID, {
      Attitude: attitude
    });
  };

  render() {
    const user = this.props.user;

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
                          value={this.state.Comments}
                          onChange={(e) => this.setState({shouldSave: true, Comments: e.target.value})}
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
                      <td>Attitude</td>
                      <td>
                        <h2 className="attitude">
                          <i
                            onClick={() => this.saveAttitude(1)}
                            className={`fa fa-frown-open ${user.Attitude === 1 && 'active'}`}/>
                          <i
                            onClick={() => this.saveAttitude(2)}
                            className={`fa fa-frown ${user.Attitude === 2 && 'active'}`}/>
                          <i
                            onClick={() => this.saveAttitude(3)}
                            className={`fa fa-meh ${user.Attitude === 3 && 'active'}`}/>
                          <i
                            onClick={() => this.saveAttitude(4)}
                            className={`fa fa-smile ${user.Attitude === 4 && 'active'}`}/>
                          <i
                            onClick={() => this.saveAttitude(5)}
                            className={`fa fa-grin-beam ${user.Attitude === 5 && 'active'}`}/>
                        </h2>
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
    user: viewedUser(state)
  }),
  {getUser, getUsers, updateUser}
)(User);
