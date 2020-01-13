import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {AppSwitch} from "@coreui/react";
import {ListGroup, ListGroupItem} from "reactstrap";
import {connect} from "react-redux";
import {setQuestionScore} from "redux/actions";
import {CheckboxTip} from "views/Base/Tooltips/ResultTooltips";

class CheckboxQuestion extends Component {
  static propTypes = {
    question: PropTypes.shape({
      ID: PropTypes.number.isRequired,
      Text: PropTypes.string.isRequired,
      CheckboxAnswers: PropTypes.arrayOf(PropTypes.shape({
        Text: PropTypes.string.isRequired,
        IsCorrect: PropTypes.bool.isRequired,
        IsSelected: PropTypes.bool.isRequired,
      })).isRequired,
      Score: PropTypes.number.isRequired,
    }).isRequired,
    disabled: PropTypes.bool.isRequired
  };

  static defaultProps = {
    disabled: false
  };

  state = {
    Score: 0
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.question !== undefined) {
      this.setState({
        Score: this.props.question.Score
      })
    }
  }

  setScore = (e) => {
    this.props.setQuestionScore(
      this.props.question,
      e.target.checked ? 100 : 0
    );

    this.setState({
      Score: e.target.checked ? 100 : 0
    });
  };

  renderChoice = (a, i) => {
    let color = "inherit";

    if (a.IsCorrect && a.IsSelected) {
      color = "#4DBD74"
    }

    if (a.IsCorrect && !a.IsSelected) {
      color = "#4DBD74"
    }

    if (!a.IsCorrect && a.IsSelected) {
      color = "#FF0000"
    }

    return (
      <ListGroupItem
        style={{color: color}}
        key={i}>
        {a.IsSelected
          ? <i className="far fa-check-square" />
          : <i className="far fa-square" />
        }
        {' ' + a.Text}
      </ListGroupItem>
    );
  };

  render() {
    return (
      <div>
        <div>
          <div className="float-right">
            <AppSwitch
              className={'mx-1'}
              color={'success'}
              outline={'alt'}
              defaultChecked={this.props.question.Score === 100}
              onChange={this.setScore}
              size={'lg'}
              label
              dataOn={'\u2713'}
              dataOff={'\u2715'}
              disabled={this.props.disabled}/>
          </div>
          <div className="clearfix">
            <CheckboxTip id={this.props.question.ID}/>
            <span dangerouslySetInnerHTML={{__html: this.props.question.Text}} />
          </div>
        </div>
        <div>
          <ListGroup>
            {this.props.question.CheckboxAnswers.map(this.renderChoice)}
          </ListGroup>
        </div>
      </div>
    );
  }
}

export default connect(
  null,
  {setQuestionScore}
)(CheckboxQuestion);
