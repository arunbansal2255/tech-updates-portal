let allNews = [];

async function fetchSeleniumNews() {
  // ✅ Replace this URL with YOUR deployed Cloudflare Worker URL
  const proxyUrl = "https://selenium-proxy-yourname.workers.dev/";

  try {
    // Add cache-busting query to avoid stale browser cache
    const response = await fetch(`${proxyUrl}?t=${Date.now()}`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const html = await response.text();

    // Parse HTML in the browser using DOMParser
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    const articles = doc.querySelectorAll("article");
    allNews = []; // Reset

    articles.forEach((elem) => {
      const titleElem = elem.querySelector("h2 a");
      if (!titleElem) return;

      const title = titleElem.textContent.trim();
      const link = titleElem.href.startsWith("http")
        ? titleElem.href
        : "https://www.selenium.dev" + titleElem.getAttribute("href");

      const snippetElem = elem.querySelector("p");
      const snippet = snippetElem ? snippetElem.textContent.trim() : "";

      // Categorize news
      let category = "Trending";
      const text = (title + " " + snippet).toLowerCase();
      if (["job","hiring","career","vacancy","recruit"].some(k => text.includes(k))) category = "Job";
      else if (["selenium","tool","webdriver","release","update","feature"].some(k => text.includes(k))) category = "Tool";

      allNews.push({ title, link, snippet, category });
    });

    displayNews("All");
  } catch (err) {
    console.error("Error fetching Selenium blog:", err);
    document.getElementById("news").innerHTML =
      `<p style='color:red;'>⚠️ Could not load Selenium updates. ${err}</p>`;
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

// Fetch news on page load
fetchSeleniumNews();
