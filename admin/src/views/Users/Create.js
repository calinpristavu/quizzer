import React, {Component} from 'react';
import {Button, Card, CardBody, CardFooter, CardHeader, Col, Form, FormGroup, Input, Label} from "reactstrap";
import {connect} from "react-redux";
import {createUser, setUserCreate} from "../../redux/actions";
import {roles} from "./Users";

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
    if (!this.props.isOpen) {
      return null
    }

    return (
      <Card>
        <Form>
          <CardHeader>
            <span className="float-right">
              <i
                onClick={() => this.props.setUserCreate(false)}
                className="fa fa-close"
                style={{cursor: "pointer"}}/>
            </span>
            <i className="fa fa-plus-circle text-success" />
            <strong>Create User</strong>
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
                    {roles[2]}
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
                    {roles[1]}
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
                    {roles[0]}
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
  state => ({
    isOpen: state.user.createUser
  }),
  {createUser, setUserCreate}
)(Create);
