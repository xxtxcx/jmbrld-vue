<!-- <template>
    <div class="w-20 bg-indigo-800 dark:bg-indigo-900 text-white flex flex-col items-center py-4">
      <div class="mb-8">
        <Music :size="32" />
      </div>
      <nav class="flex flex-col items-center space-y-4 flex-grow">
        <q-btn flat round color="white" class="p-2 hover:bg-indigo-700 dark:hover:bg-indigo-800">
          <Search :size="24" />
        </q-btn>
        <q-btn flat round color="white" class="p-2 hover:bg-indigo-700 dark:hover:bg-indigo-800">
          <List :size="24" />
        </q-btn>
        <!-- Button for adding songs -->
        <!-- <q-btn flat round color="white" class="p-2 hover:bg-indigo-700 dark:hover:bg-indigo-800" @click="showAddSongModal = true">
          <Plus :size="24" />
        </q-btn>
        <q-btn flat round color="white" class="p-2 hover:bg-indigo-700 dark:hover:bg-indigo-800">
          <Settings :size="24" />
        </q-btn>
      </nav>
      <!-- Theme toggle button -->
      <!-- <q-btn flat round color="white" class="mt-auto mb-4 p-2 hover:bg-indigo-700 dark:hover:bg-indigo-800" @click="toggleTheme">
        <Sun v-if="isDarkMode" :size="24" />
        <Moon v-else :size="24" />
      </q-btn>
    </div>
  </template>
  
  <script setup lang="ts">
  import { Sun, Moon, Plus, Search, List, Settings, Music } from 'lucide-vue-next'
  import { ref } from 'vue';
  const showAddSongModal = ref(false)
  const isDarkMode = ref(false)
  const toggleTheme = () => {
    isDarkMode.value = !isDarkMode.value
  }
  </script> --> --> -->
  

  <template>
    <div class="w-20 bg-indigo-800 dark:bg-indigo-900 text-white flex flex-col items-center py-4">
      <div class="mb-8">
        <Music :size="32" />
      </div>
      <nav class="flex flex-col items-center space-y-4 flex-grow">
        <q-btn flat round color="white" class="p-2 hover:bg-indigo-700 dark:hover:bg-indigo-800">
          <Search :size="24" />
        </q-btn>
        <q-btn flat round color="white" class="p-2 hover:bg-indigo-700 dark:hover:bg-indigo-800">
          <List :size="24" />
        </q-btn>
        <!-- Button for adding songs -->
        <q-btn flat round color="white" class="p-2 hover:bg-indigo-700 dark:hover:bg-indigo-800" @click="showAddSongModal = true">
          <Plus :size="24" />
        </q-btn>
        <q-btn flat round color="white" class="p-2 hover:bg-indigo-700 dark:hover:bg-indigo-800">
          <Settings :size="24" />
        </q-btn>
      </nav>
      <!-- Theme toggle button -->
      <q-btn flat round color="white" class="mt-auto mb-4 p-2 hover:bg-indigo-700 dark:hover:bg-indigo-800" @click="toggleTheme">
        <Sun v-if="isDarkMode" :size="24" />
        <Moon v-else :size="24" />
      </q-btn>
    </div>
  </template>
  
  <script setup lang="ts">
  import { Sun, Moon, Plus, Search, List, Settings, Music } from 'lucide-vue-next'
import { ref } from 'vue';
  
  const showAddSongModal = ref(false)
  const isDarkMode = ref(false)
  const toggleTheme = () => {
    isDarkMode.value = !isDarkMode.value
    if (isDarkMode.value) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }
  </script>
  
  <style scoped>
  /* Add any custom styling here if needed */
  </style>
  