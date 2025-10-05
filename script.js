let allNews = [];

async function fetchNews() {
  try {
    const response = await fetch("selenium-news.json");
    allNews = await response.json();
    displayNews("All");
  } catch (err) {
    console.error("Failed to load JSON:", err);
    document.getElementById("news").innerHTML = "<p style='color:red;'>⚠️ Could not load news.</p>";
  }
}

function displayNews(category) {
  const container = document.getElementById("news");
  container.innerHTML = "";

  const filtered = category === "All"
    ? allNews
    : allNews.filter(item => item.category === category);

  if (filtered.length === 0) {
    container.innerHTML = "<p>No updates found for this category.</p>";
    return;
  }

  filtered.forEach(item => {
    const div = document.createElement("div");
    div.classList.add("news-item");
    div.innerHTML = `<a href="${item.link}" target="_blank">${item.title}</a><p>${item.snippet}</p>`;
    container.appendChild(div);
  });
}

// Category buttons
document.querySelectorAll(".tab").forEach(btn => {
  btn.addEventListener("click", () => displayNews(btn.dataset.category));
});

// Load news on page load
fetchNews();
