<template>
  <div id="app" :class="{ 'dark': isDarkMode }" class="flex h-screen bg-light dark:bg-dark"
  @touchstart="handleTouch">
    <LoginForm v-if="!isLoggedIn" @login="handleLogin" />
    <template v-else>
      <!-- Sidebar -->
      <Sidebar 
        :isDarkMode="isDarkMode" 
        @changeView="currentView = $event"
        @showAddSongModal="showAddSongModal = true"
        @toggleTheme="toggleTheme"
      />
  
      <!-- Main content -->
      <div class="flex-1 flex flex-col overflow-hidden">
        <!-- Header with search -->
         
        <Header :searchTerm="searchTerm" @updateSearch="updateSearch" @activateEasterEgg="showSashaFronch"/>
        <!-- Song list and details -->
        <div v-if="currentView === 'main'" class="flex-1 flex flex-col md:flex-row overflow-hidden">
          <!-- Song list -->
          <div :class="{'md:w-1/2': selectedSong && isWideScreen}" class="flex-1 overflow-y-auto p-4">
            <SongList 
              :songs="visibleSongList"
              :expandedSong="expandedSong"
              :isWideScreen="isWideScreen"
              :showRemoveButton="false"
              @selectSong="selectSong($event, isWideScreen)"
              @addToPlaylist="addToPlaylist"
            />
          </div>
  
          <!-- Song details for wide screens -->
          <SongDetails 
            v-if="selectedSong && isWideScreen"
            :song="selectedSong"
            class="md:w-1/2"
          />
        </div>

        <!-- Playlist view -->
        <Playlists v-if="currentView === 'playlist'" />
      </div>
 
<AddSongModal 
        :show="showAddSongModal"
        :isDarkMode="isDarkMode"
        @close="showAddSongModal = false"
        @addSong="handleAddNewSong"
      />
</template>
    <div class="secret-area top-right"></div>
    <div class="secret-area bottom-right"></div>
    <div class="secret-area center-left"></div>
    <transition name="slide-up">
      <div v-if="showSashaFronchImage" class="sasha-fronch-image">
        <img src="/src//assets/sf.png" alt="Саша Фронч" />
      </div>
    </transition>
  </div>
  </template>
  
  <script setup lang="ts">
  import LoginForm from './components/LoginForm.vue'
  import Sidebar from './components/Sidebar.vue'
  import Header from './components/Header.vue'
  import SongList from './components/SongList.vue'
  import SongDetails from './components/SongDetails.vue'
  import AddSongModal from './components/AddSongModal.vue'
  import Playlists from './components/Playlists.vue'
  import { useSongs } from './composables/useSongs'
  import { usePlaylist } from './composables/usePlaylist'
  import mySong from './assets/rick.mp3'
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'

  const {
  selectedSong,
  expandedSong,
  searchTerm,
  visibleSongList,
  fetchSongs,
  addNewSong,
  selectSong,
  updateSearch,
  setSongs, originalSongs, songs
} = useSongs()

const secretCode = ['center-left', 'center-left', 'bottom-right', 'bottom-right', 'bottom-right', 'top-right', 'center-left',];
let userInput: string[] = [];
const showSashaFronchImage = ref(false);

const handleTouch = (event: TouchEvent) => {
  const touch = event.touches[0];
  const element = document.elementFromPoint(touch.clientX, touch.clientY);
  if (element?.classList.contains('secret-area')) {
    const area = element.classList[1];
    userInput.push(area);
    if (userInput.length > secretCode.length) {
      userInput.shift();
    }
    if (userInput.join(',') === secretCode.join(',')) {
      activateRickRoll();
    }
  }
};

const showSashaFronch = () => {
  showSashaFronchImage.value = true;
  setTimeout(() => {
    showSashaFronchImage.value = false;
  }, 3000); // Зображення зникне через 3 секунди
};

const audio = ref(new Audio(new URL('@/assets/rick.mp3', import.meta.url).href));

const audioElement = ref<HTMLAudioElement | null>(null)

const playSong = () => {
  audio.value.play().catch((error) => {
    console.error('Audio playback failed:', error);
  });
};

const activateRickRoll = () => {
  const rickRollSong = {
    _id: 'rickroll',
    title: 'Never Gonna Give You Up',
    artist: 'Rick Astley',
    originalKey: 'F',
    chords: 'F G Am Dm',
    bpm: '113'
  };
  playSong();
  originalSongs.value = [...songs.value];
  setSongs(Array(songs.value.length).fill(rickRollSong));
  setTimeout(() => {
    setSongs(originalSongs.value);
  }, 5000);
};

  interface Song {
    _id: string;
    title: string;
    artist: string;
    originalKey: string;
    chords: string;
    bpm: string;
  }
  
  const isLoggedIn = ref(false);

const handleLogin = () => {
  isLoggedIn.value = true;
  localStorage.setItem('isLoggedIn', 'true');
};

  const currentView = ref('main')
  const isWideScreen = ref(window.innerWidth >= 768)
  const isDarkMode = ref(false)
  const showAddSongModal = ref(false)
  
  const newSong = ref<Omit<Song, '_id'>>({
    title: '',
    artist: '',
    originalKey: '',
    chords: '',
    bpm: '',
  })
  

const { addSongToPlaylist } = usePlaylist()

const addToPlaylist = (song: Song) => {
  addSongToPlaylist(song._id)
  alert(`Song "${song.title}" added to playlist`)
}

const handleAddNewSong = async (newSong: Omit<Song, '_id'>) => {
  const success = await addNewSong(newSong)
  if (success) {
    showAddSongModal.value = false
    alert('New song added successfully!')
  } else {
    alert('Failed to add new song. Please try again.')
  }
}
  
  const toggleTheme = () => {
    isDarkMode.value = !isDarkMode.value
    localStorage.setItem('darkMode', isDarkMode.value.toString())
  }
  
  const handleResize = () => {
    isWideScreen.value = window.innerWidth >= 768
  }
  
  onMounted(() =>{
    const loggedIn = localStorage.getItem('isLoggedIn');
  if (loggedIn === 'true') {
    isLoggedIn.value = true;
    fetchSongs();
  }

  const savedPlaylist = localStorage.getItem('playlist')

    window.addEventListener('resize', handleResize)
    const savedTheme = localStorage.getItem('darkMode')
    if (savedTheme !== null) {
      isDarkMode.value = savedTheme === 'true'
    } else {
      isDarkMode.value = window.matchMedia('(prefers-color-scheme: dark)').matches
    }
  })

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
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
  --color-bumble: #cac6fb;
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
  --color-bumble: #374151;
}

/* Загальні стилі */
.bg-light, .bg-dark { background-color: var(--color-background); }
.bg-sidebar { background-color: var(--color-sidebar); }
.bg-header, .bg-card, .bg-modal { background-color: var(--color-card-background); }
.bg-card-expanded { background-color: var(--color-card-expanded); }
.bg-bumble { background-color: var(--color-bumble); }

.text-primary { color: var(--color-primary); }
.text-input-text, .text-modal-input { color: var(--color-input-text); }
.text-input-icon { color: var(--color-input-icon); }
.text-card-title, .text-modal-title, .text-sidebar-details-title { color: var(--color-text); }
.text-card-subtitle, .text-card-info, .text-sidebar-details-subtitle { color: var(--color-text-secondary); }
.text-card-icon, .text-sidebar-details-text { color: var(--color-text); }

.border-input-border { border-color: var(--color-input-border); }

.focus\:ring-primary:focus { --tw-ring-color: var(--color-primary); }
.focus\:border-primary:focus { border-color: var(--color-primary); }

.hover\:bg-sidebar-hover:hover { background-color: var(--color-sidebar-hover); }

/* Компонент-специфічні стилі */
.SidebarButton {
  @apply p-2 hover:bg-sidebar-hover rounded-full transition-colors duration-200;
}

/* Utility класи */
.bg-primary { background-color: var(--color-primary); }
.bg-primary-dark { background-color: var(--color-primary-hover); }

.group:hover .group-hover\:opacity-100 {
  opacity: 1;
}

.transition-opacity {
  transition-property: opacity;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.key-display {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  min-width: 2.8rem;
  height: 1.5rem;
  padding: 0 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-text);
  background-color: var(--color-bumble);
  border-radius: 9999px;
}

@media (max-width: 640px) {
  .key-display {
    font-size: 0.75rem;
    padding: 0.25rem 0.5rem;
  }
}

#app {
  transition: transform 1s ease-in-out;
}

.secret-area {
  position: absolute;
  width: 7%;
  height: 7%;
  z-index: 1000;
}

.top-right { top: 0; right: 0; }
.bottom-right { bottom: 0; right: 0; }
.center-left { top: 40%; left: 0; }


.sasha-fronch-image {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 400px; /* або інший розмір за вашим вибором */
  z-index: 1000;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.5s ease-in-out;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%) translateX(-50%);
}

.slide-up-enter-to,
.slide-up-leave-from {
  transform: translateY(0) translateX(-50%);
}
  </style>