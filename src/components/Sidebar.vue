<template>
  <div class="w-20 bg-sidebar text-white flex flex-col items-center py-4">
    <div class="mb-8">
      <Music :size="32" />
    </div>
    <nav class="flex flex-col items-center space-y-4 flex-grow">
      <SidebarButton @click="$emit('changeView', 'main')">
        <Search :size="24" />
      </SidebarButton>
      <SidebarButton @click="$emit('changeView', 'playlist')">
        <List :size="24" />
      </SidebarButton>
      <SidebarButton @click="$emit('showAddSongModal')">
        <Plus :size="24" />
      </SidebarButton>
      <SidebarButton>
        <Settings :size="24" />
      </SidebarButton>
    </nav>
    <SidebarButton @click="$emit('toggleTheme')" class="mt-auto mb-4">
      <Sun v-if="isDarkMode" :size="24" />
      <Moon v-else :size="24" />
    </SidebarButton>
  </div>
</template>

<script setup lang="ts">
import { Music, Search, List, Settings, Sun, Moon, Plus } from 'lucide-vue-next'
import SidebarButton from './SidebarButton.vue'

defineProps<{
  isDarkMode: boolean
}>()

defineEmits(['changeView', 'showAddSongModal', 'toggleTheme'])
</script>