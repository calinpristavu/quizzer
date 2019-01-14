import PropTypes from "prop-types";
import {
  Card,
  CardBody,
  CardHeader,
} from "reactstrap";
import React, {Component} from "react";
import {Pie} from "react-chartjs-2";

class View extends Component {
  static propTypes = {
    question: PropTypes.shape({
      ID: PropTypes.number.isRequired,
      Text: PropTypes.string.isRequired,
      Usages: PropTypes.arrayOf(PropTypes.shape({
        IsAnswered: PropTypes.bool.isRequired,
        IsCorrect: PropTypes.bool.isRequired,
      })).isRequired,
    }),
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
    return (
      <Card>
        <CardHeader>
          <i className="fa fa-edit text-warning" />
          <strong>{this.props.question.Text}</strong>
          <small> Overview</small>
        </CardHeader>
        <CardBody>
          <h2>Total number of answers: {this.props.question.Usages.length}</h2>
          <h3>Out of which:</h3>
          <div className="chart-wrapper">
            <Pie data={this.getChartData()} />
          </div>
        </CardBody>
      </Card>
    );
  }
}

export default View;
