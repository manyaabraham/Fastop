<template>
  <div class="splash-page">
    <div class="animated-bg">
      <div class="orb orb1"></div>
      <div class="orb orb2"></div>
      <div class="orb orb3"></div>
      <div class="particles">
        <div v-for="i in 30" :key="i" class="particle" :style="getParticleStyle(i)"></div>
      </div>
    </div>
    
    <div class="splash-content">
      <div class="logo-wrapper">
        <img src="/logo.png" alt="Fastop Logo" class="logo" />
        <div class="logo-ring"></div>
      </div>
      
      <h1 class="app-name">
        <span class="letter" v-for="(letter, index) in 'Fastop'" :key="index" :style="{ animationDelay: `${index * 0.1}s` }">
          {{ letter }}
        </span>
      </h1>
      
      <p class="tagline">Smart School Supply Management</p>
      
      <div class="loading-container">
        <div class="loading-bar">
          <div class="loading-fill"></div>
        </div>
        <p class="loading-text">{{ loadingText }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../supabase/client'

const router = useRouter()
const loadingText = ref('Loading...')
const messages = ['Loading...', 'Preparing your lists...', 'Almost there...', 'Welcome to Fastop!']

const getParticleStyle = (i) => {
  return {
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    animationDelay: `${Math.random() * 5}s`,
    animationDuration: `${Math.random() * 10 + 5}s`
  }
}

onMounted(() => {
  let messageIndex = 0
  
  const messageInterval = setInterval(() => {
    messageIndex++
    if (messageIndex < messages.length) {
      loadingText.value = messages[messageIndex]
    }
  }, 800)
  
  // After splash screen, go to appropriate page
  setTimeout(async () => {
    clearInterval(messageInterval)
    
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user) {
      router.push('/dashboard')
    } else {
      router.push('/login')
    }
  }, 2800)
})
</script>

<style scoped>
.splash-page {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #0B0B0B 0%, #1A1A1A 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  z-index: 9999;
}

.animated-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  opacity: 0.3;
  animation: float 8s ease infinite;
}

.orb1 {
  top: 10%;
  left: -10%;
  width: 300px;
  height: 300px;
  background: #5DFF72;
}

.orb2 {
  bottom: 20%;
  right: -10%;
  width: 400px;
  height: 400px;
  background: #34D399;
  animation-delay: 2s;
}

.orb3 {
  top: 50%;
  left: 20%;
  width: 250px;
  height: 250px;
  background: #60A5FA;
  animation-delay: 4s;
}

.particles .particle {
  position: absolute;
  width: 2px;
  height: 2px;
  background: #5DFF72;
  border-radius: 50%;
  opacity: 0;
  animation: particleFloat 8s ease infinite;
}

@keyframes particleFloat {
  0% {
    opacity: 0;
    transform: translateY(0);
  }
  20% {
    opacity: 0.5;
  }
  80% {
    opacity: 0.3;
  }
  100% {
    opacity: 0;
    transform: translateY(-100px);
  }
}

@keyframes float {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(30px, -30px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
}

.splash-content {
  text-align: center;
  z-index: 10;
  animation: fadeInUp 0.8s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.logo-wrapper {
  position: relative;
  width: 120px;
  height: 120px;
  margin: 0 auto 20px;
}

.logo {
  width: 100%;
  height: 100%;
  border-radius: 28px;
  object-fit: cover;
  position: relative;
  z-index: 2;
  animation: logoPop 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

@keyframes logoPop {
  0% {
    transform: scale(0) rotate(-180deg);
    opacity: 0;
  }
  100% {
    transform: scale(1) rotate(0);
    opacity: 1;
  }
}

.logo-ring {
  position: absolute;
  top: -10px;
  left: -10px;
  right: -10px;
  bottom: -10px;
  background: radial-gradient(circle, rgba(93, 255, 114, 0.3), transparent);
  border-radius: 38px;
  animation: pulse 2s ease infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 0.5;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.1);
  }
}

.app-name {
  font-size: 48px;
  font-weight: 800;
  margin-bottom: 10px;
  display: flex;
  justify-content: center;
  gap: 4px;
}

.letter {
  display: inline-block;
  background: linear-gradient(135deg, #5DFF72, #34D399);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: letterBounce 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) backwards;
}

@keyframes letterBounce {
  0% {
    transform: translateY(-50px) rotateX(-90deg);
    opacity: 0;
  }
  100% {
    transform: translateY(0) rotateX(0);
    opacity: 1;
  }
}

.tagline {
  color: #ADB5BD;
  font-size: 14px;
  margin-bottom: 40px;
  animation: fadeIn 0.8s ease-out 0.3s backwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.loading-container {
  width: 200px;
  margin: 0 auto;
}

.loading-bar {
  height: 3px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 10px;
}

.loading-fill {
  height: 100%;
  width: 0%;
  background: linear-gradient(90deg, #5DFF72, #34D399);
  border-radius: 3px;
  animation: loading 2.5s ease-out forwards;
}

@keyframes loading {
  0% { width: 0%; }
  20% { width: 30%; }
  50% { width: 60%; }
  80% { width: 85%; }
  100% { width: 100%; }
}

.loading-text {
  color: #6C757D;
  font-size: 12px;
  text-align: center;
  animation: textPulse 1s ease infinite;
}

@keyframes textPulse {
  0%, 100% { opacity: 0.7; }
  50% { opacity: 1; }
}

/* Disable pointer events on splash screen */
.splash-page {
  pointer-events: none;
}
</style>