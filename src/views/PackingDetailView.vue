<template>
  <div class="page-wrapper">
    <div class="container">
      <!-- Header -->
      <div class="header-section animate-slide-down">
        <div class="logo-area">
          <button class="back-button" @click="$router.back()">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" stroke-width="2"/>
            </svg>
          </button>
          <div>
            <h1 class="page-title gradient-text">{{ listName }}</h1>
            <p class="header-subtitle">Check items as you pack</p>
          </div>
        </div>
        <div class="progress-badge">{{ packedCount }}/{{ items.length }} Packed</div>
      </div>

      <!-- Progress Bar -->
      <div class="progress-section animate-scale">
        <div class="progress-bar-container">
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: progressPercentage + '%' }"></div>
          </div>
          <div class="progress-stats">
            <span>{{ progressPercentage }}% Complete</span>
            <span>{{ packedCount }} of {{ items.length }} items packed</span>
          </div>
        </div>
      </div>

      <!-- Items List -->
      <div v-if="items.length === 0" class="empty-state glass-card animate-fade-in">
        <div class="empty-icon">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M20 12V8H4v12h16v-4M12 4v4M8 4v4M16 4v4" stroke="currentColor" stroke-width="1.5"/>
          </svg>
        </div>
        <h3>No Items Found</h3>
        <p>This list has no items</p>
        <button @click="$router.back()" class="btn-primary">Go Back</button>
      </div>

      <div v-else class="items-list">
        <div v-for="(item, index) in items" :key="item.id" 
             class="item-card glass-card animate-slide-left"
             :class="{ packed: item.packed }"
             :style="{ animationDelay: `${index * 0.05}s` }"
             @click="togglePacked(item)">
          
          <div class="item-checkbox">
            <div class="checkbox" :class="{ checked: item.packed }">
              <svg v-if="item.packed" viewBox="0 0 24 24" fill="none">
                <path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="3"/>
              </svg>
            </div>
          </div>
          
          <div class="item-details">
            <h3 class="item-name" :class="{ crossed: item.packed }">{{ item.name }}</h3>
            <div class="item-meta">
              <span class="item-quantity">Qty: {{ item.quantity }}</span>
              <span class="item-price">UGX {{ formatNumber(item.price) }} each</span>
              <span v-if="item.notes" class="item-brand">Brand: {{ item.notes }}</span>
            </div>
          </div>
          
          <div class="item-total">
            <div class="total-amount">UGX {{ formatNumber(item.price * item.quantity) }}</div>
          </div>
        </div>
      </div>

      <!-- Complete Button -->
      <button v-if="packedCount === items.length && items.length > 0" 
              class="complete-btn animate-pulse" @click="completePacking">
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2"/>
        </svg>
        All Packed! Complete Trip
      </button>

      <!-- Footer -->
      <div class="footer-sentence animate-fade-in">
        <p class="sentence-text">✓ Check each item as you pack it into your bag</p>
      </div>
    </div>

    <!-- Notification Toast -->
    <div v-if="notification.show" class="notification-toast animate-slide-up" :class="notification.type">
      <div class="notification-content">
        <svg v-if="notification.type === 'success'" viewBox="0 0 24 24" fill="none">
          <path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="3"/>
        </svg>
        <span>{{ notification.message }}</span>
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
const isLoading = ref(false)

const packedCount = computed(() => items.value.filter(i => i.packed).length)
const progressPercentage = computed(() => {
  if (items.value.length === 0) return 0
  return Math.round((packedCount.value / items.value.length) * 100)
})

const formatNumber = (num) => num?.toLocaleString() || '0'

// Notification system
const notification = ref({ show: false, message: '', type: 'success' })
let notificationTimeout = null

const showNotification = (message, type = 'success') => {
  if (notificationTimeout) clearTimeout(notificationTimeout)
  notification.value = { show: true, message, type }
  notificationTimeout = setTimeout(() => { notification.value.show = false }, 2000)
}

const loadItems = async () => {
  if (isLoading.value) return
  isLoading.value = true
  
  try {
    // First try to get from purchase_history
    const { data: purchase, error: purchaseError } = await supabase
      .from('purchase_history')
      .select('*')
      .eq('id', listId)
      .maybeSingle()
    
    if (purchaseError) throw purchaseError
    
    if (purchase && purchase.items) {
      // Get packed status from shopping_items for each item
      const itemsWithStatus = []
      for (const item of purchase.items) {
        if (item.id) {
          const { data: itemData, error: itemError } = await supabase
            .from('shopping_items')
            .select('packed, cleared')
            .eq('id', item.id)
            .maybeSingle()
          
          if (itemError) console.error('Error fetching item:', itemError)
          
          itemsWithStatus.push({
            ...item,
            packed: itemData?.packed || false,
            cleared: itemData?.cleared || true
          })
        } else {
          itemsWithStatus.push({ ...item, packed: false, cleared: true })
        }
      }
      items.value = itemsWithStatus
    } else {
      // If not in purchase_history, try to get directly from shopping_items where cleared = true
      const { data: clearedItems, error: itemsError } = await supabase
        .from('shopping_items')
        .select('*')
        .eq('list_id', listId)
        .eq('cleared', true)
        .eq('packed', false)
      
      if (itemsError) throw itemsError
      
      if (clearedItems && clearedItems.length > 0) {
        items.value = clearedItems.map(item => ({
          ...item,
          packed: item.packed || false
        }))
      }
    }
  } catch (error) {
    console.error('Error loading items:', error)
    showNotification('Error loading items', 'error')
  } finally {
    isLoading.value = false
  }
}

const togglePacked = async (item) => {
  try {
    const newPackedStatus = !item.packed
    
    // Update in database
    const { error } = await supabase
      .from('shopping_items')
      .update({ 
        packed: newPackedStatus,
        updated_at: new Date().toISOString()
      })
      .eq('id', item.id)
    
    if (error) throw error
    
    // Update local state
    item.packed = newPackedStatus
    
    showNotification(
      newPackedStatus ? `✓ "${item.name}" packed!` : `"${item.name}" unpacked`,
      'success'
    )
    
  } catch (error) {
    console.error('Error updating pack status:', error)
    showNotification('Error updating pack status', 'error')
  }
}

const completePacking = async () => {
  try {
    // Mark all unpacked items as packed
    const unpackedItems = items.value.filter(item => !item.packed && item.id)
    
    for (const item of unpackedItems) {
      const { error } = await supabase
        .from('shopping_items')
        .update({ 
          packed: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', item.id)
      
      if (error) throw error
      
      item.packed = true
    }
    
    showNotification('🎉 All items packed! Trip completed!', 'success')
    
    setTimeout(() => {
      router.push('/packing-checklist')
    }, 1500)
    
  } catch (error) {
    console.error('Error completing packing:', error)
    showNotification('Error completing packing', 'error')
  }
}

// Real-time subscription for packing updates
let packingSubscription = null

const setupRealtimeSubscription = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return
  
  packingSubscription = supabase
    .channel('packing_updates')
    .on('postgres_changes', {
      event: 'UPDATE',
      schema: 'public',
      table: 'shopping_items',
      filter: `user_id=eq.${user.id}`
    }, (payload) => {
      if (payload.new) {
        const updatedItem = items.value.find(i => i.id === payload.new.id)
        if (updatedItem) {
          updatedItem.packed = payload.new.packed
        }
      }
    })
    .subscribe()
}

onMounted(() => {
  loadItems()
  setupRealtimeSubscription()
})

onUnmounted(() => {
  if (packingSubscription) {
    supabase.removeChannel(packingSubscription)
  }
  if (notificationTimeout) clearTimeout(notificationTimeout)
})
</script>

<style scoped>
.page-wrapper {
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

/* Header Section */
.header-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 25px;
  padding: 15px;
  background: linear-gradient(135deg, #F8F9FA, #FFFFFF);
  border-radius: 24px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
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

.logo-area {
  display: flex;
  align-items: center;
  gap: 12px;
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

.page-title {
  font-size: 20px;
  font-weight: 700;
  margin: 0;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.gradient-text {
  background: linear-gradient(135deg, #5DFF72, #34D399);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.header-subtitle {
  font-size: 11px;
  color: #6C757D;
  margin: 4px 0 0 0;
}

.progress-badge {
  background: #5DFF72;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  color: #0B0B0B;
}

/* Progress Section */
.progress-section {
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

.progress-bar-container {
  background: #F8F9FA;
  padding: 15px;
  border-radius: 16px;
}

.progress-bar {
  height: 10px;
  background: #E9ECEF;
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 10px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #5DFF72, #34D399);
  transition: width 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  border-radius: 10px;
}

.progress-stats {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #6C757D;
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
  background: white;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  animation: slideLeft 0.4s ease-out backwards;
}

@keyframes slideLeft {
  from { opacity: 0; transform: translateX(30px); }
  to { opacity: 1; transform: translateX(0); }
}

.item-card:hover {
  transform: translateX(5px);
  box-shadow: 0 5px 20px rgba(93, 255, 114, 0.15);
}

.item-card.packed {
  opacity: 0.7;
  background: #E8F5E9;
}

.item-checkbox {
  cursor: pointer;
}

.checkbox {
  width: 28px;
  height: 28px;
  border: 2px solid #DDD;
  border-radius: 10px;
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

.item-name {
  font-size: 16px;
  font-weight: 600;
  color: #1A1A1A;
  margin-bottom: 6px;
  transition: all 0.3s;
}

.item-name.crossed {
  text-decoration: line-through;
  color: #ADB5BD;
}

.item-meta {
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: #6C757D;
  flex-wrap: wrap;
}

.item-quantity {
  color: #5DFF72;
  font-weight: 500;
}

.item-price {
  color: #6C757D;
}

.item-brand {
  color: #5DFF72;
  background: rgba(93, 255, 114, 0.1);
  padding: 2px 8px;
  border-radius: 12px;
}

.item-total {
  text-align: right;
}

.total-amount {
  font-size: 14px;
  font-weight: 700;
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
  margin-top: 20px;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(93, 255, 114, 0.4); }
  50% { box-shadow: 0 0 0 10px rgba(93, 255, 114, 0); }
}

.complete-btn svg {
  width: 20px;
  height: 20px;
}

.complete-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 30px rgba(93, 255, 114, 0.4);
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 20px;
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
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

/* Buttons */
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
  background: #333;
  color: white;
}

.notification-content svg {
  width: 20px;
  height: 20px;
  color: #5DFF72;
}

/* Footer */
.footer-sentence {
  margin-top: 40px;
  padding: 20px;
  text-align: center;
}

.sentence-text {
  font-size: 12px;
  color: #6C757D;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .container {
    padding: 15px;
    padding-bottom: 80px;
  }
  
  .page-title {
    font-size: 18px;
    max-width: 160px;
  }
  
  .item-name {
    font-size: 14px;
  }
  
  .item-meta {
    font-size: 10px;
    gap: 8px;
  }
  
  .total-amount {
    font-size: 12px;
  }
  
  .checkbox {
    width: 24px;
    height: 24px;
  }
  
  .progress-badge {
    font-size: 10px;
    padding: 4px 10px;
  }
  
  .notification-toast {
    bottom: 80px;
    width: 90%;
  }
  
  .notification-content {
    padding: 12px 16px;
    font-size: 13px;
  }
}

/* Dark Mode */
.dark-mode .page-wrapper {
  background: #1A1A1A;
}

.dark-mode .header-section {
  background: #2A2A2A;
}

.dark-mode .page-title,
.dark-mode .item-name,
.dark-mode .empty-state h3 {
  color: #FFFFFF;
}

.dark-mode .header-subtitle,
.dark-mode .item-meta,
.dark-mode .progress-stats,
.dark-mode .empty-state p,
.dark-mode .sentence-text {
  color: #ADB5BD;
}

.dark-mode .progress-bar-container {
  background: #2A2A2A;
}

.dark-mode .progress-bar {
  background: #3A3A3A;
}

.dark-mode .item-card,
.dark-mode .empty-state {
  background: #2A2A2A;
}

.dark-mode .item-card.packed {
  background: #1A3A1A;
}

.dark-mode .checkbox {
  background: #3A3A3A;
  border-color: #4A4A4A;
}

.dark-mode .back-button svg {
  color: #FFFFFF;
}

.dark-mode .back-button:hover {
  background: #3A3A3A;
}
</style>