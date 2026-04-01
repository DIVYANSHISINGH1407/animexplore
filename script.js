const topRated = document.getElementById("topRated");
const trending = document.getElementById("trending");
const myAnime = document.getElementById("myAnime");
const loader = document.getElementById("loader");

//  Top Rated 
const topList = [
  16498, // Attack on Titan
  1535,  // Death Note
  40748, // Jujutsu Kaisen
  50594, // Suzume
  28851  // Weathering With You
];

//  Trending 
const trendingList = [
  31964, // My Hero Academia
  37430, // That Time I Got Reincarnated as a Slime
  32281, // Your Name
  9253,  // Steins;Gate
  46569  // Hell's Paradise
];

//  My Picks 
const myList = [
  28851, // A Silent Voice (same ID works)
  4181,  // Clannad After Story
  44511, // Chainsaw Man
  50739  // Angel Next Door
];

//  Fetch by ID
async function fetchById(id) {
  try {
    const res = await fetch(`https://api.jikan.moe/v4/anime/${id}`);
    const data = await res.json();
    return data.data;
  } catch (err) {
    console.log("Error:", err);
  }
}

//  Create card
function createCard(anime) {
  return `
    <div class="card">
      <img src="${anime.images.jpg.large_image_url}" alt="${anime.title}">
      <div class="info">
        <div class="name">
            ${anime.title_english || anime.title}
        </div>
        <div class="rating">⭐ ${anime.score || "N/A"}</div>
      </div>
    </div>
  `;
}

//  Load section
async function loadSection(list, container) {
  container.innerHTML = "";

  for (let id of list) {
    const anime = await fetchById(id);

    if (anime) {
      container.innerHTML += createCard(anime);
    }
  }
}

//  Init
async function init() {
  loader.style.display = "block";

  await loadSection(topList, topRated);
  await loadSection(trendingList, trending);
  await loadSection(myList, myAnime);

  loader.style.display = "none";
}

init();