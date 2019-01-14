import {CustomTooltips} from "@coreui/coreui-plugin-chartjs-custom-tooltips";

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
