<template>
  <div class="page-wrapper">
    <div class="container">
      <!-- Header -->
      <div class="header-section animate-slide-down">
        <div class="logo-area">
          <img v-if="logoUrl" :src="logoUrl" alt="Fastop Logo" class="header-logo animate-rotate" />
          <div>
            <h1 class="page-title gradient-text">Packing Checklist</h1>
            <p class="header-subtitle">Track your packed items</p>
          </div>
        </div>
        <div class="menu-container">
          <button class="menu-btn" @click="toggleMainMenu">
            <svg viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="1.5" fill="currentColor"/>
              <circle cx="12" cy="5" r="1.5" fill="currentColor"/>
              <circle cx="12" cy="19" r="1.5" fill="currentColor"/>
            </svg>
          </button>
          
          <div v-if="showMainMenu" class="main-dropdown animate-dropdown">
            <button @click="permanentDeleteAllLists" class="dropdown-item danger" :disabled="purchaseHistory.length === 0">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" stroke-width="2"/>
              </svg>
              Permanently Delete All
            </button>
          </div>
        </div>
      </div>
      
      <!-- Purchase History Lists -->
      <div class="history-lists-section">
        <div class="section-header animate-slide-right">
          <h2 class="section-title">Your Shopping Trips</h2>
          <div class="section-decoration"></div>
        </div>
        
        <div v-if="purchaseHistory.length === 0" class="empty-state glass-card animate-fade-in">
          <div class="empty-icon animate-bounce">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M20 12V8H4v12h16v-4M12 4v4M8 4v4M16 4v4" stroke="currentColor" stroke-width="1.5"/>
              <circle cx="12" cy="16" r="2" stroke="currentColor" stroke-width="1.5"/>
            </svg>
          </div>
          <h3>No Shopping Trips Yet</h3>
          <p>Complete a shopping trip to see items ready for packing</p>
          <button @click="$router.push('/shopping-mode')" class="btn-primary animate-pulse">
            Start Shopping
          </button>
        </div>
        
        <div v-else class="history-grid">
          <div v-for="(purchase, index) in purchaseHistory" :key="purchase.id" 
               class="history-card glass-card animate-slide-left"
               :data-id="purchase.id"
               :style="{ animationDelay: `${index * 0.08}s` }"
               @click="goToPackingDetail(purchase)"
               @contextmenu.prevent="openDropdown($event, purchase)">
            
            <div class="card-shine"></div>
            <div class="card-glow"></div>
            
            <div class="history-card-header">
              <div class="history-icon animate-zoom">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M20 12V8H4v12h16v-4M12 4v4M8 4v4M16 4v4" stroke="currentColor" stroke-width="1.5"/>
                </svg>
              </div>
              <div class="history-info">
                <h3 class="history-name">{{ purchase.list_name }}</h3>
                <div class="history-date">
                  <svg viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5"/>
                    <polyline points="12 6 12 12 16 14" stroke="currentColor" stroke-width="1.5"/>
                  </svg>
                  {{ formatDate(purchase.purchased_at) }}
                </div>
              </div>
              <div class="history-amount">UGX {{ formatNumber(purchase.total_amount) }}</div>
            </div>
            
            <div class="history-footer">
              <div class="items-count">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" stroke-width="1.5"/>
                </svg>
                {{ purchase.items.length }} items
              </div>
              <div class="pack-status">
                <div class="pack-status-bar">
                  <div class="pack-status-fill" :style="{ width: getPackProgress(purchase) + '%' }"></div>
                </div>
                <span>{{ getPackedCount(purchase) }}/{{ purchase.items.length }} packed</span>
              </div>
            </div>
            
            <div class="card-arrow">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="footer-sentence animate-fade-in">
        <p class="sentence-text">Pack smart, travel light, and enjoy your school journey!</p>
      </div>
    </div>

    <!-- Dropdown Menu -->
    <div v-if="showDropdown" 
         class="dropdown-menu animate-dropdown"
         :style="{ top: dropdownPosition.y + 'px', left: dropdownPosition.x + 'px' }">
      <button class="dropdown-item" @click="downloadPDF">
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" stroke-width="2"/>
          <polyline points="7 10 12 15 17 10" stroke="currentColor" stroke-width="2"/>
          <line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" stroke-width="2"/>
        </svg>
        Download PDF Report
      </button>
      <button class="dropdown-item danger" @click="confirmPermanentDelete">
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" stroke-width="2"/>
        </svg>
        Permanently Delete
      </button>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="modal-overlay" @click.self="showDeleteModal = false">
      <div class="modal-content glass-card animate-scale">
        <div class="modal-icon">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" stroke-width="2"/>
          </svg>
        </div>
        <h2 class="modal-title">Permanently Delete?</h2>
        <p class="confirm-message">Are you sure you want to permanently delete "<strong>{{ selectedList?.list_name }}</strong>"?</p>
        <p class="delete-warning">⚠️ This action cannot be undone. The list will be completely removed from the database.</p>
        <div class="modal-buttons">
          <button @click="permanentDeleteList" class="btn-danger">Yes, Delete Forever</button>
          <button @click="showDeleteModal = false" class="btn-secondary">Cancel</button>
        </div>
      </div>
    </div>

    <!-- Delete All Confirmation Modal -->
    <div v-if="showDeleteAllModal" class="modal-overlay" @click.self="showDeleteAllModal = false">
      <div class="modal-content glass-card animate-scale">
        <div class="modal-icon">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" stroke-width="2"/>
          </svg>
        </div>
        <h2 class="modal-title">Delete All Lists?</h2>
        <p class="confirm-message">Are you sure you want to permanently delete ALL {{ purchaseHistory.length }} shopping trips?</p>
        <p class="delete-warning">⚠️ This action cannot be undone. All lists will be completely removed from the database.</p>
        <div class="modal-buttons">
          <button @click="permanentDeleteAllListsConfirm" class="btn-danger">Yes, Delete All Forever</button>
          <button @click="showDeleteAllModal = false" class="btn-secondary">Cancel</button>
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
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../supabase/client'
import html2pdf from 'html2pdf.js'

const router = useRouter()
const logoUrl = '/logo.png'
const purchaseHistory = ref([])
const packedStatus = ref({})
const showMainMenu = ref(false)
const showDropdown = ref(false)
const showDeleteModal = ref(false)
const showDeleteAllModal = ref(false)
const selectedList = ref(null)
const dropdownPosition = ref({ x: 0, y: 0 })
const isLoading = ref(false)

// Computed properties
const totalItems = computed(() => {
  return purchaseHistory.value.reduce((sum, p) => sum + (p.items?.length || 0), 0)
})

const totalPacked = computed(() => {
  let packed = 0
  let total = 0
  for (const purchase of purchaseHistory.value) {
    total += purchase.items?.length || 0
    packed += getPackedCount(purchase)
  }
  return total === 0 ? 0 : Math.round((packed / total) * 100)
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

const getPackedCount = (purchase) => {
  return packedStatus.value[purchase.id] || 0
}

const getPackProgress = (purchase) => {
  const total = purchase.items?.length || 0
  const packed = getPackedCount(purchase)
  if (total === 0) return 0
  return (packed / total) * 100
}

const loadPackedStatus = async () => {
  for (const purchase of purchaseHistory.value) {
    let packed = 0
    if (purchase.items && purchase.items.length > 0) {
      for (const item of purchase.items) {
        if (item.id) {
          const { data } = await supabase
            .from('shopping_items')
            .select('packed')
            .eq('id', item.id)
            .maybeSingle()
          if (data?.packed) packed++
        }
      }
    }
    packedStatus.value[purchase.id] = packed
  }
}

const loadPurchaseHistory = async () => {
  if (isLoading.value) return
  isLoading.value = true
  
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      // Load purchase history first
      const { data: purchases, error: purchaseError } = await supabase
        .from('purchase_history')
        .select('*')
        .eq('user_id', user.id)
        .order('purchased_at', { ascending: false })
      
      if (purchaseError) throw purchaseError
      
      if (purchases) {
        // For each purchase, get updated packing status from shopping_items
        const purchasesWithStatus = []
        
        for (const purchase of purchases) {
          // Get current packing status for each item
          const itemsWithPackingStatus = []
          let packedCount = 0
          
          for (const item of purchase.items) {
            if (item.id) {
              const { data: itemData } = await supabase
                .from('shopping_items')
                .select('packed, cleared')
                .eq('id', item.id)
                .maybeSingle()
              
              const isPacked = itemData?.packed || false
              if (isPacked) packedCount++
              
              itemsWithPackingStatus.push({
                ...item,
                packed: isPacked,
                cleared: itemData?.cleared || true
              })
            } else {
              itemsWithPackingStatus.push({ ...item, packed: false, cleared: true })
            }
          }
          
          purchasesWithStatus.push({
            ...purchase,
            items: itemsWithPackingStatus,
            packedCount: packedCount
          })
          
          // Store packed status
          packedStatus.value[purchase.id] = packedCount
        }
        
        purchaseHistory.value = purchasesWithStatus
      }
    }
  } catch (error) {
    console.error('Error loading purchase history:', error)
    showNotification('Error loading data', 'error')
  } finally {
    isLoading.value = false
  }
}

const toggleMainMenu = () => {
  showMainMenu.value = !showMainMenu.value
}

const openDropdown = (event, purchase) => {
  event.preventDefault()
  event.stopPropagation()
  selectedList.value = purchase
  
  let x = event.clientX
  let y = event.clientY
  
  const dropdownWidth = 200
  const dropdownHeight = 120
  if (x + dropdownWidth > window.innerWidth) {
    x = window.innerWidth - dropdownWidth - 10
  }
  if (y + dropdownHeight > window.innerHeight) {
    y = window.innerHeight - dropdownHeight - 10
  }
  
  dropdownPosition.value = { x, y }
  showDropdown.value = true
  
  setTimeout(() => {
    showDropdown.value = false
  }, 5000)
}

const downloadPDF = async () => {
  if (!selectedList.value) return

  let packedCount = 0
  const itemsWithStatus = []
  
  for (const item of selectedList.value.items) {
    if (item.id) {
      const { data } = await supabase
        .from('shopping_items')
        .select('packed')
        .eq('id', item.id)
        .maybeSingle()
      const isPacked = data?.packed || false
      if (isPacked) packedCount++
      itemsWithStatus.push({ ...item, packed: isPacked })
    } else {
      itemsWithStatus.push({ ...item, packed: false })
    }
  }

  const now = new Date()
  const reportDate = now.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${escapeHtml(selectedList.value.list_name)} - Packing Report</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Segoe UI', Arial, sans-serif;
      background: white;
      padding: 40px;
      min-height: 100vh;
    }
    
    .report-container {
      max-width: 1000px;
      margin: 0 auto;
      background: white;
      border: 1px solid #E0E0E0;
      border-radius: 8px;
      overflow: hidden;
    }
    
    .report-header {
      padding: 30px;
      text-align: center;
      background: #1A1A1A;
      color: white;
    }
    
    .report-title {
      font-size: 28px;
      font-weight: 800;
      margin-bottom: 8px;
      color: white;
    }
    
    .report-subtitle {
      font-size: 16px;
      color: #CCCCCC;
      margin-top: 5px;
    }
    
    .table-container {
      padding: 30px;
    }
    
    .items-table {
      width: 100%;
      border-collapse: collapse;
    }
    
    .items-table th {
      background: #1A1A1A;
      color: white;
      padding: 14px;
      text-align: left;
      font-weight: 600;
      font-size: 13px;
    }
    
    .items-table td {
      padding: 12px 14px;
      border-bottom: 1px solid #F0F0F0;
      font-size: 13px;
      color: #1A1A1A;
    }
    
    .summary-section {
      background: #F8F9FA;
      padding: 20px 30px;
      display: flex;
      justify-content: space-between;
      border-top: 2px solid #1A1A1A;
      margin-top: 20px;
    }
    
    .summary-label {
      font-size: 18px;
      font-weight: 700;
      color: #1A1A1A;
    }
    
    .summary-amount {
      font-size: 22px;
      font-weight: 800;
      color: #1A1A1A;
    }
    
    .report-footer {
      background: #1A1A1A;
      padding: 20px;
      text-align: center;
      color: #999;
      font-size: 11px;
    }
  </style>
</head>
<body>
  <div class="report-container">
    <div class="report-header">
      <h1 class="report-title">FASTOP</h1>
      <p class="report-subtitle">${escapeHtml(selectedList.value.list_name)}</p>
    </div>
    
    <div class="table-container">
      <table class="items-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Item Name</th>
            <th>Quantity</th>
            <th>Unit Price (UGX)</th>
            <th>Total (UGX)</th>
          </tr>
        </thead>
        <tbody>
          ${itemsWithStatus.map((item, idx) => `
          <tr>
            <td style="padding: 12px;">${idx + 1}</td>
            <td style="padding: 12px;"><strong>${escapeHtml(item.name)}</strong></td>
            <td style="padding: 12px;">${item.quantity}</td>
            <td style="padding: 12px;">${formatNumber(item.price)}</td>
            <td style="padding: 12px;">${formatNumber(item.price * item.quantity)}</td>
          </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
    
    <div class="summary-section">
      <span class="summary-label">TOTAL AMOUNT</span>
      <span class="summary-amount">UGX ${formatNumber(selectedList.value.total_amount)}</span>
    </div>
    
    <div class="report-footer">
      <p>Generated on ${reportDate}</p>
      <p>&copy; ${new Date().getFullYear()} Fastop - All rights reserved</p>
    </div>
  </div>
</body>
</html>`

  const opt = {
    margin: 0.5,
    filename: `${selectedList.value.list_name.replace(/[^a-z0-9]/gi, '_')}_packing_report.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
  }
  
  await html2pdf().set(opt).from(htmlContent).save()
  showDropdown.value = false
  showNotification('PDF Report Downloaded!', 'success')
}

const escapeHtml = (text) => {
  if (!text) return ''
  return text.replace(/[&<>]/g, function(m) {
    if (m === '&') return '&amp;'
    if (m === '<') return '&lt;'
    if (m === '>') return '&gt;'
    return m
  })
}

const confirmPermanentDelete = () => {
  showDropdown.value = false
  showDeleteModal.value = true
}

// PERMANENT DELETE - Single list
const permanentDeleteList = async () => {
  if (!selectedList.value) return
  
  try {
    const listToDelete = selectedList.value
    const listId = listToDelete.id
    
    // Show loading state on the card
    const cardElement = document.querySelector(`.history-card[data-id="${listId}"]`)
    if (cardElement) {
      cardElement.style.opacity = '0.5'
      cardElement.style.pointerEvents = 'none'
    }
    
    // Step 1: Get all item IDs from this purchase
    const itemIds = listToDelete.items
      .filter(item => item && item.id)
      .map(item => item.id)
    
    // Step 2: Delete shopping_items first
    if (itemIds.length > 0) {
      const { error: itemsError } = await supabase
        .from('shopping_items')
        .delete()
        .in('id', itemIds)
      
      if (itemsError) {
        console.error('Error deleting items:', itemsError)
      }
    }
    
    // Step 3: Delete from purchase_history
    const { error: deleteError } = await supabase
      .from('purchase_history')
      .delete()
      .eq('id', listId)
    
    if (deleteError) throw deleteError
    
    // Step 4: Remove from local array
    const index = purchaseHistory.value.findIndex(p => p.id === listId)
    if (index !== -1) {
      purchaseHistory.value.splice(index, 1)
    }
    
    // Step 5: Clean up packed status
    delete packedStatus.value[listId]
    
    showDeleteModal.value = false
    selectedList.value = null
    showNotification(`"${listToDelete.list_name}" has been permanently deleted`, 'success')
    
  } catch (error) {
    console.error('Error deleting list:', error)
    showNotification('Error deleting list. Please try again.', 'error')
    // Reset card opacity if error
    const cardElement = document.querySelector(`.history-card[data-id="${selectedList.value?.id}"]`)
    if (cardElement) {
      cardElement.style.opacity = ''
      cardElement.style.pointerEvents = ''
    }
  }
}

const permanentDeleteAllLists = () => {
  showMainMenu.value = false
  if (purchaseHistory.value.length === 0) {
    showNotification('No lists to delete', 'error')
    return
  }
  showDeleteAllModal.value = true
}

// PERMANENT DELETE - All lists
const permanentDeleteAllListsConfirm = async () => {
  try {
    const listsToDelete = [...purchaseHistory.value]
    const listCount = listsToDelete.length
    
    if (listCount === 0) {
      showNotification('No lists to delete', 'error')
      showDeleteAllModal.value = false
      return
    }
    
    // Get all item IDs
    const allItemIds = []
    for (const list of listsToDelete) {
      if (list.items && list.items.length > 0) {
        for (const item of list.items) {
          if (item && item.id) allItemIds.push(item.id)
        }
      }
    }
    
    // Delete all shopping_items first
    if (allItemIds.length > 0) {
      const { error: itemsError } = await supabase
        .from('shopping_items')
        .delete()
        .in('id', allItemIds)
      
      if (itemsError) {
        console.error('Error deleting items:', itemsError)
      }
    }
    
    // Delete all purchase_history records
    const listIds = listsToDelete.map(list => list.id)
    const { error: deleteListsError } = await supabase
      .from('purchase_history')
      .delete()
      .in('id', listIds)
    
    if (deleteListsError) throw deleteListsError
    
    // Clear local arrays
    purchaseHistory.value = []
    packedStatus.value = {}
    
    showDeleteAllModal.value = false
    showNotification(`${listCount} list${listCount > 1 ? 's' : ''} permanently deleted`, 'success')
    
  } catch (error) {
    console.error('Error deleting all lists:', error)
    showNotification('Error deleting lists. Please try again.', 'error')
  }
}

const goToPackingDetail = (purchase) => {
  router.push(`/packing-detail/${purchase.id}?name=${encodeURIComponent(purchase.list_name)}`)
}

// Notification system
const notification = ref({ show: false, message: '', type: 'success' })
let notificationTimeout = null

const showNotification = (message, type = 'success') => {
  if (notificationTimeout) clearTimeout(notificationTimeout)
  notification.value = { show: true, message, type }
  notificationTimeout = setTimeout(() => { notification.value.show = false }, 3000)
}

const handleClickOutside = (e) => {
  if (!e.target.closest('.menu-btn') && !e.target.closest('.main-dropdown')) {
    showMainMenu.value = false
  }
  if (!e.target.closest('.history-card') && !e.target.closest('.dropdown-menu')) {
    showDropdown.value = false
  }
}

// Real-time subscription for updates
let historySubscription = null

const setupRealtimeSubscription = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return
  
  historySubscription = supabase
    .channel('purchase_history_deletes')
    .on('postgres_changes', {
      event: 'DELETE',
      schema: 'public',
      table: 'purchase_history'
    }, (payload) => {
      // Remove deleted item from local array
      const deletedId = payload.old.id
      const index = purchaseHistory.value.findIndex(p => p.id === deletedId)
      if (index !== -1) {
        purchaseHistory.value.splice(index, 1)
        delete packedStatus.value[deletedId]
      }
    })
    .on('postgres_changes', {
      event: 'UPDATE',
      schema: 'public',
      table: 'shopping_items'
    }, async (payload) => {
      // Update packed status in real-time
      if (payload.new && payload.new.packed !== undefined) {
        const itemId = payload.new.id
        const isPacked = payload.new.packed
        
        // Find and update the item in purchaseHistory
        for (const purchase of purchaseHistory.value) {
          const item = purchase.items.find(i => i.id === itemId)
          if (item) {
            item.packed = isPacked
            
            // Recalculate packed count
            const newPackedCount = purchase.items.filter(i => i.packed).length
            packedStatus.value[purchase.id] = newPackedCount
            break
          }
        }
      }
    })
    .subscribe()
}

onMounted(() => {
  loadPurchaseHistory()
  setupRealtimeSubscription()
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

.header-logo {
  width: 50px;
  height: 50px;
  border-radius: 16px;
  object-fit: cover;
  box-shadow: 0 4px 15px rgba(93, 255, 114, 0.2);
  animation: rotateLogo 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

@keyframes rotateLogo {
  0% { transform: rotate(-200deg) scale(0); opacity: 0; }
  100% { transform: rotate(0deg) scale(1); opacity: 1; }
}

.page-title {
  font-size: 24px;
  font-weight: 700;
  margin: 0;
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

/* Stats Summary */
.stats-summary {
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
  transition: all 0.3s;
}

.stat-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 20px rgba(93, 255, 114, 0.1);
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
}

/* Section Header */
.section-header {
  margin-bottom: 20px;
  animation: slideRight 0.5s ease-out;
}

@keyframes slideRight {
  from { opacity: 0; transform: translateX(-30px); }
  to { opacity: 1; transform: translateX(0); }
}

.section-title {
  font-size: 20px;
  font-weight: 700;
  color: #1A1A1A;
  margin-bottom: 8px;
}

.section-decoration {
  width: 50px;
  height: 3px;
  background: linear-gradient(90deg, #5DFF72, #34D399);
  border-radius: 3px;
  animation: expandWidth 0.6s ease-out;
}

@keyframes expandWidth {
  from { width: 0; }
  to { width: 50px; }
}

/* History Grid */
.history-grid {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.history-card {
  padding: 18px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  background: white;
  border-radius: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  animation: slideLeft 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) backwards;
}

@keyframes slideLeft {
  from { opacity: 0; transform: translateX(50px); }
  to { opacity: 1; transform: translateX(0); }
}

.history-card:hover {
  transform: translateX(8px) scale(1.02);
  border-left: 3px solid #5DFF72;
  box-shadow: 0 10px 30px rgba(93, 255, 114, 0.15);
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

.history-card:hover .card-shine {
  left: 100%;
}

.card-glow {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(93, 255, 114, 0.08), transparent);
  opacity: 0;
  transition: opacity 0.5s;
  pointer-events: none;
}

.history-card:hover .card-glow {
  opacity: 1;
}

.history-card-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 12px;
}

.history-icon {
  width: 45px;
  height: 45px;
  background: rgba(93, 255, 114, 0.1);
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.history-card:hover .history-icon {
  transform: scale(1.1);
  background: #5DFF72;
}

.history-card:hover .history-icon svg {
  color: #0B0B0B;
}

.history-icon svg {
  width: 24px;
  height: 24px;
  color: #5DFF72;
  transition: all 0.3s;
}

.animate-zoom {
  animation: zoomIn 0.4s ease-out;
}

@keyframes zoomIn {
  from { opacity: 0; transform: scale(0.8); }
  to { opacity: 1; transform: scale(1); }
}

.history-info {
  flex: 1;
}

.history-name {
  font-size: 16px;
  font-weight: 700;
  color: #1A1A1A;
  margin-bottom: 4px;
  transition: color 0.3s;
}

.history-card:hover .history-name {
  color: #5DFF72;
}

.history-date {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  color: #ADB5BD;
}

.history-date svg {
  width: 12px;
  height: 12px;
}

.history-amount {
  font-size: 16px;
  font-weight: 800;
  color: #5DFF72;
}

.history-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid #F0F0F0;
}

.items-count {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #6C757D;
}

.items-count svg {
  width: 14px;
  height: 14px;
}

.pack-status {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  font-weight: 600;
  color: #5DFF72;
}

.pack-status-bar {
  width: 60px;
  height: 4px;
  background: #F0F0F0;
  border-radius: 4px;
  overflow: hidden;
}

.pack-status-fill {
  height: 100%;
  background: linear-gradient(90deg, #5DFF72, #34D399);
  border-radius: 4px;
  transition: width 0.5s ease;
}

.card-arrow {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  opacity: 0;
  transition: all 0.3s;
}

.history-card:hover .card-arrow {
  opacity: 1;
  right: 12px;
}

.card-arrow svg {
  width: 20px;
  height: 20px;
  color: #5DFF72;
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
.main-dropdown {
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

.dropdown-menu {
  position: fixed;
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  z-index: 1000;
  min-width: 200px;
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

.dropdown-item:hover {
  background: #F8F9FA;
  transform: translateX(5px);
}

.dropdown-item.danger {
  color: #ff4444;
}

.dropdown-item.danger svg {
  color: #ff4444;
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

.modal-icon svg {
  width: 48px;
  height: 48px;
  margin: 0 auto 15px;
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
  margin-bottom: 10px;
}

.delete-warning {
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

.btn-danger:hover {
  transform: translateY(-2px);
  background: #cc0000;
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
  background: #333;
  color: white;
}

.notification-toast.error .notification-content {
  background: #ff4444;
  color: white;
}

.notification-content svg {
  width: 20px;
  height: 20px;
}

.notification-toast.success .notification-content svg {
  color: #5DFF72;
}

/* Footer */
.footer-sentence {
  margin-top: 50px;
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
  font-size: 13px;
  font-weight: 500;
  background: linear-gradient(135deg, #5DFF72, #34D399);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  letter-spacing: 0.5px;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .container {
    padding: 15px;
    padding-bottom: 80px;
  }
  
  .page-title {
    font-size: 20px;
  }
  
  .stat-value {
    font-size: 16px;
  }
  
  .history-name {
    font-size: 14px;
  }
  
  .history-amount {
    font-size: 14px;
  }
  
  .footer-sentence {
    margin-top: 35px;
    padding: 18px 15px;
  }
  
  .sentence-text {
    font-size: 11px;
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
.dark-mode .section-title,
.dark-mode .history-name,
.dark-mode .empty-state h3,
.dark-mode .modal-title {
  color: #FFFFFF;
}

.dark-mode .header-subtitle,
.dark-mode .history-date,
.dark-mode .items-count,
.dark-mode .empty-state p,
.dark-mode .confirm-message {
  color: #ADB5BD;
}

.dark-mode .stat-card {
  background: #2A2A2A;
  border-color: #3A3A3A;
}

.dark-mode .history-card,
.dark-mode .empty-state,
.dark-mode .modal-content {
  background: #2A2A2A;
}

.dark-mode .history-footer {
  border-top-color: #3A3A3A;
}

.dark-mode .main-dropdown,
.dark-mode .dropdown-menu {
  background: #2A2A2A;
}

.dark-mode .dropdown-item {
  color: #FFFFFF;
}

.dark-mode .dropdown-item:hover {
  background: #3A3A3A;
}

.dark-mode .menu-btn svg {
  color: #FFFFFF;
}

.dark-mode .menu-btn:hover {
  background: #3A3A3A;
}

.dark-mode .footer-sentence {
  border-top-color: rgba(93, 255, 114, 0.2);
  background: linear-gradient(180deg, transparent, rgba(93, 255, 114, 0.05));
}

/* Add to your existing styles */
.animate-remove {
  animation: removeItem 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
}

@keyframes removeItem {
  0% {
    opacity: 1;
    transform: translateX(0) scale(1);
  }
  30% {
    transform: translateX(-20px) scale(0.95);
    background: rgba(255, 68, 68, 0.2);
  }
  100% {
    opacity: 0;
    transform: translateX(-100px) scale(0.8);
    display: none;
  }
}
</style>