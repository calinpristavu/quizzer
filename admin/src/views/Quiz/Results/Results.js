import React, {Component} from 'react'
import {
  Row,
  Col,
  Card,
  CardHeader,
} from 'reactstrap';
import View from "./View";
import Filters from "./Filters";
import List from "./List";
import {connect} from "react-redux";
import {getQuizzes} from "../../../redux/actions";

class Results extends Component {
  state = {
    filters: [], // [{properyPath: "Nested.Object.Property", values: [1,2,3,'whatever']}, ...]
  };

  componentDidMount() {
    this.props.getQuizzes();
  }

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
                  items={this.props.list}/>
              </CardHeader>

              <List
                quizzes={Filters.apply(this.props.list, this.state.filters)}/>
            </Card>
          </Col>
          <View />
        </Row>
      </div>
    )
  }
}

export default connect(
  state => ({
    list: state.quiz.list
  }),
  { getQuizzes }
)(Results);
