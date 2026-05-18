<template>
  <div id="app" :class="{ 'dark-mode': isDarkMode && !isAuthPage }">
    <!-- Remove AnimatedBackground if it doesn't exist -->
    
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>

    <!-- Install Notification -->
    <div v-if="showInstallPrompt" class="install-notification animate-slide-down">
      <div class="install-content">
        <div class="install-icon">
          <img src="/logo.png" alt="Fastop" @error="handleImageError" />
        </div>
        <div class="install-text">
          <h4>Install Fastop App</h4>
          <p>Get a better experience with our app</p>
        </div>
        <div class="install-buttons">
          <button @click="installApp" class="install-btn">Install</button>
          <button @click="dismissInstall" class="dismiss-btn">✕</button>
        </div>
      </div>
    </div>

    <!-- Installation Instructions Modal -->
    <div v-if="showInstructions" class="modal-overlay" @click.self="closeInstructions">
      <div class="instructions-modal glass-card animate-scale">
        <div class="modal-header">
          <h3>Install Fastop App</h3>
          <button class="close-btn" @click="closeInstructions">✕</button>
        </div>
        
        <div class="instructions-content">
          <div class="instruction-item">
            <span class="instruction-icon">🍎</span>
            <div class="instruction-text">
              <strong>iPhone / iPad:</strong>
              <p>Tap the Share button <span class="icon">⎙</span> → "Add to Home Screen"</p>
            </div>
          </div>
          
          <div class="instruction-item">
            <span class="instruction-icon">🤖</span>
            <div class="instruction-text">
              <strong>Android / Chrome:</strong>
              <p>Tap the menu <span class="icon">⋮</span> → "Install App" or "Add to Home Screen"</p>
            </div>
          </div>
          
          <div class="instruction-item">
            <span class="instruction-icon">🌐</span>
            <div class="instruction-text">
              <strong>Other Browsers:</strong>
              <p>Look for "Install" or "Add to Home Screen" in the browser menu</p>
            </div>
          </div>
        </div>
        
        <button @click="closeInstructions" class="got-it-btn">Got it!</button>
      </div>
    </div>
    
    <nav v-if="showNav" class="bottom-nav">
      <button 
        class="nav-item" 
        :class="{ active: $route.path === '/dashboard' || $route.path === '/' }" 
        @click="$router.push('/dashboard')"
      >
        <div class="nav-icon-wrapper">
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <polyline points="9 22 9 12 15 12 15 22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <div class="ripple"></div>
        </div>
        <span class="nav-label">Home</span>
      </button>
      
      <button 
        class="nav-item" 
        :class="{ active: $route.path === '/lists' }" 
        @click="$router.push('/lists')"
      >
        <div class="nav-icon-wrapper">
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none">
            <line x1="8" y1="6" x2="21" y2="6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <line x1="8" y1="12" x2="21" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <line x1="8" y1="18" x2="21" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <line x1="3" y1="6" x2="3.01" y2="6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <line x1="3" y1="12" x2="3.01" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <line x1="3" y1="18" x2="3.01" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          <div class="ripple"></div>
        </div>
        <span class="nav-label">Lists</span>
      </button>
      
      <button 
        class="nav-item" 
        :class="{ active: $route.path === '/search' }" 
        @click="$router.push('/search')"
      >
        <div class="nav-icon-wrapper">
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          <div class="ripple"></div>
        </div>
        <span class="nav-label">Search</span>
      </button>
      
      <button 
        class="nav-item" 
        :class="{ active: $route.path === '/packing-checklist' || $route.path === '/checklist' }" 
        @click="$router.push('/packing-checklist')"
      >
        <div class="nav-icon-wrapper">
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <polyline points="22 4 12 14.01 9 11.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <div class="ripple"></div>
        </div>
        <span class="nav-label">Checklist</span>
      </button>
      
      <button 
        class="nav-item" 
        :class="{ active: $route.path === '/profile' }" 
        @click="$router.push('/profile')"
      >
        <div class="nav-icon-wrapper">
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <div class="ripple"></div>
        </div>
        <span class="nav-label">Profile</span>
      </button>
    </nav>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { supabase } from './supabase/client'

const route = useRoute()
const isDarkMode = ref(false)
const showNav = computed(() => {
  const hideNavRoutes = ['/login','/shopping-mode','/signup','/budget', '/edit-profile', '/support', '/welcome', '/download', '/splash']
  return !hideNavRoutes.includes(route.path)
})
const isAuthPage = computed(() => ['/login', '/signup'].includes(route.path))

// Install notification
const showInstallPrompt = ref(false)
const showInstructions = ref(false)
let deferredPrompt = null

// Check if app is already installed
const isRunningAsApp = () => {
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                       window.navigator.standalone === true ||
                       document.referrer.includes('android-app://')
  return isStandalone
}

// Check if user already dismissed
const wasDismissed = () => {
  return localStorage.getItem('install-dismissed') === 'true'
}

// Handle image error
const handleImageError = (e) => {
  e.target.style.display = 'none'
}

// Listen for the beforeinstallprompt event
const handleBeforeInstallPrompt = (e) => {
  e.preventDefault()
  deferredPrompt = e
  if (!isRunningAsApp() && !wasDismissed()) {
    showInstallPrompt.value = true
  }
}

// Install app - TRIGGERS NATIVE BROWSER INSTALL
const installApp = async () => {
  if (!deferredPrompt) {
    showInstallPrompt.value = false
    showInstructions.value = true
    return
  }
  
  deferredPrompt.prompt()
  const { outcome } = await deferredPrompt.userChoice
  deferredPrompt = null
  showInstallPrompt.value = false
  
  if (outcome === 'accepted') {
    console.log('User accepted the install prompt')
    localStorage.setItem('install-dismissed', 'true')
  }
}

// Close instructions
const closeInstructions = () => {
  showInstructions.value = false
}

// Dismiss install notification
const dismissInstall = () => {
  showInstallPrompt.value = false
  localStorage.setItem('install-dismissed', 'true')
}

// Load dark mode preference from database
const loadDarkModePreference = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data } = await supabase
        .from('profiles')
        .select('dark_mode')
        .eq('id', user.id)
        .single()
      
      if (data) {
        isDarkMode.value = data.dark_mode || false
        applyDarkMode(isDarkMode.value)
      }
    }
  } catch (err) {
    console.error('Error loading dark mode:', err)
  }
}

// Apply dark mode to body
const applyDarkMode = (isDark) => {
  if (isDark && !isAuthPage.value) {
    document.body.classList.add('global-dark-mode')
    document.documentElement.style.backgroundColor = '#1A1A1A'
  } else {
    document.body.classList.remove('global-dark-mode')
    document.documentElement.style.backgroundColor = ''
  }
}

// Save dark mode preference to database
const saveDarkModePreference = async (value) => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await supabase
        .from('profiles')
        .update({ dark_mode: value })
        .eq('id', user.id)
    }
  } catch (err) {
    console.error('Error saving dark mode:', err)
  }
}

// Watch for dark mode changes
watch(isDarkMode, (newValue) => {
  if (!isAuthPage.value) {
    applyDarkMode(newValue)
  }
})

// Listen for dark mode toggle events from profile page
window.addEventListener('dark-mode-toggle', (event) => {
  isDarkMode.value = event.detail
  saveDarkModePreference(event.detail)
  if (!isAuthPage.value) {
    applyDarkMode(event.detail)
  }
})

// Watch for route changes to apply dark mode on non-auth pages
watch([isAuthPage, isDarkMode], ([isAuth, isDark]) => {
  if (!isAuth && isDark) {
    applyDarkMode(true)
  } else if (isAuth) {
    document.body.classList.remove('global-dark-mode')
  }
})

// Check if on mobile device
const isMobileDevice = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

onMounted(() => {
  loadDarkModePreference()
  window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
  
  if (isMobileDevice() && !isRunningAsApp() && !wasDismissed()) {
    setTimeout(() => {
      if (!deferredPrompt && !isRunningAsApp() && !wasDismissed()) {
        showInstallPrompt.value = true
      }
    }, 3000)
  }
  
  window.addEventListener('appinstalled', () => {
    console.log('App was installed')
    showInstallPrompt.value = false
    deferredPrompt = null
  })
})
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  min-height: 100dvh;
  background: #FFFFFF;
  position: relative;
  z-index: 1;
  transition: background 0.3s ease;
}

#app.dark-mode {
  background: #1A1A1A;
}

/* Make sure content appears above animation */
.container,
.login-container,
.bottom-nav,
.glass-card,
.modal-overlay {
  position: relative;
  z-index: 2;
}

/* Install Notification */
.install-notification {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: white;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  z-index: 10000;
  padding: 12px 16px;
  border-bottom: 2px solid #5DFF72;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-100%);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-slide-down {
  animation: slideDown 0.3s ease-out;
}

.install-content {
  display: flex;
  align-items: center;
  gap: 12px;
  max-width: 600px;
  margin: 0 auto;
}

.install-icon img {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  object-fit: cover;
}

.install-text {
  flex: 1;
}

.install-text h4 {
  font-size: 14px;
  font-weight: 700;
  margin: 0 0 2px 0;
  color: #1A1A1A;
}

.install-text p {
  font-size: 12px;
  margin: 0;
  color: #6C757D;
}

.install-buttons {
  display: flex;
  align-items: center;
  gap: 8px;
}

.install-btn {
  background: linear-gradient(135deg, #5DFF72, #34D399);
  border: none;
  padding: 8px 16px;
  border-radius: 30px;
  font-size: 13px;
  font-weight: 600;
  color: #0B0B0B;
  cursor: pointer;
  transition: all 0.3s;
}

.install-btn:hover {
  transform: scale(1.05);
}

.dismiss-btn {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: #ADB5BD;
  padding: 4px 8px;
  transition: all 0.3s;
}

.dismiss-btn:hover {
  color: #ff4444;
}

/* Instructions Modal */
.instructions-modal {
  max-width: 350px;
  width: 90%;
  padding: 24px;
  background: white;
  border-radius: 24px;
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

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.modal-header h3 {
  font-size: 20px;
  font-weight: 700;
  margin: 0;
  color: #1A1A1A;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #ADB5BD;
}

.instructions-content {
  margin-bottom: 24px;
}

.instruction-item {
  display: flex;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid #F0F0F0;
}

.instruction-icon {
  font-size: 24px;
}

.instruction-text strong {
  display: block;
  font-size: 14px;
  margin-bottom: 4px;
  color: #1A1A1A;
}

.instruction-text p {
  font-size: 12px;
  color: #6C757D;
  margin: 0;
}

.instruction-text .icon {
  font-size: 14px;
  font-weight: 600;
  background: #F0F0F0;
  padding: 2px 6px;
  border-radius: 6px;
}

.got-it-btn {
  width: 100%;
  background: linear-gradient(135deg, #5DFF72, #34D399);
  border: none;
  padding: 12px;
  border-radius: 40px;
  font-weight: 600;
  color: #0B0B0B;
  cursor: pointer;
}

/* Dark mode */
.dark-mode .install-notification {
  background: #2A2A2A;
}

.dark-mode .install-text h4 {
  color: #FFFFFF;
}

.dark-mode .install-text p {
  color: #ADB5BD;
}

.dark-mode .instructions-modal {
  background: #2A2A2A;
}

.dark-mode .modal-header h3 {
  color: #FFFFFF;
}

.dark-mode .instruction-text strong {
  color: #FFFFFF;
}

.dark-mode .instruction-item {
  border-bottom-color: #3A3A3A;
}

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
  z-index: 10001;
}

/* Mobile */
@media (max-width: 768px) {
  .install-icon img {
    width: 36px;
    height: 36px;
  }
  
  .install-text h4 {
    font-size: 12px;
  }
  
  .install-text p {
    font-size: 10px;
  }
  
  .install-btn {
    padding: 6px 12px;
    font-size: 11px;
  }
}

/* Bottom Navigation Bar */
.bottom-nav {
  position: fixed !important;
  bottom: 0 !important;
  left: 0 !important;
  right: 0 !important;
  background: rgba(255, 255, 255, 0.98) !important;
  backdrop-filter: blur(20px) !important;
  display: flex !important;
  justify-content: space-around !important;
  align-items: center !important;
  padding: 8px 16px !important;
  margin: 0 !important;
  border-top: 1px solid rgba(93, 255, 114, 0.2) !important;
  z-index: 9999 !important;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.05) !important;
  height: auto !important;
  min-height: 60px !important;
  
  /* Force zero space from bottom */
  margin-bottom: 0 !important;
  padding-bottom: 0 !important;
  bottom: -1px !important;
  left: -1px !important;
  right: -1px !important;
  width: calc(100% + 2px) !important;
  
  /* Additional force */
  transform: translateY(0) !important;
  top: auto !important;
  max-height: 70px !important;
}

/* Remove any white space at the bottom of the page */
html, body {
  margin: 0 !important;
  padding: 0 !important;
  height: 100%;
  overflow-x: hidden;
}

/* Ensure the last content doesn't create space */
#app {
  margin: 0;
  padding: 0;
  min-height: 100vh;
  position: relative;
}

/* Add padding to the last container to prevent content hiding behind nav */
.container {
  padding-bottom: 70px !important;
  margin-bottom: 0 !important;
}

/* Force remove safe area insets on iOS */
@supports (padding-bottom: env(safe-area-inset-bottom)) {
  .bottom-nav {
    padding-bottom: 0 !important;
    padding-top: 8px !important;
  }
}

@supports (padding: max(0px)) {
  .bottom-nav {
    padding-bottom: 0 !important;
    padding-left: max(16px, env(safe-area-inset-left)) !important;
    padding-right: max(16px, env(safe-area-inset-right)) !important;
  }
}

/* For very tall screens or specific devices */
@media screen and (min-height: 800px) {
  .bottom-nav {
    position: fixed !important;
    bottom: 0 !important;
  }
}

/* For Android devices with navigation bar */
@media (max-width: 768px) {
  .bottom-nav {
    min-height: 55px !important;
    padding: 6px 12px !important;
  }
  
  .container {
    padding-bottom: 65px !important;
  }
}

/* For iOS devices */
@supports (-webkit-touch-callout: none) {
  .bottom-nav {
    bottom: 0 !important;
    padding-bottom: 0 !important;
  }
}

/* Force remove any extra spacing from parent elements */
body, html, #app, .page-wrapper, .container, .shopping-lists-container {
  margin-bottom: 0 !important;
  padding-bottom: 0 !important;
}

/* Create space for the nav without extra bottom space */
.page-wrapper::after {
  content: '';
  display: block;
  height: 60px;
  width: 100%;
  margin-bottom: 0 !important;
  padding-bottom: 0 !important;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 6px 12px 8px;
  border-radius: 40px;
  transition: all 0.3s ease;
}

.nav-icon {
  width: 22px;
  height: 22px;
  color: #999;
}

.nav-label {
  font-size: 11px;
  font-weight: 500;
  color: #999;
}

.nav-item.active .nav-icon {
  color: #5DFF72;
}

.nav-item.active .nav-label {
  color: #5DFF72;
}

body, html {
  margin: 0 !important;
  padding: 0 !important;
  height: 100%;
}

.container {
  padding-bottom: 70px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Dark Mode for Bottom Navigation Bar */
.dark-mode .bottom-nav,
#app.dark-mode .bottom-nav {
  background: rgba(26, 26, 26, 0.98) !important;
  border-top: 1px solid rgba(93, 255, 114, 0.25) !important;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.3) !important;
}

.dark-mode .nav-icon,
#app.dark-mode .nav-icon {
  color: #888 !important;
}

.dark-mode .nav-label,
#app.dark-mode .nav-label {
  color: #888 !important;
}

.dark-mode .nav-item.active .nav-icon,
#app.dark-mode .nav-item.active .nav-icon {
  color: #5DFF72 !important;
  filter: drop-shadow(0 0 4px rgba(93, 255, 114, 0.5));
}

.dark-mode .nav-item.active .nav-label,
#app.dark-mode .nav-item.active .nav-label {
  color: #5DFF72 !important;
}

.dark-mode .nav-item:hover .nav-icon,
#app.dark-mode .nav-item:hover .nav-icon {
  color: #5DFF72 !important;
}

.dark-mode .nav-item:hover .nav-label,
#app.dark-mode .nav-item:hover .nav-label {
  color: #5DFF72 !important;
}

.dark-mode .ripple,
#app.dark-mode .ripple {
  background: rgba(93, 255, 114, 0.3) !important;
}

.dark-mode .nav-item.active::before,
#app.dark-mode .nav-item.active::before {
  background: #5DFF72 !important;
  box-shadow: 0 0 8px rgba(93, 255, 114, 0.8) !important;
}
</style>