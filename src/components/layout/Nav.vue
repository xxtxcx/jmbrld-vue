<script setup lang="ts">
import { ref, computed } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import { Home, List, Settings } from 'lucide-vue-next';

const route = useRoute();

const navItems = ref([
  { to: '/', icon: Home, label: 'All songs' },
  { to: '/my-chart', icon: List, label: 'My List' },
]);

// Обчислювана властивість для визначення активного маршруту
const currentPath = computed(() => route.path);
</script>

<template>
  <nav class="bg-indigo-700 text-white h-screen w-64 flex flex-col">
    <div class="p-4">
      <h1 class="text-2xl font-bold">JMBRLD</h1>
    </div>
    <ul class="flex-grow">
      <li v-for="item in navItems" :key="item.to">
        <RouterLink
          :to="item.to"
          class="flex items-center p-4 text-sm hover:bg-indigo-600"
          :class="{ 'bg-indigo-800': currentPath === item.to }"
        >
          <component :is="item.icon" class="w-5 h-5 mr-2" />
          <span>{{ item.label }}</span>
        </RouterLink>
      </li>
    </ul>
    <div class="p-4">
      <RouterLink to="/settings" class="flex items-center text-sm hover:text-gray-300">
        <Settings class="w-5 h-5 mr-2" />
        Settings
      </RouterLink>
    </div>
  </nav>
</template>