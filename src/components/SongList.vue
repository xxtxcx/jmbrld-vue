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
          <button v-if="showRemoveButton" @click.stop="$emit('removeSong', song)" class="remove-song-btn">
            <Trash2 :size="16" />
          </button>

          <div v-else class="relative">

<button

  @click.stop="showDropdown[song._id] = !showDropdown[song._id]" 

  class="text-primary hover:text-primary-hover p-1 bg-bumble rounded-full"

>

  <Plus :size="16" />

</button>

<!-- Dropdown menu -->

<div v-if="showDropdown[song._id] && playlists.length > 1" 

     class="absolute right-0 mt-2 w-48 bg-card rounded-md shadow-lg z-50">

  <div class="py-1">

    <button

      v-for="playlist in playlists"

      :key="playlist._id || 'local'"

      @click.stop="addSongToPlaylist(song, playlists.indexOf(playlist))"

      class="w-full text-left px-4 py-2 text-sm hover:bg-bumble"

    >

      {{ playlist.name }}

    </button>

  </div>

</div>

</div>
          <!-- <button v-else
            @click.stop="$emit('addToPlaylist', song)" 
            class="text-primary hover:text-primary-hover opacity-0 group-hover:opacity-100 transition-opacity p-1 bg-bumble rounded-full"
          >
            <Plus :size="16" />
          </button> -->
          <span class="key-display">{{ song.currentKey || song.originalKey }}</span>
          <button class="text-card-icon p-1 bg-bumble rounded-full">
            <ChevronDown :size="16" />
          </button>
        </div>
      </div>
      <!-- Expandable content -->
      <div v-if="expandedSong === song._id" class="bg-header mt-4 p-4 rounded">
        <h3 class="text-lg font-semibold mb-2 text-card-title">Chords:</h3>
        <pre class="whitespace-pre-wrap font-mono text-sm text-card-subtitle bg-light dark:bg-dark p-4 rounded">{{ song.transposedChords || song.chords }}</pre>
        <div class="mt-2 flex justify-center space-x-2">
          <button @click.stop="transposeChords(song, -1)" class="bg-primary text-white px-2 py-1 rounded">-1</button>
          <button @click.stop="transposeChords(song, 1)" class="bg-primary text-white px-2 py-1 rounded">+1</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Plus, ChevronDown, Trash2 } from 'lucide-vue-next'

interface Song {
  _id: string;
  title: string;
  artist: string;
  originalKey: string;
  currentKey?: string;
  chords: string;
  transposedChords?: string;
  bpm: string;
}

interface Playlist {
  _id?: string;
  name: string;
  songIds: string[];
}

const props = defineProps<{
  songs: Song[];
  expandedSong: string | null;
  isWideScreen: boolean;
  showRemoveButton: boolean;
  playlists: Playlist[];
}>()

const emit = defineEmits<{
  (e: 'selectSong', song: Song): void;
  (e: 'addToPlaylist', song: Song, playlistIndex: number): void;
  (e: 'removeSong', song: Song): void;
}>()

const showDropdown = reactive<{ [key: string]: boolean }>({})

const selectSong = (song: Song) => {
  emit('selectSong', song)
}

const addSongToPlaylist = (song: Song, playlistIndex: number) => {
  console.log(song, playlistIndex)
  emit('addToPlaylist', song, playlistIndex)
  showDropdown[song._id] = false
}

// Закриваємо dropdown при кліку поза ним
const closeDropdowns = () => {
  Object.keys(showDropdown).forEach(key => {
    showDropdown[key] = false
  })
}

window.addEventListener('click', closeDropdowns)

const chordRegex = /\b([A-G][b#]?)(m|maj|min|aug|dim)?\d*\b/g;

const transposeChord = (chord: string, semitones: number): string => {
  const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const [, note, modifier] = chord.match(/([A-G][b#]?)(.*)/) || [];
  
  if (!note) return chord;

  let index = notes.indexOf(note);
  if (index === -1) {
    // Обробка бемолів
    const flatNote = note.charAt(0);
    index = notes.indexOf(flatNote);
    if (index !== -1) {
      index = (index + 11) % 12; // Зменшуємо на півтона
    }
  }

  if (index === -1) return chord; // Якщо нота все ще не знайдена, повертаємо оригінальний акорд

  const newIndex = (index + semitones + 12) % 12;
  return notes[newIndex] + modifier;
}

const sharpToFlat: { [key: string]: string } = {
  'C#': 'Db', 'D#': 'Eb', 'F#': 'Gb', 'G#': 'Ab', 'A#': 'Bb'
};

const normalizeChord = (chord: string): string => {
  const [, note, modifier] = chord.match(/([A-G][b#]?)(.*)/) || [];
  if (note && note in sharpToFlat) {
    return sharpToFlat[note] + modifier;
  }
  return chord;
}

const transposeText = (text: string, semitones: number): string => {
  return text.replace(chordRegex, match => normalizeChord(transposeChord(match, semitones)));
}

const transposeChords = (song: Song, semitones: number) => {
  if (!song.currentKey) song.currentKey = song.originalKey;
  song.currentKey = transposeChord(song.currentKey, semitones);
  song.transposedChords = transposeText(song.transposedChords || song.chords, semitones);
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