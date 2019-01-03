import {
  Table,
  FormGroup,
  Label,
  Input,
} from "reactstrap";
import React, {Component} from "react";
import PropTypes from 'prop-types';

export class ChoiceAnswerTemplates extends Component {
  defaultState = {
    Text: '',
    IsCorrect: false
  };

  state = this.defaultState;

  static propTypes = {
    addChoice: PropTypes.func,
    removeChoice: PropTypes.func,
    answers: PropTypes.arrayOf(PropTypes.object),
  };

  textInputRefName = 'question-option-add-text';

  addAndNext = () => {
    this.props.addChoice(this.state);

    this.setState(this.defaultState);
  };

  render() {
    return (
      <div>
        <Table responsive>
          <thead>
          <tr>
            <th>Text</th>
            <th>Is Correct?</th>
            <th />
          </tr>
          </thead>
          <tbody>
          {this.props.answers.map((answer, k) =>
            <tr key={k}>
              <td>{answer.Text}</td>
              <td>{answer.IsCorrect ? 'true' : 'false'}</td>
              <td>
                <i className="fa fa-minus-circle text-danger" onClick={() => this.props.removeChoice(k)}/>
              </td>
            </tr>
          )}
          <tr>
            <td>
              <FormGroup>
                <Label htmlFor="question-text">
                  <Input
                    type="text"
                    ref={this.textInputRefName}
                    value={this.state.Text}
                    autoFocus={true}
                    onChange={(e) => this.setState({Text: e.target.value})}
                    placeholder="Type in the question text"
                    required />
                </Label>
              </FormGroup>
            </td>
            <td>
              <FormGroup check inline>
                <Label className="form-check-label" check>
                  <Input
                    className="form-check-input"
                    type="checkbox"
                    checked={this.state.IsCorrect}
                    onChange={(e) => this.setState({IsCorrect: e.target.checked})}
                    name="Type" />
                </Label>
              </FormGroup>
            </td>
            <td>
              <i className="fa fa-plus-circle text-success" onClick={this.addAndNext} />
            </td>
          </tr>
          </tbody>
        </Table>
      </div>
    );
  }
}

export class FlowDiagramAnswer extends Component {
  render() {
    return (
      <div>
        add diagram answer here
      </div>
    );
  }
}
