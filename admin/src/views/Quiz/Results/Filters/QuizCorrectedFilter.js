import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Select from "react-select";
import {FormGroup} from "reactstrap";

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
            {value: 1, label: "Corrected"},
            {value: 0, label: "Not corrected"},
          ]}/>
      </FormGroup>
    );
  }
}

export default QuizCorrectedFilter;
