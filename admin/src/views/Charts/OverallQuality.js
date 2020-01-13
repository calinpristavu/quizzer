import React, {Component} from 'react';
import {
  Card,
  CardBody,
  CardFooter,
  CardTitle,
  Col,
  Progress,
  Row
} from "reactstrap";
import {Line} from "react-chartjs-2";
import {getStyle, hexToRgba} from "@coreui/coreui/dist/js/coreui-utilities";
import {connect} from "react-redux";
import {getStatAvgResult, getStatBestResult} from "redux/actions";
import {noGraphEntries, selectStatAvgResult, selectStatBestResult} from "redux/selectors";
import {overallQualityOptions} from "views/Charts/chartConfigs";

const brandSuccess = getStyle('--success');
const brandWarning = getStyle('--warning');

class OverallQuality extends Component {
  avgResultDataset = {
    label: 'Average result',
    backgroundColor: hexToRgba(brandWarning, 10),
    borderColor: brandWarning,
    pointHoverBackgroundColor: '#fff',
    borderWidth: 2,
    data: [],
  };

  bestResultDataset = {
    label: 'Best result',
    backgroundColor: 'transparent',
    borderColor: brandSuccess,
    pointHoverBackgroundColor: '#fff',
    borderWidth: 2,
    data: [],
  };

  componentDidMount() {
    this.props.getStatAvgResult();
    this.props.getStatBestResult();
  }

  getData = () => {
    const labels = [];

    for (let i = 0; i < this.props.noGraphEntries; i++) {
      labels.push(this.props.from.clone().add(i, 'days').format('D-M'))
    }

    this.avgResultDataset.data = this.props.avgResult;
    this.bestResultDataset.data = this.props.bestResult;

    return {
      labels: labels,
      datasets: [
        this.avgResultDataset,
        this.bestResultDataset,
      ],
    };
  };

  computeGlobalAverage = () => {
    let avgResult = this.props.avgResult.filter(v => v !== 0);

    return avgResult.reduce((sum, a) => {
      return sum + a
    }, 0) / (avgResult.length || 1)
  };

  render() {
    return (
      <Card>
        <CardBody>
          <CardTitle className="mb-0">Overall Performances</CardTitle>
          <div className="small text-muted">Per day</div>
          <div className="chart-wrapper" style={{ height: 300 + 'px', marginTop: 40 + 'px' }}>
            <Line data={this.getData()} options={overallQualityOptions(100)} height={300} />
          </div>
        </CardBody>
        <CardFooter>
          <Row className="text-center">
            <Col sm={12} md className="mb-sm-2 mb-0">
              <div className="text-muted">Average result</div>
              <strong>{this.computeGlobalAverage().toFixed(2)} %</strong>
              <Progress className="progress-xs mt-2" color="warning" value={this.computeGlobalAverage()} />
            </Col>
            <Col sm={12} md className="mb-sm-2 mb-0">
              <div className="text-muted">Best result</div>
              <strong>{Math.max(...this.props.bestResult).toFixed(2)} %</strong>
              <Progress className="progress-xs mt-2" color="success" value={Math.max(...this.props.bestResult)} />
            </Col>
          </Row>
        </CardFooter>
      </Card>
    )
  }
}

export default connect(
  state => ({
    avgResult: selectStatAvgResult(state),
    bestResult: selectStatBestResult(state),
    noGraphEntries: noGraphEntries,
    from: state.stats.from
  }),
  {getStatAvgResult, getStatBestResult}
)(OverallQuality);
