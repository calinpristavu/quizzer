import {Card, CardHeader} from "reactstrap";
import React, {Component} from "react";
import Step1 from "./Step1";
import Step2 from "./Step2";
import {connect} from "react-redux";
import {updateQuizTemplate} from "../../../redux/actions";

class Edit extends Component {
  defaultState = {
    step: 1,
    quiz: null
  };

  state = this.defaultState;

  advanceToStep2 = (state) => {
    this.setState(oldState => ({
      step: 2,
      quiz: {
        ...oldState.quiz,
        Name: state.Name,
        Duration: state.Duration,
      }
    }))
  };

  stop = (quizQuestions) => {
    const quiz = this.state.quiz;
    quiz.QuizQuestions = quizQuestions;

    this.props.updateQuizTemplate(quiz)
      .then(() => this.setState(this.defaultState))
  };

  componentDidMount() {
    this.setState({quiz: this.props.quiz});
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (nextProps.quiz !== this.state.quiz) {
      this.setState({quiz: nextProps.quiz});
    }
  }

  render() {
    if (this.state.quiz === null) {
      return null;
    }

    return (
      <Card key={this.state.quiz.ID}>
        <CardHeader>
          <i className="fa fa-edit text-warning" />
          <strong>Editing quiz {this.state.quiz.ID}</strong>
          <small> Form</small>
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
  {updateQuizTemplate}
)(Edit);
