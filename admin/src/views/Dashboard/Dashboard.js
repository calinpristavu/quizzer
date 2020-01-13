import React, { Component } from 'react';
import {
  Col,
  Row,
} from 'reactstrap';
import OverallQuality from "views/Charts/OverallQuality";
import QuizCountCard from "views/Charts/QuizCountCard";
import QuestionCountCard from "views/Charts/QuestionCountCard";
import TotalCompletedCard from "views/Charts/TotalCompletedCard";
import TotalInProgressCard from "views/Charts/TotalInProgressCard";
import {connect} from "react-redux";

class Dashboard extends Component {
  render() {
    return (
      <div className="animated fadeIn">
        <Row>
          <Col xs="12" sm="6" lg="3">
            <QuizCountCard/>
          </Col>

          <Col xs="12" sm="6" lg="3">
            <QuestionCountCard/>
          </Col>

          <Col xs="12" sm="6" lg="3">
            <TotalCompletedCard/>
          </Col>

          <Col xs="12" sm="6" lg="3">
            <TotalInProgressCard/>
          </Col>
        </Row>
        <Row>
          <Col>
            <OverallQuality/>
          </Col>
        </Row>
      </div>
    );
  }
}

export default connect(
  state => ({
    isSilvia: state.user.loggedInUser.Username === 'silvia.ghimbas'
  })
)(Dashboard);
