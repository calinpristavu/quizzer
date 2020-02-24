import {getStyle} from "@coreui/coreui/dist/js/coreui-utilities";
import React, {Component} from 'react';
import {Card, CardBody} from "reactstrap";
import {Line} from "react-chartjs-2";
import {connect} from "react-redux";
import {getQuizTemplates} from "store/actions";
import moment from "moment";
import {quizCountOptions} from "views/Charts/chartConfigs";

const brandInfo = getStyle('--info');

class QuizCountCard extends Component {
  componentDidMount() {
    this.props.getQuizTemplates();
  }

  getData = () => {
    const groupedByDateCreated = [];

    this.props.quizTemplates
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
          label: 'Quizzes',
          backgroundColor: brandInfo,
          borderColor: 'rgba(255,255,255,.55)',
          data: Object.values(groupedByDateCreated),
        },
      ],
    }
  };

  render() {
    return (
      <Card className="text-white bg-info">
        <CardBody className="pb-0">
          <div className="text-value">{this.props.quizTemplates.length}</div>
          <div>Quizzes</div>
        </CardBody>
        <div className="chart-wrapper mx-3" style={{ height: '70px' }}>
          <Line
            data={this.getData()}
            options={quizCountOptions(this.getData().datasets[0].data)}
            height={70} />
        </div>
      </Card>
    )
  }
}

export default connect(
  state => ({
    quizTemplates: state.quizTemplate.list
  }),
  {getQuizTemplates}
)(QuizCountCard);
