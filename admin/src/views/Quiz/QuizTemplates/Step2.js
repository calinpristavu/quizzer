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
import PropTypes from 'prop-types';
import {Map} from 'immutable';
import {connect} from "react-redux";
import {getQuestionTemplates} from "../../../redux/actions";

const defaultWeight = 10;

class Step2 extends Component {
  static propTypes = {
    questionTemplates: PropTypes.instanceOf(Map).isRequired,
    getQuestionTemplates: PropTypes.func.isRequired
  };

  state = {
    selected: {}
  };

  componentDidMount() {
    this.props.getQuestionTemplates();
  };

  getOptions = () => {
    const opts = [];

    this.props.questionTemplates.forEach(q => {
      opts.push({
        value: q.ID,
        label: `# ${q.ID} ${q.Text.substr(0, 100)} ...`
      })
    });

    return opts;
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

    if (!this.props.questionTemplates.has(qId)) {
      return null;
    }

    const questionTemplate = this.props.questionTemplates.get(qId);

    return (
      <div key={qId} className="clearfix" style={{
        padding: "20px",
        margin: "4px 0",
      }}>
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

        <div dangerouslySetInnerHTML={{__html: `#${questionTemplate.ID} ${questionTemplate.Text}`}}/>
      </div>
    )
  };

  render() {
    if (this.props.questionTemplates.size < 1) {
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
          <button onClick={() => this.props.back()}>Back</button>
          <button onClick={() => this.props.advance(this.state.selected)}>Save</button>
        </CardFooter>
      </div>
    );
  }
}

export default connect(
  state => ({
    questionTemplates: state.questionTemplate.list
  }),
  {getQuestionTemplates}
)(Step2);
