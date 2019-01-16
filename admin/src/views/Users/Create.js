import React, {Component} from 'react';
import {Button, Card, CardBody, CardFooter, CardHeader, Col, Form, FormGroup, Input, Label} from "reactstrap";
import {connect} from "react-redux";
import {createUser} from "../../redux/actions";

class Create extends Component {
  defaultState = {
    Username: "",
    RoleID: 2,
  };

  state = this.defaultState;

  create = () => {
    this.props.createUser(this.state)
      .then(() => this.setState(this.defaultState))
  };

  render() {
    return (
      <Card>
        <Form>
          <CardHeader>
            <i className="fa fa-plus-circle text-success" />
            <strong>Register User</strong>
            <small> Form</small>
          </CardHeader>
          <CardBody>
            <FormGroup>
              <Label htmlFor="question-text">Username</Label>
              <Input
                type="text"
                value={this.state.Username}
                onChange={(e) => this.setState({Username: e.target.value})}
                placeholder="john.doe"
                required />
            </FormGroup>
            <FormGroup row>
              <Col md="12">
                <Label>Role</Label>
              </Col>
              <Col md="12">
                <FormGroup check inline>
                  <Input
                    className="form-check-input"
                    type="radio"
                    checked={this.state.RoleID === 2}
                    onChange={() => this.setState({RoleID: 2})}
                    id="user-role-1"/>
                  <Label
                    className="form-check-label"
                    check
                    htmlFor="user-role-1">
                    User
                  </Label>
                </FormGroup>
                <FormGroup check inline>
                  <Input
                    className="form-check-input"
                    type="radio"
                    checked={this.state.RoleID === 1}
                    onChange={() => this.setState({RoleID: 1})}
                    id="user-role-2"/>
                  <Label
                    className="form-check-label"
                    check
                    htmlFor="user-role-2">
                    Admin
                  </Label>
                </FormGroup>
                <FormGroup check inline>
                  <Input
                    className="form-check-input"
                    type="radio"
                    checked={this.state.RoleID === 0}
                    onChange={() => this.setState({RoleID: 0})}
                    id="user-role-3"/>
                  <Label
                    className="form-check-label"
                    check
                    htmlFor="user-role-3">
                    Root
                  </Label>
                </FormGroup>
              </Col>
            </FormGroup>
          </CardBody>
          <CardFooter>
            <Button
              onClick={this.create}
              type="button"
              size="sm"
              color="primary">
              <i className="fa fa-dot-circle-o" /> Submit
            </Button>
          </CardFooter>
        </Form>
      </Card>
    );
  }
}

export default connect(
  null,
  {createUser}
)(Create);
