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
    filters: [], // [{properyPath: "Nested.Object.Property", values: [1,2,3,'whatever']}, ...]
  };

  componentDidMount() {
    this.props.getQuizzes();
  }

  getVisibleItems = () => {
    const firstPosition = this.state.perPage * this.state.currentPage;

    return Filters
      .apply(this.props.list, this.state.filters)
      .slice(firstPosition, firstPosition + this.state.perPage)
      .valueSeq();
  };

  static computePercentCompleted(questions) {
    return (questions.reduce(
      (carry, q) => carry + (q.IsAnswered ? 1 : 0),
      0
    ) * 100 / questions.length) || 0
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
      return {
        filters: filters,
        currentPage: 0
      }
    })
  };

  clearFilter = (propertyPath) => {
    this.setState((oldState) => {
      const filters = oldState.filters;

      return {
        filters: filters.filter(f => f.propertyPath !== propertyPath),
        currentPage: 0
      }
    })
  };

  /**
   * Weighted arythmetic mean of question score with weight.
   */
  static computeScore(questions) {
    return (questions.reduce((carry, q) => carry + (q.Score * q.Weight), 0)
      /
      questions.reduce((carry, q) => carry + q.Weight, 0)
    ) || 0
  }

  static computeTimeSpent(start, end) {
    const mStart = moment(start);
    const mEnd = moment(end);

    return moment.duration(mEnd.diff(mStart)).humanize()
  }

  static renderRecruiteeLink(q) {
    if (!q.Corrected) {
      return null;
    }

    if (q.User.RecruiteeID === null) {
      return <small>user not imported from Recruitee</small>;
    }

    return <a
      href={`${process.env.REACT_APP_RECRUITEE_BASE_URL}/#/offers/php-internship-test/pipeline?candidate=${q.User.RecruiteeID}`}
      target="_blank"
      rel="noopener noreferrer">
      See candidate
    </a>;
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
              <th>Quiz</th>
              <th>% Completed</th>
              <th>Score</th>
              <th>Recruitee</th>
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
                <td>{List.computePercentCompleted(q.Questions).toFixed(0)}<small className="text-muted">%</small></td>
                <td>{List.computeScore(q.Questions).toFixed(0)}<small>%</small></td>
                <td>{List.renderRecruiteeLink(q)}</td>
                <td>{q.Active ? 'In Progress' : 'Finished'}</td>
                <td>{q.Active
                  ? '-'
                  : <span>{List.computeTimeSpent(q.CreatedAt, q.UpdatedAt)}</span>
                }</td>
                <td>
                  {!q.Active && <i className="fa fa-eye" onClick={() => this.props.openQuizView(q.ID)}/>}
                </td>
              </tr>
            )}
            </tbody>
          </Table>
        </CardBody>
        <CardFooter>
          <Pager
            noPages={Math.ceil(
              Filters.apply(this.props.list, this.state.filters).size / this.state.perPage
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
  {getQuizzes, openQuizView}
)(List);
