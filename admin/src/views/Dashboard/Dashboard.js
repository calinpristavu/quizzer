import React, { Component } from 'react';
import {
  Col,
  Row,
} from 'reactstrap';
import OverallQuality from "../Charts/OverallQuality";
import QuizCountCard from "../Charts/QuizCountCard";
import QuestionCountCard from "../Charts/QuestionCountCard";
import TotalCompletedCard from "../Charts/TotalCompletedCard";
import TotalInProgressCard from "../Charts/TotalInProgressCard";
import Silvia from "../Silvia";
import {connect} from "react-redux";

class Dashboard extends Component {
  renderSilvia = () => {
    if (!this.props.isSilvia) {
      return null;
    }

    return <Silvia/>;
  };
  render() {
    return (
      <div className="animated fadeIn">
        {this.renderSilvia()}
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
