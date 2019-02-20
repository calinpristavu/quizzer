import PropTypes from "prop-types";
import {Card, CardBody, CardFooter, CardHeader, Table} from "reactstrap";
import React, {Component} from "react";
import Pager from "../../Base/Paginations/Pager";
import {connect} from "react-redux";
import {deleteQuizTemplate, getQuizTemplates} from "../../../redux/actions";
import {Map} from 'immutable';

class List extends Component {
  state = {
    perPage: 5,
    currentPage: 0
  };

  static propTypes = {
    openEdit: PropTypes.func,
    openCreate: PropTypes.func,
    openClone: PropTypes.func,
    delete: PropTypes.func,
    list: PropTypes.instanceOf(Map),
  };

  componentDidMount() {
    this.props.getQuizTemplates();
  };

  getVisibleItems = () => {
    const firstPosition = this.state.perPage * this.state.currentPage;

    return this.props.list
      .slice(firstPosition, firstPosition + this.state.perPage)
      .valueSeq();
  };

  delete = (e, qId) => {
    e.stopPropagation();
    this.props.deleteQuizTemplate(qId)
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
              <th>Time limit</th>
              <th />
            </tr>
            </thead>
            <tbody>
              {this.getVisibleItems().map(q =>
                <tr key={q.ID}>
                  <td>{q.Name}</td>
                  <td>{q.QuizQuestions !== null ? q.QuizQuestions.length : 0}</td>
                  <td>{q.Duration}</td>
                  <td>
                    <i onClick={() => this.props.openClone(q.ID)} className="fa fa-copy text-success"/>
                    <i onClick={() => this.props.openEdit(q)} className="fa fa-edit text-warning"/>
                    <i onClick={(e) => this.delete(e, q.ID)} className="fa fa-minus-circle"/>
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </CardBody>
        <CardFooter>
          <Pager
            noPages={Math.ceil(this.props.list.size / this.state.perPage)}
            currentPage={this.state.currentPage}
            perPage={this.state.perPage}
            toPage={(pageNo) => this.setState({currentPage: pageNo})}
            setPerPage={(v) => this.setState({perPage: v})}/>
        </CardFooter>
      </Card>
    );
  }
}

export default connect(
  state => ({
    list: state.quizTemplate.list
  }),
  {getQuizTemplates, deleteQuizTemplate}
)(List);
