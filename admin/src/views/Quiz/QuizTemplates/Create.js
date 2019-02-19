import {Card, CardHeader} from "reactstrap";
import React, {Component} from "react";
import Step1 from "./Step1";
import Step2 from "./Step2";
import {connect} from "react-redux";
import {createQuizTemplate} from "../../../redux/actions";

class Create extends Component {
  defaultState = {
    step: 1,
    quiz: {
      Name: '',
      Duration: '',
      QuizQuestions: []
    }
  };

  state = this.defaultState;

  advanceToStep2 = (state) => {
    this.setState({
      step: 2,
      quiz: {
        Name: state.Name,
        Duration: state.Duration,
        QuizQuestions: []
      }
    })
  };

  stop = (quizQuestions) => {
    const quiz = this.state.quiz;
    quiz.QuizQuestions = quizQuestions;

    this.props.createQuizTemplate(quiz)
      .then(() => this.setState(this.defaultState))
  };

  render() {
    return (
      <Card>
        <CardHeader>
          <i className="fa fa-plus-circle text-success" />
          <strong>Create quiz</strong>
          <small> Wizzard</small>
        </CardHeader>
        {this.state.step === 1 &&
        <Step1
          quiz={this.state.quiz}
          advance={this.advanceToStep2}/>
        }
        {this.state.step === 2 &&
        <Step2
          quiz={this.state.quiz}
          back={() => this.setState({step: 1})}
          advance={this.stop}/>
        }
      </Card>
    );
  }
}

export default connect(
  null,
  {createQuizTemplate}
)(Create);
