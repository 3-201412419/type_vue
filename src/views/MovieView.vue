<template>
  <div class="movie-search">
    <nav>
      <button @click = "toggleMenu" class = "hamburger-btn" :class = "{'open' : isMenuOpen}">
        <span></span>
        <span></span>
        <span></span>
      </button>
      <div v-if = "isMenuOpen" class = "menu-overlay" @click = "closeMenu"></div>
      <div class = "menu" :class = "{ 'menu-open' : isMenuOpen}">
        <router-link to = "/" @click = "closeMenu"> Home </router-link>
        <router-link to = "/youtube" @click = "closeMenu"> Youtube</router-link>
        <router-link to = "/movies" @click = "closeMenu"> Movies</router-link>
      </div>
    </nav>
    <h1>Movie Search</h1>
    <div class="search-container">
      <input v-model="searchQuery" @keyup.enter="searchMovies" placeholder="Search movies">
      <select v-model="sortBy" @change="sortMovies">
        <option value="popularity">Popularity (High to Low)</option>
        <option value="vote_average">Rating (High to Low)</option>
        <option value="release_date">Release Date (Newest First)</option>
        <option value="title">Title (A-Z)</option>
      </select>
      <button @click="searchMovies">Search</button>
    </div>
    
    <div v-if="loading" class="loading">Loading...</div>
    
    <div v-else-if="sortedMovies.length" class="movie-list">
      <div v-for="movie in sortedMovies" :key="movie.id" class="movie-item">
        <img :src="getImageUrl(movie.poster_path)" :alt="movie.title">
        <h3>{{ movie.title }}</h3>
        <p>{{ movie.overview }}</p>
        <p>Rating: {{ movie.vote_average }}/10</p>
        <p>Release Date: {{ movie.release_date }}</p>
      </div>
    </div>
    
    <div v-else-if="error" class="error">{{ error }}</div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, onUnmounted } from 'vue';
import axios from 'axios';

interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  vote_average: number;
  release_date: string;
  popularity: number;
}

export default defineComponent({
  name: 'MovieSearchView',
  setup() {
    const searchQuery = ref('');
    const sortBy = ref('popularity');
    const movies = ref<Movie[]>([]);
    const loading = ref(false);
    const error = ref('');
    const isMenuOpen = ref(false);

    const toggleMenu = () => {
      isMenuOpen.value = !isMenuOpen.value;
    };

    const closeMenu = () => {
      isMenuOpen.value = false;
    }

    const handleOutsideClick = (event: MouseEvent) => {
      if(isMenuOpen.value && !((event.target as HTMLElement).closest('.menu') || (event.target as HTMLElement))){
        closeMenu();
      }
    };

    onMounted(() => {
      document.addEventListener('click', handleOutsideClick);
    });

    onUnmounted(() => {
      document.removeEventListener('click', handleOutsideClick);
    })

    const searchMovies = async () => {
      if (!searchQuery.value.trim()) return;

      loading.value = true;
      error.value = '';
      movies.value = [];

      try {
        const [koreanResponse, englishResponse] = await Promise.all([
          axios.get<{ results: Movie[] }>('/api/tmdb/search/movie', {
            params: {
              query: searchQuery.value,
              language: 'ko-KR',
              page: 1,
              include_adult: false,
              region: 'KR'
            }
          }),
          axios.get<{ results: Movie[] }>('/api/tmdb/search/movie', {
            params: {
              query: searchQuery.value,
              language: 'en-US',
              page: 1,
              include_adult: false
            }
          })
        ]);

        const koreanMovies = koreanResponse.data.results;
        const englishMovies = englishResponse.data.results;

        // Merge and deduplicate results
        const mergedMovies = [...koreanMovies, ...englishMovies];
        movies.value = Array.from(new Map(mergedMovies.map(movie => [movie.id, movie])).values());
      } catch (err) {
        console.error('Error fetching movies:', err);
        error.value = 'An error occurred while fetching movies. Please try again.';
      } finally {
        loading.value = false;
      }
    };

    const sortedMovies = computed(() => {
      return [...movies.value].sort((a, b) => {
        if (sortBy.value === 'title') {
          return a.title.localeCompare(b.title);
        } else if (sortBy.value === 'release_date') {
          return new Date(b.release_date).getTime() - new Date(a.release_date).getTime();
        } else {
          return (b[sortBy.value as keyof Movie] as number) - (a[sortBy.value as keyof Movie] as number);
        }
      });
    });

    const getImageUrl = (path: string) => {
      return path ? `https://image.tmdb.org/t/p/w200${path}` : '/placeholder-image.jpg';
    };

    return {
      searchQuery,
      sortBy,
      loading,
      error,
      sortedMovies,
      searchMovies,
      getImageUrl,
      isMenuOpen,
      toggleMenu,
      closeMenu
    };
  }
});
</script>

<style scoped>
.movie-search {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

nav {
  position: relative;
  margin-bottom: 20px;
}

.hamburger-btn {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width: 2rem;
  height: 2rem;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  z-index: 10;
}

.hamburger-btn span {
  width: 2rem;
  height: 0.25rem;
  background: #333;
  border-radius: 10px;
  transition: all 0.3s linear;
  position: relative;
  transform-origin: 1px;
}

.hamburger-btn.open span:nth-child(1) {
  transform: rotate(45deg);
}

.hamburger-btn.open span:nth-child(2) {
  opacity: 0;
  transform: translateX(20px);
}

.hamburger-btn.open span:nth-child(3) {
  transform: rotate(-45deg);
}

.menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 5;
}

.menu {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 300px;
  background-color: #f1f1f1;
  padding-top: 3.5rem;
  transition: transform 0.3s ease-in-out;
  transform: translateX(-100%);
  z-index: 6;
}

.menu-open {
  transform: translateX(0);
}

.menu a {
  font-size: 1.2rem;
  text-transform: uppercase;
  padding: 1.5rem 0;
  font-weight: bold;
  letter-spacing: 0.3rem;
  color: #2c3e50;
  text-decoration: none;
  transition: color 0.3s linear;
  display: block;
  text-align: center;
}

.menu a:hover {
  color: #42b983;
}

.search-container {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

input, select, button {
  margin: 0 5px;
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

.loading, .error {
  text-align: center;
  margin-top: 20px;
}
</style>