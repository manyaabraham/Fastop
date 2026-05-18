
<template>
  <div class="shopping-clearance-page">
    <div class="clearance-container">
      <!-- Header -->
      <div class="header animate-slide-down">
        <button class="back-button" @click="$router.back()">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" stroke-width="2"/>
          </svg>
        </button>
        <div class="header-info">
          <h1 class="list-title">{{ listName }}</h1>
          <p class="item-count">{{ items.length }} items total</p>
        </div>
        <div class="header-actions">
          <div class="three-dot-menu" @click.stop="toggleDropdown">
            <svg viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="1.5" fill="currentColor"/>
              <circle cx="12" cy="5" r="1.5" fill="currentColor"/>
              <circle cx="12" cy="19" r="1.5" fill="currentColor"/>
            </svg>
          </div>
          <div v-if="showDropdown" class="dropdown-menu animate-dropdown">
            <button @click="unclearAllItems" class="dropdown-item" :disabled="clearedItems.length === 0">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M3 10h10a7 7 0 0 1 7 7v0M3 10l4-4M3 10l4 4" stroke="currentColor" stroke-width="2"/>
              </svg>
              Unclear All Items
              <span v-if="clearedItems.length > 0" class="item-count-badge">{{ clearedItems.length }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Budget Summary with Warning Colors -->
      <div class="budget-summary animate-scale">
        <div class="summary-item" :class="{ 'insufficient': remainingBudgetForList < 0 }">
          <div class="summary-label">Budget Limit</div>
          <div class="summary-value">UGX {{ formatNumber(budgetAmount) }}</div>
        </div>
        <div class="summary-item">
          <div class="summary-label">Spent</div>
          <div class="summary-value spent">UGX {{ formatNumber(currentSpent) }}</div>
        </div>
        <div class="summary-item" :class="{ 'insufficient': remainingBudgetForList < 0, 'warning': remainingBudgetForList >= 0 && remainingBudgetForList < 50000 }">
          <div class="summary-label">Remaining</div>
          <div class="summary-value remaining" :class="{ 'negative': remainingBudgetForList < 0 }">
            UGX {{ formatNumber(remainingBudgetForList) }}
          </div>
        </div>
      </div>

      <!-- Budget Warning Card for Insufficient Budget -->
      <div v-if="remainingBudgetForList < 0" class="budget-warning-danger animate-shake">
        <div class="warning-icon">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M12 8v4m0 4h.01M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z" stroke="currentColor" stroke-width="2"/>
          </svg>
        </div>
        <div class="warning-content">
          <h4>Budget Exceeded!</h4>
          <p>You have exceeded your budget by UGX {{ formatNumber(Math.abs(remainingBudgetForList)) }}</p>
        </div>
      </div>

      <!-- Budget Warning Card for Tight Budget -->
      <div v-else-if="remainingBudgetForList >= 0 && remainingBudgetForList < 50000 && unclearedItemsTotal > 0" class="budget-warning-tight animate-shake">
        <div class="warning-icon">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M12 8v4m0 4h.01M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z" stroke="currentColor" stroke-width="2"/>
          </svg>
        </div>
        <div class="warning-content">
          <h4>Low Budget Warning!</h4>
          <p>Only UGX {{ formatNumber(remainingBudgetForList) }} remaining. Be careful with your spending!</p>
        </div>
      </div>


      <!-- Progress Bar -->
      <div class="progress-container animate-scale" style="animation-delay: 0.05s">
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: clearProgress + '%' }"></div>
        </div>
        <div class="progress-text">{{ clearProgress }}% Cleared ({{ clearedItems.length }} of {{ items.length }} items)</div>
      </div>

      <!-- Items List -->
      <div v-if="items.length > 0" class="items-list">
        <div v-for="(item, index) in sortedItems" :key="item.id" 
             class="item-card glass-card animate-slide-left"
             :class="{ 
               cleared: item.cleared, 
               'priority-high': item.priority === 'high', 
               'priority-medium': item.priority === 'medium', 
               'priority-low': item.priority === 'low',
               'cannot-clear': !item.cleared && itemCost(item) > remainingBudgetForList && remainingBudgetForList >= 0
             }"
             :style="{ animationDelay: `${0.1 + index * 0.03}s` }"
             @contextmenu.prevent="showReturnDropdown($event, item)">
          
          <div class="item-checkbox" @click="clearItem(item)">
            <div class="checkbox" :class="{ checked: item.cleared, disabled: !item.cleared && itemCost(item) > remainingBudgetForList && remainingBudgetForList >= 0 }">
              <svg v-if="item.cleared" viewBox="0 0 24 24" fill="none">
                <path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="3"/>
              </svg>
            </div>
          </div>
          
          <div class="item-details">
            <div class="item-header">
              <h3 class="item-name" :class="{ crossed: item.cleared }">{{ item.name }}</h3>
              <span class="priority-tag" :class="item.priority">
                {{ getPriorityLabel(item.priority) }}
              </span>
            </div>
            <div class="item-meta">
              <span class="item-quantity">Qty: {{ item.quantity }}</span>
              <span class="item-price">UGX {{ formatNumber(item.price) }} each</span>
              <span v-if="item.notes" class="item-brand">Brand: {{ item.notes }}</span>
            </div>
            <div v-if="!item.cleared" class="item-warning" :class="{ 'needs-budget': itemCost(item) > remainingBudgetForList && remainingBudgetForList >= 0 }">
              <span v-if="itemCost(item) > remainingBudgetForList && remainingBudgetForList >= 0">
                ⚠️ Need UGX {{ formatNumber(itemCost(item) - remainingBudgetForList) }} more
              </span>
            </div>
          </div>
          
          <div class="item-total">
            <div class="total-label">Total</div>
            <div class="total-amount">UGX {{ formatNumber(item.price * item.quantity) }}</div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="empty-state glass-card animate-fade-in">
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke="currentColor" stroke-width="1.5"/>
          <polyline points="22 4 12 14.01 9 11.01" stroke="currentColor" stroke-width="1.5"/>
        </svg>
        <h3>No Items Yet!</h3>
        <p>Add items to this shopping list to get started</p>
        <button @click="$router.back()" class="btn-primary">Back to Lists</button>
      </div>

      <!-- Complete Button -->
      <button v-if="clearedItems.length > 0" class="complete-btn animate-pulse" @click="completeClearance">
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2"/>
        </svg>
        Complete Clearance ({{ clearedItems.length }} items)
      </button>
    </div>

    <!-- Return Item Modal -->
    <div v-if="showReturnModal" class="modal-overlay" @click.self="showReturnModal = false">
      <div class="modal-content glass-card animate-scale">
        <div class="modal-icon">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M3 10h10a7 7 0 0 1 7 7v0M3 10l4-4M3 10l4 4" stroke="currentColor" stroke-width="2"/>
          </svg>
        </div>
        <h2 class="modal-title">Return Item</h2>
        <p class="confirm-message">Return this item to your shopping list?</p>
        <div class="confirm-item">
          <strong>{{ itemToReturn?.name }}</strong>
          <span>UGX {{ formatNumber(itemCost(itemToReturn)) }}</span>
        </div>
        <div class="modal-buttons">
          <button @click="confirmReturnItem" class="btn-primary">Yes, Return</button>
          <button @click="showReturnModal = false" class="btn-secondary">Cancel</button>
        </div>
      </div>
    </div>

    <!-- Unclear All Confirmation Modal -->
    <!-- Unclear All Confirmation Modal -->
<div v-if="showUnclearModal" class="modal-overlay" @click.self="showUnclearModal = false">
  <div class="modal-content glass-card animate-scale">
    <div class="modal-icon warning-icon">
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" stroke="currentColor" stroke-width="2"/>
      </svg>
    </div>
    <h2 class="modal-title">Unclear All Items?</h2>
    <p class="confirm-message">This will unclear all {{ clearedItems.length }} cleared items in this list.</p>
    <div class="warning-text">
      <strong>Note:</strong> The budget spent amount (UGX {{ formatNumber(currentSpent) }}) will NOT be refunded. These items will be marked as uncleared but your spent amount stays the same.
    </div>
    <div class="modal-buttons">
      <button @click="confirmUnclearAll" class="btn-primary">Yes, Unclear All</button>
      <button @click="showUnclearModal = false" class="btn-secondary">Cancel</button>
    </div>
  </div>
</div>

    <!-- Notification -->
    <div v-if="showNotification" class="global-reset-notification animate-slide-down" :class="notificationType">
      <div class="notification-content">
        <svg viewBox="0 0 24 24" fill="none">
          <path v-if="notificationType === 'success'" d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2"/>
          <path v-else d="M12 8v4m0 4h.01M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z" stroke="currentColor" stroke-width="2"/>
        </svg>
        <div class="notification-text">
          <strong>{{ notificationTitle }}</strong>
          <p>{{ notificationMessage }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { supabase } from '../supabase/client'

const route = useRoute()
const router = useRouter()
const listId = route.params.id
const listName = route.query.name || 'Shopping List'

const items = ref([])
const budgetAmount = ref(0)
const currentSpent = ref(0)
const showReturnModal = ref(false)
const showUnclearModal = ref(false)
const showNotification = ref(false)
const showDropdown = ref(false)
const notificationMessage = ref('')
const notificationTitle = ref('')
const notificationType = ref('success')
const itemToReturn = ref(null)
const isCompleting = ref(false)
let notificationTimeout = null

// Real-time subscription
let budgetSubscription = null
let itemsSubscription = null

const priorityOrder = { high: 0, medium: 1, low: 2 }

const sortedItems = computed(() => {
  return [...items.value].sort((a, b) => {
    return priorityOrder[a.priority] - priorityOrder[b.priority]
  })
})

const clearedItems = computed(() => items.value.filter(i => i.cleared === true))
const clearedItemsTotalValue = computed(() => {
  return clearedItems.value.reduce((sum, i) => sum + (i.price * i.quantity), 0)
})

const unclearedItems = computed(() => items.value.filter(i => i.cleared !== true))
const unclearedItemsTotal = computed(() => {
  return unclearedItems.value.reduce((sum, i) => sum + (i.price * i.quantity), 0)
})

const clearProgress = computed(() => {
  if (items.value.length === 0) return 0
  return Math.round((clearedItems.value.length / items.value.length) * 100)
})

const remainingBudgetForList = computed(() => budgetAmount.value - currentSpent.value)

const itemCost = (item) => (item.price || 0) * (item.quantity || 0)

const formatNumber = (num) => {
  if (num === undefined || num === null) return '0'
  return num.toLocaleString()
}

const getPriorityLabel = (priority) => {
  const labels = { high: 'High Priority', medium: 'Medium Priority', low: 'Low Priority' }
  return labels[priority] || 'Medium Priority'
}

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

// Dropdown handlers
const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value
}

const closeDropdown = () => {
  showDropdown.value = false
}

const unclearAllItems = () => {
  if (clearedItems.value.length === 0) {
    showNotificationMessage('No cleared items to unclear!', 'Info', 'warning')
    closeDropdown()
    return
  }
  closeDropdown()
  showUnclearModal.value = true
}

const confirmUnclearAll = async () => {
  try {
    const itemsToUnclear = [...clearedItems.value]
    
    // Update each item in the database to unclear (NO budget refund)
    for (const item of itemsToUnclear) {
      const { error } = await supabase
        .from('shopping_items')
        .update({ cleared: false })
        .eq('id', item.id)
      
      if (error) throw error
    }
    
    // Reload items to ensure sync
    await loadItems()
    
    showNotificationMessage(
      `Successfully uncleared ${itemsToUnclear.length} item(s)! Spent amount remains UGX ${formatNumber(currentSpent.value)}`,
      'Items Uncleared!',
      'warning'
    )
    
    showUnclearModal.value = false
    
  } catch (error) {
    console.error('Error unclearing items:', error)
    showNotificationMessage('Error unclearing items. Please try again.', 'Error', 'error')
  }
}

const showReturnDropdown = (event, item) => {
  event.preventDefault()
  if (!item.cleared) return
  itemToReturn.value = item
  showReturnModal.value = true
}

const loadData = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  if (user) {
    await loadBudget(user.id)
    await loadItems()
  }
}

const loadBudget = async (userId) => {
  try {
    let { data: budget, error } = await supabase
      .from('budgets')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle()
    
    if (error) throw error
    
    if (budget) {
      budgetAmount.value = budget.budget_amount || 0
      currentSpent.value = budget.spent_amount || 0
    } else {
      // Create budget if doesn't exist
      const { error: insertError } = await supabase
        .from('budgets')
        .insert([{ user_id: userId, budget_amount: 0, spent_amount: 0 }])
      
      if (insertError) throw insertError
      budgetAmount.value = 0
      currentSpent.value = 0
    }
  } catch (err) {
    console.error('Error in loadBudget:', err)
  }
}

const loadItems = async () => {
  const { data: itemsData } = await supabase
    .from('shopping_items')
    .select('*')
    .eq('list_id', listId)
    .order('created_at', { ascending: true })
  
  if (itemsData) {
    items.value = itemsData
  }
}

const clearItem = async (item) => {
  if (item.cleared) return
  
  const itemTotal = item.price * item.quantity
  const currentRemaining = remainingBudgetForList.value
  
  // Calculate if budget is sufficient
  if (itemTotal > currentRemaining) {
    const shortAmount = itemTotal - currentRemaining
    showNotificationMessage(
      `Insufficient budget! Need UGX ${formatNumber(itemTotal)} but only have UGX ${formatNumber(currentRemaining)} remaining. Short by UGX ${formatNumber(shortAmount)}.`,
      'Budget Insufficient',
      'error'
    )
    return
  }
  
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not found')
    
    // Update local state
    item.cleared = true
    currentSpent.value = currentSpent.value + itemTotal
    
    // Update database
    const { error } = await supabase
      .from('shopping_items')
      .update({ cleared: true })
      .eq('id', item.id)
    
    if (error) throw error
    
    // Update budget in database
    await supabase
      .from('budgets')
      .update({ spent_amount: currentSpent.value })
      .eq('user_id', user.id)
    
    showNotificationMessage(`✓ "${item.name}" cleared for UGX ${formatNumber(itemTotal)}`, 'Item Cleared', 'success')
    
  } catch (error) {
    console.error('Error clearing item:', error)
    // Revert on error
    item.cleared = false
    currentSpent.value = currentSpent.value - itemTotal
    showNotificationMessage('Error clearing item. Please try again.', 'Error', 'error')
  }
}

const confirmReturnItem = async () => {
  const item = itemToReturn.value
  const itemTotal = item.price * item.quantity
  
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not found')
    
    // Update local state
    item.cleared = false
    currentSpent.value = currentSpent.value - itemTotal
    
    // Update database
    await supabase
      .from('shopping_items')
      .update({ cleared: false })
      .eq('id', item.id)
    
    // Update budget in database
    await supabase
      .from('budgets')
      .update({ spent_amount: currentSpent.value })
      .eq('user_id', user.id)
    
    showReturnModal.value = false
    itemToReturn.value = null
    
    showNotificationMessage(`Returned "${item.name}" for UGX ${formatNumber(itemTotal)}`, 'Item Returned', 'success')
    
  } catch (error) {
    console.error('Error returning item:', error)
    showNotificationMessage('Error returning item. Please try again.', 'Error', 'error')
  }
}

// COMPLETE CLEARANCE - This is where you navigate to packing page
const completeClearance = async () => {
  if (clearedItems.value.length === 0) {
    showNotificationMessage('No items to complete clearance', 'Info', 'warning')
    return
  }
  
  if (isCompleting.value) return
  isCompleting.value = true
  
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not found')
    
    // Update budget spent amount
    const { error: budgetError } = await supabase
      .from('budgets')
      .update({ spent_amount: currentSpent.value })
      .eq('user_id', user.id)
    
    if (budgetError) throw budgetError
    
    // Save to purchase history
    const { error: historyError } = await supabase
      .from('purchase_history')
      .insert([{
        user_id: user.id,
        list_id: listId,
        list_name: listName,
        items: clearedItems.value.map(item => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          brand: item.notes || 'No brand',
          category: item.category,
          priority: item.priority
        })),
        total_amount: clearedItems.value.reduce((sum, i) => sum + (i.price * i.quantity), 0),
        purchased_at: new Date().toISOString()
      }])
    
    if (historyError) throw historyError
    
    showNotificationMessage(
      `Clearance completed! UGX ${formatNumber(currentSpent.value)} spent. ${clearedItems.value.length} items ready for packing.`,
      'Clearance Complete!',
      'success'
    )
    
    // Navigate to packing checklist page
    setTimeout(() => {
      router.push('/packing-checklist')
    }, 1500)
    
  } catch (error) {
    console.error('Error completing clearance:', error)
    showNotificationMessage('Error completing clearance: ' + error.message, 'Error', 'error')
    isCompleting.value = false
  }
}

// Setup real-time subscriptions
const setupRealtimeSubscriptions = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return
  
  // Subscribe to budget changes
  budgetSubscription = supabase
    .channel('budget-changes')
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
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
  
  // Subscribe to item changes in this list
  itemsSubscription = supabase
    .channel('items-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'shopping_items',
        filter: `list_id=eq.${listId}`
      },
      () => {
        loadItems()
      }
    )
    .subscribe()
}

// Close dropdown on outside click
const handleClickOutside = (e) => {
  if (!e.target.closest('.three-dot-menu') && !e.target.closest('.dropdown-menu')) {
    showDropdown.value = false
  }
}

onMounted(async () => {
  await loadData()
  await setupRealtimeSubscriptions()
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  if (budgetSubscription) {
    supabase.removeChannel(budgetSubscription)
  }
  if (itemsSubscription) {
    supabase.removeChannel(itemsSubscription)
  }
  document.removeEventListener('click', handleClickOutside)
  if (notificationTimeout) clearTimeout(notificationTimeout)
})
</script>

<style scoped>
.shopping-clearance-page {
  min-height: 100vh;
  background: #FFFFFF;
  overflow-y: auto;
  height: 100vh;
}

.clearance-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  padding-bottom: 100px;
}

/* Header Styles */
.header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
  animation: slideDown 0.5s ease-out;
  position: relative;
}

.header-actions {
  position: relative;
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

.dropdown-item:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.item-count-badge {
  margin-left: auto;
  background: #5DFF72;
  color: #0B0B0B;
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

.back-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 12px;
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

.header-info {
  flex: 1;
}

.list-title {
  font-size: 20px;
  font-weight: 700;
  color: #1A1A1A;
  margin-bottom: 4px;
}

.item-count {
  font-size: 12px;
  color: #6C757D;
}

/* Budget Badge */
.budget-badge {
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: all 0.3s;
}

.badge-label {
  font-size: 9px;
  opacity: 0.8;
}

.badge-amount {
  font-size: 14px;
  font-weight: 700;
}

.budget-badge.badge-success {
  background: #5DFF72;
  color: #0B0B0B;
}

.budget-badge.badge-warning {
  background: #ffbb33;
  color: #0B0B0B;
  animation: pulse 1s infinite;
}

.budget-badge.badge-danger {
  background: #ff4444;
  color: white;
  animation: shake 0.5s ease-in-out;
}

/* Budget Summary */
.budget-summary {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 20px;
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

.summary-item {
  background: #F8F9FA;
  padding: 12px;
  border-radius: 16px;
  text-align: center;
}

.summary-label {
  font-size: 10px;
  color: #6C757D;
  margin-bottom: 4px;
}

.summary-value {
  font-size: 14px;
  font-weight: 700;
  color: #1A1A1A;
}

.summary-value.spent {
  color: #FFB74D;
}

.summary-value.remaining {
  color: #5DFF72;
}

.summary-value.remaining.warning {
  color: #ff4444;
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

/* Budget Warning Card */
.budget-warning {
  background: rgba(255, 68, 68, 0.1);
  border: 2px solid #ff4444;
  border-radius: 16px;
  padding: 15px;
  margin-bottom: 20px;
  display: flex;
  gap: 15px;
  align-items: center;
  animation: shake 0.5s ease-in-out;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

.warning-icon svg {
  width: 32px;
  height: 32px;
  color: #ff4444;
}

.warning-content h4 {
  color: #ff4444;
  font-size: 14px;
  font-weight: 700;
  margin-bottom: 4px;
}

.warning-content p {
  color: #ff4444;
  font-size: 12px;
}

.animate-shake {
  animation: shake 0.5s ease-in-out;
}

/* Progress Container */
.progress-container {
  margin-bottom: 20px;
  animation: scaleIn 0.4s ease-out;
}

.progress-bar {
  height: 10px;
  background: #F0F0F0;
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 8px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #5DFF72, #34D399);
  transition: width 0.5s ease;
  border-radius: 10px;
}

.progress-text {
  font-size: 12px;
  color: #6C757D;
  text-align: right;
}

/* Items List */
.items-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 25px;
}

.item-card {
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 15px;
  transition: all 0.3s;
  animation: slideLeft 0.4s ease-out backwards;
  position: relative;
  overflow: hidden;
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
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

.item-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(93, 255, 114, 0.1), transparent);
  transition: left 0.5s;
}

.item-card:hover::before {
  left: 100%;
}

.item-card.cleared {
  opacity: 0.6;
  background: #E8F5E9;
}

.item-card.priority-high {
  border-left: 3px solid #ff4444;
}

.item-card.priority-medium {
  border-left: 3px solid #ffbb33;
}

.item-card.priority-low {
  border-left: 3px solid #5DFF72;
}

.item-card.cannot-clear {
  opacity: 0.5;
  cursor: not-allowed;
}

.item-card.cannot-clear .item-checkbox {
  cursor: not-allowed;
}

.item-checkbox {
  cursor: pointer;
}

.checkbox {
  width: 26px;
  height: 26px;
  border: 2px solid #DDD;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
  background: white;
}

.checkbox.checked {
  background: #5DFF72;
  border-color: #5DFF72;
  animation: checkPop 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.checkbox.disabled {
  background: #F0F0F0;
  border-color: #DDD;
  cursor: not-allowed;
}

@keyframes checkPop {
  0% { transform: scale(0.8); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}

.checkbox svg {
  width: 16px;
  height: 16px;
  color: #0B0B0B;
}

.item-details {
  flex: 1;
}

.item-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 6px;
  flex-wrap: wrap;
}

.item-name {
  font-size: 16px;
  font-weight: 600;
  color: #1A1A1A;
}

.item-name.crossed {
  text-decoration: line-through;
  color: #ADB5BD;
}

.priority-tag {
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 10px;
  font-weight: 600;
}

.priority-tag.high {
  background: rgba(255, 68, 68, 0.1);
  color: #ff4444;
}

.priority-tag.medium {
  background: rgba(255, 187, 51, 0.1);
  color: #ffbb33;
}

.priority-tag.low {
  background: rgba(93, 255, 114, 0.1);
  color: #5DFF72;
}

.item-meta {
  display: flex;
  gap: 15px;
  font-size: 12px;
  color: #6C757D;
  flex-wrap: wrap;
}

.item-brand {
  color: #5DFF72;
  font-weight: 500;
}

.item-total {
  text-align: right;
  min-width: 100px;
}

.total-label {
  font-size: 10px;
  color: #6C757D;
  margin-bottom: 2px;
}

.total-amount {
  font-size: 15px;
  font-weight: 800;
  background: linear-gradient(135deg, #5DFF72, #34D399);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

/* Complete Button */
.complete-btn {
  width: 100%;
  background: linear-gradient(135deg, #5DFF72, #34D399);
  border: none;
  padding: 16px;
  border-radius: 16px;
  font-weight: 700;
  font-size: 16px;
  color: #0B0B0B;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.complete-btn svg {
  width: 20px;
  height: 20px;
}

.complete-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 30px rgba(93, 255, 114, 0.4);
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
}

.modal-content {
  max-width: 400px;
  width: 90%;
  padding: 28px;
  text-align: center;
  background: white;
  border-radius: 20px;
  animation: scaleIn 0.3s ease-out;
}

.modal-icon svg {
  width: 48px;
  height: 48px;
  margin: 0 auto 15px;
  color: #5DFF72;
}

.modal-icon.warning-icon svg {
  color: #ff4444;
}

.modal-title {
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 15px;
  color: #1A1A1A;
}

.confirm-message {
  color: #6C757D;
  margin-bottom: 15px;
}

.confirm-item {
  background: #F8F9FA;
  padding: 12px;
  border-radius: 12px;
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  font-weight: 600;
}

.warning-text {
  background: rgba(255, 68, 68, 0.1);
  border-left: 3px solid #ff4444;
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 20px;
  font-size: 12px;
  color: #ff4444;
}

.warning-text strong {
  display: block;
  margin-bottom: 4px;
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

.btn-primary {
  background: #5DFF72;
  color: #0B0B0B;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(93, 255, 114, 0.3);
}

.btn-secondary {
  background: #F0F0F0;
  color: #666;
}

.btn-secondary:hover {
  background: #E0E0E0;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  animation: fadeIn 0.5s ease-out;
  background: white;
  border-radius: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.empty-state svg {
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

/* Global Reset Notification */
.global-reset-notification {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, #5DFF72, #34D399);
  border-radius: 16px;
  padding: 16px 24px;
  box-shadow: 0 10px 40px rgba(93, 255, 114, 0.3);
  z-index: 2000;
  max-width: 90%;
  width: 400px;
  animation: slideDown 0.5s ease-out;
}

.notification-content {
  display: flex;
  align-items: center;
  gap: 15px;
}

.notification-content svg {
  width: 32px;
  height: 32px;
  color: #0B0B0B;
}

.notification-text strong {
  display: block;
  font-size: 14px;
  margin-bottom: 4px;
  color: #0B0B0B;
}

.notification-text p {
  font-size: 12px;
  color: #0B0B0B;
  opacity: 0.9;
}

/* Animations */
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

.animate-slide-down {
  animation: slideDown 0.5s ease-out;
}

.animate-scale {
  animation: scaleIn 0.4s ease-out;
}

.animate-slide-left {
  animation: slideLeft 0.4s ease-out backwards;
}

.animate-fade-in {
  animation: fadeIn 0.5s ease-out;
}

.animate-pulse {
  animation: pulse 2s infinite;
}

/* Dark Mode Styles */
.dark-mode .shopping-clearance-page {
  background: #1A1A1A;
}

.dark-mode .list-title,
.dark-mode .modal-title,
.dark-mode .item-name,
.dark-mode .empty-state h3 {
  color: #FFFFFF;
}

.dark-mode .summary-item {
  background: #2A2A2A;
}

.dark-mode .summary-value {
  color: #FFFFFF;
}

.dark-mode .back-button svg,
.dark-mode .three-dot-menu svg {
  color: #FFFFFF;
}

.dark-mode .back-button:hover,
.dark-mode .three-dot-menu:hover {
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

.dark-mode .item-card {
  background: #2A2A2A;
}

.dark-mode .item-card.cleared {
  background: #1A3A1A;
}

.dark-mode .item-name {
  color: #FFFFFF;
}

.dark-mode .item-meta {
  color: #ADB5BD;
}

.dark-mode .checkbox {
  background: #3A3A3A;
  border-color: #4A4A4A;
}

.dark-mode .confirm-item {
  background: #3A3A3A;
  color: #FFFFFF;
}

.dark-mode .modal-content {
  background: #2A2A2A;
}

.dark-mode .empty-state {
  background: #2A2A2A;
}

.dark-mode .empty-state p {
  color: #ADB5BD;
}

.dark-mode .budget-badge.badge-success {
  background: #5DFF72;
  color: #0B0B0B;
}

.dark-mode .budget-badge.badge-warning {
  background: #ffbb33;
  color: #0B0B0B;
}

.dark-mode .budget-badge.badge-danger {
  background: #ff4444;
  color: white;
}

.dark-mode .budget-warning {
  background: rgba(255, 68, 68, 0.2);
}

.dark-mode .warning-content h4,
.dark-mode .warning-content p {
  color: #ff8888;
}

.dark-mode .warning-text {
  background: rgba(255, 68, 68, 0.2);
}

.dark-mode .global-reset-notification {
  background: linear-gradient(135deg, #5DFF72, #34D399);
}

.dark-mode .btn-secondary {
  background: #3A3A3A;
  color: #FFFFFF;
}

.dark-mode .btn-secondary:hover {
  background: #4A4A4A;
}

/* Glass Card Effect */
.glass-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.dark-mode .glass-card {
  background: rgba(42, 42, 42, 0.95);
}

/* Scrollbar Styling */
.shopping-clearance-page::-webkit-scrollbar {
  width: 8px;
}

.shopping-clearance-page::-webkit-scrollbar-track {
  background: #F0F0F0;
  border-radius: 10px;
}

.shopping-clearance-page::-webkit-scrollbar-thumb {
  background: #5DFF72;
  border-radius: 10px;
}

.shopping-clearance-page::-webkit-scrollbar-thumb:hover {
  background: #34D399;
}

.dark-mode .shopping-clearance-page::-webkit-scrollbar-track {
  background: #2A2A2A;
}

.dark-mode .shopping-clearance-page::-webkit-scrollbar-thumb {
  background: #5DFF72;
}

/* Add these additional styles to your existing CSS */

/* Uncleared Total Card */
.uncleared-total-card {
  background: #F8F9FA;
  border-radius: 16px;
  padding: 15px;
  margin-bottom: 20px;
  animation: scaleIn 0.4s ease-out;
}

.uncleared-total-card.can-clear {
  background: rgba(93, 255, 114, 0.1);
  border: 1px solid #5DFF72;
}

.uncleared-total-card.cannot-clear {
  background: rgba(255, 68, 68, 0.1);
  border: 1px solid #ff4444;
}

.uncleared-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-weight: 600;
}

.uncleared-label {
  color: #6C757D;
  font-size: 14px;
}

.uncleared-amount {
  color: #1A1A1A;
  font-size: 16px;
  font-weight: 700;
}

.comparison-result {
  font-size: 12px;
  padding-top: 8px;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}

.comparison-result .sufficient {
  color: #5DFF72;
}

.comparison-result .insufficient {
  color: #ff4444;
}

/* Budget Warning Cards */
.budget-warning-danger {
  background: rgba(255, 68, 68, 0.15);
  border: 2px solid #ff4444;
  border-radius: 16px;
  padding: 15px;
  margin-bottom: 20px;
  display: flex;
  gap: 15px;
  align-items: center;
  animation: shake 0.5s ease-in-out;
}

.budget-warning-tight {
  background: rgba(255, 187, 51, 0.15);
  border: 2px solid #ffbb33;
  border-radius: 16px;
  padding: 15px;
  margin-bottom: 20px;
  display: flex;
  gap: 15px;
  align-items: center;
}

.summary-item.insufficient {
  background: rgba(255, 68, 68, 0.2);
}

.summary-value.remaining.negative {
  color: #ff4444;
}

.summary-value.remaining.warning {
  color: #ffbb33;
  animation: pulse 1s infinite;
}

/* Item Warning */
.item-warning {
  margin-top: 5px;
  font-size: 10px;
  color: #ffbb33;
}

.item-warning.needs-budget {
  color: #ff4444;
  font-weight: 500;
}

/* Notification Types */
.global-reset-notification.success {
  background: linear-gradient(135deg, #5DFF72, #34D399);
}

.global-reset-notification.error {
  background: linear-gradient(135deg, #ff4444, #cc0000);
}

.global-reset-notification.warning {
  background: linear-gradient(135deg, #ffbb33, #ff9900);
}

/* Dark Mode Additions */
.dark-mode .uncleared-total-card {
  background: #2A2A2A;
}

.dark-mode .uncleared-amount {
  color: #FFFFFF;
}

.dark-mode .uncleared-label {
  color: #ADB5BD;
}

.dark-mode .comparison-result .sufficient {
  color: #5DFF72;
}

.dark-mode .comparison-result .insufficient {
  color: #ff8888;
}
</style>


