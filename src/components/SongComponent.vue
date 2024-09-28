<template>
    <div class="bg-card rounded-lg shadow p-4 cursor-pointer hover:shadow-md transition relative group">
      <div class="flex justify-between items-center">
        <div>
          <h2 class="text-lg font-semibold text-card-title">{{ song.title }}</h2>
          <p class="text-card-subtitle">{{ song.artist }}</p>
        </div>
        <div class="flex items-center space-x-2">
          <button 
            v-if="!isInPlaylist"
            @click.stop="$emit('add-to-playlist', song)" 
            class="text-primary hover:text-primary-hover opacity-0 group-hover:opacity-100 transition-opacity p-1 bg-bumble rounded-full"
          >
            <Plus :size="16" />
          </button>
          <button 
            v-else
            @click.stop="$emit('remove-from-playlist', song._id)" 
            class="text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity p-1 bg-bumble rounded-full"
          >
            <Trash2 :size="16" />
          </button>
          <span class="key-display">{{ song.originalKey }}</span>
          <button @click.stop="isExpanded = !isExpanded" class="text-card-icon p-1 bg-bumble rounded-full">
            <ChevronDown v-if="!isExpanded" :size="16" />
            <ChevronUp v-if="isExpanded" :size="16" />
          </button>
        </div>
      </div>
      <div v-if="isExpanded" class="mt-4 p-4 bg-card-expanded rounded">
        <h3 class="font-semibold mb-2 text-card-title">Chords:</h3>
        <pre class="whitespace-pre-wrap font-mono text-sm text-card-subtitle">{{ song.chords }}</pre>
        <p class="mt-2 text-card-info">BPM: {{ song.bpm }}</p>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-vue-next';
  
  interface Song {
    _id: string;
    title: string;
    artist: string;
    originalKey: string;
    chords: string;
    bpm: string;
  }
  
  const props = defineProps<{
    song: Song;
    isInPlaylist: boolean;
  }>();
  
  const isExpanded = ref(false);
  
  defineEmits(['add-to-playlist', 'remove-from-playlist']);
  </script>