<template>
  <div>
    <Monaco ref="monacoEdit" v-model="text" :readonly="false" type='sql' class="monaco" />
  </div>
</template>

<script lang="ts" setup>
import { defineComponent, ref } from 'vue'
import Monaco from "./components/monaco/_base.vue"
const text = ref<string>('');
</script>

<style></style>
