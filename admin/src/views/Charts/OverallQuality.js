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
import {getStatAvgResult, getStatBestResult} from "../../redux/actions";
import {noGraphEntries, selectStatAvgResult, selectStatBestResult} from "../../redux/selectors";
import {overallQualityOptions} from "./chartConfigs";

const brandSuccess = getStyle('--success');
const brandWarning = getStyle('--warning');

class OverallQuality extends Component {
  state = {
    radioSelected: 2,
    datasets: {
      avgResult: {
        label: 'Average result',
        backgroundColor: hexToRgba(brandWarning, 10),
        borderColor: brandWarning,
        pointHoverBackgroundColor: '#fff',
        borderWidth: 2,
        data: [],
      },
      bestResult: {
        label: 'Best result',
        backgroundColor: 'transparent',
        borderColor: brandSuccess,
        pointHoverBackgroundColor: '#fff',
        borderWidth: 2,
        data: [],
      },
    }
  };

  componentDidMount() {
    this.props.getStatAvgResult();
    this.props.getStatBestResult();
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (null === nextProps.results) {
      return null;
    }

    this.setState(oldState => {
      const newDatasets = oldState.datasets;
      newDatasets.avgResult.data = nextProps.avgResult;
      newDatasets.bestResult.data = nextProps.bestResult;

      return {
        datasets: newDatasets
      };
    })
  }

  getData = () => {
    const labels = [];

    for (let i = 0; i < this.props.noGraphEntries; i++) {
      labels.push(this.props.from.clone().add(i, 'days').format('D-M'))
    }

    return {
      labels: labels,
      datasets: [
        this.state.datasets.avgResult,
        this.state.datasets.bestResult,
      ],
    };
  };

  computeGlobalAverage = () => {
    return this.props.avgResult.reduce((sum, a) => {
      return sum + a
    }, 0) / (this.props.avgResult.length || 1)
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
