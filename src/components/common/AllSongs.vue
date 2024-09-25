<script setup lang="ts">
import { ref, inject, computed } from 'vue';
import SearchPanel from './SearchPanel.vue';
import SongList from './SongList.vue';

const songs = inject('songs');
const term = ref('');

const onUpdateSearch = (newTerm: string) => {
  term.value = newTerm;
};

const onArtistSearch = (artist: string) => {
  term.value = artist;
};

const searchEmp = (items, term) => {
  if (term.length === 0) {
    return items;
  }
  return items.filter(item => 
    item.title.toLowerCase().includes(term.toLowerCase()) ||
    item.artist.toLowerCase().includes(term.toLowerCase())
  );
};

const visibleSongList = computed(() => searchEmp(songs.value, term.value));

const onAddOrDelete = inject('selectedSong');
</script>

<template>
  <div>
    <div class='search-panel'>
      <SearchPanel 
        :term="term"
        @update-search="onUpdateSearch"
        @artist-search="onArtistSearch"
      />
    </div>
    <SongList 
      :data="visibleSongList"
      @artist-search="onArtistSearch"
      @add-or-delete="onAddOrDelete"
    />
  </div>
</template>