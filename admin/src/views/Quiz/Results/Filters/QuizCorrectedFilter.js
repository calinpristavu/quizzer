import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Select from "react-select";
import {FormGroup} from "reactstrap";
import {connect} from "react-redux";
import {getUsers} from "../../../../redux/actions";
import {usersAsSelect2Options} from "../../../../redux/selectors";

class QuizCorrectedFilter extends Component {
  static propTypes = {
    addFilter: PropTypes.func.isRequired,
  };

  render() {
    return (
      <FormGroup>
        <Select
          isMulti
          placeholder="Is corrected"
          onChange={(opt) => this.props.addFilter(opt, 'Corrected')}
          options={[
            {value: true, label: "Corrected"},
            {value: false, label: "Not corrected"},
          ]}/>
      </FormGroup>
    );
  }
}

export default QuizCorrectedFilter;
