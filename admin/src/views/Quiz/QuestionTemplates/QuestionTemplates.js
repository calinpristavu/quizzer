import React, {Component} from 'react';
import {
  Row,
  Col,
} from 'reactstrap';
import QuestionsList from "./List";
import CreateQuestion from "./Create";
import EditQuestion from "./Edit";

const views = {
  create: 1,
  edit: 2,
  view: 3
};

class QuestionTemplates extends Component{
  state = {
    openedView: views.create,
    editItem: {},
    questions: [
      {
        ID: 1,
        Text: "Question 1",
        Type: 1,
        ChoiceAnswerTemplates: ["Checkbox 1"]
      }
    ]
  };

  componentDidMount() {
    fetch("/question-templates")
      .then((response) => response.json())
      .then((response) => {
        this.setState({
          questions: response
        })
      })
  };

  appendQuestion = (question) => {
    this.setState((oldState) => {
      const newQuestions = oldState.questions;
      newQuestions.unshift(question);

      return {questions: newQuestions}
    })
  };

  deleteQuestion = (qId) => {
    fetch("/question-templates/" + qId, {
      method: "DELETE"
    })
      .then(() => {
        this.setState((oldState) => {
          return {
            questions: oldState.questions.filter(q => q.ID !== qId)
          }
        })
      });
  };

  render() {
    return (
      <div className="animated fadeIn">
        <Row>
          <Col xs="12" lg="6">
            <QuestionsList
              questions={this.state.questions}
              openCreateView={() => this.setState({openedView: views.create})}
              openEditView={(item) => this.setState({
                openedView: views.edit,
                editItem: item
              })}
              delete={this.deleteQuestion}/>
          </Col>

          <Col xs="12" lg="6">
            {this.state.openedView === views.create ?
              <CreateQuestion appendQuestion={this.appendQuestion}/> : null
            }
            {this.state.openedView === views.edit ?
              <EditQuestion question={this.state.editItem}/> : null
            }
          </Col>
        </Row>
      </div>
    );
  }
}

export default QuestionTemplates;
