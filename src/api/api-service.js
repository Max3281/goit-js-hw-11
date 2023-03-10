import axios from 'axios';

export default class ImageApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.totalCards = 0;
  }

  async fetchImages() {
    const ID_KEY = '34283172-0b08d30ba6284ca73fa07bc1d';
    const response = await axios.get(
      `https://pixabay.com/api/?key=${ID_KEY}&q=${this.searchQuery}&image_type=photo&page=${this.page}&per_page=40`
    );
    const newImage = await response.data;
    return newImage;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }

  get card() {
    return this.totalCards;
  }

  set card(total) {
    this.totalCards = total;
  }
}
