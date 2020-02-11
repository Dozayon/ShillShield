// Get the requested username
const url = new URL(window.location.href);
const username = url.searchParams.get('u');

const detailPromise = browser.runtime.sendMessage({
  type: 'userDetail',
  username: username
});

const Graph = Vue.component('graph', {
  extends: VueChartJs.Line,
  mixins: [VueChartJs.mixins.reactiveData],
  props: ['type', 'smooth', 'cumulative'],
  data: () => ({
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      }
    }
  }),
  async mounted () {
    this.$watch(
      'smooth',
      function () {
        this.updateGraph();
      }
    )

    this.$watch(
      'cumulative',
      function () {
        this.updateGraph();
      }
    )

    await this.updateGraph();
  },
  methods: {
    updateGraph: async function () {
      const data = await detailPromise;

      var dateCommentMap = data.dateCommentMap;
      var datePostMap = data.datePostMap;

      // Draw the chart
      this.chartData = {};

      const dataset = {};

      if (this.type == 'comment-count') {
        this.chartData.labels = Object.keys(dateCommentMap);
        dataset.label = '# of comments';
        dataset.backgroundColor = '#E1974C'; // orange
        dataset.data = Object.values(dateCommentMap).map(x => x.count);
      }
      else if (this.type == 'comment-score') {
        this.chartData.labels = Object.keys(dateCommentMap);
        dataset.label = 'Comment score';
        dataset.backgroundColor = '#c88137'; // orange
        dataset.data = Object.values(dateCommentMap).map(x => x.score);
      }
      else if (this.type == 'post-count') {
        this.chartData.labels = Object.keys(datePostMap);
        dataset.label = '# of posts';
        dataset.backgroundColor = '#7292CB'; // blue
        dataset.data = Object.values(datePostMap).map(x => x.count);
      }
      else if (this.type == 'post-score') {
        this.chartData.labels = Object.keys(datePostMap);
        dataset.label = 'Post score';
        dataset.backgroundColor = '#5172a9'; // blue
        dataset.data = Object.values(datePostMap).map(x => x.score);
      }

      this.chartData.datasets = [dataset];

      this.renderChart(this.chartData, this.options);
    }
  }
});
