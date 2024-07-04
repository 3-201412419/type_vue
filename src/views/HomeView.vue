<template>
  <div class="home">
    <nav>
        <button @click = "toggleMenu" class="hamburger-btn" :class = "{'open' : isMenuOpen}">
          <span></span>
          <span></span>
          <span></span>
        </button>
        <div v-if = "isMenuOpen" class = "menu-overlay" @click = "closeMenu"></div>
        <div class="menu" :class="{ 'menu-open': isMenuOpen}">
          <router-link to = "/" @click="closeMenu">Home</router-link>
          <router-link to = "/youtube" @click = "closeMenu">Youtube</router-link>
        </div>
    </nav>
    <h1> Steam Games Viewer</h1>
    <GameList />
  </div>
</template>

<script>
import {defineComponent, ref, onMounted, onUnmounted} from 'vue'
import GameList from '@/components/GameList.vue'

export default defineComponent({
  name : 'HomeView',
  components : {
    GameList
  },
  setup(){
    const isMenuOpen = ref(false);
    const toggleMenu = () => {
      isMenuOpen.value = !isMenuOpen.value;
    };

    const closeMenu = () => {
      isMenuOpen.value = false;
    };

    const handleOutsideClick = (event) => {
      if(isMenuOpen.value && !event.target.closest('.menu') && !event.target.closest('.hamburger-btn')){
        closeMenu();
      }
    };

    onMounted(() => {
      document.addEventListener('click', handleOutsideClick);
    })

    onUnmounted(() => {
      document.removeEventListener('click', handleOutsideClick);
    })

    return {
      isMenuOpen,
      toggleMenu,
      closeMenu
    }
  }
});
</script>

<style scoped>
.home h1 {
  text-align: center;
}

nav {
  position: relative;
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
  z-index : 6;
}

.menu-open {
  transform: translateX(0);
}

.menu a {
  font-size: 1.5rem;
  text-transform: uppercase;
  padding: 2rem 0;
  font-weight: bold;
  letter-spacing: 0.5rem;
  color: #0D0C1D;
  text-decoration: none;
  transition: color 0.3s linear;
  display: block;
  text-align: center;
}

.menu a:hover {
  color: #343078;
}
</style>