import {Col, FormGroup, Row} from "reactstrap";
import Select from "react-select";
import React, {Component} from "react";
import PropTypes from 'prop-types';
import {Map} from 'immutable';
import {connect} from "react-redux";
import {getQuestionTags, getQuizTemplates} from "redux/actions";
import {questionTypes} from "views/Quiz/QuestionTemplates/QuestionTemplates";

class Filters extends Component {
  static propTypes = {
    addFilter: PropTypes.func.isRequired,
    clearFilter: PropTypes.func.isRequired,
    items: PropTypes.instanceOf(Map),
  };

  componentDidMount() {
    this.props.getQuestionTags();
    this.props.getQuizTemplates();
  }

  static buildTypeOptions = (questions) => {
    return questions.reduce((unique, q) => {
      if (unique.find(u => u.value === q.Type) === undefined) {
        unique.push({
          value: q.Type,
          label: questionTypes[q.Type]
        })
      }

      return unique
    }, []);
  };

  buildTagOptions = () => {
    const opts = [];

    this.props.tags.forEach(t => {
      opts.push({
        value: t.ID,
        label: t.Text
      })
    });

    return opts;
  };

  buildQuizTemplateOptions = () => {
    const opts = [];

    this.props.quizTemplates.forEach(t => {
      opts.push({
        value: t.ID,
        label: t.Name
      })
    });

    return opts;
  };

  addFilter = (options, filterName) => {
    if (null === options || options.length === 0) {
      return this.props.clearFilter(filterName)
    }
    this.props.addFilter(filterName, options.map(o => o.value))
  };

  render() {
    return (
      <Row>
        <Col xs="4">
          <FormGroup>
            <Select
              isMulti
              placeholder="Filter by type"
              onChange={(opt) => this.addFilter(opt, 'Type')}
              options={Filters.buildTypeOptions(this.props.items)}/>
          </FormGroup>
        </Col>
        <Col xs="4">
          <FormGroup>
            <Select
              isMulti
              placeholder="Filter by tags"
              onChange={(opt) => this.addFilter(opt, 'Tags.ID')}
              options={this.buildTagOptions()}/>
          </FormGroup>
        </Col>
        <Col xs="4">
          <FormGroup>
            <Select
              isMulti
              placeholder="Filter by Quiz Template"
              onChange={(opt) => this.addFilter(opt, 'QuizTemplate.ID')}
              options={this.buildQuizTemplateOptions()}/>
          </FormGroup>
        </Col>
      </Row>
    )
  }
}

export default connect(
  state => ({
    tags: state.tags.list,
    quizTemplates: state.quizTemplate.list,
  }),
  {getQuestionTags, getQuizTemplates}
)(Filters);
