export function setupSearch(searchBox, searchResult, blurBg, closeBtn, controlsContainer, createCard) {
  let timer;

  searchBox.addEventListener("input", function () {
    clearTimeout(timer);
    const value = this.value.trim();

    timer = setTimeout(async () => {
      if (value === "") {
        searchResult.style.display = "none";
        blurBg.style.display = "none";
        closeBtn.style.display = "none";
        controlsContainer.classList.remove("active-search");
        return;
      }

      const res = await fetch(
        `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(value)}&limit=12`
      );
      const data = await res.json();

      searchResult.innerHTML = "";
      searchResult.style.display = "flex";
      blurBg.style.display = "block";
      closeBtn.style.display = "block";
      controlsContainer.classList.add("active-search");

      data.data.forEach(anime => {
        searchResult.appendChild(createCard(anime));
      });
    }, 500);
  });
}