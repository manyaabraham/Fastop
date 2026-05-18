<template>
  <div class="avatar-selector">
    <h3 class="selector-title">Choose Your Character</h3>
    <div class="avatars-grid">
      <div 
        v-for="avatar in avatars" 
        :key="avatar.id"
        class="avatar-option"
        :class="{ selected: selectedAvatar === avatar.id }"
        @click="selectAvatar(avatar.id)"
      >
        <img :src="avatar.url" :alt="`Avatar ${avatar.id}`" class="avatar-image" 
             @error="handleImageError(avatar.id)" />
        <div class="avatar-check" v-if="selectedAvatar === avatar.id">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="3"/>
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  modelValue: Number
})

const emit = defineEmits(['update:modelValue'])

const selectedAvatar = ref(props.modelValue || 1)

// Fallback avatars in case any API fails
const fallbackAvatars = [
  'https://api.dicebear.com/7.x/adventurer/svg?seed=User1',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=User2',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=User3',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=User4',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=User5'
]

const avatars = ref([
  // Different styles for more variety
  { id: 1, url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Oliver&backgroundColor=b6e3f4&eyes=happy&mouth=smile&hair=female01' },
  { id: 2, url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma&backgroundColor=c0aede&topType=LongHairMiaWallace&accessoriesType=Prescription01' },
  { id: 3, url: 'https://api.dicebear.com/7.x/big-ears/svg?seed=Liam&backgroundColor=f5b0cb&ears=big&face=happy' },
  { id: 4, url: 'https://api.dicebear.com/7.x/big-smile/svg?seed=Sophia&backgroundColor=ffd6a5&mouth=smile&eyes=happy' },
  { id: 5, url: 'https://api.dicebear.com/7.x/croodles/svg?seed=Noah&backgroundColor=9bf6ff&face=smile' },
  { id: 6, url: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Ava&backgroundColor=a0c4ff&emoji=smile' },
  { id: 7, url: 'https://api.dicebear.com/7.x/lorelei/svg?seed=Ethan&backgroundColor=bdb2ff&hair=long&eyes=happy' },
  { id: 8, url: 'https://api.dicebear.com/7.x/micah/svg?seed=Isabella&backgroundColor=ffc6ff&hair=long&eyes=happy' },
  { id: 9, url: 'https://api.dicebear.com/7.x/miniavs/svg?seed=Mason&backgroundColor=b6e3f4&face=smile' },
  { id: 10, url: 'https://api.dicebear.com/7.x/open-peeps/svg?seed=Mia&backgroundColor=c0aede&expression=smile' },
  { id: 11, url: 'https://api.dicebear.com/7.x/personas/svg?seed=Lucas&backgroundColor=f5b0cb&expression=happy' },
  { id: 12, url: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Charlotte&backgroundColor=ffd6a5&face=smile' },
  { id: 13, url: 'https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=Amelia&backgroundColor=9bf6ff&eyes=happy&mouth=smile' },
  { id: 14, url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Benjamin&backgroundColor=a0c4ff&face=smile' },
  { id: 15, url: 'https://api.dicebear.com/7.x/identicon/svg?seed=Evelyn&backgroundColor=bdb2ff' },
  { id: 16, url: 'https://api.dicebear.com/7.x/lorelei-neutral/svg?seed=Alexander&backgroundColor=ffc6ff&hair=short&eyes=happy' },
  { id: 17, url: 'https://api.dicebear.com/7.x/notionists/svg?seed=Harper&backgroundColor=b6e3f4&expression=smile' },
  { id: 18, url: 'https://api.dicebear.com/7.x/pixel-art-neutral/svg?seed=Daniel&backgroundColor=c0aede&face=smile' },
  { id: 19, url: 'https://api.dicebear.com/7.x/shapes/svg?seed=Abigail&backgroundColor=f5b0cb&shape=circle' },
  { id: 20, url: 'https://api.dicebear.com/7.x/thumbs/svg?seed=Michael&backgroundColor=ffd6a5' }
])

const handleImageError = (id) => {
  const fallbackIndex = (id - 1) % fallbackAvatars.length
  const avatar = avatars.value.find(a => a.id === id)
  if (avatar) {
    avatar.url = fallbackAvatars[fallbackIndex]
  }
}

const selectAvatar = (id) => {
  selectedAvatar.value = id
  emit('update:modelValue', id)
}

onMounted(() => {
  // Avatars are ready
})
</script>

<style scoped>
.avatar-selector {
  padding: 10px;
}

.selector-title {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 20px;
  color: #1A1A1A;
  text-align: center;
}

.dark-mode .selector-title {
  color: #FFFFFF;
}

.avatars-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(85px, 1fr));
  gap: 15px;
  max-height: 450px;
  overflow-y: auto;
  padding: 10px;
}

.avatar-option {
  position: relative;
  cursor: pointer;
  border-radius: 50%;
  transition: all 0.3s ease;
  border: 3px solid transparent;
}

.avatar-option:hover {
  transform: scale(1.1);
}

.avatar-option.selected {
  border-color: #5DFF72;
  box-shadow: 0 0 20px rgba(93, 255, 114, 0.4);
}

.avatar-image {
  width: 100%;
  height: auto;
  border-radius: 50%;
  background: #F0F0F0;
  aspect-ratio: 1;
  object-fit: cover;
}

.avatar-check {
  position: absolute;
  bottom: -5px;
  right: -5px;
  width: 24px;
  height: 24px;
  background: #5DFF72;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #0B0B0B;
  border: 2px solid white;
}

.avatar-check svg {
  width: 14px;
  height: 14px;
}

/* Scrollbar */
.avatars-grid::-webkit-scrollbar {
  width: 6px;
}

.avatars-grid::-webkit-scrollbar-track {
  background: #F0F0F0;
  border-radius: 10px;
}

.avatars-grid::-webkit-scrollbar-thumb {
  background: #5DFF72;
  border-radius: 10px;
}

@media (max-width: 600px) {
  .avatars-grid {
    grid-template-columns: repeat(auto-fill, minmax(70px, 1fr));
    gap: 12px;
  }
}
</style>