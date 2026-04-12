export function setupAuth(exploreBtn, modal, loginBtn, usernameInput, passwordInput, profileBox, profileName) {

  exploreBtn.addEventListener("click", () => {
    modal.style.display = "flex";
  });

  loginBtn.addEventListener("click", () => {
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    if (!username || !password) return;

    localStorage.setItem("animeUser", username);

    profileBox.style.display = "flex";
    profileName.textContent = `Hi, ${username}`;
    modal.style.display = "none";
  });
}