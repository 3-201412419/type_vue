<template>
  <div class="movie-search-view">
    <h1>Movie Search</h1>
    <div class="search-container">
      <input v-model="searchQuery" @keyup.enter="searchMovies" placeholder="Search movies">
      <button @click="searchMovies">Search</button>
    </div>
    
    <div v-if="loading" class="loading">Loading...</div>
    
    <div v-else-if="movies.length" class="movie-list">
      <div v-for="movie in movies" :key="movie.id" class="movie-item">
        <img :src="getImageUrl(movie.poster_path)" :alt="movie.title">
        <h3>{{ movie.title }}</h3>
        <p>{{ movie.overview }}</p>
      </div>
    </div>
    
    <div v-else-if="error" class="error">{{ error }}</div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import axios from 'axios';

export default defineComponent({
  name: 'MovieSearchView',
  setup() {
    const API_KEY = process.env.VUE_APP_TMDB_API_KEY;
    const searchQuery = ref('');
    const movies = ref([]);
    const loading = ref(false);
    const error = ref('');

    const searchMovies = async () => {
      if (!searchQuery.value.trim()) return;

      loading.value = true;
      error.value = '';
      movies.value = [];

      try {
        const response = await axios.get('/api/tmdb/search/movie', {
          params: {
            api_key: API_KEY,
            query: searchQuery.value,
            language: 'ko-KR',
            page: 1,
            include_adult: true
          }
        });

        movies.value = response.data.results;
      } catch (err) {
        console.error('Error fetching movies:', err);
        error.value = 'An error occurred while fetching movies. Please try again.';
      } finally {
        loading.value = false;
      }
    };

    const getImageUrl = (path: string) => {
      return path ? `https://image.tmdb.org/t/p/w200${path}` : '/placeholder-image.jpg';
    };

    return {
      searchQuery,
      movies,
      loading,
      error,
      searchMovies,
      getImageUrl
    };
  }
});
</script>

<style scoped>
.movie-search-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.search-container {
  display: flex;
  margin-bottom: 20px;
}

input {
  flex-grow: 1;
  padding: 10px;
  font-size: 16px;
}

button {
  padding: 10px 20px;
  font-size: 16px;
  background-color: #4CAF50;
  color: white;
  border: none;
  cursor: pointer;
}

.loading, .error {
  text-align: center;
  margin-top: 20px;
}

.movie-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}

.movie-item {
  border: 1px solid #ddd;
  padding: 10px;
  text-align: center;
}

.movie-item img {
  max-width: 100%;
  height: auto;
}
</style>