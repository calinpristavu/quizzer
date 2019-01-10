import React, {Component} from 'react';
import {
  Row,
  Col,
} from 'reactstrap';
import QuestionsList from "./List";
import CreateQuestion from "./Create";
import EditQuestion from "./Edit";

const views = {
  create: 1,
  edit: 2,
  view: 3
};

class QuestionTemplates extends Component{
  state = {
    openedView: views.create,
    editItem: {}
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
          </Col>
        </Row>
      </div>
    );
  }
}

export default QuestionTemplates;
