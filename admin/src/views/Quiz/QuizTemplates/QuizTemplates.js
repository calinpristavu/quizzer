import React, {Component} from 'react'
import {
  Row,
  Col,
  CardHeader,
  CardBody,
  Table,
  CardFooter,
  Pagination,
  PaginationItem,
  PaginationLink,
  Card,
  Label,
  FormGroup,
  Input
} from "reactstrap";

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

  componentDidMount = () => {
    fetch("http://localhost:8001/api/quiz_templates.json")
      .catch()
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
            <QuizList
              openEdit={(q) => this.setState({openedView: views.edit, editItem: q})}
              openCreate={() => this.setState({openedView: views.create})}
              quizzes={this.state.quizzes}
              />
          </Col>

          <Col xs="12" lg="6">
            {this.state.openedView === views.create ?
              <CreateQuiz /> : null
            }
            {this.state.openedView === views.edit ?
              <EditQuiz quiz={this.state.editItem}/> : null
            }
          </Col>
        </Row>
      </div>
    );
  }
}

class QuizList extends Component {
  render() {
    return (
      <Card>
        <CardHeader>
          <i className="fa fa-align-justify" /> Quiz Templates
          <span className="float-right">
            <i
              onClick={this.props.openCreate}
              className="fa fa-plus-circle text-success"
              style={{cursor: "pointer"}}/>
          </span>
        </CardHeader>
        <CardBody>
          <Table responsive>
            <thead>
            <tr>
              <th>Name</th>
              <th>Questions</th>
              <th>?</th>
            </tr>
            </thead>
            <tbody>
            {this.props.quizzes.map((q, k) =>
              <tr key={k} onClick={() => this.props.openEdit(q)}>
                <td>{q.Name}</td>
                <td>Quesitons here ...</td>
                <td />
              </tr>
            )}
            </tbody>
          </Table>
        </CardBody>
        <CardFooter>
          {this.props.quizzes.length > this.perPage &&
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

class CreateQuiz extends Component {
  availableEvents = {
    added: 1,
    modified: 2,
    removed: 3
  };

  state = {
    step: 1,
    quiz: {
      Text: '',
      Questions: []
    },
    step2events: [] // we are experimenting with event sourcing here ... brace yourselves!
  };

  advanceToStep2 = (text) => {
    this.setState({
      step: 2,
      quiz: {
        Text: text,
        Questions: []
      }
    })
  };

  stop = () => {
    //save quiz here.
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
            advance={() => this.setState({step: 2})}/>
        }
        {this.state.step === 2 &&
          <CreateStep2
            questions={[]}
            back={() => this.setState({step: 1})}
            stop={this.stop}/>
        }
      </Card>
    );
  }
}

class CreateStep1 extends Component {
  state = {
    Name: ''
  };

  render() {
    return (
      <div>
        <CardBody>
          <FormGroup row>
            <Col md="12">
              <Row>
                <Col xs="12">
                  <FormGroup>
                    <Label htmlFor="question-text">Name</Label>
                    <Input
                      type="text"
                      value={this.state.Name}
                      onChange={(e) => this.setState({Name: e.target.value})}
                      placeholder="Type in the quiz name"
                      required />
                  </FormGroup>
                </Col>
              </Row>
            </Col>
          </FormGroup>
        </CardBody>
        <CardFooter>
          <button onClick={() => this.props.advance(this.state)}>Next ></button>
        </CardFooter>
      </div>
    );
  }
}

class CreateStep2 extends Component {

  render() {
    return (
      <div>
        <CardBody>
          <Table responsive>
            <thead>
            <tr>
              <th>#</th>
              <th>Text</th>
              <th>Type</th>
              <th>?</th>
            </tr>
            </thead>
            <tbody>
            {this.props.questions.map((q, k) =>
              <tr key={k}>
                <td>{q.ID}</td>
                <td>{q.Text}</td>
                <td>{q.Type}</td>
                <td />
              </tr>
            )}
            <tr>
              <td colSpan={3}>
                <select>
                  <option value="1">Question 1 (not from the db)</option>
                  <option value="2">Question 2 (not from the db)</option>
                </select>
              </td>
              <td>+</td>
            </tr>
            </tbody>
          </Table>
        </CardBody>
        <CardFooter>
          <button onClick={() => this.props.advance(this.state)}>Next ></button>
        </CardFooter>
      </div>
    );
  }
}

class EditQuiz extends Component {
  render() {
    return (
      <Card>
        <CardHeader>
          <i className="fa fa-edit text-warning" />
          <strong>Editing quiz {this.props.quiz.ID}</strong>
          <small> Form</small>
        </CardHeader>
        <CardBody>
        </CardBody>
      </Card>
    );
  }
}

export default QuizTemplates;
