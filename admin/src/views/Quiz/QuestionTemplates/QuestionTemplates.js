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
import {
  ChoiceAnswerTemplates,
  FlowDiagramAnswer
} from "./AnswerTemplates";

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
    fetch("http://localhost:8001/new-api/question-templates")
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
    fetch("http://localhost:8001/new-api/question-templates/" + qId, {
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
  perPage = 5;

  state = {
    currentPage: 0,
    noPages: 1,
    visibleItems: [],
    allItems: []
  };

  componentWillReceiveProps(nextProps, nextContext) {
    this.setState({
      noPages: Math.ceil(nextProps.questions.length / this.perPage),
      allItems: nextProps.questions
    });

    this.toPage(this.state.currentPage)
  }

  toPage = (pageNo) => {
    this.setState((oldState) => {
      const firstPosition = this.perPage * pageNo;

      return {
        currentPage: pageNo,
        visibleItems: oldState.allItems.slice(
          firstPosition,
          firstPosition + this.perPage
        )
      }
    })
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
              <th>?</th>
            </tr>
            </thead>
            <tbody>
            {this.state.visibleItems.map((q, k) =>
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
          {this.state.noPages > 1 &&
            <Pagination>
              {this.state.currentPage !== 0 ? (
                <PaginationItem
                  onClick={() => this.toPage(this.state.currentPage - 1)}>
                  <PaginationLink previous tag="button">Prev</PaginationLink>
                </PaginationItem>
              ): null}

              {[...Array(this.state.noPages).keys()].map((i) => (
                <PaginationItem
                  onClick={() => this.toPage(i)}
                  key={i}
                  active={i === this.state.currentPage}>
                  <PaginationLink tag="button">{i + 1}</PaginationLink>
                </PaginationItem>
              ))}

              {this.state.currentPage !== this.state.noPages - 1 ? (
                <PaginationItem
                  onClick={() => this.toPage(this.state.currentPage + 1)}>
                  <PaginationLink next tag="button">Next</PaginationLink>
                </PaginationItem>
              ): null}
            </Pagination>
          }
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

  create = () => {
    // TODO: extract backend domain name to global var.
    fetch("http://localhost:8001/new-api/question-templates", {
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