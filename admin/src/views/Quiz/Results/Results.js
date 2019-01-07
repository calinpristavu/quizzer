import React, {Component} from 'react'
import {
  Row,
  Col,
  Card,
  CardHeader,
} from 'reactstrap'
import SingleResult from "./SingleResult";
import Filters from "./Filters";
import List from "./List";
var nestedProp = require('nested-property');

class Results extends Component {
  state = {
    quizzes: [],
    filters: [], // [{properyPath: "Nested.Object.Property", values: [1,2,3,'whatever']}, ...]
    openQuiz: null
  };

  componentDidMount() {
    fetch("/quizzes")
      .then(r => r.json())
      .then(r => this.setState({quizzes: r}))
  }

  openQuiz = (id) => {
    this.setState({
      openQuiz: id
    })
  };

  getFilteredQuizzes = () => {
    return this.state.quizzes.filter(q => {
      return this.state.filters.reduce(
        (ok, f) => ok && f.values.includes(nestedProp.get(q, f.propertyPath)),
        true
      );
    });
  };

  addFilter = (propertyPath, val) => {
    this.setState((oldState) => {
      const filters = oldState.filters;
      let filter = filters.find(f => f.propertyPath === propertyPath);
      if (filter === undefined) {
        filter = {
          propertyPath: propertyPath
        }
      }

      filter.values = val;

      filters.push(filter);
      return {filters: filters}
    })
  };

  clearFilter = (propertyPath) => {
    this.setState((oldState) => {
      const filters = oldState.filters;

      return {
        filters: filters.filter(f => f.propertyPath !== propertyPath)
      }
    })
  };

  render() {
    return (
      <div className="animated fadeIn">
        <Row>
          <Col xl={6}>
            <Card>
              <CardHeader>
                <i className="fa fa-align-justify"/> Quiz Results <small className="text-muted">list</small>
                <Filters
                  addFilter={this.addFilter}
                  clearFilter={this.clearFilter}
                  items={this.state.quizzes}/>
              </CardHeader>

              <List
                openQuiz={this.openQuiz}
                items={this.getFilteredQuizzes()}/>
            </Card>
          </Col>
          {this.state.openQuiz &&
            <SingleResult
              quiz={this.state.quizzes.find(q => q.ID === this.state.openQuiz)} />
          }
        </Row>
      </div>
    )
  }
}

export default Results
