<template>
  <div class="profile-page" :class="{ 'dark-mode': darkMode }">
    <div class="profile-container">
      <!-- Header with Logo and Title -->
      <div class="profile-header-section animate-slide-down">
        <div class="header-top">
          <div class="logo-area">
            <img v-if="logoUrl" :src="logoUrl" alt="Fastop Logo" class="header-logo animate-rotate" />
          </div>
          <div class="title-area">
            <h1 class="page-title gradient-text animate-fade-in">My Profile</h1>
            <p class="page-subtitle animate-fade-in" style="animation-delay: 0.1s">Manage your account settings</p>
          </div>
        </div>
      </div>

      <!-- Profile Avatar Section -->
      <div class="profile-avatar-section animate-scale" style="animation-delay: 0.15s">
        <div class="avatar-container" @click="goToEditProfile">
          <div class="initials-avatar animate-pulse" :style="{ backgroundColor: avatarColor }">
            <span class="initials-text">{{ userInitials }}</span>
            <div class="avatar-ring"></div>
          </div>
          <div class="edit-badge animate-zoom">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34" stroke="currentColor" stroke-width="2"/>
              <polygon points="18 2 22 6 12 16 8 16 8 12 18 2" stroke="currentColor" stroke-width="2"/>
            </svg>
          </div>
        </div>
        <h2 class="username animate-slide-up" style="animation-delay: 0.2s">{{ displayUsername }}</h2>
        <p class="user-email animate-slide-up" style="animation-delay: 0.25s">{{ userEmail }}</p>
      </div>


      <!-- Settings Section -->
      <div class="settings-section">
        <div class="setting-item animate-slide-left" style="animation-delay: 0.35s" @click="goToEditProfile">
          <div class="setting-info">
            <div class="setting-icon-wrapper">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" stroke-width="2"/>
                <circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="2"/>
              </svg>
            </div>
            <div>
              <h3>Edit Profile</h3>
              <p>Change username or password</p>
            </div>
          </div>
          <svg class="arrow-icon" viewBox="0 0 24 24" fill="none">
            <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2"/>
          </svg>
        </div>

        <div class="setting-item animate-slide-left" style="animation-delay: 0.4s">
          <div class="setting-info">
            <div class="setting-icon-wrapper">
              <svg viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="5" stroke="currentColor" stroke-width="2"/>
                <path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" stroke="currentColor" stroke-width="2"/>
              </svg>
            </div>
            <div>
              <h3>Dark Mode</h3>
              <p>Toggle dark/light theme</p>
            </div>
          </div>
          <button class="toggle-switch" :class="{ active: darkMode }" @click="toggleDarkMode">
            <div class="toggle-circle"></div>
          </button>
        </div>

        <div class="setting-item animate-slide-left" style="animation-delay: 0.45s" @click="goToSupport">
          <div class="setting-info">
            <div class="setting-icon-wrapper">
              <svg viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" stroke="currentColor" stroke-width="2"/>
                <line x1="12" y1="17" x2="12.01" y2="17" stroke="currentColor" stroke-width="2"/>
              </svg>
            </div>
            <div>
              <h3>Support Center</h3>
              <p>FAQs, contact us, and help</p>
            </div>
          </div>
          <svg class="arrow-icon" viewBox="0 0 24 24" fill="none">
            <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2"/>
          </svg>
        </div>
<!-- Replace your existing logout setting item with this -->
 <div class="setting-item animate-slide-left" style="animation-delay: 0.3s" @click="openLogoutModal">
  <div class="setting-info">
    <div class="setting-icon-wrapper logout-icon-wrapper">
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        <polyline points="16 17 21 12 16 7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>
    </div>
    <div>
      <h3>Logout</h3>
      <p>Sign out of your account</p>
    </div>
  </div>
  <svg class="arrow-icon" viewBox="0 0 24 24" fill="none">
    <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
  </svg>
</div>
</div>

      <!-- Logout Confirmation Modal -->
<div v-if="showLogoutModal" class="modal-overlay" @click.self="closeLogoutModal">
  <div class="modal-content glass-card animate-scale">
    <div class="modal-close" @click="closeLogoutModal">
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2"/>
      </svg>
    </div>
    <div class="modal-icon logout-icon">
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" stroke-width="2"/>
        <polyline points="16 17 21 12 16 7" stroke="currentColor" stroke-width="2"/>
        <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" stroke-width="2"/>
        <circle cx="9" cy="12" r="1" fill="currentColor"/>
      </svg>
    </div>
    <h2 class="modal-title">Logout</h2>
    <p class="confirm-message">Are you sure you want to logout?</p>
    <p class="logout-warning">You will need to login again to access your account.</p>
    <div class="modal-buttons">
      <button @click="confirmLogout" class="btn-logout">Yes, Logout</button>
      <button @click="closeLogoutModal" class="btn-secondary">Cancel</button>
    </div>
  </div>
</div>

      <div class="app-info animate-fade-in" style="animation-delay: 0.55s">
        <p class="app-version">Fastop v1.0.0</p>
        <p class="copyright">© 2024 Fastop. All rights reserved.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../supabase/client'

const router = useRouter()
const logoUrl = '/logo.png'
const userEmail = ref('')
const displayUsername = ref('')
const darkMode = ref(false)
const stats = ref({
  listsCount: 0,
  packedCount: 0,
  totalSpent: 0
})

// Real-time subscription
let profileSubscription = null

// Generate color based on username
const avatarColor = computed(() => {
  const colors = [
    '#5DFF72', '#34D399', '#60A5FA', '#FBBF24', '#F87171',
    '#A78BFA', '#F472B6', '#2DD4BF', '#FB923C', '#C084FC'
  ]
  if (!displayUsername.value) return colors[0]
  let hash = 0
  for (let i = 0; i < displayUsername.value.length; i++) {
    hash += displayUsername.value.charCodeAt(i)
  }
  return colors[hash % colors.length]
})

// Get initials from username
const userInitials = computed(() => {
  if (!displayUsername.value) return '?'
  const nameParts = displayUsername.value.split(' ')
  if (nameParts.length >= 2) {
    return (nameParts[0].charAt(0) + nameParts[1].charAt(0)).toUpperCase()
  }
  return displayUsername.value.charAt(0).toUpperCase()
})

const formatNumber = (num) => num?.toLocaleString() || '0'

const loadStats = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  if (user) {
    // Get lists count
    const { count: listsCount } = await supabase
      .from('shopping_lists')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
    
    // Get packed items count
    const { data: items } = await supabase
      .from('shopping_items')
      .select('packed')
      .eq('user_id', user.id)
    
    const packedCount = items?.filter(i => i.packed).length || 0
    
    // Get total spent from budget
    const { data: budget } = await supabase
      .from('budgets')
      .select('spent_amount')
      .eq('user_id', user.id)
      .single()
    
    stats.value = {
      listsCount: listsCount || 0,
      packedCount: packedCount,
      totalSpent: budget?.spent_amount || 0
    }
  }
}

const loadProfile = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }
    
    userEmail.value = user.email
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()
    
    if (data) {
      displayUsername.value = data.username || user.email.split('@')[0]
      darkMode.value = data.dark_mode || false
      
      // Apply dark mode instantly
      applyDarkMode(darkMode.value)
    } else {
      const defaultUsername = user.email.split('@')[0]
      const { error: insertError } = await supabase
        .from('profiles')
        .insert([{ 
          id: user.id, 
          username: defaultUsername
        }])
      
      if (!insertError) {
        displayUsername.value = defaultUsername
      }
    }
    
    await loadStats()
  } catch (err) {
    console.error('Error loading profile:', err)
  }
}

// Function to apply dark mode instantly
const applyDarkMode = (isDark) => {
  if (isDark) {
    document.documentElement.classList.add('dark-mode')
    document.body.classList.add('dark-mode')
    document.body.classList.add('global-dark-mode')
  } else {
    document.documentElement.classList.remove('dark-mode')
    document.body.classList.remove('dark-mode')
    document.body.classList.remove('global-dark-mode')
  }
}

// Toggle dark mode instantly
const toggleDarkMode = async () => {
  darkMode.value = !darkMode.value
  
  // Apply instantly before database update
  applyDarkMode(darkMode.value)
  
  // Dispatch global event
  window.dispatchEvent(new CustomEvent('dark-mode-toggle', { detail: darkMode.value }))
  
  // Update database in background
  const { data: { user } } = await supabase.auth.getUser()
  await supabase
    .from('profiles')
    .update({ dark_mode: darkMode.value })
    .eq('id', user.id)
}

const goToEditProfile = () => {
  router.push('/edit-profile')
}

const goToSupport = () => {
  router.push('/support')
}

// Add these refs to your state variables
const showLogoutModal = ref(false)

// Replace your existing logout function with these:
const openLogoutModal = () => {
  showLogoutModal.value = true
}

const closeLogoutModal = () => {
  showLogoutModal.value = false
}

const confirmLogout = async () => {
  await supabase.auth.signOut()
  router.push('/login')
}
// Set up real-time subscription for profile updates
const setupRealtimeSubscription = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return
  
  profileSubscription = supabase
    .channel('profile_changes')
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'profiles',
        filter: `id=eq.${user.id}`
      },
      (payload) => {
        if (payload.new) {
          displayUsername.value = payload.new.username
          darkMode.value = payload.new.dark_mode || false
          applyDarkMode(darkMode.value)
        }
      }
    )
    .subscribe()
}

onMounted(async () => {
  await loadProfile()
  await setupRealtimeSubscription()
})

onUnmounted(() => {
  if (profileSubscription) {
    supabase.removeChannel(profileSubscription)
  }
})
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  background: #FFFFFF;
  padding-bottom: 80px;
  transition: all 0.3s;
}

.profile-page.dark-mode {
  background: #1A1A1A;
}

.profile-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

/* Header Section */
.profile-header-section {
  margin-bottom: 30px;
}

.header-top {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  background: linear-gradient(135deg, #F8F9FA, #FFFFFF);
  border-radius: 24px;
  animation: slideDown 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

/* Logout setting item specific styles */
.setting-item:last-child {
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  margin-top: 8px;
  position: relative;
}

.dark-mode .setting-item:last-child {
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.logout-icon-wrapper {
  background: rgba(255, 68, 68, 0.1) !important;
}

.logout-icon-wrapper svg {
  color: #ff6464 !important;
}

.setting-item:last-child:hover {
  background: rgba(255, 68, 68, 0.08) !important;
  transform: translateX(8px);
}

.setting-item:last-child:hover .logout-icon-wrapper {
  background: rgba(255, 68, 68, 0.2) !important;
  transform: scale(1.1);
}

.setting-item:last-child:hover .logout-icon-wrapper svg {
  color: #ff4444 !important;
}

.setting-item:last-child:hover h3 {
  color: #ff6464 !important;
}

/* Make the logout section stand out */
.setting-item:last-child {
  border: 1px solid rgba(255, 68, 68, 0.2);
  background: rgba(255, 68, 68, 0.02);
}

.dark-mode .setting-item:last-child {
  border: 1px solid rgba(255, 68, 68, 0.15);
  background: rgba(255, 68, 68, 0.03);
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
  flex-shrink: 0;
}

.header-logo {
  width: 55px;
  height: 55px;
  border-radius: 16px;
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
  font-size: 24px;
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
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.page-subtitle {
  font-size: 12px;
  color: #6C757D;
  margin: 0;
}

/* Profile Avatar Section */
.profile-avatar-section {
  text-align: center;
  margin-bottom: 25px;
}

.animate-scale {
  animation: scaleIn 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.avatar-container {
  position: relative;
  width: 100px;
  height: 100px;
  margin: 0 auto 15px;
  cursor: pointer;
}

.initials-avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: all 0.3s;
}

.animate-pulse {
  animation: pulseGlow 2s ease infinite;
}

@keyframes pulseGlow {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(93, 255, 114, 0.4);
  }
  50% {
    box-shadow: 0 0 0 15px rgba(93, 255, 114, 0);
  }
}

.initials-text {
  font-size: 40px;
  font-weight: 700;
  color: #0B0B0B;
}

.avatar-ring {
  position: absolute;
  top: -3px;
  left: -3px;
  right: -3px;
  bottom: -3px;
  border-radius: 50%;
  border: 3px solid #5DFF72;
  animation: rotateRing 3s linear infinite;
}

@keyframes rotateRing {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.avatar-container:hover .initials-avatar {
  transform: scale(1.05);
}

.edit-badge {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 30px;
  height: 30px;
  background: #5DFF72;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid white;
  cursor: pointer;
  transition: all 0.3s;
}

.animate-zoom {
  animation: zoomIn 0.4s ease-out;
}

@keyframes zoomIn {
  from {
    opacity: 0;
    transform: scale(0);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.edit-badge:hover {
  transform: scale(1.1);
}

.edit-badge svg {
  width: 16px;
  height: 16px;
  color: #0B0B0B;
}

.username {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 5px;
  color: #1A1A1A;
}

.animate-slide-up {
  animation: slideUp 0.4s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.dark-mode .username {
  color: #FFFFFF;
}

.user-email {
  font-size: 13px;
  color: #6C757D;
}

/* Stats Cards */
.stats-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 25px;
}

.stat-card {
  background: #F8F9FA;
  padding: 15px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: all 0.3s;
}

.stat-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(93, 255, 114, 0.15);
}

/* Modal overlay and content */
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
  animation: fadeIn 0.3s ease;
}

.modal-content {
  max-width: 400px;
  width: 90%;
  padding: 24px;
  background: white;
  border-radius: 24px;
  position: relative;
  animation: scaleIn 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.dark-mode .modal-content {
  background: #2A2A2A;
}

.modal-close {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 32px;
  height: 32px;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
}

.modal-close:hover {
  background: rgba(0, 0, 0, 0.1);
  transform: rotate(90deg);
}

.modal-close svg {
  width: 18px;
  height: 18px;
}

.modal-icon {
  text-align: center;
  margin-bottom: 20px;
}

.modal-icon svg {
  width: 60px;
  height: 60px;
}

.modal-title {
  font-size: 24px;
  font-weight: 700;
  text-align: center;
  margin-bottom: 12px;
  color: #1A1A1A;
}

.dark-mode .modal-title {
  color: #FFFFFF;
}

.confirm-message {
  text-align: center;
  color: #6C757D;
  margin-bottom: 8px;
}

.logout-warning {
  text-align: center;
  color: #ff6464;
  font-size: 12px;
  margin-bottom: 24px;
}

.modal-buttons {
  display: flex;
  gap: 12px;
}

.modal-buttons button {
  flex: 1;
  padding: 14px;
  border: none;
  border-radius: 40px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-logout {
  background: linear-gradient(135deg, #ff6464, #ff4444);
  color: white;
}

.btn-logout:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(255, 68, 68, 0.3);
}

.btn-secondary {
  background: #F0F0F0;
  color: #666;
}

.btn-secondary:hover {
  transform: translateY(-2px);
  background: #E0E0E0;
}

.dark-mode .btn-secondary {
  background: #3A3A3A;
  color: #FFFFFF;
}

.dark-mode .btn-secondary:hover {
  background: #4A4A4A;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
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

.dark-mode .stat-card {
  background: #2A2A2A;
}

.stat-icon {
  font-size: 28px;
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 18px;
  font-weight: 800;
  color: #5DFF72;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 10px;
  color: #6C757D;
}

/* Settings Section */
.settings-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 30px;
}

/* Logout button in settings */
.setting-item:last-child .setting-info svg {
  color: #ff6464;
}

.setting-item:last-child:hover {
  background: rgba(255, 68, 68, 0.1);
  border-left: 3px solid #ff6464;
}

/* Logout icon in modal */
.logout-icon svg {
  color: #ff6464;
}

.btn-logout {
  background: linear-gradient(135deg, #ff6464, #ff4444);
  color: white;
  padding: 12px;
  border: none;
  border-radius: 40px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  flex: 1;
}

.btn-logout:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(255, 68, 68, 0.3);
}

.logout-warning {
  color: #ff6464;
  font-size: 12px;
  margin-bottom: 20px;
}

.setting-item {
  background: #F8F9FA;
  padding: 16px;
  border-radius: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s;
}

.animate-slide-left {
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

.dark-mode .setting-item {
  background: #2A2A2A;
}

.setting-item:hover {
  transform: translateX(5px);
  background: #F0F0F0;
}

.dark-mode .setting-item:hover {
  background: #333;
}

.setting-info {
  display: flex;
  gap: 12px;
  align-items: center;
}

.setting-icon-wrapper {
  width: 40px;
  height: 40px;
  background: rgba(93, 255, 114, 0.1);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.setting-item:hover .setting-icon-wrapper {
  transform: scale(1.1);
  background: rgba(93, 255, 114, 0.2);
}

.setting-icon-wrapper svg {
  width: 20px;
  height: 20px;
  color: #5DFF72;
}

.setting-info h3 {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 4px;
  color: #1A1A1A;
}

.dark-mode .setting-info h3 {
  color: #FFFFFF;
}

.setting-info p {
  font-size: 12px;
  color: #6C757D;
}

.arrow-icon {
  width: 20px;
  height: 20px;
  color: #999;
  transition: transform 0.3s;
}

.setting-item:hover .arrow-icon {
  transform: translateX(5px);
}

.toggle-switch {
  width: 50px;
  height: 26px;
  background: #E9ECEF;
  border: none;
  border-radius: 30px;
  position: relative;
  cursor: pointer;
  transition: all 0.3s;
}

.toggle-switch.active {
  background: #5DFF72;
}

.toggle-circle {
  width: 22px;
  height: 22px;
  background: white;
  border-radius: 50%;
  position: absolute;
  top: 2px;
  left: 2px;
  transition: all 0.3s;
}

.toggle-switch.active .toggle-circle {
  transform: translateX(24px);
}

/* App Info */
.app-info {
  text-align: center;
  padding: 20px;
}

.app-version {
  font-size: 12px;
  color: #ADB5BD;
  margin-bottom: 4px;
}

.copyright {
  font-size: 11px;
  color: #CED4DA;
}

/* Fix background to follow theme */
.profile-page {
  background: #FFFFFF;
  transition: background 0.3s ease;
}

.profile-page.dark-mode {
  background: #1A1A1A;
}

/* Fix header background in dark mode */
.dark-mode .profile-header-section .header-top {
  background: #2A2A2A;
}

/* Fix stat cards in dark mode */
.dark-mode .stat-card {
  background: #2A2A2A;
}

.dark-mode .stat-card .stat-label {
  color: #ADB5BD;
}

/* Fix setting items in dark mode */
.dark-mode .setting-item {
  background: #2A2A2A;
}

.dark-mode .setting-item:hover {
  background: #333;
}

/* Fix app info text in dark mode */
.dark-mode .app-version,
.dark-mode .copyright {
  color: #6C757D;
}

/* Fix page subtitle in dark mode */
.dark-mode .page-subtitle {
  color: #ADB5BD;
}

/* Fix user email in dark mode */
.dark-mode .user-email {
  color: #ADB5BD;
}

/* Ensure all cards follow theme */
.dark-mode .stats-cards .stat-card,
.dark-mode .settings-section .setting-item {
  background: #2A2A2A;
}

/* Fix any remaining white backgrounds */
.dark-mode .profile-container {
  background: transparent;
}

.dark-mode .avatar-container .initials-avatar {
  box-shadow: 0 0 0 3px rgba(93, 255, 114, 0.3);
}

</style>