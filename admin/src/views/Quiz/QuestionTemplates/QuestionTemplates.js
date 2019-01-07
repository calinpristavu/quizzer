import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Table,
  FormGroup,
  Label,
  Input,
  Form,
  Button,
} from 'reactstrap'
import {
  ChoiceAnswerTemplates,
  FlowDiagramAnswer
} from "./AnswerTemplates";
import Pager from "../../Base/Paginations/Pager";

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

  componentDidMount = () => {
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

export class QuestionsList extends Component {
  state = {
    perPage: 5,
    currentPage: 0,
    visibleItems: []
  };

  static propTypes = {
    questions: PropTypes.arrayOf(PropTypes.object),
    openCreateView: PropTypes.func,
    openEditView: PropTypes.func,
    delete: PropTypes.func,
  };

  getVisibleItems = () => {
    const firstPosition = this.state.perPage * this.state.currentPage;

    return this.props.questions.slice(
      firstPosition,
      firstPosition + this.state.perPage
    );
  };

  render() {
    return (
      <Card>
        <CardHeader>
          <i className="fa fa-align-justify" /> Question Templates
          <span className="float-right">
            <i
              onClick={this.props.openCreateView}
              className="fa fa-plus-circle text-success"
              style={{cursor: "pointer"}}/>
          </span>
        </CardHeader>
        <CardBody>
          <Table responsive>
            <thead>
            <tr>
              <th>Text</th>
              <th>Type</th>
              <th>Answer Template</th>
              <th />
            </tr>
            </thead>
            <tbody>
            {this.getVisibleItems().map((q, k) =>
              <tr key={k} onClick={() => {this.props.openEditView(q)}}>
                <td>{q.Text}</td>
                <td>{q.Type}</td>
                <td>{q.ChoiceAnswerTemplates.map((a) => a.Text)}</td>
                <td>
                  <i onClick={() => this.props.delete(q.ID)} className="fa fa-minus-circle"/>
                </td>
              </tr>
            )}
            </tbody>
          </Table>
        </CardBody>
        <CardFooter>
          <Pager
            noPages={Math.ceil(this.props.questions.length / this.state.perPage)}
            currentPage={this.state.currentPage}
            perPage={this.state.perPage}
            toPage={(pageNo) => this.setState({currentPage: pageNo})}
            setPerPage={(v) => this.setState({perPage: v})}/>
        </CardFooter>
      </Card>
    );
  }
}

class CreateQuestion extends Component {
  state = {
    Text: '',
    Type: null,
    ChoiceAnswerTemplates: [],
    FlowDiagramAnswerTemplate: null
  };

  static propTypes = {
    appendQuestion: PropTypes.func,
  };

  create = () => {
    fetch("/question-templates", {
      method: "POST",
      body: JSON.stringify(this.state),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(() => {
        return this.props.appendQuestion(this.state);
      })
  };

  removeChoice = (choiceIndex) => {
    this.setState((oldState) => {
      const choices = oldState.ChoiceAnswerTemplates;
      delete choices[choiceIndex];

      return {ChoiceAnswerTemplates: choices}
    })
  };

  addChoice = (choice) => {
    this.setState((oldState) => {
      const choices = oldState.ChoiceAnswerTemplates;
      choices.push(choice);

      return {ChoiceAnswerTemplates: choices}
    })
  };

  render() {
    return (
      <Card>
        <Form name="create-question">
          <CardHeader>
            <i className="fa fa-plus-circle text-success" />
            <strong>Create Question</strong>
            <small> Form</small>
          </CardHeader>
          <CardBody>
            <Row>
              <Col xs="12">
                <FormGroup>
                  <Label htmlFor="question-text">Text</Label>
                  <Input
                    name="Text"
                    type="text"
                    id="question-text"
                    value={this.state.Text}
                    onChange={(e) => this.setState({Text: e.target.value})}
                    placeholder="Type in the question text"
                    required />
                </FormGroup>
              </Col>
            </Row>
            <FormGroup row>
              <Col md="12">
                <Label>Type</Label>
              </Col>
              <Col md="12">
                <FormGroup check inline>
                  <Input
                    className="form-check-input"
                    type="radio"
                    onChange={() => this.setState({Type: 1})}
                    id="question-type-1"
                    name="Type"/>
                  <Label className="form-check-label" check htmlFor="question-type-1">Checkboxes</Label>
                </FormGroup>
                <FormGroup check inline>
                  <Input
                    className="form-check-input"
                    type="radio"
                    onChange={() => this.setState({Type: 2})}
                    id="question-type-2"
                    name="Type" />
                  <Label className="form-check-label" check htmlFor="question-type-2">Free text</Label>
                </FormGroup>
                <FormGroup check inline>
                  <Input
                    className="form-check-input"
                    type="radio"
                    onChange={() => this.setState({Type: 3})}
                    id="question-type-3"
                    name="Type" />
                  <Label className="form-check-label" check htmlFor="question-type-3">Flow Diagram</Label>
                </FormGroup>
              </Col>
            </FormGroup>
            {this.state.Type === 1 &&
              <ChoiceAnswerTemplates
                removeChoice={this.removeChoice}
                addChoice={this.addChoice}
                answers={this.state.ChoiceAnswerTemplates}/>
            }
            {this.state.Type === 3 &&
              <FlowDiagramAnswer />
            }
          </CardBody>
          <CardFooter>
            <Button
              onClick={this.create}
              type="button"
              size="sm"
              color="primary">
              <i className="fa fa-dot-circle-o" /> Submit
            </Button>
          </CardFooter>
        </Form>
      </Card>
    );
  }
}

class EditQuestion extends Component {
  state = {
    Text: "Sample text...",
    Type: null,
    ChoiceAnswerTemplates: [],
    FlowDiagramAnswerTemplate: null
  };

  static propTypes = {
    question: PropTypes.arrayOf(PropTypes.object),
  };

  componentWillReceiveProps = (nextProps) => {
    this.setState(nextProps.question)
  };

  render() {
    return (
      <Card>
        <CardHeader>
          <i className="fa fa-edit text-warning" />
          <strong>Editing question {this.props.question.ID}</strong>
          <small> Form</small>
        </CardHeader>
        <CardBody>
          <Row>
            <Col xs="12">
              <FormGroup>
                <Label htmlFor="question-text">Text</Label>
                <Input
                  type="text"
                  id="question-text"
                  placeholder="Type in the question text"
                  required
                  onChange={(e) => this.setState({Text: e.target.value})}
                  value={this.state.Text}/>
              </FormGroup>
            </Col>
          </Row>
          <FormGroup row>
            <Col md="12">
              <Label>Type</Label>
            </Col>
            <Col md="12">
              <FormGroup check inline>
                <Input
                  className="form-check-input"
                  type="radio"
                  onChange={() => this.setState({Type: 1})}
                  id="question-type-1"
                  checked={this.state.Type === 1}
                  name="Type"/>
                <Label className="form-check-label" check htmlFor="question-type-1">Checkboxes</Label>
              </FormGroup>
              <FormGroup check inline>
                <Input
                  className="form-check-input"
                  type="radio"
                  onChange={() => this.setState({Type: 2})}
                  id="question-type-2"
                  checked={this.state.Type === 2}
                  name="Type" />
                <Label className="form-check-label" check htmlFor="question-type-2">Free text</Label>
              </FormGroup>
              <FormGroup check inline>
                <Input
                  className="form-check-input"
                  type="radio"
                  onChange={() => this.setState({Type: 3})}
                  id="question-type-3"
                  checked={this.state.Type === 3}
                  name="Type" />
                <Label className="form-check-label" check htmlFor="question-type-3">Flow Diagram</Label>
              </FormGroup>
            </Col>
          </FormGroup>
          {this.state.Type === 1 &&
            <ChoiceAnswerTemplates
              removeChoice={this.removeChoice}
              addChoice={this.addChoice}
              answers={this.state.ChoiceAnswerTemplates}/>
          }
          {this.state.Type === 3 &&
            <FlowDiagramAnswer />
          }
        </CardBody>
      </Card>
    );
  }
}

export default QuestionTemplates;
