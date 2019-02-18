import {
  CardBody,
  CardFooter,
  Col,
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Label,
  Row
} from "reactstrap";
import React, {Component} from "react";

class Step1 extends Component {
  state = {
    Name: '',
    Duration: ""
  };

  setDuration = (e) => {
    if (e.target.value === "") {
      return this.setState({Duration: ""});
    }

    this.setState({Duration: e.target.value})
  };

  save = () => {
    this.props.advance({
      Name: this.state.Name,
      Duration: this.state.Duration === ""
        ? null
        : this.state.Duration.replace(":", "h") + 'm0s'
    })
  };

  render() {
    return (
      <div>
        <CardBody>
          <FormGroup row>
            <Col md="12">
              <Row>
                <Col xs="12">
                  <FormGroup>
                    <Label>Name</Label>
                    <Input
                      type="text"
                      onChange={(e) => this.setState({Name: e.target.value})}
                      value={this.state.Name}
                      placeholder="Type in the quiz name"
                      required />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col xs="12">
                  <FormGroup>
                    <Label>Time limit</Label>
                    <InputGroup className="float-left">
                      <Input
                        type="time"
                        min="00:00"
                        max="06:00"
                        style={{maxWidth: "100px", minWidth: "100px"}}
                        step={600}
                        onChange={this.setDuration}
                        value={this.state.Duration}
                        />
                      <InputGroupAddon addonType="append">
                        <InputGroupText>hh:mm</InputGroupText>
                      </InputGroupAddon>
                    </InputGroup>
                  </FormGroup>
                </Col>
              </Row>
            </Col>
          </FormGroup>
        </CardBody>
        <CardFooter>
          <button onClick={this.save}>Next ></button>
        </CardFooter>
      </div>
    );
  }
}

export default Step1;
