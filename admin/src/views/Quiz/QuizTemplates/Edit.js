import {Card, CardHeader} from "reactstrap";
import React, {Component} from "react";
import {connect} from "react-redux";
import {setQuizTemplateEdit, updateQuizTemplate} from "store/actions";
import Row from "reactstrap/es/Row";
import Col from "reactstrap/es/Col";
import Step1 from "views/Quiz/QuizTemplates/Step1";
import Step2 from "views/Quiz/QuizTemplates/Step2";

class Edit extends Component {
  state = {
    step: 1,
    quiz: this.props.quiz
  };

  advanceToStep2 = (state) => {
    this.setState(oldState => ({
      step: 2,
      quiz: oldState.quiz.merge({
        Enabled: state.Enabled,
        Name: state.Name,
        Duration: state.Duration,
      }),
    }))
  };

  stop = (quizQuestions) => {
    const quiz = this.state.quiz.merge({
      QuizQuestions: quizQuestions,
    });

    this.props.updateQuizTemplate(quiz)
      .then(() => this.setState({step: 1}))
  };

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.quiz !== this.state.quiz) {
      this.setState({quiz: nextProps.quiz});
    }
  }

  render() {
    if (!this.props.isOpen) {
      return null;
    }

    return (
      <Row>
        <Col>
          <Card key={this.state.quiz.ID}>
            <CardHeader>
              <span className="float-right">
                <i
                  onClick={() => this.props.setQuizTemplateEdit(null)}
                  className="fa fa-minus-circle"
                  style={{cursor: "pointer"}}/>
              </span>
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
        </Col>
      </Row>
    );
  }
}

export default connect(
  state => ({
    isOpen: state.quizTemplate.editItem !== null,
    quiz: state.quizTemplate.editItem,
  }),
  {updateQuizTemplate, setQuizTemplateEdit}
)(Edit);
