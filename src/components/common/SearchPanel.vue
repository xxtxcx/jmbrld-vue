<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps(['term']);
const emit = defineEmits(['update-search']);

const localTerm = ref(props.term);

watch(() => props.term, (newTerm) => {
  localTerm.value = newTerm;
});

const onUpdateSearch = (e: Event) => {
  const term = (e.target as HTMLInputElement).value;
  localTerm.value = term;
  emit('update-search', term);
};
</script>

<template>
  <input 
    type="text"
    class="form-control search-input"
    placeholder="Find needed song.."
    :value="localTerm"
    @input="onUpdateSearch"
  />
</template>