import PropTypes from "prop-types";
import {Card, CardBody, CardFooter, CardHeader, Progress, Table} from "reactstrap";
import React, {Component} from "react";
import Pager from "../../Base/Paginations/Pager";
import {connect} from "react-redux";
import {
  deleteQuestionTemplate,
  getQuestionTemplates,
  getQuizzes,
  openQuestionTemplateView,
  setQuestionTemplateCreate,
} from "../../../redux/actions";
import {selectQuestionTemplatesWithUsage} from "../../../redux/selectors";
import Filters from "./Filters";
import {questionTypes} from "./QuestionTemplates";

export class QuestionsList extends Component {
  state = {
    perPage: 5,
    currentPage: 0,
    visibleItems: [],
    filters: [], // [{properyPath: "Nested.Object.Property", values: [1,2,3,'whatever']}, ...]
  };

  static propTypes = {
    openEditView: PropTypes.func.isRequired,
    openQuestionTemplateView: PropTypes.func.isRequired
  };

  componentDidMount() {
    this.props.getQuestionTemplates();
    this.props.getQuizzes();
  };

  getVisibleItems = () => {
    const firstPosition = this.state.perPage * this.state.currentPage;

    return Filters
      .apply(this.props.list, this.state.filters)
      .slice(firstPosition, firstPosition + this.state.perPage)
      .valueSeq();
  };

  delete = (e, qId) => {
    e.preventDefault();
    this.props.deleteQuestionTemplate(qId);
  };

  static percentToColor(percent) {
    switch (true) {
      case percent < 25:
        return "danger";
      case percent < 50:
        return "warning";
      case percent < 75:
        return "primary";
      default:
        return "success";
    }
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

  render() {
    return (
      <Card>
        <CardHeader>
          <span className="float-right">
            <i
              onClick={this.props.setQuestionTemplateCreate}
              className="fa fa-plus-circle text-success"
              style={{cursor: "pointer"}}/>
          </span>
          <i className="fa fa-align-justify" /> Questions
          <Filters
            addFilter={this.addFilter}
            clearFilter={this.clearFilter}
            items={this.props.list}/>
        </CardHeader>
        <CardBody>
          <Table responsive hover>
            <thead>
            <tr>
              <th>Text</th>
              <th>Type</th>
              <th>Usage rate</th>
              <th />
            </tr>
            </thead>
            <tbody>
            {this.getVisibleItems().map((q, k) =>
              <tr key={k}>
                <td dangerouslySetInnerHTML={{__html: q.Text}}/>
                <td>{questionTypes[q.Type]}</td>
                <td title={`${q.usage.toFixed(2)} %`}>
                  <Progress
                    style={{maxWidth: "80px"}}
                    max={100}
                    className="progress-xs mt-2"
                    color={QuestionsList.percentToColor(q.usage)}
                    value={q.usage} />
                </td>
                <td>
                  <i onClick={() => {this.props.openQuestionTemplateView(q.ID)}} className="fa fa-eye"/>
                  <i onClick={() => {this.props.openEditView(q.ID)}} className="fa fa-edit text-warning"/>
                  <i onClick={(e) => this.delete(e, q.ID)} className="fa fa-minus-circle text-danger"/>
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
    );
  }
}

export default connect(
  state => ({
    list: selectQuestionTemplatesWithUsage(state)
  }),
  {
    getQuestionTemplates,
    getQuizzes,
    openQuestionTemplateView,
    deleteQuestionTemplate,
    setQuestionTemplateCreate
  }
)(QuestionsList);
