import PropTypes from "prop-types";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Collapse,
} from "reactstrap";
import React, {Component} from "react";
import {Pie} from "react-chartjs-2";
import {connect} from "react-redux";
import {openQuestionTemplateView} from "../../../redux/actions";
import {viewedQuestionTemplate} from "../../../redux/selectors";

class View extends Component {
  state = {
    isQuestionTextOpen: true,
  };

  static propTypes = {
    question: PropTypes.shape({
      ID: PropTypes.number.isRequired,
      Text: PropTypes.string.isRequired,
      Usages: PropTypes.arrayOf(PropTypes.shape({
        IsAnswered: PropTypes.bool.isRequired,
        IsCorrect: PropTypes.bool.isRequired,
        Feedback: PropTypes.arrayOf(PropTypes.shape({
          Text: PropTypes.string.isRequired
        })).isRequired,
      })),
    }),
  };

  openQuestionText = () => {
    this.setState((prevState) => ({
      isQuestionTextOpen: !prevState.isQuestionTextOpen
    }))
  };

  getChartData = () => {
    return {
      labels: [
        'Answered correctly',
        'Answered incorrectly',
        'Not answered',
      ],
      datasets: [
        {
          data: this.props.question.Usages.reduce((carry, q) => {
            if (!q.IsAnswered) {
              carry[2]++;

              return carry;
            }

            if (!q.IsCorrect) {
              carry[1]++;

              return carry;
            }

            carry[0]++;
            return carry;
          }, [0, 0, 0]),
          backgroundColor: [
            '#36A2EB',
            '#FF6384',
            '#FFCE56',
          ],
        }],
    }
  };

  render() {
    if (null === this.props.question) {
      return null;
    }

    return (
      <Card>
        <CardHeader>
          <span className="float-right">
            <i
              onClick={() => this.props.openQuestionTemplateView(null)}
              className="fa fa-minus-circle float-right"
              style={{cursor: "pointer"}}/>
          </span>
          <i className="fa fa-eye" />
          #{this.props.question.ID}
          <small> Overview</small>
        </CardHeader>
        <CardBody>
          <Button color="primary" onClick={this.openQuestionText} style={{ marginBottom: '1rem' }}>
            View question text
          </Button>
          <Collapse isOpen={this.state.isQuestionTextOpen}>
            <Card>
              <CardBody dangerouslySetInnerHTML={{__html: this.props.question.Text}}/>
            </Card>
          </Collapse>
          <h3>Total number of answers: {this.props.question.Usages.length}</h3>
          <h4>Out of which:</h4>
          <div className="chart-wrapper">
            <Pie data={this.getChartData()} />
          </div>
          <h4>Reviewer feedback:</h4>
          {this.props.question.Usages.map((q, k) => (
            <div key={k}>
              {q.Feedback.map((f, j) => (
                <div key={j}>{f.Text}</div>
              ))}
            </div>
          ))}
        </CardBody>
      </Card>
    );
  }
}

export default connect(
  state => ({
    question: viewedQuestionTemplate(state)
  }),
  {openQuestionTemplateView}
)(View);
