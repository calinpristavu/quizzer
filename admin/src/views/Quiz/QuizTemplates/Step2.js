import React, {Component} from "react";
import {
  CardBody,
  CardFooter,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
} from "reactstrap";
import Select from "react-select";
import PropTypes from 'prop-types';
import {Map} from 'immutable';
import {connect} from "react-redux";
import {getQuestionTemplates} from "redux/actions";

const defaultWeight = 10;

class Step2 extends Component {
  static propTypes = {
    questionTemplates: PropTypes.instanceOf(Map).isRequired,
    getQuestionTemplates: PropTypes.func.isRequired,
    quiz: PropTypes.shape({
      QuizQuestions: PropTypes.arrayOf(PropTypes.shape({
        QuestionID: PropTypes.number.isRequired,
        Question: PropTypes.shape({
          ID: PropTypes.number.isRequired,
          Text: PropTypes.string.isRequired,
        }),
        Weight: PropTypes.number.isRequired,
      })).isRequired
    }).isRequired
  };

  state = {
    qq: Map()
  };

  componentDidMount() {
    this.props.getQuestionTemplates();
    this.setState({
      qq: Map(this.props.quiz.QuizQuestions.map(qq => [qq.QuestionID, {
        QuestionID: qq.QuestionID,
        Weight: qq.Weight
      }]))
    })
  };

  static getOptions = (questionTemplates) => {
    const opts = [];

    questionTemplates.forEach(q => {
      const label = q.Text
        .replace(/(<([^>]+)>)/ig,"")
        .substr(0, 100);

      opts.push({
        value: q.ID,
        label: `# ${q.ID} ${label} ...`
      })
    });

    return opts;
  };

  setSelected = (opts) => {
    let qqs = this.state.qq;
    const selectedIds = opts.map(opt => opt.value);

    // filter out deleted questions
    const filteredQqs = qqs
      .filter((qq, qId) => selectedIds.find(id => id === qId))
      .asMutable();

    // add new questions with defaultWeight
    opts.forEach(opt => {
      if (filteredQqs.has(opt.value)) {
        return;
      }

      filteredQqs.set(opt.value, {
        QuestionID: opt.value,
        Weight: defaultWeight
      })
    });

    this.setState({
      qq: filteredQqs.asImmutable()
    })
  };

  updateQuestionWeight = (qId, weight) => {
    this.setState(oldState => ({
      qq: oldState.qq.updateIn([qId, 'Weight'], () => parseInt(weight))
    }))
  };

  renderSelected = (qq) => {
    if (!this.props.questionTemplates.has(qq.QuestionID)) {
      return null;
    }

    const questionTemplate = this.props.questionTemplates.get(qq.QuestionID);

    return (
      <div key={questionTemplate.ID} className="clearfix" style={{
        padding: "20px",
        margin: "4px 0",
      }}>
        <div className="float-right">
          <InputGroup>
            <Input
              min={0}
              max={50}
              style={{width: 80}}
              defaultValue={qq.Weight}
              onBlur={(e) => this.updateQuestionWeight(questionTemplate.ID, e.target.value)}
              type="number"/>
            <InputGroupAddon addonType="append">
              <InputGroupText>%</InputGroupText>
            </InputGroupAddon>
          </InputGroup>
        </div>

        <div>
          <h3>
            #{questionTemplate.ID} {questionTemplate.Tags.map((t, k) => (
              <span key={k} className="badge badge-pill badge-info">{t.Text}</span>
            ))}
          </h3>
        </div>
        <div dangerouslySetInnerHTML={{__html: questionTemplate.Text}}/>
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
              defaultValue={Step2.getOptions(this.props.quiz.QuizQuestions.map(qq => qq.Question))}
              options={Step2.getOptions(this.props.questionTemplates)}/>
          </div>
          <div>
            {this.state.qq.valueSeq().map(this.renderSelected)}
          </div>
        </CardBody>
        <CardFooter>
          <button onClick={() => this.props.back()}>Back</button>
          <button onClick={() => this.props.advance(this.state.qq.valueSeq().toArray())}>Save</button>
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
