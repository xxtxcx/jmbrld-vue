<template>
    <div class="flex-1 overflow-y-auto p-4">
      <h2 class="text-2xl font-bold mb-4 text-card-title">My Playlists</h2>
      
      <!-- Playlist tabs -->
      <div class="flex mb-4 border-b border-gray-200">
        <button
          v-for="(playlist, index) in playlists"
          :key="index"
          @click="selectedPlaylistIndex = index"
          class="py-2 px-4 mr-2 focus:outline-none"
          :class="{'border-b-2 border-primary text-primary': selectedPlaylistIndex === index}"
        >
          {{ playlist.name }}
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
        <SongComponent
          v-for="song in selectedPlaylist.songs"
          :key="song._id"
          :song="song"
          :isInPlaylist="true"
          @remove-from-playlist="removeSongFromPlaylist"
        />
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
  import { ref, computed, onMounted, watch } from 'vue';
  import axios from 'axios';
  import { Plus } from 'lucide-vue-next';
import SongComponent from './SongComponent.vue'
  
interface Song {
    _id: number;
    title: string;
    artist: string;
    originalKey: string;
    chords: string;
    bpm: string;
  }
  
  interface Playlist {
    id?: string;
    name: string;
    songs: Song[];
  }
  
  const playlists = ref<Playlist[]>([
    { name: 'Local Playlist', songs: [] }
  ]);
  const selectedPlaylistIndex = ref(0);
  
  const selectedPlaylist = computed(() => playlists.value[selectedPlaylistIndex.value]);
  
  const createNewPlaylist = () => {
    const name = prompt('Enter playlist name:');
    if (name) {
      playlists.value.push({ name, songs: [] });
      selectedPlaylistIndex.value = playlists.value.length - 1;
    }
  };
  
  const removeSongFromPlaylist = (songId: number) => {
    if (selectedPlaylist.value) {
      selectedPlaylist.value.songs = selectedPlaylist.value.songs.filter(song => song._id !== songId);
      if (selectedPlaylistIndex.value === 0) {
        savePlaylistsToLocalStorage();
      }
    }
  };
  
  const saveLocalPlaylist = async () => {
    if (selectedPlaylistIndex.value === 0 && selectedPlaylist.value) {
      try {
        const response = await axios.post('/api/playlists', {
          name: 'Saved Local Playlist',
          songs: selectedPlaylist.value.songs
        });
        playlists.value.push(response.data);
        alert('Local playlist saved successfully!');
      } catch (error) {
        console.error('Error saving local playlist:', error);
        alert('Failed to save local playlist. Please try again.');
      }
    }
  };
  
  const fetchPlaylists = async () => {
    try {
      const response = await axios.get('/api/playlists');
      playlists.value = [playlists.value[0], ...response.data];
    } catch (error) {
      console.error('Error fetching playlists:', error);
    }
  };
  
  const savePlaylistsToLocalStorage = () => {
    localStorage.setItem('playlists', JSON.stringify(playlists.value));
  };
  
  const loadPlaylistsFromLocalStorage = () => {
    const savedPlaylists = localStorage.getItem('playlists');
    if (savedPlaylists) {
      try {
        const parsedPlaylists = JSON.parse(savedPlaylists);
        if (Array.isArray(parsedPlaylists)) {
          playlists.value = parsedPlaylists;
        } else {
          console.error('Saved playlists is not an array:', parsedPlaylists);
        }
      } catch (error) {
        console.error('Error parsing saved playlists:', error);
      }
    }
  };
  
  onMounted(() => {
    loadPlaylistsFromLocalStorage();
    fetchPlaylists();
  });
  
  watch(playlists, () => {
    savePlaylistsToLocalStorage();
  }, { deep: true });
  
  // Метод для додавання пісні до локального плейлиста (першого в списку)
  const addToLocalPlaylist = (song: Song) => {
    if (!playlists.value[0].songs.some(s => s._id === song._id)) {
      playlists.value[0].songs.push(song);
      savePlaylistsToLocalStorage();
    }
  };
  
  // Експортуємо метод для використання в батьківському компоненті
  defineExpose({ addToLocalPlaylist });
  </script>