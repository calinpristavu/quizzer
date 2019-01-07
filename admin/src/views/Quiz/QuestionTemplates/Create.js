import PropTypes from "prop-types";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Row
} from "reactstrap";
import {ChoiceAnswerTemplates, FlowDiagramAnswer} from "./AnswerTemplates";
import React, {Component} from "react";

class CreateQuestion extends Component {
  state = {
    Text: '',
    Type: null,
    ChoiceAnswerTemplates: [],
    FlowDiagramAnswerTemplate: null
  };

  static propTypes = {
    appendQuestion: PropTypes.func,
  };

  create = () => {
    fetch("/question-templates", {
      method: "POST",
      body: JSON.stringify(this.state),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(() => {
        return this.props.appendQuestion(this.state);
      })
  };

  removeChoice = (choiceIndex) => {
    this.setState((oldState) => {
      const choices = oldState.ChoiceAnswerTemplates;
      delete choices[choiceIndex];

      return {ChoiceAnswerTemplates: choices}
    })
  };

  addChoice = (choice) => {
    this.setState((oldState) => {
      const choices = oldState.ChoiceAnswerTemplates;
      choices.push(choice);

      return {ChoiceAnswerTemplates: choices}
    })
  };

  render() {
    return (
      <Card>
        <Form name="create-question">
          <CardHeader>
            <i className="fa fa-plus-circle text-success" />
            <strong>Create Question</strong>
            <small> Form</small>
          </CardHeader>
          <CardBody>
            <Row>
              <Col xs="12">
                <FormGroup>
                  <Label htmlFor="question-text">Text</Label>
                  <Input
                    name="Text"
                    type="text"
                    id="question-text"
                    value={this.state.Text}
                    onChange={(e) => this.setState({Text: e.target.value})}
                    placeholder="Type in the question text"
                    required />
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
                    name="Type"/>
                  <Label className="form-check-label" check htmlFor="question-type-1">Checkboxes</Label>
                </FormGroup>
                <FormGroup check inline>
                  <Input
                    className="form-check-input"
                    type="radio"
                    onChange={() => this.setState({Type: 2})}
                    id="question-type-2"
                    name="Type" />
                  <Label className="form-check-label" check htmlFor="question-type-2">Free text</Label>
                </FormGroup>
                <FormGroup check inline>
                  <Input
                    className="form-check-input"
                    type="radio"
                    onChange={() => this.setState({Type: 3})}
                    id="question-type-3"
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
          <CardFooter>
            <Button
              onClick={this.create}
              type="button"
              size="sm"
              color="primary">
              <i className="fa fa-dot-circle-o" /> Submit
            </Button>
          </CardFooter>
        </Form>
      </Card>
    );
  }
}

export default CreateQuestion;
