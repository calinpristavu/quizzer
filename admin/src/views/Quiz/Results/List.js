import {CardBody, CardFooter, Table} from "reactstrap";
import React, {Component} from "react";
import Pager from "../../Base/Paginations/Pager";
import moment from 'moment';

class List extends Component {
  perPage = 5;

  state = {
    noPages: 0,
    currentPage: 0,
    allItems: [],
    visibleItems: []
  };

  // TODO: PropTypes

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
              <th />
            </tr>
            </thead>
            <tbody>
            {this.state.visibleItems.map((q, k) =>
              <tr key={k}>
                <td>{q.ID}</td>
                <td>{q.User ? q.User.Username : '-'}</td>
                <td>{q.Name}</td>
                <td>{List.computePercentCompleted(q.Questions)} <small className="text-muted">%</small></td>
                <td>{List.countCorrect(q.Questions)} / {q.Questions.length}</td>
                <td>{q.Active ? 'In Progress' : 'Finished'}</td>
                <td>{q.Active
                  ? '-'
                  : <span>{List.computeTimeSpent(q.CreatedAt, q.UpdatedAt)}</span>
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
          <Pager
            noPages={this.state.noPages}
            currentPage={this.state.currentPage}
            toPage={this.toPage}/>
          }
        </CardFooter>
      </div>
    )
  }
}

export default List;
