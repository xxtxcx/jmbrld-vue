<script setup lang="ts">
import { inject } from 'vue';
import SongList from '../components/common/SongList.vue';

const myChart: any = inject('myChart');
const removeSelectedSong: any = inject('removeSelectedSong');

const onRemoveSong = (songId: any) => {
  const songToRemove = myChart.value.find(song => song.id === songId);
  if (songToRemove) {
    removeSelectedSong(songToRemove);
  }
};
</script>

<template>
  <div>
    <h2 class="text-2xl font-bold mb-4">My Chart</h2>
    <SongList 
      :data="myChart"
      @add-or-delete="onRemoveSong"
    />
  </div>
</template>