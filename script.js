const allNews = [];
const API_KEY = ""; // Optional: add YouTube API key later

async function fetchSeleniumNews() {
  const corsProxy = "https://api.allorigins.win/get?url=";
  const seleniumBlogUrl = encodeURIComponent("https://www.selenium.dev/blog/");

  try {
    const response = await fetch(`${corsProxy}${seleniumBlogUrl}`);
    const data = await response.json();
    const $ = cheerio.load(data.contents);

    $("article").each((i, elem) => {
      const title = $(elem).find("h2 a").text().trim();
      const link = "https://www.selenium.dev" + $(elem).find("h2 a").attr("href");
      const snippet = $(elem).find("p").first().text().trim();
      const category = categorizeNews(title, snippet);

      allNews.push({ title, link, snippet, category, videoLinks: [] });
    });

    displayNews("All");
  } catch (err) {
    console.error("Error fetching Selenium blog:", err);
    document.getElementById("news").i
