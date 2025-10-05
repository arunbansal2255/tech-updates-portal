const allNews = [];
const API_KEY = ""; // Leave blank for now

async function fetchSeleniumNews() {
  // ✅ Safe proxy that works on GitHub Pages
  const corsProxy = "https://api.allorigins.win/raw?url=";
  const seleniumBlogUrl = encodeURIComponent("https://www.selenium.dev/blog/");

  try {
    // Fetch Selenium blog HTML safely
    const response = await fetch(`${corsProxy}${seleniumBlogUrl}`);
    if (!response.ok) throw new Error("Failed to fetch Selenium blog");
    const html = await response.text();

    // Parse HTML using Cheerio
    const $ = cheerio.load(html);

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
    document.getElementById("news").innerHTML =
      "<p style='color:red;'>⚠️ Could not load Selenium updates.<br>Try refreshing again.</p>";
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
    div.innerHTML = inner;
    container.appendChild(div);
  });
}

document.querySelectorAll(".tab").forEach(btn => {
  btn.addEventListener("click", () => {
    displayNews(btn.dataset.category);
  });
});

fetchSeleniumNews();
