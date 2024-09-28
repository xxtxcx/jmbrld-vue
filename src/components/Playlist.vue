<template>
    <div class="flex-1 overflow-y-auto p-4">
      <h2 class="text-2xl font-bold mb-4 text-card-title">My Playlists</h2>
      
      <!-- Playlist tabs -->
      <div class="flex mb-4 border-b border-gray-200">
        <button
          v-for="(playlistItem, index) in playlists"
          :key="index"
          @click="selectPlaylist(index)"
          class="py-2 px-4 mr-2 focus:outline-none"
          :class="{'border-b-2 border-primary text-primary': selectedPlaylistIndex === index}"
        >
          {{ playlistItem.name }}
        </button>
        <button
          @click="createNewPlaylist"
          class="py-2 px-4 text-primary hover:text-primary-hover"
        >
          <Plus :size="20" />
        </button>
      </div>
      
      <!-- Selected playlist content -->
      <div v-if="selectedPlaylist" class="space-y-4">
        <div v-for="song in selectedPlaylist.songs" :key="song._id" 
             class="bg-card rounded-lg shadow p-4 cursor-pointer hover:shadow-md transition">
          <div class="flex justify-between items-center">
            <div>
              <h3 class="text-lg font-semibold text-card-title">{{ song.title }}</h3>
              <p class="text-card-subtitle">{{ song.artist }}</p>
            </div>
            <button @click="removeFromPlaylist(song._id)" class="text-red-500 hover:text-red-700">
              <Trash2 :size="20" />
            </button>
          </div>
        </div>
      </div>
      
      <!-- Save local playlist button -->
      <button 
        v-if="selectedPlaylistIndex === 0 && selectedPlaylist && selectedPlaylist.songs.length > 0"
        @click="saveLocalPlaylist"
        class="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary-hover transition-colors duration-300"
      >
        Save Local Playlist
      </button>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, onMounted, watch } from 'vue'
  import { Plus, Trash2 } from 'lucide-vue-next'
  import axios from 'axios'
  
  interface Song {
    _id: number;
    title: string;
    artist: string;
    originalKey: string;
    chords: string;
    bpm: string;
  }
  
  interface Playlist {
    _id?: string;
    name: string;
    songs: Song[];
  }
  
  const playlists = ref<Playlist[]>([
    { name: 'Local Playlist', songs: [] }
  ])
  const selectedPlaylistIndex = ref(0)
  
  const selectedPlaylist = computed(() => playlists.value[selectedPlaylistIndex.value])
  
  const selectPlaylist = (index: number) => {
    selectedPlaylistIndex.value = index
  }
  
  const createNewPlaylist = () => {
    const name = prompt('Enter playlist name:')
    if (name) {
      playlists.value.push({ name, songs: [] })
      selectedPlaylistIndex.value = playlists.value.length - 1
    }
  }
  
  const removeFromPlaylist = (songId: number) => {
    if (selectedPlaylist.value) {
      selectedPlaylist.value.songs = selectedPlaylist.value.songs.filter(song => song._id !== songId)
      if (selectedPlaylistIndex.value === 0) {
        localStorage.setItem('localPlaylist', JSON.stringify(selectedPlaylist.value.songs))
      }
    }
  }
  
  const saveLocalPlaylist = async () => {
    if (selectedPlaylistIndex.value === 0 && selectedPlaylist.value) {
      try {
        const response = await axios.post('/api/playlists', {
          name: 'Saved Local Playlist',
          songs: selectedPlaylist.value.songs
        })
        playlists.value.push(response.data)
        alert('Local playlist saved successfully!')
      } catch (error) {
        console.error('Error saving local playlist:', error)
        alert('Failed to save local playlist. Please try again.')
      }
    }
  }
  
  const fetchPlaylists = async () => {
    try {
      const response = await axios.get('/api/playlists')
      playlists.value = [playlists.value[0], ...response.data]
    } catch (error) {
      console.error('Error fetching playlists:', error)
    }
  }
  
  onMounted(() => {
    const savedLocalPlaylist = localStorage.getItem('localPlaylist')
    if (savedLocalPlaylist) {
      playlists.value[0].songs = JSON.parse(savedLocalPlaylist)
    }
    fetchPlaylists()
  })
  
  // Watch for changes in the local playlist and update localStorage
  watch(() => playlists.value[0].songs, (newSongs) => {
    localStorage.setItem('localPlaylist', JSON.stringify(newSongs))
  }, { deep: true })
  
  // Expose function to add song to local playlist
  const addToLocalPlaylist = (song: Song) => {
    if (!playlists.value[0].songs.some(s => s._id === song._id)) {
      playlists.value[0].songs.push(song)
    }
  }
  
  // Expose these functions to be used in the parent component
  defineExpose({
    addToLocalPlaylist
  })
  </script>