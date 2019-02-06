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

class CreateStep1 extends Component {
  state = {
    Name: '',
    Duration: null
  };

  setDuration = (e) => {
    if (e.target.value === "") {
      return this.setState({Duration: null});
    }

    this.setState({Duration: e.target.value.replace(":", "h") + 'm0s'})
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
                      onBlur={(e) => this.setState({Name: e.target.value})}
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
                        onBlur={this.setDuration}
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
          <button onClick={() => this.props.advance(this.state)}>Next ></button>
        </CardFooter>
      </div>
    );
  }
}

export default CreateStep1;
