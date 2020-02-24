import {Card, CardBody, CardFooter, CardHeader, Table} from "reactstrap";
import React, {Component} from "react";
import moment from 'moment';
import {connect} from "react-redux";
import {getQuiz, getQuizzes, setQuizFilter, setQuizSorting} from "store/actions";
import {Link} from "react-router-dom";
import Filters from "views/Quiz/Results/Filters";
import Pager from "views/Base/Paginations/Pager";

class List extends Component {
  scoreSort = 1;

  scoreSortMap = ["desc", null, "asc"];

  state = {
    filters: [], // [{properyPath: "Nested.Object.Property", values: [1,2,3,'whatever']}, ...]
  };

  componentDidMount() {
    this.props.getQuizzes(this.props.page, this.props.perPage);
  }

  static computePercentCompleted(questions) {
    return (questions.reduce(
      (carry, q) => carry + (q.IsAnswered ? 1 : 0),
      0
    ) * 100 / questions.length) || 0
  }

  addFilter = (propertyPath, val) => {
    this.props.setQuizFilter(propertyPath, val);
    this.props.getQuizzes();
  };

  /**
   * Cycle score from 0 to 2
   * 0 - desc
   * 1 - no sorting
   * 2 - asc
   */
  sort = () => {
    this.scoreSort = (this.scoreSort + 2) % 3;

    const sortDir = this.scoreSortMap[this.scoreSort];
    const sortField = sortDir !== null ? "Score" : null;

    this.props.setQuizSorting(sortField, sortDir);
    this.props.getQuizzes();
  };

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
    const sortClass = this.scoreSort === 0
      ? 'fa-sort-down'
      : this.scoreSort === 1 ? 'fa-sort' : 'fa-sort-up';

    return (
      <Card>
        <CardHeader>
          <i className="fa fa-align-justify"/> Quiz Results <small className="text-muted">list</small>
          <Filters
            addFilter={this.addFilter}
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
              <th><i
                onClick={this.sort}
                className={`fa ${sortClass}`}/>
                {' '} Score
              </th>
              <th>Recruitee</th>
              <th>Active</th>
              <th>Corrected</th>
              <th>Time spent</th>
              <th>Actions</th>
            </tr>
            </thead>
            <tbody>
            {this.props.list.valueSeq().map((q, k) =>
              <tr key={k}>
                <td>{q.ID}</td>
                <td>{q.User ? q.User.Username : '-'}</td>
                <td>{this.renderQuizTemplateCell(q.Name)}</td>
                <td>{List.computePercentCompleted(q.Questions).toFixed(0)}<small className="text-muted">%</small></td>
                <td>{q.Score.toFixed(0)}<small>%</small></td>
                <td>{List.renderRecruiteeLink(q)}</td>
                <td>{q.Active ? "In Progress" : "Finished"}</td>
                <td>{q.Corrected ? "Corrected" : "Not Corrected"}</td>
                <td>{q.Active
                  ? '-'
                  : <span>{List.computeTimeSpent(q.CreatedAt, q.UpdatedAt)}</span>
                }</td>
                <td>
                  {!q.Active &&
                  <i
                    className="fa fa-eye list-action"
                    onClick={() => this.props.getQuiz(q.ID)}
                    title="View quiz"/>
                  }
                </td>
              </tr>
            )}
            </tbody>
          </Table>
        </CardBody>
        <CardFooter>
          <Pager
            noPages={Math.ceil(this.props.noItems / this.props.perPage)}
            noItems={this.props.noItems}
            currentPage={this.props.page - 1}
            perPage={this.props.perPage}
            toPage={(pageNo) => this.props.getQuizzes(pageNo + 1, this.props.perPage)}
            setPerPage={(v) => this.props.getQuizzes(this.props.page, v)}/>
        </CardFooter>
      </Card>
    )
  }
}

export default connect(
  state => ({
    list: state.quiz.list,
    page: state.quiz.page,
    perPage: state.quiz.perPage,
    noItems: state.quiz.noItems,
  }),
  {getQuizzes, getQuiz, setQuizFilter, setQuizSorting}
)(List);
