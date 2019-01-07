import {CardBody, CardFooter, Col, FormGroup, Input, Label, Row} from "reactstrap";
import React, {Component} from "react";

class CreateStep1 extends Component {
  state = {
    Name: ''
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
                      value={this.state.Name}
                      onChange={(e) => this.setState({Name: e.target.value})}
                      placeholder="Type in the quiz name"
                      required />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col xs="12">
                  <Label>Quiz Presets (WIP)</Label>
                  <div>
                    <FormGroup check inline>
                      <Input className="form-check-input" type="radio" id="quiz-type-1" name="inline-radios" value="option1" />
                      <Label className="form-check-label" check htmlFor="quiz-type-1">One</Label>
                    </FormGroup>
                    <FormGroup check inline>
                      <Input className="form-check-input" type="radio" id="quiz-type-2" name="inline-radios" value="option2" />
                      <Label className="form-check-label" check htmlFor="quiz-type-2">Two</Label>
                    </FormGroup>
                    <FormGroup check inline>
                      <Input className="form-check-input" type="radio" id="quiz-type-3" name="inline-radios" value="option3" />
                      <Label className="form-check-label" check htmlFor="quiz-type-3">Three</Label>
                    </FormGroup>
                  </div>
                </Col>
              </Row>
            </Col>
          </FormGroup>
        </CardBody>
        <CardFooter>
          <button onClick={() => this.props.advance(this.state.Name)}>Next ></button>
        </CardFooter>
      </div>
    );
  }
}

export default CreateStep1;
