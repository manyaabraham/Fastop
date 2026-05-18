<template>
  <div class="shopping-detail-page">
    <div class="detail-container">
      <!-- Header -->
      <div class="header animate-slide-down">
        <button class="back-button" @click="$router.back()">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" stroke-width="2"/>
          </svg>
        </button>
        <div class="header-info">
          <h1 class="list-title">{{ listName }}</h1>
          <p class="item-count">{{ filteredItems.length }} / {{ items.length }} items</p>
        </div>
        <button class="edit-list-name" @click="editListName">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34" stroke="currentColor" stroke-width="2"/>
            <polygon points="18 2 22 6 12 16 8 16 8 12 18 2" stroke="currentColor" stroke-width="2"/>
          </svg>
        </button>
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
            @input="handleSearch"
            type="text" 
            class="search-input" 
            placeholder="Search by name, category, or notes..."
          />
          <button v-if="searchQuery" class="clear-search" @click="clearSearch">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2"/>
            </svg>
          </button>
        </div>
        <div v-if="searchQuery" class="search-results-count">
          Found {{ filteredItems.length }} item{{ filteredItems.length !== 1 ? 's' : '' }}
        </div>
      </div>

      <!-- Stats Summary -->
      <div class="stats-summary animate-scale" style="animation-delay: 0.1s">
        <div class="stat-item">
          <div class="stat-value">{{ filteredItems.length }}</div>
          <div class="stat-label">Showing Items</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">UGX {{ filteredTotalCost }}</div>
          <div class="stat-label">Total Cost</div>
        </div>
      </div>

      <!-- Add Item Button -->
      <div class="add-section animate-scale" style="animation-delay: 0.15s">
        <button @click="showAddModal = true" class="add-item-btn">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2"/>
          </svg>
          <span>Add New Item</span>
        </button>
      </div>

      <!-- Items List -->
  <!-- Replace the items list section in your template -->

<!-- Items List -->
<div v-if="filteredItems.length > 0" class="items-list">
  <div v-for="(item, index) in filteredItems" :key="item.id" 
       class="item-card glass-card animate-slide-left"
       :style="{ animationDelay: `${0.2 + index * 0.03}s` }"
       @contextmenu.prevent="showDropdown($event, item)"
       @touchstart="touchStart"
       @touchend="touchEnd(item)"
       @touchmove="touchMove">
    
    <!-- Item Number Badge -->
    <div class="item-number">
      <span>{{ index + 1 }}</span>
    </div>
    
    <div class="item-details" @click="editItem(item)">
      <div class="item-header">
        <h3 class="item-name">{{ highlightText(item.name) }}</h3>
        <!-- Priority Tag with different colors -->
         <span class="priority-label">Priority:</span>
        <div class="priority-tag" :class="item.priority">
          <svg v-if="item.priority === 'high'" viewBox="0 0 24 24" fill="none">
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" stroke="currentColor" stroke-width="2"/>
          </svg>
          <svg v-else-if="item.priority === 'medium'" viewBox="0 0 24 24" fill="none">
            <path d="M12 6v12M8 10h8M8 14h8" stroke="currentColor" stroke-width="2"/>
          </svg>
          <svg v-else viewBox="0 0 24 24" fill="none">
            <path d="M12 6v12" stroke="currentColor" stroke-width="2"/>
          </svg>
          {{ item.priority === 'high' ? 'High' : item.priority === 'medium' ? 'Medium' : 'Low' }}
        </div>
      </div>
      <div class="item-meta">
        <span class="item-quantity">Qty: {{ item.quantity }}</span>
        <span class="item-price">UGX {{ formatNumber(item.price) }}</span>
      </div>
      <!-- Item Total Cost -->
      <div class="item-total-cost">
        Total: UGX {{ formatNumber(item.price * item.quantity) }}
      </div>
      <p v-if="item.notes" class="item-notes" v-html="highlightNotes(item.notes)"></p>
    </div>
    
    <div class="item-actions">
      <!-- Keep your existing action buttons if any -->
    </div>
  </div>
</div>
      <!-- No Results State -->
      <div v-else-if="searchQuery && items.length > 0" class="empty-state glass-card animate-fade-in">
        <svg viewBox="0 0 24 24" fill="none">
          <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="1.5"/>
          <path d="m21 21-4.3-4.3" stroke="currentColor" stroke-width="1.5"/>
        </svg>
        <h3>No Results Found</h3>
        <p>No items match "{{ searchQuery }}"</p>
        <button @click="clearSearch" class="btn-primary">Clear Search</button>
      </div>

      <!-- Empty State -->
      <div v-else-if="items.length === 0" class="empty-state glass-card animate-fade-in">
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M20 12V8H4v12h16v-4M12 4v4M8 4v4M16 4v4" stroke="currentColor" stroke-width="1.5"/>
        </svg>
        <h3>No Items Yet</h3>
        <p>Add your first item to this shopping list</p>
        <button @click="showAddModal = true" class="btn-primary">Add Item</button>
      </div>

      <!-- Dropdown Menu -->
      <div v-if="activeDropdown" 
           class="dropdown-menu animate-dropdown"
           :style="{ top: dropdownPosition.y + 'px', left: dropdownPosition.x + 'px' }">
        <button class="dropdown-item edit" @click="editItem(activeDropdown)">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34" stroke="currentColor" stroke-width="2"/>
            <polygon points="18 2 22 6 12 16 8 16 8 12 18 2" stroke="currentColor" stroke-width="2"/>
          </svg>
          <span>Edit Item</span>
        </button>
        <button class="dropdown-item delete" @click="confirmDelete(activeDropdown)">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" stroke-width="2"/>
          </svg>
          <span>Delete Item</span>
        </button>
      </div>

      <!-- Add/Edit Item Modal -->
      <div v-if="showAddModal" class="modal-overlay" @click.self="closeItemModal">
        <div class="modal-content glass-card animate-scale">
          <h2 class="modal-title">{{ editingItem ? 'Edit Item' : 'Add New Item' }}</h2>
          
          <div class="form-group">
            <label>Item Name *</label>
            <input v-model="itemForm.name" type="text" class="input-field" placeholder="e.g., Notebook" />
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label>Quantity</label>
              <input v-model.number="itemForm.quantity" type="number" class="input-field" min="1" />
            </div>
            <div class="form-group">
              <label>Price (UGX)</label>
              <input v-model.number="itemForm.price" type="number" class="input-field" min="0" />
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label>Category</label>
              <select v-model="itemForm.category" class="input-field">
                <option value="Books">Books</option>
                <option value="Stationery">Stationery</option>
                <option value="Electronics">Electronics</option>
                <option value="Uniforms">Uniforms</option>
                <option value="Sports">Sports</option>
                <option value="Food">Food</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div class="form-group">
              <label>Priority</label>
              <select v-model="itemForm.priority" class="input-field">
                <option value="low">Low </option>
                <option value="medium">Medium</option>
                <option value="high">High </option>
              </select>
            </div>
          </div>
          
<div class="form-group">
  <label>Brand (Optional)</label>
  <input 
    type="text" 
    v-model="itemForm.notes" 
    @input="capitalizeBrand" 
    class="input-field" 
    placeholder="Enter brand name..."
  />
</div>
          
          <div class="modal-buttons">
            <button @click="saveItem" class="btn-primary">{{ editingItem ? 'Update' : 'Add' }}</button>
            <button @click="closeItemModal" class="btn-secondary">Cancel</button>
          </div>
        </div>
      </div>

      <!-- Delete Confirmation Modal -->
      <div v-if="showDeleteModal" class="modal-overlay" @click.self="showDeleteModal = false">
        <div class="modal-content glass-card animate-scale">
          <h2 class="modal-title">Delete Item</h2>
          <p class="delete-message">Are you sure you want to delete "{{ itemToDelete?.name }}"?</p>
          <div class="modal-buttons">
            <button @click="deleteItem" class="btn-danger">Delete</button>
            <button @click="showDeleteModal = false" class="btn-secondary">Cancel</button>
          </div>
        </div>
      </div>

      <!-- Edit List Name Modal -->
      <div v-if="showEditNameModal" class="modal-overlay" @click.self="showEditNameModal = false">
        <div class="modal-content glass-card animate-scale">
          <h2 class="modal-title">Edit List Name</h2>
          <input v-model="newListName" type="text" class="input-field" placeholder="Enter new name" />
          <div class="modal-buttons">
            <button @click="updateListName" class="btn-primary">Update</button>
            <button @click="showEditNameModal = false" class="btn-secondary">Cancel</button>
          </div>
        </div>
      </div>
    </div>
    <!-- Notification Toast -->
<div v-if="notification.show" class="notification-toast animate-slide-up" :class="notification.type">
  <div class="notification-content">
    <svg v-if="notification.type === 'success'" viewBox="0 0 24 24" fill="none">
      <path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="3"/>
    </svg>
    <svg v-else viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
      <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" stroke-width="2"/>
    </svg>
    <span>{{ notification.message }}</span>
  </div>
</div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { supabase } from '../supabase/client'

const route = useRoute()
const router = useRouter()
const listId = route.params.id

const listName = ref('')
const items = ref([])
const searchQuery = ref('')
const showAddModal = ref(false)
const showDeleteModal = ref(false)
const showEditNameModal = ref(false)
const editingItem = ref(null)
const itemToDelete = ref(null)
const newListName = ref('')
const activeDropdown = ref(null)
const dropdownPosition = ref({ x: 0, y: 0 })
const isLoading = ref(false)

// Notification system
const notification = ref({ show: false, message: '', type: 'success' })
let notificationTimeout = null

const showNotification = (message, type = 'success') => {
  if (notificationTimeout) clearTimeout(notificationTimeout)
  notification.value = { show: true, message, type }
  notificationTimeout = setTimeout(() => { notification.value.show = false }, 3000)
}

// Touch handling for long press
let touchTimer = null
let touchStartX = 0
let touchStartY = 0
const LONG_PRESS_DURATION = 500

const itemForm = ref({
  name: '',
  quantity: 1,
  price: 0,
  category: 'Other',
  priority: 'medium',
  notes: ''
})

// Capitalize first letter of first word
const capitalizeBrand = () => {
  if (itemForm.value.notes && itemForm.value.notes.trim()) {
    const words = itemForm.value.notes.trim().split(/\s+/)
    const firstWord = words[0]
    const capitalizedFirstWord = firstWord.charAt(0).toUpperCase() + firstWord.slice(1)
    words[0] = capitalizedFirstWord
    itemForm.value.notes = words.join(' ')
  }
}

// Filter items based on search query
const filteredItems = computed(() => {
  if (!searchQuery.value.trim()) return items.value
  
  const query = searchQuery.value.toLowerCase().trim()
  return items.value.filter(item => 
    item.name.toLowerCase().includes(query) ||
    item.category.toLowerCase().includes(query) ||
    (item.notes && item.notes.toLowerCase().includes(query)) ||
    (item.priority && item.priority.toLowerCase().includes(query))
  )
})

const filteredTotalCost = computed(() => {
  return filteredItems.value.reduce((sum, item) => sum + (item.price * item.quantity), 0).toLocaleString()
})

const formatNumber = (num) => num?.toLocaleString() || '0'

const clearSearch = () => {
  searchQuery.value = ''
}

// Highlight matching text in search results
const highlightText = (text) => {
  if (!searchQuery.value) return text
  const query = searchQuery.value.toLowerCase()
  if (!text.toLowerCase().includes(query)) return text
  
  const regex = new RegExp(`(${query})`, 'gi')
  return text.replace(regex, '<mark class="highlight">$1</mark>')
}

const highlightNotes = (notes) => {
  if (!searchQuery.value || !notes) return notes
  const query = searchQuery.value.toLowerCase()
  if (!notes.toLowerCase().includes(query)) return notes
  
  const regex = new RegExp(`(${query})`, 'gi')
  return notes.replace(regex, '<mark class="highlight">$1</mark>')
}

// Long press handlers
const touchStart = (e) => {
  touchTimer = setTimeout(() => {}, LONG_PRESS_DURATION)
  touchStartX = e.touches[0].clientX
  touchStartY = e.touches[0].clientY
}

const touchEnd = (item) => {
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

// Show dropdown menu on long press/right click
const showDropdown = (event, item) => {
  event.preventDefault()
  
  if (activeDropdown.value === item) {
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
  activeDropdown.value = item
  
  setTimeout(() => {
    if (activeDropdown.value === item) {
      activeDropdown.value = null
    }
  }, 3000)
}

// Close dropdown when clicking outside
const handleClickOutside = (e) => {
  if (!e.target.closest('.dropdown-menu') && !e.target.closest('.item-card')) {
    activeDropdown.value = null
  }
}

const loadList = async () => {
  try {
    const { data, error } = await supabase
      .from('shopping_lists')
      .select('name')
      .eq('id', listId)
      .single()
    
    if (error) throw error
    if (data) {
      listName.value = data.name
    }
  } catch (error) {
    console.error('Error loading list:', error)
    showNotification('Error loading list', 'error')
  }
}

const loadItems = async () => {
  try {
    isLoading.value = true
    const { data, error } = await supabase
      .from('shopping_items')
      .select('*')
      .eq('list_id', listId)
      .order('created_at', { ascending: true })
    
    if (error) throw error
    if (data) {
      items.value = data
    }
  } catch (error) {
    console.error('Error loading items:', error)
    showNotification('Error loading items', 'error')
  } finally {
    isLoading.value = false
  }
}

const editItem = (item) => {
  activeDropdown.value = null
  editingItem.value = item
  itemForm.value = { ...item }
  
  // Capitalize brand when editing
  if (itemForm.value.notes && itemForm.value.notes.trim()) {
    const words = itemForm.value.notes.trim().split(/\s+/)
    const firstWord = words[0]
    const capitalizedFirstWord = firstWord.charAt(0).toUpperCase() + firstWord.slice(1)
    words[0] = capitalizedFirstWord
    itemForm.value.notes = words.join(' ')
  }
  
  showAddModal.value = true
}

const saveItem = async () => {
  // Capitalize brand before saving
  if (itemForm.value.notes && itemForm.value.notes.trim()) {
    const words = itemForm.value.notes.trim().split(/\s+/)
    const firstWord = words[0]
    const capitalizedFirstWord = firstWord.charAt(0).toUpperCase() + firstWord.slice(1)
    words[0] = capitalizedFirstWord
    itemForm.value.notes = words.join(' ')
  }
  
  if (!itemForm.value.name.trim()) {
    showNotification('Please enter an item name', 'error')
    return
  }
  
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      showNotification('Please login first', 'error')
      return
    }
    
    if (editingItem.value) {
      // Update existing item
      const { error } = await supabase
        .from('shopping_items')
        .update({
          name: itemForm.value.name,
          quantity: itemForm.value.quantity,
          price: itemForm.value.price,
          category: itemForm.value.category,
          priority: itemForm.value.priority,
          notes: itemForm.value.notes,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingItem.value.id)
      
      if (error) throw error
      showNotification('Item updated successfully!', 'success')
    } else {
      // Insert new item
      const { error } = await supabase
        .from('shopping_items')
        .insert([{
          list_id: listId,
          user_id: user.id,
          name: itemForm.value.name,
          quantity: itemForm.value.quantity,
          price: itemForm.value.price,
          category: itemForm.value.category,
          priority: itemForm.value.priority,
          notes: itemForm.value.notes
        }])
      
      if (error) throw error
      showNotification('Item added successfully!', 'success')
    }
    
    await loadItems()
    closeItemModal()
  } catch (error) {
    console.error('Error saving item:', error)
    showNotification('Error saving item. Please try again.', 'error')
  }
}

const confirmDelete = (item) => {
  activeDropdown.value = null
  itemToDelete.value = item
  showDeleteModal.value = true
}

const deleteItem = async () => {
  if (!itemToDelete.value) return
  
  try {
    const { error } = await supabase
      .from('shopping_items')
      .delete()
      .eq('id', itemToDelete.value.id)
    
    if (error) throw error
    
    await loadItems()
    showDeleteModal.value = false
    itemToDelete.value = null
    showNotification('Item deleted successfully!', 'success')
  } catch (error) {
    console.error('Error deleting item:', error)
    showNotification('Error deleting item. Please try again.', 'error')
  }
}

const editListName = () => {
  newListName.value = listName.value
  showEditNameModal.value = true
}

const updateListName = async () => {
  if (!newListName.value.trim()) {
    showNotification('Please enter a list name', 'error')
    return
  }
  
  try {
    const { error } = await supabase
      .from('shopping_lists')
      .update({ 
        name: newListName.value,
        updated_at: new Date().toISOString()
      })
      .eq('id', listId)
    
    if (error) throw error
    
    listName.value = newListName.value
    showEditNameModal.value = false
    showNotification('List name updated successfully!', 'success')
  } catch (error) {
    console.error('Error updating list name:', error)
    showNotification('Error updating list name', 'error')
  }
}

const closeItemModal = () => {
  showAddModal.value = false
  editingItem.value = null
  itemForm.value = {
    name: '',
    quantity: 1,
    price: 0,
    category: 'Other',
    priority: 'medium',
    notes: ''
  }
}

// Set up real-time subscription for items
let itemsSubscription = null

const setupRealtimeSubscription = () => {
  itemsSubscription = supabase
    .channel('shopping_items_changes')
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

onMounted(() => {
  loadList()
  loadItems()
  setupRealtimeSubscription()
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  if (itemsSubscription) {
    supabase.removeChannel(itemsSubscription)
  }
  document.removeEventListener('click', handleClickOutside)
  if (touchTimer) clearTimeout(touchTimer)
  if (notificationTimeout) clearTimeout(notificationTimeout)
})
</script>

<style scoped>
/* Add these new styles for item numbering and priority tags */

/* Item Number Badge */
.item-number {
  width: 32px;
  height: 32px;
  background: #F0F0F0;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 14px;
  color: #1A1A1A;
  flex-shrink: 0;
  transition: all 0.3s;
}

.priority-label {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: black;;
  border-radius: 20px;
  background-color:transparent;
  font-size: 11px;
  font-weight: 680;
}
.item-number.priority-high {
  background: rgba(255, 68, 68, 0.15);
  color: #ff4444;
  border: 1px solid #ff4444;
}

.item-number.priority-medium {
  background: rgba(255, 187, 51, 0.15);
  color: #ffbb33;
  border: 1px solid #ffbb33;
}

.item-number.priority-low {
  background: rgba(93, 255, 114, 0.15);
  color: #5DFF72;
  border: 1px solid #5DFF72;
}

.item-card:hover .item-number {
  transform: scale(1.1);
}

/* Priority Tags */
.priority-tag-wrapper {
  display: inline-flex;
}

.priority-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
}

.priority-tag svg {
  width: 14px;
  height: 14px;
}

.priority-tag.high {
  background: rgba(255, 68, 68, 0.15);
  color: #ff4444;
}

.priority-tag.medium {
  background: rgba(255, 187, 51, 0.15);
  color: #ffbb33;
}

.priority-tag.low {
  background: rgba(93, 255, 114, 0.15);
  color: #5DFF72;
}

/* Item Header Layout */
.item-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 8px;
}

.item-name {
  font-size: 16px;
  font-weight: 600;
  color: #1A1A1A;
  margin: 0;
  flex: 1;
}

/* Item Card Priority Borders */
.item-card.priority-high {
  border-left: 4px solid #ff4444;
}

.item-card.priority-medium {
  border-left: 4px solid #ffbb33;
}

.item-card.priority-low {
  border-left: 4px solid #5DFF72;
}

/* Search Results Count */
.search-results-count {
  margin-top: 8px;
  font-size: 12px;
  color: #5DFF72;
  text-align: right;
  padding-right: 8px;
}

.select-wrapper {
  position: relative;
}

.dropdown-list {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  max-height: 280px;
  overflow-y: auto;
  background: white;
  border: 1px solid #ccc;
  border-top: none;
  border-radius: 0 0 4px 4px;
  z-index: 1000;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.dropdown-item {
  padding: 8px 12px;
  cursor: pointer;
}

.dropdown-item:hover {
  background-color: #f0f0f0;
}

.dropdown-item.disabled {
  color: #999;
  cursor: default;
}

.dropdown-scroll-hint {
  padding: 6px 12px;
  font-size: 11px;
  color: #666;
  text-align: center;
  border-top: 1px solid #eee;
  background: #fafafa;
}

/* Highlight Styles */
.item-name :deep(mark) {
  background: rgba(93, 255, 114, 0.3);
  color: #1A1A1A;
  border-radius: 4px;
  padding: 0 2px;
}


/* Rest of your existing styles remain the same */
.shopping-detail-page {
  min-height: 100vh;
  background: #FFFFFF;
  overflow-y: auto;
  height: 100vh;
}

.detail-container {
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
  margin-bottom: 20px;
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
  font-size: 22px;
  font-weight: 700;
  color: #1A1A1A;
  margin-bottom: 4px;
}

.item-count {
  font-size: 12px;
  color: #6C757D;
}

.edit-list-name {
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 10px;
  transition: all 0.3s;
}

.edit-list-name svg {
  width: 20px;
  height: 20px;
  color: #5DFF72;
}

.edit-list-name:hover {
  background: rgba(93, 255, 114, 0.1);
  transform: scale(1.1);
}

/* Search Section */
.search-section {
  margin-bottom: 20px;
  animation: scaleIn 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
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
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.3s;
}

.clear-search svg {
  width: 18px;
  height: 18px;
  color: #ADB5BD;
}

.clear-search:hover {
  background: #F0F0F0;
}

.clear-search:hover svg {
  color: #ff4444;
}

/* Stats Summary */
.stats-summary {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  margin-bottom: 20px;
  animation: scaleIn 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
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

.stat-item {
  background: #F8F9FA;
  padding: 15px;
  border-radius: 16px;
  text-align: center;
}

.stat-value {
  font-size: 20px;
  font-weight: 800;
  color: #5DFF72;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 11px;
  color: #6C757D;
}

/* Add Section */
.add-section {
  margin-bottom: 20px;
  animation: scaleIn 0.4s ease-out;
}

.add-item-btn {
  width: 100%;
  background: linear-gradient(135deg, #5DFF72, #34D399);
  border: none;
  padding: 14px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-weight: 700;
  color: #0B0B0B;
  cursor: pointer;
  transition: all 0.3s;
}

.add-item-btn svg {
  width: 20px;
  height: 20px;
  transition: transform 0.3s;
}

.add-item-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(93, 255, 114, 0.3);
}

.add-item-btn:hover svg {
  transform: rotate(90deg);
}

/* Items List */
/* Add these styles to your existing style section */

/* Item Number Badge - Keep original design */
.item-number {
  width: 28px;
  height: 28px;
  background: #F0F0F0;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 13px;
  color: #1A1A1A;
  flex-shrink: 0;
}

.dark-mode .item-number {
  background: #3A3A3A;
  color: #FFFFFF;
}

/* Priority Tags with different colors */
.priority-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
}

.priority-tag svg {
  width: 12px;
  height: 12px;
}

.priority-tag.high {
  background: rgba(255, 68, 68, 0.15);
  color: #ff4444;
}

.priority-tag.medium {
  background: rgba(255, 187, 51, 0.15);
  color: #ffbb33;
}

.priority-tag.low {
  background: rgba(93, 255, 114, 0.15);
  color: #5DFF72;
}

/* Item Header Layout - Keep original spacing */
.item-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 6px;
}

.item-name {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 0;
  color: #1A1A1A;
  flex: 1;
}

/* Item Total Cost */
.item-total-cost {
  font-size: 13px;
  font-weight: 700;
  color: #5DFF72;
  margin-top: 6px;
  padding-top: 6px;
  border-top: 1px dashed rgba(93, 255, 114, 0.2);
}

.dark-mode .item-total-cost {
  border-top-color: rgba(93, 255, 114, 0.1);
}

/* Item meta - keep original */
.item-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  font-size: 11px;
  color: #6C757D;
  margin-bottom: 4px;
}

/* Keep all your existing styles below */


.items-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.item-card {
  padding: 16px;
  display: flex;
  gap: 12px;
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

.item-card:hover {
  transform: translateX(5px);
}

.item-details {
  flex: 1;
  cursor: pointer;
}

.item-name {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 6px;
  color: #1A1A1A;
}

.item-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  font-size: 11px;
  color: #6C757D;
  margin-bottom: 4px;
}

.item-notes {
  font-size: 11px;
  color: #ADB5BD;
  font-style: italic;
  margin-top: 4px;
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
  border-radius: 40px;
  font-weight: 600;
  color: #0B0B0B;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(93, 255, 114, 0.3);
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
  max-width: 500px;
  width: 90%;
  padding: 24px;
  animation: scaleIn 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.modal-title {
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 20px;
  text-align: center;
  color: #1A1A1A;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 6px;
  color: #495057;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

textarea.input-field {
  resize: vertical;
  font-family: 'Poppins', sans-serif;
}

.delete-message {
  text-align: center;
  margin-bottom: 20px;
  color: #1A1A1A;
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

.btn-secondary {
  background: #F0F0F0;
  color: #666;
  padding: 12px;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

/* Dark Mode */
.dark-mode .shopping-detail-page {
  background: #1A1A1A;
}

.dark-mode .stat-item,
.dark-mode .search-input {
  background: #2A2A2A;
  border-color: #3A3A3A;
  color: #FFFFFF;
}

.dark-mode .search-input:focus {
  background: #333;
}

.dark-mode .list-title,
.dark-mode .modal-title,
.dark-mode .item-name,
.dark-mode .empty-state h3,
.dark-mode .delete-message,
.dark-mode .form-group label,
.dark-mode .dropdown-item.edit {
  color: #FFFFFF;
}

.dark-mode .item-count,
.dark-mode .stat-label,
.dark-mode .item-meta,
.dark-mode .empty-state p {
  color: #ADB5BD;
}

.dark-mode .back-button svg {
  color: #FFFFFF;
}

.dark-mode .back-button:hover {
  background: #2A2A2A;
}

.dark-mode .dropdown-menu {
  background: #2A2A2A;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
}

.dark-mode .dropdown-item.delete {
  border-top-color: #3A3A3A;
}

.dark-mode .search-icon {
  color: #6C757D;
}

.dark-mode .clear-search:hover {
  background: #3A3A3A;
}
</style>