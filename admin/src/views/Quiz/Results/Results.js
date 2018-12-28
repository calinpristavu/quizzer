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
  Label,
  Input
} from 'reactstrap'
import Select from "react-select";
var nestedProp = require('nested-property');

class Results extends Component {
  state = {
    quizzes: [],
    filters: [] // [{properyPath: "Nested.Object.Property", values: [1,2,3,'whatever']}, ...]
  };

  componentDidMount() {
    fetch("http://localhost:8001/new-api/quizzes")
      .then(r => r.json())
      .then(r => this.setState({quizzes: r}))
  }

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
                items={this.getFilteredQuizzes()}/>
            </Card>
          </Col>
        </Row>
      </div>
    )
  }
}

class ResultFilters extends Component {
  static uniqueUsers = (quizzes) => {
    return quizzes.reduce((unique, q) => {
      if (unique.find(u => u.ID === q.User.ID) === undefined) {
        unique.push(q.User)
      }

      return unique
    }, []);
  };

  userFilter = (options) => {
    const filterName = 'User.ID';

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
              onChange={this.userFilter}
              options={ResultFilters.uniqueUsers(this.props.items).map(u => ({
                value: u.ID,
                label: u.Username
              }))}/>
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
    return Date.diff(
      'n',
      new Date(start),
      new Date(end)
    )
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
                   : <span>
                     {ResultList.computeTimeSpent(q.CreatedAt, q.UpdatedAt)}
                     <small className="text-muted">
                       min
                     </small>
                   </span>
                 }</td>
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

// datepart: 'y', 'm', 'w', 'd', 'h', 'n', 's'
Date.diff = function(datepart, fromdate, todate) {
  datepart = datepart.toLowerCase();
  var diff = todate - fromdate;
  var divideBy = {
    w:604800000,
    d:86400000,
    h:3600000,
    n:60000,
    s:1000 };

  return Math.ceil( diff/divideBy[datepart]);
};

export default Results
