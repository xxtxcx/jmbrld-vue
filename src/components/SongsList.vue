<template>
    <div class="flex-1 overflow-y-auto p-4 bg-gray-100 dark:bg-gray-900">
      <div class="space-y-4">
        <div v-for="song in visibleSongList" :key="song.id" class="bg-white dark:bg-gray-800 rounded-lg shadow p-4 cursor-pointer hover:shadow-md transition">
          <div class="flex justify-between items-center" @click="toggleSongExpansion(song.id)">
            <div>
              <h2 class="text-lg font-semibold text-gray-900 dark:text-white">{{ song.title }}</h2>
              <p class="text-gray-600 dark:text-gray-400">{{ song.artist }}</p>
            </div>
            <div class="flex items-center space-x-2">
              <span class="text-sm text-gray-500 dark:text-gray-400">Key: {{ song.originalKey }}</span>
              <ChevronUp v-if="expandedSong === song.id" :size="20" class="text-white" />
              <ChevronDown v-else :size="20" class="text-white" />
            </div>
          </div>
          <div v-if="expandedSong === song.id" class="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded">
            <h3 class="font-semibold mb-2 text-white">Chords:</h3>
            <pre class="whitespace-pre-wrap font-mono text-sm text-gray-300">{{ song.chords }}</pre>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  import { ChevronDown, ChevronUp } from 'lucide-vue-next'
  
  const expandedSong = ref<number | null>(null)
  const visibleSongList = ref([
    // Your list of songs here
  ])
  
  const toggleSongExpansion = (id: number) => {
    expandedSong.value = expandedSong.value === id ? null : id
  }
  </script>
  