<template>
  <div class="price-browser-page">
    <div class="container">
      <!-- Header with Logo on Left -->
      <div class="header-section animate-slide-down">
        <div class="logo-area">
          <img v-if="logoUrl" :src="logoUrl" alt="Fastop Logo" class="header-logo" />
        </div>
        <div class="header-left">
          <h1 class="page-title gradient-text">Smart Price Browser</h1>
        </div>
      </div>

      <!-- Search Section - Clean Design -->
      <div class="search-section animate-scale">
        <div class="search-container">
          <div class="search-input-wrapper">
            <svg class="search-icon" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2"/>
              <path d="m21 21-4.3-4.3" stroke="currentColor" stroke-width="2"/>
            </svg>
            <input 
              v-model="searchQuery" 
              @input="onSearchInput"
              @keyup.enter="searchOnStores"
              @focus="showDropdown = true"
              class="search-input" 
              placeholder="Search for school supplies..."
            />
            <button v-if="searchQuery" class="clear-search" @click="clearSearch">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2"/>
              </svg>
            </button>
          </div>
          <button @click="searchOnStores" class="search-btn" :disabled="loading">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.3-4.3"/>
            </svg>
          </button>
        </div>

        <!-- Dropdown Menu -->
        <div v-if="showDropdown && (searchHistory.length > 0 || getSuggestions().length > 0)" class="search-dropdown animate-dropdown">
          <div v-if="searchHistory.length > 0 && !searchQuery" class="dropdown-section">
            <div class="dropdown-header">
              <span>Recent Searches</span>
              <button class="clear-all-btn" @click="clearAllHistory">Clear All</button>
            </div>
            <div v-for="item in searchHistory" :key="item" class="dropdown-item" @click="selectHistoryItem(item)">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M12 8v4l3 3M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" stroke="currentColor" stroke-width="2"/>
              </svg>
              <span>{{ item }}</span>
              <button class="delete-item-btn" @click.stop="deleteHistoryItem(item)">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2"/>
                </svg>
              </button>
            </div>
          </div>

          <div v-if="getSuggestions().length > 0 && searchQuery" class="dropdown-section">
            <div class="dropdown-header">
              <span>Suggestions</span>
            </div>
            <div v-for="item in getSuggestions()" :key="item" class="dropdown-item" @click="selectSuggestion(item)">
              <svg viewBox="0 0 24 24" fill="none">
                <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2"/>
                <path d="m21 21-4.3-4.3" stroke="currentColor" stroke-width="2"/>
              </svg>
              <span>{{ item }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Opening stores...</p>
      </div>

      <!-- Search Tips -->
      <div v-if="!searched" class="tips-section">
        <h3>Search Tips</h3>
        <ul>
          <li>Search for specific items like "Scientific Calculator"</li>
          <li>Try categories like "Math Set", "Geometry Box", "Graph Book"</li>
          <li>Be specific for better results: "Casio Calculator", "Bic Pens"</li>
        </ul>
      </div>

      <!-- Store Links Grid - Only Jumia and Jiji -->
      <div v-if="searched && storeLinks.length > 0" class="stores-section">
        <h2 class="section-title">Search on Stores</h2>
        <div class="stores-grid">
          <!-- Jumia Uganda -->
          <div class="store-card animate-slide-left" v-for="store in storeLinks" :key="store.name">
            <div class="store-icon">
              <img :src="store.icon" :alt="store.name" />
            </div>
            <div class="store-info">
              <h3 class="store-name">{{ store.name }}</h3>
              <p class="store-specialty">{{ store.specialty }}</p>
              <p class="store-location">{{ store.location }}</p>
            </div>
            <a :href="store.searchUrl" target="_blank" class="store-btn" rel="noopener noreferrer">
              <span>Open Store</span>
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" stroke="currentColor" stroke-width="2"/>
                <polyline points="15 3 21 3 21 9" stroke="currentColor" stroke-width="2"/>
                <line x1="10" y1="14" x2="21" y2="3" stroke="currentColor" stroke-width="2"/>
              </svg>
            </a>
          </div>
        </div>

        <!-- Google Shopping Option -->
        <div class="google-search-section">
          <a :href="googleSearchUrl" target="_blank" class="google-btn" rel="noopener noreferrer">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" stroke="currentColor" stroke-width="1.5"/>
              <path d="M12 16v-4M12 8h.01" stroke="currentColor" stroke-width="2"/>
            </svg>
            Search on Google Shopping
            <svg class="arrow" viewBox="0 0 24 24" fill="none">
              <path d="M7 17L17 7M17 7H7M17 7v10" stroke="currentColor" stroke-width="2"/>
            </svg>
          </a>
        </div>
      </div>

      <!-- Suggestions Grid -->
      <div v-else class="suggestions-section">
        <h2 class="section-title">Popular School Supplies</h2>
        <div class="suggestions-grid">
          <button v-for="suggestion in popularSuggestions" :key="suggestion" 
                  @click="searchQuery = suggestion; searchOnStores()"
                  class="suggestion-chip">
            {{ suggestion }}
          </button>
        </div>
      </div>
          <!-- Footer Sentence -->
<div class="footer-sentence animate-fade-in">
  <div class="sentence-decoration">
    <span class="dot"></span>
    <span class="line"></span>
    <span class="dot"></span>
  </div>
  <p class="sentence-text">
    🔍 Compare prices, save money, shop smarter for your school needs 🔍
  </p>
</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const logoUrl = '/logo.png'
const searchQuery = ref('')
const loading = ref(false)
const searched = ref(false)
const storeLinks = ref([])
const showDropdown = ref(false)
const searchHistory = ref([])

const popularSuggestions = [
  'Scientific Calculator', 'Mathematical Set', 'Graph Book', 
  'Geometry Set', 'School Bag', 'Uniform', 'Textbooks', 'Pens',
  'Notebook', 'Pencil Case', 'Ruler Set', 'Geometry Box',
  'Casio Calculator', 'Bic Pens', 'Oxford Notebook'
]

const allSuggestions = [
  // Writing Instruments
  'Ballpoint Pen', 'Gel Pen', 'Fountain Pen', 'Rollerball Pen', 'Calligraphy Pen',
  'Pencil 2B', 'Pencil HB', 'Mechanical Pencil', 'Lead Refills', 'Eraser',
  'Sharpener', 'Correction Pen', 'Correction Tape', 'Whiteout Fluid', 'Marker Pen',
  'Whiteboard Marker', 'Permanent Marker', 'Highlighters Set', 'Dry Erase Marker', 'Chalk',
  'Colored Pencils', 'Crayons', 'Oil Pastels', 'Watercolor Pencils', 'Charcoal Pencils',
  
  // Paper Products
  'A4 Paper', 'A3 Paper', 'A5 Notebook', 'B5 Notebook', 'Spiral Notebook',
  'Composition Book', 'Graph Paper', 'Grid Paper', 'Dotted Journal', 'Sketch Pad',
  'Watercolor Paper', 'Drawing Paper', 'Cartridge Paper', 'Tracing Paper', 'Carbon Paper',
  'Sticky Notes', 'Page Markers', 'Index Cards', 'Flash Cards', 'Post-it Notes',
  'Manila Paper', 'Construction Paper', 'Colored Paper', 'Origami Paper', 'Scrapbook Paper',
  
  // Books & References
  'Dictionary', 'Thesaurus', 'Encyclopedia', 'Atlas', 'Textbook',
  'Workbook', 'Reference Book', 'Study Guide', 'Revision Book', 'Past Papers',
  'Formula Sheet', 'Periodic Table', 'World Map', 'Educational Charts', 'Posters',
  
  // Geometry & Math
  'Mathematical Set', 'Geometry Box', 'Compass', 'Protractor', 'Ruler 15cm',
  'Ruler 30cm', 'Set Square', 'T-Square', 'French Curve', 'Scale Ruler',
  'Calculator Basic', 'Scientific Calculator', 'Graphing Calculator', 'Abacus', 'Geoboard',
  'Fraction Tiles', 'Algebra Tiles', 'Angle Measure', 'Compass Set', 'Divider',
  
  // Art Supplies
  'Watercolor Set', 'Acrylic Paint', 'Tempera Paint', 'Poster Color', 'Oil Paint',
  'Paint Brushes Set', 'Palette', 'Canvas Board', 'Mixed Media Pad', 'Art Portfolio',
  'Clay', 'Modeling Clay', 'Air Dry Clay', 'Pottery Tools', 'Sculpture Wire',
  'Glue Stick', 'Liquid Glue', 'White Glue', 'Glue Gun', 'Glue Gun Sticks',
  'Scissors', 'Craft Scissors', 'Pinking Shears', 'Paper Trimmer', 'Craft Knife',
  'Cutting Mat', 'Ribbon', 'Washi Tape', 'Masking Tape', 'Double Sided Tape',
  
  // Storage & Organization
  'Pencil Case', 'Pencil Pouch', 'Pencil Box', 'Pen Holder', 'Desk Organizer',
  'File Folder', 'Expanding File', 'Ring Binder', 'Binder Dividers', 'Sheet Protectors',
  'Document Wallet', 'Clear Book', 'Plastic Envelope', 'Paper Clips', 'Binder Clips',
  'Stapler', 'Staples', 'Staple Remover', 'Paper Fasteners', 'Paper Punches',
  'Book Cover', 'Textbook Cover', 'Book Sleeve', 'Laminating Sheets', 'Label Maker',
  
  // Bags & Carriers
  'School Bag', 'Backpack', 'Laptop Backpack', 'Messenger Bag', 'Tote Bag',
  'Drawstring Bag', 'Sports Bag', 'Lunch Bag', 'Pencil Bag', 'Art Bag',
  'Wheeled Backpack', 'Shoulder Bag', 'Crossbody Bag', 'Duffle Bag', 'Book Bag',
  
  // Uniform & Clothing
  'School Uniform', 'White Shirt', 'Polo Shirt', 'Blouse', 'Trousers',
  'Skirt', 'Shorts', 'Sweater', 'V-Neck Sweater', 'Cardigan',
  'Blazer', 'School Tie', 'Belt', 'Socks', 'Stockings',
  'School Shoes', 'Sports Shoes', 'Sandals', 'P.E Uniform', 'Track Suit',
  
  // Electronics
  'Laptop', 'Tablet', 'Smartphone', 'Scientific Calculator Casio', 'Digital Watch',
  'USB Flash Drive', 'External Hard Drive', 'Headphones', 'Earphones', 'Microphone',
  'Webcam', 'Printer', 'Scanner', 'Photocopier', 'Projector',
  'Charger', 'Power Bank', 'Extension Cord', 'Adapter', 'HDMI Cable',
  
  // Science Equipment
  'Microscope', 'Telescope', 'Magnifying Glass', 'Test Tubes', 'Beaker',
  'Flask', 'Petri Dish', 'Bunsen Burner', 'Tripod Stand', 'Wire Gauze',
  'Thermometer', 'Barometer', 'Spring Balance', 'Weighing Scale', 'Measuring Cylinder',
  'Safety Goggles', 'Lab Coat', 'Gloves', 'Dissecting Kit', 'Specimen Jar',
  
  // Physical Education
  'Sports Shoes', 'Running Shoes', 'Football', 'Basketball', 'Volleyball',
  'Tennis Ball', 'Cricket Bat', 'Cricket Ball', 'Badminton Racket', 'Shuttlecock',
  'Table Tennis Bat', 'Table Tennis Ball', 'Swimming Goggles', 'Swimming Cap', 'Sports Bottle',
  'Jump Rope', 'Hula Hoop', 'Cones', 'Whistle', 'Stopwatch',
  
  // First Aid & Health
  'First Aid Kit', 'Bandages', 'Antiseptic Wipes', 'Cotton Wool', 'Plasters',
  'Pain Relief', 'Thermometer', 'Hand Sanitizer', 'Face Mask', 'Tissues',
  'Water Bottle', 'Lunch Box', 'Snack Container', 'Thermal Flask', 'Insulated Bag',
  
  // General Stationery
  'Stapler', 'Staple Remover', 'Hole Punch', 'Paper Fasteners', 'Book Rings',
  'Rubber Bands', 'Paper Clips', 'Bulldog Clips', 'Document Clip', 'Magnetic Clip',
  'Postage Stamps', 'Envelopes', 'Mailing Labels', 'Shipping Label', 'Address Book',
  'Calendar', 'Planner', 'Daily Journal', 'Student Diary', 'Assignment Book',
  
  // Cleaning Supplies
  'Hand Wipes', 'Desk Cleaner', 'Lysol Wipes', 'Paper Towels', 'Tissue Box',
  'Trash Bag', 'Recycle Bin', 'Broom', 'Dustpan', 'Hand Vacuum',
  
  // Miscellaneous
  'ID Card Holder', 'Lanyard', 'Name Tag', 'Student ID', 'Bus Pass Card',
  'Library Card', 'Meal Card', 'Timetable', 'Notice Board', 'Pin Board',
  'Push Pins', 'Magnetic Pins', 'Whiteboard', 'Whiteboard Eraser', 'Chalkboard Eraser',
  'Clock', 'Timer', 'Alarm Clock', 'Desk Lamp', 'Table Lamp',
  
  // Specific Brands
  'Bic Pen Blue', 'Bic Pen Black', 'Bic Pen Red', 'Bic Pen Green', 'Bic 4 Color Pen',
  'Pilot G2', 'Uni-ball Signo', 'Zebra Sarasa', 'Staedtler Eraser', 'Faber-Castell Pencil',
  'Sharpie Marker', 'Crayola Crayons', 'Prismacolor Pencils', 'Muji Notebook', 'Oxford Notebook'
]

// Only Jumia and Jiji stores
const ugandanStores = [
  {
    name: 'Jumia Uganda',
    specialty: 'Electronics, Stationery, School Supplies',
    location: 'Uganda Wide',
    icon: '/jumia.png',
    baseUrl: 'https://www.jumia.ug/catalog/?q='
  },
  {
    name: 'Jiji Uganda',
    specialty: 'New & Used Items, Bargains',
    location: 'Uganda Wide',
    icon: '/jiji.png',
    baseUrl: 'https://jiji.ug/search?query='
  }
]

const googleSearchUrl = computed(() => {
  if (!searchQuery.value) return '#'
  return `https://www.google.com/search?q=${encodeURIComponent(searchQuery.value)}+Uganda+price`
})

const getSuggestions = () => {
  if (!searchQuery.value) return []
  const query = searchQuery.value.toLowerCase()
  return allSuggestions.filter(s => s.toLowerCase().includes(query)).slice(0, 10)
}

const loadSearchHistory = () => {
  const saved = localStorage.getItem('price_search_history')
  if (saved) {
    searchHistory.value = JSON.parse(saved)
  }
}

const saveSearchHistory = () => {
  localStorage.setItem('price_search_history', JSON.stringify(searchHistory.value))
}

const addToHistory = (query) => {
  if (!query.trim()) return
  const existing = searchHistory.value.find(h => h === query)
  if (existing) {
    const index = searchHistory.value.indexOf(existing)
    searchHistory.value.splice(index, 1)
  }
  searchHistory.value.unshift(query)
  if (searchHistory.value.length > 10) {
    searchHistory.value.pop()
  }
  saveSearchHistory()
}

const deleteHistoryItem = (item) => {
  const index = searchHistory.value.indexOf(item)
  if (index !== -1) {
    searchHistory.value.splice(index, 1)
    saveSearchHistory()
  }
}

const clearAllHistory = () => {
  searchHistory.value = []
  saveSearchHistory()
}

const selectHistoryItem = (item) => {
  searchQuery.value = item
  showDropdown.value = false
  searchOnStores()
}

const selectSuggestion = (item) => {
  searchQuery.value = item
  showDropdown.value = false
  searchOnStores()
}

const onSearchInput = () => {
  showDropdown.value = true
}

const searchOnStores = () => {
  if (!searchQuery.value.trim()) {
    alert('Please enter a product to search')
    return
  }
  
  addToHistory(searchQuery.value)
  loading.value = true
  searched.value = true
  showDropdown.value = false
  
  const links = ugandanStores.map(store => ({
    ...store,
    searchUrl: store.baseUrl + encodeURIComponent(searchQuery.value)
  }))
  
  storeLinks.value = links
  
  setTimeout(() => {
    loading.value = false
  }, 500)
}

const clearSearch = () => {
  searchQuery.value = ''
  searched.value = false
  storeLinks.value = []
  showDropdown.value = true
}

// Close dropdown when clicking outside
const handleClickOutside = (e) => {
  if (!e.target.closest('.search-section')) {
    showDropdown.value = false
  }
}

// Load history on mount
loadSearchHistory()
document.addEventListener('click', handleClickOutside)
</script>

<style scoped>
.price-browser-page {
  min-height: 100vh;
  background: #FFFFFF;
  overflow-y: auto;
  height: 100vh;
}

.container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  padding-bottom: 90px;
}

/* Header with Logo on Left */
.header-section {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 25px;
}

.logo-area {
  flex-shrink: 0;
}

.header-logo {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  object-fit: cover;
}

.header-left {
  flex: 1;
}

.page-title {
  font-size: 22px;
  font-weight: 700;
  margin: 0;
}

.gradient-text {
  background: linear-gradient(135deg, #5DFF72, #34D399);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

/* Search Section - Clean Design */
.search-section {
  margin-bottom: 20px;
  position: relative;
}

.search-container {
  display: flex;
  gap: 12px;
}

.search-input-wrapper {
  flex: 1;
  position: relative;
}

.search-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  width: 18px;
  height: 18px;
  color: #ADB5BD;
}

.search-input {
  width: 100%;
  padding: 14px 45px 14px 45px;
  background: #F5F7FA;
  border: none;
  border-radius: 30px;
  font-size: 15px;
  font-family: inherit;
}

.search-input:focus {
  outline: none;
  background: #FFFFFF;
  box-shadow: 0 0 0 2px #5DFF72;
}

.clear-search {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.clear-search svg {
  width: 18px;
  height: 18px;
  color: #ADB5BD;
}

.search-btn {
  background: #5DFF72;
  border: none;
  border-radius: 30px;
  padding: 0 20px;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.search-btn svg {
  width: 20px;
  height: 20px;
  color: #0B0B0B;
}

.search-btn:hover {
  background: #34D399;
  transform: scale(1.02);
}

.search-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Search Dropdown */
.search-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  z-index: 100;
  margin-top: 8px;
  overflow: hidden;
  border: 1px solid #F0F0F0;
}

.dropdown-section {
  padding: 8px 0;
}

.dropdown-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 16px;
  font-size: 12px;
  color: #6C757D;
  font-weight: 600;
  border-bottom: 1px solid #F0F0F0;
}

.clear-all-btn {
  background: none;
  border: none;
  color: #ff4444;
  font-size: 11px;
  cursor: pointer;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  cursor: pointer;
  transition: background 0.2s;
}

.dropdown-item:hover {
  background: #F8F9FA;
}

.dropdown-item svg {
  width: 16px;
  height: 16px;
  color: #5DFF72;
}

.dropdown-item span {
  flex: 1;
  font-size: 14px;
}

.delete-item-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  opacity: 0.5;
}

.delete-item-btn:hover {
  opacity: 1;
}

.delete-item-btn svg {
  width: 14px;
  height: 14px;
  color: #999;
}

/* Tips Section */
.tips-section {
  background: #F8F9FA;
  padding: 20px;
  border-radius: 20px;
  margin-bottom: 20px;
}

.tips-section h3 {
  font-size: 14px;
  font-weight: 700;
  margin-bottom: 12px;
  color: #1A1A1A;
}

.tips-section ul {
  list-style: none;
  padding-left: 0;
}

.tips-section li {
  padding: 6px 0;
  font-size: 13px;
  color: #6C757D;
}

/* Stores Grid */
.stores-section {
  margin-top: 20px;
}

.section-title {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 16px;
  color: #1A1A1A;
}

.stores-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
}

.store-card {
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 15px;
  background: #F8F9FA;
  border-radius: 20px;
  transition: all 0.3s;
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

.store-card:hover {
  transform: translateX(5px);
  background: #F0F0F0;
}

.store-icon img {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  object-fit: cover;
}

.store-info {
  flex: 1;
}

.store-name {
  font-size: 16px;
  font-weight: 700;
  color: #1A1A1A;
  margin-bottom: 4px;
}

.store-specialty {
  font-size: 11px;
  color: #5DFF72;
  font-weight: 500;
}

.store-location {
  font-size: 10px;
  color: #ADB5BD;
}

.store-btn {
  background: #1A1A1A;
  padding: 8px 16px;
  border-radius: 30px;
  text-decoration: none;
  font-size: 12px;
  font-weight: 600;
  color: white;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s;
}

.store-btn:hover {
  background: #5DFF72;
  color: #0B0B0B;
  transform: scale(1.02);
}

.store-btn svg {
  width: 14px;
  height: 14px;
}

/* Google Search */
.google-search-section {
  margin-top: 16px;
}

.google-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 14px;
  background: #F8F9FA;
  border-radius: 30px;
  text-decoration: none;
  color: #1A1A1A;
  font-weight: 600;
  transition: all 0.3s;
}

.google-btn svg {
  width: 18px;
  height: 18px;
}

.google-btn .arrow {
  margin-left: auto;
}

.google-btn:hover {
  background: #E9ECEF;
  transform: translateY(-2px);
}

/* Loading State */
.loading-state {
  text-align: center;
  padding: 60px 20px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #E9ECEF;
  border-top-color: #5DFF72;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 16px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Suggestions */
.suggestions-section {
  margin-top: 20px;
}

.suggestions-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.suggestion-chip {
  padding: 10px 16px;
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.3s;
  background: #F8F9FA;
  border: none;
  font-size: 13px;
  font-weight: 500;
}

.suggestion-chip:hover {
  background: #5DFF72;
  color: #0B0B0B;
  transform: scale(1.02);
}

/* Animations */
.animate-slide-down {
  animation: slideDown 0.5s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-scale {
  animation: scaleIn 0.4s ease-out;
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

.animate-dropdown {
  animation: dropdownFade 0.2s ease-out;
}

@keyframes dropdownFade {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Dark Mode */
.dark-mode .price-browser-page {
  background: #1A1A1A;
}

.dark-mode .search-input {
  background: #2A2A2A;
  color: #FFFFFF;
}

.dark-mode .search-input:focus {
  background: #333;
}

.dark-mode .search-dropdown {
  background: #2A2A2A;
  border-color: #3A3A3A;
}

.dark-mode .dropdown-item:hover {
  background: #333;
}

.dark-mode .dropdown-item span {
  color: #FFFFFF;
}

.dark-mode .tips-section,
.dark-mode .store-card,
.dark-mode .google-btn {
  background: #2A2A2A;
}

.dark-mode .tips-section h3,
.dark-mode .section-title,
.dark-mode .store-name {
  color: #FFFFFF;
}

.dark-mode .tips-section li,
.dark-mode .store-specialty,
.dark-mode .store-location {
  color: #ADB5BD;
}

.dark-mode .store-btn {
  background: #1A1A1A;
  color: #FFFFFF;
}

.dark-mode .store-btn:hover {
  background: #5DFF72;
  color: #0B0B0B;
}

.dark-mode .suggestion-chip {
  background: #2A2A2A;
  color: #FFFFFF;
}

.dark-mode .suggestion-chip:hover {
  background: #5DFF72;
  color: #0B0B0B;
}

.dark-mode .google-btn {
  color: #FFFFFF;
}

.dark-mode .google-btn:hover {
  background: #333;
}
/* Footer Sentence Styles */
.footer-sentence {
  margin-top: 50px;
  padding: 20px;
  text-align: center;
  border-top: 1px solid rgba(93, 255, 114, 0.15);
}

.sentence-decoration {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 15px;
}

.sentence-decoration .dot {
  width: 5px;
  height: 5px;
  background: #5DFF72;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

.sentence-decoration .line {
  width: 60px;
  height: 1px;
  background: linear-gradient(90deg, transparent, #5DFF72, #5DFF72, transparent);
}

.sentence-text {
  font-size: 13px;
  font-weight: 500;
  color: #1A1A1A;
  letter-spacing: 0.5px;
  background: linear-gradient(135deg, #5DFF72, #34D399);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

/* Dark Mode */
.dark-mode .sentence-text {
  background: linear-gradient(135deg, #5DFF72, #34D399);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.dark-mode .footer-sentence {
  border-top-color: rgba(93, 255, 114, 0.2);
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .footer-sentence {
    margin-top: 35px;
    padding: 15px;
  }
  
  .sentence-text {
    font-size: 11px;
  }
  
  .sentence-decoration .line {
    width: 40px;
  }
}

@keyframes pulse {
  0%, 100% { opacity: 0.6; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.2); }
}
</style>