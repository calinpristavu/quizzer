import {Col, FormGroup, Row} from "reactstrap";
import Select from "react-select";
import React, {Component} from "react";
import PropTypes from 'prop-types';
import {Map} from 'immutable';
import {getQuizTemplates} from "../../../redux/actions";
import {connect} from "react-redux";
var nestedProp = require('nested-property');

class Filters extends Component {
  static propTypes = {
    addFilter: PropTypes.func.isRequired,
    clearFilter: PropTypes.func.isRequired,
    items: PropTypes.instanceOf(Map).isRequired,
  };

  componentDidMount() {
    this.props.getQuizTemplates();
  }

  addFilter = (options, filterName) => {
    if (options.length === 0) {
      return this.props.clearFilter(filterName)
    }
    this.props.addFilter(filterName, options.map(o => o.value))
  };

  static buildUserOptions = (quizzes) => {
    return quizzes.reduce((unique, q) => {
      if (unique.find(u => u.value === q.User.ID) === undefined) {
        unique.push({
          value: q.User.ID,
          label: q.User.Username
        })
      }

      return unique
    }, []);
  };

  static buildStatusOptions = () => {
    return [
      {value: true, label: "In Progress"},
      {value: false, label: "Finished"},
    ];
  };

  buildQuizTemplateOptions = () => {
    const options = [];
    this.props.quizTemplates.forEach(qt => {
      options.push({
        label: qt.Name,
        value: qt.ID,
      })
    });

    console.log(options);

    return options;
  };

  static apply = (list, filters) => {
    return list.filter(q => {
      return filters.reduce(
        (ok, f) => ok && f.values.includes(nestedProp.get(q, f.propertyPath)),
        true
      );
    });
  };

  render() {
    return (
      <Row>
        <Col xs="4">
          <FormGroup>
            <Select
              isMulti
              placeholder="Filter by user"
              onChange={(opt) => this.addFilter(opt, 'User.ID')}
              options={Filters.buildUserOptions(this.props.items)}/>
          </FormGroup>
        </Col>
        <Col xs="4">
          <FormGroup>
            <Select
              isMulti
              placeholder="Filter by status"
              onChange={(opt) => this.addFilter(opt, 'Active')}
              options={Filters.buildStatusOptions(this.props.items)}/>
          </FormGroup>
        </Col>
        <Col xs="4">
          <FormGroup>
            <Select
              isMulti
              placeholder="Filter by quiz template"
              onChange={(opt) => this.addFilter(opt, 'QuizTemplateID')}
              options={this.buildQuizTemplateOptions()}/>
          </FormGroup>
        </Col>
      </Row>
    )
  }
}

export default connect(
  state => ({
    quizTemplates: state.quizTemplate.list
  }),
  {getQuizTemplates}
)(Filters);
