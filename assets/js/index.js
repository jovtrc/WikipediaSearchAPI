loadPlaceholder();
loadLanguages();
listenInput();
fetchApi(query = 'wikipedia', lang = 'en');

// Duplicate the default element for loading placeholder
function loadPlaceholder() {
    let results = document.querySelector('.search__results');

    for (let index = 0; index < 9; index++) {
        let resultsPlaceholder = `
            <li class="search__results__item search__results__item--placeholder">
                <a href="#">
                    <div class="placeholder placeholder--image"></div>
                    <div>
                        <div class="placeholder placeholder--title"></div>
                        <div class="placeholder placeholder--desc"></div>
                    </div>
                </a>
            </li>
        `;
        results.insertAdjacentHTML('afterbegin', resultsPlaceholder);
    }
}

// Load and insert languages on select field
function loadLanguages() {
    let langsSelect = document.querySelector('.search__language');
    let langs = [ 'en', 'pt', 'fr', 'es' ]; // increment to search other languages

    langs.forEach(lang => {
        let langElement = `
            <option value="${lang}">${lang}</option>
        `;
        langsSelect.insertAdjacentHTML('afterbegin', langElement);
    });
}

function listenInput() {
    let searchInput = document.querySelector('.search__input');
    let langSelect = document.querySelector('.search__language');

    searchInput.addEventListener('keyup', () => fetchApi(searchInput.value, langSelect.value));
}

// Fech the API and send to render function
function fetchApi(query, lang) {
    clearSearch();
    if(query) {
        fetch(`https://${lang}.wikipedia.org/w/rest.php/v1/search/title?q=${query}&limit=10`)
            .then(response => response.json())
            .then(data => renderSearch(data, query, lang));
    }
}

// Render the search results, if exists
function renderSearch({ pages }, query, lang) {
    let results = document.querySelector('.search__results');

    if (undefined != pages && null !== pages) {
        loadPlaceholder();
        results.innerHTML = '';

        pages.forEach(page => {
            let pageThumbnail = (null !== page.thumbnail) ? page.thumbnail.url : "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' aria-hidden='true'%3E%3C!----%3E%3Cpath fill='currentColor' d='M19 3H1v14h18zM3 14l3.5-4.5 2.5 3L12.5 8l4.5 6z'%3E%3C/path%3E%3C/svg%3E";
            let pageDescription = (null !== page.description) ? page.description : '';

            let pageElement = `
                <li class="search__results__item">
                    <a href="https://${lang}.wikipedia.org/wiki/${page.key}" target="_blank">
                        <img src="${pageThumbnail}" alt="${page.title}" alt="${pageDescription}">
                        <p>
                            ${page.title}
                            <span>${pageDescription}</span>
                        </p>
                    </a>
                </li>
            `;

            results.insertAdjacentHTML('afterbegin', pageElement);
        });

        let moreLink = `
            <li class="search__results__item">
                <a href="https://${lang}.wikipedia.org/w/index.php?title=Special%3ASearch&fulltext=1&search=${query}" target="_blank">
                    <p>
                        Search for pages containing
                        <strong>${query}</strong>...
                    </p>
                </a>
            </li>
        `;
        results.insertAdjacentHTML('beforeend', moreLink);
    }
}

function clearSearch() {
    let results = document.querySelector('.search__results');
    results.innerHTML = '';
    loadPlaceholder();
}