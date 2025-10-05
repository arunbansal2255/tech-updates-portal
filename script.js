const allNews = [];

async function fetchSeleniumNews() {
  const proxyUrl = "https://selenium-proxy-yourname.workers.dev/"; // Replace with your worker URL

  try {
    const response = await fetch(proxyUrl);
    const html = await response.text();

    // Parse HTML in the browser
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    const articles = doc.querySelectorAll("article");
    articles.forEach((elem) => {
      const titleElem = elem.querySelector("h2 a");
      if (!titleElem) return;

      const title = titleElem.textContent.trim();
      const link = titleElem.href.startsWith("http")
        ? titleElem.href
        : "https://www.selenium.dev" + titleElem.getAttribute("href");
      const snippetElem = elem.querySelector("p");
      const snippet = snippetElem ? snippetElem.textContent.trim() : "";

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
      "<p style='color:red;'>⚠️ Could not load Selenium updates. Try refreshing.</p>";
  }
}

function displayNews(category) {
  const container = document.getElementById("news");
  container.innerHTML = "";

  const filtered = category === "All" ? allNews : allNews.filter(n => n.category === category);

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

document.querySelectorAll(".tab").forEach(btn => {
  btn.addEventListener("click", () => displayNews(btn.dataset.category));
});

// Fetch updates on page load
fetchSeleniumNews();
