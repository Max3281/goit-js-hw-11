import ImageApiService from './api/api-service';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';

const formEl = document.querySelector('.search-form');
const galleryEl = document.querySelector('.gallery');
const loadMore = document.querySelector('.load-more');

const imageApi = new ImageApiService();

let lightbox = new SimpleLightbox('.gallery a');

formEl.addEventListener('submit', onFormSubmit);
loadMore.addEventListener('click', onLoadMore);
galleryEl.addEventListener('submit', createMarkup);

function onFormSubmit(e) {
  e.preventDefault();
  imageApi.query = e.currentTarget.elements.searchQuery.value;
  if (imageApi.query === '') {
    return Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
  loadMore.disabled = true;
  showMoreLoad();
  resetMarkup();
  imageApi.resetPage();
  try {
    imageApi.fetchImages().then(data => {
      createMarkup(data);
      checkTotalHits(data);
      lightbox.refresh();
      if (data.totalHits <= 40) {
        hideMoreLoad();
      }
      loadMore.disabled = false;
      imageApi.card = galleryEl.children.length;
    });
  } catch (error) {
    Notiflix.Notify.failure(`${error}`);
  }
}

function onLoadMore() {
  try {
    imageApi.fetchImages().then(data => {
      createMarkup(data);
      const { height: cardHeight } = document
        .querySelector('.gallery')
        .firstElementChild.getBoundingClientRect();

      window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
      });
      imageApi.card = galleryEl.children.length;
      if (imageApi.card === data.totalHits) {
        hideMoreLoad();
        return Notiflix.Notify.failure(
          "We're sorry, but you've reached the end of search results."
        );
      }
    });
  } catch (error) {
    Notiflix.Notify.failure(`${error}`);
  }
}

function createMarkup(data) {
  let templateUnit = data.hits
    .map(unit => {
      return `<div class="photo-card">
      <a href="${unit.largeImageURL}">
        <img  class="photo-card-img" src="${unit.webformatURL}" alt="${unit.tags}" loading="lazy" />
        </a>
        <div class="info">
          <p class="info-item">
            <b>Likes</b>
            <b>${unit.likes}</b>
          </p>
          <p class="info-item">
            <b>Views</b>
            <b>${unit.views}</b>
          </p>
          <p class="info-item">
            <b>Comments</b>
            <b>${unit.comments}</b>
          </p>
          <p class="info-item">
            <b>Downloads</b>
            <b>${unit.downloads}</b>
          </p>
        </div>
      </div>`;
    })
    .join('');
  return galleryEl.insertAdjacentHTML('beforeend', templateUnit);
}

function resetMarkup() {
  galleryEl.innerHTML = '';
}

function showMoreLoad() {
  loadMore.classList.add('is-show');
}

function hideMoreLoad() {
  loadMore.classList.toggle('is-show');
}

function checkTotalHits(data) {
  if (data.totalHits === 0) {
    Notiflix.Notify.failure(
      `Sorry, there are no images matching your search query. Please try again.`
    );
    return;
  }
  Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
}
