<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import SongItem from './SongItem.vue';

const props = defineProps(['data']);
const emit = defineEmits(['artist-search', 'add-or-delete']);

const onArtistSearch = (artist: string) => {
  emit('artist-search', artist);
};

const onAddOrDelete = (id: number) => {
  emit('add-or-delete', id);
};
</script>

<template>
  <div v-if="data.length > 0">
    <SongItem 
      v-for="song in data" 
      :key="song.id" 
      :song="song"
      @artist-search="onArtistSearch"
      @add-or-delete="onAddOrDelete"
    />
  </div>
  <div v-else style="font-size: 2rem; margin-top: 20px;">
    No Songs Found
  </div>
</template>