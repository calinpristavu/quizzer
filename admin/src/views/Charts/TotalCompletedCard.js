import React, {Component} from 'react';
import {Card, CardBody} from "reactstrap";
import {Line} from "react-chartjs-2";
import {connect} from "react-redux";
import {getQuizzes} from "../../redux/actions";
import moment from "moment";
import {totalCompletedOptions} from "./chartConfigs";

class TotalCompletedCard extends Component {
  componentDidMount() {
    this.props.getQuizzes();
  }

  getData = () => {
    const groupedByDateCreated = [];

    this.props.quizzes
      .reverse()
      .forEach(qt => {
        let createdAt = moment(qt.CreatedAt).format("Y M");

        if (groupedByDateCreated[createdAt] === undefined) {
          groupedByDateCreated[createdAt] = 0;
        }

        groupedByDateCreated[createdAt]++;
      });

    return {
      labels: Object.keys(groupedByDateCreated),
      datasets: [
        {
          label: 'Quiz Templates',
          backgroundColor: 'rgba(255,255,255,.2)',
          borderColor: 'rgba(255,255,255,.55)',
          data: Object.values(groupedByDateCreated),
        },
      ],
    }
  };

  render() {
    return (
      <Card className="text-white bg-warning">
        <CardBody className="pb-0">
          <div className="text-value">{this.props.quizzes.length}</div>
          <div>Completed Quizzes</div>
        </CardBody>
        <div className="chart-wrapper mx-3" style={{ height: '70px' }}>
          <Line
            data={this.getData()}
            options={totalCompletedOptions(this.getData().datasets[0].data)}
            height={70} />
        </div>
      </Card>
    )
  }
}

export default connect(
  state => ({
    quizzes: state.quiz.list
  }),
  {getQuizzes}
)(TotalCompletedCard);
