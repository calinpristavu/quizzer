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
import Select from "react-select";
import PropTypes from 'prop-types';

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
    fetch("http://localhost:8001/new-api/quiz-templates/" + qId, {
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

  componentDidMount = () => {
    fetch("http://localhost:8001/new-api/quiz-templates")
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
              delete={this.deleteQuiz}
              />
          </Col>

          <Col xs="12" lg="6">
            {this.state.openedView === views.create ?
              <CreateQuiz appendQuiz={this.appendQuiz}/> : null
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
  perPage = 5;

  state = {
    currentPage: 0,
    noPages: 1,
    visibleItems: [],
    allItems: []
  };

  static propTypes = {
    openEdit: PropTypes.func,
    openCreate: PropTypes.func,
    delete: PropTypes.func,
    quizzes: PropTypes.arrayOf(PropTypes.object),
  };

  componentWillReceiveProps(nextProps, nextContext) {
    this.setState({
      noPages: Math.ceil(nextProps.quizzes.length / this.perPage),
      allItems: nextProps.quizzes
    });

    this.toPage(this.state.currentPage);
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
              <th>#noQuestions</th>
              <th>?</th>
            </tr>
            </thead>
            <tbody>
            {this.state.visibleItems.map((q, k) =>
              <tr key={k} onClick={() => this.props.openEdit(q)}>
                <td>{q.Name}</td>
                <td>{q.Questions !== null ? q.Questions.length : 0}</td>
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

class CreateQuiz extends Component {
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

    fetch("http://localhost:8001/new-api/quiz-templates", {
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

class CreateStep1 extends Component {
  state = {
    Name: ''
  };

  render() {
    return (
      <div>
        <CardBody>
          <FormGroup row>
            <div md="12">
              <Row>
                <Col xs="12">
                  <FormGroup>
                    <Label>Name</Label>
                    <Input
                      type="text"
                      value={this.state.Name}
                      onChange={(e) => this.setState({Name: e.target.value})}
                      placeholder="Type in the quiz name"
                      required />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col xs="12">
                  <Label>Quiz Presets (WIP)</Label>
                  <div>
                    <FormGroup check inline>
                      <Input className="form-check-input" type="radio" id="quiz-type-1" name="inline-radios" value="option1" />
                      <Label className="form-check-label" check htmlFor="quiz-type-1">One</Label>
                    </FormGroup>
                    <FormGroup check inline>
                      <Input className="form-check-input" type="radio" id="quiz-type-2" name="inline-radios" value="option2" />
                      <Label className="form-check-label" check htmlFor="quiz-type-2">Two</Label>
                    </FormGroup>
                    <FormGroup check inline>
                      <Input className="form-check-input" type="radio" id="quiz-type-3" name="inline-radios" value="option3" />
                      <Label className="form-check-label" check htmlFor="quiz-type-3">Three</Label>
                    </FormGroup>
                  </div>
                </Col>
              </Row>
            </div>
          </FormGroup>
        </CardBody>
        <CardFooter>
          <button onClick={() => this.props.advance(this.state.Name)}>Next ></button>
        </CardFooter>
      </div>
    );
  }
}

class CreateStep2 extends Component {
  state = {
    options: [],
    selected: []
  };

  componentDidMount = () => {
    fetch("http://localhost:8001/new-api/question-templates")
      .then((response) => response.json())
      .then((response) => {
        this.setState({
          options: response.map((q) => ({
            value: q.ID,
            label: q.Text
          }))
        })
      })
  };

  setSelected = (opt) => {
    this.setState({
      selected: opt.map((e) => e.value)
    })
  };

  render() {
    return (
      <div>
        <CardBody>
          <Select
            isMulti
            onChange={this.setSelected}
            options={this.state.options}/>
        </CardBody>
        <CardFooter>
          <button onClick={() => this.props.advance(this.state.selected)}>Save</button>
        </CardFooter>
      </div>
    );
  }
}

class EditQuiz extends Component {

  static propTypes = {
    quiz: PropTypes.object
  };

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
