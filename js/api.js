export async function fetchById(id) {
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
