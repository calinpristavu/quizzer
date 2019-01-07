import PropTypes from "prop-types";
import {Card, CardHeader} from "reactstrap";
import React, {Component} from "react";
import CreateStep1 from "./CreateStep1";
import CreateStep2 from "./CreateStep2";

class Create extends Component {
  defaultState = {
    step: 1,
    quiz: {
      Name: '',
      Questions: []
    }
  };

  state = this.defaultState;

  static propTypes = {
    appendQuiz: PropTypes.func
  };

  advanceToStep2 = (text) => {
    this.setState({
      step: 2,
      quiz: {
        Name: text,
        Questions: []
      }
    })
  };

  stop = (qIds) => {
    const quiz = this.state.quiz;
    quiz.Questions = qIds.map(id => ({"ID": id}));

    fetch("/quiz-templates", {
      method: "POST",
      body: JSON.stringify(quiz)
    })
      .then((r) => {
        return r.json()
      })
      .then((q) => {
        this.setState(this.defaultState);
        this.props.appendQuiz(q);
      })
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

export default Create;
