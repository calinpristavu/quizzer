import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Col, FormGroup, Input, InputGroup, InputGroupAddon, InputGroupText} from "reactstrap";
import {connect} from "react-redux";
import {setQuestionScore} from "../../../redux/actions";

class FlowDiagramQuestion extends Component {
  static propTypes = {
    question: PropTypes.shape({
      ID: PropTypes.number.isRequired,
      Text: PropTypes.string.isRequired,
      FlowDiagramAnswer: PropTypes.shape({
        SVG: PropTypes.string.isRequired
      }).isRequired,
      Score: PropTypes.number.isRequired,
    }).isRequired
  };

  state = {
    Score: 0
  };

  componentWillReceiveProps(nextProps, nextContext) {
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
        <div>
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
                    type="number"/>
                </InputGroup>
              </Col>
            </FormGroup>
          </div>
          <h3>{this.props.question.Text}</h3>
        </div>
        <div dangerouslySetInnerHTML={{__html: this.props.question.FlowDiagramAnswer.SVG}} />
      </div>
    );
  }
}

export default connect(
  null,
  {setQuestionScore}
)(FlowDiagramQuestion);
