<template>
  <div class="download-page">
    <div class="container">
      <div class="logo-section">
        <img src="/logo.png" alt="Fastop" class="logo" />
        <h1>Fastop</h1>
        <p>Install the app for better experience</p>
      </div>
      
      <button @click="installApp" class="install-btn">
        Install Fastop App
      </button>
      
      <div class="instructions">
        <p>Or open in browser to continue</p>
        <button @click="continueToApp" class="continue-btn">
          Continue in Browser
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const installApp = () => {
  if (window.deferredPrompt) {
    window.deferredPrompt.prompt()
    window.deferredPrompt.userChoice.then(() => {
      window.deferredPrompt = null
    })
  }
}

const continueToApp = () => {
  router.push('/login')
}
</script>

<style scoped>
.download-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #0B0B0B, #1A1A1A);
  display: flex;
  align-items: center;
  justify-content: center;
}

.container {
  text-align: center;
  padding: 40px;
}

.logo {
  width: 100px;
  height: 100px;
  border-radius: 24px;
  margin-bottom: 20px;
}

h1 {
  font-size: 48px;
  background: linear-gradient(135deg, #5DFF72, #34D399);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  margin-bottom: 10px;
}

p {
  color: #ADB5BD;
  margin-bottom: 30px;
}

.install-btn {
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, #5DFF72, #34D399);
  border: none;
  border-radius: 60px;
  font-weight: 700;
  font-size: 16px;
  color: #0B0B0B;
  cursor: pointer;
  margin-bottom: 20px;
}

.continue-btn {
  background: transparent;
  border: 1px solid #5DFF72;
  color: #5DFF72;
  padding: 12px 24px;
  border-radius: 60px;
  cursor: pointer;
}
</style>