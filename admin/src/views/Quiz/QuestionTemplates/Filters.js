import {Col, FormGroup, Row} from "reactstrap";
import Select from "react-select";
import React, {Component} from "react";
import PropTypes from 'prop-types';
import {questionTypes} from "./QuestionTemplates";
import {Map} from 'immutable';
import {getQuestionTags} from "../../../redux/actions";
import {connect} from "react-redux";
const nestedProp = require('nested-property');

class Filters extends Component {
  static propTypes = {
    addFilter: PropTypes.func.isRequired,
    clearFilter: PropTypes.func.isRequired,
    items: PropTypes.instanceOf(Map),
  };

  componentDidMount() {
    this.props.getQuestionTags()
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

  addFilter = (options, filterName) => {
    if (options.length === 0) {
      return this.props.clearFilter(filterName)
    }
    this.props.addFilter(filterName, options.map(o => o.value))
  };

  static apply = (list, filters) => {
    return list.filter(q => {
      return filters.every(f => {
        const candidateField = nestedProp.get(q, f.propertyPath);
        // if is scalar
        if ((/boolean|number|string/).test(typeof candidateField)) {
          return f.values.includes(nestedProp.get(q, f.propertyPath))
        }

        if (Array.isArray(candidateField)) {
          // intersects the 2 arrays, returns true if common item found
          return candidateField.some(c => f.values.includes(c.ID))
          // return f.values.some(v => candidateField.some(c => c.ID === v.ID))
        }

        return false
      });
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
        <Col xs="4">
          <FormGroup>
            <Select
              isMulti
              placeholder="Filter by tags"
              onChange={(opt) => this.addFilter(opt, 'Tags')}
              options={this.buildTagOptions()}/>
          </FormGroup>
        </Col>
      </Row>
    )
  }
}

export default connect(
  state => ({
    tags: state.tags.list
  }),
  {getQuestionTags}
)(Filters);
