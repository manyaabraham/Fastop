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
    redirect: '/splash'
  },
  {
    path: '/splash',
    name: 'Splash',
    component: () => import('../views/SplashView.vue'),
    meta: { requiresAuth: false, hideNav: true }
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
  },
  // Catch-all route for 404 - must be last
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    redirect: '/dashboard'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guard - fixed without next() callback warning
router.beforeEach(async (to, from) => {
  const { data: { user } } = await supabase.auth.getUser()
  
  // If trying to go to splash and it was already shown in this session, skip it
  if (to.path === '/splash' && hasShownSplash()) {
    if (user) {
      return '/dashboard'
    } else {
      return '/login'
    }
  }
  
  // Mark splash as shown when we actually go to it
  if (to.path === '/splash') {
    markSplashShown()
  }
  
  // Auth checks
  if (user && (to.path === '/login' || to.path === '/signup')) {
    return '/dashboard'
  }
  
  if (to.meta.requiresAuth && !user) {
    return '/login'
  }
  
  return true
})

export default router