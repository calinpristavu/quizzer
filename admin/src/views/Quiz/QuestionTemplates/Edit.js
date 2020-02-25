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

class EditQuestion extends Component {
  state = {};

  formRef = React.createRef();

  static propTypes = {
    question: PropTypes.object,
  };

  componentDidMount() {
    this.props.getQuestionTags()
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.question !== this.state) {
      this.setState(nextProps.question)
    }
  };

  static convertInitialContent = (text) => {
    const blocksFromHTML = convertFromHTML(text);

    return EditorState.createWithContent(ContentState.createFromBlockArray(
      blocksFromHTML.contentBlocks,
      blocksFromHTML.entityMap
    ))
  };

  create = () => {
    const question = this.state;

    if (this.state.Type === 4) {
      const correctQIndex = parseInt(this.formRef.current['Answer'].value);
      question.RadioAnswerTemplates.forEach((a, k) => {
        question.RadioAnswerTemplates[k].IsCorrect = k === correctQIndex
      });
    }

    this.props.updateQuestionTemplate(question)
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
                      onBlur={(e, editorState) => this.setState({
                        Text: draftToHtml(convertToRaw(editorState.getCurrentContent()))
                      })}
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
                value={this.state.TextAnswerTemplate ? this.state.TextAnswerTemplate.Text : undefined}/>
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
