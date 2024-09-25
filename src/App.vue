<template>
    <div :class="{ 'dark': isDarkMode }" class="flex h-screen bg-light dark:bg-dark">
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
  
        <!-- Add Song Modal -->
        <q-dialog v-model="showAddSongModal" persistent>
          <q-card class="w-full max-w-md bg-modal">
            <q-card-section>
              <div class="text-h6 text-modal-title">Add New Song</div>
            </q-card-section>
  
            <q-card-section class="q-pt-none">
              <q-input v-model="newSong.title" label="Title" class="q-mb-md text-modal-input" dark />
              <q-input v-model="newSong.artist" label="Artist" class="q-mb-md text-modal-input" dark />
              <q-input v-model="newSong.originalKey" label="Key" class="q-mb-md text-modal-input" dark />
              <q-input v-model="newSong.bpm" label="BPM" type="number" class="q-mb-md text-modal-input" dark />
              <q-input v-model="newSong.chords" label="Chords" type="textarea" class="q-mb-md text-modal-input" dark />
            </q-card-section>
  
            <q-card-actions align="right">
              <q-btn flat label="Cancel" color="primary" v-close-popup />
              <q-btn flat label="Add Song" color="primary" @click="addNewSong" v-close-popup />
            </q-card-actions>
          </q-card>
        </q-dialog>
  
        <!-- Song list -->
        <div class="flex-1 overflow-y-auto p-4 bg-content">
          <div class="space-y-4">
            <div v-for="song in visibleSongList" :key="song.id" class="bg-card rounded-lg shadow p-4 cursor-pointer hover:shadow-md transition">
              <div class="flex justify-between items-center" @click="toggleSongExpansion(song.id)">
                <div>
                  <h2 class="text-lg font-semibold text-card-title">{{ song.title }}</h2>
                  <p class="text-card-subtitle">{{ song.artist }}</p>
                </div>
                <div class="flex items-center space-x-2">
                  <span class="text-sm text-card-info">Key: {{ song.originalKey }}</span>
                  <ChevronUp v-if="expandedSong === song.id" :size="20" class="text-card-icon" />
                  <ChevronDown v-else :size="20" class="text-card-icon" />
                </div>
              </div>
              <div v-if="expandedSong === song.id" class="mt-4 p-4 bg-card-expanded rounded">
                <h3 class="font-semibold mb-2 text-card-expanded-title">Chords:</h3>
                <pre class="whitespace-pre-wrap font-mono text-sm text-card-expanded-text">{{ song.chords }}</pre>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Song details sidebar - hidden on mobile -->
      <div v-if="selectedSong" class="hidden md:block w-64 bg-sidebar-details shadow-lg p-4">
        <h2 class="text-xl font-bold mb-2 text-sidebar-details-title">{{ selectedSong.title }}</h2>
        <p class="text-sidebar-details-subtitle mb-4">{{ selectedSong.artist }}</p>
        <div>
          <h3 class="font-semibold mb-2 text-sidebar-details-subtitle">Transpose</h3>
          <div class="flex justify-between">
            <q-btn color="primary" label="-" />
            <span class="text-sidebar-details-text">Key: {{ selectedSong.originalKey }}</span>
            <q-btn color="primary" label="+" />
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, onMounted } from 'vue'
  import { Search, Music, List, Settings, ChevronDown, ChevronUp, Sun, Moon, Plus } from 'lucide-vue-next'
  
  interface Song {
    id: number;
    title: string;
    artist: string;
    originalKey: string;
    chords: string;
    bpm: string;
  }
  
  const selectedSong = ref<Song | null>(null)
  const expandedSong = ref<number | null>(null)
  const isDarkMode = ref(false)
  const showAddSongModal = ref(false)
  
  const songs2 = ref<Song[]>([
      {
          "id":1,
          "title": "Nothing is impossible",
          "artist":"Planetshakers",
          "bpm":"128",
          "originalKey":"C",
          "chords": "Chorus: xyz C G Am F // xyz Interlude: xyz F C Dm F // xyz Verse: xyz C Dm F xyz Am G F xyz Pre-Chorus: xyz Am G F xyz Am G Dm F xyz Bridge: xyz F C Dm F //"
      },
      {
          "id":2,
          "title": "Обійми мене",
          "artist":"Океан Ельзи",
          "bpm":"80",
          "originalKey":"D#",
          "chords": "Interlude: xyz G7 F G7 F D# Cm xyz Verse: xyz Cm Gm G# Gm xyz Cm Gm G# G7 xyz Chorus: xyz Cm Gm G# G7"
      },
      {
          "id":3,
          "title": "Behind Blue Eyes",
          "artist":"Limp Bizkit",
          "bpm":"90",
          "originalKey":"D",
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
    const songToAdd: Song = {
      ...newSong.value,
      id: Date.now(),
    }
    songs2.value.push(songToAdd)
    newSong.value = {
      title: '',
      artist: '',
      originalKey: '',
      chords: '',
      bpm: '',
    }
    showAddSongModal.value = false
  }
  
  const searchTerm = ref("")
  
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
  
  const toggleSongExpansion = (id: number) => {
    expandedSong.value = expandedSong.value === id ? null : id
  }
  
  const toggleTheme = () => {
    isDarkMode.value = !isDarkMode.value
    localStorage.setItem('darkMode', isDarkMode.value.toString())
  }
  
  onMounted(() => {
    const savedTheme = localStorage.getItem('darkMode')
    if (savedTheme !== null) {
      isDarkMode.value = savedTheme === 'true'
    } else {
      isDarkMode.value = window.matchMedia('(prefers-color-scheme: dark)').matches
    }
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
  }
  
  .bg-light { background-color: var(--color-background); }
  .bg-dark { background-color: var(--color-background); }
  .bg-sidebar { background-color: var(--color-sidebar); }
  .bg-header { background-color: var(--color-card-background); }
  .bg-content { background-color: var(--color-background); }
  .bg-card { background-color: var(--color-card-background); }
  .bg-card-expanded { background-color: var(--color-card-expanded); }
  .bg-modal { background-color: var(--color-card-background); }
  .bg-sidebar-details { background-color: var(--color-sidebar); }
  
  .text-primary { color: var(--color-primary); }
  .text-input-text { color: var(--color-input-text); }
  .text-input-icon { color: var(--color-input-icon); }
  .text-modal-title { color: var(--color-text); }
  .text-modal-input { color: var(--color-input-text); }
  .text-card-title { color: var(--color-text); }
  .text-card-subtitle { color: var(--color-text-secondary); }
  .text-card-info { color: var(--color-text-secondary); }
  .text-card-icon { color: var(--color-text); }
  .text-card-expanded-title { color: var(--color-text); }
  .text-card-expanded-text { color: var(--color-text-secondary); }
  .text-sidebar-details-title { color: var(--color-text); }
  .text-sidebar-details-subtitle { color: var(--color-text-secondary); }
  .text-sidebar-details-text { color: var(--color-text); }
  
  .border-input-border { border-color: var(--color-input-border); }
  
  .focus\:ring-primary:focus { --tw-ring-color: var(--color-primary); }
  
  .hover\:bg-sidebar-hover:hover { background-color: var(--color-sidebar-hover); }
  
  /* Additional utility classes */
  .SidebarButton {
    @apply p-2 hover:bg-sidebar-hover rounded-full transition-colors duration-200;
  }
  </style>