import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import YoutubeView from '../views/YoutubeView.vue'
import movieView from '../views/MovieView.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/youtube',
    name: 'youtube',
    component : YoutubeView
  },
  {
    path : '/movies',
    name : 'movies',
    component : movieView
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
