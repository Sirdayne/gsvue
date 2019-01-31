<template>
<div class="simple-container">
  <div class="main-subtitle"><strong>Appointments'</strong> types</div>
  <div class="cloud-container bar-chart-appointments">
    <div class="chart-bar-appointments-container">
      <canvas id="chart-bar-appointments" width="450" height="200"></canvas>
    </div>
    <div class="chart-appointments-legends">
      <div class="chart-appointments-legend" v-for="(legend, index) in legends" :key="index">
        <span class="color" :style="{background: legend.color}"></span>
        <span>{{ legend.name }}</span>
        <span>{{ legend.number }}</span>
      </div>
    </div>
  </div>
</div>
</template>

<script>

import Chart from 'chart.js'

export default {
  data () {
    return {
      legends: [
        {
          name: 'Implants',
          number: 34,
          color: 'rgb(73, 197, 182)',
        },
        {
          name: 'Veneers',
          number: 23,
          color: 'rgb(97, 97, 97)',
        },
        {
          name: 'Root canal',
          number: 55,
          color: 'rgb(255, 178, 54)',
        },
        {
          name: 'Dentures',
          number: 34,
          color: 'rgb(44, 168, 255)',
        },
        {
          name: 'Whitening',
          number: 55,
          color: 'rgb(255, 54, 54)',
        },
        {
          name: 'Invisalign',
          number: 52,
          color: 'rgb(97, 97, 97)',
        },
        {
          name: 'Crowns',
          number: 90,
          color: 'rgb(151, 68, 190)',
        },
        {
          name: 'New patient',
          number: 90,
          color: 'rgb(24, 24, 24)',
        },
      ],
    }
  },
  mounted() {
    this.drawChart()
  },
  methods: {
    drawChart() {
      new Chart("chart-bar-appointments", {
        type: 'bar',
        data: {
          labels: ["Implants", "Veneers", "Root canal", "Dentures", "Whitening", "Invisalign", "Crowns", "New patient"],
          datasets: [
            {
              label: "Population (millions)",
              backgroundColor: ["rgb(73, 197, 182)","rgb(97, 97, 97)","rgb(255, 178, 54)","rgb(44, 168, 255)","rgb(255, 54, 54)","rgb(97, 97, 97)","rgb(151, 68, 190)", "rgb(24, 24, 24)"],
              data: [34,23,55,34,55,52,90,90]
            }
          ]
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
        }
      });
    }
  }
}

</script>
