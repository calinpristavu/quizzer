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
        AnswerTemplates: ["Checkbox 1"]
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
              <CreateQuestion/> : null
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
            </tr>
            </thead>
            <tbody>
            {this.props.questions.map((q, k) =>
              <tr key={k} onClick={() => {this.props.openEditView(q)}}>
                <td>{q.Text}</td>
                <td>{q.Type}</td>
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
  render() {
    return (

      <Card>
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
                <Input type="text" id="question-text" placeholder="Type in the question text" required />
              </FormGroup>
            </Col>
          </Row>
          <FormGroup row>
            <Col md="12">
              <Label>Type</Label>
            </Col>
            <Col md="12">
              <FormGroup check inline>
                <Input className="form-check-input" type="radio" id="question-type-1" name="type" value="1" />
                <Label className="form-check-label" check htmlFor="question-type-1">Checkboxes</Label>
              </FormGroup>
              <FormGroup check inline>
                <Input className="form-check-input" type="radio" id="question-type-2" name="type" value="2" />
                <Label className="form-check-label" check htmlFor="question-type-2">Free text</Label>
              </FormGroup>
              <FormGroup check inline>
                <Input className="form-check-input" type="radio" id="question-type-3" name="type" value="3" />
                <Label className="form-check-label" check htmlFor="question-type-3">Flow Diagram</Label>
              </FormGroup>
            </Col>
          </FormGroup>
        </CardBody>
        <CardFooter>
          <Button type="submit" size="sm" color="primary"><i className="fa fa-dot-circle-o" /> Submit</Button>
        </CardFooter>
      </Card>
    );
  }
}

class EditQuestion extends Component {
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
                  defaultValue={this.props.question.Text}/>
              </FormGroup>
            </Col>
          </Row>
          <FormGroup row>
            <Col md="12">
              <Label>Type</Label>
            </Col>
            <Col md="12">
              <FormGroup check inline>
                <Input className="form-check-input" defaultChecked={this.props.question.Type === 1} type="radio" id="question-type-1" name="type" value="1" />
                <Label className="form-check-label" check htmlFor="question-type-1">Checkboxes</Label>
              </FormGroup>
              <FormGroup check inline>
                <Input className="form-check-input" defaultChecked={this.props.question.Type === 2} type="radio" id="question-type-2" name="type" value="2" />
                <Label className="form-check-label" check htmlFor="question-type-2">Free text</Label>
              </FormGroup>
              <FormGroup check inline>
                <Input className="form-check-input" defaultChecked={this.props.question.Type === 3} type="radio" id="question-type-3" name="type" value="3" />
                <Label className="form-check-label" check htmlFor="question-type-3">Flow Diagram</Label>
              </FormGroup>
            </Col>
          </FormGroup>
        </CardBody>
      </Card>
    );
  }
}

export default QuestionTemplates
