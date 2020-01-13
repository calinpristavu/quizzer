import {getStyle} from "@coreui/coreui/dist/js/coreui-utilities";
import React, {Component} from 'react';
import {Card, CardBody} from "reactstrap";
import {Line} from "react-chartjs-2";
import {connect} from "react-redux";
import {getQuestionTemplates} from "redux/actions";
import moment from "moment";
import {questionCountOptions} from "views/Charts/chartConfigs";

const brandPrimary = getStyle('--primary');

class QuestionCountCard extends Component {
  componentDidMount() {
    this.props.getQuestionTemplates();
  }

  getData = () => {
    const groupedByDateCreated = [];

    this.props.questionTemplates
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
          label: 'Question Templates',
          backgroundColor: brandPrimary,
          borderColor: 'rgba(255,255,255,.55)',
          data: Object.values(groupedByDateCreated),
        },
      ],
    }
  };

  render() {
    return (
      <Card className="text-white bg-primary">
        <CardBody className="pb-0">
          <div className="text-value">{this.props.questionTemplates.length}</div>
          <div>Questions</div>
        </CardBody>
        <div className="chart-wrapper mx-3" style={{ height: '70px' }}>
          <Line
            data={this.getData()}
            options={questionCountOptions(this.getData().datasets[0].data)}
            height={70} />
        </div>
      </Card>
    )
  }
}

export default connect(
  state => ({
    questionTemplates: state.questionTemplate.list
  }),
  {getQuestionTemplates}
)(QuestionCountCard);
