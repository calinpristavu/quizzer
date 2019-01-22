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

class CreateStep2 extends Component {
  state = {
    questions: null,
    selected: []
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
      label: q.Text.substr(0, 100) + "..."
    }))
  };

  setSelected = (opt) => {
    this.setState({
      selected: opt.map((e) => e.value)
    })
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
            {this.state.selected.map((opt, k) => (
              <div key={k} className="clearfix" style={{
                padding: "20px",
                margin: "4px 0",
              }}>
                # {this.state.questions[opt].ID}

                <div className="float-right">
                  <InputGroup>
                    <Input
                      min={0}
                      max={50}
                      style={{width: 80}}
                      defaultValue={this.state.questions[opt].Weight || 10}
                      type="number"/>
                    <InputGroupAddon addonType="append">
                      <InputGroupText>%</InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>
                </div>
              </div>
            ))}
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
