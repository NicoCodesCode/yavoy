import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import ProfileView from '@/views/ProfileView.vue'
import ApplyView from '@/views/ApplyView.vue'
import AdminView from '@/views/AdminView.vue'
import ProviderDashboardView from '@/views/ProviderDashboardView.vue'
import ClientBookingsView from '@/views/ClientBookingsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/profile/:username', name: 'profile', component: ProfileView },
    { path: '/apply', name: 'apply', component: ApplyView },
    { path: '/admin', name: 'admin', component: AdminView },
    { path: '/dashboard', name: 'dashboard', component: ProviderDashboardView },
    { path: '/bookings', name: 'bookings', component: ClientBookingsView },
  ],
})

export default router
