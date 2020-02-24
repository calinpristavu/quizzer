import React, {Component} from 'react';
import Select from "react-select";
import {Button, Card, CardBody, CardHeader, Col, FormGroup, Row} from "reactstrap";
import {connect} from "react-redux";
import {
  createUser,
  getCandidates,
  getQuizTemplates,
  getUsers,
  updateUser
} from "store/actions";
import {newCandidates} from "store/selectors";
import {Set, Map} from "immutable";
import PropTypes from 'prop-types';

class Recruitee extends Component {
  static propTypes = {
    candidates: PropTypes.instanceOf(Set).isRequired,
    all: PropTypes.instanceOf(Map).isRequired,
    getUsers: PropTypes.func.isRequired,
    getCandidates: PropTypes.func.isRequired,
  };

  state = {
    ShouldStartID: null
  };

  componentDidMount() {
    this.props.getUsers();
    this.props.getQuizTemplates();
  }

  createUserFromCandidateButton = (c) => {
    if (c.User !== undefined) {
      return <small> (already has an account)</small>;
    }

    return (
      <span>
        -> {' '}
        <i
          className="fa fa-plus-circle"
          style={{cursor: "pointer"}}
          onClick={() => this.props.createUser({
            Username: c.username,
            RoleID: 2,
            ShouldStartID: this.state.ShouldStartID
          })}/>
      </span>
    );
  };

  createAll = () => {
    this.props.candidates.forEach(c => {
      if (c.User !== undefined) {
        this.props.updateUser(c.User.ID, {
          ShouldStartID: this.state.ShouldStartID,
          RecruiteeID: c.id
        });

        return;
      }

      this.props.createUser({
        Username: c.username,
        RoleID: 2,
        ShouldStartID: this.state.ShouldStartID,
        RecruiteeID: c.id
      })
    })
  };

  optionsFromQTs = () => {
    const opts = [];
    this.props.quizTemplates.forEach(qt => opts.push({
      label: qt.Name,
      value: qt.ID,
    }));

    return opts;
  };

  renderCandidate = (c) => {
    return (
      <div key={c.username} className={c.User === undefined ? 'text-success' : undefined}>
        {c.name} ({c.username}) {this.createUserFromCandidateButton(c)}
      </div>
    );
  };

  renderCandidateActions = () => {
    if (this.props.candidates.size <= 0) {
      return null;
    }

    return (
      <Row>
        <Col md={12}>
          <p>
            If you select a quiz from the list, all users (regardless if they are already created or not) in the list
            below will be assigned the selected quiz when you hit <span className="text-success">Create all</span>.
          </p>
        </Col>
        <Col xs="4">
          <FormGroup>
            <Select
              placeholder="Select a quiz..."
              onChange={(opt) => this.setState({ShouldStartID: opt.value})}
              options={this.optionsFromQTs()}/>
          </FormGroup>
        </Col>
        <Col xs="4">
          <FormGroup>
            <Button
              color="success"
              onClick={this.createAll}
            >Create all</Button>
          </FormGroup>
        </Col>
      </Row>
    );
  };

  render() {
    return (
      <Card>
        <CardHeader>
          Import candidates from {' '}
          <a href="https://app.recruitee.com" target="_blank" rel="noopener noreferrer">Recruitee</a> {' '}
          <span className="h3 text-success">
            <i
              className="fa fa-download"
              style={{cursor: "pointer"}}
              onClick={this.props.getCandidates}/>
          </span>
        </CardHeader>
        <CardBody>
          {this.renderCandidateActions()}
          {this.props.candidates.map(this.renderCandidate)}
        </CardBody>
      </Card>
    );
  }
}

export default connect(
  state => ({
    candidates: newCandidates(state),
    quizTemplates: state.quizTemplate.list,
    all: state.user.all
  }),
  {getCandidates, getUsers, createUser, updateUser, getQuizTemplates}
)(Recruitee);
