<template>
    <div class="space-y-4">
      <div v-for="song in songs" :key="song._id" 
           @click="selectSong(song)"
           class="bg-card rounded-lg shadow p-4 cursor-pointer hover:shadow-md transition relative group">
        <div class="flex justify-between items-center">
          <div>
            <h2 class="text-lg font-semibold text-card-title">{{ song.title }}</h2>
            <p class="text-card-subtitle">{{ song.artist }}</p>
          </div>
          <div class="flex items-center space-x-2">
            <button 
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
          <h3 class="font-semibold mb-2 text-card-title">Chords:</h3>
          <pre class="whitespace-pre-wrap font-mono text-sm text-card-subtitle">{{ song.chords }}</pre>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { Plus, ChevronDown } from 'lucide-vue-next'
  
  interface Song {
    _id: number;
    title: string;
    artist: string;
    originalKey: string;
    chords: string;
    bpm: string;
  }
  
  defineProps<{
    songs: Song[];
    expandedSong: number | null;
    isWideScreen: boolean;
  }>()
  
  const emit = defineEmits<{
    (e: 'selectSong', song: Song): void;
    (e: 'addToPlaylist', song: Song): void;
  }>()
  
  const selectSong = (song: Song) => {
    emit('selectSong', song)
  }
  </script>