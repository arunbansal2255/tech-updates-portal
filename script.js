let allNews = [];

async function fetchSeleniumNews() {
    const proxy = "https://api.allorigins.win/get?url=";
    const url = encodeURIComponent("https://www.selenium.dev/blog/");

    try {
        const res = await axios.get(proxy + url);
        const html = res.data.contents;
        const $ = cheerio.load(html);

        $("article.blog-post").each(async (i, elem) => {
            const title = $(elem).find("h2 a").text();
            const link = "https://www.selenium.dev" + $(elem).find("h2 a").attr("href");
            const snippet = $(elem).find("p").first().text() || "";
            const category = categorizeNews(title, snippet);

            const newsItem = { title, link, snippet, category, videoLinks: [] };
            newsItem.videoLinks = await fetchVideos(title);

            allNews.push(newsItem);
        });
    } catch (error) {
        console.error("Error fetching news:", error);
    }
}

// Smarter categorization: checks title + snippet
function categorizeNews(title, snippet) {
    const text = (title + " " + snippet).toLowerCase();

    const jobKeywords = ["job", "hiring", "career", "vacancy", "recruit"];
    if (jobKeywords.some(word => text.includes(word))) return "Job";

    const toolKeywords = ["selenium", "tool", "webdriver", "release", "update", "feature"];
    if (toolKeywords.some(word => text.includes(word))) return "Tool";

    return "Trending";
}

// Fetch YouTube videos for a news title
async function fetchVideos(query) {
    const apiKey = "<YOUR_YOUTUBE_API_KEY>"; // 🔑 Replace only this
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=2&key=${apiKey}`;
    try {
        const res = await axios.get(url);
        return res.data.items.map(item => "https://www.youtube.com/watch?v=" + item.id.videoId);
    } catch (e) {
        console.error("Error fetching videos:", e);
        return [];
    }
}

// Show news of selected category
function showCategory(category) {
    const container = document.getElementById("news-list");
    container.innerHTML = `<h2>${category} News</h2>`;

    const filtered = allNews.filter(n => n.category === category);
    filtered.forEach(item => {
        const div = document.createElement("div");
        div.className = "news-item";

        let inner = `<a href="${item.link}" target="_blank">${item.title}</a>`;
        if(item.snippet) inner += `<p>${item.snippet}</p>`;
        item.videoLinks.forEach(v => {
            inner += `<a class="video-link" href="${v}" target="_blank">▶ Tutorial</a>`;
        });

        div.innerHTML = inner;
        container.appendChild(div);
    });
}

// Initialize
fetchSeleniumNews();
