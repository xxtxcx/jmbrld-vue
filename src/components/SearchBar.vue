<template>
    <div class="relative w-64">
      <input
        v-model="searchTerm"
        type="text"
        placeholder="Search songs..."
        class="w-full pl-10 pr-4 py-2 rounded-full border focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-700 text-white border-gray-600"
        @input="onUpdateSearch"
      >
      <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" :size="20" />
    </div>
  </template>
  
  <script setup lang="ts">
  import { Search } from 'lucide-vue-next'
  import { ref } from 'vue';
  
  const searchTerm = ref('')
  const onUpdateSearch = () => {
    // Implement the search functionality here
  }
  </script>
  

  <template>
    <div class="relative w-64">
      <input
        v-model="searchTerm"
        type="text"
        placeholder="Search songs..."
        class="w-full pl-10 pr-4 py-2 rounded-full border focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-700 text-white border-gray-600"
        @input="onUpdateSearch"
      >
      <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" :size="20" />
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  import { Search } from 'lucide-vue-next'
  
  const searchTerm = ref('')
  const onUpdateSearch = () => {
    console.log('Search term updated:', searchTerm.value)
    // Implement logic to filter the song list based on the search term
    // Example: You can emit an event or directly filter your song list in the parent component
  }
  </script>
  
  <style scoped>
  /* Add any custom styling here if needed */
  </style>
  