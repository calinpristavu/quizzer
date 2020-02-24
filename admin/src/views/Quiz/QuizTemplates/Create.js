import {Card, CardHeader} from "reactstrap";
import React, {Component} from "react";
import {connect} from "react-redux";
import {createQuizTemplate, setQuizTemplateCreate} from "store/actions";
import Step1 from "views/Quiz/QuizTemplates/Step1";
import Step2 from "views/Quiz/QuizTemplates/Step2";

class Create extends Component {
  defaultState = {
    step: 1,
    quiz: {
      Enabled: true,
      Name: '',
      Duration: '',
      QuizQuestions: [],
    }
  };

  state = this.defaultState;

  advanceToStep2 = (state) => {
    this.setState({
      step: 2,
      quiz: {
        Enabled: state.Enabled,
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
    if (!this.props.isOpen) {
      return null;
    }

    return (
      <Card>
        <CardHeader>
          <span className="float-right">
            <i
              onClick={() => this.props.setQuizTemplateCreate(null)}
              className="fa fa-minus-circle"
              style={{cursor: "pointer"}}/>
          </span>
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
  state => ({
    isOpen: state.quizTemplate.createItem !== null
  }),
  {createQuizTemplate, setQuizTemplateCreate}
)(Create);
