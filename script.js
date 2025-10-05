const allNews = [];
const API_KEY = ""; // Optional: YouTube API key (leave empty for now)

async function fetchSeleniumNews() {
  const corsProxy = "https://api.codetabs.com/v1/proxy?quest=";
  const seleniumBlogUrl = "https://www.selenium.dev/blog/";

  try {
    // Fetch the Selenium blog HTML via proxy
    const response = await fetch(`${corsProxy}${seleniumBlogUrl}`);
    if (!response.ok) throw new Error("Failed to fetch Selenium blog");
    const html = await response.text();

    // Load HTML into Cheerio parser
    const $ = cheerio.load(html);

    // Extract articles
    $("article").each((i, elem) => {
      const title = $(elem).find("h2 a").text().trim();
      const linkPath = $(elem).find("h2 a").attr("href") || "";
      const link = linkPath.startsWith("http")
        ? linkPath
        : "https://www.selenium.dev" + linkPath;
      const snippet = $(elem).find("p").first().text().trim();
      const category = categorizeNews(title, snippet);

      allNews.push({ title, link, snippet, category, videoLinks: [] });
    });

    displayNews("All");
  } catch (err) {
    console.error("Error fetching Selenium blog:", err);
    document.getElementById("news").innerHTML = `
      <p style="color:red;">⚠️ Failed to load Selenium updates.<br>
      GitHub Pages may sometimes block public proxies.<br>
      Please refresh or try again later.</p>`;
  }
}

function categorizeNews(title, snippet) {
  const text = (title + " " + snippet).toLowerCase();

  const jobKeywords = ["job", "hiring", "career", "vacancy", "recruit"];
  if (jobKeywords.some(word => text.includes(word))) return "Job";

  const toolKeywords = ["selenium", "tool", "webdriver", "release", "update", "feature"];
  if (toolKeywords.some(word => text.includes(word))) return "Tool";

  return "Trending";
}

function displayNews(category) {
  const container = document.getElementById("news");
  container.innerHTML = "";

  const filtered =
    category === "All"
      ? allNews
      : allNews.filter(item => item.category === category);

  if (filtered.length === 0) {
    container.innerHTML = "<p>No updates found for this category.</p>";
    return;
  }

  filtered.forEach(item => {
    const div = document.createElement("div");
    div.classList.add("news-item");
    let inner = `<a href="${item.link}" target="_blank">${item.title}</a>`;
    inner += `<p>${item.snippet}</p>`;
    if (item.videoLinks.length > 0) {
      item.videoLinks.forEach(v => {
        inner += `<a class="video-link" href="${v}" target="_blank">▶ Related Video</a>`;
      });
    }
    div.innerHTML = inner;
    container.appendChild(div);
  });
}

// Tab event listeners
document.querySelectorAll(".tab").forEach(btn => {
  btn.addEventListener("click", () => {
    displayNews(btn.dataset.category);
  });
});

// Fetch updates on load
fetchSeleniumNews();
