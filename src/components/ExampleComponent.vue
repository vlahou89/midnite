<template>
  <div class="text-white example-class">Hello {{ foo }}</div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';

const props = defineProps({
  foo: {
    type: Object as PropType<any>,
    required: true
  }
})

</script>

<style>
.example-class {
  background: green;
}

</style>