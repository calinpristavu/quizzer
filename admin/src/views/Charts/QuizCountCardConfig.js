import {getStyle} from "@coreui/coreui/dist/js/coreui-utilities";
import {CustomTooltips} from "@coreui/coreui-plugin-chartjs-custom-tooltips";
import React, {Component} from 'react';
import {Card, CardBody} from "reactstrap";
import {Line} from "react-chartjs-2";
import {connect} from "react-redux";
import {getQuizTemplates} from "../../redux/actions";

export function config(data) {
  return {
    tooltips: {
      enabled: false,
      custom: CustomTooltips
    },
    maintainAspectRatio: false,
    legend: {
      display: false,
    },
    scales: {
      xAxes: [
        {
          gridLines: {
            color: 'transparent',
            zeroLineColor: 'transparent',
          },
          ticks: {
            fontSize: 2,
            fontColor: 'transparent',
          },

        }],
      yAxes: [
        {
          display: false,
          ticks: {
            display: false,
            min: Math.min.apply(Math, data) - 5,
            max: Math.max.apply(Math, data) + 5,
          },
        }],
    },
    elements: {
      line: {
        tension: 0.00001,
        borderWidth: 1,
      },
      point: {
        radius: 4,
        hitRadius: 10,
        hoverRadius: 4,
      },
    },
  };
}
