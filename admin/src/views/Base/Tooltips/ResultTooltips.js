import React, {Component} from 'react';
import {UncontrolledTooltip} from "reactstrap";

export class TextTip extends Component {
  render() {
    return (
      <span>
        <i className="fa fa-question-circle float-left" id={`text-${this.props.id}`}/>{' '}
        <UncontrolledTooltip placement="top" target={`text-${this.props.id}`}>
          <small>The score for this answer can be set from the input to the right.</small>
          <br/>
          <small>Comments can be added in the textarea under the answer.</small>
        </UncontrolledTooltip>
      </span>
    );
  }
}

export class FlowDiagramTip extends Component {
  render() {
    return (
      <span>
        <i className="fa fa-question-circle float-left" id={`text-${this.props.id}`}/>{' '}
        <UncontrolledTooltip placement="top" target={`text-${this.props.id}`}>
          <small>The score for this answer can be set from the input to the right.</small>
          <br/>
          <small>Comments can be added in the textarea under the answer.</small>
        </UncontrolledTooltip>
      </span>
    );
  }
}

export class CheckboxTip extends Component {
  render() {
    return (
      <span>
        <i className="fa fa-question-circle float-left" id={`text-${this.props.id}`}/>{' '}
        <UncontrolledTooltip placement="top" target={`text-${this.props.id}`}>
          <small><span style={{color: "#4DBD74"}}>GREEN</span> answers are the correct ones</small>
          <br/>
          <small><i className="fa fa-check-square-o" /> answers are the ones the user selected</small>
          <br/>
          <small><i className="fa fa-square-o" /> answers are the ones the user did not select</small>
          <p>This quesiton is automatically evaluated.</p>
        </UncontrolledTooltip>
      </span>
    );
  }
}

export class RadioTip extends Component {
  render() {
    return (
      <span>
        <i className="fa fa-question-circle float-left" id={`text-${this.props.id}`}/>{' '}
        <UncontrolledTooltip placement="top" target={`text-${this.props.id}`}>
          <small><span style={{color: "#4DBD74"}}>GREEN</span> answer is the correct one</small>
          <br/>
          <small><i className="fa fa-check-circle-o" /> answer is the one the user selected</small>
          <br/>
          <small><i className="fa fa-circle-o" /> answers are the ones the user did not select</small>
          <p>This quesiton is automatically evaluated.</p>
        </UncontrolledTooltip>
      </span>
    );
  }
}
