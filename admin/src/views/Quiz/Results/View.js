import {Button, Card, CardBody, CardFooter, CardHeader} from "reactstrap";
import React, {Component} from "react";
import PropTypes from 'prop-types';
import {connect} from "react-redux";
import {openQuizView, saveScores} from "../../../redux/actions";
import TextQuestion from "./TextQuestion";
import CheckboxQuestion from "./CheckboxQuestion";
import FlowDiagramQuestion from "./FlowDiagramQuestion";
import RadioQuestion from "./RadioQuestion";
import {viewedQuizResult} from "../../../redux/selectors";

class View extends Component {
  static propTypes = {
    quiz: PropTypes.object
  };

  renderQuestion = q => {
    switch (q.Type) {
      case 1:
        return <CheckboxQuestion question={q}/>;
      case 2:
        return <TextQuestion question={q}/>;
      case 3:
        return <FlowDiagramQuestion question={q}/>;
      case 4:
        return <RadioQuestion question={q}/>;
      default:
        console.log('Unknown Question type');

        return null;
    }
  };

  saveScores = () => {
    this.props.saveScores(this.props.quiz)
  };

  render() {
    if (null === this.props.quiz) {
      return null;
    }

    return (
      <Card key={this.props.quiz.ID}>
        <CardHeader>
          <span className="float-right">
            <i
              onClick={() => this.props.openQuizView(null)}
              className="fa fa-close"
              style={{cursor: "pointer"}}/>
          </span>
          <i className="fa fa-eye"/> Quiz "{this.props.quiz.Name}" for user {this.props.quiz.User.Username}
          <div>
            <small>DO NOT FORGET TO SAVE SCORES AFTER EVALUATING THE QUIZ!</small>
          </div>
        </CardHeader>
        <CardBody>
          {this.props.quiz.Questions.map((q, k) => (
            <div key={k}>
              {this.renderQuestion(q, k)}
              <hr/>
            </div>
          ))}
        </CardBody>
        <CardFooter>
            <Button
              className="btn-block"
              onClick={this.saveScores}
              type="button"
              size="sm"
              color="primary">
              <h3>
                <i className="fa fa-dot-circle-o" /> Save scores
              </h3>
            </Button>
        </CardFooter>
      </Card>
    )
  }
}

export default connect(
  state => ({
    quiz: viewedQuizResult(state)
  }),
  {openQuizView, saveScores}
)(View);
