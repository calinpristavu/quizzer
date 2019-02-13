import React, {Component} from 'react';
import {Button, Card, CardBody, CardHeader} from "reactstrap";
import {connect} from "react-redux";
import {createUser, getCandidates, getUsers} from "../../redux/actions";
import {Set, Map} from "immutable";
import PropTypes from 'prop-types';
import {newCandidates} from "../../redux/selectors";

class Recruitee extends Component {
  static propTypes = {
    candidates: PropTypes.instanceOf(Set).isRequired,
    all: PropTypes.instanceOf(Map).isRequired,
    getUsers: PropTypes.func.isRequired,
    getCandidates: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.props.getUsers();
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
          })}/>
      </span>
    );
  };

  createAll = () => {
    this.props.candidates.forEach(c => this.props.createUser({
      Username: c.username,
      RoleID: 2,
    }))
  };

  renderCandidate = (c, k) => {
    return (
      <div key={k} className={c.User === undefined && 'text-success'}>
        {c.name} ({c.username}) {this.createUserFromCandidateButton(c)}
      </div>
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
          {this.props.candidates.size > 0 &&
            <Button
              color="success"
              onClick={this.createAll}
            >Create all</Button>
          }
          {this.props.candidates.map((c, k) => this.renderCandidate(c, k))}
        </CardBody>
      </Card>
    );
  }
}

export default connect(
  state => ({
    candidates: newCandidates(state),
    all: state.user.all
  }),
  {getCandidates, getUsers, createUser}
)(Recruitee);
