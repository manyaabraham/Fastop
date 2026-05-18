<template>
  <div class="page-wrapper">
    <div class="container">
      <!-- Header Section -->
      <div class="header-section">
        <button class="back-button" @click="$router.back()">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" stroke-width="2"/>
          </svg>
        </button>
        <div class="logo-area">
          <img v-if="logoUrl" :src="logoUrl" alt="Fastop Logo" class="header-logo" />
        </div>
        <div class="title-area">
          <h1 class="page-title">Budget Planner</h1>
          <p class="page-subtitle">Track your school expenses</p>
        </div>
      </div>

      <!-- Budget Card -->
      <div class="budget-card">
        <div class="budget-header">
          <div class="budget-icon">
  <img src="/icons/budget.png" alt="Budget Icon" class="budget-icon-img" />
</div>
          <p class="budget-label">Total Budget</p>
          <div class="budget-amount-wrapper">
            <p class="budget-amount">UGX {{ formatNumber(budgetAmount) }}</p>
            <button @click="openEditBudgetModal" class="inline-edit-btn">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34" stroke="currentColor" stroke-width="2"/>
                <polygon points="18 2 22 6 12 16 8 16 8 12 18 2" stroke="currentColor" stroke-width="2"/>
              </svg>
            </button>
          </div>
        </div>
        
        <div class="budget-stats">
          <div class="stat-row">
            <div class="stat-info">
              <div class="stat-title">
                <span class="stat-dot spent-dot"></span>
                <span>Amount Spent</span>
              </div>
              <div class="stat-right">
                <span class="stat-value">UGX {{ formatNumber(currentSpent) }}</span>
                <button @click="clearSpent" class="inline-clear-btn" :disabled="currentSpent === 0">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" stroke-width="2"/>
                  </svg>
                </button>
              </div>
            </div>
            <div class="progress-bar">
              <div class="progress-fill spent" :style="{ width: `${spentPercentage}%` }"></div>
            </div>
          </div>
          
          <div class="stat-row">
            <div class="stat-info">
              <div class="stat-title">
                <span class="stat-dot remaining-dot"></span>
                <span>Remaining Budget</span>
              </div>
              <div class="stat-right">
                <span class="stat-value remaining-text">UGX {{ formatNumber(remainingBudget) }}</span>
              </div>
            </div>
            <div class="progress-bar">
              <div class="progress-fill remaining" :style="{ width: `${remainingPercentage}%` }"></div>
            </div>
          </div>
        </div>
      </div>

<!-- Recent Expenditures -->
<div class="expenditures-card">
  <div class="card-header">
    <h2 class="card-title">
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M12 8v4l3 3M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" stroke="currentColor" stroke-width="2"/>
      </svg>
      Recent Expenditures
    </h2>
    <button @click="goToExpenditureHistory" class="view-all-btn">
      View All
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2"/>
      </svg>
    </button>
  </div>
  
  <div v-if="recentExpenditures.length === 0" class="empty-expenditures">
    <div class="empty-illustration">
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M12 8v4l3 3M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" stroke="currentColor" stroke-width="1.5"/>
        <path d="M12 6v2M12 12v2" stroke="currentColor" stroke-width="1.5"/>
      </svg>
    </div>
    <p>No expenditure records</p>
    <span>Clear spent amount to record here</span>
  </div>
  
  <div v-else class="expenditures-list">
    <div v-for="(exp, index) in recentExpenditures.slice(0, 4)" :key="exp.id" class="expenditure-item">
      <div class="exp-icon">
          <img v-if="listUrl" :src="listUrl" alt="Fastop Logo" class="header-logo" />
        </div>
      <div class="exp-info">
        <h4>Transaction {{ recentExpenditures.length - index }}</h4>
        <p>{{ formatDate(exp.created_at) }}</p>
      </div>
      <div class="exp-amount-wrapper">
        <div class="exp-amount">UGX {{ formatNumber(exp.amount) }}</div>
        <div class="exp-badge">Completed</div>
      </div>
    </div>
  </div>
</div>
      <!-- Edit Budget Modal -->
      <div v-if="showEditBudget" class="modal-overlay" @click.self="showEditBudget = false">
        <div class="modal-content">
          <div class="modal-close" @click="showEditBudget = false">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2"/>
            </svg>
          </div>
          <div class="modal-icon">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M12 2v20M17 7H7M17 17H7" stroke="currentColor" stroke-width="2"/>
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
            </svg>
          </div>
          <h2 class="modal-title">Edit Budget</h2>
          <input v-model.number="editAmount" type="number" class="input-field" placeholder="Enter budget amount" />
          <div class="modal-buttons">
            <button @click="updateBudget" class="btn-primary">Save Changes</button>
            <button @click="showEditBudget = false" class="btn-secondary">Cancel</button>
          </div>
        </div>
      </div>

      <!-- Clear Spent Confirmation Modal -->
      <div v-if="showClearModal" class="modal-overlay" @click.self="showClearModal = false">
        <div class="modal-content">
          <div class="modal-close" @click="showClearModal = false">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2"/>
            </svg>
          </div>
          <div class="modal-icon warning">
            <svg viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
              <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" stroke-width="2"/>
              <circle cx="12" cy="16" r="1" fill="currentColor"/>
            </svg>
          </div>
          <h2 class="modal-title">Clear Spent Amount</h2>
          <p class="confirm-message">Are you sure you want to clear UGX {{ formatNumber(currentSpent) }}?</p>
          <p class="delete-warning">This amount will be saved to your expenditure history.</p>
          <div class="modal-buttons">
            <button @click="confirmClearSpent" class="btn-clear-confirm">Confirm Clear</button>
            <button @click="showClearModal = false" class="btn-secondary">Cancel</button>
          </div>
        </div>
      </div>
    </div>
    <!-- Notification Toast -->
<div v-if="showNotification" class="notification-toast" :class="notificationType">
  <div class="notification-content">
    <div class="notification-icon">
      <svg v-if="notificationType === 'success'" viewBox="0 0 24 24" fill="none">
        <path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2"/>
      </svg>
      <svg v-else-if="notificationType === 'error'" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
        <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" stroke-width="2"/>
        <circle cx="12" cy="16" r="1" fill="currentColor"/>
      </svg>
      <svg v-else viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
        <line x1="12" y1="12" x2="12" y2="16" stroke="currentColor" stroke-width="2"/>
        <line x1="12" y1="8" x2="12.01" y2="8" stroke="currentColor" stroke-width="2"/>
      </svg>
    </div>
    <div class="notification-text">
      <strong>{{ notificationTitle }}</strong>
      <p>{{ notificationMessage }}</p>
    </div>
  </div>
  <button class="notification-close" @click="showNotification = false">
    <svg viewBox="0 0 24 24" fill="none">
      <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2"/>
    </svg>
  </button>
</div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../supabase/client'

const router = useRouter()
const logoUrl = '/logo.png'

// State variables
const showNotification = ref(false)
const notificationMessage = ref('')
const notificationTitle = ref('')
const notificationType = ref('success')
let notificationTimeout = null

const showNotificationMessage = (message, title, type) => {
  notificationMessage.value = message
  notificationTitle.value = title
  notificationType.value = type
  showNotification.value = true
  
  if (notificationTimeout) clearTimeout(notificationTimeout)
  notificationTimeout = setTimeout(() => {
    showNotification.value = false
  }, 4000)
}

const budgetAmount = ref(0)
const currentSpent = ref(0)
const showEditBudget = ref(false)
const showClearModal = ref(false)
const editAmount = ref(0)
const recentExpenditures = ref([])
const isClearing = ref(false)
const categorySpending = ref([
  { name: 'Books', amount: 0, percentage: 0, color: '#5DFF72', icon: '📚' },
  { name: 'Stationery', amount: 0, percentage: 0, color: '#60A5FA', icon: '✏️' },
  { name: 'Electronics', amount: 0, percentage: 0, color: '#FBBF24', icon: '💻' },
  { name: 'Uniforms', amount: 0, percentage: 0, color: '#F87171', icon: '👕' },
  { name: 'Other', amount: 0, percentage: 0, color: '#A78BFA', icon: '📦' }
])

// Computed properties
const remainingBudget = computed(() => Math.max(0, budgetAmount.value - currentSpent.value))
const spentPercentage = computed(() => {
  if (budgetAmount.value === 0) return 0
  return Math.min((currentSpent.value / budgetAmount.value) * 100, 100)
})
const remainingPercentage = computed(() => 100 - spentPercentage.value)

// Helper functions
const formatNumber = (num) => {
  if (num === undefined || num === null) return '0'
  return num.toLocaleString()
}

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

// Load budget from database
const loadBudgetData = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    
    const { data, error } = await supabase
      .from('budgets')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle()
    
    if (error) {
      console.error('Error loading budget:', error)
      return
    }
    
    if (data) {
      budgetAmount.value = data.budget_amount || 0
      currentSpent.value = data.spent_amount || 0
    } else {
      const { error: insertError } = await supabase
        .from('budgets')
        .insert([{ user_id: user.id, budget_amount: 0, spent_amount: 0 }])
      
      if (insertError) {
        console.error('Error creating budget:', insertError)
      }
      budgetAmount.value = 0
      currentSpent.value = 0
    }
  } catch (err) {
    console.error('Error in loadBudgetData:', err)
  }
}

// Load expenditure history
const loadExpenditureHistory = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    
    const { data, error } = await supabase
      .from('expenditure_history')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(4)
    
    if (error) {
      console.error('Error loading expenditure history:', error)
      return
    }
    
    recentExpenditures.value = data || []
  } catch (err) {
    console.error('Error in loadExpenditureHistory:', err)
  }
}

// Load all purchased items and calculate spent amount
const loadPurchasedItems = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    
    const { data: items, error } = await supabase
      .from('shopping_items')
      .select('*')
      .eq('user_id', user.id)
      .eq('cleared', true)
    
    if (error) {
      console.error('Error loading purchased items:', error)
      return
    }
    
    const totalPurchased = items.reduce((sum, item) => {
      return sum + ((item.price || 0) * (item.quantity || 1))
    }, 0)
    
    if (totalPurchased !== currentSpent.value) {
      currentSpent.value = totalPurchased
      
      await supabase
        .from('budgets')
        .update({ spent_amount: totalPurchased })
        .eq('user_id', user.id)
    }
    
    await calculateCategorySpending(items)
    
    return items
  } catch (err) {
    console.error('Error in loadPurchasedItems:', err)
  }
}

// Calculate category spending from items
const calculateCategorySpending = async (items) => {
  try {
    if (!items || items.length === 0) {
      categorySpending.value = categorySpending.value.map(cat => ({
        ...cat,
        amount: 0,
        percentage: 0
      }))
      return
    }
    
    const categoryTotals = {
      'Books': 0,
      'Stationery': 0,
      'Electronics': 0,
      'Uniforms': 0,
      'Other': 0
    }
    
    items.forEach(item => {
      const total = (item.price || 0) * (item.quantity || 1)
      const category = item.category || 'Other'
      
      if (categoryTotals.hasOwnProperty(category)) {
        categoryTotals[category] += total
      } else {
        categoryTotals['Other'] += total
      }
    })
    
    const totalSpent = Object.values(categoryTotals).reduce((sum, val) => sum + val, 0)
    
    categorySpending.value = categorySpending.value.map(cat => ({
      ...cat,
      amount: categoryTotals[cat.name],
      percentage: totalSpent > 0 ? (categoryTotals[cat.name] / totalSpent) * 100 : 0
    }))
    
  } catch (err) {
    console.error('Error calculating category spending:', err)
  }
}

// Load all data
const loadAllData = async () => {
  await loadBudgetData()
  await loadExpenditureHistory()
  await loadPurchasedItems()
}

// Open edit budget modal
const openEditBudgetModal = () => {
  editAmount.value = budgetAmount.value
  showEditBudget.value = true
}

// Update budget
const updateBudget = async () => {
  if (editAmount.value < 0 || isNaN(editAmount.value)) {
    showNotificationMessage('Please enter a valid budget amount', 'Invalid Input', 'error')
    return
  }
  
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      showNotificationMessage('Please login first', 'Authentication Error', 'error')
      return
    }
    
    const { error } = await supabase
      .from('budgets')
      .update({ budget_amount: editAmount.value })
      .eq('user_id', user.id)
    
    if (error) {
      console.error('Error updating budget:', error)
      showNotificationMessage('Failed to update budget. Please try again.', 'Error', 'error')
      return
    }
    
    budgetAmount.value = editAmount.value
    showEditBudget.value = false
    
    window.dispatchEvent(new CustomEvent('budget-updated', { 
      detail: { budgetAmount: budgetAmount.value, spentAmount: currentSpent.value }
    }))
    
    showNotificationMessage(
      `Budget updated to UGX ${formatNumber(editAmount.value)}`,
      'Budget Updated!',
      'success'
    )
    
  } catch (err) {
    console.error('Error in updateBudget:', err)
    showNotificationMessage('An unexpected error occurred', 'Error', 'error')
  }
}

// Clear spent button handler
const clearSpent = () => {
  if (currentSpent.value > 0) {
    showClearModal.value = true
  }
}

// Function to unclear all cleared items across all lists
const unclearAllClearedItems = async (userId) => {
  try {
    const { data: lists } = await supabase
      .from('shopping_lists')
      .select('id')
      .eq('user_id', userId)
    
    if (lists && lists.length > 0) {
      const listIds = lists.map(l => l.id)
      
      const { error: updateError } = await supabase
        .from('shopping_items')
        .update({ cleared: false })
        .in('list_id', listIds)
        .eq('cleared', true)
      
      if (updateError) throw updateError
      
      return true
    }
    return true
  } catch (error) {
    console.error('Error unclearing items:', error)
    throw error
  }
}

// Confirm clear spent - Remaining amount becomes new budget
const confirmClearSpent = async () => {
  if (isClearing.value) return
  
  isClearing.value = true
  
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      isClearing.value = false
      return
    }
    
    const spentAmount = currentSpent.value
    
    if (spentAmount === 0) {
      showClearModal.value = false
      isClearing.value = false
      showNotificationMessage('No expenditure to clear', 'Info', 'warning')
      return
    }

    // The back button function is already in your template
// @click="$router.back()" - this goes back to previous page

// If you want a custom function instead:
const goBack = () => {
  router.back()
}

// Then in template use:
// <button class="back-button" @click="goBack">
    
    const newBudgetAmount = remainingBudget.value
    
    // ONLY save to expenditure history if it's a NEW expenditure
    if (spentAmount > 0) {
      const { error: historyError } = await supabase
        .from('expenditure_history')
        .insert([{
          user_id: user.id,
          amount: spentAmount,
          budget_amount: budgetAmount.value,
          remaining_budget: newBudgetAmount,
          created_at: new Date()
        }])
      
      if (historyError) {
        console.error('Error saving to expenditure history:', historyError)
      }
    }
    
    // Unclear all cleared items
    await unclearAllClearedItems(user.id)
    
    // Update budget
    const { error: budgetError } = await supabase
      .from('budgets')
      .update({ 
        budget_amount: newBudgetAmount,
        spent_amount: 0 
      })
      .eq('user_id', user.id)
    
    if (budgetError) throw budgetError
    
    // Update local values
    budgetAmount.value = newBudgetAmount
    currentSpent.value = 0
    showClearModal.value = false
    await loadAllData()
    
    showNotificationMessage(
      `Budget reset to UGX ${formatNumber(newBudgetAmount)} | Previous spent: UGX ${formatNumber(spentAmount)}`,
      'Budget Reset Successfully!',
      'success'
    )

  } catch (err) {
    console.error('Error in confirmClearSpent:', err)
    showNotificationMessage('Please try again.', 'Error Clearing Budget', 'error')
  } finally {
    isClearing.value = false
  }
}
// Go to expenditure history page
const goToExpenditureHistory = () => {
  router.push('/expenditure-history')
}

// Subscribe to real-time changes
const setupRealtimeSubscriptions = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  
  const itemsChannel = supabase
    .channel('shopping_items_budget')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'shopping_items',
        filter: `user_id=eq.${user.id}`
      },
      () => {
        loadPurchasedItems()
      }
    )
    .subscribe()
  
  const budgetChannel = supabase
    .channel('budgets_changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'budgets',
        filter: `user_id=eq.${user.id}`
      },
      (payload) => {
        if (payload.new) {
          budgetAmount.value = payload.new.budget_amount || 0
          currentSpent.value = payload.new.spent_amount || 0
        }
      }
    )
    .subscribe()
  
  const handleBudgetReset = async (event) => {
    if (event.detail) {
      await loadAllData()
    }
  }
  window.addEventListener('budget-reset', handleBudgetReset)
  
  return { itemsChannel, budgetChannel, handleBudgetReset }
}

let channels = null

// Lifecycle hooks
onMounted(async () => {
  await loadAllData()
  channels = await setupRealtimeSubscriptions()
})

onUnmounted(() => {
  if (channels) {
    if (channels.itemsChannel) supabase.removeChannel(channels.itemsChannel)
    if (channels.budgetChannel) supabase.removeChannel(channels.budgetChannel)
    if (channels.handleBudgetReset) window.removeEventListener('budget-reset', channels.handleBudgetReset)
  }
  if (notificationTimeout) clearTimeout(notificationTimeout)
})
</script>

<style scoped>
/* Your existing styles remain exactly the same */
.page-wrapper {
  min-height: 100vh;
  background: #F5F7FA;
  overflow-y: auto;
  height: 100vh;
}

.dark-mode .page-wrapper {
  background: #1A1A1A;
}

.container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  padding-bottom: 90px;
}

/* Header Section - Normal */
.header-section {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 25px;
  padding: 15px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.dark-mode .header-section {
  background: #2A2A2A;
}

.header-logo {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  object-fit: cover;
}

.page-title {
  font-size: 22px;
  font-weight: 700;
  margin: 0;
  margin-bottom: 4px;
  color: #1A1A1A;
}

.dark-mode .page-title {
  color: #FFFFFF;
}

.page-subtitle {
  font-size: 12px;
  color: #6C757D;
  margin: 0;
}

/* Budget Card - Normal */
.budget-card {
  padding: 24px;
  margin-bottom: 20px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.dark-mode .budget-card {
  background: #2A2A2A;
}

.budget-header {
  text-align: center;
  margin-bottom: 24px;
}

.budget-icon {
  width: 60px;
  height: 60px;
  margin: 0 auto 15px;
  background: rgba(93, 255, 114, 0.1);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.budget-icon svg {
  width: 30px;
  height: 30px;
  color: #5DFF72;
}

.budget-label {
  color: #6C757D;
  margin-bottom: 8px;
  font-size: 13px;
}

.budget-amount-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.budget-amount {
  font-size: 42px;
  font-weight: 800;
  color: #1A1A1A;
  margin: 0;
}

.dark-mode .budget-amount {
  color: #FFFFFF;
}

.inline-edit-btn {
  background: rgba(93, 255, 114, 0.15);
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.inline-edit-btn:hover {
  background: #5DFF72;
  transform: scale(1.05);
}

.inline-edit-btn svg {
  width: 18px;
  height: 18px;
  color: #5DFF72;
}

.inline-edit-btn:hover svg {
  color: #0B0B0B;
}

.budget-stats {
  margin-bottom: 0;
}

.stat-row {
  margin-bottom: 20px;
}

.stat-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  font-size: 13px;
  color: #1A1A1A;
}

.dark-mode .stat-info {
  color: #FFFFFF;
}

.stat-title {
  display: flex;
  align-items: center;
  gap: 8px;
}

.stat-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.spent-dot { background: #ff6464; }
.remaining-dot { background: #5DFF72; }

.stat-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.stat-value {
  font-weight: 600;
}

.remaining-text {
  color: #5DFF72;
}

.inline-clear-btn {
  background: rgba(255, 68, 68, 0.15);
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.inline-clear-btn:hover:not(:disabled) {
  background: #ff6464;
  transform: scale(1.05);
}

.inline-clear-btn svg {
  width: 16px;
  height: 16px;
  color: #ff6464;
}

.inline-clear-btn:hover:not(:disabled) svg {
  color: white;
}

.inline-clear-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.progress-bar {
  height: 8px;
  background: #E9ECEF;
  border-radius: 10px;
  overflow: hidden;
}

.dark-mode .progress-bar {
  background: #3A3A3A;
}

/* Notification Toast */
.notification-toast {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: white;
  border-radius: 16px;
  padding: 16px 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  z-index: 10000;
  max-width: 90%;
  width: 400px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  animation: slideDown 0.3s ease-out;
  border-left: 4px solid;
}

.notification-toast.success {
  border-left-color: #5DFF72;
  background: white;
}

.notification-toast.error {
  border-left-color: #ff4444;
  background: white;
}

.notification-toast.warning {
  border-left-color: #ffbb33;
  background: white;
}

.dark-mode .notification-toast {
  background: #2A2A2A;
}

.notification-content {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.notification-icon svg {
  width: 24px;
  height: 24px;
}

.notification-toast.success .notification-icon svg {
  color: #5DFF72;
}

.notification-toast.error .notification-icon svg {
  color: #ff4444;
}

.notification-toast.warning .notification-icon svg {
  color: #ffbb33;
}

.notification-text strong {
  display: block;
  font-size: 14px;
  margin-bottom: 4px;
  color: #1A1A1A;
}

.notification-text p {
  font-size: 12px;
  color: #6C757D;
  margin: 0;
}

.dark-mode .notification-text strong {
  color: #FFFFFF;
}

.dark-mode .notification-text p {
  color: #ADB5BD;
}

.notification-close {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.notification-close svg {
  width: 16px;
  height: 16px;
  color: #ADB5BD;
}

.notification-close:hover {
  background: #F0F0F0;
}

.notification-close:hover svg {
  color: #666;
}

.dark-mode .notification-close:hover {
  background: #3A3A3A;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

/* Mobile responsive for notification */
@media (max-width: 768px) {
  .notification-toast {
    top: 10px;
    padding: 12px 16px;
    width: 90%;
  }
  
  .notification-icon svg {
    width: 20px;
    height: 20px;
  }
  
  .notification-text strong {
    font-size: 13px;
  }
  
  .notification-text p {
    font-size: 11px;
  }
}

.progress-fill {
  height: 100%;
  transition: width 0.5s ease;
  border-radius: 10px;
}

.progress-fill.spent { background: #ff6464; }
.progress-fill.remaining { background: #5DFF72; }

/* Categories Card */
.categories-card {
  padding: 20px;
  margin-bottom: 20px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.dark-mode .categories-card {
  background: #2A2A2A;
}

.card-title {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 20px;
  color: #1A1A1A;
  display: flex;
  align-items: center;
  gap: 10px;
}

.dark-mode .card-title {
  color: #FFFFFF;
}

.card-title svg {
  width: 22px;
  height: 22px;
  color: #5DFF72;
}

.categories-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.category-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.category-icon {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s;
}

.category-icon:hover {
  transform: scale(1.05);
}

.category-icon svg {
  width: 20px;
  height: 20px;
}

.category-info {
  flex: 1;
}

.category-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 13px;
}

.category-name {
  font-weight: 600;
  color: #1A1A1A;
}

.dark-mode .category-name {
  color: #FFFFFF;
}

.category-amount {
  color: #5DFF72;
  font-weight: 600;
}

.progress-fill.category {
  border-radius: 10px;
}

/* Expenditures Card */
.expenditures-card {
  padding: 20px;
  border-radius: 20px;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.dark-mode .expenditures-card {
  background: #2A2A2A;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
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
  transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.back-button svg {
  width: 24px;
  height: 24px;
  color: #1A1A1A;
  transition: all 0.3s;
}

.back-button:hover {
  background: rgba(0, 0, 0, 0.05);
  transform: translateX(-3px);
}

.back-button:hover svg {
  color: #5DFF72;
}

.back-button:active {
  transform: translateX(-5px) scale(0.95);
}

/* Dark mode for back button */
.dark-mode .back-button svg {
  color: #FFFFFF;
}

.dark-mode .back-button:hover {
  background: rgba(255, 255, 255, 0.1);
}

.dark-mode .back-button:hover svg {
  color: #5DFF72;
}

.view-all-btn {
  background: none;
  border: none;
  color: #5DFF72;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: transform 0.2s;
}

.view-all-btn:hover {
  transform: translateX(3px);
}

.empty-expenditures {
  text-align: center;
  padding: 30px;
}

.empty-illustration svg {
  width: 60px;
  height: 60px;
  color: #ADB5BD;
  margin-bottom: 15px;
  opacity: 0.5;
}

.empty-expenditures p {
  color: #1A1A1A;
  font-size: 14px;
  margin-bottom: 5px;
}

.dark-mode .empty-expenditures p {
  color: #FFFFFF;
}

.empty-expenditures span {
  color: #ADB5BD;
  font-size: 11px;
}

.expenditures-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.expenditure-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #F8F9FA;
  border-radius: 16px;
  transition: transform 0.2s;
}

.expenditure-item:hover {
  transform: translateX(5px);
}

.dark-mode .expenditure-item {
  background: #1A1A1A;
}

.exp-icon {
  width: 45px;
  height: 45px;
  background: rgba(93, 255, 114, 0.1);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.exp-icon svg {
  width: 22px;
  height: 22px;
  color: #5DFF72;
}

.exp-info {
  flex: 1;
}

.exp-info h4 {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 2px;
  color: #1A1A1A;
}

.dark-mode .exp-info h4 {
  color: #FFFFFF;
}

.exp-info p {
  font-size: 10px;
  color: #ADB5BD;
}

.exp-amount-wrapper {
  text-align: right;
}

.exp-amount {
  font-weight: 700;
  color: #5DFF72;
  font-size: 14px;
}

.exp-badge {
  font-size: 9px;
  color: #fff;
  background: #5DFF72;
  padding: 2px 8px;
  border-radius: 20px;
  margin-top: 4px;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  max-width: 400px;
  width: 90%;
  padding: 24px;
  text-align: center;
  background: white;
  border-radius: 20px;
  position: relative;
}

.dark-mode .modal-content {
  background: #2A2A2A;
}

.modal-close {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 28px;
  height: 28px;
  cursor: pointer;
  opacity: 0.5;
  transition: opacity 0.2s;
}

.modal-close:hover {
  opacity: 1;
}

.modal-close svg {
  width: 100%;
  height: 100%;
}

.modal-icon {
  margin-bottom: 20px;
}

.modal-icon svg {
  width: 50px;
  height: 50px;
  color: #5DFF72;
}

.modal-icon.warning svg {
  color: #ff6464;
}

.modal-title {
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 15px;
  color: #1A1A1A;
}

.dark-mode .modal-title {
  color: #FFFFFF;
}

.confirm-message {
  color: #6C757D;
  margin-bottom: 10px;
}

.delete-warning {
  color: #ff6464;
  font-size: 12px;
  margin-bottom: 20px;
}

.input-field {
  width: 100%;
  padding: 14px;
  border: 1px solid #E9ECEF;
  border-radius: 12px;
  font-size: 16px;
  margin-bottom: 20px;
  transition: border-color 0.2s;
}

.input-field:focus {
  outline: none;
  border-color: #5DFF72;
}

.dark-mode .input-field {
  background: #1A1A1A;
  border-color: #3A3A3A;
  color: white;
}

.modal-buttons {
  display: flex;
  gap: 12px;
  margin-top: 20px;
}

.modal-buttons button {
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 40px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s;
}

.modal-buttons button:hover {
  transform: translateY(-2px);
}

.btn-primary {
  background: #5DFF72;
  color: #0B0B0B;
}

.btn-secondary {
  background: #F0F0F0;
  color: #666;
}

.dark-mode .btn-secondary {
  background: #3A3A3A;
  color: #FFFFFF;
}

.btn-clear-confirm {
  background: #ff6464;
  color: white;
}

/* Responsive */
@media (max-width: 600px) {
  .budget-amount {
    font-size: 32px;
  }
  
  .budget-amount-wrapper {
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .category-row {
    flex-wrap: wrap;
  }
  
  .category-icon {
    width: 35px;
    height: 35px;
  }
  
  .category-icon svg {
    width: 18px;
    height: 18px;
  }
}

.category-percentage {
  font-size: 10px;
  color: #6C757D;
  margin-top: 4px;
  text-align: right;
}

.dark-mode .category-percentage {
  color: #ADB5BD;
}

.category-emoji {
  font-size: 20px;
}

/* Media Query for Phones */
@media (max-width: 768px) {
  .container {
    padding: 15px;
    padding-bottom: 80px;
  }

  /* Header Section */
  .header-section {
    padding: 12px;
    gap: 12px;
  }

  .header-logo {
    width: 40px;
    height: 40px;
  }

  .page-title {
    font-size: 18px;
  }

  .page-subtitle {
    font-size: 10px;
  }

  /* Budget Card */
  .budget-card {
    padding: 18px;
  }

  .budget-icon {
    width: 50px;
    height: 50px;
  }

  .budget-icon-img {
    width: 30px;
    height: 30px;
  }

  .budget-amount {
    font-size: 28px;
  }

  .budget-label {
    font-size: 11px;
  }

  .budget-amount-wrapper {
    flex-wrap: wrap;
    justify-content: center;
    gap: 8px;
  }

  .inline-edit-btn {
    width: 32px;
    height: 32px;
  }

  .inline-edit-btn svg {
    width: 16px;
    height: 16px;
  }

  /* Stats */
  .stat-info {
    font-size: 11px;
    flex-wrap: wrap;
    gap: 8px;
  }

  .stat-value {
    font-size: 12px;
  }

  .stat-dot {
    width: 6px;
    height: 6px;
  }

  .stat-title {
    gap: 6px;
  }

  .stat-right {
    gap: 6px;
  }

  .inline-clear-btn {
    width: 28px;
    height: 28px;
  }

  .inline-clear-btn svg {
    width: 14px;
    height: 14px;
  }

  .progress-bar {
    height: 6px;
  }

  /* Categories Section */
  .categories-card {
    padding: 16px;
  }

  .card-title {
    font-size: 16px;
    margin-bottom: 16px;
  }

  .card-title svg {
    width: 18px;
    height: 18px;
  }

  .categories-list {
    gap: 14px;
  }

  .category-row {
    gap: 10px;
    flex-wrap: wrap;
  }

  .category-icon {
    width: 35px;
    height: 35px;
  }

  .category-icon svg {
    width: 18px;
    height: 18px;
  }

  .category-header {
    font-size: 11px;
    flex-wrap: wrap;
    gap: 5px;
  }

  .category-name {
    font-size: 12px;
  }

  .category-amount {
    font-size: 11px;
  }

  .category-percentage {
    font-size: 9px;
  }

  /* Expenditures Section */
  .expenditures-card {
    padding: 16px;
  }

  .view-all-btn {
    font-size: 11px;
  }

  .view-all-btn svg {
    width: 14px;
    height: 14px;
  }

  .empty-illustration svg {
    width: 50px;
    height: 50px;
  }

  .empty-expenditures p {
    font-size: 13px;
  }

  .empty-expenditures span {
    font-size: 10px;
  }

  .expenditure-item {
    padding: 10px;
    gap: 10px;
  }

  .exp-icon {
    width: 35px;
    height: 35px;
  }

  .exp-icon svg {
    width: 18px;
    height: 18px;
  }

  .exp-info h4 {
    font-size: 12px;
  }

  .exp-info p {
    font-size: 9px;
  }

  .exp-amount {
    font-size: 12px;
  }

  .exp-badge {
    font-size: 8px;
    padding: 2px 6px;
  }

  /* Modal */
  .modal-content {
    padding: 20px;
    width: 85%;
  }

  .modal-title {
    font-size: 18px;
  }

  .modal-icon svg {
    width: 40px;
    height: 40px;
  }

  .input-field {
    padding: 10px;
    font-size: 14px;
  }

  .modal-buttons button {
    padding: 10px;
    font-size: 13px;
  }

  .confirm-message {
    font-size: 13px;
  }

  .delete-warning {
    font-size: 11px;
  }
}

/* Extra Small Devices (iPhone SE, small phones) */
@media (max-width: 480px) {
  .container {
    padding: 10px;
    padding-bottom: 70px;
  }

  .header-section {
    padding: 10px;
  }

  .header-logo {
    width: 35px;
    height: 35px;
  }

  .page-title {
    font-size: 16px;
  }

  .page-subtitle {
    font-size: 9px;
  }

  .budget-card {
    padding: 15px;
  }

  .budget-amount {
    font-size: 24px;
  }

  .budget-icon {
    width: 45px;
    height: 45px;
  }

  .budget-icon-img {
    width: 28px;
    height: 28px;
  }

  .inline-edit-btn {
    width: 28px;
    height: 28px;
  }

  .stat-info {
    font-size: 10px;
  }

  .category-icon {
    width: 30px;
    height: 30px;
  }

  .category-icon svg {
    width: 16px;
    height: 16px;
  }

  .category-name {
    font-size: 11px;
  }

  .category-amount {
    font-size: 10px;
  }

  .expenditure-item {
    padding: 8px;
    gap: 8px;
  }

  .exp-icon {
    width: 30px;
    height: 30px;
  }

  .exp-info h4 {
    font-size: 11px;
  }

  .exp-amount {
    font-size: 11px;
  }

  .modal-content {
    width: 90%;
    padding: 16px;
  }

  .modal-title {
    font-size: 16px;
  }

  .modal-buttons button {
    padding: 8px;
    font-size: 12px;
  }
}

/* Landscape Mode for Phones */
@media (max-width: 768px) and (orientation: landscape) {
  .container {
    padding-bottom: 60px;
  }

  .budget-card {
    padding: 12px;
  }

  .budget-header {
    margin-bottom: 15px;
  }

  .stat-row {
    margin-bottom: 12px;
  }

  .categories-list {
    gap: 10px;
  }

  .expenditures-list {
    gap: 8px;
  }
}

/* Dark Mode Support for Media Queries */
@media (max-width: 768px) {
  .dark-mode .budget-card,
  .dark-mode .categories-card,
  .dark-mode .expenditures-card,
  .dark-mode .header-section {
    background: #2A2A2A;
  }

  .dark-mode .expenditure-item {
    background: #1A1A1A;
  }

  .dark-mode .modal-content {
    background: #2A2A2A;
  }
}

/* Touch-friendly button sizing */
@media (max-width: 768px) {
  button, 
  .inline-edit-btn,
  .inline-clear-btn,
  .view-all-btn,
  .modal-buttons button {
    min-height: 44px;
  }

  .inline-edit-btn,
  .inline-clear-btn {
    min-height: 36px;
  }
}

/* Smooth transitions for all elements on mobile */
@media (max-width: 768px) {
  * {
    transition-duration: 0.2s !important;
  }

  .category-row,
  .expenditure-item,
  .stat-row {
    animation-duration: 0.3s !important;
  }
}
</style>