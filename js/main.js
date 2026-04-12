import { fetchById } from "./api.js";
import { createCard, openDetailModal } from "./ui.js";
import { setupSearch } from "./search.js";
import { setupFilter } from "./filter.js";
import { setupAuth } from "./auth.js";

// DOM
const topRated = document.getElementById("topRated");
const trending = document.getElementById("trending");
const myAnime = document.getElementById("myAnime");

const searchBox = document.getElementById("searchInput");
const searchResult = document.getElementById("searchResult");
const blurBg = document.getElementById("blurBg");
const closeBtn = document.getElementById("closeBtn");
const filter = document.getElementById("filter");

const exploreBtn = document.getElementById("exploreBtn");
const modal = document.getElementById("authModal");
const loginBtn = document.getElementById("loginBtn");

const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");

const profileBox = document.getElementById("profileBox");
const profileName = document.getElementById("profileName");

const controlsContainer = document.querySelector(".controls-container");

const detailElements = {
  detailModal: document.getElementById("detailModal"),
  detailImage: document.getElementById("detailImage"),
  detailTitle: document.getElementById("detailTitle"),
  detailScore: document.getElementById("detailScore"),
  detailEpisodes: document.getElementById("detailEpisodes"),
  detailSynopsis: document.getElementById("detailSynopsis"),
  watchNowBtn: document.getElementById("watchNowBtn")
};

// Lists
const topList = [16498, 1535, 40748, 9253];
const trendingList = [31964, 37430, 32281, 28851];
const myList = [4181, 44511, 50739, 28851];

let allAnime = [];

// Load
async function loadSection(list, container) {
  const data = await Promise.all(list.map(id => fetchById(id)));
  data.forEach(anime => {
    if (anime) container.appendChild(createCard(anime, openDetailModal, detailElements));
  });
  return data.filter(Boolean);
}

async function init() {
  const a = await loadSection(topList, topRated);
  const b = await loadSection(trendingList, trending);
  const c = await loadSection(myList, myAnime);

  allAnime = [...a, ...b, ...c];
}

init();

// Setup
setupSearch(searchBox, searchResult, blurBg, closeBtn, controlsContainer, (anime) =>
  createCard(anime, openDetailModal, detailElements)
);

setupFilter(filter, () => allAnime, {
  topRated,
  trending,
  myAnime,
  topSection: document.getElementById("topSection"),
  trendingSection: document.getElementById("trendingSection"),
  mySection: document.getElementById("mySection")
}, (anime) => createCard(anime, openDetailModal, detailElements));

setupAuth(exploreBtn, modal, loginBtn, usernameInput, passwordInput, profileBox, profileName);