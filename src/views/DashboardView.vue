<template>
  <div class="dashboard-page">
    <div class="dashboard-container">
      <!-- Header with Logo -->
      <div class="header-section animate-slide-down">
        <div class="logo-container">
          <img 
            v-if="logoUrl" 
            :src="logoUrl" 
            alt="Fastop Logo" 
            class="header-logo"
          />
        </div>
        <div class="header-text">
          <h1 class="welcome-title">
            Good {{ timeOfDay }},
            <span class="gradient-text">{{ displayUsername || 'Student' }}</span>
          </h1>
          <p class="welcome-subtitle">Ready to organize your school supplies</p>
        </div>
      </div>

      <!-- Stats Grid - ALL CARDS CLICKABLE -->
      <div class="stats-grid">
        <!-- Shopping Lists - goes to Lists page -->
        <div class="stat-card glass-card animate-scale" @click="goToLists">
          <div class="stat-icon-wrapper">
          <img v-if="listUrl" :src="listUrl" alt="Fastop Logo" class="header-logo" />
        </div>
          
          <div class="stat-number">{{ stats.totalLists }}</div>
          <div class="stat-name">Shopping Lists</div>
          <div class="stat-hover-effect"></div>
        </div>



        <!-- Budget Left - goes to Budget page -->
        <div class="stat-card glass-card animate-scale" style="animation-delay: 0.2s" @click="goToBudget">
          <div class="stat-icon-wrapper">
              <img v-if="budgetUrl" :src="budgetUrl" alt="Fastop Logo" class="header-logo" />
        </div>
          <div class="stat-number">UGX {{ formatNumber(stats.budgetRemaining) }}</div>
          <div class="stat-name">Budget</div>
          <div class="stat-hover-effect"></div>
        </div>
      </div>

      <!-- Quick Actions -->
<div class="quick-actions">
  <h2 class="section-title animate-slide-right">Quick Actions</h2>
  <div class="actions-grid">
    <!-- New List Button - Teal/Cyan -->
    <button @click="showCreateList = true" class="action-btn primary animate-pulse-glow">
      <svg class="btn-icon" viewBox="0 0 24 24" fill="none">
        <path d="M12 4v16M4 12h16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.5" stroke-dasharray="4 3"/>
      </svg>
      <span>New List</span>
      <div class="btn-ripple"></div>
    </button>
    
    <!-- Search Prices Button - Blue/Purple -->
    <button @click="goToSearch" class="action-btn animate-pulse-glow" style="animation-delay: 0.1s">
      <svg class="btn-icon" viewBox="0 0 24 24" fill="none">
        <circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        <path d="M16.5 16.5L21 21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        <circle cx="11" cy="11" r="3" stroke="currentColor" stroke-width="1.5" stroke-dasharray="2 2"/>
      </svg>
      <span>Search Prices</span>
      <div class="btn-ripple"></div>
    </button>
    
    <!-- Shopping Mode Button - Green/Teal -->
    <button @click="goToShoppingMode" class="action-btn animate-pulse-glow" style="animation-delay: 0.2s">
      <svg class="btn-icon" viewBox="0 0 24 24" fill="none">
        <path d="M3 6h18l-2 10H5L3 6z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        <circle cx="9" cy="18" r="2" stroke="currentColor" stroke-width="2"/>
        <circle cx="17" cy="18" r="2" stroke="currentColor" stroke-width="2"/>
        <path d="M8 6l2-3h6l2 3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>
      <span>Shopping Mode</span>
      <div class="btn-ripple"></div>
    </button>
    
    <!-- Budget Button - Orange/Gold -->
    <button @click="goToBudget" class="action-btn animate-pulse-glow" style="animation-delay: 0.3s">
      <svg class="btn-icon" viewBox="0 0 24 24" fill="none">
        <path d="M12 2v4M12 18v4M4 12H2M22 12h-2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        <circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="2"/>
        <path d="M12 8v4l2 2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        <path d="M8 12a4 4 0 0 1 8 0" stroke="currentColor" stroke-width="1.5" stroke-dasharray="3 2"/>
      </svg>
      <span>Budget</span>
      <div class="btn-ripple"></div>
    </button>
  </div>
</div>

      <!-- Recent Lists -->
      <div class="recent-section">
        <h2 class="section-title animate-slide-right" style="animation-delay: 0.1s">Recent Lists</h2>
        <div v-if="shoppingStore.lists.length === 0" class="empty-state glass-card animate-fade-in">
          <p>No lists yet. Create your first shopping list</p>
        </div>
        <div v-else class="recent-lists">
          <div v-for="(list, index) in shoppingStore.lists.slice(0, 3)" :key="list.id" 
               class="list-card glass-card animate-slide-left"
               @click="goToList(list.id)"
               :style="{ animationDelay: `${0.2 + index * 0.1}s` }">
            <div class="list-info">
              <h3 class="list-name">{{ list.name }}</h3>
              <p class="list-date">{{ formatDate(list.created_at) }}</p>
            </div>
            <div class="list-arrow">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" stroke-width="2"/>
              </svg>
            </div>
            <div class="list-hover-effect"></div>
          </div>
        </div>
      </div>

      <!-- Create List Modal -->
      <div v-if="showCreateList" class="modal-overlay animate-fade-in" @click.self="showCreateList = false">
        <div class="modal-content glass-card animate-scale">
          <h2 class="modal-title">Create New List</h2>
          <input v-model="newListName" class="input-field" placeholder="Enter list name" />
          <div class="modal-buttons">
            <button @click="createList" class="btn-primary">Create</button>
            <button @click="showCreateList = false" class="btn-secondary">Cancel</button>
          </div>
        </div>
      </div>
      <!-- Beautiful Footer Statement -->
<div class="footer-statement animate-fade-in">
  
  <p class="footer-text">
    "Smart spending today, brighter tomorrow"
  </p>
  
  <div class="footer-decoration">
  </div>
</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useShoppingStore } from '../stores/shopping'
import { useBudgetStore } from '../stores/budget'
import { supabase } from '../supabase/client'

const router = useRouter()
const authStore = useAuthStore()
const shoppingStore = useShoppingStore()
const budgetStore = useBudgetStore()
const logoUrl = '/logo.png'
const listUrl = '/list.png'
const budgetUrl = '/icons/budget.png'

const showCreateList = ref(false)
const newListName = ref('')
const displayUsername = ref('')

const timeOfDay = computed(() => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Morning'
  if (hour < 17) return 'Afternoon'
  return 'Evening'
})

const stats = computed(() => ({
  totalLists: shoppingStore.lists.length,
  packedItems: shoppingStore.items.filter(i => i.packed).length,
  pendingItems: shoppingStore.items.filter(i => !i.purchased).length,
  budgetRemaining: (budgetStore.budget?.budget_amount || 0) - (budgetStore.budget?.spent_amount || 0)
}))

const formatNumber = (num) => num?.toLocaleString() || '0'
const formatDate = (date) => {
  const d = new Date(date)
  const now = new Date()
  const diffTime = Math.abs(now - d)
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  const diffHours = Math.floor(diffTime / (1000 * 60 * 60))
  const diffMinutes = Math.floor(diffTime / (1000 * 60))
  
  // Today
  if (diffDays === 0) {
    if (diffHours === 0) {
      if (diffMinutes < 1) return 'Just now'
      return `${diffMinutes} minute${diffMinutes === 1 ? '' : 's'} ago`
    }
    return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`
  }
  
  // Yesterday
  if (diffDays === 1) return 'Yesterday'
  
  // Less than 7 days
  if (diffDays < 7) return `${diffDays} days ago`
  
  // Format as day/date/month
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const dayName = days[d.getDay()]
  const day = d.getDate()
  const month = d.getMonth() + 1
  const year = d.getFullYear()
  const currentYear = now.getFullYear()
  
  if (year === currentYear) {
    return `${dayName}, ${day}/${month}`
  }
  
  return `${dayName}, ${day}/${month}/${year}`
}

const loadUsername = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  if (user) {
    const { data } = await supabase
      .from('profiles')
      .select('username')
      .eq('id', user.id)
      .single()
    displayUsername.value = data?.username || user.email.split('@')[0]
  }
}

const createList = async () => {
  if (newListName.value.trim()) {
    await shoppingStore.createList(newListName.value)
    showCreateList.value = false
    newListName.value = ''
  }
}

const goToLists = () => router.push('/lists')
const goToSearch = () => router.push('/search')
const goToChecklist = () => router.push('/checklist')
const goToBudget = () => router.push('/budget')
const goToList = (listId) => router.push(`/list/${listId}`)
const goToShoppingMode = () => {
  router.push('/shopping-mode')
} 

onMounted(async () => {
  await loadUsername()
  await shoppingStore.fetchLists()
  await budgetStore.fetchBudget()
})
</script>

<style scoped>
.dashboard-page {
  min-height: 100vh;
  background: #FFFFFF;
  overflow-y: auto;
  overflow-x: hidden;
  height: 100vh;
}

/* Quick Actions */
.quick-actions {
  margin: 25px 0;
}

.section-title {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 16px;
  color: #1A1A1A;
  position: relative;
  display: inline-block;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 40px;
  height: 3px;
  background: linear-gradient(90deg, #5DFF72, #34D399);
  border-radius: 3px;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
}

.action-btn {
  background: white;
  border: none;
  padding: 16px 12px;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-weight: 600;
  font-size: 13px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

/* Color variations for each button */
.action-btn.primary {
  background: linear-gradient(135deg, #0D9488 0%, #0F766E 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(13, 148, 136, 0.3);
}

.action-btn.primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(13, 148, 136, 0.4);
}

.action-btn:first-child:not(.primary) {
  background: linear-gradient(135deg, #0D9488 0%, #0F766E 100%);
  color: white;
}

/* Search button - Blue/Purple */
.action-btn:nth-child(2) {
  background: linear-gradient(135deg, #6366F1 0%, #4F46E5 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
}

.action-btn:nth-child(2):hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(99, 102, 241, 0.4);
}

/* Shopping Mode button - Emerald Green */
.action-btn:nth-child(3) {
  background: linear-gradient(135deg, #059669 0%, #047857 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(5, 150, 105, 0.3);
}

.action-btn:nth-child(3):hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(5, 150, 105, 0.4);
}

/* Budget button - Amber/Gold */
.action-btn:nth-child(4) {
  background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(245, 158, 11, 0.3);
}

.action-btn:nth-child(4):hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(245, 158, 11, 0.4);
}

.btn-icon {
  width: 28px;
  height: 28px;
  transition: all 0.3s;
}

.action-btn:hover .btn-icon {
  transform: scale(1.1);
}

.action-btn span {
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.3px;
}

/* Ripple effect */
.btn-ripple {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transform: translate(-50%, -50%);
  transition: width 0.4s, height 0.4s;
  pointer-events: none;
}

.action-btn:active .btn-ripple {
  width: 150px;
  height: 150px;
}

/* Pulse animation */
.animate-pulse-glow {
  animation: pulseGlow 2s ease infinite;
}

@keyframes pulseGlow {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.85;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  }
}

/* Dark mode styles */
.dark-mode .action-btn {
  background: #2A2A2A;
  color: #FFFFFF;
}

.dark-mode .action-btn.primary {
  background: linear-gradient(135deg, #0D9488 0%, #0F766E 100%);
}

.dark-mode .action-btn:nth-child(2) {
  background: linear-gradient(135deg, #6366F1 0%, #4F46E5 100%);
}

.dark-mode .action-btn:nth-child(3) {
  background: linear-gradient(135deg, #059669 0%, #047857 100%);
}

.dark-mode .action-btn:nth-child(4) {
  background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%);
}

.dark-mode .section-title {
  color: #FFFFFF;
}

/* Responsive */
@media (max-width: 600px) {
  .actions-grid {
    gap: 10px;
  }
  
  .action-btn {
    padding: 12px 8px;
  }
  
  .btn-icon {
    width: 24px;
    height: 24px;
  }
  
  .action-btn span {
    font-size: 11px;
  }
}

.dashboard-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  padding-bottom: 90px;
  overflow-y: auto;
  height: 100%;
}

/* Header Section with Logo */
.header-section {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 25px;
  padding: 15px;
  background: linear-gradient(135deg, #F8F9FA, #FFFFFF);
  border-radius: 24px;
}

.logo-container {
  flex-shrink: 0;
}

.header-logo {
  width: 55px;
  height: 55px;
  border-radius: 16px;
  object-fit: cover;
  box-shadow: 0 4px 15px rgba(93, 255, 114, 0.2);
  animation: rotateLogo 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

@keyframes rotateLogo {
  0% {
    transform: rotate(-180deg) scale(0);
    opacity: 0;
  }
  100% {
    transform: rotate(0deg) scale(1);
    opacity: 1;
  }
}

.header-text {
  flex: 1;
}

.welcome-title {
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 5px;
}

.gradient-text {
  background: linear-gradient(135deg, #5DFF72, #34D399);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: textShine 2s ease infinite;
}

@keyframes textShine {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.8; }
}

.welcome-subtitle {
  color: #6C757D;
  font-size: 13px;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  margin-bottom: 25px;
}

.stat-card {
  padding: 20px;
  text-align: center;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.stat-card:hover {
  transform: translateY(-8px) scale(1.02);
}

.stat-icon-wrapper {
  margin-bottom: 12px;
}

.stat-svg {
  width: 40px;
  height: 40px;
  color: #5DFF72;
  transition: all 0.3s;
}

.stat-card:hover .stat-svg {
  transform: scale(1.1) rotate(5deg);
}

.stat-number {
  font-size: 28px;
  font-weight: 800;
  color: #5DFF72;
  margin-bottom: 5px;
}

.stat-name {
  font-size: 12px;
  color: #6C757D;
  font-weight: 500;
}

.stat-hover-effect {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 0;
  background: linear-gradient(90deg, #5DFF72, #34D399);
  transition: height 0.3s ease;
  opacity: 0.1;
}

.stat-card:hover .stat-hover-effect {
  height: 100%;
}

/* Quick Actions */
.quick-actions {
  margin-bottom: 25px;
}

.section-title {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 15px;
  color: #1A1A1A;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.action-btn {
  background: #F8F9FA;
  border: 1px solid #E9ECEF;
  padding: 14px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  font-weight: 600;
  color: #495057;
  position: relative;
  overflow: hidden;
}

.action-btn.primary {
  background: linear-gradient(135deg, #5DFF72, #34D399);
  border: none;
  color: #0B0B0B;
}

.btn-icon {
  width: 20px;
  height: 20px;
  transition: transform 0.3s;
}

.action-btn:hover .btn-icon {
  transform: translateX(3px);
}

.action-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(93, 255, 114, 0.25);
}

.action-btn:active {
  transform: translateY(0);
}

.btn-ripple {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(93, 255, 114, 0.5);
  transform: translate(-50%, -50%);
  transition: width 0.4s, height 0.4s;
}

.action-btn:active .btn-ripple {
  width: 150px;
  height: 150px;
}

/* Recent Lists */
.recent-lists {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.list-card {
  padding: 18px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.list-card:hover {
  transform: translateX(8px);
  border-left: 3px solid #5DFF72;
}

.list-info {
  flex: 1;
  z-index: 1;
}

.list-name {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 4px;
  color: #1A1A1A;
}

.list-date {
  font-size: 11px;
  color: #ADB5BD;
}

.list-arrow svg {
  width: 24px;
  height: 24px;
  color: #5DFF72;
  transition: transform 0.3s;
}

.list-card:hover .list-arrow svg {
  transform: translateX(5px);
}

.list-hover-effect {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, rgba(93, 255, 114, 0.05), transparent);
  transform: translateX(-100%);
  transition: transform 0.3s;
}

.list-card:hover .list-hover-effect {
  transform: translateX(0);
}

.empty-state {
  text-align: center;
  padding: 40px;
  color: #ADB5BD;
}

/* Animations */
.animate-slide-down {
  animation: slideDown 0.5s ease-out;
}

.animate-slide-right {
  animation: slideRight 0.5s ease-out;
}

.animate-slide-left {
  animation: slideLeft 0.5s ease-out backwards;
}

.animate-scale {
  animation: scaleIn 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55) backwards;
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}

.animate-pulse-glow {
  animation: pulseGlow 2s ease infinite;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideRight {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideLeft {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes pulseGlow {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(93, 255, 114, 0.4);
  }
  50% {
    box-shadow: 0 0 0 10px rgba(93, 255, 114, 0);
  }
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  max-width: 400px;
  width: 90%;
  padding: 24px;
}

.modal-title {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 20px;
  text-align: center;
}

.modal-buttons {
  display: flex;
  gap: 12px;
  margin-top: 20px;
}

.modal-buttons button {
  flex: 1;
}

/* Dark Mode */
.dark-mode .dashboard-page {
  background: #1A1A1A;
}

.dark-mode .header-section {
  background: #2A2A2A;
}

.dark-mode .welcome-title,
.dark-mode .section-title,
.dark-mode .list-name,
.dark-mode .modal-title {
  color: #FFFFFF;
}

.dark-mode .welcome-subtitle,
.dark-mode .stat-name,
.dark-mode .list-date {
  color: #ADB5BD;
}

.dark-mode .action-btn {
  background: #2A2A2A;
  color: #FFFFFF;
  border-color: #3A3A3A;
}

.dark-mode .empty-state {
  color: #ADB5BD;
}
/* Footer Statement */
.footer-statement {
  margin-top: 40px;
  padding: 20px;
  text-align: center;
  animation: fadeIn 0.6s ease-out;
}

.footer-decoration {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 15px;
}

.decoration-line {
  width: 50px;
  height: 1px;
  background: linear-gradient(90deg, transparent, #5DFF72, transparent);
}

.decoration-star {
  font-size: 18px;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 0.6; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.1); }
}

.footer-text {
  font-size: 14px;
  font-weight: 500;
  color: #1A1A1A;
  background: linear-gradient(135deg, #5DFF72, #34D399);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  letter-spacing: 0.5px;
  position: relative;
  display: inline-block;
  padding: 0 20px;
}

/* Dark Mode */
.dark-mode .footer-text {
  background: linear-gradient(135deg, #5DFF72, #34D399);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

/* Mobile */
@media (max-width: 768px) {
  .footer-statement {
    margin-top: 30px;
    padding: 15px;
  }
  
  .decoration-line {
    width: 35px;
  }
  
  .footer-text {
    font-size: 12px;
  }
}
</style>