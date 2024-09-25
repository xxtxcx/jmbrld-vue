<!-- LoginForm.vue -->
<template>
    <div class="fixed inset-0 bg-background flex items-center justify-center">
      <div class="bg-card p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 class="text-2xl font-bold mb-6 text-card-title">Login</h2>
        <form @submit.prevent="login">
          <div class="mb-4">
            <label for="username" class="block text-sm font-medium text-card-title mb-2">Username</label>
            <input v-model="username" id="username" type="text" required
                   class="w-full p-3 rounded-md border-input-border bg-input-background text-input-text focus:ring-primary focus:border-primary">
          </div>
          <div class="mb-6">
            <label for="password" class="block text-sm font-medium text-card-title mb-2">Password</label>
            <input v-model="password" id="password" type="password" required
                   class="w-full p-3 rounded-md border-input-border bg-input-background text-input-text focus:ring-primary focus:border-primary">
          </div>
          <button type="submit"
                  class="w-full px-6 py-3 bg-primary text-white rounded hover:bg-primary-hover transition-colors duration-300">
            Log In
          </button>
        </form>
        <p v-if="error" class="mt-4 text-red-500 text-center">{{ error }}</p>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const username = ref('');
  const password = ref('');
  const error = ref('');
  
  const emit = defineEmits(['login']);

const login = () => {
  if (username.value === 'admin' && password.value === 'password') {
    emit('login');
    // Очищаємо поля введення
    username.value = '';
    password.value = '';
    error.value = '';
  } else {
    error.value = 'Invalid username or password';
  }
};
  </script>