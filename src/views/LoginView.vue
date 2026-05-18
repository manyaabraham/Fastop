<template>
  <div class="login-page">
    <!-- Animated Background Elements -->
    <div class="animated-bg">
      <div class="floating-orbs">
        <div v-for="i in 8" :key="i" class="orb" :style="getOrbStyle(i)"></div>
      </div>
      <div class="floating-lines">
        <div v-for="i in 12" :key="i" class="line" :style="getLineStyle(i)"></div>
      </div>
      <div class="particles">
        <div v-for="i in 50" :key="i" class="particle" :style="getParticleStyle(i)"></div>
      </div>
    </div>

    <div class="login-container">
      <!-- Header with Logo and Title - Left aligned -->
      <div class="header-section animate-header">
        <div class="logo-wrapper animate-logo">
          <img 
            v-if="logoUrl" 
            :src="logoUrl" 
            alt="Fastop Logo" 
            class="logo"
          />
          <div class="logo-glow"></div>
        </div>
        <div class="title-wrapper">
          <h1 class="app-title">
            <span class="word">Fastop</span>
          </h1>
          <p class="app-subtitle">Smart shopping & Fast packing</p>
        </div>
      </div>

      <!-- Login Form -->
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group animate-input" style="animation-delay: 0.1s">
          <label class="form-label">
            <svg class="label-icon" viewBox="0 0 24 24" fill="none">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" stroke-width="2"/>
              <polyline points="22,6 12,13 2,6" stroke="currentColor" stroke-width="2"/>
            </svg>
            User Email
          </label>
          <div class="input-wrapper">
            <input 
              v-model="email" 
              type="email" 
              class="input-field"
              placeholder="abraham@example.com"
              required
              autocomplete="email"
            />
            <div class="input-focus-effect"></div>
          </div>
        </div>
        
        <div class="form-group animate-input" style="animation-delay: 0.2s">
          <label class="form-label">
            <svg class="label-icon" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" stroke-width="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" stroke-width="2"/>
            </svg>
            Password
          </label>
          <div class="input-wrapper">
            <input 
              v-model="password" 
              :type="showPassword ? 'text' : 'password'" 
              class="input-field"
              placeholder="Enter your password"
              required
              autocomplete="current-password"
            />
            <button type="button" class="password-toggle" @click="showPassword = !showPassword">
              <svg v-if="!showPassword" viewBox="0 0 24 24" fill="none">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" stroke-width="2"/>
                <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
              </svg>
              <svg v-else viewBox="0 0 24 24" fill="none">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" stroke="currentColor" stroke-width="2"/>
                <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" stroke-width="2"/>
              </svg>
            </button>
            <div class="input-focus-effect"></div>
          </div>
        </div>
        
        <button type="submit" class="btn-primary animate-button" :disabled="loading" style="animation-delay: 0.3s">
          <span v-if="loading" class="button-loader"></span>
          <span v-else class="button-text">
            Login to Fastop
            <svg class="button-icon" viewBox="0 0 24 24" fill="none">
              <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" stroke-width="2"/>
              <polyline points="12 5 19 12 12 19" stroke="currentColor" stroke-width="2"/>
            </svg>
          </span>
        </button>
      </form>

      <div class="divider animate-divider" style="animation-delay: 0.35s">
        <span>New to Fastop?</span>
      </div>

      <div class="signup-prompt animate-prompt" style="animation-delay: 0.4s">
        <button @click="goToSignup" class="signup-button">
          Create New Account
          <svg class="arrow-icon" viewBox="0 0 24 24" fill="none">
            <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" stroke-width="2"/>
            <polyline points="12 5 19 12 12 19" stroke="currentColor" stroke-width="2"/>
          </svg>
        </button>
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
    </div>
    <div class="notification-text">
      <strong>{{ notificationTitle }}</strong>
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { supabase } from '../supabase/client'

const authStore = useAuthStore()
const router = useRouter()
const logoUrl = '/logo.png'

const email = ref('')
const password = ref('')
const loading = ref(false)
const showPassword = ref(false)

const handleLogin = async () => {
  if (!email.value || !password.value) {
    showNotificationMessage('Please enter email and password', 'Missing Information', 'error')
    return
  }
  
  loading.value = true
  
  try {
    // Sign in with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value
    })
    
    if (error) throw error
    
    if (data.user) {
      // Check if user is admin
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', data.user.id)
        .single()
      
      const isAdmin = profile?.is_admin === true
      
      // Store admin status in session
      sessionStorage.setItem('is_admin', isAdmin)
      
      showNotificationMessage('Login successful! Redirecting...', 'Welcome Back!', 'success')
      
      // Redirect based on role
      setTimeout(() => {
        if (isAdmin) {
          router.push('/admin')
        } else {
          router.push('/splash')
        }
      }, 1500)
    }
  } catch (error) {
    console.error('Login error:', error)
    showNotificationMessage(error.message || 'Invalid email or password', 'Login Failed', 'error')
  } finally {
    loading.value = false
  }
}

// Notification system
const showNotification = ref(false)
const notificationMessage = ref('')
const notificationTitle = ref('')
const notificationType = ref('success')
let notificationTimeout = null

const showNotificationMessage = (message, title, type) => {
  notificationMessage.value = message
  notificationTitle.value = title
  notificationType.value = type
  showNotification.value = true
  
  if (notificationTimeout) clearTimeout(notificationTimeout)
  notificationTimeout = setTimeout(() => {
    showNotification.value = false
  }, 3000)
}

const goToSignup = () => {
  router.push('/signup')
}

const getOrbStyle = (i) => {
  return {
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    width: `${Math.random() * 300 + 100}px`,
    height: `${Math.random() * 300 + 100}px`,
    animationDelay: `${Math.random() * 5}s`,
    animationDuration: `${Math.random() * 15 + 10}s`,
    background: `radial-gradient(circle, rgba(93, 255, 114, ${Math.random() * 0.15 + 0.05}), transparent)`
  }
}

const getLineStyle = (i) => {
  return {
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    width: `${Math.random() * 50 + 20}px`,
    animationDelay: `${Math.random() * 3}s`,
    animationDuration: `${Math.random() * 8 + 4}s`,
    transform: `rotate(${Math.random() * 360}deg)`
  }
}

const getParticleStyle = (i) => {
  return {
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    animationDelay: `${Math.random() * 5}s`,
    animationDuration: `${Math.random() * 10 + 5}s`,
    width: `${Math.random() * 3 + 1}px`,
    height: `${Math.random() * 3 + 1}px`
  }
}
</script>

<style scoped>
.login-page {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  height: 100dvh;
  background: linear-gradient(135deg, #FFFFFF 0%, #F8F9FA 100%);
  overflow: hidden;
  margin: 0;
  z-index: 1;
}

/* Animated Background */
.animated-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
}

.floating-orbs .orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  animation: floatOrb 12s ease-in-out infinite;
}

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
}

.notification-toast.error {
  border-left-color: #ff4444;
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

.notification-text strong {
  display: block;
  font-size: 14px;
  margin-bottom: 4px;
  color: #1A1A1A;
}

.notification-text p {
  font-size: 12px;
  color: #6C757D;
  margin: 0;
}

.notification-close {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 8px;
}

.notification-close svg {
  width: 14px;
  height: 14px;
  color: #ADB5BD;
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

.dark-mode .notification-toast {
  background: #2A2A2A;
}

.dark-mode .notification-text strong {
  color: #FFFFFF;
}

.dark-mode .notification-text p {
  color: #ADB5BD;
}

@keyframes floatOrb {
  0%, 100% {
    transform: translate(0, 0) scale(1);
    opacity: 0.3;
  }
  50% {
    transform: translate(30px, -30px) scale(1.2);
    opacity: 0.6;
  }
}

.floating-lines .line {
  position: absolute;
  height: 2px;
  background: linear-gradient(90deg, transparent, #5DFF72, transparent);
  animation: lineMove 6s ease-in-out infinite;
  opacity: 0.3;
}

@keyframes lineMove {
  0%, 100% {
    transform: translateX(-100%) scaleX(0);
    opacity: 0;
  }
  50% {
    transform: translateX(0) scaleX(1);
    opacity: 0.5;
  }
}

.particles .particle {
  position: absolute;
  background: linear-gradient(135deg, #5DFF72, #34D399);
  border-radius: 50%;
  opacity: 0;
  animation: particleFloat 8s ease-in-out infinite;
}

@keyframes particleFloat {
  0% {
    opacity: 0;
    transform: translateY(0) translateX(0) rotate(0deg);
  }
  20% {
    opacity: 0.6;
  }
  80% {
    opacity: 0.4;
  }
  100% {
    opacity: 0;
    transform: translateY(-100px) translateX(50px) rotate(360deg);
  }
}

/* Container */
.login-container {
  position: relative;
  max-width: 500px;
  width: 90%;
  margin: 0 auto;
  padding: 60px 20px;
  z-index: 2;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

/* Header Section - Logo Left Side */
.header-section {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 50px;
  animation: slideInLeft 0.6s ease-out;
}

@keyframes slideInLeft {
  0% {
    opacity: 0;
    transform: translateX(-50px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

.logo-wrapper {
  position: relative;
  width: 70px;
  height: 70px;
  flex-shrink: 0;
  animation: logoScale 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

@keyframes logoScale {
  0% {
    transform: scale(0) rotate(-180deg);
    opacity: 0;
  }
  100% {
    transform: scale(1) rotate(0);
    opacity: 1;
  }
}

.logo {
  width: 100%;
  height: 100%;
  border-radius: 18px;
  box-shadow: 0 10px 30px rgba(93, 255, 114, 0.2);
  position: relative;
  z-index: 2;
  animation: logoPulse 2s ease-in-out infinite;
}

@keyframes logoPulse {
  0%, 100% {
    box-shadow: 0 10px 30px rgba(93, 255, 114, 0.2);
  }
  50% {
    box-shadow: 0 10px 50px rgba(93, 255, 114, 0.5);
  }
}

.logo-glow {
  position: absolute;
  top: -8px;
  left: -8px;
  right: -8px;
  bottom: -8px;
  background: radial-gradient(circle, rgba(93, 255, 114, 0.3), transparent);
  border-radius: 26px;
  animation: glowExpand 2s ease-in-out infinite;
}

@keyframes glowExpand {
  0%, 100% {
    opacity: 0.5;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.1);
  }
}

.title-wrapper {
  flex: 1;
}

.app-title {
  font-size: 36px;
  font-family: 'Montserrat Alternates', sans-serif;
  font-weight: 800;
  margin-bottom: 8px;
}

.word {
  background: linear-gradient(135deg, #5DFF72 0%, #34D399 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  position: relative;
  display: inline-block;
  animation: textReveal 0.8s ease-out;
}

@keyframes textReveal {
  0% {
    opacity: 0;
    transform: translateX(-20px);
    letter-spacing: -5px;
  }
  100% {
    opacity: 1;
    transform: translateX(0);
    letter-spacing: normal;
  }
}

.app-subtitle {
  color: #6C757D;
  font-size: 14px;
  font-weight: 500;
  animation: fadeInUp 0.6s ease-out 0.2s backwards;
}

@keyframes fadeInUp {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Form Styles - No Card Border */
.login-form {
  margin-bottom: 30px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 25px;
}

.animate-input {
  animation: slideInRight 0.5s ease-out backwards;
}

@keyframes slideInRight {
  0% {
    opacity: 0;
    transform: translateX(30px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

.form-label {
  font-size: 14px;
  font-weight: 600;
  color: #495057;
  display: flex;
  align-items: center;
  gap: 8px;
}

.label-icon {
  width: 18px;
  height: 18px;
  color: #5DFF72;
}

.input-wrapper {
  position: relative;
}

.input-field {
  width: 100%;
  padding: 14px 18px;
  background: rgba(255, 255, 255, 0.9);
  border: 2px solid #E9ECEF;
  border-radius: 18px;
  color: #1A1A1A;
  font-family: 'Poppins', sans-serif;
  font-size: 16px;
  transition: all 0.3s ease;
}

.input-field:focus {
  outline: none;
  border-color: #5DFF72;
  background: #FFFFFF;
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(93, 255, 114, 0.1);
}

.input-focus-effect {
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, #5DFF72, #34D399);
  transition: all 0.3s ease;
  transform: translateX(-50%);
}

.input-field:focus ~ .input-focus-effect {
  width: calc(100% - 20px);
  animation: focusLine 0.5s ease;
}

@keyframes focusLine {
  0% {
    width: 0;
    opacity: 0;
  }
  100% {
    width: calc(100% - 20px);
    opacity: 1;
  }
}

.password-toggle {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.password-toggle svg {
  width: 20px;
  height: 20px;
  color: #999;
  transition: color 0.3s;
}

.password-toggle:hover svg {
  color: #5DFF72;
}

/* Button */
.animate-button {
  animation: buttonBounce 0.5s ease-out backwards;
}

@keyframes buttonBounce {
  0% {
    opacity: 0;
    transform: scale(0.8);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

.btn-primary {
  width: 100%;
  background: linear-gradient(135deg, #5DFF72 0%, #34D399 100%);
  color: #0B0B0B;
  font-weight: 700;
  padding: 14px 28px;
  border: none;
  border-radius: 40px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  font-family: 'Poppins', sans-serif;
  font-size: 16px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(93, 255, 114, 0.3);
}

.btn-primary::before {
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

.btn-primary:active::before {
  width: 300px;
  height: 300px;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(93, 255, 114, 0.5);
}

.button-text {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  justify-content: center;
}

.button-icon {
  width: 18px;
  height: 18px;
  transition: transform 0.3s;
}

.btn-primary:hover .button-icon {
  transform: translateX(5px);
}

.button-loader {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2px solid rgba(11, 11, 11, 0.3);
  border-top-color: #0B0B0B;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Divider */
.animate-divider {
  animation: fadeInScale 0.5s ease-out backwards;
}

@keyframes fadeInScale {
  0% {
    opacity: 0;
    transform: scale(0.9);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

.divider {
  text-align: center;
  margin: 20px 0;
  position: relative;
}

.divider::before,
.divider::after {
  content: '';
  position: absolute;
  top: 50%;
  width: calc(50% - 70px);
  height: 1px;
  background: linear-gradient(90deg, transparent, #E0E0E0, transparent);
}

.divider::before {
  left: 0;
}

.divider::after {
  right: 0;
}

.divider span {
  background: transparent;
  padding: 0 15px;
  color: #999;
  font-size: 13px;
}

/* Signup Button */
.animate-prompt {
  animation: fadeInUp 0.5s ease-out backwards;
}

.signup-prompt {
  text-align: center;
}

.signup-button {
  background: none;
  border: 2px solid #5DFF72;
  color: #5DFF72;
  padding: 12px 24px;
  border-radius: 40px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(93, 255, 114, 0.05);
  width: 100%;
  justify-content: center;
}

.signup-button:hover {
  background: #5DFF72;
  color: #0B0B0B;
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(93, 255, 114, 0.3);
}

.signup-button:hover .arrow-icon {
  transform: translateX(5px);
}

.arrow-icon {
  width: 18px;
  height: 18px;
  transition: transform 0.3s;
}

/* Responsive */
@media (max-width: 600px) {
  .login-container {
    padding: 40px 20px;
  }
  
  .header-section {
    gap: 15px;
    margin-bottom: 40px;
  }
  
  .logo-wrapper {
    width: 55px;
    height: 55px;
  }
  
  .app-title {
    font-size: 28px;
  }
  
  .app-subtitle {
    font-size: 12px;
  }
}
</style>