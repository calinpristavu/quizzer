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
import {CheckboxAnswerTemplates, FlowDiagramAnswer} from "./AnswerTemplates";
import React, {Component} from "react";
import {questionTypes} from "./QuestionTemplates";

class EditQuestion extends Component {
  state = {
    Text: "Sample text...",
    Type: null,
    CheckboxAnswerTemplates: [],
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
                  checked={this.state.Type === 1}/>
                <Label className="form-check-label" check htmlFor="question-type-1">{questionTypes[1]}</Label>
              </FormGroup>
              <FormGroup check inline>
                <Input
                  className="form-check-input"
                  type="radio"
                  onChange={() => this.setState({Type: 2})}
                  checked={this.state.Type === 2}/>
                <Label className="form-check-label" check htmlFor="question-type-2">{questionTypes[2]}</Label>
              </FormGroup>
              <FormGroup check inline>
                <Input
                  className="form-check-input"
                  type="radio"
                  onChange={() => this.setState({Type: 3})}
                  checked={this.state.Type === 3}/>
                <Label className="form-check-label" check htmlFor="question-type-3">{questionTypes[3]}</Label>
              </FormGroup>
            </Col>
          </FormGroup>
          {this.state.Type === 1 &&
            <CheckboxAnswerTemplates
              removeChoice={this.removeCheckboxChoice}
              addChoice={this.addCheckboxChoice}
              answers={this.state.CheckboxAnswerTemplates}/>
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
