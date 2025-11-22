async function trashFetch() {
  try {
    const res = await fetch("http://127.0.0.1:8000/mockup-data", {
      method: "GET",
    });
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const fetchData = await res.json();
    return fetchData;
  } catch (error) {
    console.error("Error fetching mockup data:", error);
    return null;
  }
}

export default trashFetch;