<script setup lang="ts">
import { ref, inject, computed } from 'vue';
import { Music, ChevronDown } from 'lucide-vue-next';
import Unibutton from './Unibutton.vue';

const props = defineProps(['song']);
const emit = defineEmits(['artist-search', 'add-or-delete']);

const open = ref(false);
const myChart: any = inject('myChart');

const { title, artist, bpm, originalKey, chords } = props.song;
const chordProgression = ref(chords.split(/(\s+)/).filter(e => e.trim().length > 0));
const currKey = ref(originalKey);

const onArtistSearch = () => {
  emit('artist-search', artist);
};

const onAddOrDelete = () => {
  emit('add-or-delete', props.song.id);
};

const selected = computed(() => {
  return myChart.value.some(song => song.id === props.song.id);
});

const transpose = (chord, increment) => {
  // Реалізація функції transpose...
};

const changeKey = (increment) => {
  const newPr = chordProgression.value.map(item => transpose(item, increment));
  chordProgression.value = newPr;
  currKey.value = transpose(currKey.value, increment);
};

const visualChords = computed(() => {
  return chordProgression.value.join(' ').replace(/xyz/g, '\n');
});
</script>

<template>
  <div class="playlistPage">
    <div class="mainInner">
      <div class="playlistPageSongs">
        <ul class="songList">
          <li>
            <div class="parent">
              <div class="songIcon">
                <Unibutton :selected="selected" @click="onAddOrDelete" />
              </div>
              <div class="songDetails">
                <h3 @click="open = !open">{{ title }}</h3>
                <span @click="onArtistSearch">{{ artist }}</span>
              </div>
              <div class="songTime">
                <span>{{ bpm }}</span>
              </div>
              <div class="songTime">
                <span>{{ originalKey }}</span>
              </div>
            </div>
          </li>
          <li v-if="open">
            <div class="display-linebreak">
              <h6>Current Key: {{ currKey }}</h6>
              <pre>{{ visualChords }}</pre>
              <div class="d-flex justify-content-center align-items-center">
                <button @click="changeKey(-1)">-1</button>
                <button @click="changeKey(1)">+1</button>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>