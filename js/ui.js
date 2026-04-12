export function getWatchLink(anime) {
  if (anime.trailer && anime.trailer.url) {
    return anime.trailer.url;
  }

  const title = anime.title_english || anime.title || "anime";
  return `https://www.crunchyroll.com/search?q=${encodeURIComponent(title)}`;
}

export function openDetailModal(anime, elements) {
  const {
    detailModal,
    detailImage,
    detailTitle,
    detailScore,
    detailEpisodes,
    detailSynopsis,
    watchNowBtn
  } = elements;

  detailImage.src = anime.images?.jpg?.large_image_url || "";
  detailTitle.textContent = anime.title_english || anime.title;
  detailScore.textContent = `Rating: ${anime.score || "N/A"} ⭐`;
  detailEpisodes.textContent = `Episodes: ${anime.episodes || "Unknown"}`;
  detailSynopsis.textContent = anime.synopsis || "No description";
  watchNowBtn.href = getWatchLink(anime);

  detailModal.style.display = "flex";
}

export function createCard(anime, openDetailModal, elements) {
  const card = document.createElement("div");
  card.className = "card";

  const img = document.createElement("img");
  img.src = anime.images?.jpg?.large_image_url || "";

  const name = document.createElement("div");
  name.className = "name";
  name.textContent = anime.title_english || anime.title;

  const rating = document.createElement("div");
  rating.className = "rating";
  rating.textContent = "⭐ " + (anime.score || "N/A");

  card.append(img, name, rating);

  card.addEventListener("click", () => openDetailModal(anime, elements));

  return card;
}