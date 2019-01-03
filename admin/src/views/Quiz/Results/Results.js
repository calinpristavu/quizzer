import React, {Component} from 'react'
import {
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Table,
  Pagination,
  PaginationItem,
  PaginationLink,
  FormGroup,
} from 'reactstrap'
import Select from "react-select";
import moment from 'moment';
var nestedProp = require('nested-property');

class Results extends Component {
  state = {
    quizzes: [],
    filters: [], // [{properyPath: "Nested.Object.Property", values: [1,2,3,'whatever']}, ...]
    openQuiz: null
  };

  componentDidMount() {
    fetch("http://localhost:8001/new-api/quizzes")
      .then(r => r.json())
      .then(r => this.setState({quizzes: r}))
  }

  openQuiz = (id) => {
    this.setState({
      openQuiz: id
    })
  };

  getFilteredQuizzes = () => {
    return this.state.quizzes.filter(q => {
      return this.state.filters.reduce(
        (ok, f) => ok && f.values.includes(nestedProp.get(q, f.propertyPath)),
        true
      );
    });
  };

  addFilter = (propertyPath, val) => {
    this.setState((oldState) => {
      const filters = oldState.filters;
      let filter = filters.find(f => f.propertyPath === propertyPath);
      if (filter === undefined) {
        filter = {
          propertyPath: propertyPath
        }
      }

      filter.values = val;

      filters.push(filter);
      return {filters: filters}
    })
  };

  clearFilter = (propertyPath) => {
    this.setState((oldState) => {
      const filters = oldState.filters;

      return {
        filters: filters.filter(f => f.propertyPath !== propertyPath)
      }
    })
  };

  render() {
    return (
      <div className="animated fadeIn">
        <Row>
          <Col xl={6}>
            <Card>
              <CardHeader>
                <i className="fa fa-align-justify"/> Quiz Results <small className="text-muted">list</small>
                <ResultFilters
                  addFilter={this.addFilter}
                  clearFilter={this.clearFilter}
                  items={this.state.quizzes}/>
              </CardHeader>

              <ResultList
                openQuiz={this.openQuiz}
                items={this.getFilteredQuizzes()}/>
            </Card>
          </Col>
          {this.state.openQuiz &&
            <SingleResult
              quiz={this.state.quizzes.find(q => q.ID === this.state.openQuiz)} />
          }
        </Row>
      </div>
    )
  }
}

class SingleResult extends Component {

  renderQuestion = (q, k) => {
    switch (q.Type) {
      case 1:
        return this.renderChoiceQuestion(q, k);
      case 2:
        return this.renderTextQuestion(q, k);
      case 3:
        return this.renderFlowDiagramQuestion(q, k);
      default:
        console.log('Unknown diagram type');

        return null;
    }
  };

  renderFlowDiagramQuestion = (q, k) => {
    return (
      <div key={k}>
        <h3>{q.Text}</h3>
        <div dangerouslySetInnerHTML={{__html: q.FlowDiagramAnswer.SVG}}/>
      </div>
    )
  };

  renderTextQuestion = (q, k) => {
    return (
      <div key={k}>
        <h3>{q.Text}</h3>
      </div>
    )
  };

  renderChoiceQuestion = (q, k) => {
    return (
      <div key={k}>
        <h3>{q.Text}</h3>
        <ul>
          {q.ChoiceAnswers.map((a, i) => (
            <li key={i}>{a.Text}</li>
          ))}
        </ul>
      </div>
    )
  };

  render() {
    return (
      <Col xl={6}>
        <Card>
          <CardHeader>
            <i className="fa fa-eye"/> Quiz "{this.props.quiz.Name}" for user {this.props.quiz.User.Username}
          </CardHeader>
          <CardBody>
            {this.props.quiz.Questions.map((q, k) => (
              this.renderQuestion(q, k)
            ))}
          </CardBody>
        </Card>
      </Col>
    )
  }
}

class ResultFilters extends Component {

  static buildUserOptions = (quizzes) => {
    return quizzes.reduce((unique, q) => {
      if (unique.find(u => u.value === q.User.ID) === undefined) {
        unique.push({
          value: q.User.ID,
          label: q.User.Username
        })
      }

      return unique
    }, []);
  };

  addFilter = (options, filterName) => {
    if (options.length === 0) {
      return this.props.clearFilter(filterName)
    }
    this.props.addFilter(filterName, options.map(o => o.value))
  };

  render() {
    return (
      <div>
        <Col xs="4">
          <FormGroup>
            <Select
              isMulti
              placeholder="Filter by user"
              onChange={(opt) => this.addFilter(opt, 'User.ID')}
              options={ResultFilters.buildUserOptions(this.props.items)}/>
          </FormGroup>
        </Col>
      </div>
    )
  }
}

class ResultList extends Component {
  perPage = 5;

  state = {
    noPages: 0,
    currentPage: 0,
    allItems: [],
    visibleItems: []
  };

  componentWillReceiveProps(nextProps, nextContext) {
    this.setState({
      noPages: Math.ceil(nextProps.items.length / this.perPage),
      allItems: nextProps.items
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

  static computePercentCompleted(questions) {
    return questions.reduce(
      (carry, q) => carry + (q.IsAnswered ? 1 : 0), 
      0
    ) * 100 / questions.length
  }

  static countCorrect(questions) {
    return questions.reduce((carry, q) => {
      switch (q.Type) {
        case 1:
          // considered correct if all checked answers are correct and no correct answer is missed
          return carry + q.ChoiceAnswers.reduce((ok, a) => a.IsCorrect === a.IsSelected ? ok : 0, 1);
        case 2:
          return carry + q.TextAnswer.IsCorrect;
        case 3:
          return carry + q.FlowDiagramAnswer.IsCorrect;
        default:
          return carry;
      }
    }, 0)
  }

  static computeTimeSpent(start, end) {
    const mStart = moment(start);
    const mEnd = moment(end);

    return moment.duration(mEnd.diff(mStart)).humanize()
  }

  render() {
    return (
      <div>
         <CardBody>
           <Table>
             <thead>
                <tr>
                  <th>#</th>
                  <th>User</th>
                  <th>Quiz</th>
                  <th>% Completed</th>
                  <th>Score</th>
                  <th>Status</th>
                  <th>Time spent</th>
                  <th></th>
                </tr>
             </thead>
             <tbody>
             {this.state.visibleItems.map((q, k) =>
               <tr key={k}>
                 <td>{q.ID}</td>
                 <td>{q.User ? q.User.Username : '-'}</td>
                 <td>{q.Name}</td>
                 <td>{ResultList.computePercentCompleted(q.Questions)} <small className="text-muted">%</small></td>
                 <td>{ResultList.countCorrect(q.Questions)} / {q.Questions.length}</td>
                 <td>{q.Active ? 'In Progress' : 'Finished'}</td>
                 <td>{q.Active
                   ? '-'
                   : <span>{ResultList.computeTimeSpent(q.CreatedAt, q.UpdatedAt)}</span>
                 }</td>
                 <td>
                   <i className="fa fa-eye" onClick={() => this.props.openQuiz(q.ID)}/>
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
      </div>
    )
  }
}

export default Results
