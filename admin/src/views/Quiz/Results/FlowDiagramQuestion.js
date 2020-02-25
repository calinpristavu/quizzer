import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Col, FormGroup, Input, InputGroup, InputGroupAddon, InputGroupText, Row} from "reactstrap";
import {connect} from "react-redux";
import {setQuestionNote, setQuestionScore} from "store/actions";
import {FlowDiagramTip} from "views/Base/Tooltips/ResultTooltips";
import Question from "entities/Question";

class FlowDiagramQuestion extends Component {
  static propTypes = {
    question: PropTypes.instanceOf(Question).isRequired,
    disabled: PropTypes.bool.isRequired
  };

  static defaultProps = {
    disabled: false
  };

  state = {
    Score: 0
  };

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.question !== undefined) {
      this.setState({
        Score: this.props.question.Score
      })
    }
  }

  getColor = () => {
    const score = this.state.Score || this.props.question.Score;

    if (score < 20) {
      return '#FF0000';
    }

    if (score < 40) {
      return '#ff9f00';
    }

    if (score < 60) {
      return '#FFFF00';
    }

    if (score < 80) {
      return '#00FF00';
    }

    return '#4DBD74';
  };

  render() {
    return (
      <div>
        <Row>
          <Col>
            <div className="float-right">
              <FormGroup row>
                <Col md="12">
                  <InputGroup>
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText style={{backgroundColor: this.getColor()}}>
                        <i className="fa fa-check" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      min={0}
                      max={100}
                      style={{width: 80}}
                      onChange={(e) => this.setState({Score: parseInt(e.target.value)})}
                      onBlur={() => this.props.setQuestionScore(this.props.question, this.state.Score)}
                      defaultValue={this.props.question.Score}
                      type="number"
                      disabled={this.props.disabled}/>
                  </InputGroup>
                </Col>
              </FormGroup>
            </div>
            <div className="clearfix">
              <FlowDiagramTip id={this.props.question.ID}/>
              <span dangerouslySetInnerHTML={{__html: this.props.question.Text}} />
            </div>
          </Col>
        </Row>
        <Row>
          <Col className="text-center" dangerouslySetInnerHTML={{__html: this.props.question.FlowDiagramAnswer.SVG}} />
        </Row>
        <FormGroup row>
          <Col xs="12" md="12">
            <Input
              type="textarea"
              rows="9"
              defaultValue={this.props.question.Notes}
              onBlur={(e) => this.props.setQuestionNote(this.props.question, e.target.value)}
              placeholder="Notable things about the answer..." />
          </Col>
        </FormGroup>
      </div>
    );
  }
}

export default connect(
  null,
  {setQuestionScore, setQuestionNote}
)(FlowDiagramQuestion);
