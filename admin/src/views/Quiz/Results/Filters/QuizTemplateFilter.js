import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Select from "react-select";
import {FormGroup} from "reactstrap";
import {connect} from "react-redux";
import {getQuizTemplates} from "redux/actions";
import {quizTemplatesAsSelect2Options} from "redux/selectors";

class QuizTemplateFilter extends Component {
  static propTypes = {
    addFilter: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.props.getQuizTemplates();
  }

  render() {
    return (
      <FormGroup>
        <Select
          isMulti
          placeholder="Filter by quiz"
          onChange={(opt) => this.props.addFilter(opt, 'QuizTemplateID')}
          options={this.props.options}/>
      </FormGroup>
    );
  }
}

export default connect(
  state => ({
    options: quizTemplatesAsSelect2Options(state),
  }),
  {getQuizTemplates}
)(QuizTemplateFilter);
