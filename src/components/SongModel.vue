<template>
    <q-dialog v-model="showAddSongModal" persistent>
      <q-card class="w-full max-w-md dark:bg-gray-800">
        <q-card-section>
          <div class="text-h6 dark:text-white">Add New Song</div>
        </q-card-section>
  
        <q-card-section class="q-pt-none">
          <q-input v-model="newSong.title" label="Title" class="q-mb-md dark:text-white" dark />
          <q-input v-model="newSong.artist" label="Artist" class="q-mb-md dark:text-white" dark />
          <q-input v-model="newSong.originalKey" label="Key" class="q-mb-md dark:text-white" dark />
          <q-input v-model="newSong.bpm" label="BPM" type="number" class="q-mb-md dark:text-white" dark />
          <q-input v-model="newSong.chords" label="Chords" type="textarea" class="q-mb-md dark:text-white" dark />
        </q-card-section>
  
        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn flat label="Add Song" color="primary" @click="addNewSong" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  
  const showAddSongModal = ref(false)
  const newSong = ref({
    title: '',
    artist: '',
    originalKey: '',
    bpm: '',
    chords: ''
  })
  
  const addNewSong = () => {
    // Implement the logic to add the new song here
    console.log(newSong.value)
  }
  </script>
  