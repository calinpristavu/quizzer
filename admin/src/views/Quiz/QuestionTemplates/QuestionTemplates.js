import React, {Component} from 'react'
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
  Pagination,
  PaginationItem,
  PaginationLink
} from 'reactstrap'

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
        Text: "Quesiton 1",
        Type: 1,
        ChoiceAnswerTemplates: ["Checkbox 1"]
      }
    ]
  };

  componentDidMount = () => {
    fetch("http://localhost:8001/api/question_templates.json")
      .catch()
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
      newQuestions.push(question);

      return {questions: newQuestions}
    })
  };

  openCreateView = () => {
    this.setState({
      openedView: views.create
    })
  };

  openEditView = (item) => {
    this.setState({
      openedView: views.edit,
      editItem: item
    })
  };

  render() {
    return (
      <div className="animated fadeIn">
        <Row>
          <Col xs="12" lg="6">
            <QuestionsList
              questions={this.state.questions}
              openCreateView={this.openCreateView}
              openEditView={this.openEditView}/>
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

class QuestionsList extends Component {
  perPage = 10;

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
              <th>?</th>
            </tr>
            </thead>
            <tbody>
            {this.props.questions.map((q, k) =>
              <tr key={k} onClick={() => {this.props.openEditView(q)}}>
                <td>{q.Text}</td>
                <td>{q.Type}</td>
                <td>{q.ChoiceAnswerTemplates.map((a) => a.Text)}</td>
                <td />
              </tr>
            )}
            </tbody>
          </Table>
        </CardBody>
        <CardFooter>
          {this.props.questions.length > this.perPage &&
            <Pagination>
              <PaginationItem><PaginationLink previous tag="button">Prev</PaginationLink></PaginationItem>
              <PaginationItem active>
                <PaginationLink tag="button">1</PaginationLink>
              </PaginationItem>
              <PaginationItem><PaginationLink tag="button">2</PaginationLink></PaginationItem>
              <PaginationItem><PaginationLink tag="button">3</PaginationLink></PaginationItem>
              <PaginationItem><PaginationLink tag="button">4</PaginationLink></PaginationItem>
              <PaginationItem><PaginationLink next tag="button">Next</PaginationLink></PaginationItem>
            </Pagination>
          }
        </CardFooter>
      </Card>
    );
  }
}

class CreateQuestion extends Component {
  state = {
    Text: "Sample text...",
    Type: null,
    ChoiceAnswerTemplates: [],
    FlowDiagramAnswerTemplate: null
  };

  create = () => {
    // TODO: extract backend domain name to global var.
    fetch("http://localhost:8001/api/question_templates.json", {
      method: "POST",
      body: JSON.stringify(this.state)
    })
      .catch()
      .then(() => {
        this.props.appendQuestion(this.state)
      });
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

class ChoiceAnswerTemplates extends Component {
  state = {
    Text: '',
    IsCorrect: false
  };

  render() {
    return (
      <div>
        <Table responsive>
          <thead>
            <tr>
              <th>Text</th>
              <th>Is Correct?</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {this.props.answers.map((answer, k) =>
              <tr key={k}>
                <td>{answer.Text}</td>
                <td>{answer.IsCorrect ? 'true' : 'false'}</td>
                <td>
                  <i className="fa fa-minus-circle text-danger" onClick={() => this.props.removeChoice(k)}/>
                </td>
              </tr>
            )}
            <tr>
              <td>
                <FormGroup>
                  <Label htmlFor="question-text">
                    <Input
                      name="Text"
                      type="text"
                      id="question-text"
                      value={this.state.Text}
                      onChange={(e) => this.setState({Text: e.target.value})}
                      placeholder="Type in the question text"
                      required />
                  </Label>
                </FormGroup>
              </td>
              <td>
                <FormGroup check inline>
                  <Label className="form-check-label" check>
                    <Input
                      className="form-check-input"
                      type="checkbox"
                      onChange={(e) => this.setState({IsCorrect: e.target.checked})}
                      name="Type" />
                  </Label>
                </FormGroup>
              </td>
              <td>
                <i className="fa fa-plus-circle text-success" onClick={() => this.props.addChoice(this.state)} />
              </td>
            </tr>
          </tbody>
        </Table>
      </div>
    );
  }
}

class FlowDiagramAnswer extends Component {
  render() {
    return (
      <div>
        add diagram answer here
      </div>
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

export default QuestionTemplates
