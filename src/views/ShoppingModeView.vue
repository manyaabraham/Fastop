<template>
  <div class="shopping-lists-page">
    <div class="shopping-lists-container">
      <!-- Header with Logo and Budget -->
      <div class="header-section animate-slide-down">
        <div class="header-top">
          <div class="header-left">
            <button class="back-button" @click="$router.back()">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" stroke-width="2"/>
              </svg>
            </button>
            <div class="logo-area">
              <img v-if="logoUrl" :src="logoUrl" alt="Fastop Logo" class="header-logo" />
              <h1 class="page-title">Shopping Lists</h1>
            </div>
          </div>
          <button class="history-menu-btn" @click="showHistoryMenu = !showHistoryMenu">
            <svg viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="1" fill="currentColor"/>
              <circle cx="12" cy="5" r="1" fill="currentColor"/>
              <circle cx="12" cy="19" r="1" fill="currentColor"/>
            </svg>
          </button>
          <div v-if="showHistoryMenu" class="history-dropdown animate-dropdown">
            <button @click="goToPurchaseHistory" class="dropdown-item">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M12 8v4l3 3M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" stroke="currentColor" stroke-width="2"/>
              </svg>
              View Purchase History
            </button>
           
          </div>
        </div>

        <!-- Budget Display -->
        <div class="budget-card animate-scale">
          <div class="budget-info">
            <div class="budget-label">Total Budget</div>
            <div class="budget-amount">UGX {{ formatNumber(budgetAmount) }}</div>
          </div>
          <div class="budget-info">
            <div class="budget-label">Total Spent</div>
            <div class="budget-amount spent">UGX {{ formatNumber(totalSpentAll) }}</div>
          </div>
          <div class="budget-info">
            <div class="budget-label">Remaining</div>
            <div class="budget-amount remaining" :class="{ warning: remainingBudgetAll < 50000 }">
              UGX {{ formatNumber(remainingBudgetAll) }}
            </div>
          </div>
          <div class="budget-bar">
            <div class="budget-fill" :style="{ width: spentPercentageAll + '%' }"></div>
          </div>
        </div>

        <!-- Search Bar -->
        <div class="search-section animate-scale" style="animation-delay: 0.05s">
          <div class="search-wrapper">
            <svg class="search-icon" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2"/>
              <path d="m21 21-4.3-4.3" stroke="currentColor" stroke-width="2"/>
            </svg>
            <input 
              v-model="searchQuery" 
              type="text" 
              class="search-input" 
              placeholder="Search shopping lists..."
            />
            <button v-if="searchQuery" class="clear-search" @click="searchQuery = ''">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Shopping Lists Grid -->
      <div v-if="filteredShoppingLists.length > 0" class="lists-grid">
        <div v-for="(list, index) in filteredShoppingLists" :key="list.id" 
             class="list-card glass-card animate-slide-left"
             @click="goToClearance(list.id, list.name)"
             :style="{ animationDelay: `${0.1 + index * 0.05}s` }">
          
          <div class="list-icon">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" stroke-width="1.5"/>
              <polyline points="22,6 12,13 2,6" stroke="currentColor" stroke-width="1.5"/>
            </svg>
          </div>
          
          <div class="list-info">
            <h3 class="list-name">{{ list.name }}</h3>
            <div class="list-stats">
              <span class="list-items">{{ getListStats(list.id).total }} items</span>
              <span class="list-cleared">{{ getListStats(list.id).cleared }} cleared</span>
            </div>
          </div>
          
          <div class="list-total">
            <div class="total-label">Total Value</div>
            <div class="total-amount">UGX {{ formatNumber(getListTotal(list.id)) }}</div>
          </div>
          
          <div class="list-arrow">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2"/>
            </svg>
          </div>
        </div>
      </div>

      <!-- Empty State - No Search Results -->
      <div v-else-if="filteredShoppingLists.length === 0 && searchQuery" class="empty-state glass-card animate-fade-in">
        <svg viewBox="0 0 24 24" fill="none">
          <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="1.5"/>
          <path d="m21 21-4.3-4.3" stroke="currentColor" stroke-width="1.5"/>
        </svg>
        <h3>No Results Found</h3>
        <p>No shopping lists match "{{ searchQuery }}"</p>
        <button @click="searchQuery = ''" class="btn-primary">Clear Search</button>
      </div>

      <!-- Empty State - No Lists -->
      <div v-else-if="shoppingLists.length === 0" class="empty-state glass-card animate-fade-in">
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M20 12V8H4v12h16v-4M12 4v4M8 4v4M16 4v4" stroke="currentColor" stroke-width="1.5"/>
        </svg>
        <h3>No Shopping Lists</h3>
        <p>Create a shopping list first to start shopping</p>
        <button @click="$router.push('/lists')" class="btn-primary">Create List</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.shopping-lists-page {
  min-height: 100vh;
  background: #FFFFFF;
  overflow-y: auto;
  height: 100vh;
}

.shopping-lists-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  padding-bottom: 90px;
}

.header-section {
  margin-bottom: 25px;
}

.header-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.logo-area {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-logo {
  width: 45px;
  height: 45px;
  border-radius: 12px;
  object-fit: cover;
  box-shadow: 0 4px 12px rgba(93, 255, 114, 0.2);
}

.page-title {
  font-size: 24px;
  font-weight: 700;
  color: #1A1A1A;
}

.history-menu-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 10px;
  border-radius: 12px;
  transition: all 0.3s;
  position: relative;
}

.history-menu-btn svg {
  width: 24px;
  height: 24px;
  color: #1A1A1A;
}

.history-menu-btn:hover {
  background: #F0F0F0;
}

.history-dropdown {
  position: absolute;
  top: 70px;
  right: 20px;
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
}

.dropdown-item svg {
  width: 18px;
  height: 18px;
}

.dropdown-item:hover {
  background: #F8F9FA;
}

.dropdown-item.danger {
  color: #ff4444;
  border-top: 1px solid #F0F0F0;
}

.dropdown-item.danger svg {
  color: #ff4444;
}

/* Budget Card */
.budget-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  border-radius: 20px;
  margin-bottom: 20px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
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

.budget-info {
  text-align: center;
}

.budget-label {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 5px;
}

.budget-amount {
  font-size: 16px;
  font-weight: 700;
  color: white;
}

.budget-amount.spent {
  color: #FFB74D;
}

.budget-amount.remaining {
  color: #81C784;
}

.budget-amount.remaining.warning {
  color: #FF8A80;
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

.budget-bar {
  grid-column: span 3;
  height: 8px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  overflow: hidden;
}

.budget-fill {
  height: 100%;
  background: white;
  border-radius: 10px;
  transition: width 0.3s;
}

/* Search Section */
.search-section {
  margin-bottom: 20px;
  animation: scaleIn 0.4s ease-out;
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

.search-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 16px;
  width: 20px;
  height: 20px;
  color: #ADB5BD;
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 14px 16px 14px 48px;
  background: #F8F9FA;
  border: 2px solid #E9ECEF;
  border-radius: 20px;
  font-size: 15px;
  font-family: 'Poppins', sans-serif;
  transition: all 0.3s;
}

.search-input:focus {
  outline: none;
  border-color: #5DFF72;
  background: #FFFFFF;
}

.clear-search {
  position: absolute;
  right: 16px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 50%;
  transition: all 0.3s;
}

.clear-search svg {
  width: 18px;
  height: 18px;
  color: #ADB5BD;
}

.clear-search:hover svg {
  color: #ff4444;
}

/* Lists Grid */
.lists-grid {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.list-card {
  padding: 18px;
  display: flex;
  align-items: center;
  gap: 15px;
  cursor: pointer;
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

.list-card:hover {
  transform: translateX(5px);
  border-left: 3px solid #5DFF72;
}

.list-icon svg {
  width: 40px;
  height: 40px;
  color: #5DFF72;
}

.list-info {
  flex: 1;
}

.list-name {
  font-size: 16px;
  font-weight: 700;
  color: #1A1A1A;
  margin-bottom: 4px;
}

.list-stats {
  display: flex;
  gap: 15px;
  font-size: 11px;
  color: #6C757D;
}

.list-total {
  text-align: right;
}

.total-label {
  font-size: 10px;
  color: #6C757D;
}

.total-amount {
  font-size: 14px;
  font-weight: 700;
  color: #5DFF72;
}

.list-arrow svg {
  width: 20px;
  height: 20px;
  color: #ADB5BD;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  animation: fadeIn 0.5s ease-out;
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

.btn-primary {
  background: linear-gradient(135deg, #5DFF72, #34D399);
  border: none;
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 600;
  color: #0B0B0B;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(93, 255, 114, 0.3);
}

/* Animations */
.animate-slide-down {
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

.animate-dropdown {
  animation: dropdownFade 0.2s ease-out;
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

/* Dark Mode */
.dark-mode .shopping-lists-page {
  background: #1A1A1A;
}

.dark-mode .page-title,
.dark-mode .list-name,
.dark-mode .empty-state h3 {
  color: #FFFFFF;
}

.dark-mode .search-input {
  background: #2A2A2A;
  border-color: #3A3A3A;
  color: #FFFFFF;
}

.dark-mode .history-dropdown {
  background: #2A2A2A;
}

.dark-mode .dropdown-item {
  color: #FFFFFF;
}

.dark-mode .dropdown-item:hover {
  background: #3A3A3A;
}

.dark-mode .back-button svg {
  color: #FFFFFF;
}
/* Add this missing header-left class */
.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* Fix the back-button position */
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
  margin-right: 4px;
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

/* Fix the header-top layout */
.header-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 10px;
}

/* Ensure the history dropdown is positioned correctly */
.history-dropdown {
  position: absolute;
  top: 70px;
  right: 20px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  z-index: 100;
  min-width: 200px;
}

/* Make the header section relative for dropdown positioning */
.header-section {
  margin-bottom: 25px;
  position: relative;
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
</style>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../supabase/client'

const router = useRouter()
const logoUrl = '/logo.png'
const shoppingLists = ref([])
const budgetAmount = ref(0)
const totalSpentAll = ref(0)
const searchQuery = ref('')
const showHistoryMenu = ref(false)
const listStats = ref({})

const filteredShoppingLists = computed(() => {
  if (!searchQuery.value) return shoppingLists.value
  const query = searchQuery.value.toLowerCase()
  return shoppingLists.value.filter(list => 
    list.name.toLowerCase().includes(query)
  )
})

const remainingBudgetAll = computed(() => budgetAmount.value - totalSpentAll.value)
const spentPercentageAll = computed(() => {
  if (budgetAmount.value === 0) return 0
  return Math.min((totalSpentAll.value / budgetAmount.value) * 100, 100)
})

const formatNumber = (num) => num?.toLocaleString() || '0'

const loadData = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  if (user) {
    // Load shopping lists
    const { data: lists } = await supabase
      .from('shopping_lists')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    
    if (lists) {
      shoppingLists.value = lists
      // Load stats for each list
      for (const list of lists) {
        await loadListStats(list.id)
      }
    }
    
    // Load budget
    const { data: budget } = await supabase
      .from('budgets')
      .select('*')
      .eq('user_id', user.id)
      .single()
    
    if (budget) {
      budgetAmount.value = budget.budget_amount
      totalSpentAll.value = budget.spent_amount || 0
    }
  }
}

// The back button function is already in your template
// @click="$router.back()" - this goes back to previous page

// If you want a custom function instead:
const goBack = () => {
  router.back()
}

// Then in template use:
// <button class="back-button" @click="goBack">

const loadListStats = async (listId) => {
  const { data: items } = await supabase
    .from('shopping_items')
    .select('*')
    .eq('list_id', listId)
  
  if (items) {
    listStats.value[listId] = {
      total: items.length,
      cleared: items.filter(i => i.cleared).length,
      totalValue: items.reduce((sum, i) => sum + (i.price * i.quantity), 0)
    }
  }
}

const getListStats = (listId) => {
  return listStats.value[listId] || { total: 0, cleared: 0, totalValue: 0 }
}

const getListTotal = (listId) => {
  return listStats.value[listId]?.totalValue || 0
}

const goToClearance = (listId, listName) => {
  router.push(`/shopping-clearance/${listId}?name=${encodeURIComponent(listName)}`)
}

const goToPurchaseHistory = () => {
  showHistoryMenu.value = false
  router.push('/purchase-history')
}

const clearAllHistory = async () => {
  if (confirm('Are you sure you want to clear ALL purchase history? This cannot be undone.')) {
    const { data: { user } } = await supabase.auth.getUser()
    await supabase
      .from('purchase_history')
      .delete()
      .eq('user_id', user.id)
    alert('Purchase history cleared!')
    showHistoryMenu.value = false
  }
}

// Close dropdown when clicking outside
const handleClickOutside = (e) => {
  if (!e.target.closest('.history-menu-btn') && !e.target.closest('.history-dropdown')) {
    showHistoryMenu.value = false
  }
}

onMounted(() => {
  loadData()
  document.addEventListener('click', handleClickOutside)
})
</script>

