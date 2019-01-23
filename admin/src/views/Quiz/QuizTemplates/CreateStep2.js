import {
  CardBody,
  CardFooter,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
} from "reactstrap";
import Select from "react-select";
import React, {Component} from "react";

const defaultWeight = 10;

class CreateStep2 extends Component {
  state = {
    questions: null,
    selected: {}
  };

  componentDidMount() {
    fetch("/question-templates")
      .then((response) => {
        const groupedQs = response.reduce((map, q) => {
          map[q.ID] = q;
          return map;
        }, {});

        this.setState({
          questions: Object.entries(groupedQs).length === 0 ? null : groupedQs
        })
      })
  };

  getOptions = () => {
    return Object.values(this.state.questions).map((q) => ({
      value: q.ID,
      label: `# ${q.ID} ${q.Text.substr(0, 100)} ...`
    }))
  };

  setSelected = (opt) => {
    this.setState(oldState => {
      opt.forEach((e) => {
        oldState.selected[e.value] = defaultWeight;
      });

      return {
        selected: {...oldState.selected}
      }
    })
  };

  updateQuestionWeight = (qId, weight) => {
    this.setState(oldState => {
      oldState.selected[qId] = parseInt(weight);

      return {
        selected: {...oldState.selected}
      }
    })
  };

  renderSelected = (qId) => {
    qId = parseInt(qId);

    return (
      <div key={qId} className="clearfix" style={{
        padding: "20px",
        margin: "4px 0",
      }}>
        {`#${this.state.questions[qId].ID} ${this.state.questions[qId].Text}`}

        <div className="float-right">
          <InputGroup>
            <Input
              min={0}
              max={50}
              style={{width: 80}}
              defaultValue={this.state.selected[qId]}
              onBlur={(e) => this.updateQuestionWeight(qId, e.target.value)}
              type="number"/>
            <InputGroupAddon addonType="append">
              <InputGroupText>%</InputGroupText>
            </InputGroupAddon>
          </InputGroup>
        </div>
      </div>
    )
  };

  render() {
    if (this.state.questions === null) {
      return null;
    }

    return (
      <div>
        <CardBody>
          <div>
            <Select
              isMulti
              onChange={this.setSelected}
              options={this.getOptions()}/>
          </div>
          <div>
            {Object.entries(this.state.selected).map(this.renderSelected)}
          </div>
        </CardBody>
        <CardFooter>
          <button onClick={() => this.props.advance(this.state.selected)}>Save</button>
        </CardFooter>
      </div>
    );
  }
}

export default CreateStep2;
