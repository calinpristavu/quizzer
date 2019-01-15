import {Card, CardBody, CardFooter, CardHeader, Table} from "reactstrap";
import React, {Component} from "react";
import Pager from "../../Base/Paginations/Pager";
import moment from 'moment';
import {connect} from "react-redux";
import {getQuizzes, openQuizView} from "../../../redux/actions";
import Filters from "./Filters";
import {Link} from "react-router-dom";

class List extends Component {
  state = {
    perPage: 5,
    currentPage: 0,
    visibleItems: [],
    filters: [], // [{properyPath: "Nested.Object.Property", values: [1,2,3,'whatever']}, ...]
  };

  componentDidMount() {
    this.props.getQuizzes();
  }

  getVisibleItems = () => {
    const firstPosition = this.state.perPage * this.state.currentPage;

    return Filters
      .apply(this.props.list, this.state.filters)
      .slice(
        firstPosition,
        firstPosition + this.state.perPage
      );
  };

  static computePercentCompleted(questions) {
    return questions.reduce(
      (carry, q) => carry + (q.IsAnswered ? 1 : 0),
      0
    ) * 100 / questions.length
  }

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

  renderQuizTemplateCell = (name) => {
    return name === 'Generated'
      ? name
      : <Link to="/quiz/quiz-templates">{name}</Link>
  };

  render() {
    return (
      <Card>
        <CardHeader>
          <i className="fa fa-align-justify"/> Quiz Results <small className="text-muted">list</small>
          <Filters
            addFilter={this.addFilter}
            clearFilter={this.clearFilter}
            items={this.props.list}/>
        </CardHeader>
        <CardBody>
          <Table>
            <thead>
            <tr>
              <th>#</th>
              <th>User</th>
              <th>Quiz Template</th>
              <th>% Completed</th>
              <th>Score</th>
              <th>Status</th>
              <th>Time spent</th>
              <th />
            </tr>
            </thead>
            <tbody>
            {this.getVisibleItems().map((q, k) =>
              <tr key={k}>
                <td>{q.ID}</td>
                <td>{q.User ? q.User.Username : '-'}</td>
                <td>{this.renderQuizTemplateCell(q.Name)}</td>
                <td>{List.computePercentCompleted(q.Questions).toFixed(2)} <small className="text-muted">%</small></td>
                <td>{List.countCorrect(q.Questions)} / {q.Questions.length}</td>
                <td>{q.Active ? 'In Progress' : 'Finished'}</td>
                <td>{q.Active
                  ? '-'
                  : <span>{List.computeTimeSpent(q.CreatedAt, q.UpdatedAt)}</span>
                }</td>
                <td>
                  <i className="fa fa-eye" onClick={() => this.props.openQuizView(q)}/>
                </td>
              </tr>
            )}
            </tbody>
          </Table>
        </CardBody>
        <CardFooter>
          <Pager
            noPages={Math.ceil(
              Filters.apply(this.props.list, this.state.filters).length / this.state.perPage
            )}
            currentPage={this.state.currentPage}
            perPage={this.state.perPage}
            toPage={(pageNo) => this.setState({currentPage: pageNo})}
            setPerPage={(v) => this.setState({perPage: v})}/>
        </CardFooter>
      </Card>
    )
  }
}

export default connect(
  state => ({
    list: state.quiz.list
  }),
  { getQuizzes, openQuizView}
)(List);
