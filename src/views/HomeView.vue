<template>
  <div class="home">
    <h1> Steam Games Viewer</h1>
    <GameList />
  </div>
</template>

<script>
import {defineComponent} from 'vue'
import GameList from '@/components/GameList.vue'

export default defineComponent({
  name : 'HomeView',
  components : {
    GameList
  }
});
</script>
