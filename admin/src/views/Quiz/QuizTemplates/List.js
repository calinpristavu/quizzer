import PropTypes from "prop-types";
import {Card, CardBody, CardFooter, CardHeader, Table} from "reactstrap";
import React, {Component} from "react";
import Pager from "../../Base/Paginations/Pager";
import {connect} from "react-redux";
import {
  cloneQuizTemplate,
  deleteQuizTemplate,
  getQuizTemplates,
  setQuizTemplateCreate,
  setQuizTemplateEdit
} from "../../../redux/actions";
import {Map} from 'immutable';

class List extends Component {
  state = {
    perPage: 5,
    currentPage: 0
  };

  static propTypes = {
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
          <i className="fa fa-align-justify" /> Quizzes
          <span className="float-right">
            <i
              onClick={() => this.props.setQuizTemplateCreate({})}
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
              <th>Actions</th>
            </tr>
            </thead>
            <tbody>
              {this.getVisibleItems().map(q =>
                <tr key={q.ID}>
                  <td>{q.Name}</td>
                  <td>{q.QuizQuestions !== null ? q.QuizQuestions.length : 0}</td>
                  <td>{q.Duration}</td>
                  <td>
                    <i
                      onClick={() => this.props.cloneQuizTemplate(q)}
                      className="fa fa-copy text-success list-action"
                      title="Clone quiz"/>
                    <i
                      onClick={() => this.props.setQuizTemplateEdit(q)}
                      className="fa fa-edit text-warning list-action"
                      title="Edit"/>
                    <i
                      onClick={(e) => { if (window.confirm('Are you sure you wish to delete this Question?')) this.delete(e, q.ID) } }
                      className="fa fa-trash list-action"
                      title="Delete!"/>
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
  {getQuizTemplates, deleteQuizTemplate, setQuizTemplateCreate, setQuizTemplateEdit, cloneQuizTemplate}
)(List);
