import fetchImages from '../js/fetchImages';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const searchForm = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
const endText = document.querySelector('.end-text')
let gallerySimpleLightbox = new SimpleLightbox('.gallery a');


let pageNumber = 1;
let currentHits = 0;
let searchQuery = '';
let perPage = 40;

loadMoreBtn.style.display = 'none';
endText.style.display = 'none';

function renderImageList(images) {
      console.log(images, 'images');
    const markup = images
      .map(image => {
        console.log('img', image);
        return `<div class="photo-card">
         <a href="${image.largeImageURL}"><img class="photo" src="${image.webformatURL}" alt="${image.tags}" title="${image.tags}" loading="lazy"/></a>
          <div class="info">
             <p class="info-item">
      <b>Likes</b> <span class="info-item-api"> ${image.likes} </span>
  </p>
              <p class="info-item">
                  <b>Views</b> <span class="info-item-api">${image.views}</span>
              </p>
              <p class="info-item">
                  <b>Comments</b> <span class="info-item-api">${image.comments}</span>
              </p>
              <p class="info-item">
                  <b>Downloads</b> <span class="info-item-api">${image.downloads}</span>
              </p>
          </div>
      </div>`;
      })
      .join('');
    gallery.innerHTML += markup;
  }

searchForm.addEventListener('submit', onSubmitSearchForm);

async function onSubmitSearchForm(e) {
  e.preventDefault();
  searchQuery = e.currentTarget.searchQuery.value.trim();
  pageNumber = 1;

  if (searchQuery === '') {
    Notiflix.Notify.failure(`Write something!`);
    endText.style.display = 'none';
    return;
  }

  const response = await fetchImages(searchQuery, pageNumber);
  currentHits = response.hits.length;

  if (response.totalHits > 40) {
    loadMoreBtn.style.display = 'block';
    endText.style.display = 'none';
  } else {
    loadMoreBtn.style.display = 'none';
    
  }

  try {
    if (response.totalHits > 0) {
      Notiflix.Notify.success(`Hooray! We found ${response.totalHits} images.`);
      gallery.innerHTML = '';
      renderImageList (response.hits);
      gallerySimpleLightbox.refresh();
      endText.style.display = 'none';
    }

    if (response.totalHits === 0) {
      gallery.innerHTML = '';
      Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
      loadMoreBtn.style.display = 'none';
      endText.style.display = 'none';
    }
  } catch (error) {
    console.log(error);
  }
}

loadMoreBtn.addEventListener('click', onClickLoadMoreBtn);

async function onClickLoadMoreBtn() {
  pageNumber +=1;
  try{
    
    const response = await fetchImages(searchQuery, pageNumber);
    let currentPage = Math.ceil(response.totalHits / perPage)
    renderImageList(response.hits);
    gallerySimpleLightbox.refresh();
    currentHits += response.hits.length;
    if (currentPage === pageNumber) {
      loadMoreBtn.style.display = 'none';
      endText.style.display = 'block'
  }
  
    if (currentHits === response.totalHits) {
      loadMoreBtn.style.display = 'none';
      endText.style.display = 'block'
    }
  }catch (err) { console.log }
  

}