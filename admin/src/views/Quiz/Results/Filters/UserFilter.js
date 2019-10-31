import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Select from "react-select";
import {FormGroup} from "reactstrap";
import {connect} from "react-redux";
import {getUsers} from "../../../../redux/actions";
import {usersAsSelect2Options} from "../../../../redux/selectors";

class UserFilter extends Component {
  static propTypes = {
    addFilter: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.props.getUsers();
  }

  render() {
    return (
      <FormGroup>
        <Select
          isMulti
          placeholder="Filter by user"
          onChange={(opt) => this.props.addFilter(opt, 'uID')}
          options={this.props.options}/>
      </FormGroup>
    );
  }
}

export default connect(
  state => ({
    options: usersAsSelect2Options(state),
  }),
  {getUsers}
)(UserFilter);
