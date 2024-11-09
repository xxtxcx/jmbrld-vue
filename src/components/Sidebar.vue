<template>
  <div class="w-16 md:w-20 bg-sidebar text-white flex flex-col items-center py-2 md:py-4">
    <div class="mb-2 md:mb-4">
      <Music :size="24" class="md:w-8 md:h-8" />
    </div>
    <nav class="flex flex-col items-center space-y-2 md:space-y-4 flex-grow">
      <SidebarButton @click="$emit('changeView', 'main')">
        <Search :size="20" class="md:w-6 md:h-6" />
      </SidebarButton>
      <SidebarButton @click="$emit('changeView', 'playlist')">
        <List :size="20" class="md:w-6 md:h-6" />
      </SidebarButton>
      <SidebarButton 
        v-if="userRole === 'admin'"
        @click="$emit('showAddSongModal')"
      >
        <Plus :size="20" class="md:w-6 md:h-6" />
      </SidebarButton>
      <SidebarButton @click="handleMusicIconClick">
        <Settings :size="20" class="md:w-6 md:h-6" />
      </SidebarButton>
    </nav>
    <SidebarButton @click="$emit('toggleTheme')" class="mb-2 md:mb-4">
      <Sun v-if="isDarkMode" :size="20" class="md:w-6 md:h-6" />
      <Moon v-else :size="20" class="md:w-6 md:h-6" />
    </SidebarButton>
  </div>
</template>

<script setup lang="ts">
import { Music, Search, List, Settings, Sun, Moon, Plus } from 'lucide-vue-next'
import SidebarButton from './SidebarButton.vue'
import { ref } from 'vue'

const clickCount = ref(0)
const rotationDegrees = ref(0)

const rotateApp = () => {
  const app = document.getElementById('app')
  if (app) {
    rotationDegrees.value += 360
    app.style.transition = 'transform 1s ease-in-out'
    app.style.transform = `rotate(${rotationDegrees.value}deg)`
  }
}

const handleMusicIconClick = () => {
  clickCount.value++
  if (clickCount.value === 13) {
    rotateApp()
    clickCount.value = 0
  }
}

defineProps<{
  isDarkMode: boolean,
  userRole: 'admin' | 'user'
}>()

defineEmits(['changeView', 'showAddSongModal', 'toggleTheme'])
</script>