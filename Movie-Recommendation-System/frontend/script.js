document.addEventListener("DOMContentLoaded", function () {
  const username = localStorage.getItem("username");
  const userId = localStorage.getItem("userId");
  if (username && userId) {
    document.getElementById("loginSection").style.display = "none";
    document.getElementById("mainApp").style.display = "block";
  }
});

function login() {
  const usernameInput = document.getElementById("username").value.trim();
  const userMap = {
    demo1: 1,
    demo2: 2,
    demo3: 3,
    demo4: 4,
    demo5: 5
  };

  if (userMap[usernameInput]) {
    localStorage.setItem("username", usernameInput);
    localStorage.setItem("userId", userMap[usernameInput]);
    location.reload();
  } else {
    alert("Invalid username. Use demo1 to demo5.");
  }
}

function logout() {
  localStorage.clear();
  location.reload();
}

async function getRecommendations() {
  const userId = localStorage.getItem("userId");
  if (!userId) return;

  const res = await fetch(`http://127.0.0.1:5000/recommend/${userId}`);
  const data = await res.json();

  const list = document.getElementById("recommendations");
  list.innerHTML = '';

  for (const movie of data.recommendations) {
    const li = document.createElement("li");

    const poster = await fetchPoster(movie);
    li.innerHTML = `
      <img src="${poster}" alt="${movie}" style="width: 100px; margin-right: 15px;">
      <span>${movie}</span>
    `;
    li.className = "list-group-item d-flex align-items-center";
    list.appendChild(li);
  }
}

async function fetchPoster(title) {
  const apiKey = '1272c78e7e8fda0969cfb6adc27691ab';
  const cleanTitle = title.replace(/\(\d{4}\)/, '').trim();
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(cleanTitle)}`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    if (data.results && data.results[0]?.poster_path) {
      return `https://image.tmdb.org/t/p/w500${data.results[0].poster_path}`;
    }
  } catch {}
  return 'https://via.placeholder.com/100x150?text=No+Image';
}

async function searchMovie() {
  const query = document.getElementById("searchQuery").value;
  const apiKey = '1272c78e7e8fda0969cfb6adc27691ab';
  const res = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}`);
  const data = await res.json();

  const result = document.getElementById("searchResult");
  if (data.results && data.results.length > 0) {
    const movie = data.results[0];
    result.innerHTML = `
      <h5>${movie.title}</h5>
      <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" style="width: 150px;">
      <p>${movie.overview}</p>
    `;
  } else {
    result.innerHTML = 'No movie found.';
  }
}
