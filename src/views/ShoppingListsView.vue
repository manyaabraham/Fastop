<template>
  <div class="shopping-lists-page">
    <div class="shopping-lists-container">
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
          <h1 class="page-title">Shopping Lists</h1>
          <p class="page-subtitle">Manage all your school supply lists</p>
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

      <!-- Create List Button -->
      <div class="create-section animate-scale">
        <button @click="showCreateModal = true" class="create-btn">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2"/>
          </svg>
          <span>Create New List</span>
        </button>
      </div>

      <!-- Lists Grid -->
      <div v-if="filteredLists.length > 0" class="lists-grid">
        <div v-for="(list, index) in filteredLists" :key="list.id" 
             class="list-card-wrapper"
             :style="{ animationDelay: `${index * 0.05}s` }">
          
          <div class="list-card glass-card animate-slide-left"
               @click="goToList(list.id)"
               @contextmenu.prevent="showDropdown($event, list)"
               @touchstart="touchStart"
               @touchend="touchEnd(list)"
               @touchmove="touchMove">
            
            <div class="card-content">
              <div class="card-info">
                <h3 class="list-name">{{ list.name }}</h3>
                <div class="list-date">
                  <svg class="date-icon" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5"/>
                    <polyline points="12 6 12 12 16 14" stroke="currentColor" stroke-width="1.5"/>
                  </svg>
                  <span>{{ formatDate(list.created_at) }}</span>
                </div>
              </div>
              <div class="card-stats">
                <div class="stat-badge animate-pulse">
                  <span class="stat-number">{{ itemCounts[list.id] || 0 }}</span>
                  <span class="stat-label">items</span>
                </div>
              </div>
            </div>
            
            <div class="card-arrow">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2"/>
              </svg>
            </div>
            
            <div class="card-shine"></div>
          </div>
          
          <!-- Dropdown Menu -->
        <!-- Dropdown Menu -->
<div v-if="activeDropdown === list.id" 
     class="dropdown-menu animate-dropdown"
     :style="{ top: dropdownPosition.y + 'px', left: dropdownPosition.x + 'px' }">
  <button class="dropdown-item shop" @click="goToShoppingMode(list.id)">
    <svg viewBox="0 0 24 24" fill="none">
      <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" stroke-width="2"/>
      <circle cx="12" cy="13" r="2" stroke="currentColor" stroke-width="2"/>
    </svg>
    <span>Start Shopping</span>
  </button>
  <button class="dropdown-item edit" @click="editList(list)">
    <svg viewBox="0 0 24 24" fill="none">
      <path d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34" stroke="currentColor" stroke-width="2"/>
      <polygon points="18 2 22 6 12 16 8 16 8 12 18 2" stroke="currentColor" stroke-width="2"/>
    </svg>
    <span>Edit List</span>
  </button>
  <button class="dropdown-item delete" @click="confirmDelete(list)">
    <svg viewBox="0 0 24 24" fill="none">
      <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" stroke-width="2"/>
    </svg>
    <span>Delete List</span>
  </button>
</div>
        </div>
      </div>

      <!-- Empty State - No Lists -->
      <div v-else-if="shoppingStore.lists.length === 0" class="empty-state glass-card animate-fade-in">
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke="currentColor" stroke-width="1.5"/>
          <polyline points="22 4 12 14.01 9 11.01" stroke="currentColor" stroke-width="1.5"/>
        </svg>
        <h3>No Lists Yet</h3>
        <p>Create your first shopping list to get started</p>
        <button @click="showCreateModal = true" class="btn-primary">Create List</button>
      </div>

      <!-- Empty State - No Search Results -->
      <div v-else-if="shoppingStore.lists.length > 0 && filteredLists.length === 0" class="empty-state glass-card animate-fade-in">
        <svg viewBox="0 0 24 24" fill="none">
          <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="1.5"/>
          <path d="m21 21-4.3-4.3" stroke="currentColor" stroke-width="1.5"/>
        </svg>
        <h3>No Results Found</h3>
        <p>No lists matching "<strong>{{ searchQuery }}</strong>"</p>
        <button @click="searchQuery = ''" class="btn-primary">Clear Search</button>
      </div>

      <!-- Create/Edit Modal -->
      <div v-if="showCreateModal" class="modal-overlay" @click.self="closeModal">
        <div class="modal-content glass-card animate-scale">
          <h2 class="modal-title">{{ isEditing ? 'Edit List' : 'Create New List' }}</h2>
          <input 
            v-model="listName" 
            type="text" 
            class="input-field" 
            :placeholder="isEditing ? 'Enter new name' : 'Enter list name'"
            @keyup.enter="saveList"
          />
          <div class="modal-buttons">
            <button @click="saveList" class="btn-primary">{{ isEditing ? 'Update' : 'Create' }}</button>
            <button @click="closeModal" class="btn-secondary">Cancel</button>
          </div>
        </div>
      </div>

      <!-- Delete Confirmation Modal -->
      <div v-if="showDeleteModal" class="modal-overlay" @click.self="showDeleteModal = false">
        <div class="modal-content glass-card animate-scale">
          <h2 class="modal-title">Delete List</h2>
          <p class="delete-message">Are you sure you want to delete "<strong>{{ listToDelete?.name }}</strong>"?</p>
          <p class="delete-warning">This will also delete all items in this list.</p>
          <div class="modal-buttons">
            <button @click="deleteList" class="btn-danger">Delete</button>
            <button @click="showDeleteModal = false" class="btn-secondary">Cancel</button>
          </div>
        </div>
      </div>

      <!-- Footer Sentence -->
      <div class="footer-sentence animate-fade-in">
        <div class="sentence-decoration">
          <span class="dot"></span>
          <span class="line"></span>
          <span class="dot"></span>
        </div>
        <p class="sentence-text">
          Organize your school supplies, save time and money ✨
        </p>
      </div>
    </div>
    <!-- Notification Toast -->
<div v-if="showNotification" class="notification-toast animate-slide-down" :class="notificationType">
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
import { useShoppingStore } from '../stores/shopping'

const router = useRouter()
const shoppingStore = useShoppingStore()
const logoUrl = '/logo.png'

const showCreateModal = ref(false)
const showDeleteModal = ref(false)
const isEditing = ref(false)
const listName = ref('')
const currentListId = ref(null)
const listToDelete = ref(null)
const activeDropdown = ref(null)
const dropdownPosition = ref({ x: 0, y: 0 })
const itemCounts = ref({})
const searchQuery = ref('')
const showNotification = ref(false)
const notificationMessage = ref('')
const notificationType = ref('success')
let notificationTimeout = null

// Touch handling for long press
let touchTimer = null
let touchStartX = 0
let touchStartY = 0
const LONG_PRESS_DURATION = 500

const showNotificationMessage = (message, type = 'success') => {
  notificationMessage.value = message
  notificationType.value = type
  showNotification.value = true
  
  if (notificationTimeout) clearTimeout(notificationTimeout)
  notificationTimeout = setTimeout(() => {
    showNotification.value = false
  }, 3000)
}

const filteredLists = computed(() => {
  if (!searchQuery.value) return shoppingStore.lists
  const query = searchQuery.value.toLowerCase()
  return shoppingStore.lists.filter(list => 
    list.name.toLowerCase().includes(query)
  )
})

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

const getItemCount = async (listId) => {
  if (itemCounts.value[listId]) return itemCounts.value[listId]
  
  const { count } = await supabase
    .from('shopping_items')
    .select('*', { count: 'exact', head: true })
    .eq('list_id', listId)
  
  itemCounts.value[listId] = count || 0
  return itemCounts.value[listId]
}

const loadAllItemCounts = async () => {
  for (const list of shoppingStore.lists) {
    await getItemCount(list.id)
  }
}

const touchStart = (e) => {
  touchTimer = setTimeout(() => {}, LONG_PRESS_DURATION)
  touchStartX = e.touches[0].clientX
  touchStartY = e.touches[0].clientY
}

const touchEnd = (list) => {
  if (touchTimer) {
    clearTimeout(touchTimer)
    touchTimer = null
  }
}

const touchMove = (e) => {
  if (touchTimer) {
    const moveX = Math.abs(e.touches[0].clientX - touchStartX)
    const moveY = Math.abs(e.touches[0].clientY - touchStartY)
    if (moveX > 10 || moveY > 10) {
      clearTimeout(touchTimer)
      touchTimer = null
    }
  }
}

const showDropdown = (event, list) => {
  event.preventDefault()
  
  if (activeDropdown.value === list.id) {
    activeDropdown.value = null
    return
  }
  
  let x = event.clientX
  let y = event.clientY
  
  const dropdownWidth = 200
  const dropdownHeight = 100
  if (x + dropdownWidth > window.innerWidth) {
    x = window.innerWidth - dropdownWidth - 10
  }
  if (y + dropdownHeight > window.innerHeight) {
    y = window.innerHeight - dropdownHeight - 10
  }
  
  dropdownPosition.value = { x, y }
  activeDropdown.value = list.id
  
  setTimeout(() => {
    if (activeDropdown.value === list.id) {
      activeDropdown.value = null
    }
  }, 3000)
}

const handleClickOutside = (e) => {
  if (!e.target.closest('.dropdown-menu') && !e.target.closest('.list-card')) {
    activeDropdown.value = null
  }
}

// Go to shopping mode (clearing page) - THIS CREATES A COPY FOR SHOPPING
const goToShoppingMode = (listId) => {
  activeDropdown.value = null
  router.push(`/shopping-clearance/${listId}`)
}

const goToList = (listId) => {
  activeDropdown.value = null
  router.push(`/list/${listId}`)
}

const editList = (list) => {
  activeDropdown.value = null
  isEditing.value = true
  currentListId.value = list.id
  listName.value = list.name
  showCreateModal.value = true
}

const saveList = async () => {
  if (!listName.value.trim()) {
    showNotificationMessage('Please enter a list name', 'error')
    return
  }
  
  if (isEditing.value) {
    const { error } = await supabase
      .from('shopping_lists')
      .update({ name: listName.value })
      .eq('id', currentListId.value)
    
    if (!error) {
      await shoppingStore.fetchLists()
      await loadAllItemCounts()
      showNotificationMessage('List updated successfully!', 'success')
    } else {
      showNotificationMessage('Error updating list. Please try again.', 'error')
    }
  } else {
    const result = await shoppingStore.createList(listName.value)
    if (result) {
      await loadAllItemCounts()
      showNotificationMessage('List created successfully!', 'success')
    } else {
      showNotificationMessage('Error creating list. Please try again.', 'error')
    }
  }
  
  closeModal()
}

const confirmDelete = (list) => {
  activeDropdown.value = null
  listToDelete.value = list
  showDeleteModal.value = true
}

const deleteList = async () => {
  if (listToDelete.value) {
    const { error } = await supabase
      .from('shopping_lists')
      .delete()
      .eq('id', listToDelete.value.id)
    
    if (!error) {
      await shoppingStore.fetchLists()
      delete itemCounts.value[listToDelete.value.id]
      showNotificationMessage('List deleted successfully!', 'success')
    } else {
      showNotificationMessage('Error deleting list. Please try again.', 'error')
    }
  }
  showDeleteModal.value = false
  listToDelete.value = null
}

const closeModal = () => {
  showCreateModal.value = false
  isEditing.value = false
  listName.value = ''
  currentListId.value = null
}

onMounted(async () => {
  await shoppingStore.fetchLists()
  await loadAllItemCounts()
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  if (touchTimer) clearTimeout(touchTimer)
  if (notificationTimeout) clearTimeout(notificationTimeout)
})
</script>

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

/* Header */
.header-section {
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

.header-logo {
  width: 50px;
  height: 50px;
  border-radius: 16px;
  object-fit: cover;
  box-shadow: 0 4px 15px rgba(93, 255, 114, 0.2);
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

.page-title {
  font-size: 24px;
  font-weight: 700;
  color: #1A1A1A;
  margin-bottom: 4px;
}

.page-subtitle {
  font-size: 13px;
  color: #6C757D;
}

/* Create Section */
.create-section {
  margin-bottom: 25px;
  animation: scaleIn 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.7);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.create-btn {
  width: 100%;
  background: linear-gradient(135deg, #5DFF72, #34D399);
  border: none;
  padding: 16px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-weight: 700;
  font-size: 16px;
  color: #0B0B0B;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  position: relative;
  overflow: hidden;
}

.dropdown-item.shop {
  color: #5DFF72;
}

.dropdown-item.shop svg {
  color: #5DFF72;
}

.dropdown-item.shop:hover {
  background: rgba(93, 255, 114, 0.1);
  transform: translateX(5px);
}.dropdown-item.shop {
  color: #5DFF72;
}

.dropdown-item.shop svg {
  color: #5DFF72;
}

.dropdown-item.shop:hover {
  background: rgba(93, 255, 114, 0.1);
  transform: translateX(5px);
}

.create-btn::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
}

.create-btn:active::before {
  width: 300px;
  height: 300px;
}

.create-btn svg {
  width: 22px;
  height: 22px;
  transition: transform 0.3s;
}

.create-btn:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 30px rgba(93, 255, 114, 0.4);
}

.create-btn:hover svg {
  transform: rotate(90deg);
}

.create-btn:active {
  transform: translateY(0);
}

/* Lists Grid */
.lists-grid {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.list-card-wrapper {
  position: relative;
  animation: slideLeft 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) backwards;
}

@keyframes slideLeft {
  from {
    opacity: 0;
    transform: translateX(50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
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
  transform: translateX(8px) scale(1.02);
  border-left: 3px solid #5DFF72;
}

.card-shine {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(93, 255, 114, 0.1), transparent);
  transition: left 0.6s;
}

.list-card:hover .card-shine {
  left: 100%;
}

.card-content {
  flex: 1;
}

.card-info {
  margin-bottom: 8px;
}

.list-name {
  font-size: 17px;
  font-weight: 700;
  color: #1A1A1A;
  margin-bottom: 6px;
  transition: color 0.3s;
}

.list-card:hover .list-name {
  color: #5DFF72;
}

.list-date {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: #ADB5BD;
}

.date-icon {
  width: 12px;
  height: 12px;
  color: #5DFF72;
}

.card-stats {
  display: flex;
  gap: 10px;
}

.stat-badge {
  background: rgba(93, 255, 114, 0.1);
  padding: 4px 10px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 5px;
}

.stat-number {
  font-size: 14px;
  font-weight: 700;
  color: #5DFF72;
}

.stat-label {
  font-size: 10px;
  color: #6C757D;
}

.card-arrow svg {
  width: 20px;
  height: 20px;
  color: #5DFF72;
  transition: transform 0.3s;
}

.list-card:hover .card-arrow svg {
  transform: translateX(5px);
}

/* Dropdown Menu */
.dropdown-menu {
  position: fixed;
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  z-index: 1000;
  min-width: 180px;
  animation: dropdownFade 0.2s ease-out;
}

@keyframes dropdownFade {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(-10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
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
}

.dropdown-item svg {
  width: 18px;
  height: 18px;
}

.dropdown-item.edit {
  color: #1A1A1A;
}

.dropdown-item.edit svg {
  color: #5DFF72;
}

.dropdown-item.edit:hover {
  background: rgba(93, 255, 114, 0.1);
  transform: translateX(5px);
}

.dropdown-item.delete {
  color: #ff4444;
  border-top: 1px solid #F0F0F0;
}

.dropdown-item.delete svg {
  color: #ff4444;
}

.dropdown-item.delete:hover {
  background: rgba(255, 68, 68, 0.1);
  transform: translateX(5px);
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  animation: fadeIn 0.6s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.empty-state svg {
  width: 80px;
  height: 80px;
  color: #5DFF72;
  margin-bottom: 20px;
  opacity: 0.5;
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
  animation: scaleIn 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.modal-title {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 20px;
  text-align: center;
  color: #1A1A1A;
}

.delete-message {
  text-align: center;
  margin-bottom: 10px;
  color: #1A1A1A;
}

.delete-message strong {
  color: #5DFF72;
}

.delete-warning {
  text-align: center;
  font-size: 12px;
  color: #ff4444;
  margin-bottom: 20px;
}

.modal-buttons {
  display: flex;
  gap: 12px;
  margin-top: 20px;
}

.modal-buttons button {
  flex: 1;
}

.btn-danger {
  background: linear-gradient(135deg, #ff4444, #cc0000);
  color: white;
  border: none;
  padding: 12px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-danger:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(255, 68, 68, 0.3);
}

/* Dark Mode */
.dark-mode .shopping-lists-page {
  background: #1A1A1A;
}

.dark-mode .header-section {
  background: #2A2A2A;
}

.dark-mode .page-title,
.dark-mode .modal-title,
.dark-mode .empty-state h3,
.dark-mode .list-name,
.dark-mode .delete-message,
.dark-mode .dropdown-item.edit {
  color: #FFFFFF;
}

.dark-mode .page-subtitle,
.dark-mode .list-date,
.dark-mode .stat-label,
.dark-mode .empty-state p {
  color: #ADB5BD;
}

.dark-mode .dropdown-menu {
  background: #2A2A2A;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
}

.dark-mode .dropdown-item.delete {
  border-top-color: #3A3A3A;
}
/* Search Bar Styles */
.search-section {
  margin-bottom: 20px;
  animation: scaleIn 0.4s ease-out;
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

/* Footer Sentence Styles */
.footer-sentence {
  margin-top: 40px;
  padding: 20px;
  text-align: center;
}

.sentence-decoration {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 15px;
}

.sentence-decoration .dot {
  width: 4px;
  height: 4px;
  background: #5DFF72;
  border-radius: 50%;
}

.sentence-decoration .line {
  width: 60px;
  height: 1px;
  background: linear-gradient(90deg, transparent, #5DFF72, #5DFF72, transparent);
}

.sentence-text {
  font-size: 13px;
  font-weight: 500;
  color: #1A1A1A;
  background: linear-gradient(135deg, #5DFF72, #34D399);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  letter-spacing: 0.5px;
}

/* Dark Mode */
.dark-mode .search-input {
  background: #2A2A2A;
  border-color: #3A3A3A;
  color: #FFFFFF;
}

.dark-mode .search-input:focus {
  background: #2A2A2A;
}

.dark-mode .sentence-text {
  background: linear-gradient(135deg, #5DFF72, #34D399);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .search-input {
    padding: 12px 16px 12px 44px;
    font-size: 14px;
  }
  
  .search-icon {
    width: 18px;
    height: 18px;
    left: 14px;
  }
  
  .footer-sentence {
    margin-top: 30px;
    padding: 15px;
  }
  
  .sentence-text {
    font-size: 11px;
  }
  
  .sentence-decoration .line {
    width: 40px;
  }
}
/* Notification Toast */
.notification-toast {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: white;
  border-radius: 16px;
  padding: 14px 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  z-index: 10000;
  max-width: 90%;
  width: 350px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
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
  width: 20px;
  height: 20px;
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

.notification-text p {
  font-size: 13px;
  color: #1A1A1A;
  margin: 0;
  line-height: 1.4;
}

.dark-mode .notification-text p {
  color: #FFFFFF;
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
  width: 14px;
  height: 14px;
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

/* Mobile responsive */
@media (max-width: 768px) {
  .notification-toast {
    top: 10px;
    padding: 12px 16px;
    width: 85%;
  }
  
  .notification-icon svg {
    width: 18px;
    height: 18px;
  }
  
  .notification-text p {
    font-size: 12px;
  }
}
</style>