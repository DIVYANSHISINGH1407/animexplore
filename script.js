let allAnime = [];

const topRated = document.getElementById("topRated");
const trending = document.getElementById("trending");
const myAnime = document.getElementById("myAnime");
const loader = document.getElementById("loader");

const searchBox = document.getElementById("searchInput");
const searchResult = document.getElementById("searchResult");
const blurBg = document.getElementById("blurBg");
const closeBtn = document.getElementById("closeBtn");

// ===== LISTS =====
const topList = [16498, 1535, 40748];
const trendingList = [31964, 37430, 32281];
const myList = [4181, 44511];

// ===== FETCH =====
async function fetchById(id) {
  try {
    const res = await fetch(`https://api.jikan.moe/v4/anime/${id}`);
    if (!res.ok) return null;

    const data = await res.json();
    return data.data;

  } catch {
    return null;
  }
}

// ===== CREATE CARD =====
function createCard(anime) {
  const card = document.createElement("div");
  card.className = "card";

  const img = document.createElement("img");
  img.src = anime.images.jpg.large_image_url;

  const name = document.createElement("div");
  name.className = "name";
  name.textContent = anime.title_english || anime.title;

  const rating = document.createElement("div");
  rating.className = "rating";
  rating.textContent = "⭐ " + (anime.score || "N/A");

  card.appendChild(img);
  card.appendChild(name);
  card.appendChild(rating);

  return card;
}

// ===== LOAD SECTION =====
async function loadSection(list, container) {
  container.innerHTML = "";

  for (let id of list) {
    const anime = await fetchById(id);

    if (anime) {
      allAnime.push(anime);   // 🔥 IMPORTANT
      container.appendChild(createCard(anime));
    }

    await new Promise(r => setTimeout(r, 400));
  }
}


const filter = document.getElementById("filter");

filter.addEventListener("change", function () {
  const value = this.value;

  if (value === "") {
    // show original
    resetHome();
    return;
  }

  const filtered = allAnime.filter(anime => {
    return anime.score && anime.score >= value;
  });

  showFiltered(filtered);
});
function showFiltered(list) {
  topRated.innerHTML = "";

  list.forEach(anime => {
    topRated.appendChild(createCard(anime));
  });

  trending.innerHTML = "";
  myAnime.innerHTML = "";
}
function resetHome() {
  topRated.innerHTML = "";
  trending.innerHTML = "";
  myAnime.innerHTML = "";

  init();
}

// ===== INIT =====
async function init() {
  loader.style.display = "block";

  await loadSection(topList, topRated);
  await loadSection(trendingList, trending);
  await loadSection(myList, myAnime);

  loader.style.display = "none";
}

init();


let timer;

searchBox.addEventListener("input", function () {
  clearTimeout(timer);

  const value = this.value.trim();

  timer = setTimeout(async () => {

    if (value === "") {
      searchResult.style.display = "none";
      blurBg.style.display = "none";
      closeBtn.style.display = "none";  // 🔥 hide X
      return;
    }

    try {
      const res = await fetch(`https://api.jikan.moe/v4/anime?q=${value}&limit=6`);
      const data = await res.json();

      searchResult.innerHTML = "";
      searchResult.style.display = "flex";
      blurBg.style.display = "block";
      closeBtn.style.display = "block"; // 🔥 show X

      data.data.forEach(anime => {
        searchResult.appendChild(createCard(anime));
      });

    } catch (err) {
      console.log("Search error:", err);
    }

  }, 500);
});

// ===== CLOSE BUTTON =====
closeBtn.addEventListener("click", () => {
  searchResult.style.display = "none";
  blurBg.style.display = "none";
  searchBox.value = "";
  closeBtn.style.display = "none"; // 🔥 hide X
});

// ===== CLICK OUTSIDE =====
blurBg.addEventListener("click", () => {
  closeBtn.click();
});
