import {Col, FormGroup, Row} from "reactstrap";
import Select from "react-select";
import React, {Component} from "react";
import PropTypes from 'prop-types';
import {Map} from 'immutable';
import {connect} from "react-redux";
import UserFilter from "./Filters/UserFilter";
import QuizTemplateFilter from "./Filters/QuizTemplateFilter";
import QuizActiveFilter from "./Filters/QuizActiveFilter";
import QuizCorrectedFilter from "./Filters/QuizCorrectedFilter";

class Filters extends Component {
  static propTypes = {
    addFilter: PropTypes.func.isRequired,
    items: PropTypes.instanceOf(Map).isRequired,
  };

  addFilter = (options, filterName) => {
    if (null === options) {
      return this.props.addFilter(filterName, [])
    }
    this.props.addFilter(filterName, options.map(o => o.value))
  };

  render() {
    return (
      <Row>
        <Col xs="3">
          <UserFilter
            addFilter={this.addFilter}/>
        </Col>
        <Col xs="3">
          <QuizActiveFilter
            addFilter={this.addFilter}/>
        </Col>
        <Col xs="3">
          <QuizCorrectedFilter
            addFilter={this.addFilter}/>
        </Col>
        <Col xs="3">
          <QuizTemplateFilter
            addFilter={this.addFilter}/>
        </Col>
      </Row>
    )
  }
}

export default connect()(Filters);
