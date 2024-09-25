<script setup lang="ts">
import { ref } from 'vue';
import { Search, Music, List, Settings, ChevronDown } from 'lucide-vue-next';

interface Song {
  id: number;
  title: string;
  artist: string;
  key: string;
}

const songs: Song[] = [
  { id: 1, title: 'Amazing Grace', artist: 'John Newton', key: 'G' },
  { id: 2, title: 'How Great Is Our God', artist: 'Chris Tomlin', key: 'C' },
  { id: 3, title: 'Oceans', artist: 'Hillsong United', key: 'D' },
];

const expandedSong = ref<number | null>(null);

const toggleSongExpansion = (id: number) => {
  expandedSong.value = expandedSong.value === id ? null : id;
};
</script>

<template>
  <div class="flex h-screen bg-gray-100">
    <!-- Sidebar -->
    <div class="w-20 bg-indigo-800 text-white flex flex-col items-center py-4">
      <div class="mb-8">
        <Music :size="32" />
      </div>
      <nav class="flex flex-col items-center space-y-4">
        <button class="p-2 rounded hover:bg-indigo-700">
          <Search :size="24" />
        </button>
        <button class="p-2 rounded hover:bg-indigo-700">
          <List :size="24" />
        </button>
        <button class="p-2 rounded hover:bg-indigo-700">
          <Settings :size="24" />
        </button>
      </nav>
    </div>

    <!-- Main content -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Header -->
      <header class="bg-white shadow-sm p-4 flex justify-between items-center">
        <h1 class="text-2xl font-bold text-indigo-800">JMBRLD</h1>
        <div class="relative">
          <input
            type="text"
            placeholder="Search songs..."
            class="pl-10 pr-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
          <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" :size="20" />
        </div>
      </header>

      <!-- Song list -->
      <div class="flex-1 overflow-y-auto p-4">
        <div class="space-y-2">
          <div
            v-for="song in songs"
            :key="song.id"
            class="bg-white rounded-lg shadow-sm p-4 cursor-pointer hover:shadow-md transition"
          >
            <div class="flex justify-between items-center" @click="toggleSongExpansion(song.id)">
              <div>
                <h2 class="text-lg font-semibold">{{ song.title }}</h2>
                <p class="text-gray-600">{{ song.artist }}</p>
              </div>
              <div class="flex items-center space-x-2">
                <span class="text-sm text-gray-500">Key: {{ song.key }}</span>
                <ChevronDown :size="20" :class="{ 'transform rotate-180': expandedSong === song.id }" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>