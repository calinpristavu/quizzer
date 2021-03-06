import {Button, Card, CardBody, CardFooter, CardHeader} from "reactstrap";
import React, {Component} from "react";
import PropTypes from 'prop-types';
import {connect} from "react-redux";
import {getQuizzes, openQuizView, saveScores, startCorrecting} from "store/actions";
import CheckboxQuestion from "views/Quiz/Results/CheckboxQuestion";
import CodeQuestion from "views/Quiz/Results/CodeQuestion";
import FlowDiagramQuestion from "views/Quiz/Results/FlowDiagramQuestion";
import RadioQuestion from "views/Quiz/Results/RadioQuestion";
import Quiz from "entities/Quiz";
import User from "entities/User";

class View extends Component {
  static propTypes = {
    quiz: PropTypes.instanceOf(Quiz),
    user: PropTypes.instanceOf(User),
  };

  renderQuestion = q => {
    const disabled = this.props.quiz.CorrectingByID !== this.props.user.ID;

    switch (q.Type) {
      case 1:
        return <CheckboxQuestion question={q} disabled={disabled}/>;
      case 2:
        return <CodeQuestion question={q} disabled={disabled}/>;
      case 3:
        return <FlowDiagramQuestion question={q} disabled={disabled}/>;
      case 4:
        return <RadioQuestion question={q} disabled={disabled}/>;
      default:
        console.log('Unknown Question type');

        return null;
    }
  };

  saveScores = () => {
    this.props.saveScores(this.props.quiz)
      .then(() => {
        this.props.getQuizzes();
      })
  };

  renderStartCorrecting = () => {
    if (this.props.quiz.CorrectingByID !== 0) {
      const message = this.props.quiz.CorrectingByID === this.props.user.ID
        ? 'Don\'t forget to press "Save scores" when finished'
        : 'Someone else is already correcting this quiz';

      return (
        <div>
          <h3 className="text-center text-warning">{message}</h3>
          <br/>
        </div>
      )
    }

    const buttonText = this.props.quiz.Corrected
      ? 'Already corrected. Improve?'
      : 'Start correcting';

    return (
      <div>
        <Button
          className="btn-block"
          onClick={() => this.props.startCorrecting(this.props.quiz.ID, this.props.user.ID)}
          type="button"
          size="sm"
          color="primary">
          <h3>
            <i className="fa fa-dot-circle-o" /> {buttonText}
          </h3>
        </Button>
        <br/>
      </div>
    )
  };

  renderSaveScores = () => {
    if (this.props.quiz.CorrectingByID !== this.props.user.ID) {
      return null;
    }

    return (
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
    )
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
          {this.renderStartCorrecting()}

          {this.props.quiz.Questions.map((q, k) => (
            <div key={k}>
              {this.renderQuestion(q, k)}
              <hr/>
            </div>
          ))}
        </CardBody>
        <CardFooter>
          {this.renderSaveScores()}
        </CardFooter>
      </Card>
    )
  }
}

export default connect(
  state => ({
    quiz: state.quiz.viewedItem,
    user: state.user.loggedInUser
  }),
  {openQuizView, saveScores, startCorrecting, getQuizzes}
)(View);
