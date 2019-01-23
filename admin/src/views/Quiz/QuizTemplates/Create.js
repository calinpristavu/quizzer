import {Card, CardHeader} from "reactstrap";
import React, {Component} from "react";
import CreateStep1 from "./CreateStep1";
import CreateStep2 from "./CreateStep2";
import {connect} from "react-redux";
import {createQuizTemplate} from "../../../redux/actions";

class Create extends Component {
  defaultState = {
    step: 1,
    quiz: {
      Name: '',
      QuizQuestions: []
    }
  };

  state = this.defaultState;

  advanceToStep2 = (text) => {
    this.setState({
      step: 2,
      quiz: {
        Name: text,
        QuizQuestions: []
      }
    })
  };

  stop = (selects) => {
    const quiz = this.state.quiz;
    quiz.QuizQuestions = Object.entries(selects).map(select => {
      return {"QuestionID": parseInt(select[0]), Weight: select[1]}
    });

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
        <CreateStep1
          advance={this.advanceToStep2}/>
        }
        {this.state.step === 2 &&
        <CreateStep2
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
