import {Card, CardHeader} from "reactstrap";
import React, {Component} from "react";
import Step1 from "./Step1";
import Step2 from "./Step2";
import {connect} from "react-redux";
import {setQuizTemplateEdit, updateQuizTemplate} from "../../../redux/actions";
import Row from "reactstrap/es/Row";
import Col from "reactstrap/es/Col";

class Edit extends Component {
  state = {
    step: 1,
    quiz: null
  };

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
      .then(() => this.setState({step: 1}))
  };

  componentDidMount() {
    this.setState({quiz: this.props.quiz});
  }

  componentWillReceiveProps(nextProps) {
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
        <Col md={8}>
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
