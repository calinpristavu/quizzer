import {Card, CardBody, CardHeader, Col} from "reactstrap";
import React, {Component} from "react";
import PropTypes from 'prop-types';
import {connect} from "react-redux";
import {openQuizView} from "../../../redux/actions";

class View extends Component {
  static propTypes = {
    quiz: PropTypes.object
  };

  renderQuestion = (q, k) => {
    switch (q.Type) {
      case 1:
        return this.renderChoiceQuestion(q, k);
      case 2:
        return this.renderTextQuestion(q, k);
      case 3:
        return this.renderFlowDiagramQuestion(q, k);
      default:
        console.log('Unknown diagram type');

        return null;
    }
  };

  renderFlowDiagramQuestion = (q, k) => {
    return (
      <div key={k}>
        <h3>{q.Text}</h3>
        <div dangerouslySetInnerHTML={{__html: q.FlowDiagramAnswer.SVG}}/>
      </div>
    )
  };

  renderTextQuestion = (q, k) => {
    return (
      <div key={k}>
        <h3>{q.Text}</h3>
      </div>
    )
  };

  renderChoiceQuestion = (q, k) => {
    return (
      <div key={k}>
        <h3>{q.Text}</h3>
        <ul>
          {q.ChoiceAnswers.map((a, i) => (
            <li key={i}>{a.Text}</li>
          ))}
        </ul>
      </div>
    )
  };

  render() {
    if (null === this.props.quiz) {
      return null;
    }

    return (
      <Col xl={6}>
        <Card>
          <CardHeader>
            <i className="fa fa-eye"/> Quiz "{this.props.quiz.Name}" for user {this.props.quiz.User.Username}
          </CardHeader>
          <CardBody>
            {this.props.quiz.Questions.map((q, k) => (
              <div>
                {this.renderQuestion(q, k)}
                <hr/>
              </div>
            ))}
          </CardBody>
        </Card>
      </Col>
    )
  }
}

export default connect(
  state => ({
    quiz: state.quiz.viewedItem
  }),
  {openQuizView}
)(View);
