<template>
    <div 
      v-if="isVisible"
      class="fixed bottom-4 right-4 bg-primary text-white px-4 py-2 rounded shadow-lg transition-all duration-300"
      :class="{ 'translate-y-0 opacity-100': isVisible, 'translate-y-full opacity-0': !isVisible }"
    >
      {{ message }}
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, watch } from 'vue';
  
  const props = defineProps<{
    message: string;
    duration?: number;
  }>();
  
  const isVisible = ref(false);
  
  watch(() => props.message, (newMessage) => {
    if (newMessage) {
      isVisible.value = true;
      setTimeout(() => {
        isVisible.value = false;
      }, props.duration || 3000);
    }
  });
  </script>