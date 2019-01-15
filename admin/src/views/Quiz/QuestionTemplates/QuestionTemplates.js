import React, {Component} from 'react';
import {
  Row,
  Col,
} from 'reactstrap';
import QuestionsList from "./List";
import CreateQuestion from "./Create";
import EditQuestion from "./Edit";
import View from "./View";

const views = {
  create: 1,
  edit: 2,
  view: 3
};

export const questionTypes = {
  1: "Checkboxes",
  2: "Free text",
  3: "Flow Diagram",
};

class QuestionTemplates extends Component{
  state = {
    editItem: {},
  };

  render() {
    return (
      <div className="animated fadeIn">
        <Row>
          <Col xs="12" lg="6">
            <QuestionsList
              openCreateView={() => this.setState({openedView: views.create})}
              openEditView={(item) => this.setState({
                openedView: views.edit,
                editItem: item
              })}/>
          </Col>

          <Col xs="12" lg="6">
            {this.state.openedView === views.create ?
              <CreateQuestion /> : null
            }
            {this.state.openedView === views.edit ?
              <EditQuestion question={this.state.editItem}/> : null
            }
            <View/>
          </Col>
        </Row>
      </div>
    );
  }
}

export default QuestionTemplates;
