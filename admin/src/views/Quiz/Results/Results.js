import React, {Component} from 'react'
import {
  Row,
  Col,
} from 'reactstrap';
import View from "./View";
import List from "./List";

class Results extends Component {
  render() {
    return (
      <div className="animated fadeIn">
        <Row>
          <Col xl={12}>
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
