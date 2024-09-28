// Data for the graphs
const graph1Data = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May"],
  datasets: [
    {
      label: "Parameter 1",
      data: [10, 20, 30, 40, 50],
      backgroundColor: "rgba(255, 99, 132, 0.2)",
      borderColor: "rgba(255, 99, 132, 1)",
      borderWidth: 1,
    },
  ],
};

const graph2Data = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May"],
  datasets: [
    {
      label: "Parameter 2",
      data: [50, 40, 30, 20, 10],
      backgroundColor: "rgba(54, 162, 235, 0.2)",
      borderColor: "rgba(54, 162, 235, 1)",
      borderWidth: 1,
    },
  ],
};

const graph3Data = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May"],
  datasets: [
    {
      label: "Parameter 3",
      data: [20, 30, 40, 50, 60],
      backgroundColor: "rgba(255, 206, 86, 0.2)",
      borderColor: "rgba(255, 206, 86, 1)",
      borderWidth: 1,
    },
  ],
};

// Create the graphs
const graph1 = document.getElementById("graph1").getContext("2d");
const graph2 = document.getElementById("graph2").getContext("2d");
const graph3 = document.getElementById("graph3").getContext("2d");

new Chart(graph1, {
  type: "line",
  data: graph1Data,
  options: {
    title: {
      display: true,
      text: "Parameter 1",
    },
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
  },
});

new Chart(graph2, {
  type: "bar",
  data: graph2Data,
  options: {
    title: {
      display: true,
      text: "Parameter 2",
    },
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
  },
});

new Chart(graph3, {
  type: "pie",
  data: graph3Data,
  options: {
    title: {
      display: true,
      text: "Parameter 3",
    },
  },
});
