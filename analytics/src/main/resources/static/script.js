let articleData = [], searchData = [], contributorData = [];
let articleChart, searchChart, contributorChart;

document.addEventListener("DOMContentLoaded", () => {
  fetchArticleCounts();
  fetchSearchStats();
  fetchContributorStats();
  updateDateTime();
  setInterval(updateDateTime, 1000);

});

function updateDateTime() {
  document.getElementById("datetime").textContent = new Date().toLocaleString();
}

function showSection(section) {
  ['articleSection', 'searchSection', 'contributorSection'].forEach(id => {
    const el = document.getElementById(id);
    if (id === section + 'Section') {
      el.classList.add('show');
    } else {
      el.classList.remove('show');
    }
  });

  if (section === 'article') generateArticleChart();
  if (section === 'search') generateSearchChart();
  if (section === 'contributor') generateContributorChart();
}

function fetchWithLoader(url, callback) {
  document.getElementById("loader").style.display = 'block';
  fetch(url)
    .then(res => res.json())
    .then(data => {
      document.getElementById("loader").style.display = 'none';
      callback(data);
    })
    .catch(err => {
      console.error("Fetch error", err);
      document.getElementById("loader").style.display = 'none';
    });
}

function fetchArticleCounts() {
  fetchWithLoader('/api/activity/article-action-count', data => {
    articleData = data;
    let html = "<table><tr><th>Article ID</th><th>Action</th><th>Count</th></tr>";
    data.forEach(item => {
      html += `<tr><td>${item.articleId}</td><td>${item.actionType}</td><td>${item.count}</td></tr>`;
    });
    html += "</table>";
    document.getElementById("articleCounts").innerHTML = html;
  });
}

function fetchSearchStats() {
  fetchWithLoader('/api/activity/popular-searches', data => {
    searchData = data;
    let html = "<table><tr><th>Search Query</th><th>Count</th></tr>";
    data.forEach(item => {
      html += `<tr><td>${item.searchQuery}</td><td>${item.count}</td></tr>`;
    });
    html += "</table>";
    document.getElementById("searchStats").innerHTML = html;
  });
}

function fetchContributorStats() {
  fetchWithLoader('/api/activity/contributor-stats', data => {
    contributorData = data;
    let html = "<table><tr><th>User ID</th><th>Total Actions</th></tr>";
    data.forEach(item => {
      html += `<tr><td>${item.userId}</td><td>${item.totalActions}</td></tr>`;
    });
    html += "</table>";
    document.getElementById("contributorStats").innerHTML = html;
  });
}

function generateArticleChart() {
  const ctx = document.getElementById("articleChart").getContext("2d");
  const labels = articleData.map(item => `${item.articleId} (${item.actionType})`);
  const counts = articleData.map(item => item.count);
  if (articleChart) articleChart.destroy();
  articleChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Article Actions',
        data: counts,
        backgroundColor: '#FF1694'
      }]
    },
    options: { responsive: true }
  });
}

function generateSearchChart() {
  const ctx = document.getElementById("searchChart").getContext("2d");
  const labels = searchData.map(item => item.searchQuery);
  const counts = searchData.map(item => item.count);
  if (searchChart) searchChart.destroy();
  searchChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: labels,
      datasets: [{
        data: counts,
        backgroundColor: generateColorPalette(labels.length)
      }]
    },
    options: { responsive: true }
  });
}

function generateContributorChart() {
  const ctx = document.getElementById("contributorChart").getContext("2d");
  const labels = contributorData.map(item => item.userId);
  const counts = contributorData.map(item => item.totalActions);
  if (contributorChart) contributorChart.destroy();
  contributorChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Contributions',
        data: counts,
        borderColor: '#FF8800',
        backgroundColor: 'transparent',
        fill: false,
        pointBackgroundColor: '#f0f0f0'
      }]
    },
    options: { responsive: true }
  });
}

function generateColorPalette(n) {
  const colors = [];
  for (let i = 0; i < n; i++) {
    colors.push(`#${Math.floor(Math.random()*16777215).toString(16)}`);
  }
  return colors;
}

function updateChartColors() {
  [articleChart, searchChart, contributorChart].forEach(chart => {
    if (chart) chart.update();
  });
}
