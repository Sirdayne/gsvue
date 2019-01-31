<template>
<div class="simple-container">
  <div class="main-subtitle"><strong>Appointments</strong> & Scheduled Appointments</div>
  <div class="cloud-container" style="padding: 30px;">
    <canvas id="chart-appointments" width="800" height="100"></canvas>
  </div>
</div>
</template>

<script>

import Chart from 'chart.js'

export default {
  data () {
    return {
      fullLabels: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
      labels: ["August", "September", "October", "November", "December", "January"]
    }
  },
  mounted() {
    this.drawChart()
  },
  methods: {
    drawChart() {
      new Chart("chart-appointments", {
        type: 'line',
        data: {
          labels: this.labels,
          datasets: [{
            data: [12,31,22,11,69,37],
            label: "Appointments",
            borderColor: 'rgb(108, 119, 135)',
            fill: false
          }, {
            data: [12,39,51,34,73,42],
            label: "Scheduled Appointments",
            borderColor: 'rgb(135, 144, 157)',
            fill: false
          }]
        },
        options: {
          responsive: true,
          legend: {
            display: false
          },
          title:{
            display: false,
            text:'Appointments chart'
          },
          tooltips: {
            mode: 'index',
            intersect: false,
          },
          hover: {
            mode: 'nearest',
            intersect: true
          },
          scales: {
            xAxes: [{
              gridLines: {
                display: false,
              }
            }]
          }
        }
      });
    }
  }
}

</script>
