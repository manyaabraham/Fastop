<template>
  <div class="page-wrapper">
    <div class="support-page" :class="{ 'dark-mode': darkMode }">
      <div class="support-container">
        <!-- Header with Back Button and Logo -->
        <div class="header-section animate-slide-down">
          <div class="header-top">
            <button class="back-button" @click="goBack">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" stroke-width="2"/>
              </svg>
            </button>
            <div class="logo-area">
              <img v-if="logoUrl" :src="logoUrl" alt="Fastop Logo" class="header-logo animate-rotate" />
            </div>
            <div class="title-area">
              <h1 class="page-title gradient-text animate-fade-in">Support Center</h1>
              <p class="page-subtitle animate-fade-in" style="animation-delay: 0.1s">We're here to help you 24/7</p>
            </div>
          </div>
        </div>

        <!-- Support Cards - Original Tile Design -->
        <div class="support-options">
          <!-- Call Card -->
          <div class="support-card animate-card" style="animation-delay: 0.15s" @click="callSupport">
            <div class="card-icon pulse-icon">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" stroke="currentColor" stroke-width="2"/>
              </svg>
            </div>
            <h3>Customer Support</h3>
            <p>Call us for immediate assistance</p>
            <a href="tel:+256742881577" class="contact-link">Call</a>
          </div>

          <!-- Email Card -->
          <div class="support-card animate-card" style="animation-delay: 0.2s" @click="emailSupport">
            <div class="card-icon bounce-icon">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" stroke-width="2"/>
                <polyline points="22,6 12,13 2,6" stroke="currentColor" stroke-width="2"/>
              </svg>
            </div>
            <h3>Email Us</h3>
            <p>Get response within 24 hours</p>
            <a href="mailto:fastopcompany@gmail.com" class="contact-link">Email</a>
          </div>

          <!-- Visit Card -->
          <div class="support-card animate-card" style="animation-delay: 0.25s">
            <div class="card-icon float-icon">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke="currentColor" stroke-width="2"/>
                <circle cx="12" cy="10" r="3" stroke="currentColor" stroke-width="2"/>
              </svg>
            </div>
            <h3>Visit Us</h3>
            <p>Our office location</p>
            <p class="address">Kampala, Uganda</p>
          </div>
        </div>

        <!-- FAQ Section -->
        <div class="faq-section animate-card" style="animation-delay: 0.3s">
          <div class="faq-header">
            <h2 class="faq-title">Frequently Asked Questions</h2>
            <div class="faq-decoration"></div>
          </div>
          <div class="faq-list">
            <div v-for="(faq, index) in faqs" :key="index" class="faq-item animate-faq" :style="{ animationDelay: `${0.35 + index * 0.05}s` }">
              <button class="faq-question" @click="toggleFaq(index)">
                <span>{{ faq.question }}</span>
                <svg :class="{ rotated: activeFaq === index }" viewBox="0 0 24 24" fill="none">
                  <polyline points="6 9 12 15 18 9" stroke="currentColor" stroke-width="2"/>
                </svg>
              </button>
              <transition name="expand">
                <div class="faq-answer" v-show="activeFaq === index">
                  <p>{{ faq.answer }}</p>
                </div>
              </transition>
            </div>
          </div>
        </div>

        <!-- Social Section -->
        <div class="social-section animate-card" style="animation-delay: 0.45s">
          <h3 class="social-title">Connect With Us</h3>
          <div class="social-links">
            <a href="https://instagram.com/fastopsch" target="_blank" class="social-link instagram" rel="noopener noreferrer">
              <img src="/icons/instagram.png" alt="Instagram" class="social-svg" />
            </a>
            <a href="https://tiktok.com/@fastop" target="_blank" class="social-link tiktok" rel="noopener noreferrer">
              <img src="/icons/tiktok.png" alt="TikTok" class="social-svg" />
            </a>
            <a href="https://wa.me/256742881577" target="_blank" class="social-link whatsapp" rel="noopener noreferrer">
              <img src="/icons/whatsapp.png" alt="WhatsApp" class="social-svg" />
            </a>
            <a href="https://x.com/fastop" target="_blank" class="social-link twitter" rel="noopener noreferrer">
              <img src="/icons/twitter.png" alt="X" class="social-svg" />
            </a>
          </div>
        </div>

        <!-- Footer -->
        <div class="footer-note animate-fade-in" style="animation-delay: 0.5s">
          <p>© 2024 Fastop. All rights reserved.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const logoUrl = '/logo.png'
const darkMode = ref(false)
const activeFaq = ref(null)

const faqs = [
  {
    question: "How do I create a shopping list?",
    answer: "Creating a shopping list is easy! Navigate to the 'Lists' section using the bottom navigation bar, then tap the 'Create New List' button. Give your list a name (e.g., 'Senior One Supplies'), then start adding items. For each item, you can specify the quantity, price, category, priority level, and add notes. Your list will be saved automatically and can be edited anytime."
  },
  {
    question: "How does the price comparison feature work?",
    answer: "Our Smart Price Browser allows you to search for any school supply item and compare prices from trusted Ugandan e-commerce stores including Jumia Uganda, Jiji Uganda, Carrefour Uganda, and more. Simply go to the Search tab, type in the item you're looking for, and we'll provide direct links to search results on each store."
  },
  {
    question: "Is my personal data secure?",
    answer: "Absolutely! Your security is our top priority. We use Supabase with Row Level Security (RLS) to ensure that your data is completely private and accessible only by you. Each user's shopping lists, budget information, and profile data are isolated using strict database policies."
  },
  {
    question: "Can I share my shopping lists with family members?",
    answer: "Yes, sharing is coming soon! While direct sharing is currently in development, you can work around this by creating a shared account for family members. Our upcoming version will include features for list sharing and collaborative shopping."
  },
  {
    question: "How does the budget tracking work?",
    answer: "The budget tracker helps you manage your school supply expenses effectively. When you set up your profile, you can define a total budget for your school shopping. As you add items to your shopping lists with their prices, the system automatically calculates your total spending and remaining budget."
  },
  {
    question: "Can I download my shopping lists?",
    answer: "Yes! You can download any of your purchased shopping lists as a beautifully formatted PDF. On the Packing Checklist page, long-press on any purchased list to bring up options, then select 'Download PDF'. The PDF includes the list name, purchase date, all items with quantities and prices, and total amounts."
  }
]

const toggleFaq = (index) => {
  activeFaq.value = activeFaq.value === index ? null : index
}

const goBack = () => {
  router.back()
}

const callSupport = () => {
  window.location.href = 'tel:+256742881577'
}

const emailSupport = () => {
  window.location.href = 'mailto:fastopcompany@gmail.com'
}

const loadDarkMode = () => {
  const saved = localStorage.getItem('dark_mode')
  if (saved) {
    darkMode.value = saved === 'true'
  }
}

onMounted(() => {
  loadDarkMode()
})
</script>

<style scoped>
.support-page {
  min-height: 100vh;
  background: #FFFFFF;
  padding-bottom: 80px;
  transition: all 0.3s;
}

.support-page.dark-mode {
  background: #1A1A1A;
}

.support-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

/* Header Section */
.header-section {
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

.dark-mode .header-top {
  background: #2A2A2A;
  border: 1px solid #3A3A3A;
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

.back-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
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
  transform: scale(1.05);
}

.dark-mode .back-button:hover {
  background: #3A3A3A;
}

.logo-area {
  flex-shrink: 0;
}

.header-logo {
  width: 50px;
  height: 50px;
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
  font-size: 22px;
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

/* Support Cards - Grid Design */
.support-options {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
  margin-bottom: 30px;
}

.support-card {
  background: #F8F9FA;
  padding: 20px;
  border-radius: 20px;
  text-align: center;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  animation: fadeInUp 0.5s ease-out backwards;
}

.dark-mode .support-card {
  background: #2A2A2A;
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

.support-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(93, 255, 114, 0.1), transparent);
  transition: left 0.5s;
}

.support-card:hover::before {
  left: 100%;
}

.support-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 35px rgba(93, 255, 114, 0.2);
}

.card-icon {
  width: 50px;
  height: 50px;
  margin: 0 auto 15px;
  color: #5DFF72;
}

.card-icon svg {
  width: 100%;
  height: 100%;
}

.pulse-icon {
  animation: pulseIcon 2s ease infinite;
}

@keyframes pulseIcon {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.bounce-icon {
  animation: bounceIcon 2s ease infinite;
}

@keyframes bounceIcon {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

.float-icon {
  animation: floatIcon 3s ease infinite;
}

@keyframes floatIcon {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

.support-card h3 {
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 8px;
  color: #1A1A1A;
}

.dark-mode .support-card h3 {
  color: #FFFFFF;
}

.support-card p {
  font-size: 13px;
  color: #6C757D;
  margin-bottom: 10px;
}

.dark-mode .support-card p {
  color: #ADB5BD;
}

.contact-link {
  color: #5DFF72;
  text-decoration: none;
  font-weight: 600;
  font-size: 14px;
  display: inline-block;
  transition: all 0.3s;
}

.contact-link:hover {
  transform: translateX(3px);
  color: #34D399;
}

.address {
  font-size: 12px;
  color: #999;
}

/* FAQ Section */
.faq-section {
  background: #F8F9FA;
  border-radius: 20px;
  padding: 20px;
  margin-bottom: 30px;
  animation: fadeInUp 0.5s ease-out backwards;
}

.dark-mode .faq-section {
  background: #2A2A2A;
}

.faq-header {
  margin-bottom: 20px;
}

.faq-title {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 8px;
  color: #1A1A1A;
}

.dark-mode .faq-title {
  color: #FFFFFF;
}

.faq-decoration {
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

.faq-list {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.faq-item {
  border-bottom: 1px solid #E9ECEF;
  animation: slideInLeft 0.4s ease-out backwards;
}

.dark-mode .faq-item {
  border-bottom-color: #3A3A3A;
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.faq-question {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
  background: none;
  border: none;
  font-size: 14px;
  font-weight: 600;
  color: #1A1A1A;
  cursor: pointer;
  transition: all 0.3s;
}

.dark-mode .faq-question {
  color: #FFFFFF;
}

.faq-question:hover {
  color: #5DFF72;
}

.faq-question svg {
  width: 18px;
  height: 18px;
  transition: transform 0.3s;
}

.faq-question svg.rotated {
  transform: rotate(180deg);
}

.faq-answer {
  padding: 0 0 15px 0;
  color: #6C757D;
  font-size: 13px;
  line-height: 1.6;
}

.dark-mode .faq-answer {
  color: #ADB5BD;
}

/* FAQ Expand Transition */
.expand-enter-active, .expand-leave-active {
  transition: all 0.3s ease;
  max-height: 500px;
  overflow: hidden;
}

.expand-enter-from, .expand-leave-to {
  max-height: 0;
  opacity: 0;
}

/* Social Section */
.social-section {
  text-align: center;
  padding: 20px;
  background: #F8F9FA;
  border-radius: 20px;
  animation: fadeInUp 0.5s ease-out backwards;
}

.dark-mode .social-section {
  background: #2A2A2A;
}

.social-title {
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 15px;
  color: #1A1A1A;
}

.dark-mode .social-title {
  color: #FFFFFF;
}

.social-links {
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
}

.social-link {
  width: 45px;
  height: 45px;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
  text-decoration: none;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.dark-mode .social-link {
  background: #1A1A1A;
}

.social-svg {
  width: 22px;
  height: 22px;
  display: block;
}

.social-link:hover {
  transform: translateY(-8px) rotate(360deg);
  box-shadow: 0 8px 20px rgba(93, 255, 114, 0.3);
}

.social-link.instagram:hover { background: #E4405F; }
.social-link.tiktok:hover { background: #000000; }
.social-link.whatsapp:hover { background: #25D366; }
.social-link.facebook:hover { background: #1877F2; }
.social-link.twitter:hover { background: #1DA1F2; }

.social-link:hover .social-svg {
  filter: brightness(0) invert(1);
}

/* Footer */
.footer-note {
  text-align: center;
  padding: 20px;
  margin-top: 10px;
}

.footer-note p {
  font-size: 11px;
  color: #ADB5BD;
}

/* Responsive */
@media (max-width: 600px) {
  .support-options {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  
  .support-card {
    display: flex;
    align-items: center;
    text-align: left;
    gap: 15px;
    padding: 15px;
  }
  
  .card-icon {
    margin: 0;
    width: 40px;
    height: 40px;
  }
  
  .support-card h3 {
    margin-bottom: 4px;
  }
  
  .support-card p {
    margin-bottom: 4px;
  }
}
</style>