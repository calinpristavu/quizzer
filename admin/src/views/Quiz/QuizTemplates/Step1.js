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
import PropTypes from 'prop-types';

class Step1 extends Component {
  static propTypes = {
    advance: PropTypes.func.isRequired,
    quiz: PropTypes.shape({
      Name: PropTypes.string.isRequired,
      Duration: PropTypes.string.isRequired,
    }).isRequired
  };

  nameRef = React.createRef();
  durationRef = React.createRef();

  save = () => {
    this.props.advance({
      Name: this.nameRef.current.value,
      Duration: Step1.stringToGoDuration(this.durationRef.current.value)
    })
  };

  static stringToGoDuration = (string) => {
    return string === "" ? null : string.replace(":", "h") + 'm0s'
  };

  static stringToHtmlDuration = (string) => {
    return string === null ? '' : string.replace("h", ":").replace('m0s', '')
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
                      innerRef={this.nameRef}
                      type="text"
                      defaultValue={this.props.quiz.Name}
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
                        innerRef={this.durationRef}
                        type="time"
                        min="00:00"
                        max="06:00"
                        style={{maxWidth: "100px", minWidth: "100px"}}
                        step={600}
                        defaultValue={Step1.stringToHtmlDuration(this.props.quiz.Duration)}
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
