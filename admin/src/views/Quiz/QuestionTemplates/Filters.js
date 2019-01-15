import {Col, FormGroup, Row} from "reactstrap";
import Select from "react-select";
import React, {Component} from "react";
import PropTypes from 'prop-types';
import {questionTypes} from "./QuestionTemplates";
var nestedProp = require('nested-property');

class Filters extends Component {
  static propTypes = {
    addFilter: PropTypes.func.isRequired,
    clearFilter: PropTypes.func.isRequired,
    items: PropTypes.arrayOf(PropTypes.object).isRequired,
  };

  static buildTypeOptions = (quizzes) => {
    return quizzes.reduce((unique, q) => {
      if (unique.find(u => u.value === q.Type) === undefined) {
        unique.push({
          value: q.Type,
          label: questionTypes[q.Type]
        })
      }

      return unique
    }, []);
  };

  addFilter = (options, filterName) => {
    if (options.length === 0) {
      return this.props.clearFilter(filterName)
    }
    this.props.addFilter(filterName, options.map(o => o.value))
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
              placeholder="Filter by type"
              onChange={(opt) => this.addFilter(opt, 'Type')}
              options={Filters.buildTypeOptions(this.props.items)}/>
          </FormGroup>
        </Col>
      </Row>
    )
  }
}

export default Filters;
