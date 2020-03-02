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
import QuizTemplate from "entities/QuizTemplate";

class Step1 extends Component {
  static propTypes = {
    advance: PropTypes.func.isRequired,
    quiz: PropTypes.instanceOf(QuizTemplate).isRequired
  };

  enabledRef = React.createRef();
  nameRef = React.createRef();
  durationRef = React.createRef();

  save = () => {
    this.props.advance({
      Enabled: this.enabledRef.current.checked,
      Name: this.nameRef.current.value,
      Duration: Step1.stringToGoDuration(this.durationRef.current.value)
    })
  };

  static stringToGoDuration = (string) => {
    return string === "" ? null : string.replace(":", "h") + 'm0s'
  };

  static stringToHtmlDuration = (string) => {
    if (string === null) {
      return '';
    }

    let [hh, mm] = string.replace('m0s', '').split('h');

    if (hh < 10) {
      hh = '0' + hh
    }

    if (mm < 10) {
      mm += '0'
    }

    return hh + ":" + mm
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
                  <FormGroup check>
                    <Label check>
                      <Input
                        innerRef={this.enabledRef}
                        type="checkbox"
                        defaultChecked={this.props.quiz.Enabled}/>
                      Enabled
                    </Label>
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
