import React, {Component} from "react";
import PropTypes from "prop-types";
import {FormGroup, Input, Label, Table} from "reactstrap";

class CheckboxAnswerTemplate extends Component {
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

  static defaultProps = {
    answers: [],
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
                <i className="fa fa-trash text-danger" onClick={() => this.props.removeChoice(k)}/>
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

export default CheckboxAnswerTemplate;
