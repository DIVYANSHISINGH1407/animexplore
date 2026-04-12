export function setupFilter(filter, allAnimeRef, sections, createCard) {
  filter.addEventListener("change", function () {
    const value = Number(this.value);

    const { topRated, trending, myAnime, topSection, trendingSection, mySection } = sections;

    if (!value) {
      topSection.style.display = "block";
      trendingSection.style.display = "block";
      mySection.style.display = "block";
      return;
    }

    const filtered = allAnimeRef().filter(
      (anime) => anime.score && anime.score >= value
    );

    topRated.innerHTML = "";
    trending.innerHTML = "";
    myAnime.innerHTML = "";

    trendingSection.style.display = "none";
    mySection.style.display = "none";

    filtered.forEach(anime => {
      topRated.appendChild(createCard(anime));
    });
  });
}