import PropTypes from "prop-types";
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  FormGroup,
  Input,
  Label,
  Row
} from "reactstrap";
import {ChoiceAnswerTemplates, FlowDiagramAnswer} from "./AnswerTemplates";
import React, {Component} from "react";

class EditQuestion extends Component {
  state = {
    Text: "Sample text...",
    Type: null,
    ChoiceAnswerTemplates: [],
    FlowDiagramAnswerTemplate: null
  };

  static propTypes = {
    question: PropTypes.object,
  };

  componentWillReceiveProps(nextProps) {
    this.setState(nextProps.question)
  };

  render() {
    return (
      <Card>
        <CardHeader>
          <i className="fa fa-edit text-warning" />
          <strong>Editing question {this.props.question.ID}</strong>
          <small> Form</small>
        </CardHeader>
        <CardBody>
          <Row>
            <Col xs="12">
              <FormGroup>
                <Label htmlFor="question-text">Text</Label>
                <Input
                  type="text"
                  id="question-text"
                  placeholder="Type in the question text"
                  required
                  onChange={(e) => this.setState({Text: e.target.value})}
                  value={this.state.Text}/>
              </FormGroup>
            </Col>
          </Row>
          <FormGroup row>
            <Col md="12">
              <Label>Type</Label>
            </Col>
            <Col md="12">
              <FormGroup check inline>
                <Input
                  className="form-check-input"
                  type="radio"
                  onChange={() => this.setState({Type: 1})}
                  id="question-type-1"
                  checked={this.state.Type === 1}
                  name="Type"/>
                <Label className="form-check-label" check htmlFor="question-type-1">Checkboxes</Label>
              </FormGroup>
              <FormGroup check inline>
                <Input
                  className="form-check-input"
                  type="radio"
                  onChange={() => this.setState({Type: 2})}
                  id="question-type-2"
                  checked={this.state.Type === 2}
                  name="Type" />
                <Label className="form-check-label" check htmlFor="question-type-2">Free text</Label>
              </FormGroup>
              <FormGroup check inline>
                <Input
                  className="form-check-input"
                  type="radio"
                  onChange={() => this.setState({Type: 3})}
                  id="question-type-3"
                  checked={this.state.Type === 3}
                  name="Type" />
                <Label className="form-check-label" check htmlFor="question-type-3">Flow Diagram</Label>
              </FormGroup>
            </Col>
          </FormGroup>
          {this.state.Type === 1 &&
          <ChoiceAnswerTemplates
            removeChoice={this.removeChoice}
            addChoice={this.addChoice}
            answers={this.state.ChoiceAnswerTemplates}/>
          }
          {this.state.Type === 3 &&
          <FlowDiagramAnswer />
          }
        </CardBody>
      </Card>
    );
  }
}

export default EditQuestion;
