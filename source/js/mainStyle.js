const API_KEY = '8c8e1a50-6322-4135-8875-5d40a5420d86';
const API_KEY_ALL_MOVIES = 'https://kinopoiskapiunofficial.tech/api/v2.2/films/collections?type=TOP_POPULAR_ALL&page=1';
const API_URL_SEARCH = "https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword=";
const API_URL_MOVIE_DATA = 'https://kinopoiskapiunofficial.tech/api/v2.2/films/';
getMovies(API_KEY_ALL_MOVIES);


const resultBox = document.querySelector(".header__result-box");
const searchBox = document.getElementById("header__search");
const headerForm = document.querySelector(".header__form");

async function getMovies(url) {
  const resp = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": API_KEY,
    },
  });
  const respData = await resp.json();
  showMovies(respData);
}

function closeModal() {
  document.body.classList.remove('stop--scrolling');
  modalEl.classList.remove('modal--show');
}

function getStrByRate(vote) {
  if (vote >= 7) {
    return 'green';
  } else if (vote >= 5 && vote < 7) {
    return 'orange'
  } else {
    return 'red'
  }
}

function showMovies(data) {
  const availableFilms = [];
  const moviesEl = document.querySelector(".movies");

  //очистка предыдущих фильмов
  document.querySelector(".movies").innerHTML = "";

  if ("items" in data) {
    data.items.forEach((movie) => {
      const movieEl = document.createElement("div");
      movieEl.classList.add('movie');
      movieEl.innerHTML = `
            <div class="movie">
              <div class="movie__cover-inner">
                <img
                  src="${movie.posterUrlPreview}"
                  alt="${movie.nameRu}"
                  class="movie__image">
                <div class="movie__cover--darkened"></div>
              </div>
              <div class="movie__info">
                <div class="movie__title">${movie.nameRu}</div>
                <div class="movie__category">${movie.genres.map((el) => el.genre)}</div>
        ${movie.ratingKinopoisk ?
          `<div class="movie__average movie__average--${getStrByRate(movie.ratingKinopoisk)}">${movie.ratingKinopoisk}</div>` : ''
        }
              </div>
            </div>`

      availableFilms.push(movie.nameRu);
      movieEl.addEventListener("click", () => openModal(movie.kinopoiskId))
      moviesEl.appendChild(movieEl);
    })
  } else {
    data.films.forEach((movie) => {

      const movieEl = document.createElement("div");
      movieEl.classList.add('movie');
      movieEl.innerHTML = `
            <div class="movie">
              <div class="movie__cover-inner">
                <img
                  src="${movie.posterUrlPreview}"
                  alt="${movie.nameRu}"
                  class="movie__image">
                <div class="movie__cover--darkened"></div>
              </div>
              <div class="movie__info">
                <div class="movie__title">${movie.nameRu}</div>
                <div class="movie__category">${movie.genres.map((genre) => genre.genre)}</div>
        ${movie.rating != 'null' ?
          `<div class="movie__average movie__average--${getStrByRate(movie.rating)}">${movie.rating}</div>` : ''
        }
              </div>
            </div>`
      movieEl.addEventListener('click', () => openModal(movie.filmId))
      moviesEl.appendChild(movieEl);
    })
  }


  searchBox.addEventListener("keyup", () => displayKeyWords(availableFilms));
}






headerForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const apiSearchUrl = `${API_URL_SEARCH}${searchBox.value}`;
  if (searchBox.value) {
    getMovies(apiSearchUrl);
    searchBox.value = "";
  }
});



//модалка

const modalEl = document.querySelector(".modal");

async function openModal(id) {
  const resp = await fetch(API_URL_MOVIE_DATA + id, {
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": API_KEY,
    },
  });
  const respData = await resp.json();

  modalEl.classList.add("modal--show")
  document.body.classList.add('stop--scrolling');
  modalEl.innerHTML = `
  <div class="modal__card">
    <img class="modal__img" src="${respData.posterUrlPreview}" alt="${respData.nameRu}">
    <h2 class="modal__h2">
      <span class="modal__movie-title">${respData.nameRu ? respData.nameRu : ''}</span>
      <span class="modal__movie-release-year">${respData.year ? respData.year : ''}</span>
    </h2>
    <ul class="modal__movie-info">
      <li class="modal__movie-genre">${respData.genres ? 'Жанр:' + respData.genres.map((el) => el.genre) : ''}</li>
      <li class="modal__movie-runtime">${respData.filmLength ? 'Время-' + respData.filmLength + ' мин' : ''}</li>
      <li class="modal__movie-site">${'Сайт:' + respData.webUrl}</li>
      <li class="modal__movie-description">${respData.description ? 'Описание:' + respData.description : ''}</li>
    </ul>
    <button type="button" class="modal__button-close">Закрыть</button>
  </div>
  `

  const btnClose = document.querySelector('.modal__button-close');
  btnClose.addEventListener('click', () => closeModal());

}


window.addEventListener('click', (e) => {
  if (e.target === modalEl) {
    closeModal();
  }
})

window.addEventListener('keydown', (e) => {
  if (e.keyCode === 27) {
    closeModal();
  }
})




function displayKeyWords(nameMovie) {
  resultBox.innerHTML = '';
  let result = [];
  let input = searchBox.value.toLowerCase();


  if (input.length) {
    result = nameMovie.filter((keyWord) => keyWord.toLowerCase().includes(input));
  }
  console.log(result);
  // Добавляем найденные результаты в resultBox
  displayResult(result);
}

function displayResult(result) {
  result.forEach((movieName) => {
    const resultItem = document.createElement("div");
    resultItem.classList.add("header__key-word");
    resultItem.innerHTML = `
    <li onclick=selectInput(this)> ${movieName} </li>
    `
    resultBox.appendChild(resultItem);
  });
}

function selectInput(list) {
  searchBox.value = list.innerText;
  resultBox.innerHTML = '';
}

document.addEventListener("click", (e) => {
  if (!resultBox.contains(e.target) && e.target !== searchBox) {
    resultBox.style.display = "none";
  } else {
    resultBox.style.display = "block"
  }
});





