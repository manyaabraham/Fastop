<template>
  <div class="purchase-detail-page">
    <div class="detail-container">
      <!-- Header -->
      <div class="header animate-slide-down">
        <button class="back-button" @click="$router.back()">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" stroke-width="2"/>
          </svg>
        </button>
        <h1 class="page-title">Purchase Details</h1>
      </div>

      <!-- Purchase Info Card -->
      <div class="info-card animate-scale">
        <div class="info-header">
          <div class="list-icon">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" stroke-width="1.5"/>
            </svg>
          </div>
          <div class="info-title">
            <h2>{{ listName }}</h2>
            <p>{{ formatDate(purchasedAt) }}</p>
          </div>
        </div>
        <div class="info-stats">
          <div class="stat">
            <span class="stat-label">Items Purchased</span>
            <span class="stat-value">{{ items.length }}</span>
          </div>
          <div class="stat">
            <span class="stat-label">Total Spent</span>
            <span class="stat-value">UGX {{ formatNumber(totalAmount) }}</span>
          </div>
        </div>
      </div>

      <!-- Items List -->
      <div class="items-section">
        <h3 class="section-title">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M20 12V8H4v12h16v-4M12 4v4M8 4v4M16 4v4" stroke="currentColor" stroke-width="1.5"/>
          </svg>
          Purchased Items
        </h3>
        
        <div class="items-list">
          <div v-for="(item, index) in items" :key="index" class="item-card glass-card animate-slide-left">
            <div class="item-number">{{ index + 1 }}</div>
            <div class="item-details">
              <div class="item-header">
                <h4 class="item-name">{{ item.name }}</h4>
                <span class="item-quantity">x{{ item.quantity }}</span>
              </div>
              <div class="item-meta">
                <span class="item-price">UGX {{ formatNumber(item.price) }} each</span>
                <span v-if="item.brand" class="item-brand">Brand: {{ item.brand }}</span>
              </div>
              <div class="item-total">Total: UGX {{ formatNumber(item.price * item.quantity) }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Summary Card -->
      <div class="summary-card animate-scale">
        <div class="summary-row">
          <span>Subtotal:</span>
          <span>UGX {{ formatNumber(totalAmount) }}</span>
        </div>
        <div class="summary-row total">
          <span>Total Amount:</span>
          <span>UGX {{ formatNumber(totalAmount) }}</span>
        </div>
      </div>

    </div>


    <!-- Toast -->
    <div v-if="showToast" class="toast-message animate-slide-up success">
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2"/>
      </svg>
      <span>{{ toastMessage }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { supabase } from '../supabase/client'

const route = useRoute()
const router = useRouter()

const purchaseId = ref(route.query.id || route.params.id)
const listName = ref(route.query.list_name || 'Shopping List')
const purchasedAt = ref(route.query.purchased_at || new Date())
const totalAmount = ref(Number(route.query.total_amount) || 0)
const items = ref([])
const showReturnConfirm = ref(false)
const showToast = ref(false)
const toastMessage = ref('')

const formatNumber = (num) => num?.toLocaleString() || '0'

const formatDate = (date) => {
  if (!date) return ''
  const d = new Date(date)
  return d.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const loadPurchaseDetails = async () => {
  if (purchaseId.value) {
    const { data: { user } } = await supabase.auth.getUser()
    const { data } = await supabase
      .from('purchase_history')
      .select('*')
      .eq('id', purchaseId.value)
      .eq('user_id', user.id)
      .single()
    
    if (data) {
      listName.value = data.list_name
      purchasedAt.value = data.purchased_at
      totalAmount.value = data.total_amount
      items.value = data.items || []
    }
  } else if (route.query.item_name) {
    // Single item view
    items.value = [{
      name: route.query.item_name,
      quantity: Number(route.query.item_quantity) || 1,
      price: Number(route.query.item_price) || 0,
      brand: route.query.item_brand || 'No brand'
    }]
    totalAmount.value = Number(route.query.item_total) || 0
  }
}

const returnAllItems = () => {
  showReturnConfirm.value = true
}

const confirmReturnAll = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  
  // Update each item in shopping_items
  for (const item of items.value) {
    if (item.id) {
      await supabase
        .from('shopping_items')
        .update({ cleared: false, packed: false })
        .eq('id', item.id)
    }
  }
  
  // Update budget
  const { data: budget } = await supabase
    .from('budgets')
    .select('*')
    .eq('user_id', user.id)
    .single()
  
  if (budget) {
    await supabase
      .from('budgets')
      .update({ spent_amount: Math.max(0, (budget.spent_amount || 0) - totalAmount.value) })
      .eq('id', budget.id)
  }
  
  // Delete from purchase history
  if (purchaseId.value) {
    await supabase
      .from('purchase_history')
      .delete()
      .eq('id', purchaseId.value)
  }
  
  showToastMessage(`✅ All ${items.value.length} items have been returned to your shopping list! UGX ${formatNumber(totalAmount.value)} added back to budget.`)
  showReturnConfirm.value = false
  
  setTimeout(() => {
    router.back()
  }, 2000)
}

const showToastMessage = (message) => {
  toastMessage.value = message
  showToast.value = true
  setTimeout(() => {
    showToast.value = false
  }, 3000)
}

onMounted(() => {
  loadPurchaseDetails()
})
</script>

<style scoped>
.purchase-detail-page {
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

.header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 25px;
  animation: slideDown 0.5s ease-out;
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
  font-size: 24px;
  font-weight: 700;
  color: #1A1A1A;
}

.info-card {
  background: white;
  border-radius: 20px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  animation: scaleIn 0.4s ease-out;
}

.info-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
}

.list-icon svg {
  width: 40px;
  height: 40px;
  color: #5DFF72;
}

.info-title h2 {
  font-size: 18px;
  font-weight: 700;
  color: #1A1A1A;
  margin-bottom: 4px;
}

.info-title p {
  font-size: 12px;
  color: #6C757D;
}

.info-stats {
  display: flex;
  gap: 20px;
  padding-top: 15px;
  border-top: 1px solid #F0F0F0;
}

.stat {
  flex: 1;
}

.stat-label {
  display: block;
  font-size: 11px;
  color: #6C757D;
  margin-bottom: 4px;
}

.stat-value {
  font-size: 18px;
  font-weight: 700;
  color: #5DFF72;
}

.section-title {
  font-size: 18px;
  font-weight: 700;
  color: #1A1A1A;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.section-title svg {
  width: 20px;
  height: 20px;
  color: #5DFF72;
}

.items-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
}

.item-card {
  display: flex;
  gap: 15px;
  padding: 15px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  animation: slideLeft 0.4s ease-out backwards;
}

.item-number {
  width: 32px;
  height: 32px;
  background: rgba(93, 255, 114, 0.1);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: #5DFF72;
}

.item-details {
  flex: 1;
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.item-name {
  font-size: 16px;
  font-weight: 600;
  color: #1A1A1A;
}

.item-quantity {
  font-size: 13px;
  color: #5DFF72;
  font-weight: 500;
}

.item-meta {
  display: flex;
  gap: 15px;
  margin-bottom: 8px;
  font-size: 12px;
  color: #6C757D;
}

.item-brand {
  color: #5DFF72;
}

.item-total {
  font-size: 14px;
  font-weight: 600;
  color: #1A1A1A;
}

.summary-card {
  background: linear-gradient(135deg, #F8F9FA, #FFFFFF);
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 20px;
  border: 1px solid #E9ECEF;
  animation: scaleIn 0.4s ease-out;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  font-size: 14px;
  color: #1A1A1A;
}

.summary-row.total {
  padding-top: 15px;
  margin-top: 10px;
  border-top: 1px solid #E9ECEF;
  font-weight: 700;
  font-size: 16px;
}

.action-buttons {
  display: flex;
  gap: 12px;
}

.return-all-btn {
  flex: 1;
  background: none;
  border: 2px solid #ff4444;
  padding: 14px;
  border-radius: 14px;
  color: #ff4444;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s;
}

.return-all-btn svg {
  width: 20px;
  height: 20px;
}

.return-all-btn:hover {
  background: #ff4444;
  color: white;
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
}

.modal-content {
  max-width: 350px;
  width: 90%;
  padding: 24px;
  text-align: center;
  background: white;
  border-radius: 20px;
  animation: scaleIn 0.3s ease-out;
}

.modal-icon.warning svg {
  width: 50px;
  height: 50px;
  color: #ff4444;
  margin-bottom: 15px;
}

.modal-title {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 10px;
  color: #1A1A1A;
}

.confirm-message {
  color: #6C757D;
  margin-bottom: 15px;
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

.toast-message {
  position: fixed;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%);
  background: #333;
  color: white;
  padding: 12px 20px;
  border-radius: 40px;
  display: flex;
  align-items: center;
  gap: 10px;
  z-index: 1001;
  font-size: 14px;
}

.toast-message svg {
  width: 18px;
  height: 18px;
  color: #5DFF72;
}

@keyframes slideDown {
  from { opacity: 0; transform: translateY(-30px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
}

@keyframes slideLeft {
  from { opacity: 0; transform: translateX(30px); }
  to { opacity: 1; transform: translateX(0); }
}

.animate-slide-down { animation: slideDown 0.5s ease-out; }
.animate-scale { animation: scaleIn 0.4s ease-out; }
.animate-slide-left { animation: slideLeft 0.4s ease-out backwards; }
.animate-slide-up {
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from { opacity: 0; transform: translateX(-50%) translateY(20px); }
  to { opacity: 1; transform: translateX(-50%) translateY(0); }
}

/* Dark Mode */
.dark-mode .purchase-detail-page {
  background: #1A1A1A;
}

.dark-mode .page-title,
.dark-mode .info-title h2,
.dark-mode .section-title,
.dark-mode .item-name,
.dark-mode .item-total,
.dark-mode .summary-row,
.dark-mode .modal-title {
  color: #FFFFFF;
}

.dark-mode .info-card,
.dark-mode .item-card,
.dark-mode .summary-card,
.dark-mode .modal-content {
  background: #2A2A2A;
}

.dark-mode .info-title p,
.dark-mode .stat-label,
.dark-mode .item-meta,
.dark-mode .confirm-message {
  color: #ADB5BD;
}

.dark-mode .info-stats,
.dark-mode .summary-row.total {
  border-top-color: #3A3A3A;
}

.dark-mode .back-button svg {
  color: #FFFFFF;
}

.dark-mode .back-button:hover {
  background: #2A2A2A;
}
</style>