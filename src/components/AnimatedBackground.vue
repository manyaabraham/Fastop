<template>
  <div class="animated-bg">
    <!-- Floating Gradient Orbs -->
    <div class="floating-orbs">
      <div v-for="i in 6" :key="`orb-${i}`" class="orb" :style="getOrbStyle(i)"></div>
    </div>
    
    <!-- Floating Circles -->
    <div class="floating-circles">
      <div v-for="i in 12" :key="`circle-${i}`" class="circle" :style="getCircleStyle(i)"></div>
    </div>
    
    <!-- Floating Particles -->
    <div class="floating-particles">
      <div v-for="i in 30" :key="`particle-${i}`" class="particle" :style="getParticleStyle(i)"></div>
    </div>
    
    <!-- Animated Grid Lines -->
    <div class="grid-lines">
      <div v-for="i in 5" :key="`grid-${i}`" class="grid-line" :style="getGridStyle(i)"></div>
    </div>
    
    <!-- Floating Neon Dots -->
    <div class="neon-dots">
      <div v-for="i in 8" :key="`dot-${i}`" class="neon-dot" :style="getDotStyle(i)"></div>
    </div>
  </div>
</template>

<script setup>
const getOrbStyle = (i) => {
  return {
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    width: `${Math.random() * 300 + 100}px`,
    height: `${Math.random() * 300 + 100}px`,
    animationDelay: `${Math.random() * 5}s`,
    animationDuration: `${Math.random() * 15 + 10}s`,
    background: `radial-gradient(circle, rgba(93, 255, 114, ${Math.random() * 0.1 + 0.05}), rgba(52, 211, 153, 0))`
  }
}

const getCircleStyle = (i) => {
  return {
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    width: `${Math.random() * 150 + 30}px`,
    height: `${Math.random() * 150 + 30}px`,
    animationDelay: `${Math.random() * 8}s`,
    animationDuration: `${Math.random() * 20 + 10}s`,
    opacity: Math.random() * 0.15 + 0.05,
    borderColor: `rgba(93, 255, 114, ${Math.random() * 0.3 + 0.1})`
  }
}

const getParticleStyle = (i) => {
  return {
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    width: `${Math.random() * 4 + 1}px`,
    height: `${Math.random() * 4 + 1}px`,
    animationDelay: `${Math.random() * 5}s`,
    animationDuration: `${Math.random() * 10 + 5}s`,
    backgroundColor: `rgba(93, 255, 114, ${Math.random() * 0.5 + 0.2})`
  }
}

const getGridStyle = (i) => {
  return {
    left: `${i * 20}%`,
    width: '1px',
    animationDelay: `${i * 0.5}s`,
    animationDuration: '8s'
  }
}

const getDotStyle = (i) => {
  return {
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    animationDelay: `${Math.random() * 3}s`,
    animationDuration: `${Math.random() * 4 + 2}s`
  }
}
</script>

<style scoped>
.animated-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

/* Floating Orbs */
.floating-orbs .orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(40px);
  animation: floatOrb 12s ease-in-out infinite;
}

@keyframes floatOrb {
  0%, 100% {
    transform: translate(0, 0) scale(1);
    opacity: 0.3;
  }
  25% {
    transform: translate(30px, -30px) scale(1.1);
    opacity: 0.5;
  }
  50% {
    transform: translate(-20px, 20px) scale(0.9);
    opacity: 0.4;
  }
  75% {
    transform: translate(20px, 30px) scale(1.05);
    opacity: 0.45;
  }
}

/* Floating Circles */
.floating-circles .circle {
  position: absolute;
  border-radius: 50%;
  border: 2px solid;
  animation: floatCircle 15s ease-in-out infinite;
}

@keyframes floatCircle {
  0%, 100% {
    transform: translateY(0) translateX(0) rotate(0deg);
  }
  25% {
    transform: translateY(-40px) translateX(20px) rotate(90deg);
  }
  50% {
    transform: translateY(0) translateX(40px) rotate(180deg);
  }
  75% {
    transform: translateY(40px) translateX(20px) rotate(270deg);
  }
}

/* Floating Particles */
.floating-particles .particle {
  position: absolute;
  border-radius: 50%;
  animation: floatParticle 6s ease-in-out infinite;
}

@keyframes floatParticle {
  0% {
    transform: translateY(0) translateX(0);
    opacity: 0;
  }
  25% {
    opacity: 1;
  }
  50% {
    transform: translateY(-60px) translateX(30px);
    opacity: 0.8;
  }
  75% {
    opacity: 0.5;
  }
  100% {
    transform: translateY(-120px) translateX(60px);
    opacity: 0;
  }
}

/* Animated Grid Lines */
.grid-lines {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.grid-line {
  position: absolute;
  top: 0;
  height: 100%;
  background: linear-gradient(to bottom, transparent, rgba(93, 255, 114, 0.1), transparent);
  animation: gridWave 8s ease-in-out infinite;
}

@keyframes gridWave {
  0%, 100% {
    transform: scaleY(1);
    opacity: 0.3;
  }
  50% {
    transform: scaleY(1.2);
    opacity: 0.6;
  }
}

/* Neon Dots */
.neon-dots .neon-dot {
  position: absolute;
  width: 3px;
  height: 3px;
  background: #5DFF72;
  border-radius: 50%;
  box-shadow: 0 0 10px #5DFF72;
  animation: neonPulse 3s ease-in-out infinite;
}

@keyframes neonPulse {
  0%, 100% {
    opacity: 0;
    transform: scale(0);
  }
  50% {
    opacity: 1;
    transform: scale(1);
    box-shadow: 0 0 20px #5DFF72;
  }
}

/* Responsive */
@media (max-width: 768px) {
  .floating-orbs .orb {
    filter: blur(30px);
  }
  
  .floating-circles .circle {
    border-width: 1px;
  }
}
</style>