<template>
    <div :class="{ 'dark': isDarkMode }" class="flex h-screen bg-light dark:bg-dark">
        <LoginForm v-if="!isLoggedIn" @login="handleLogin" />
    <template v-else>
      <!-- Sidebar -->
      <div class="w-20 bg-sidebar text-white flex flex-col items-center py-4">
        <div class="mb-8">
          <Music :size="32" />
        </div>
        <nav class="flex flex-col items-center space-y-4 flex-grow">
          <SidebarButton>
            <Search :size="24" />
          </SidebarButton>
          <SidebarButton>
            <List :size="24" />
          </SidebarButton>
          <SidebarButton @click="showAddSongModal = true">
            <Plus :size="24" />
          </SidebarButton>
          <SidebarButton>
            <Settings :size="24" />
          </SidebarButton>
        </nav>
        <!-- Theme toggle button -->
        <SidebarButton @click="toggleTheme" class="mt-auto mb-4">
          <Sun v-if="isDarkMode" :size="24" />
          <Moon v-else :size="24" />
        </SidebarButton>
      </div>
  
      <!-- Main content -->
      <div class="flex-1 flex flex-col overflow-hidden">
        <!-- Header with search -->
        <header class="bg-header shadow p-4 flex justify-between items-center">
          <h1 class="text-2xl font-bold text-primary">JMBRLD</h1>
          <div class="relative w-64">
            <input
              v-model="searchTerm"
              type="text"
              placeholder="Search songs..."
              class="w-full pl-10 pr-4 py-2 rounded-full border focus:outline-none focus:ring-2 focus:ring-primary bg-input text-input-text border-input-border"
              @input="onUpdateSearch"
            >
            <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-input-icon" :size="20" />
          </div>
        </header>
  
        <!-- Song list and details -->
        <div class="flex-1 flex flex-col md:flex-row overflow-hidden">
          <!-- Song list -->
          <div :class="{'md:w-1/2': selectedSong && isWideScreen}" class="flex-1 overflow-y-auto p-4">
            <div class="space-y-4">
              <div v-for="song in visibleSongList" :key="song.id" 
                   @click="selectSong(song)"
                   class="bg-card rounded-lg shadow p-4 cursor-pointer hover:shadow-md transition">
                <div class="flex justify-between items-center">
                  <div>
                    <h2 class="ext-lg font-semibold text-card-title">{{ song.title }}</h2>
                    <p class="text-card-subtitle">{{ song.artist }}</p>
                  </div>
                  <div class="flex items-center space-x-2">
                    <span class="text-sm text-card-info">Key: {{ song.originalKey }}</span>
                    <ChevronRight v-if="isWideScreen && expandedSong" :size="20" class="text-card-icon" />
                    <ChevronUp v-else-if="!isWideScreen && expandedSong === song.id" :size="20" class="text-card-icon" />
                <ChevronDown v-else-if="isWideScreen && expandedSong" :size="20" class="text-card-icon" />
                  </div>
                </div>
                <!-- Mobile view: expandable content -->
                <div v-if="!isWideScreen && expandedSong === song.id" class="bg-header mt-4 p-4 rounded">
                  <h3 class="font-semibold mb-2 text-card-title">Chords:</h3>
                  <pre class="whitespace-pre-wrap font-mono text-sm text-card-subtitle">{{ song.chords }}</pre>
                </div>
              </div>
            </div>
          </div>
  
          <!-- Song details for wide screens -->
          <div v-if="selectedSong && isWideScreen" class="md:w-1/2 bg-header overflow-y-auto p-6 border-l border-input-border">
            <h2 class="text-2xl font-bold mb-2 text-card-title">{{ selectedSong.title }}</h2>
            <p class="text-xl text-card-subtitle mb-4">{{ selectedSong.artist }}</p>
            <div class="mb-6">
              <span class="inline-block bg-bumble rounded-full px-3 py-1 text-sm font-semibold text-card-subtitle mr-2">
                Key: {{ selectedSong.originalKey }}
              </span>
              <span class="inline-block bg-bumble rounded-full px-3 py-1 text-sm font-semibold text-card-subtitle">
                BPM: {{ selectedSong.bpm }}
              </span>
            </div>
            <h3 class="text-lg font-semibold mb-2 text-card-title">Chords:</h3>
            <pre class="whitespace-pre-wrap font-mono text-sm text-card-subtitle bg-light dark:bg-dark p-4 rounded">{{ selectedSong.chords }}</pre>
          </div>
        </div>
      </div>
  
      <!-- Add Song Modal -->
<Teleport to="body">
  <div :class="{ 'dark': !isDarkMode }" v-if="showAddSongModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-card rounded-lg p-8 w-full max-w-2xl shadow-xl">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-card-title">Add New Song</h2>
        <button @click="cancelAddSong" class="text-card-icon hover:text-primary transition-colors">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>

      <div class="grid grid-cols-6 gap-6">
        <div class="col-span-3">
          <label for="title" class="block text-sm font-medium text-card-title mb-2">Title</label>
          <input v-model="newSong.title" id="title" placeholder="Song Title" class="w-full p-3 rounded-md text-input-text focus:ring-primary focus:border-primary">
        </div>
        <div class="col-span-3">
          <label for="artist" class="block text-sm font-medium text-card-title mb-2">Artist</label>
          <input v-model="newSong.artist" id="artist" placeholder="Artist Name" class="w-full p-3 rounded-md text-input-text focus:ring-primary focus:border-primary">
        </div>
        <div class="col-span-2">
          <label for="key" class="block text-sm font-medium text-card-title mb-2">Key</label>
          <select v-model="newSong.originalKey" id="key" class="w-full p-3 rounded-md text-input-text focus:ring-primary focus:border-primary">
            <option v-for="key in musicKeys" :key="key" :value="key">{{ key }}</option>
          </select>
        </div>
        <div class="col-span-2">
          <label for="bpm" class="block text-sm font-medium text-card-title mb-2">BPM</label>
          <input v-model.number="newSong.bpm" id="bpm" type="number" min="50" max="150" class="w-full p-3 rounded-md text-input-text focus:ring-primary focus:border-primary">
        </div>
        <div class="col-span-6">
          <label for="chords" class="block text-sm font-medium text-card-title mb-2">Chords</label>
          <textarea v-model="newSong.chords" id="chords" rows="5" placeholder="Enter chords here" class="w-full p-3 rounded-md text-input-text focus:ring-primary focus:border-primary"></textarea>
        </div>
      </div>

      <div class="flex justify-end mt-8 space-x-4">
        <button @click="cancelAddSong" class="px-6 py-3 bg-card-expanded text-card-title rounded hover:bg-bumble transition-colors duration-300">
          Cancel
        </button>
        <button 
          @click="addNewSong" 
          :disabled="!isFormValid" 
          class="px-6 py-3 bg-primary text-white rounded hover:bg-primary-hover transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Add Song
        </button>
      </div>
    </div>
  </div>
</Teleport>
</template>
    </div>
  </template>
  
  <script setup lang="ts">
  import LoginForm from './components/LoginForm.vue'
  import { ref, computed, onMounted, onUnmounted } from 'vue'
  import { Search, Music, List, Settings, ChevronDown, ChevronUp, ChevronRight, Sun, Moon, Plus } from 'lucide-vue-next'
  
  interface Song {
    id: number;
    title: string;
    artist: string;
    originalKey: string;
    chords: string;
    bpm: string;
  }
  
  const isLoggedIn = ref(false);

const handleLogin = () => {
  isLoggedIn.value = true;
  localStorage.setItem('isLoggedIn', 'true');
};

  const musicKeys = [
    'C', 'C#', 'Db', 'D', 'D#', 'Eb', 'E', 'F', 'F#', 'Gb', 'G', 'G#', 'Ab', 'A', 'A#', 'Bb', 'B'
  ]
  
  const selectedSong = ref<Song | null>(null)
  const expandedSong = ref<number | null>(null)
  const isWideScreen = ref(window.innerWidth >= 768)
  const isDarkMode = ref(false)
  const showAddSongModal = ref(false)
  const searchTerm = ref("")
  
  const songs2 = ref<Song[]>([
    {
      "id": 1,
      "title": "Nothing is impossible",
      "artist": "Planetshakers",
      "bpm": "128",
      "originalKey": "C",
      "chords": "Chorus: xyz C G Am F // xyz Interlude: xyz F C Dm F // xyz Verse: xyz C Dm F xyz Am G F xyz Pre-Chorus: xyz Am G F xyz Am G Dm F xyz Bridge: xyz F C Dm F //"
    },
    {
      "id": 2,
      "title": "Обійми мене",
      "artist": "Океан Ельзи",
      "bpm": "80",
      "originalKey": "D#",
      "chords": "Interlude: xyz G7 F G7 F D# Cm xyz Verse: xyz Cm Gm G# Gm xyz Cm Gm G# G7 xyz Chorus: xyz Cm Gm G# G7"
    },
    {
      "id": 3,
      "title": "Behind Blue Eyes",
      "artist": "Limp Bizkit",
      "bpm": "90",
      "originalKey": "D",
      "chords": "Verse: xyz Em G D C A // xyz Chorus: xyz C D G C D E xyz Bm C D A"
    }
  ])
  
  const newSong = ref<Omit<Song, 'id'>>({
    title: '',
    artist: '',
    originalKey: '',
    chords: '',
    bpm: '',
  })
  
  const addNewSong = () => {
    if (isFormValid.value) {
      const songToAdd: Song = {
        ...newSong.value,
        id: Date.now(),
      }
      songs2.value.push(songToAdd)
      resetForm()
      showAddSongModal.value = false
      alert('New song added successfully!')
    }
  }
  
  const cancelAddSong = () => {
    resetForm()
    showAddSongModal.value = false
  }
  
  const resetForm = () => {
    newSong.value = {
      title: '',
      artist: '',
      originalKey: '',
      chords: '',
      bpm: '',
    }
  }
  
  const isFormValid = computed(() => {
    return newSong.value.title.trim() !== '' && 
           newSong.value.artist.trim() !== '' && 
           newSong.value.originalKey !== ''
  })
  
  const onUpdateSearch = (event: Event) => {
    searchTerm.value = (event.target as HTMLInputElement).value
  }
  
  const searchEmp = (items: Song[], term: string) => {
    if (term.length === 0) {
      return items
    }
    return items.filter(item => 
      item.title.toLowerCase().includes(term.toLowerCase()) ||
      item.artist.toLowerCase().includes(term.toLowerCase())
    )
  }
  
  const visibleSongList = computed(() => searchEmp(songs2.value, searchTerm.value))
  
  const selectSong = (song: Song) => {
    if (isWideScreen.value) {
      selectedSong.value = song
    } else {
      expandedSong.value = expandedSong.value === song.id ? null : song.id
    }
  }
  
  const toggleTheme = () => {
    isDarkMode.value = !isDarkMode.value
    localStorage.setItem('darkMode', isDarkMode.value.toString())
  }
  
  const handleResize = () => {
    isWideScreen.value = window.innerWidth >= 768
  }
  
  onMounted(() =>{
    const loggedIn = localStorage.getItem('isLoggedIn');
  if (loggedIn === 'true') {
    isLoggedIn.value = true;
  }
    window.addEventListener('resize', handleResize)
    const savedTheme = localStorage.getItem('darkMode')
    if (savedTheme !== null) {
      isDarkMode.value = savedTheme === 'true'
    } else {
      isDarkMode.value = window.matchMedia('(prefers-color-scheme: dark)').matches
    }
  })


onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
  </script>
  
  <style>
:root {
  --color-primary: #3730a3;
  --color-primary-hover: #4338ca;
  --color-background: #f3f4f6;
  --color-text: #111827;
  --color-text-secondary: #4b5563;
  --color-card-background: #ffffff;
  --color-card-expanded: #f9fafb;
  --color-input-background: #ffffff;
  --color-input-text: #111827;
  --color-input-border: #d1d5db;
  --color-input-icon: #9ca3af;
  --color-sidebar: #3730a3;
  --color-sidebar-hover: #4338ca;
  --color-bumble: #cac6fb;
}

.dark {
  --color-primary: #a5b4fc;
  --color-primary-hover: #818cf8;
  --color-background: #111827;
  --color-text: #f9fafb;
  --color-text-secondary: #9ca3af;
  --color-card-background: #1f2937;
  --color-card-expanded: #374151;
  --color-input-background: #374151;
  --color-input-text: #f9fafb;
  --color-input-border: #4b5563;
  --color-input-icon: #9ca3af;
  --color-sidebar: #1e1b4b;
  --color-sidebar-hover: #3730a3;
  --color-bumble: #374151;
}

/* Загальні стилі */
.bg-light, .bg-dark { background-color: var(--color-background); }
.bg-sidebar { background-color: var(--color-sidebar); }
.bg-header, .bg-card, .bg-modal { background-color: var(--color-card-background); }
.bg-card-expanded { background-color: var(--color-card-expanded); }
.bg-bumble { background-color: var(--color-bumble); }

.text-primary { color: var(--color-primary); }
.text-input-text, .text-modal-input { color: var(--color-input-text); }
.text-input-icon { color: var(--color-input-icon); }
.text-card-title, .text-modal-title, .text-sidebar-details-title { color: var(--color-text); }
.text-card-subtitle, .text-card-info, .text-sidebar-details-subtitle { color: var(--color-text-secondary); }
.text-card-icon, .text-sidebar-details-text { color: var(--color-text); }

.border-input-border { border-color: var(--color-input-border); }

.focus\:ring-primary:focus { --tw-ring-color: var(--color-primary); }
.focus\:border-primary:focus { border-color: var(--color-primary); }

.hover\:bg-sidebar-hover:hover { background-color: var(--color-sidebar-hover); }

/* Компонент-специфічні стилі */
.SidebarButton {
  @apply p-2 hover:bg-sidebar-hover rounded-full transition-colors duration-200;
}

/* Utility класи */
.bg-primary { background-color: var(--color-primary); }
.bg-primary-dark { background-color: var(--color-primary-hover); }
  </style>