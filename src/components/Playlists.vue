<!-- <template>
  <div class="playlists-container">
    <div class="playlist-tabs" v-if="hasPlaylists">
      <button 
        v-for="(playlist, index) in visiblePlaylists" 
        :key="index"
        @click="selectPlaylist(index)"
        :class="{ 'active': selectedPlaylistIndex === index }"
      >
        {{ playlist.name }}
        <span v-if="index !== 0" @click.stop="deletePlaylist(index)" class="delete-btn">×</span>
      </button>
    </div>

    <div v-if="!hasPlaylists" class="no-playlists-message">
      No songs in the playlist. Add songs to create a playlist.
    </div>

    <SongList 
  v-if="hasPlaylists"
  :songs="allPlaylists[selectedPlaylistIndex].songIds
    .map(id => songs.find(s => s._id === id))
    .filter((song): song is Song => song !== undefined)"
  :expandedSong="expandedSong"
  :isWideScreen="isWideScreen"
  :showRemoveButton="true"
  @selectSong="handleSelectSong"
  @removeSong="handleRemoveSong"
/>
    <button 
      v-if="selectedPlaylistIndex === 0 && localPlaylistHasSongs"
      @click="showSavePlaylistModal" 
      class="save-playlist-btn"
    >
      Save Local Playlist to Database
    </button>

    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <h2>Save Playlist</h2>
        <input v-model="newPlaylistName" placeholder="Enter playlist name">
        <button @click="savePlaylistToDatabase">Save</button>
        <button @click="showModal = false">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, toRefs, onMounted } from 'vue'
import SongList from './SongList.vue'
import { useSongs } from '../composables/useSongs'
import { usePlaylist } from '../composables/usePlaylist'

interface Song {
  _id: string;
  title: string;
  artist: string;
  originalKey: string;
  chords: string;
  bpm: string;
}

const { songs, fetchSongs } = useSongs()
console.log('Songs in Playlists component:', songs.value)
const playlistStore = usePlaylist()
const { 
  removeSongFromPlaylist, 
  saveLocalPlaylist, 
  deletePlaylist,
  selectPlaylist,
  clearLocalPlaylist
} = toRefs(playlistStore)

const expandedSong = ref<string | null>(null)
const selectedSong = ref<Song | null>(null)
const isWideScreen = ref(window.innerWidth >= 768)
const showModal = ref(false)
const newPlaylistName = ref('')

const { allPlaylists, selectedPlaylistIndex } = toRefs(usePlaylist())

const currentPlaylistSongs = computed(() => {
  const currentPlaylist = allPlaylists.value[selectedPlaylistIndex.value]
  console.log('Current playlist:', currentPlaylist)
  console.log('All songs:', songs.value)
  if (songs.value.length === 0) {
    console.warn('No songs available')
    return []
  }
  const filteredSongs = songs.value.filter(song => {
    console.log('Checking song:', song._id, 'in playlist:', currentPlaylist.songIds)
    return currentPlaylist.songIds.includes(song._id)
  })
  console.log('Filtered songs:', filteredSongs)
  return filteredSongs
})

const visiblePlaylists = computed(() => {
  console.log('1234',allPlaylists.value.filter((playlist, index) => index === 0 ? playlist.songIds.length > 0 : true))
  return allPlaylists.value.filter((playlist, index) => index === 0 ? playlist.songIds.length > 0 : true)
})

const hasPlaylists = computed(() => visiblePlaylists.value.length > 0)

const localPlaylistHasSongs = computed(() => allPlaylists.value[0].songIds.length > 0)


const handleSelectSong = (song: Song) => {
  expandedSong.value = expandedSong.value === song._id ? null : song._id
  selectedSong.value = song
}

const handleRemoveSong = (song: Song) => {
  removeSongFromPlaylist.value(song._id, selectedPlaylistIndex.value)
}

const showSavePlaylistModal = () => {
  showModal.value = true
}

const savePlaylistToDatabase = async () => {
  if (newPlaylistName.value.trim()) {
    await saveLocalPlaylist.value(newPlaylistName.value)
    clearLocalPlaylist.value()
    showModal.value = false
    newPlaylistName.value = ''
    // Оновлюємо сторінку або перезавантажуємо дані
    await playlistStore.fetchPlaylists()
  }
}

// Add event listener for window resize
window.addEventListener('resize', () => {
  isWideScreen.value = window.innerWidth >= 768
})

onMounted(() => {
  fetchSongs()
})
</script> -->
<template>
  <div class="playlists-container">
    <!-- Tabs for playlists -->
    <div class="playlist-tabs" v-if="hasPlaylists">
      <button 
        v-for="(playlist, index) in allPlaylists" 
        :key="index"
        @click="selectPlaylist(index)"
        :class="{ 'active': selectedPlaylistIndex === index }"
      >
        {{ playlist.name }}
        <button v-if="index !== 0" @click.stop="deletePlaylist(index)" class="delete-btn">
  <Trash2 :size="16" />
</button>
      </button>
    </div>

    <div v-if="!hasPlaylists" class="no-playlists-message">
      No songs in the playlist. Add songs to create a playlist.
    </div>

    <!-- Selected playlist songs -->
    <div class="song-list-container px-4 py-2">
    <SongList 
      v-if="hasPlaylists && currentPlaylistSongs.length > 0"
      :songs="currentPlaylistSongs"
      :expandedSong="expandedSong"
      :isWideScreen="isWideScreen"
      :showRemoveButton="true"
      :playlists="allPlaylists"
      @selectSong="handleSelectSong"
      @removeSong="handleRemoveSong"
    />
  </div>

    <!-- Save local playlist button -->
    <button 
      v-if="selectedPlaylistIndex === 0 && localPlaylistHasSongs"
      @click="showSavePlaylistModal" 
      class="save-playlist-btn"
    >
      Save Local Playlist to Database
    </button>

    <!-- Save Playlist Modal -->
    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <h2>Save Playlist</h2>
        <input v-model="newPlaylistName" placeholder="Enter playlist name">
        <button @click="savePlaylistToDatabase">Save</button>
        <button @click="showModal = false">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, toRefs, onMounted } from 'vue'
import SongList from './SongList.vue'
import { useSongs } from '../composables/useSongs'
import { usePlaylist } from '../composables/usePlaylist'
import { Trash2} from 'lucide-vue-next'

interface Song {
  _id: string;
  title: string;
  artist: string;
  originalKey: string;
  chords: string;
  bpm: string;
}

const { songs, fetchSongs } = useSongs()
const playlistStore = usePlaylist()
const { 
  allPlaylists,
  selectedPlaylistIndex,
  removeSongFromPlaylist, 
  saveLocalPlaylist, 
  deletePlaylist,
  selectPlaylist,
  clearLocalPlaylist
} = toRefs(playlistStore)

const expandedSong = ref<string | null>(null)
const isWideScreen = ref(window.innerWidth >= 768)
const showModal = ref(false)
const newPlaylistName = ref('')

const currentPlaylistSongs = computed(() => {
  const currentPlaylist = allPlaylists.value[selectedPlaylistIndex.value]
  return songs.value.filter(song => currentPlaylist.songIds.includes(song._id))
})

const hasPlaylists = computed(() => allPlaylists.value.length > 0)

const localPlaylistHasSongs = computed(() => allPlaylists.value[0].songIds.length > 0)

const handleSelectSong = (song: Song) => {
  expandedSong.value = expandedSong.value === song._id ? null : song._id
}

const handleRemoveSong = (song: Song) => {
  removeSongFromPlaylist.value(song._id, selectedPlaylistIndex.value)
}

const showSavePlaylistModal = () => {
  showModal.value = true
}

const savePlaylistToDatabase = async () => {
  if (newPlaylistName.value.trim()) {
    await saveLocalPlaylist.value(newPlaylistName.value)
    clearLocalPlaylist.value()
    showModal.value = false
    newPlaylistName.value = ''
    await playlistStore.fetchPlaylists()
  }
}

// Add event listener for window resize
window.addEventListener('resize', () => {
  isWideScreen.value = window.innerWidth >= 768
})

onMounted(() => {
  fetchSongs()
  playlistStore.fetchPlaylists()
})
</script>

<style scoped>
.song-list-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.playlists-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.playlist-tabs {
  display: flex;
  overflow-x: auto;
  padding: 10px;
  background-color: var(--color-header);
}

.playlist-tabs button {
  padding: 5px 10px;
  margin-right: 5px;
  border: none;
  background-color: var(--color-card);
  color: var(--color-text);
  cursor: pointer;
  border-radius: 5px;
}

.playlist-tabs button.active {
  background-color: var(--color-primary);
  color: white;
}

.delete-btn {
  margin-left: 5px;
  color: red;
  font-weight: bold;
  cursor: pointer;
}
.save-playlist-btn {
  margin: 10px;
  padding: 10px;
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: var(--color-card-background);
  padding: 20px;
  border-radius: 5px;
  text-align: center;
}

.no-playlists-message {
  text-align: center;
  padding: 20px;
  color: var(--color-text);
}

.playlist-tabs {
  height: 50px; /* Adjust as needed */
  overflow-x: auto;
  white-space: nowrap;
}
.song-list-container {
  height: calc(100vh - 185px); /* Adjust based on your layout */
  overflow-y: auto;
}

.delete-btn {
  background: none;
  border: none;
  color: var(--color-text-secondary);
  cursor: pointer;
  padding: 2px;
  transition: color 0.3s;
}
.delete-btn:hover {
  color: var(--color-primary);
}
</style>