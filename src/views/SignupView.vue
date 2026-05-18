<template>
  <div class="signup-page">
    <!-- Animated Background Elements -->
    <div class="animated-bg">
      <div class="floating-waves">
        <div class="wave wave1"></div>
        <div class="wave wave2"></div>
        <div class="wave wave3"></div>
      </div>
      <div class="floating-dots">
        <div v-for="i in 30" :key="i" class="dot" :style="getDotStyle(i)"></div>
      </div>
      <div class="sparkles">
        <div v-for="i in 40" :key="i" class="sparkle" :style="getSparkleStyle(i)"></div>
      </div>
    </div>

    <div class="signup-container">
      <!-- Header with Logo and Title - Left aligned -->
      <div class="header-section animate-header">
        <div class="logo-wrapper animate-logo">
          <img 
            v-if="logoUrl" 
            :src="logoUrl" 
            alt="Fastop Logo" 
            class="logo"
          />
          <div class="logo-pulse"></div>
        </div>
        <div class="title-wrapper">
          <h1 class="app-title">
            <span class="word">Create Account</span>
          </h1>
          <p class="app-subtitle">Join Fastop and organize your school supplies</p>
        </div>
      </div>

      <!-- Signup Form -->
      <form @submit.prevent="handleSignup" class="signup-form">
        <div class="form-group animate-left" style="animation-delay: 0.05s">
          <label class="form-label">
            <svg class="label-icon" viewBox="0 0 24 24" fill="none">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" stroke-width="2"/>
              <circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="2"/>
            </svg>
            Full Name
          </label>
          <div class="input-wrapper">
            <input 
              v-model="fullName" 
              type="text" 
              class="input-field"
              placeholder="John Abraham "
              required
            />
            <div class="input-ripple"></div>
          </div>
        </div>

        <div class="form-group animate-right" style="animation-delay: 0.1s">
          <label class="form-label">
            <svg class="label-icon" viewBox="0 0 24 24" fill="none">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" stroke-width="2"/>
              <polyline points="22,6 12,13 2,6" stroke="currentColor" stroke-width="2"/>
            </svg>
            Email Address
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
            <div class="input-ripple"></div>
          </div>
        </div>
        
        <div class="form-group animate-left" style="animation-delay: 0.15s">
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
              placeholder="Create a strong password"
              required
              autocomplete="new-password"
              @input="checkPasswordStrength"
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
            <div class="input-ripple"></div>
          </div>
          <div class="password-strength" v-if="password">
            <div class="strength-bar" :class="strengthClass"></div>
            <span class="strength-text">{{ strengthText }}</span>
          </div>
        </div>

        <div class="form-group animate-right" style="animation-delay: 0.2s">
          <label class="form-label">
            <svg class="label-icon" viewBox="0 0 24 24" fill="none">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" stroke-width="2"/>
              <polyline points="22,6 12,13 2,6" stroke="currentColor" stroke-width="2"/>
            </svg>
            Confirm Password
          </label>
          <div class="input-wrapper">
            <input 
              v-model="confirmPassword" 
              :type="showConfirmPassword ? 'text' : 'password'" 
              class="input-field"
              placeholder="Confirm your password"
              required
            />
            <button type="button" class="password-toggle" @click="showConfirmPassword = !showConfirmPassword">
              <svg v-if="!showConfirmPassword" viewBox="0 0 24 24" fill="none">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" stroke-width="2"/>
                <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
              </svg>
              <svg v-else viewBox="0 0 24 24" fill="none">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" stroke="currentColor" stroke-width="2"/>
                <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" stroke-width="2"/>
              </svg>
            </button>
            <div class="input-ripple"></div>
          </div>
          <div v-if="confirmPassword && password !== confirmPassword" class="password-error">
            <svg viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
              <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" stroke-width="2"/>
              <circle cx="12" cy="16" r="1" fill="currentColor"/>
            </svg>
            Passwords do not match
          </div>
        </div>
        
        <button type="submit" class="btn-primary animate-bounce" :disabled="loading" style="animation-delay: 0.25s">
          <span v-if="loading" class="button-loader"></span>
          <span v-else class="button-text">
            Create Account
            <svg class="button-icon" viewBox="0 0 24 24" fill="none">
              <path d="M19 10l-7-7-7 7" stroke="currentColor" stroke-width="2"/>
              <line x1="12" y1="3" x2="12" y2="21" stroke="currentColor" stroke-width="2"/>
            </svg>
          </span>
        </button>
      </form>

      <div class="divider animate-divider" style="animation-delay: 0.3s">
        <span>Already a member?</span>
      </div>

      <div class="login-prompt animate-prompt" style="animation-delay: 0.35s">
        <button @click="goToLogin" class="login-button">
          <svg class="back-icon" viewBox="0 0 24 24" fill="none">
            <line x1="19" y1="12" x2="5" y2="12" stroke="currentColor" stroke-width="2"/>
            <polyline points="12 5 5 12 12 19" stroke="currentColor" stroke-width="2"/>
          </svg>
          Back to Login
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
const router = useRouter()
const logoUrl = '/logo.png'

const fullName = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const showPassword = ref(false)
const showConfirmPassword = ref(false)

const strengthClass = computed(() => {
  const pass = password.value
  if (pass.length < 6) return 'weak'
  if (pass.length < 10) return 'medium'
  return 'strong'
})

const strengthText = computed(() => {
  const pass = password.value
  if (pass.length < 6) return 'Weak password'
  if (pass.length < 10) return 'Medium password'
  return 'Strong password!'
})

const checkPasswordStrength = () => {}

const handleSignup = async () => {
  if (!fullName.value.trim()) {
    alert('Please enter your full name')
    return
  }
  
  if (password.value !== confirmPassword.value) {
    alert('Passwords do not match!')
    return
  }
  
  if (password.value.length < 6) {
    alert('Password must be at least 6 characters')
    return
  }
  
  loading.value = true
  const result = await authStore.signUp(email.value, password.value)
  if (result.success) {
    alert('Account created successfully! Please login.')
    router.push('/login')
  } else {
    alert(result.error)
  }
  loading.value = false
}

const goToLogin = () => {
  router.push('/login')
}

const getDotStyle = (i) => {
  return {
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    animationDelay: `${Math.random() * 5}s`,
    animationDuration: `${Math.random() * 8 + 4}s`,
    width: `${Math.random() * 4 + 2}px`,
    height: `${Math.random() * 4 + 2}px`
  }
}

const getSparkleStyle = (i) => {
  return {
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    animationDelay: `${Math.random() * 3}s`,
    animationDuration: `${Math.random() * 2 + 1}s`,
    width: `${Math.random() * 2 + 1}px`,
    height: `${Math.random() * 2 + 1}px`
  }
}
</script>

<style scoped>
.signup-page {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  height: 100dvh;
  background: linear-gradient(135deg, #FFFFFF 0%, #F8F9FA 100%);
  overflow-y: auto;
  overflow-x: hidden;
  margin: 0;
  z-index: 1;
}

/* Animated Background */
.animated-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
}

.floating-waves {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.wave {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 200px;
  background: linear-gradient(90deg, #5DFF72, #34D399);
  opacity: 0.05;
  border-radius: 100% 100% 0 0;
}

.wave1 {
  animation: waveMove 10s linear infinite;
  bottom: -50px;
}

.wave2 {
  animation: waveMove 8s linear infinite reverse;
  bottom: -30px;
  opacity: 0.03;
}

.wave3 {
  animation: waveMove 12s linear infinite;
  bottom: -70px;
  opacity: 0.02;
}

@keyframes waveMove {
  0% {
    transform: translateX(0) translateY(0);
  }
  50% {
    transform: translateX(-25%) translateY(-10px);
  }
  100% {
    transform: translateX(-50%) translateY(0);
  }
}

.floating-dots .dot {
  position: absolute;
  background: linear-gradient(135deg, #5DFF72, #34D399);
  border-radius: 50%;
  opacity: 0;
  animation: dotFloat 6s ease-in-out infinite;
}

@keyframes dotFloat {
  0% {
    opacity: 0;
    transform: translateY(0) scale(0);
  }
  50% {
    opacity: 0.4;
    transform: translateY(-30px) scale(1);
  }
  100% {
    opacity: 0;
    transform: translateY(-60px) scale(0);
  }
}

.sparkles .sparkle {
  position: absolute;
  background: #5DFF72;
  border-radius: 50%;
  opacity: 0;
  animation: sparkle 2s ease-in-out infinite;
}

@keyframes sparkle {
  0%, 100% {
    opacity: 0;
    transform: scale(0);
  }
  50% {
    opacity: 1;
    transform: scale(1);
    box-shadow: 0 0 10px #5DFF72;
  }
}

/* Container */
.signup-container {
  position: relative;
  max-width: 550px;
  width: 90%;
  margin: 0 auto;
  padding: 40px 20px;
  z-index: 2;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

/* Header Section */
.header-section {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 40px;
  animation: slideInRight 0.6s ease-out;
}

@keyframes slideInRight {
  0% {
    opacity: 0;
    transform: translateX(50px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

.logo-wrapper {
  position: relative;
  width: 65px;
  height: 65px;
  flex-shrink: 0;
  animation: logoReveal 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

@keyframes logoReveal {
  0% {
    transform: scale(0) rotate(180deg);
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
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(93, 255, 114, 0.2);
  position: relative;
  z-index: 2;
}

.logo-pulse {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, rgba(93, 255, 114, 0.4), transparent);
  border-radius: 50%;
  animation: pulseRing 2s ease-out infinite;
}

@keyframes pulseRing {
  0% {
    width: 100%;
    height: 100%;
    opacity: 0.5;
  }
  100% {
    width: 200%;
    height: 200%;
    opacity: 0;
  }
}

.title-wrapper {
  flex: 1;
}

.app-title {
  font-size: 32px;
  font-family: 'Montserrat Alternates', sans-serif;
  font-weight: 800;
  margin-bottom: 8px;
}

.word {
  background: linear-gradient(135deg, #5DFF72, #34D399);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: textGlow 2s ease-in-out infinite;
}

@keyframes textGlow {
  0%, 100% {
    text-shadow: 0 0 0px rgba(93, 255, 114, 0);
  }
  50% {
    text-shadow: 0 0 10px rgba(93, 255, 114, 0.3);
  }
}

.app-subtitle {
  color: #6C757D;
  font-size: 13px;
  font-weight: 500;
  animation: fadeSlideUp 0.6s ease-out 0.2s backwards;
}

@keyframes fadeSlideUp {
  0% {
    opacity: 0;
    transform: translateY(15px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Form Styles */
.signup-form {
  margin-bottom: 25px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 20px;
}

.animate-left {
  animation: slideFromLeft 0.5s ease-out backwards;
}

.animate-right {
  animation: slideFromRight 0.5s ease-out backwards;
}

@keyframes slideFromLeft {
  0% {
    opacity: 0;
    transform: translateX(-30px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideFromRight {
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
  font-size: 13px;
  font-weight: 600;
  color: #495057;
  display: flex;
  align-items: center;
  gap: 6px;
}

.label-icon {
  width: 16px;
  height: 16px;
  color: #5DFF72;
}

.input-wrapper {
  position: relative;
}

.input-field {
  width: 100%;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.9);
  border: 2px solid #E9ECEF;
  border-radius: 16px;
  color: #1A1A1A;
  font-family: 'Poppins', sans-serif;
  font-size: 14px;
  transition: all 0.3s ease;
}

.input-field:focus {
  outline: none;
  border-color: #5DFF72;
  background: #FFFFFF;
  transform: translateX(4px);
  box-shadow: 0 5px 15px rgba(93, 255, 114, 0.1);
}

.input-ripple {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, #5DFF72, #34D399);
  transition: width 0.3s ease;
}

.input-field:focus ~ .input-ripple {
  width: 100%;
  animation: rippleExpand 0.4s ease;
}

@keyframes rippleExpand {
  0% {
    width: 0;
    opacity: 0;
  }
  100% {
    width: 100%;
    opacity: 1;
  }
}

.password-toggle {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.password-toggle svg {
  width: 18px;
  height: 18px;
  color: #999;
  transition: color 0.3s;
}

.password-toggle:hover svg {
  color: #5DFF72;
}

/* Password Strength */
.password-strength {
  margin-top: 8px;
}

.strength-bar {
  height: 3px;
  border-radius: 3px;
  transition: all 0.3s;
  margin-bottom: 4px;
}

.strength-bar.weak {
  width: 33%;
  background: #ff4444;
  animation: strengthGrow 0.5s ease;
}

.strength-bar.medium {
  width: 66%;
  background: #ffbb33;
  animation: strengthGrow 0.5s ease;
}

.strength-bar.strong {
  width: 100%;
  background: #5DFF72;
  animation: strengthGrow 0.5s ease;
}

@keyframes strengthGrow {
  0% {
    width: 0;
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

.strength-text {
  font-size: 11px;
  color: #999;
}

.password-error {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 8px;
  font-size: 12px;
  color: #ff4444;
  animation: shakeError 0.4s ease;
}

.password-error svg {
  width: 14px;
  height: 14px;
}

@keyframes shakeError {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-4px); }
  75% { transform: translateX(4px); }
}

/* Button */
.animate-bounce {
  animation: bounceScale 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) backwards;
}

@keyframes bounceScale {
  0% {
    opacity: 0;
    transform: scale(0.7);
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
  background: linear-gradient(135deg, #5DFF72, #34D399);
  color: #0B0B0B;
  font-weight: 700;
  padding: 12px 24px;
  border: none;
  border-radius: 40px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'Poppins', sans-serif;
  font-size: 15px;
  margin-top: 10px;
  position: relative;
  overflow: hidden;
}

.btn-primary::after {
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

.btn-primary:active::after {
  width: 300px;
  height: 300px;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(93, 255, 114, 0.4);
}

.button-text {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  justify-content: center;
}

.button-icon {
  width: 16px;
  height: 16px;
  transition: transform 0.3s;
}

.btn-primary:hover .button-icon {
  transform: translateY(3px);
}

.button-loader {
  display: inline-block;
  width: 18px;
  height: 18px;
  border: 2px solid rgba(11, 11, 11, 0.3);
  border-top-color: #0B0B0B;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

/* Divider */
.animate-divider {
  animation: fadeInCenter 0.5s ease-out backwards;
}

@keyframes fadeInCenter {
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
  margin: 20px 0 18px;
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
  font-size: 12px;
}

/* Login Button */
.animate-prompt {
  animation: fadeUp 0.5s ease-out backwards;
}

@keyframes fadeUp {
  0% {
    opacity: 0;
    transform: translateY(15px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.login-prompt {
  text-align: center;
}

.login-button {
  background: none;
  border: 2px solid #E0E0E0;
  color: #666;
  padding: 10px 20px;
  border-radius: 40px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  justify-content: center;
}

.login-button:hover {
  border-color: #5DFF72;
  color: #5DFF72;
  transform: translateX(-5px);
}

.back-icon {
  width: 16px;
  height: 16px;
  transition: transform 0.3s;
}

.login-button:hover .back-icon {
  transform: translateX(-3px);
}

/* Scrollbar */
.signup-page::-webkit-scrollbar {
  width: 4px;
}

.signup-page::-webkit-scrollbar-track {
  background: #F0F0F0;
}

.signup-page::-webkit-scrollbar-thumb {
  background: #5DFF72;
  border-radius: 10px;
}

/* Responsive */
@media (max-width: 600px) {
  .signup-container {
    padding: 30px 20px;
  }
  
  .header-section {
    gap: 15px;
    margin-bottom: 30px;
  }
  
  .logo-wrapper {
    width: 50px;
    height: 50px;
  }
  
  .app-title {
    font-size: 24px;
  }
  
  .app-subtitle {
    font-size: 11px;
  }
}
</style>