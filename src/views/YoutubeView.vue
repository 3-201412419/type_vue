<template>
  <div class="youtube-search">
    <input v-model ="searchQuery" @keyup.enter="searchVideos" placeholder = "Search Youtue videos">
    <button @click = "searchVideos">Search</button>

    <div v-if = "loading">Loading...</div>

    <div v-else-if = "videos.length" class="video-list">
      <div v-for = "video in videos" :key = "video.id.videoId" class="video-item">
        <img :src="video.snippet.thumbnails.medium.url" :alt = "video.snippet.title">
        <h3>{{ video.snippet.title}}</h3>
        <p>{{ video.snippet.description}}</p>
      </div>
    </div>

    <div v-else-if="error">{{ error }}</div>
  </div>
</template>

<script lang = "ts">
  import { defineComponent, ref } from 'vue';
  import axios from 'axios';

  interface VideoItem {
    id: {
      videoId : string;
    };

    snippet : {
      title : string;
      description : string;
      thumbnails : {
        medium : {
          url : string;
        };
      };
    };
  }

  export default defineComponent({
    name : 'YoutubeSearch',
    setup(){
      const API_KEY = 'AIzaSyA8zpWrP1-jNjf14CIBL-tW2dTTK_444XU';
      const searchQuery = ref('');
      const videos = ref<VideoItem[]>([]);
      const loading = ref(false);
      const error = ref('');

      const searchVideos = async () : Promise<void> => {
        if (!searchQuery.value.trim()) return;

        loading.value = true;
        error.value = '';
        videos.value = [];

        try {
          const response = await axios.get<{items : VideoItem[]}>('https://www.googleapis.com/youtube/v3/search', {
            params : {
              part : 'snippet',
              type : 'video',
              q : searchQuery.value,
              key : API_KEY,
              maxResults : 10
            }
          });

          videos.value = response.data.items;
        } catch(err){
          console.error('Error fetching YouTube videos:' , err);
          error.value = 'An error occurred While fetching videos. Please try again.';
        } finally {
          loading.value = false;
        }
      };

      return {
        searchQuery,
        videos,
        loading,
        error,
        searchVideos
      }
    }
  })

</script>

<style scoped>
.youtube-search {
  max-width: 800px;
  margin: 0 auto;
}

input {
  width: 70%;
  padding: 10px;
  font-size: 16px;
}

button {
  padding: 10px 20px;
  font-size: 16px;
  background-color: #ff0000;
  color: white;
  border: none;
  cursor: pointer;
}

.video-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.video-item {
  border: 1px solid #ddd;
  padding: 10px;
}

.video-item img {
  width: 100%;
  height: auto;
}
</style>
