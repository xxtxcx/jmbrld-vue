<script setup lang="ts">
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import AllSongs from './common/AllSongs.vue';
import MyChart from './MyChart.vue';

const route = useRoute();
</script>

<template>
  <div class="main">
    <div class="mainContent">
      <AllSongs v-if="route.path === '/'" />
      <MyChart v-if="route.path === '/my-chart'" />
    </div>
  </div>
</template>