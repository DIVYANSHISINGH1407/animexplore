const topRated = document.getElementById("topRated");
const trending = document.getElementById("trending");
const myAnime = document.getElementById("myAnime");
const loader = document.getElementById("loader");

const searchBox = document.getElementById("searchInput");
const searchResult = document.getElementById("searchResult");
const blurBg = document.getElementById("blurBg");
const closeBtn = document.getElementById("closeBtn");
const filter = document.getElementById("filter");
const exploreBtn = document.getElementById("exploreBtn");
const modal = document.getElementById("authModal");

const controlsContainer = document.querySelector(".controls-container");
const topSection = document.getElementById("topSection");
const trendingSection = document.getElementById("trendingSection");
const mySection = document.getElementById("mySection");

const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");
const loginMessage = document.getElementById("loginMessage");

const profileBox = document.getElementById("profileBox");
const profileName = document.getElementById("profileName");
const logoutBtn = document.getElementById("logoutBtn");

const detailModal = document.getElementById("detailModal");
const detailCloseBtn = document.getElementById("detailCloseBtn");
const detailImage = document.getElementById("detailImage");
const detailTitle = document.getElementById("detailTitle");
const detailScore = document.getElementById("detailScore");
const detailEpisodes = document.getElementById("detailEpisodes");
const detailSynopsis = document.getElementById("detailSynopsis");
const watchNowBtn = document.getElementById("watchNowBtn");

let allAnime = [];
let timer;

// ===== LISTS =====
const topList = [16498, 1535, 40748, 9253];
const trendingList = [31964, 37430, 32281, 28851];
const myList = [4181, 44511, 50739, 28851];

// ===== FETCH =====
async function fetchById(id) {
  try {
    const res = await fetch(`https://api.jikan.moe/v4/anime/${id}`);
    if (!res.ok) return null;

    const data = await res.json();
    return data.data;
  } catch (error) {
    console.log("Fetch error:", error);
    return null;
  }
}

// ===== WATCH LINK =====
function getWatchLink(anime) {
  if (anime.trailer && anime.trailer.url) {
    return anime.trailer.url;
  }

  const title = anime.title_english || anime.title || "anime";
  return `https://www.crunchyroll.com/search?q=${encodeURIComponent(title)}`;
}

// ===== DETAIL MODAL =====
function openDetailModal(anime) {
  detailImage.src =
    anime.images?.jpg?.large_image_url ||
    anime.images?.jpg?.image_url ||
    "";
  detailTitle.textContent = anime.title_english || anime.title || "Unknown Title";
  detailScore.textContent = `Rating: ${anime.score || "N/A"} ⭐`;
  detailEpisodes.textContent = `Episodes: ${anime.episodes || "Unknown"} | Status: ${anime.status || "Unknown"}`;
  detailSynopsis.textContent =
    anime.synopsis || "No description available for this anime.";
  watchNowBtn.href = getWatchLink(anime);

  detailModal.style.display = "flex";
  document.body.classList.add("no-scroll");
}

function closeDetailModal() {
  detailModal.style.display = "none";
  if (searchResult.style.display !== "flex") {
    document.body.classList.remove("no-scroll");
  }
}

// ===== CREATE CARD =====
function createCard(anime) {
  const card = document.createElement("div");
  card.className = "card";

  const img = document.createElement("img");
  img.src =
    anime.images?.jpg?.large_image_url ||
    anime.images?.jpg?.image_url ||
    "";
  img.alt = anime.title_english || anime.title || "Anime poster";

  const name = document.createElement("div");
  name.className = "name";
  name.textContent = anime.title_english || anime.title || "Unknown Title";

  const rating = document.createElement("div");
  rating.className = "rating";
  rating.textContent = "⭐ " + (anime.score || "N/A");

  card.appendChild(img);
  card.appendChild(name);
  card.appendChild(rating);

  card.addEventListener("click", function () {
    openDetailModal(anime);
  });

  return card;
}

// ===== LOAD SECTION =====
async function loadSection(list, container) {
  container.innerHTML = "";

  const animeData = await Promise.all(list.map((id) => fetchById(id)));

  animeData.forEach((anime) => {
    if (anime) {
      container.appendChild(createCard(anime));
    }
  });

  return animeData.filter(Boolean);
}

// ===== RENDER HOME =====
function renderHome() {
  topRated.innerHTML = "";
  trending.innerHTML = "";
  myAnime.innerHTML = "";

  topList.forEach((id) => {
    const anime = allAnime.find((item) => item.mal_id === id);
    if (anime) topRated.appendChild(createCard(anime));
  });

  trendingList.forEach((id) => {
    const anime = allAnime.find((item) => item.mal_id === id);
    if (anime) trending.appendChild(createCard(anime));
  });

  myList.forEach((id) => {
    const anime = allAnime.find((item) => item.mal_id === id);
    if (anime) myAnime.appendChild(createCard(anime));
  });
}

// ===== PROFILE =====
function showProfile(username) {
  profileBox.style.display = "flex";
  profileName.textContent = `Hi, ${username}`;
  exploreBtn.style.display = "none";
}

function hideProfile() {
  profileBox.style.display = "none";
  profileName.textContent = "";
  exploreBtn.style.display = "inline-block";
}

// ===== FILTER =====
filter.addEventListener("change", function () {
  const value = Number(this.value);

  if (!value) {
    topSection.style.display = "block";
    trendingSection.style.display = "block";
    mySection.style.display = "block";
    renderHome();
    return;
  }

  const filtered = allAnime.filter(
    (anime) => anime.score && anime.score >= value
  );

  topRated.innerHTML = "";
  trending.innerHTML = "";
  myAnime.innerHTML = "";

  topSection.style.display = "block";
  trendingSection.style.display = "none";
  mySection.style.display = "none";

  filtered.forEach((anime) => {
    topRated.appendChild(createCard(anime));
  });
});

// ===== INIT =====
async function init() {
  loader.style.display = "block";

  const topData = await loadSection(topList, topRated);
  const trendingData = await loadSection(trendingList, trending);
  const myData = await loadSection(myList, myAnime);

  const uniqueMap = new Map();

  [...topData, ...trendingData, ...myData].forEach((anime) => {
    uniqueMap.set(anime.mal_id, anime);
  });

  allAnime = [...uniqueMap.values()];

  loader.style.display = "none";
}

init();

// ===== SEARCH =====
searchBox.addEventListener("input", function () {
  clearTimeout(timer);
  const value = this.value.trim();

  timer = setTimeout(async () => {
    if (value === "") {
      searchResult.style.display = "none";
      blurBg.style.display = "none";
      closeBtn.style.display = "none";
      controlsContainer.classList.remove("active-search");
      document.body.classList.remove("no-scroll");
      return;
    }

    try {
      const res = await fetch(
        `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(value)}&limit=12`
      );
      const data = await res.json();

      searchResult.innerHTML = "";
      searchResult.style.display = "flex";
      blurBg.style.display = "block";
      closeBtn.style.display = "block";
      controlsContainer.classList.add("active-search");
      document.body.classList.add("no-scroll");

      data.data.forEach((anime) => {
        searchResult.appendChild(createCard(anime));
      });
    } catch (err) {
      console.log("Search error:", err);
    }
  }, 500);
});

// ===== LOGIN MODAL =====
exploreBtn.addEventListener("click", function () {
  modal.style.display = "flex";
  loginMessage.textContent = "";
});

modal.addEventListener("click", function (e) {
  if (e.target === modal) {
    modal.style.display = "none";
  }
});

// ===== LOGIN =====
loginBtn.addEventListener("click", function () {
  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  if (username === "" || password === "") {
    loginMessage.textContent = "Please fill all details.";
    loginMessage.style.color = "tomato";
    return;
  }

  localStorage.setItem("animeUser", username);

  loginMessage.textContent = `Welcome, ${username}!`;
  loginMessage.style.color = "lightgreen";

  showProfile(username);

  setTimeout(() => {
    modal.style.display = "none";
    usernameInput.value = "";
    passwordInput.value = "";
    loginMessage.textContent = "";
  }, 1000);
});

logoutBtn.addEventListener("click", function () {
  localStorage.removeItem("animeUser");
  hideProfile();
});

// ===== CLOSE SEARCH =====
closeBtn.addEventListener("click", () => {
  searchResult.style.display = "none";
  blurBg.style.display = "none";
  searchBox.value = "";
  closeBtn.style.display = "none";
  controlsContainer.classList.remove("active-search");
  document.body.classList.remove("no-scroll");
});

blurBg.addEventListener("click", () => {
  closeBtn.click();
});

// ===== DETAIL CLOSE =====
detailCloseBtn.addEventListener("click", closeDetailModal);

detailModal.addEventListener("click", function (e) {
  if (e.target === detailModal) {
    closeDetailModal();
  }
});

// ===== RESTORE LOGIN =====
const savedUser = localStorage.getItem("animeUser");
if (savedUser) {
  showProfile(savedUser);
} else {
  hideProfile();
}

