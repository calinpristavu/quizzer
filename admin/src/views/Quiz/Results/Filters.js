import {Col, FormGroup, Row} from "reactstrap";
import Select from "react-select";
import React, {Component} from "react";
import PropTypes from 'prop-types';
import {Map} from 'immutable';
var nestedProp = require('nested-property');

class Filters extends Component {
  static propTypes = {
    addFilter: PropTypes.func.isRequired,
    clearFilter: PropTypes.func.isRequired,
    items: PropTypes.instanceOf(Map).isRequired,
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
      </Row>
    )
  }
}

export default Filters;
