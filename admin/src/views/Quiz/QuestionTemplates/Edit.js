import PropTypes from "prop-types";
import {
  Button,
  Card,
  CardBody, CardFooter,
  CardHeader,
  Col, Form,
  FormGroup,
  Input,
  Label,
  Row
} from "reactstrap";
import React, {Component} from "react";
import {Editor} from "react-draft-wysiwyg";
import { EditorState, ContentState, convertFromHTML, convertToRaw } from 'draft-js';
import draftToHtml from "draftjs-to-html";
import {connect} from "react-redux";
import Creatable from "react-select/creatable";
import {getQuestionTags, openQuestionTemplateEdit, updateQuestionTemplate} from "store/actions";
import {editedQuestionTemplate} from "store/selectors";
import CheckboxAnswerTemplate from "views/Quiz/AnswerTemplates/CheckboxAnswerTemplate";
import CodeAnswerTemplate from "views/Quiz/AnswerTemplates/CodeAnswerTemplate";
import FlowDiagramAnswerTemplate from "views/Quiz/AnswerTemplates/FlowDiagramAnswerTemplate";
import RadioAnswerTemplate from "views/Quiz/AnswerTemplates/RadioAnswerTemplate";
import {questionTypes} from "views/Quiz/QuestionTemplates/QuestionTemplates";
import QuestionTemplate from "entities/QuestionTemplate";

class EditQuestion extends Component {
  defaultState = new QuestionTemplate();

  state = {
    question: this.props.question
  };

  formRef = React.createRef();

  static propTypes = {
    question: PropTypes.object,
  };

  static defaultProps = {
    question: null,
  };

  componentDidMount() {
    this.props.getQuestionTags()
  }

  static getDerivedStateFromProps(props, state) {
    if (state.question === null) {
      return {
        question: props.question
      }
    }

    if (props.question === null || props.question.ID === state.question.ID) {
      return null;
    }

    return {
      question: props.question
    };
  }

  static convertInitialContent = (text) => {
    const blocksFromHTML = convertFromHTML(text);

    return EditorState.createWithContent(ContentState.createFromBlockArray(
      blocksFromHTML.contentBlocks,
      blocksFromHTML.entityMap
    ))
  };

  create = () => {
    const question = this.state.question;

    if (question.Type === 4) {
      const correctQIndex = parseInt(this.formRef.current['Answer'].value);
      question.RadioAnswerTemplates.forEach((a, k) => {
        question.RadioAnswerTemplates[k].IsCorrect = k === correctQIndex
      });
    }

    this.props.updateQuestionTemplate(question)
      .then(() => this.setState({
        question: this.defaultState
      }))
  };

  addCheckboxChoice = (choice) => {
    this.setState((oldState) => {
      const choices = oldState.question.CheckboxAnswerTemplates;
      choices.push(choice);

      return oldState.question.merge({
        CheckboxAnswerTemplates: choices,
      })
    })
  };

  removeCheckboxChoice = (choiceIndex) => {
    this.setState((oldState) => ({
      question: oldState.question.merge({
        CheckboxAnswerTemplates: oldState.CheckboxAnswerTemplates
          .filter((e, index) => index !== choiceIndex)
      })
    }))
  };

  addRadioChoice = (choice) => {
    this.setState((oldState) => {
      const choices = oldState.question.RadioAnswerTemplates;
      choices.push(choice);

      return {
          question: oldState.question.merge({RadioAnswerTemplates: choices})
      }
    })
  };

  removeRadioChoice = (choiceIndex) => {
    this.setState((oldState) => ({
      question: oldState.question.merge({
        RadioAnswerTemplates: oldState.RadioAnswerTemplates
          .filter((e, index) => index !== choiceIndex)
      })
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
    this.setState(oldState => ({
      question: oldState.question.merge({
        Tags: opts.map(o => {
          const existingTag = this.props.tags.find(t => t.Text === o.value);

          if (existingTag !== undefined) {
            return existingTag;
          }

          return {Text: o.value};
        })
      })
    }))
  };

  setText = (e, editorState) => {
    this.setState(oldState => ({
      question: oldState.question.merge({
        Text: draftToHtml(convertToRaw(editorState.getCurrentContent()))
      })
    }));
  };

  setType = (typeId) => {
    this.setState(oldState => ({
      question: oldState.question.merge({
        Type: typeId
      })
    }))
  };

  render() {
    if (null === this.props.question) {
      return null;
    }

    return (
      <Card>
        <Form innerRef={this.formRef} key={this.props.question.ID}>
          <CardHeader>
            <span className="float-right">
              <i
                onClick={() => this.props.openQuestionTemplateEdit(null)}
                className="fa fa-minus-circle"
                style={{cursor: "pointer"}}/>
            </span>
            <i className="fa fa-edit text-warning" />
            <strong>Editing question {this.props.question.ID}</strong>
            <small> Form</small>
          </CardHeader>
          <CardBody>
            <CardBody>
              <Row>
                <Col xs={12}>
                  <FormGroup>
                    <Label>Tags</Label>
                    <Creatable
                      isMulti
                      isClearable
                      onChange={this.storeTags}
                      defaultValue={EditQuestion.tagsAsOptions(this.props.question.Tags || [])}
                      options={EditQuestion.tagsAsOptions(this.props.tags)}/>
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col xs="12">
                  <FormGroup>
                    <Editor
                      editorStyle={{
                        border: "1px solid #c8ced3"
                      }}
                      toolbar={{
                        options: ['inline', 'blockType', 'fontSize', 'fontFamily', 'list', 'textAlign', 'colorPicker', 'link', 'emoji', 'image', 'remove', 'history'],
                        image: { uploadCallback: this.uploadCallback, previewImage: true }
                      }}
                      onBlur={this.setText}
                      defaultEditorState={EditQuestion.convertInitialContent(this.props.question.Text)}
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
                        checked={this.state.question.Type === 1}
                        onChange={() => this.setType(1)}
                        name="Type"/>
                      {questionTypes[1]}
                    </Label>
                  </FormGroup>
                  <FormGroup check inline>
                    <Label className="form-check-label" check>
                      <Input
                        className="form-check-input"
                        type="radio"
                        checked={this.state.question.Type === 4}
                        onChange={() => this.setType(4)}
                        name="Type"/>
                      {questionTypes[4]}
                    </Label>
                  </FormGroup>
                  <FormGroup check inline>
                    <Label className="form-check-label" check>
                      <Input
                        className="form-check-input"
                        type="radio"
                        checked={this.state.question.Type === 2}
                        onChange={() => this.setType(2)}
                        name="Type" />
                      {questionTypes[2]}
                    </Label>
                  </FormGroup>
                  <FormGroup check inline>
                    <Label className="form-check-label" check>
                      <Input
                        className="form-check-input"
                        type="radio"
                        checked={this.state.question.Type === 3}
                        onChange={() => this.setType(3)}
                        name="Type" />
                      {questionTypes[3]}
                    </Label>
                  </FormGroup>
                </Col>
              </FormGroup>
              {this.state.question.Type === 1 &&
              <CheckboxAnswerTemplate
                removeChoice={this.removeCheckboxChoice}
                addChoice={this.addCheckboxChoice}
                answers={this.state.question.CheckboxAnswerTemplates}/>
              }
              {this.state.question.Type === 2 &&
              <CodeAnswerTemplate
                save={(val) => {this.setState({TextAnswerTemplate: {Text: val}})}}
                value={this.state.question.TextAnswerTemplate ? this.state.question.TextAnswerTemplate.Text : undefined}/>
              }
              {this.state.question.Type === 3 &&
              <FlowDiagramAnswerTemplate />
              }
              {this.state.question.Type === 4 &&
              <RadioAnswerTemplate
                removeChoice={this.removeRadioChoice}
                addChoice={this.addRadioChoice}
                answers={this.state.question.RadioAnswerTemplates}/>
              }
            </CardBody>
          </CardBody>
          <CardFooter>
            <Button
              onClick={this.create}
              type="button"
              size="sm"
              color="primary">
              <i className="fa fa-dot-circle-o" /> Save
            </Button>
          </CardFooter>
        </Form>
      </Card>
    );
  }
}

export default connect(
  state => ({
    question: editedQuestionTemplate(state),
    tags: state.tags.list
  }),
  {updateQuestionTemplate, getQuestionTags, openQuestionTemplateEdit}
)(EditQuestion);
