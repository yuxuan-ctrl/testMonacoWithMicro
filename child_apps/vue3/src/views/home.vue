<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <button @click="testpushState">测试pushState</button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import HelloWorld from '@/components/HelloWorld.vue' // @ is an alias to /src

export default defineComponent({
  name: 'Home',
  components: {
    HelloWorld
  },
  methods: {
    testpushState() {
      history.replaceState({ data: "test" }, "", "/page2")
    }
  }
})
</script>
