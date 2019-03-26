import {
  Table,
  FormGroup,
  Label,
  Input,
} from "reactstrap";
import React, {Component} from "react";
import PropTypes from 'prop-types';

export class CheckboxAnswerTemplates extends Component {
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

  addAndNext = () => {
    this.props.addChoice(this.state);

    this.setState(this.defaultState);
  };

  addOption = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      this.setState({Text: e.target.value}, this.addAndNext)
    }
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
                    value={this.state.Text}
                    autoFocus={true}
                    onChange={(e) => this.setState({Text: e.target.value})}
                    onKeyPress={this.addOption}
                    placeholder="Type in the answer text"
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
                    onKeyPress={(e) => e.key === 'Enter' && this.addAndNext()}
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

export class RadioAnswerTemplates extends Component {
  state = {
    Text: '',
    IsCorrect: false
  };

  optionTextRef = React.createRef();

  static propTypes = {
    addChoice: PropTypes.func,
    setCorrect: PropTypes.func,
    removeChoice: PropTypes.func,
    answers: PropTypes.arrayOf(PropTypes.object),
  };

  addAndNext = () => {
    this.props.addChoice(this.state);

    this.optionTextRef.current.value = '';
  };

  addOption = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      this.setState({Text: e.target.value}, this.addAndNext)
    }
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
              <td>
                <FormGroup check inline>
                  <Label className="form-check-label" check>
                    <Input
                      className="form-check-input"
                      type="radio"
                      defaultChecked={answer.IsCorrect}
                      value={k}
                      name="Answer" />
                  </Label>
                </FormGroup>
              </td>
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
                    autoFocus={true}
                    onBlur={(e) => this.setState({Text: e.target.value})}
                    onKeyPress={this.addOption}
                    innerRef={this.optionTextRef}
                    placeholder="Type in the answer text"
                    required />
                </Label>
              </FormGroup>
            </td>
            <td />
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
      <div />
    );
  }
}
