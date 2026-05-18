<template>
  <div class="purchase-history-page">
    <div class="history-container">
      <!-- Header -->
      <div class="header animate-slide-down">
        <button class="back-button" @click="$router.back()">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" stroke-width="2"/>
          </svg>
        </button>
        <h1 class="page-title">Purchase History</h1>
        <div class="header-actions">
          <div class="stats-badge">{{ purchases.length }} trips</div>
          <div class="three-dot-menu" @click.stop="toggleDropdown">
            <svg viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="1.5" fill="currentColor"/>
              <circle cx="12" cy="5" r="1.5" fill="currentColor"/>
              <circle cx="12" cy="19" r="1.5" fill="currentColor"/>
            </svg>
          </div>
          <div v-if="showDropdown" class="dropdown-menu animate-dropdown">
            <button @click="clearAllHistory" class="dropdown-item danger" :disabled="purchases.length === 0">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" stroke-width="2"/>
              </svg>
              Clear All History
              <span v-if="purchases.length > 0" class="item-count-badge">{{ purchases.length }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Summary Stats -->
      <div class="summary-stats animate-scale">
        <div class="stat-card">
          <div class="stat-value">{{ totalTrips }}</div>
          <div class="stat-label">Shopping Trips</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ totalItemsPurchased }}</div>
          <div class="stat-label">Items Bought</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">UGX {{ formatNumber(totalSpentAll) }}</div>
          <div class="stat-label">Total Spent</div>
        </div>
      </div>

      <!-- Purchases List - Each tile is clickable -->
      <div v-if="purchases.length > 0" class="purchases-list">
        <div v-for="(purchase, index) in purchases" :key="purchase.id" 
             class="purchase-card glass-card animate-slide-left clickable-tile"
             @click="viewFullDetails(purchase)"
             :style="{ animationDelay: `${index * 0.05}s` }">
          
          <div class="purchase-icon">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" stroke-width="1.5"/>
              <polyline points="22,6 12,13 2,6" stroke="currentColor" stroke-width="1.5"/>
            </svg>
          </div>
          
          <div class="purchase-info">
            <h3 class="purchase-list">{{ purchase.list_name || 'Shopping List' }}</h3>
            <div class="purchase-meta">
              <span class="purchase-date">
                <svg viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5"/>
                  <polyline points="12 6 12 12 16 14" stroke="currentColor" stroke-width="1.5"/>
                </svg>
                {{ formatDate(purchase.purchased_at) }}
              </span>
              <span class="purchase-items-count">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M20 12V8H4v12h16v-4M12 4v4M8 4v4M16 4v4" stroke="currentColor" stroke-width="1.5"/>
                </svg>
                {{ purchase.items.length }} items
              </span>
            </div>
          </div>
          
          <div class="purchase-right">
            <div class="purchase-amount">UGX {{ formatNumber(purchase.total_amount) }}</div>
            <div class="arrow-icon">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="empty-state glass-card animate-fade-in">
        <div class="empty-icon">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M20 12V8H4v12h16v-4M12 4v4M8 4v4M16 4v4" stroke="currentColor" stroke-width="1.5"/>
            <circle cx="12" cy="16" r="2" stroke="currentColor" stroke-width="1.5"/>
          </svg>
        </div>
        <h3>No Purchase History Yet</h3>
        <p>Your completed shopping trips will appear here</p>
        <button @click="goToShoppingMode" class="btn-primary">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2"/>
          </svg>
          Start Shopping
        </button>
      </div>
    </div>

    <!-- Clear All History Confirmation Modal -->
    <div v-if="showClearModal" class="modal-overlay" @click.self="showClearModal = false">
      <div class="modal-content glass-card animate-scale">
        <div class="modal-header">
          <h2 class="modal-title">Clear All History?</h2>
          <button class="close-modal" @click="showClearModal = false">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2"/>
            </svg>
          </button>
        </div>
        
        <div class="modal-icon warning">
          <svg viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
            <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" stroke-width="2"/>
            <circle cx="12" cy="16" r="1" fill="currentColor"/>
          </svg>
        </div>
        
        <p class="confirm-message">This action cannot be undone.</p>
        <div class="warning-text">
          <strong>⚠️ This will permanently delete:</strong>
          <ul>
            <li>{{ purchases.length }} purchase trip(s)</li>
            <li>{{ totalItemsPurchased }} item record(s)</li>
            <li>UGX {{ formatNumber(totalSpentAll) }} in transaction history</li>
          </ul>
        </div>
        <p class="confirm-question">Are you sure you want to clear ALL purchase history?</p>
        
        <div class="modal-buttons">
          <button @click="confirmClearAll" class="btn-clear-confirm" :disabled="isClearing">
            {{ isClearing ? 'Clearing...' : 'Yes, Clear All' }}
          </button>
          <button @click="showClearModal = false" class="btn-secondary">Cancel</button>
        </div>
      </div>
    </div>

    <!-- Success Toast -->
    <div v-if="showToast" class="toast-message animate-slide-up" :class="toastType">
      <svg viewBox="0 0 24 24" fill="none">
        <path v-if="toastType === 'success'" d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2"/>
        <path v-else d="M12 8v4m0 4h.01M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z" stroke="currentColor" stroke-width="2"/>
      </svg>
      <span>{{ toastMessage }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../supabase/client'

const router = useRouter()
const purchases = ref([])
const showClearModal = ref(false)
const showDropdown = ref(false)
const showToast = ref(false)
const toastMessage = ref('')
const toastType = ref('success')
const isClearing = ref(false)

const totalTrips = computed(() => purchases.value.length)
const totalItemsPurchased = computed(() => {
  return purchases.value.reduce((sum, p) => sum + (p.items?.length || 0), 0)
})
const totalSpentAll = computed(() => {
  return purchases.value.reduce((sum, p) => sum + (p.total_amount || 0), 0)
})

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

const loadPurchaseHistory = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  if (user) {
    const { data } = await supabase
      .from('purchase_history')
      .select('*')
      .eq('user_id', user.id)
      .order('purchased_at', { ascending: false })
    
    if (data) {
      purchases.value = data
    }
  }
}

// View full details - navigate to detailed page for entire purchase
const viewFullDetails = (purchase) => {
  router.push({
    path: `/purchase-detail/${purchase.id}`,
    query: { 
      list_name: purchase.list_name,
      purchased_at: purchase.purchased_at,
      total_amount: purchase.total_amount
    }
  })
}

// Dropdown handlers
const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value
}

const closeDropdown = () => {
  showDropdown.value = false
}

const clearAllHistory = () => {
  if (purchases.value.length === 0) {
    showToastMessage('No history to clear', 'warning')
    closeDropdown()
    return
  }
  closeDropdown()
  showClearModal.value = true
}

const confirmClearAll = async () => {
  if (isClearing.value) return
  
  isClearing.value = true
  
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    
    const { error } = await supabase
      .from('purchase_history')
      .delete()
      .eq('user_id', user.id)
    
    if (error) throw error
    
    purchases.value = []
    
    showToastMessage('✅ All purchase history has been cleared successfully!', 'success')
    showClearModal.value = false
    
  } catch (error) {
    console.error('Error clearing history:', error)
    showToastMessage('❌ Error clearing history. Please try again.', 'error')
  } finally {
    isClearing.value = false
  }
}

const showToastMessage = (message, type = 'success') => {
  toastMessage.value = message
  toastType.value = type
  showToast.value = true
  setTimeout(() => {
    showToast.value = false
  }, 3000)
}

const goToShoppingMode = () => {
  router.push('/shopping-mode')
}

// Close dropdown when clicking outside
const handleClickOutside = (e) => {
  if (!e.target.closest('.three-dot-menu') && !e.target.closest('.dropdown-menu')) {
    showDropdown.value = false
  }
}

onMounted(() => {
  loadPurchaseHistory()
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.purchase-history-page {
  min-height: 100vh;
  background: #FFFFFF;
  overflow-y: auto;
  height: 100vh;
  position: relative;
}

.history-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  padding-bottom: 90px;
}

/* Header */
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 25px;
  animation: slideDown 0.5s ease-out;
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

.back-button {
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

.back-button svg {
  width: 24px;
  height: 24px;
  color: #1A1A1A;
}

.back-button:hover {
  background: #F0F0F0;
  transform: translateX(-3px);
}

.page-title {
  font-size: 24px;
  font-weight: 700;
  color: #1A1A1A;
  flex: 1;
  margin-left: 15px;
}

/* Header Actions */
.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  position: relative;
}

.stats-badge {
  background: #5DFF72;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  color: #0B0B0B;
}

.three-dot-menu {
  cursor: pointer;
  padding: 8px;
  border-radius: 12px;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.three-dot-menu svg {
  width: 24px;
  height: 24px;
  color: #1A1A1A;
}

.three-dot-menu:hover {
  background: #F0F0F0;
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
  min-width: 200px;
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
  position: relative;
}

.dropdown-item svg {
  width: 18px;
  height: 18px;
}

.dropdown-item:hover:not(:disabled) {
  background: #F8F9FA;
}

.dropdown-item.danger {
  color: #ff4444;
}

.dropdown-item.danger svg {
  color: #ff4444;
}

.dropdown-item.danger:hover:not(:disabled) {
  background: rgba(255, 68, 68, 0.1);
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

@keyframes dropdownFade {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(-10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.animate-dropdown {
  animation: dropdownFade 0.2s ease-out;
}

/* Summary Stats */
.summary-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 25px;
  animation: scaleIn 0.4s ease-out;
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.stat-card {
  background: linear-gradient(135deg, #F8F9FA, #FFFFFF);
  padding: 15px;
  border-radius: 16px;
  text-align: center;
  border: 1px solid #E9ECEF;
}

.stat-value {
  font-size: 20px;
  font-weight: 800;
  color: #5DFF72;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 10px;
  color: #6C757D;
  font-weight: 500;
}

/* Purchases List - Tile Cards */
.purchases-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.purchase-card {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 18px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s;
  animation: slideLeft 0.4s ease-out backwards;
  cursor: pointer;
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

.purchase-card.clickable-tile:hover {
  transform: translateX(5px);
  box-shadow: 0 8px 25px rgba(93, 255, 114, 0.15);
  border-left: 3px solid #5DFF72;
}

.purchase-icon {
  width: 50px;
  height: 50px;
  background: rgba(93, 255, 114, 0.1);
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.purchase-icon svg {
  width: 28px;
  height: 28px;
  color: #5DFF72;
}

.purchase-info {
  flex: 1;
}

.purchase-list {
  font-size: 16px;
  font-weight: 700;
  color: #1A1A1A;
  margin-bottom: 6px;
}

.purchase-meta {
  display: flex;
  gap: 15px;
}

.purchase-date, .purchase-items-count {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  color: #ADB5BD;
}

.purchase-date svg, .purchase-items-count svg {
  width: 12px;
  height: 12px;
}

.purchase-right {
  text-align: right;
}

.purchase-amount {
  font-size: 16px;
  font-weight: 800;
  color: #5DFF72;
  margin-bottom: 4px;
}

.arrow-icon svg {
  width: 20px;
  height: 20px;
  color: #ADB5BD;
  transition: transform 0.3s;
}

.purchase-card:hover .arrow-icon svg {
  transform: translateX(5px);
  color: #5DFF72;
}

/* Modal Styles */
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
  max-width: 450px;
  width: 90%;
  padding: 24px;
  max-height: 80vh;
  overflow-y: auto;
  background: white;
  border-radius: 20px;
  animation: scaleIn 0.3s ease-out;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.modal-title {
  font-size: 22px;
  font-weight: 700;
  color: #1A1A1A;
}

.close-modal {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-modal svg {
  width: 20px;
  height: 20px;
  color: #ADB5BD;
}

.close-modal:hover svg {
  color: #ff4444;
}

.modal-icon.warning svg {
  color: #ff4444;
  width: 60px;
  height: 60px;
  margin: 10px auto;
}

.confirm-message {
  text-align: center;
  color: #6C757D;
  margin-bottom: 15px;
}

.confirm-question {
  text-align: center;
  font-weight: 600;
  margin: 15px 0;
  color: #1A1A1A;
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
}

.btn-secondary {
  background: #F0F0F0;
  color: #666;
}

.btn-clear-confirm {
  background: #ff4444;
  color: white;
}

.btn-clear-confirm:hover:not(:disabled) {
  background: #cc0000;
  transform: translateY(-2px);
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  animation: fadeIn 0.5s ease-out;
  background: white;
  border-radius: 20px;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.empty-icon svg {
  width: 80px;
  height: 80px;
  color: #5DFF72;
  margin-bottom: 20px;
  opacity: 0.5;
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
  border-radius: 12px;
  font-weight: 600;
  color: #0B0B0B;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s;
}

.btn-primary svg {
  width: 18px;
  height: 18px;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(93, 255, 114, 0.3);
}

/* Toast Message */
.toast-message {
  position: fixed;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%);
  padding: 12px 20px;
  border-radius: 40px;
  display: flex;
  align-items: center;
  gap: 10px;
  z-index: 1001;
  font-size: 14px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  max-width: 90%;
  text-align: center;
}

.toast-message.success {
  background: #333;
  color: white;
}

.toast-message.error {
  background: #ff4444;
  color: white;
}

.toast-message.warning {
  background: #ffbb33;
  color: #333;
}

.toast-message svg {
  width: 18px;
  height: 18px;
}

.toast-message.success svg {
  color: #5DFF72;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

.animate-slide-up {
  animation: slideUp 0.3s ease-out;
}

/* Dark Mode */
.dark-mode .purchase-history-page {
  background: #1A1A1A;
}

.dark-mode .page-title,
.dark-mode .purchase-list,
.dark-mode .modal-title,
.dark-mode .empty-state h3,
.dark-mode .confirm-question {
  color: #FFFFFF;
}

.dark-mode .stat-card {
  background: #2A2A2A;
  border-color: #3A3A3A;
}

.dark-mode .purchase-date,
.dark-mode .purchase-items-count,
.dark-mode .stat-label,
.dark-mode .empty-state p,
.dark-mode .confirm-message,
.dark-mode .warning-text li {
  color: #ADB5BD;
}

.dark-mode .back-button svg,
.dark-mode .three-dot-menu svg {
  color: #FFFFFF;
}

.dark-mode .back-button:hover,
.dark-mode .three-dot-menu:hover {
  background: #2A2A2A;
}

.dark-mode .btn-secondary {
  background: #2A2A2A;
  color: #FFFFFF;
}

.dark-mode .modal-content,
.dark-mode .purchase-card,
.dark-mode .empty-state {
  background: #2A2A2A;
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
</style>