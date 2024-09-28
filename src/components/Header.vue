<template>
    <header class="bg-header shadow p-2 md:p-4 flex flex-col md:flex-row justify-between items-center">
      <h1 class="text-xl md:text-2xl font-bold text-primary mb-2 md:mb-0">JMBRLD</h1>
      <div class="relative w-full md:w-64">
        <input
        :value="searchTerm"
        @input="handleSearch"
        type="text"
        placeholder="Search songs..."
        class="w-full pl-8 pr-4 py-1 md:py-2 rounded-full border focus:outline-none focus:ring-2 focus:ring-primary bg-input text-input-text border-input-border"
      >
        <Search class="absolute left-2 top-1/2 transform -translate-y-1/2 text-input-icon" :size="16" />
      </div>
    </header>
  </template>
  
  <script setup lang="ts">
  import { Search } from 'lucide-vue-next'
  
  defineProps<{
    searchTerm: string
  }>()

  const emit = defineEmits<{
  (e: 'updateSearch', value: string): void
  (e: 'activateEasterEgg'): void
}>();

const handleSearch = (event: Event) => {
  const value = (event.target as HTMLInputElement).value;
  emit('updateSearch', value);
  
  if (value.toLowerCase() === 'саша фронч топ') {
    emit('activateEasterEgg');
  }
};

  </script>