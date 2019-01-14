import React, {Component} from 'react';
import {Card, CardBody} from "reactstrap";
import {Bar} from "react-chartjs-2";
import {connect} from "react-redux";
import {getQuizzes} from "../../redux/actions";
import moment from "moment";
import {totalInProgressOptions} from "./chartConfigs";

class TotalInProgressCard extends Component {
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
          backgroundColor: 'rgba(255,255,255,.3)',
          borderColor: 'transparent',
          data: Object.values(groupedByDateCreated),
        },
      ],
    }
  };

  render() {
    return (
      <Card className="text-white bg-danger">
        <CardBody className="pb-0">
          <div className="text-value">{this.props.quizzes.length}</div>
          <div>In Progress Quizzes</div>
        </CardBody>
        <div className="chart-wrapper mx-3" style={{ height: '70px' }}>
          <Bar
            data={this.getData()}
            options={totalInProgressOptions(this.getData().datasets[0].data)}
            height={70} />
        </div>
      </Card>
    )
  }
}

export default connect(
  state => ({
    // TODO: move me to selector
    quizzes: state.quiz.list.filter(quiz => !quiz.Questions.some(question => !question.isAnswered))
  }),
  {getQuizzes}
)(TotalInProgressCard);
