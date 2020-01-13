import React, {Component} from 'react'
import {
  Row,
  Col,
} from 'reactstrap';
import List from "views/Quiz/Results/List";
import View from "views/Quiz/Results/View";

class Results extends Component {
  render() {
    return (
      <div className="animated fadeIn">
        <Row>
          <Col xl={12} className="d-print-none">
            <List />
          </Col>

          <Col xl={12}>
            <View />
          </Col>
        </Row>
      </div>
    )
  }
}

export default Results;
