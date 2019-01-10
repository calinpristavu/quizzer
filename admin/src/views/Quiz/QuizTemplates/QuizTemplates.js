import React, {Component} from 'react'
import {
  Row,
  Col,
} from "reactstrap";
import List from "./List";
import Create from "./Create";
import Edit from "./Edit";

const views = {
  create: 1,
  edit: 2,
  view: 3
};

class QuizTemplates extends Component {
  state = {
    openedView: views.create,
    editItem: null
  };

  render() {
    return (
      <div className="animated fadeIn">
        <Row>
          <Col xs="12" lg="6">
            <List
              openEdit={(q) => this.setState({openedView: views.edit, editItem: q})}
              openCreate={() => this.setState({openedView: views.create})}
              />
          </Col>

          <Col xs="12" lg="6">
            {this.state.openedView === views.create ?
              <Create /> : null
            }
            {this.state.openedView === views.edit ?
              <Edit quiz={this.state.editItem}/> : null
            }
          </Col>
        </Row>
      </div>
    );
  }
}

export default QuizTemplates;
