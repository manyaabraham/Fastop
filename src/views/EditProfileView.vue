<template>
  <div class="page-wrapper">
    <div class="edit-profile-page" :class="{ 'dark-mode': darkMode }">
      <div class="edit-container">
        <div class="header">
          <button class="back-button" @click="$router.back()">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" stroke-width="2"/>
            </svg>
          </button>
          <h1 class="page-title">Edit Profile</h1>
        </div>

                <!-- Notification Toast -->
<div v-if="notification.show" class="notification-toast" :class="notification.type">
  <div class="notification-content">
    <svg v-if="notification.type === 'success'" viewBox="0 0 24 24" fill="none">
      <path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
      <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
    </svg>
    <svg v-else viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
      <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" stroke-width="2"/>
      <circle cx="12" cy="16" r="1" fill="currentColor"/>
    </svg>
    <span>{{ notification.message }}</span>
  </div>
</div>
<!-- Notification Toast -->
<div v-if="notification.show" class="notification-toast" :class="notification.type">
  <div class="notification-content">
    <svg v-if="notification.type === 'success'" viewBox="0 0 24 24" fill="none">
      <path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
      <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
    </svg>
    <svg v-else viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
      <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" stroke-width="2"/>
      <circle cx="12" cy="16" r="1" fill="currentColor"/>
    </svg>
    <span>{{ notification.message }}</span>
  </div>
</div>

        <!-- Current Avatar - Initials based -->
        <div class="avatar-section">
          <div class="current-avatar">
            <div class="initials-avatar" :style="{ backgroundColor: avatarColor }">
              <span class="initials-text">{{ userInitials }}</span>
            </div>
          </div>
        </div>

        <!-- Edit Username -->
        <div class="edit-field">
          <label>Username </label>
          <div class="input-wrapper">
            <input v-model="username" type="text" class="input-field" placeholder="e.g., John Doe" />
            <button @click="updateUsername" class="save-btn" :disabled="savingUsername">
              {{ savingUsername ? 'Saving...' : 'Save' }}
            </button>
          </div>
          <p class="field-hint">Use your first and last name. Initials will update automatically.</p>
        </div>

        <!-- Change Password -->
        <div class="edit-field">
          <label>Change Password</label>
          <button class="change-password-btn" @click="showPasswordModal = true">
            Change Password
          </button>
        </div>

        <!-- Edit Options Modal (for future expansion) -->
        <div v-if="showEditOptions" class="modal-overlay" @click.self="showEditOptions = false">
          <div class="modal-content glass-card animate-scale">
            <h2 class="modal-title">Profile Picture</h2>
            <p class="modal-subtitle">Your profile picture is automatically generated from your username initials.</p>
            <p class="modal-info">To change your picture, update your username. The initials will update automatically.</p>
            <button class="close-modal" @click="showEditOptions = false">Got it</button>
          </div>
        </div>


        <!-- Change Password Modal -->
        <div v-if="showPasswordModal" class="modal-overlay" @click.self="showPasswordModal = false">
          <div class="modal-content password-modal">
            <h2>Change Password</h2>
            <div class="form-group">
              <label>New Password</label>
              <input v-model="newPassword" type="password" class="input-field" placeholder="Enter new password" />
            </div>
            <div class="form-group">
              <label>Confirm New Password</label>
              <input v-model="confirmNewPassword" type="password" class="input-field" placeholder="Confirm new password" />
            </div>
            <div class="modal-buttons">
              <button @click="changePassword" class="btn-primary">Update Password</button>
              <button @click="showPasswordModal = false" class="btn-secondary">Cancel</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../supabase/client'

const router = useRouter()
const username = ref('')
const savingUsername = ref(false)
const showEditOptions = ref(false)
const showPasswordModal = ref(false)
const newPassword = ref('')
const confirmNewPassword = ref('')
const darkMode = ref(false)
const profileData = ref(null)

// Notification state
const notification = ref({
  show: false,
  message: '',
  type: 'success'
})

let notificationTimeout = null

const showNotification = (message, type = 'success') => {
  if (notificationTimeout) {
    clearTimeout(notificationTimeout)
  }
  
  notification.value = {
    show: true,
    message: message,
    type: type
  }
  
  notificationTimeout = setTimeout(() => {
    notification.value.show = false
  }, 3000)
}

// Generate color based on username
const avatarColor = computed(() => {
  const colors = [
    '#5DFF72', '#34D399', '#60A5FA', '#FBBF24', '#F87171',
    '#A78BFA', '#F472B6', '#2DD4BF', '#FB923C', '#C084FC'
  ]
  if (!username.value) return colors[0]
  let hash = 0
  for (let i = 0; i < username.value.length; i++) {
    hash += username.value.charCodeAt(i)
  }
  return colors[hash % colors.length]
})

// Get initials from username
const userInitials = computed(() => {
  if (!username.value) return '?'
  const nameParts = username.value.trim().split(' ')
  if (nameParts.length >= 2) {
    const firstInitial = nameParts[0].charAt(0)
    const lastInitial = nameParts[nameParts.length - 1].charAt(0)
    return (firstInitial + lastInitial).toUpperCase()
  }
  return username.value.charAt(0).toUpperCase()
})

// Validate username format (two names, capital letters)
const isValidUsername = (name) => {
  const trimmed = name.trim()
  const parts = trimmed.split(' ')
  if (parts.length < 2) {
    showNotification('Please enter both first and last name', 'error')
    return false
  }
  // Check each part starts with capital letter
  for (const part of parts) {
    if (part.length > 0 && part[0] !== part[0].toUpperCase()) {
      showNotification('Each name should start with a capital letter (e.g., John Doe)', 'error')
      return false
    }
  }
  return true
}

const loadProfile = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  if (user) {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()
    
    if (data) {
      profileData.value = data
      username.value = data.username || user.email.split('@')[0]
      darkMode.value = data.dark_mode || false
    }
  }
}

const updateUsername = async () => {
  if (!username.value.trim()) {
    showNotification('Username cannot be empty', 'error')
    return
  }
  
  if (!isValidUsername(username.value)) {
    return
  }
  
  savingUsername.value = true
  const { data: { user } } = await supabase.auth.getUser()
  
  const { error } = await supabase
    .from('profiles')
    .update({ username: username.value })
    .eq('id', user.id)
  
  if (!error) {
    showNotification('Username updated successfully! Your avatar initials will update.', 'success')
  } else {
    showNotification('Error updating username. It may already be taken.', 'error')
  }
  savingUsername.value = false
}

const changePassword = async () => {
  if (newPassword.value !== confirmNewPassword.value) {
    showNotification('New passwords do not match!', 'error')
    return
  }
  
  if (newPassword.value.length < 6) {
    showNotification('Password must be at least 6 characters', 'error')
    return
  }
  
  const { error } = await supabase.auth.updateUser({
    password: newPassword.value
  })
  
  if (!error) {
    showNotification('Password updated successfully! Please login again.', 'success')
    setTimeout(async () => {
      await supabase.auth.signOut()
      router.push('/login')
    }, 2000)
  } else {
    showNotification('Error updating password', 'error')
  }
}

onMounted(() => {
  loadProfile()
})
</script>


<style scoped>
.edit-profile-page {
  min-height: 100vh;
  background: #FFFFFF;
  padding-bottom: 80px;
  transition: all 0.3s;
}

.edit-profile-page.dark-mode {
  background: #1A1A1A;
}

.edit-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
}

.back-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
  border-radius: 12px;
  transition: background 0.3s;
}

.back-button svg {
  width: 24px;
  height: 24px;
  color: #1A1A1A;
}

.dark-mode .back-button svg {
  color: #FFFFFF;
}

.back-button:hover {
  background: #F0F0F0;
}

.dark-mode .back-button:hover {
  background: #2A2A2A;
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  color: #1A1A1A;
}

/* Notification Toast */
.notification-toast {
  position: fixed;
  bottom: 100px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2000;
  animation: slideUp 0.3s ease-out;
  max-width: 90%;
  width: auto;
  min-width: 280px;
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

.dark-mode .notification-content {
  background: #2A2A2A;
  color: #FFFFFF;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.notification-toast.success .notification-content {
  border-left: 4px solid #5DFF72;
}

.notification-toast.error .notification-content {
  border-left: 4px solid #ff6464;
}

.notification-content svg {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.notification-toast.success .notification-content svg {
  color: #5DFF72;
}

.notification-toast.error .notification-content svg {
  color: #ff6464;
}

.notification-content span {
  flex: 1;
}

/* Responsive */
@media (max-width: 600px) {
  .notification-toast {
    bottom: 80px;
    width: 90%;
  }
  
  .notification-content {
    padding: 12px 16px;
    font-size: 13px;
  }
}

.dark-mode .page-title {
  color: #FFFFFF;
}

/* Avatar Section */
.avatar-section {
  text-align: center;
  margin-bottom: 30px;
}

.current-avatar {
  position: relative;
  width: 120px;
  height: 120px;
  margin: 0 auto 15px;
}

.initials-avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.initials-text {
  font-size: 48px;
  font-weight: 700;
  color: #0B0B0B;
}

.dark-mode .initials-text {
  color: #0B0B0B;
}

.edit-overlay {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 35px;
  height: 35px;
  background: #5DFF72;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
  border: 2px solid white;
}

.dark-mode .edit-overlay {
  border-color: #1A1A1A;
}

.edit-overlay:hover {
  transform: scale(1.1);
}

.edit-overlay svg {
  width: 18px;
  height: 18px;
  color: #0B0B0B;
}

.change-avatar-text {
  font-size: 13px;
  color: #5DFF72;
  font-weight: 600;
}

/* Edit Fields */
.edit-field {
  margin-bottom: 25px;
}

.edit-field label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 10px;
  color: #495057;
}

.dark-mode .edit-field label {
  color: #ADB5BD;
}

.field-hint {
  font-size: 11px;
  color: #6C757D;
  margin-top: 8px;
}

.dark-mode .field-hint {
  color: #ADB5BD;
}

.input-wrapper {
  display: flex;
  gap: 10px;
}

.input-field {
  flex: 1;
  padding: 12px 16px;
  background: #F8F9FA;
  border: 2px solid #E9ECEF;
  border-radius: 12px;
  font-size: 14px;
  font-family: inherit;
}

.dark-mode .input-field {
  background: #2A2A2A;
  border-color: #3A3A3A;
  color: #FFFFFF;
}

/* Notification Toast */
.notification-toast {
  position: fixed;
  bottom: 100px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2000;
  animation: slideUp 0.3s ease-out;
  max-width: 90%;
  width: auto;
  min-width: 280px;
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

.dark-mode .notification-content {
  background: #2A2A2A;
  color: #FFFFFF;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.notification-toast.success .notification-content {
  border-left: 4px solid #5DFF72;
}

.notification-toast.error .notification-content {
  border-left: 4px solid #ff6464;
}

.notification-content svg {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.notification-toast.success .notification-content svg {
  color: #5DFF72;
}

.notification-toast.error .notification-content svg {
  color: #ff6464;
}

.notification-content span {
  flex: 1;
}

/* Responsive */
@media (max-width: 600px) {
  .notification-toast {
    bottom: 80px;
    width: 90%;
  }
  
  .notification-content {
    padding: 12px 16px;
    font-size: 13px;
  }
}

.input-field:focus {
  outline: none;
  border-color: #5DFF72;
}

.save-btn {
  padding: 12px 24px;
  background: #5DFF72;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.save-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(93, 255, 114, 0.3);
}

.save-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.change-password-btn {
  width: 100%;
  padding: 12px;
  background: none;
  border: 2px solid #5DFF72;
  border-radius: 12px;
  color: #5DFF72;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.change-password-btn:hover {
  background: #5DFF72;
  color: #0B0B0B;
  transform: translateY(-2px);
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 20px;
  max-width: 400px;
  width: 90%;
  padding: 24px;
  text-align: center;
}

.dark-mode .modal-content {
  background: #2A2A2A;
  color: #FFFFFF;
}

.modal-title {
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 12px;
}

.modal-subtitle {
  font-size: 14px;
  color: #5DFF72;
  margin-bottom: 15px;
}

.modal-info {
  font-size: 13px;
  color: #6C757D;
  margin-bottom: 20px;
}

.dark-mode .modal-info {
  color: #ADB5BD;
}

.password-modal {
  max-width: 400px;
}

.password-modal h2 {
  margin-bottom: 20px;
  text-align: center;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-size: 13px;
  font-weight: 600;
}

.modal-buttons {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.btn-primary, .btn-secondary {
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
}

.btn-secondary {
  background: #F0F0F0;
  color: #666;
}

.dark-mode .btn-secondary {
  background: #3A3A3A;
  color: #FFFFFF;
}

.close-modal {
  width: 100%;
  margin-top: 15px;
  padding: 10px;
  background: #F0F0F0;
  border: none;
  border-radius: 12px;
  cursor: pointer;
}

.dark-mode .close-modal {
  background: #3A3A3A;
  color: #FFFFFF;
}

/* Animations */
.animate-scale {
  animation: scaleIn 0.3s ease-out;
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
</style>