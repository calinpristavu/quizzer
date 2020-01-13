import React, {Component} from "react";
import {connect} from "react-redux";
import {Card, CardBody, CardFooter, CardHeader, Progress, Table} from "reactstrap";
import {
  deleteQuestionTemplate,
  getQuestionTemplates,
  getQuizzes,
  openQuestionTemplateEdit,
  openQuestionTemplateView,
  setQuestionTemplateCreate,
} from "redux/actions";
import {selectQuestionTemplatesWithUsage} from "redux/selectors";
import Pager from "views/Base/Paginations/Pager";
import {questionTypes} from "views/Quiz/QuestionTemplates/QuestionTemplates";
import Filters from "views/Quiz/QuestionTemplates/Filters";

class QuestionsList extends Component {
  state = {
    perPage: 5,
    currentPage: 0,
    visibleItems: [],
    filters: {}, // {prop1: [value1, value2, ...], ...}
  };

  componentDidMount() {
    this.props.getQuestionTemplates();
    this.props.getQuizzes();
  };

  getVisibleItems = () => {
    const firstPosition = this.state.perPage * this.state.currentPage;

    return this.props.list
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
      filters[propertyPath] = val;

      return {
        filters: filters,
        currentPage: 0
      }
    }, () => {
      this.props.getQuestionTemplates(this.state.filters);
    })
  };

  clearFilter = (propertyPath) => {
    this.setState((oldState) => {
      const filters = oldState.filters;
      delete filters[propertyPath];

      return {
        filters: filters,
        currentPage: 0
      }
    }, () => {
      this.props.getQuestionTemplates(this.state.filters);
    })
  };

  renderTextCell = (question) => {
    let tagsStripped = new DOMParser().parseFromString(question.Text, 'text/html');
    tagsStripped = tagsStripped.body.textContent || "";

    let lengthTrimmed = tagsStripped;
    if (lengthTrimmed.length > 200) {
      lengthTrimmed = lengthTrimmed.substr(0, 200) + ' ...(click to view more)';
    }

    return (
      <div>
        <h4>#{question.ID}</h4>
        <h5>
          {question.Tags.map((t, k) => <span className="badge badge-pill badge-primary" key={k}>{t.Text}</span>)}
        </h5>
        <div>
          {lengthTrimmed}
        </div>
      </div>
    );
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
              <th>Actions</th>
            </tr>
            </thead>
            <tbody>
            {this.getVisibleItems().map((q, k) =>
              <tr key={k} onClick={() => {this.props.openQuestionTemplateView(q.ID)}}>
                <td>{this.renderTextCell(q)}</td>
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
                  <i
                    onClick={() => {this.props.openQuestionTemplateView(q.ID)}}
                    className="list-action fa fa-chart-pie"
                    title="View"/>
                  <i
                    onClick={() => {this.props.openQuestionTemplateEdit(q.ID)}}
                    className="list-action fa fa-edit text-warning"
                    title="Edit"/>
                  <i
                    onClick={(e) => { if (window.confirm('Are you sure you wish to delete this Question?')) this.delete(e, q.ID) } }
                    className="fa fa-trash text-danger list-action"
                    title="Delete!"/>
                </td>
              </tr>
            )}
            </tbody>
          </Table>
        </CardBody>
        <CardFooter>
          <Pager
            noItems={this.props.list.size}
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
    list: selectQuestionTemplatesWithUsage(state)
  }),
  {
    getQuestionTemplates,
    getQuizzes,
    openQuestionTemplateView,
    openQuestionTemplateEdit,
    deleteQuestionTemplate,
    setQuestionTemplateCreate
  }
)(QuestionsList);
