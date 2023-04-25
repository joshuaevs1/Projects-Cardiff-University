let ctx = document.getElementById('postChart').getContext('2d');
let labels = ['Fanta -', 'Fanta +', 'Coca-Cola -', 'Coca-Cola +'];
let colorHex = ['#FB3640', '#EFCA08', '#43AA8B', '#253D5B'];

// Display posts difference between two products
// eslint-disable-next-line no-unused-vars
let postChart = new Chart(ctx, {
  type: 'pie',
  data: {
    datasets: [{
      data: [fantaN, fantaP, colaN, colaP],
      backgroundColor: colorHex
    }],
    labels: labels
  },
  options: {
    responsive: true,
    legend: {
      position: 'bottom'
    },
    plugins: {
      datalabels: {
        color: '#fff',
        anchor: 'end',
        align: 'start',
        offset: -10,
        borderWidth: 2,
        borderColor: '#fff',
        borderRadius: 25,
        backgroundColor: (context) => {
          return context.dataset.backgroundColor;
        },
        font: {
          weight: 'bold',
          size: '10'
        },
        formatter: (value) => {
          return value + ' %';
        }
      }
    }
  }
})