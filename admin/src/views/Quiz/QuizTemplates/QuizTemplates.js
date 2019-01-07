import React, {Component} from 'react'
import {
  Row,
  Col,
} from "reactstrap";
import List from "./List";
import Create from "./Create";
import Edit from "./Edit";

const views = {
  create: 1,
  edit: 2,
  view: 3
};

class QuizTemplates extends Component {
  state = {
    openedView: views.create,
    editItem: null,
    quizzes: []
  };

  appendQuiz = (q) => {
    this.setState((oldState) => {
      const qs = oldState.quizzes;
      qs.unshift(q);

      return {
        quizzes: qs
      }
    })
  };

  deleteQuiz = (qId) => {
    fetch("/quiz-templates/" + qId, {
      method: "DELETE"
    })
      .then(() => {
        this.setState((oldState) => {
          return {
            quizzes: oldState.quizzes.filter(q => q.ID !== qId)
          }
        })
      });
  };

  componentDidMount() {
    fetch("/quiz-templates")
      .then((response) => response.json())
      .then((response) => {
        this.setState({
          quizzes: response
        })
      })
  };
  render() {
    return (
      <div className="animated fadeIn">
        <Row>
          <Col xs="12" lg="6">
            <List
              openEdit={(q) => this.setState({openedView: views.edit, editItem: q})}
              openCreate={() => this.setState({openedView: views.create})}
              quizzes={this.state.quizzes}
              delete={this.deleteQuiz}
              />
          </Col>

          <Col xs="12" lg="6">
            {this.state.openedView === views.create ?
              <Create appendQuiz={this.appendQuiz}/> : null
            }
            {this.state.openedView === views.edit ?
              <Edit quiz={this.state.editItem}/> : null
            }
          </Col>
        </Row>
      </div>
    );
  }
}

export default QuizTemplates;
