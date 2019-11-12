import React, {Component} from 'react'
import {
  Row,
  Col,
} from "reactstrap";
import List from "./List";
import Create from "./Create";
import Edit from "./Edit";
import {connect} from "react-redux";
import {getQuizTemplates} from "../../../redux/actions";

const views = {
  create: 1,
  edit: 2,
  view: 3,
  clone: 4,
};

class QuizTemplates extends Component {
  state = {
    openedView: views.create,
    cloneItem: null,
  };

  componentDidMount() {
    this.props.getQuizTemplates();
  }

  render() {
    return (
      <div className="animated fadeIn">
        <Row>
          <Col md={6}>
            <List/>
          </Col>

          <Col md={6}>
            <Create />
            <Edit />
          </Col>
        </Row>
      </div>
    );
  }
}

export default connect(
  state => ({
    quizTemplates: state.quizTemplate.list
  }),
  {getQuizTemplates}
)(QuizTemplates);
