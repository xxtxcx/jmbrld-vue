<template>
    <div v-if="song" class="bg-header overflow-y-auto p-6 border-l border-input-border">
      <h2 class="text-2xl font-bold mb-2 text-card-title">{{ song.title }}</h2>
      <p class="text-xl text-card-subtitle mb-4">{{ song.artist }}</p>
      <div class="mb-6">
        <span class="inline-block bg-bumble rounded-full px-3 py-1 text-sm font-semibold text-card-subtitle mr-2">
          Key: {{ song.originalKey }}
        </span>
        <span class="inline-block bg-bumble rounded-full px-3 py-1 text-sm font-semibold text-card-subtitle">
          BPM: {{ song.bpm }}
        </span>
      </div>
      <h3 class="text-lg font-semibold mb-2 text-card-title">Chords:</h3>
      <pre class="whitespace-pre-wrap font-mono text-sm text-card-subtitle bg-light dark:bg-dark p-4 rounded">{{ song.chords }}</pre>
    </div>
  </template>
  
  <script setup lang="ts">
  interface Song {
    _id: string;
    title: string;
    artist: string;
    originalKey: string;
    chords: string;
    bpm: string;
  }
  
  defineProps<{
    song: Song | null;
  }>()
  </script>