<template>
    <div class="space-y-4">
      <div v-for="song in songs" :key="song._id" 
            @click="$emit('selectSong', song)"
           class="bg-card rounded-lg shadow p-4 cursor-pointer hover:shadow-md transition relative group">
        <div class="flex justify-between items-center">
          <div>
            <h2 class="text-lg font-semibold text-card-title">{{ song.title }}</h2>
            <p class="text-card-subtitle">{{ song.artist }}</p>
          </div>
          <div class="flex items-center space-x-2">
            <button v-if="showRemoveButton" @click.stop="$emit('removeSong', song)" class="remove-song-btn">
      <Trash2 :size="16" />
    </button>
            <button v-else
              @click.stop="$emit('addToPlaylist', song)" 
              class="text-primary hover:text-primary-hover opacity-0 group-hover:opacity-100 transition-opacity p-1 bg-bumble rounded-full"
            >
              <Plus :size="16" />
            </button>
            <span class="key-display">{{ song.originalKey }}</span>
            <button class="text-card-icon p-1 bg-bumble rounded-full">
              <ChevronDown :size="16" />
            </button>
          </div>
        </div>
        <!-- Mobile view: expandable content -->
        <div v-if="!isWideScreen && expandedSong === song._id" class="bg-header mt-4 p-4 rounded">
          <h3 class="text-lg font-semibold mb-2 text-card-title">Chords:</h3>
          <pre class="whitespace-pre-wrap font-mono text-sm text-card-subtitle bg-light dark:bg-dark p-4 rounded">{{ song.chords }}</pre>
          <!-- <h3 class="font-semibold mb-2 text-card-title">Chords:</h3>
          <pre class="whitespace-pre-wrap font-mono text-sm text-card-subtitle">{{ song.chords }}</pre> -->
        </div>
        <div v-else-if="isWideScreen && expandedSong === song._id" class="bg-header mt-4 p-4 rounded">
          <h3 class="text-lg font-semibold mb-2 text-card-title">Chords:</h3>
          <pre class="whitespace-pre-wrap font-mono text-sm text-card-subtitle bg-light dark:bg-dark p-4 rounded">{{ song.chords }}</pre>
          <!-- <h3 class="font-semibold mb-2 text-card-title">Chords:</h3>
          <pre class="whitespace-pre-wrap font-mono text-sm text-card-subtitle">{{ song.chords }}</pre> -->
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { Plus, ChevronDown, Trash2 } from 'lucide-vue-next'
  
  interface Song {
    _id: string;
    title: string;
    artist: string;
    originalKey: string;
    chords: string;
    bpm: string;
  }
  
  const props = defineProps<{
    songs: Song[];
    expandedSong: string | null;
    isWideScreen: boolean;
    showRemoveButton: boolean;
  }>()
  
  console.log('Songs in SongList:', props.songs)

  const emit = defineEmits<{
    (e: 'selectSong', song: Song): void;
    (e: 'addToPlaylist', song: Song): void;
    (e: 'removeSong', song: Song): void;
  }>()
  
  const selectSong = (song: Song) => {
    emit('selectSong', song)
  }
  </script>
  <style scoped>
  .key-display {
    @apply inline-flex justify-center items-center min-w-[2.8rem] h-6 font-semibold bg-bumble rounded-full;
  }
  
  @media (max-width: 640px) {
    .key-display {
      min-width: 2.2rem;
      height: 1.5rem;
      font-size: 0.75rem;
    }
  }
  </style>