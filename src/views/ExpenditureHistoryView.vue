<template>
  <div class="expenditure-page">
    <div class="container">
      <!-- Header -->
      <div class="header animate-slide-down">
        <button class="back-button" @click="$router.back()">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" stroke-width="2"/>
          </svg>
        </button>
        <div class="logo-area">
          <img v-if="logoUrl" :src="logoUrl" alt="Fastop Logo" class="header-logo animate-rotate" />
        </div>
        <div class="title-area">
          <h1 class="page-title gradient-text animate-fade-in">Expenditure History</h1>
          <p class="page-subtitle animate-fade-in" style="animation-delay: 0.1s">Track all your cleared expenses</p>
        </div>
        <div class="menu-container">
          <button class="menu-btn" @click="toggleMenu">
            <svg viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="1.5" fill="currentColor"/>
              <circle cx="12" cy="5" r="1.5" fill="currentColor"/>
              <circle cx="12" cy="19" r="1.5" fill="currentColor"/>
            </svg>
          </button>
          
          <div v-if="showMenu" class="dropdown-menu animate-dropdown">
            <button @click="confirmDeleteAll" class="dropdown-item danger" :disabled="expenditures.length === 0">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" stroke-width="2"/>
              </svg>
              Delete All History
              <span v-if="expenditures.length > 0" class="item-count-badge">{{ expenditures.length }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Filter Section -->
      <div class="filter-section animate-scale" style="animation-delay: 0.15s">
        <div class="filter-header" @click="showFilters = !showFilters">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2"/>
          </svg>
          <span>Filter by Date</span>
        </div>
        <div v-show="showFilters" class="filter-content">
          <div class="filter-buttons">
            <button @click="setDateFilter('week')" :class="{ active: dateFilter === 'week' }" class="filter-btn">Last 7 Days</button>
            <button @click="setDateFilter('month')" :class="{ active: dateFilter === 'month' }" class="filter-btn">Last 30 Days</button>
            <button @click="setDateFilter('all')" :class="{ active: dateFilter === 'all' }" class="filter-btn">All Time</button>
          </div>
        </div>
      </div>

      <!-- Expenditures List -->
      <div v-if="filteredExpenditures.length === 0" class="empty-state glass-card animate-fade-in" style="animation-delay: 0.2s">
        <div class="empty-icon animate-bounce">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M12 8v4l3 3M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" stroke="currentColor" stroke-width="1.5"/>
            <path d="M12 6v2M12 12v2" stroke="currentColor" stroke-width="1.5"/>
          </svg>
        </div>
        <h3>No Expenditure Records</h3>
        <p>Clear spent amounts from the budget page to see them here</p>
        <button @click="$router.push('/budget')" class="btn-primary animate-pulse">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2"/>
          </svg>
          Go to Budget
        </button>
      </div>

    <div v-else class="expenditures-list">
  <div v-for="(exp, index) in filteredExpenditures" :key="exp.id" 
      class="expenditure-card glass-card animate-slide-left"
             :style="{ animationDelay: `${0.3 + index * 0.05}s` }">
          <div class="card-header">
            <div class="date-badge">
              <svg viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5"/>
                <polyline points="12 6 12 12 16 14" stroke="currentColor" stroke-width="1.5"/>
              </svg>
              <span>{{ formatDate(exp.created_at) }}</span>
            </div>
            <div class="amount-badge">UGX {{ formatNumber(exp.amount) }}</div>
          </div>
          
          <div class="card-details">
            <div class="detail-item">
              <span class="detail-label">Budget at Time</span>
              <span class="detail-value">UGX {{ formatNumber(exp.budget_amount) }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Remaining After</span>
              <span class="detail-value">UGX {{ formatNumber(exp.remaining_budget) }}</span>
            </div>
          </div>
          
          <div class="card-progress">
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: getSpentPercentage(exp) + '%' }"></div>
            </div>
           <div class="progress-labels">
  <span>Spent: {{ getSpentPercentage(exp).toFixed(2) }}%</span>
  <span>Left: {{ (100 - getSpentPercentage(exp)).toFixed(2) }}%</span>
</div>
          </div>
        </div>
      </div>


      <!-- Footer Sentence -->
      <div class="footer-sentence animate-fade-in">
        <p class="sentence-text">Every shilling spent wisely brings you closer to your goals! </p>
      </div>
    </div>

    <!-- Delete All Confirmation Modal -->
    <div v-if="showDeleteModal" class="modal-overlay" @click.self="showDeleteModal = false">
      <div class="modal-content glass-card animate-scale">
        <div class="modal-icon warning">
          <svg viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
            <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" stroke-width="2"/>
            <circle cx="12" cy="16" r="1" fill="currentColor"/>
          </svg>
        </div>
        <h2 class="modal-title">Delete All History?</h2>
        <p class="confirm-message">Are you sure you want to permanently delete ALL expenditure records?</p>
        <div class="warning-text">
          <strong>⚠️ This will permanently delete:</strong>
          <ul>
            <li>{{ expenditures.length }} transaction record(s)</li>
            <li>UGX {{ formatNumber(totalSpent) }} in expenditure history</li>
          </ul>
        </div>
        <p class="delete-warning">This action cannot be undone!</p>
        <div class="modal-buttons">
          <button @click="deleteAllHistory" class="btn-danger" :disabled="isDeleting">
            {{ isDeleting ? 'Deleting...' : 'Yes, Delete All' }}
          </button>
          <button @click="showDeleteModal = false" class="btn-secondary">Cancel</button>
        </div>
      </div>
    </div>

    <!-- Notification Toast -->
    <div v-if="showNotification" class="notification-toast animate-slide-up" :class="notificationType">
      <div class="notification-content">
        <svg v-if="notificationType === 'success'" viewBox="0 0 24 24" fill="none">
          <path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="3"/>
        </svg>
        <svg v-else viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
          <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" stroke-width="2"/>
        </svg>
        <span>{{ notificationMessage }}</span>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { supabase } from '../supabase/client'

const logoUrl = '/logo.png'
const expenditures = ref([])
const dateFilter = ref('all')
const showFilters = ref(false)
const showMenu = ref(false)
const showDeleteModal = ref(false)
const isDeleting = ref(false)

// Notification
const showNotification = ref(false)
const notificationMessage = ref('')
const notificationType = ref('success')
let notificationTimeout = null

const showNotificationMessage = (message, type = 'success') => {
  notificationMessage.value = message
  notificationType.value = type
  showNotification.value = true
  
  if (notificationTimeout) clearTimeout(notificationTimeout)
  notificationTimeout = setTimeout(() => {
    showNotification.value = false
  }, 3000)
}

const formatNumber = (num) => num?.toLocaleString() || '0'

const formatDate = (date) => {
  const d = new Date(date)
  const now = new Date()
  const diffTime = Math.abs(now - d)
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  const diffHours = Math.floor(diffTime / (1000 * 60 * 60))
  const diffMinutes = Math.floor(diffTime / (1000 * 60))
  
  if (diffDays === 0) {
    if (diffHours === 0) {
      if (diffMinutes < 1) return 'Just now'
      return `${diffMinutes} minute${diffMinutes === 1 ? '' : 's'} ago`
    }
    return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`
  }
  
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  
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

const roundToTwo = (num) => {
  return Math.round(num * 100) / 100
}

const getSpentPercentage = (exp) => {
  if (exp.budget_amount === 0) return 0
  const percentage = (exp.amount / exp.budget_amount) * 100
  return roundToTwo(Math.min(percentage, 100))
}

const totalSpent = computed(() => {
  return filteredExpenditures.value.reduce((sum, exp) => sum + (exp.amount || 0), 0)
})

const filteredExpenditures = computed(() => {
  let filtered = [...expenditures.value]
  
  const now = new Date()
  if (dateFilter.value === 'week') {
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    filtered = filtered.filter(exp => new Date(exp.created_at) >= weekAgo)
  } else if (dateFilter.value === 'month') {
    const monthAgo = new Date()
    monthAgo.setMonth(monthAgo.getMonth() - 1)
    filtered = filtered.filter(exp => new Date(exp.created_at) >= monthAgo)
  }
  
  return filtered
})

const setDateFilter = (filter) => {
  dateFilter.value = filter
  showFilters.value = false
}

const toggleMenu = () => {
  showMenu.value = !showMenu.value
}

const confirmDeleteAll = () => {
  if (expenditures.value.length === 0) {
    showNotificationMessage('No records to delete', 'error')
    return
  }
  showMenu.value = false
  showDeleteModal.value = true
}

// PERMANENT DELETE - This actually deletes from database
const deleteAllHistory = async () => {
  if (isDeleting.value) return
  
  isDeleting.value = true
  
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      showNotificationMessage('Please login first', 'error')
      return
    }
    
    // Step 1: Delete all expenditure history records for this user
    const { error: deleteError } = await supabase
      .from('expenditure_history')
      .delete()
      .eq('user_id', user.id)
    
    if (deleteError) throw deleteError
    
    // Step 2: Clear the local array
    expenditures.value = []
    
    // Step 3: Close modal
    showDeleteModal.value = false
    
    // Step 4: Show success message
    showNotificationMessage('All expenditure history permanently deleted!', 'success')
    
  } catch (error) {
    console.error('Error deleting history:', error)
    showNotificationMessage('Error deleting history. Please try again.', 'error')
  } finally {
    isDeleting.value = false
  }
}

const loadExpenditures = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    
    // Only load records that haven't been deleted
    const { data, error } = await supabase
      .from('expenditure_history')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    
    if (data) {
      expenditures.value = data
    }
  } catch (error) {
    console.error('Error loading expenditures:', error)
  }
}

// Close menu when clicking outside
const handleClickOutside = (e) => {
  if (!e.target.closest('.menu-btn') && !e.target.closest('.dropdown-menu')) {
    showMenu.value = false
  }
}

// Real-time subscription to listen for changes
let historySubscription = null

const setupRealtimeSubscription = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return
  
  historySubscription = supabase
    .channel('expenditure_changes')
    .on('postgres_changes', {
      event: 'DELETE',
      schema: 'public',
      table: 'expenditure_history',
      filter: `user_id=eq.${user.id}`
    }, (payload) => {
      // Remove deleted item from local array immediately
      const deletedId = payload.old.id
      const index = expenditures.value.findIndex(exp => exp.id === deletedId)
      if (index !== -1) {
        expenditures.value.splice(index, 1)
      }
    })
    .subscribe()
}

onMounted(async () => {
  await loadExpenditures()
  await setupRealtimeSubscription()
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  if (historySubscription) {
    supabase.removeChannel(historySubscription)
  }
  document.removeEventListener('click', handleClickOutside)
  if (notificationTimeout) clearTimeout(notificationTimeout)
})
</script>

<style scoped>
.expenditure-page {
  min-height: 100vh;
  background: #FFFFFF;
  overflow-y: auto;
  height: 100vh;
}

.container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  padding-bottom: 90px;
}

/* Header */
.header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 25px;
  padding: 15px;
  background: linear-gradient(135deg, #F8F9FA, #FFFFFF);
  border-radius: 24px;
  animation: slideDown 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-50px) rotateX(-30deg);
  }
  to {
    opacity: 1;
    transform: translateY(0) rotateX(0);
  }
}

.back-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.back-button svg {
  width: 24px;
  height: 24px;
  color: #1A1A1A;
}

.back-button:hover {
  background: #F0F0F0;
  transform: translateX(-3px);
}

.logo-area {
  flex-shrink: 0;
}

.header-logo {
  width: 45px;
  height: 45px;
  border-radius: 12px;
  object-fit: cover;
  box-shadow: 0 4px 15px rgba(93, 255, 114, 0.2);
}

.animate-rotate {
  animation: rotateLogo 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

@keyframes rotateLogo {
  0% {
    transform: rotate(-200deg) scale(0);
    opacity: 0;
  }
  100% {
    transform: rotate(0deg) scale(1);
    opacity: 1;
  }
}

.title-area {
  flex: 1;
}

.page-title {
  font-size: 20px;
  font-weight: 700;
  margin: 0;
  margin-bottom: 4px;
}

.gradient-text {
  background: linear-gradient(135deg, #5DFF72, #34D399);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.animate-fade-in {
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.page-subtitle {
  font-size: 11px;
  color: #6C757D;
  margin: 0;
}

/* Menu Container */
.menu-container {
  position: relative;
}

.menu-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 12px;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.menu-btn svg {
  width: 24px;
  height: 24px;
  color: #1A1A1A;
  transition: all 0.3s;
}

.menu-btn:hover {
  background: #F0F0F0;
  transform: rotate(90deg);
}

/* Dropdown Menu */
.dropdown-menu {
  position: absolute;
  top: 45px;
  right: 0;
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  z-index: 100;
  min-width: 220px;
}

.animate-dropdown {
  animation: dropdownFade 0.2s ease-out;
}

@keyframes dropdownFade {
  from { opacity: 0; transform: scale(0.95) translateY(-10px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}

.dropdown-item {
  width: 100%;
  padding: 14px 18px;
  display: flex;
  align-items: center;
  gap: 12px;
  background: none;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 14px;
  font-weight: 500;
  color: #1A1A1A;
}

.dropdown-item svg {
  width: 18px;
  height: 18px;
}

.dropdown-item:hover:not(:disabled) {
  background: #F8F9FA;
  transform: translateX(5px);
}

.dropdown-item.danger {
  color: #ff4444;
}

.dropdown-item.danger svg {
  color: #ff4444;
}

.dropdown-item:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.item-count-badge {
  margin-left: auto;
  background: #ff4444;
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 700;
}

/* Filter Section */
.filter-section {
  background: #F8F9FA;
  border-radius: 16px;
  margin-bottom: 20px;
  overflow: hidden;
  animation: scaleIn 0.4s ease-out;
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.filter-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  color: #1A1A1A;
  transition: all 0.3s;
}

.filter-header svg {
  width: 16px;
  height: 16px;
  transition: transform 0.3s;
}

.filter-content {
  padding: 12px;
  border-top: 1px solid #E9ECEF;
}

.filter-buttons {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.filter-btn {
  padding: 6px 16px;
  background: white;
  border: 1px solid #E9ECEF;
  border-radius: 20px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.3s;
}

.filter-btn.active {
  background: #5DFF72;
  border-color: #5DFF72;
  color: #0B0B0B;
}

.filter-btn:hover {
  transform: translateY(-2px);
}

/* Expenditures List */
.expenditures-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
}

.expenditure-card {
  padding: 16px;
  transition: all 0.3s;
  animation: slideLeft 0.4s ease-out backwards;
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

.expenditure-card:hover {
  transform: translateX(5px);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 10px;
  border-bottom: 1px solid #F0F0F0;
}

.date-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: #6C757D;
}

.date-badge svg {
  width: 14px;
  height: 14px;
}

.amount-badge {
  font-size: 18px;
  font-weight: 800;
  color: #5DFF72;
}

.card-details {
  display: flex;
  gap: 20px;
  margin-bottom: 12px;
}

.detail-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.detail-label {
  font-size: 10px;
  color: #ADB5BD;
}

.detail-value {
  font-size: 13px;
  font-weight: 600;
  color: #1A1A1A;
}

.card-progress {
  margin-top: 8px;
}

.progress-bar {
  height: 6px;
  background: #F0F0F0;
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 6px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #5DFF72, #34D399);
  border-radius: 10px;
  transition: width 0.5s ease;
}

.progress-labels {
  display: flex;
  justify-content: space-between;
  font-size: 10px;
  color: #ADB5BD;
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  padding: 15px;
  animation: fadeIn 0.5s ease-out;
}

.page-btn {
  background: #F8F9FA;
  border: none;
  padding: 8px 12px;
  border-radius: 40px;
  cursor: pointer;
  transition: all 0.3s;
}

.page-btn svg {
  width: 18px;
  height: 18px;
}

.page-btn:hover:not(:disabled) {
  background: #5DFF72;
  transform: scale(1.05);
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  font-size: 13px;
  font-weight: 600;
  color: #1A1A1A;
}

/* Footer Sentence */
.footer-sentence {
  margin-top: 40px;
  padding: 25px 20px;
  text-align: center;
  border-top: 1px solid rgba(93, 255, 114, 0.15);
  background: linear-gradient(180deg, transparent, rgba(93, 255, 114, 0.03));
  border-radius: 20px;
}

.sentence-decoration {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 15px;
}

.sentence-decoration .dot {
  width: 4px;
  height: 4px;
  background: #5DFF72;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

.sentence-decoration .line {
  width: 40px;
  height: 1px;
  background: linear-gradient(90deg, transparent, #5DFF72, #5DFF72, transparent);
}

.sentence-decoration .star {
  font-size: 14px;
  animation: rotate 3s linear infinite;
  display: inline-block;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.sentence-text {
  font-size: 12px;
  font-weight: 500;
  background: linear-gradient(135deg, #5DFF72, #34D399);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  letter-spacing: 0.5px;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  animation: fadeIn 0.5s ease-out;
}

.empty-icon svg {
  width: 80px;
  height: 80px;
  color: #5DFF72;
  margin-bottom: 20px;
  opacity: 0.5;
}

.animate-bounce {
  animation: bounce 2s ease infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.empty-state h3 {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 10px;
  color: #1A1A1A;
}

.empty-state p {
  color: #ADB5BD;
  margin-bottom: 25px;
}

.btn-primary {
  background: linear-gradient(135deg, #5DFF72, #34D399);
  border: none;
  padding: 12px 24px;
  border-radius: 40px;
  font-weight: 600;
  color: #0B0B0B;
  cursor: pointer;
  transition: all 0.3s;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.btn-primary svg {
  width: 18px;
  height: 18px;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(93, 255, 114, 0.3);
}

.animate-pulse {
  animation: pulseGlow 2s ease infinite;
}

@keyframes pulseGlow {
  0%, 100% { box-shadow: 0 0 0 0 rgba(93, 255, 114, 0.4); }
  50% { box-shadow: 0 0 0 10px rgba(93, 255, 114, 0); }
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease-out;
}

.modal-content {
  max-width: 400px;
  width: 90%;
  padding: 28px;
  text-align: center;
  background: white;
  border-radius: 20px;
  animation: scaleIn 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.modal-icon.warning svg {
  color: #ff4444;
  width: 60px;
  height: 60px;
  margin: 0 auto 15px;
}

.modal-title {
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 15px;
  color: #1A1A1A;
}

.confirm-message {
  color: #6C757D;
  margin-bottom: 10px;
}

.warning-text {
  background: rgba(255, 68, 68, 0.1);
  border-left: 3px solid #ff4444;
  padding: 12px;
  border-radius: 8px;
  margin: 15px 0;
  text-align: left;
}

.warning-text strong {
  color: #ff4444;
  font-size: 13px;
  display: block;
  margin-bottom: 8px;
}

.warning-text ul {
  margin: 0;
  padding-left: 20px;
}

.warning-text li {
  color: #6C757D;
  font-size: 12px;
  margin-bottom: 5px;
}

.delete-warning {
  text-align: center;
  color: #ff4444;
  font-size: 12px;
  margin-bottom: 20px;
}

.modal-buttons {
  display: flex;
  gap: 12px;
}

.modal-buttons button {
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-danger {
  background: #ff4444;
  color: white;
}

.btn-danger:hover:not(:disabled) {
  background: #cc0000;
  transform: translateY(-2px);
}

.btn-danger:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  background: #F0F0F0;
  color: #666;
}

.btn-secondary:hover {
  transform: translateY(-2px);
  background: #E0E0E0;
}

/* Notification Toast */
.notification-toast {
  position: fixed;
  bottom: 100px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2000;
  max-width: 90%;
  min-width: 280px;
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from { opacity: 0; transform: translateX(-50%) translateY(20px); }
  to { opacity: 1; transform: translateX(-50%) translateY(0); }
}

.notification-content {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 20px;
  background: white;
  border-radius: 60px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  font-size: 14px;
  font-weight: 500;
}

.notification-toast.success .notification-content {
  background: #10B981;
  color: white;
}

.notification-toast.error .notification-content {
  background: #EF4444;
  color: white;
}

.notification-content svg {
  width: 20px;
  height: 20px;
}

.notification-toast.success .notification-content svg {
  color: white;
}

/* Dark Mode */
.dark-mode .expenditure-page {
  background: #1A1A1A;
}

.dark-mode .header {
  background: #2A2A2A;
}

.dark-mode .back-button svg,
.dark-mode .menu-btn svg {
  color: #FFFFFF;
}

.dark-mode .back-button:hover,
.dark-mode .menu-btn:hover {
  background: #3A3A3A;
}

.dark-mode .page-subtitle {
  color: #ADB5BD;
}

.dark-mode .filter-section {
  background: #2A2A2A;
}

.dark-mode .filter-header {
  color: #FFFFFF;
}

.dark-mode .filter-content {
  border-top-color: #3A3A3A;
}

.dark-mode .filter-btn {
  background: #1A1A1A;
  border-color: #3A3A3A;
  color: #FFFFFF;
}

.dark-mode .dropdown-menu {
  background: #2A2A2A;
}

.dark-mode .dropdown-item {
  color: #FFFFFF;
}

.dark-mode .dropdown-item:hover:not(:disabled) {
  background: #3A3A3A;
}

.dark-mode .expenditure-card,
.dark-mode .modal-content {
  background: #2A2A2A;
}

.dark-mode .card-header {
  border-bottom-color: #3A3A3A;
}

.dark-mode .detail-value,
.dark-mode .page-info,
.dark-mode .modal-title {
  color: #FFFFFF;
}

.dark-mode .detail-label,
.dark-mode .progress-labels,
.dark-mode .confirm-message,
.dark-mode .warning-text li {
  color: #ADB5BD;
}

.dark-mode .page-btn {
  background: #2A2A2A;
}

.dark-mode .page-btn svg {
  color: #FFFFFF;
}

.dark-mode .footer-sentence {
  border-top-color: rgba(93, 255, 114, 0.2);
  background: linear-gradient(180deg, transparent, rgba(93, 255, 114, 0.05));
}

.dark-mode .empty-state h3 {
  color: #FFFFFF;
}

.dark-mode .btn-secondary {
  background: #3A3A3A;
  color: #FFFFFF;
}

.dark-mode .btn-secondary:hover {
  background: #4A4A4A;
}

.dark-mode .notification-content {
  background: #2A2A2A;
  color: white;
}
</style>