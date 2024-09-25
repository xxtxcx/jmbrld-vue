<script setup lang="ts">
import { ref } from 'vue';
import { Search } from 'lucide-vue-next';

const searchTerm = ref('');

const handleSearch = () => {
  // Тут можна додати логіку для обробки пошуку
  console.log('Searching for:', searchTerm.value);
};
</script>

<template>
  <header class="bg-white shadow-sm p-4 flex justify-between items-center">
    <h1 class="text-2xl font-bold text-indigo-800">JMBRLD</h1>
    <div class="relative">
      <input
        v-model="searchTerm"
        type="text"
        placeholder="Search songs..."
        class="pl-10 pr-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
        @keyup.enter="handleSearch"
      >
      <Search 
        class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
        :size="20" 
      />
    </div>
  </header>
</template>