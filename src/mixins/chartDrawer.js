import Chart from 'chart.js'
import randomcolor from 'randomcolor'

export default {
  data() {
    return {
      charts: {}
    }
  },
  methods: {
    drawChart(title, htmlId, labels, data, colors) {
      this.charts[htmlId] = new Chart(htmlId, {
        type: "pie",
        data: {
          labels: labels,
          datasets: [{
            label: "Something",
            backgroundColor: colors,
            data: data
          }]
        },
        options: {
          legend: {
            display: false
          },
          title: {
            display: true,
            text: title
          }
        }
      })
    },
    getColor() {
      return randomcolor()
    },
  }
}
