import React, {Component} from 'react';
import {
  Row,
  Col,
} from 'reactstrap';
import QuestionsList from "./List";
import CreateQuestion from "./Create";
import EditQuestion from "./Edit";
import View from "./View";

export const questionTypes = {
  1: "Multiple choice",
  2: "Code answer",
  3: "Flow Diagram",
  4: "Single choice",
};

class QuestionTemplates extends Component{
  render() {
    return (
      <div className="animated fadeIn">
        <Row>
          <Col xs="12" lg="6">
            <QuestionsList />
          </Col>

          <Col xs="12" lg="6">
            <CreateQuestion />
            <EditQuestion />
            <View/>
          </Col>
        </Row>
      </div>
    );
  }
}

export default QuestionTemplates;
