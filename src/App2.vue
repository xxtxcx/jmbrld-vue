<template>
  <div :class="{ 'dark': isDarkMode }" class="flex h-screen bg-gray-100 dark:bg-gray-900">
    <!-- Sidebar -->
    <div class="w-20 bg-indigo-800 dark:bg-indigo-900 text-white flex flex-col items-center py-4">
      <div class="mb-8">
        <Music :size="32" />
      </div>
      <nav class="flex flex-col items-center space-y-4 flex-grow">
        <q-btn flat round color="white" class="p-2 hover:bg-indigo-700 dark:hover:bg-indigo-800">
          <Search :size="24" />
        </q-btn>
        <q-btn flat round color="white" class="p-2 hover:bg-indigo-700 dark:hover:bg-indigo-800">
          <List :size="24" />
        </q-btn>
        <!-- New button for adding songs -->
        <q-btn flat round color="white" class="p-2 hover:bg-indigo-700 dark:hover:bg-indigo-800" @click="showAddSongModal = true">
          <Plus :size="24" />
        </q-btn>
        <q-btn flat round color="white" class="p-2 hover:bg-indigo-700 dark:hover:bg-indigo-800">
          <Settings :size="24" />
        </q-btn>
      </nav>
      <!-- Theme toggle button -->
      <q-btn flat round color="white" class="mt-auto mb-4 p-2 hover:bg-indigo-700 dark:hover:bg-indigo-800" @click="toggleTheme">
        <Sun v-if="isDarkMode" :size="24" />
        <Moon v-else :size="24" />
      </q-btn>
    </div>

 <!-- Main content -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Header з пошуком -->
      <header class="bg-white bg-gray-800 shadow p-4 flex justify-between items-center">
        <h1 class="text-2xl font-bold text-indigo-800 text-indigo-300">JMBRLD</h1>
        <div class="relative w-64">
          <input
            v-model="searchTerm"
            type="text"
            placeholder="Search songs..."
            class="w-full pl-10 pr-4 py-2 rounded-full border focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-700 text-white border-gray-600"
            @input="onUpdateSearch"
          >
          <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" :size="20" />
        </div>
      </header>

         <!-- Add Song Modal -->
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

      <!-- Song list -->
      <div class="flex-1 overflow-y-auto p-4 bg-gray-100 bg-gray-900">
        <div class="space-y-4">
          <div v-for="song in visibleSongList" :key="song.id" class="bg-white bg-gray-800 rounded-lg shadow p-4 cursor-pointer hover:shadow-md transition">
            <div class="flex justify-between items-center" @click="toggleSongExpansion(song.id)">
              <div>
                <h2 class="text-lg font-semibold text-white">{{ song.title }}</h2>
                <p class="text-gray-600 text-gray-400">{{ song.artist }}</p>
              </div>
              <div class="flex items-center space-x-2">
                <span class="text-sm text-gray-500 text-gray-400">Key: {{ song.originalKey }}</span>
                <ChevronUp v-if="expandedSong === song.id" :size="20" class="text-white" />
                <ChevronDown v-else :size="20" class="text-white" />
              </div>
            </div>
            <div v-if="expandedSong === song.id" class="mt-4 p-4 bg-gray-50 bg-gray-700 rounded">
              <h3 class="font-semibold mb-2 text-white">Chords:</h3>
              <pre class="whitespace-pre-wrap font-mono text-sm text-gray-300">{{ song.chords }}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Song details sidebar - hidden on mobile -->
    <div v-if="selectedSong" class="hidden md:block w-64 bg-white shadow-lg p-4">
      <h2 class="text-xl font-bold mb-2">{{ selectedSong.title }}</h2>
      <p class="text-gray-600 mb-4">{{ selectedSong.artist }}</p>
      <div>
        <h3 class="font-semibold mb-2">Transpose</h3>
        <div class="flex justify-between">
          <q-btn color="indigo" label="-" />
          <span>Key: {{ selectedSong.originalKey }}</span>
          <q-btn color="indigo" label="+" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Search, Music, List, Settings, ChevronDown, ChevronUp, Sun, Moon, Plus } from 'lucide-vue-next'

interface Song {
  id: number;
  title: string;
  artist: string;
  originalKey: string;
  chords: string;
  bpm: string;
}

const selectedSong = ref<Song | null>(null)
const expandedSong = ref<number | null>(null)
const isDarkMode = ref(false)
const showAddSongModal = ref(false)

const songs2 = ref<Song[]>([
    {
        "id":1,
        "title": "Nothing is impossible",
        "artist":"Planetshakers",
        "bpm":"128",
        "originalKey":"C",
        "chords": "Chorus: xyz C G Am F // xyz Interlude: xyz F C Dm F // xyz Verse: xyz C Dm F xyz Am G F xyz Pre-Chorus: xyz Am G F xyz Am G Dm F xyz Bridge: xyz F C Dm F //"
    },
    {
        "id":2,
        "title": "Обійми мене",
        "artist":"Океан Ельзи",
        "bpm":"80",
        "originalKey":"D#",
        "chords": "Interlude: xyz G7 F G7 F D# Cm xyz Verse: xyz Cm Gm G# Gm xyz Cm Gm G# G7 xyz Chorus: xyz Cm Gm G# G7"
    },
    {
        "id":3,
        "title": "Behind Blue Eyes",
        "artist":"Limp Bizkit",
        "bpm":"90",
        "originalKey":"D",
        "chords": "Verse: xyz Em G D C A // xyz Chorus: xyz C D G C D E xyz Bm C D A" 
    },
    {
        "id":4,
        "title": "Poker Face",
        "artist":"Lady Gaga",
        "originalKey":"B",
        "bpm":"-",
        "chords": "Verse: xyz G#m E B A#m //// xyz Chorus: xyz G#m E B A#m //" 
    },
    {
        "id":5,
        "title": "Stefania",
        "artist":"KALUSH",
        "originalKey":"F",
        "bpm":"-",
        "chords": "Verse: xyz Dm A# A // xyz Chorus: xyz A# Gm A Dm //// xyz Interlude: xyz A# Gm A Dm A5 A#" 
    },
    {
        "id":6,
        "title": "Kamsahamnida",
        "artist":"planetboom",
        "originalKey":"G#m",
        "bpm":"156",
        "chords": "Verse: xyz G#m /// F#m //// xyz Chorus: xyz E G#m C#m B // xyz G#m /// xyz Interlude: xyz E G#m C#m B xyz Bridge: xyz G#m E F# //" 
    },
    {
        "id":7,
        "title": "Blessing",
        "artist":"Kari Jobe",
        "bpm":"-",
        "originalKey":"H",
        "chords": "Verse: xyz H E H F#sus xyz G#m E H F#m H xyz Chorus: xyz G#m E H F# //// xyz Interlude: xyz G#m E H F#" 
    },
    {
        "id":8,
        "title": "Promise",
        "artist":"Spoken",
        "bpm":"-",
        "originalKey": "-",
        "chords": "Empty" 
    },
    {
        "id":9,
        "title": "Just Like Heaven",
        "artist":"Brandon Lake",
        "bpm":"-",
        "originalKey": "-",
        "chords": "-"
    },
    {
        "id":10,
        "title": "Я буду славить Господа Христа",
        "artist":"Сергей Брикса",
        "bpm":"-",
        "originalKey":"G",
        "chords": "Intro: xyz G D C D xyz Verse: xyz G D C D xyz Em C Am xyz D C D xyz Chorus: xyz G D Em C xyz G D C D" 
    },
    {
        "id":11,
        "title": "Наш Бог благ и милостив",
        "artist":"Новое Поколение",
        "bpm":"",
        "originalKey":"G",
        "chords": "Verse: xyz Em C Am D // xyz G D C D // xyz Chorus: xyz G D Em C" 
    },
    {
        "id":12,
        "title": "Put Your Hands Up",
        "artist":"Planetshakers",
        "bpm":"124",
        "originalKey":"C#",
        "chords": "Verse: xyz A#m G# C# F# //// xyz Pre-Chorus: xyz A#m G# C# F# xyz A#m G# F# xyz Chorus: xyz A#m F# C# G# /// xyz C# F# A#m G# xyz Bridge: xyz C#m ////" 
    },
    {
        "id":13,
        "title": "Прихожу к Тебе я с хвалою",
        "artist":"JoyYouth Worship",
        "bpm":"",
        "originalKey":"H",
        "chords": "Verse: xyz H G#m E F# // xyz Chorus: xyz H F# G#m xyz F# E" 
    },
    {
        "id":14,
        "title": "Holy Spirit",
        "artist":"Jesus Culture",
        "bpm":"72",
        "originalKey":"C",
        "chords": "Verse: xyz C F2 //// xyz Chorus: xyz C F2 Dm7 // xyz Bridge: xyz F2 C Dm7 C" 
    },
    {
        "id":15,
        "title": "Way Maker",
        "artist":"Leeland",
        "bpm":"",
        "originalKey":"A",
        "chords": "Verse: xyz Chorus: xyz Bridge: xyz A2 E Hsus C#m" 
    },
    {
        "id":16,
        "title": "Этот день сотворил Господь",
        "artist":"Unknown",
        "bpm":"",
        "originalKey":"G",
        "chords": "Verse: xyz G G C D // xyz Chorus: xyz G B C D" 
    },
    {
        "id":17,
        "title": "Ты моя защита",
        "artist":"Unknown",
        "bpm":"",
        "originalKey":"G",
        "chords": "Verse: xyz Em Am G D C Em // xyz Chorus: xyz Am G D /// xyz Em D C Em" 
    },
    {
        "id":18,
        "title": "Вся хвала тобі Господь",
        "artist":"Unknown",
        "bpm":"",
        "originalKey":"D",
        "chords": "Verse: xyz Chorus: xyz Bridge: xyz D Hm G A D" 
    },
    {
        "id":19,
        "title": "Господь, Ты Пастырь мой",
        "artist":"Unknown",
        "bpm":"",
        "originalKey":"Am",
        "chords": "Verse: xyz Am Dm G C Am Dm E" 
    },
    {
        "id":20,
        "title": "Holy and Anointed One",
        "artist":"Bethel",
        "bpm":"",
        "originalKey":"E",
        "chords": "Verse: xyz E H A /// xyz E H C#m A xyz E H A xyz Chorus: xyz A E // xyz A C#m xyz A H xyz Bridge: xyz A E H" 
    },
    {
        "id":21,
        "title": "My Redeemer lives",
        "artist":"Hillsong",
        "bpm":"",
        "originalKey":"E",
        "chords": "Verse: xyz E A //// xyz H A A H xyz Chorus: xyz E A C#m H" 
    },
    {
        "id":22,
        "title": "Вечно буду славить",
        "artist":"Виталий Ефремочкин",
        "bpm":"",
        "originalKey":"E",
        "chords": "Verse: xyz C#m H /// xyz A H xyz Chorus: xyz C#m A H F#m xyz Bridge: xyz C#m H E F#m" 
    },
    {
        "id":23,
        "title": "Yeshua",
        "artist":"Jesus Image",
        "bpm":"",
        "originalKey":"A#",
        "chords": "Verse: xyz Dm A# F C xyz Chorus: xyz A# C Dm Am xyz Bridge: xyz A# C Dm Am" 
    },
    {
        "id":24,
        "title": "О, Благодать",
        "artist":"4UBand",
        "bpm":"",
        "originalKey":"D",
        "chords": "Verse: xyz D A G A // xyz Chorus: xyz Hm G D A xyz Bridge: xyz  D A Hm G" 
    },
    {
        "id":25,
        "title": "Досконалий Бог",
        "artist":"Unknown",
        "bpm":"",
        "originalKey":"Em",
        "chords": "Verse: xyz Em D C H xyz G D Am H xyz Pre-Chorus: xyz C Am H // xyz Chorus: xyz Em G Am H //" 
    },
    {
        "id":26,
        "title": "Очи мои к горам",
        "artist":"Unknown",
        "bpm":"",
        "originalKey":"E",
        "chords": "Verse: xyz C#m A H G# // xyz Chorus: xyz C#m A H xyz Bridge: xyz C#m H" 
    },
    {
        "id":27,
        "title": "Нехай лине Дух",
        "artist":"Unknown",
        "bpm":"-",
        "originalKey":"F",
        "chords": "Verse: xyz Dm C //// xyz Gm C Dm C Dm xyz Chorus: xyz Gm C Dm" 
    }

])

const newSong = ref<Omit<Song, 'id'>>({
  title: '',
  artist: '',
  originalKey: '',
  chords: '',
  bpm: '',
})

const addNewSong = () => {
  const songToAdd: Song = {
    ...newSong.value,
    id: Date.now(), // використовуємо timestamp як простий унікальний id
  }
  songs2.value.push(songToAdd)
  // Очищаємо форму
  newSong.value = {
    title: '',
    artist: '',
    originalKey: '',
    chords: '',
    bpm: '',
  }
  showAddSongModal.value = false
}

const searchTerm = ref("")

const onUpdateSearch = (event: Event) => {
  searchTerm.value = (event.target as HTMLInputElement).value
}

const searchEmp = (items: Song[], term: string) => {
  if (term.length === 0) {
    return items
  }
  return items.filter(item => 
    item.title.toLowerCase().includes(term.toLowerCase()) ||
    item.artist.toLowerCase().includes(term.toLowerCase())
  )
}

const visibleSongList = computed(() => searchEmp(songs2.value, searchTerm.value))

const toggleSongExpansion = (id: number) => {
  expandedSong.value = expandedSong.value === id ? null : id
}


const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value
  localStorage.setItem('darkMode', isDarkMode.value.toString())
  applyTheme()
}

const applyTheme = () => {
  if (isDarkMode.value) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

onMounted(() => {
  const savedTheme = localStorage.getItem('darkMode')
  if (savedTheme !== null) {
    isDarkMode.value = savedTheme === 'true'
  } else {
    isDarkMode.value = window.matchMedia('(prefers-color-scheme: dark)').matches
  }
  applyTheme()
})
</script>

<style scoped>
:root {
  --bg-indigo-800: #3730a3;
  --text-indigo-800: #3730a3;
  --hover-bg-indigo-700: #4338ca;
  --bg-indigo-500: #6366f1;
}

.dark {
  --bg-indigo-800: #1e1b4b;
  --text-indigo-800: #a5b4fc;
  --hover-bg-indigo-700: #3730a3;
  --bg-indigo-500: #4f46e5;
}

.bg-indigo-800 {
  background-color: var(--bg-indigo-800);
}

.text-indigo-800 {
  color: var(--text-indigo-800);
}

.hover\:bg-indigo-700:hover {
  background-color: var(--hover-bg-indigo-700);
}

.bg-indigo-500 {
  background-color: var(--bg-indigo-500);
}

pre {
  white-space: pre-wrap;
  word-break: break-word;
}

.dark .bg-white {
  background-color: #1f2937; /* bg-gray-800 */
}

.dark .text-gray-600 {
  color: #9ca3af; /* text-gray-400 */
}

.dark .bg-gray-50 {
  background-color: #374151; /* bg-gray-700 */
}

.dark .bg-gray-100 {
  background-color: #111827; /* bg-gray-900 */
}

.dark .text-gray-500 {
  color: #6b7280; /* text-gray-500 в темній темі */
}

.dark .text-white {
  color: #ffffff;
}
</style>