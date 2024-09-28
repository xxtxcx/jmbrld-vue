<template>
    <header class="bg-header shadow p-4 flex justify-between items-center">
      <h1 class="text-2xl font-bold text-primary">JMBRLD</h1>
      <div class="relative w-64">
        <input
          v-model="searchTerm"
          type="text"
          placeholder="Search songs..."
          class="w-full pl-10 pr-4 py-2 rounded-full border focus:outline-none focus:ring-2 focus:ring-primary bg-input text-input-text border-input-border"
          @input="$emit('updateSearch', searchTerm)"
        >
        <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-input-icon" :size="20" />
      </div>
    </header>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  import { Search } from 'lucide-vue-next'
  
  const searchTerm = ref("")
  
  defineEmits(['updateSearch'])
  </script>