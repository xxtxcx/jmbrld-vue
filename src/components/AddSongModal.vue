<template>
    <Teleport to="body">
      <div :class="{ 'dark': !isDarkMode }" v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-card rounded-lg p-8 w-full max-w-2xl shadow-xl">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold text-card-title">Add New Song</h2>
            <button @click="cancel" class="text-card-icon hover:text-primary transition-colors">
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
            <button @click="cancel" class="px-6 py-3 bg-card-expanded text-card-title rounded hover:bg-bumble transition-colors duration-300">
              Cancel
            </button>
            <button 
              @click="addSong" 
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
  
  <script setup lang="ts">
  import { ref, computed } from 'vue'
  
  interface Song {
    title: string;
    artist: string;
    originalKey: string;
    chords: string;
    bpm: string;
  }
  
  const props = defineProps<{
    show: boolean;
    isDarkMode: boolean;
  }>()
  
  const emit = defineEmits<{
    (e: 'close'): void;
    (e: 'addSong', song: Song): void;
  }>()
  
  const musicKeys = [
    'C', 'C#', 'Db', 'D', 'D#', 'Eb', 'E', 'F', 'F#', 'Gb', 'G', 'G#', 'Ab', 'A', 'A#', 'Bb', 'B'
  ]
  
  const newSong = ref<Song>({
    title: '',
    artist: '',
    originalKey: '',
    chords: '',
    bpm: '',
  })
  
  const isFormValid = computed(() => {
    return newSong.value.title.trim() !== '' && 
           newSong.value.artist.trim() !== '' && 
           newSong.value.originalKey !== ''
  })
  
  const addSong = () => {
    if (isFormValid.value) {
      emit('addSong', newSong.value)
      resetForm()
    }
  }
  
  const cancel = () => {
    resetForm()
    emit('close')
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
  </script>