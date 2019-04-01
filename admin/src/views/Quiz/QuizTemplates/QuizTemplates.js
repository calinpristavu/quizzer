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
import Clone from "./Clone";

const views = {
  create: 1,
  edit: 2,
  view: 3,
  clone: 4,
};

class QuizTemplates extends Component {
  state = {
    openedView: views.create,
    editItem: null,
    cloneItem: null,
  };

  componentDidMount() {
    this.props.getQuizTemplates();
  }

  openClone = (qtId) => {
    if (!this.props.quizTemplates.has(qtId)) {
      return null;
    }

    this.setState({
      openedView: views.clone,
      cloneItem: JSON.parse(JSON.stringify(this.props.quizTemplates.get(qtId)))
    })
  };

  render() {
    return (
      <div className="animated fadeIn">
        <Row>
          <Col xs="12" lg="6">
            <List
              openEdit={(q) => this.setState({openedView: views.edit, editItem: q})}
              openClone={this.openClone}
              />
          </Col>

          <Col xs="12" lg="6">
            <Create />

            {this.state.openedView === views.edit ?
              <Edit quiz={this.state.editItem} key={this.state.editItem.ID}/> : null
            }
            {this.state.openedView === views.clone ?
              <Clone quiz={this.state.cloneItem} key={this.state.cloneItem.ID}/> : null
            }
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
