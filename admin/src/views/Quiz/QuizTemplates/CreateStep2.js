import {CardBody, CardFooter} from "reactstrap";
import Select from "react-select";
import React, {Component} from "react";

class CreateStep2 extends Component {
  state = {
    options: [],
    selected: []
  };

  componentDidMount() {
    fetch("/question-templates")
      .then((response) => {
        this.setState({
          options: response.map((q) => ({
            value: q.ID,
            label: q.Text
          }))
        })
      })
  };

  setSelected = (opt) => {
    this.setState({
      selected: opt.map((e) => e.value)
    })
  };

  render() {
    return (
      <div>
        <CardBody>
          <Select
            isMulti
            onChange={this.setSelected}
            options={this.state.options}/>
        </CardBody>
        <CardFooter>
          <button onClick={() => this.props.advance(this.state.selected)}>Save</button>
        </CardFooter>
      </div>
    );
  }
}

export default CreateStep2;
