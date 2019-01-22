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
import {Editor} from 'react-draft-wysiwyg';
import { convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import {CheckboxAnswerTemplates, FlowDiagramAnswer, RadioAnswerTemplates} from "./AnswerTemplates";
import React, {Component} from "react";
import {connect} from "react-redux";
import {createQuestionTemplate} from "../../../redux/actions";
import {questionTypes} from "./QuestionTemplates";

class CreateQuestion extends Component {
  defaultState = {
    Text: '<p>Here\'s where the question text goes...</p>',
    Type: null,
    CheckboxAnswerTemplates: [],
    RadioAnswerTemplates: [],
    FlowDiagramAnswerTemplate: null,
  };

  state = this.defaultState;

  createFormRef = React.createRef();

  create = () => {
    const question = this.state;

    const correctQIndex = parseInt(this.createFormRef.current['Answer'].value);
    question.RadioAnswerTemplates.forEach((a, k) => {
      question.RadioAnswerTemplates[k].IsCorrect = k === correctQIndex
    });

    this.props.createQuestionTemplate(question)
      .then(() => this.setState({
        ...this.defaultState,
        CheckboxAnswerTemplates: [],
        RadioAnswerTemplates: [],
      }))
  };

  addCheckboxChoice = (choice) => {
    this.setState((oldState) => {
      const choices = oldState.CheckboxAnswerTemplates;
      choices.push(choice);

      return {CheckboxAnswerTemplates: choices}
    })
  };

  removeCheckboxChoice = (choiceIndex) => {
    this.setState((oldState) => {
      const choices = oldState.CheckboxAnswerTemplates;
      delete choices[choiceIndex];

      return {CheckboxAnswerTemplates: choices}
    })
  };

  addRadioChoice = (choice) => {
    this.setState((oldState) => {
      const choices = oldState.RadioAnswerTemplates;
      choices.push(choice);

      return {RadioAnswerTemplates: choices}
    })
  };

  removeRadioChoice = (choiceIndex) => {
    this.setState((oldState) => {
      const choices = oldState.RadioAnswerTemplates;
      delete choices[choiceIndex];

      return {RadioAnswerTemplates: choices}
    })
  };

  uploadCallback = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve({data: {link: reader.result}});
      reader.onerror = error => reject(error);
    })
  };

  render() {
    return (
      <Card>
        <Form innerRef={this.createFormRef}>
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
                  <Editor
                    initialEditorState={this.state.Text}
                    editorStyle={{
                      border: "1px solid #c8ced3"
                    }}
                    toolbar={{
                      options: ['inline', 'blockType', 'fontSize', 'fontFamily', 'list', 'textAlign', 'colorPicker', 'link', 'emoji', 'image', 'remove', 'history'],
                      image: { uploadCallback: this.uploadCallback, previewImage: true }
                    }}
                    onEditorStateChange={editorState => this.setState({
                      Text: draftToHtml(convertToRaw(editorState.getCurrentContent()))
                    })}
                  />
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
                    checked={this.state.Type === 1}
                    onChange={() => this.setState({Type: 1})}
                    id="question-type-1"
                    name="Type"/>
                  <Label className="form-check-label" check htmlFor="question-type-1">{questionTypes[1]}</Label>
                </FormGroup>
                <FormGroup check inline>
                  <Input
                    className="form-check-input"
                    type="radio"
                    checked={this.state.Type === 4}
                    onChange={() => this.setState({Type: 4})}
                    id="question-type-4"
                    name="Type"/>
                  <Label className="form-check-label" check htmlFor="question-type-4">{questionTypes[4]}</Label>
                </FormGroup>
                <FormGroup check inline>
                  <Input
                    className="form-check-input"
                    type="radio"
                    checked={this.state.Type === 2}
                    onChange={() => this.setState({Type: 2})}
                    id="question-type-2"
                    name="Type" />
                  <Label className="form-check-label" check htmlFor="question-type-2">{questionTypes[2]}</Label>
                </FormGroup>
                <FormGroup check inline>
                  <Input
                    className="form-check-input"
                    type="radio"
                    checked={this.state.Type === 3}
                    onChange={() => this.setState({Type: 3})}
                    id="question-type-3"
                    name="Type" />
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
            {this.state.Type === 4 &&
            <RadioAnswerTemplates
              removeChoice={this.removeRadioChoice}
              addChoice={this.addRadioChoice}
              answers={this.state.RadioAnswerTemplates}/>
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

export default connect(
  null,
  {createQuestionTemplate}
)(CreateQuestion);
