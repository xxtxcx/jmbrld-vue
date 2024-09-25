<script setup lang="ts">
import { computed } from 'vue';
import { PlusCircle, Check, Trash2, Music } from 'lucide-vue-next';

const props = defineProps(['selected']);
const emit = defineEmits(['click']);

const buttonContent = computed(() => {
  if (props.selected) {
    return {
      icon1: Check,
      icon2: Trash2
    };
  } else {
    return {
      icon1: Music,
      icon2: PlusCircle
    };
  }
});

const handleClick = () => {
  emit('click');
};
</script>

<template>
  <div @click="handleClick" class="flex items-center space-x-2 cursor-pointer">
    <component :is="buttonContent.icon1" class="w-5 h-5 text-indigo-600" />
    <component :is="buttonContent.icon2" class="w-5 h-5 text-indigo-600" />
  </div>
</template>