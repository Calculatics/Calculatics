// Homepage calculator search: show results only when the user submits.
const searchForm = document.querySelector("#calculator-search");
const searchInput = document.querySelector("#search");
const results = document.querySelector("#results");

const calculatorPaths = {
  "Risk/Reward Calculator": "risk-reward-calculator",
  "Profit & Loss Calculator": "trading-profit-loss-calculator",
  "ROI Calculator": "roi-calculator"
};

const calculators = [...document.querySelectorAll(".category")].flatMap(section => {
  const category = section.querySelector("h2")?.textContent.trim() || "";
  return [...section.querySelectorAll(".category-calculators span")].map(item => {
    const name = item.textContent.trim();
    const slug = calculatorPaths[name] ||
      name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    return { name, category, slug };
  });
});

// Highlight only the matching text, without inserting user input as HTML.
function appendHighlightedText(element, text, query) {
  const index = text.toLowerCase().indexOf(query);
  if (index === -1) {
    element.textContent = text;
    return;
  }
  let from = 0;
  let match = index;
  while (match !== -1) {
    element.append(document.createTextNode(text.slice(from, match)));
    const highlight = document.createElement("mark");
    highlight.className = "search-match";
    highlight.textContent = text.slice(match, match + query.length);
    element.append(highlight);
    from = match + query.length;
    match = text.toLowerCase().indexOf(query, from);
  }
  element.append(document.createTextNode(text.slice(from)));
}

function showSearchResults() {
  if (!results || !searchInput) return;
  const query = searchInput.value.trim().toLowerCase();
  results.replaceChildren();

  // Do not hide or rearrange homepage categories while someone is typing.
  if (!query) return;

  const matches = calculators.filter(({ name, category }) =>
    (name + " " + category).toLowerCase().includes(query)
  );

  const heading = document.createElement("h2");
  heading.className = "search-results-heading";
  heading.textContent = matches.length
    ? `Search results (${matches.length})`
    : "No matching calculators";
  results.append(heading);

  if (!matches.length) {
    const message = document.createElement("p");
    message.className = "search-results-empty";
    message.textContent = "Try another keyword or browse the categories below.";
    results.append(message);
    return;
  }

  const grid = document.createElement("div");
  grid.className = "search-results-grid";
  for (const { name, category, slug } of matches) {
    const link = document.createElement("a");
    link.className = "search-result-link";
    link.href = slug;
    const title = document.createElement("strong");
    appendHighlightedText(title, name, query);
    const subtitle = document.createElement("span");
    appendHighlightedText(subtitle, category, query);
    link.append(title, subtitle);
    grid.append(link);
  }
  results.append(grid);
}

searchForm?.addEventListener("submit", event => {
  event.preventDefault();
  showSearchResults();
  if (searchInput?.value.trim()) {
    results?.scrollIntoView({ behavior: "smooth", block: "start" });
  } else {
    searchInput?.focus();
  }
});

searchInput?.addEventListener("input", () => {
  // Clear old results when the query is cleared; do not filter categories.
  if (!searchInput.value.trim()) results?.replaceChildren();
});

const year = document.querySelector("#year");
if (year) year.textContent = new Date().getFullYear();
