import { createRouter, createWebHistory } from 'vue-router'
import { supabase } from '../supabase/client'

// Check if splash has been shown in this session
const hasShownSplash = () => {
  return sessionStorage.getItem('splash_shown') === 'true'
}

const markSplashShown = () => {
  sessionStorage.setItem('splash_shown', 'true')
}

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/LoginView.vue'),
    meta: { requiresAuth: false, hideNav: true }
  },
  {
    path: '/signup',
    name: 'Signup',
    component: () => import('../views/SignupView.vue'),
    meta: { requiresAuth: false, hideNav: true }
  },
  {
    path: '/splash',
    name: 'Splash',
    component: () => import('../views/SplashView.vue'),
    meta: { requiresAuth: true, hideNav: true }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('../views/DashboardView.vue'),
    meta: { requiresAuth: true, hideNav: false }
  },
  {
    path: '/lists',
    name: 'ShoppingLists',
    component: () => import('../views/ShoppingListsView.vue'),
    meta: { requiresAuth: true, hideNav: false }
  },
  {
    path: '/list/:id',
    name: 'ShoppingDetail',
    component: () => import('../views/ShoppingDetailView.vue'),
    meta: { requiresAuth: true, hideNav: false }
  },
  {
    path: '/search',
    name: 'PriceSearch',
    component: () => import('../views/PriceSearchView.vue'),
    meta: { requiresAuth: true, hideNav: false }
  },
  {
    path: '/budget',
    name: 'Budget',
    component: () => import('../views/BudgetView.vue'),
    meta: { requiresAuth: true, hideNav: false }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('../views/ProfileView.vue'),
    meta: { requiresAuth: true, hideNav: false }
  },
  {
    path: '/edit-profile',
    name: 'EditProfile',
    component: () => import('../views/EditProfileView.vue'),
    meta: { requiresAuth: true, hideNav: false }
  },
  {
    path: '/support',
    name: 'Support',
    component: () => import('../views/SupportView.vue'),
    meta: { requiresAuth: true, hideNav: false }
  },
  {
    path: '/shopping-mode',
    name: 'ShoppingMode',
    component: () => import('../views/ShoppingModeView.vue'),
    meta: { requiresAuth: true, hideNav: true }
  },
  {
    path: '/shopping-clearance/:id',
    name: 'ShoppingClearance',
    component: () => import('../views/ShoppingClearanceView.vue'),
    meta: { requiresAuth: true, hideNav: true }
  },
  {
    path: '/purchase-history',
    name: 'PurchaseHistory',
    component: () => import('../views/PurchaseHistoryView.vue'),
    meta: { requiresAuth: true, hideNav: false }
  },
  {
    path: '/purchase-detail/:id',
    name: 'PurchaseDetail',
    component: () => import('../views/PurchaseDetailView.vue'),
    meta: { requiresAuth: true, hideNav: false }
  },
  {
    path: '/purchase-item-detail/:id',
    name: 'PurchaseItemDetail',
    component: () => import('../views/PurchaseDetailView.vue'),
    meta: { requiresAuth: true, hideNav: false }
  },
  {
    path: '/expenditure-history',
    name: 'ExpenditureHistory',
    component: () => import('../views/ExpenditureHistoryView.vue'),
    meta: { requiresAuth: true, hideNav: false }
  },
  {
    path: '/download',
    name: 'Download',
    component: () => import('../views/DownloadView.vue'),
    meta: { requiresAuth: false, hideNav: true }
  },
  {
    path: '/packing-checklist',
    name: 'PackingChecklist',
    component: () => import('../views/PackingChecklistView.vue'),
    meta: { requiresAuth: true, hideNav: false }
  },
  {
    path: '/checklist',
    redirect: '/packing-checklist'
  },
  {
    path: '/packing-detail/:id',
    name: 'PackingDetail',
    component: () => import('../views/PackingDetailView.vue'),
    meta: { requiresAuth: true, hideNav: true }
  }
]



const router = createRouter({
  history: createWebHistory(),
  routes
})


export default router