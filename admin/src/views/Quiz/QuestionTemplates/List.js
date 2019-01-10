import PropTypes from "prop-types";
import {Card, CardBody, CardFooter, CardHeader, Table} from "reactstrap";
import React, {Component} from "react";
import Pager from "../../Base/Paginations/Pager";
import {connect} from "react-redux";
import {deleteQuestionTemplate, getQuestionTemplates} from "../../../redux/creators";

export class QuestionsList extends Component {
  state = {
    perPage: 5,
    currentPage: 0,
    visibleItems: []
  };

  static propTypes = {
    openCreateView: PropTypes.func,
    openEditView: PropTypes.func,
    delete: PropTypes.func,
  };

  componentDidMount() {
    this.props.getQuestionTemplates();
  };

  getVisibleItems = () => {
    const firstPosition = this.state.perPage * this.state.currentPage;

    return this.props.list.slice(
      firstPosition,
      firstPosition + this.state.perPage
    );
  };

  delete = (e, qId) => {
    e.preventDefault();
    this.props.deleteQuestionTemplate(qId);
  };

  render() {
    return (
      <Card>
        <CardHeader>
          <i className="fa fa-align-justify" /> Question Templates
          <span className="float-right">
            <i
              onClick={this.props.openCreateView}
              className="fa fa-plus-circle text-success"
              style={{cursor: "pointer"}}/>
          </span>
        </CardHeader>
        <CardBody>
          <Table responsive hover>
            <thead>
            <tr>
              <th>Text</th>
              <th>Type</th>
              <th>Answer Template</th>
              <th />
            </tr>
            </thead>
            <tbody>
            {this.getVisibleItems().map((q, k) =>
              <tr key={k}>
                <td>{q.Text}</td>
                <td>{q.Type}</td>
                <td>{q.ChoiceAnswerTemplates.map((a) => a.Text)}</td>
                <td>
                  <i onClick={() => {this.props.openEditView(q)}} className="fa fa-edit text-warning"/>
                  <i onClick={(e) => this.delete(e, q.ID)} className="fa fa-minus-circle text-danger"/>
                </td>
              </tr>
            )}
            </tbody>
          </Table>
        </CardBody>
        <CardFooter>
          <Pager
            noPages={Math.ceil(this.props.list.length / this.state.perPage)}
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
    list: state.questionTemplate.list
  }),
  {getQuestionTemplates, deleteQuestionTemplate}
)(QuestionsList);