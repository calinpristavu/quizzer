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
import React, {Component} from "react";
import {connect} from "react-redux";
import Creatable from "react-select/creatable";
import {createQuestionTemplate, getQuestionTags, setQuestionTemplateCreate} from "store/actions";
import {questionTypes} from "views/Quiz/QuestionTemplates/QuestionTemplates";
import CheckboxAnswerTemplate from "views/Quiz/AnswerTemplates/CheckboxAnswerTemplate";
import CodeAnswerTemplate from "views/Quiz/AnswerTemplates/CodeAnswerTemplate";
import FlowDiagramAnswerTemplate from "views/Quiz/AnswerTemplates/FlowDiagramAnswerTemplate";
import RadioAnswerTemplate from "views/Quiz/AnswerTemplates/RadioAnswerTemplate";

class CreateQuestion extends Component {
  defaultState = {
    Tags: [],
    Text: '<p>Here\'s where the question text goes...</p>',
    Type: null,
    CheckboxAnswerTemplates: [],
    RadioAnswerTemplates: [],
    FlowDiagramAnswerTemplate: null,
    TextAnswerTemplate: null,
    uniqueIdx: new Date().getTime(),
  };

  state = this.defaultState;

  createFormRef = React.createRef();

  componentDidMount() {
    this.props.getQuestionTags()
  }

  create = () => {
    const question = this.state;

    if (this.state.Type === 4) {
      const correctQIndex = parseInt(this.createFormRef.current['Answer'].value);
      question.RadioAnswerTemplates.forEach((a, k) => {
        question.RadioAnswerTemplates[k].IsCorrect = k === correctQIndex
      });
    }

    this.props.createQuestionTemplate(question)
      .then(() => this.setState({
        ...this.defaultState,
        CheckboxAnswerTemplates: [],
        RadioAnswerTemplates: [],
        uniqueIdx: new Date().getTime(),
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
    this.setState((oldState) => ({
      CheckboxAnswerTemplates: oldState.CheckboxAnswerTemplates
        .filter((e, index) => index !== choiceIndex)
    }))
  };

  addRadioChoice = (choice) => {
    this.setState((oldState) => {
      const choices = oldState.RadioAnswerTemplates;
      choices.push(choice);

      return {RadioAnswerTemplates: choices}
    })
  };

  removeRadioChoice = (choiceIndex) => {
    this.setState((oldState) => ({
      RadioAnswerTemplates: oldState.RadioAnswerTemplates
        .filter((e, index) => index !== choiceIndex)
    }))
  };

  uploadCallback = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve({data: {link: reader.result}});
      reader.onerror = error => reject(error);
    })
  };

  static tagsAsOptions = (tags) => {
    const opts = [];

    tags.forEach(t => {
      opts.push({
        value: t.Text,
        label: t.Text
      })
    });

    return opts;
  };

  storeTags = (opts) => {
    this.setState({
      Tags: opts.map(o => {
        const existingTag = this.props.tags.find(t => t.Text === o.value);

        if (existingTag !== undefined) {
          return existingTag;
        }

        return {Text: o.value};
      })
    })
  };

  render() {
    if (!this.props.isOpen) {
      return null
    }

    return (
      <Card>
        <Form innerRef={this.createFormRef} key={this.state.uniqueIdx}>
          <CardHeader>
            <span className="float-right">
              <i
                onClick={() => this.props.setQuestionTemplateCreate(null)}
                className="fa fa-minus-circle"
                style={{cursor: "pointer"}}/>
            </span>
            <i className="fa fa-plus-circle text-success" />
            <strong>Create Question</strong>
            <small> Form</small>
          </CardHeader>
          <CardBody>
            <Row>
              <Col xs={12}>
                <FormGroup>
                  <Label>Tags</Label>
                  <Creatable
                    isMulti
                    isClearable
                    onChange={this.storeTags}
                    options={CreateQuestion.tagsAsOptions(this.props.tags)}/>
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col xs="12">
                <FormGroup>
                  <Label htmlFor="question-text">Text</Label>
                  <Editor
                    editorStyle={{
                      border: "1px solid #c8ced3"
                    }}
                    toolbar={{
                      options: ['inline', 'blockType', 'fontSize', 'fontFamily', 'list', 'textAlign', 'colorPicker', 'link', 'emoji', 'image', 'remove', 'history'],
                      image: { uploadCallback: this.uploadCallback, previewImage: true }
                    }}
                    onBlur={(e, editorState) => this.setState({
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
                  <Label className="form-check-label" check>
                    <Input
                      className="form-check-input"
                      type="radio"
                      checked={this.state.Type === 1}
                      onChange={() => this.setState({Type: 1})}
                      name="Type"/>
                    {questionTypes[1]}
                  </Label>
                </FormGroup>
                <FormGroup check inline>
                  <Label className="form-check-label" check>
                    <Input
                      className="form-check-input"
                      type="radio"
                      checked={this.state.Type === 4}
                      onChange={() => this.setState({Type: 4})}
                      name="Type"/>
                    {questionTypes[4]}
                  </Label>
                </FormGroup>
                <FormGroup check inline>
                  <Label className="form-check-label" check>
                    <Input
                      className="form-check-input"
                      type="radio"
                      checked={this.state.Type === 2}
                      onChange={() => this.setState({Type: 2})}
                      name="Type" />
                    {questionTypes[2]}
                  </Label>
                </FormGroup>
                <FormGroup check inline>
                  <Label className="form-check-label" check>
                    <Input
                      className="form-check-input"
                      type="radio"
                      checked={this.state.Type === 3}
                      onChange={() => this.setState({Type: 3})}
                      name="Type" />
                    {questionTypes[3]}
                  </Label>
                </FormGroup>
              </Col>
            </FormGroup>
            {this.state.Type === 1 &&
              <CheckboxAnswerTemplate
                removeChoice={this.removeCheckboxChoice}
                addChoice={this.addCheckboxChoice}
                answers={this.state.CheckboxAnswerTemplates}/>
            }
            {this.state.Type === 2 &&
            <CodeAnswerTemplate
              save={(val) => {this.setState({TextAnswerTemplate: {Text: val}})}}
              answers={this.state.TextAnswerTemplate}/>
            }
            {this.state.Type === 3 &&
              <FlowDiagramAnswerTemplate />
            }
            {this.state.Type === 4 &&
            <RadioAnswerTemplate
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
  state => ({
    isOpen: state.questionTemplate.createQuestionTemplate,
    tags: state.tags.list
  }),
  {createQuestionTemplate, setQuestionTemplateCreate, getQuestionTags}
)(CreateQuestion);
