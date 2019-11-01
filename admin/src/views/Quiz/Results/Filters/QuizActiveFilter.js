import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Select from "react-select";
import {FormGroup} from "reactstrap";
import {connect} from "react-redux";
import {getUsers} from "../../../../redux/actions";
import {usersAsSelect2Options} from "../../../../redux/selectors";

class QuizActiveFilter extends Component {
  static propTypes = {
    addFilter: PropTypes.func.isRequired,
  };

  render() {
    return (
      <FormGroup>
        <Select
          isMulti
          placeholder="Is active"
          onChange={(opt) => this.props.addFilter(opt, 'Active')}
          options={[
            {value: 1, label: "In Progress"},
            {value: 0, label: "Finished"},
          ]}/>
      </FormGroup>
    );
  }
}

export default QuizActiveFilter;
