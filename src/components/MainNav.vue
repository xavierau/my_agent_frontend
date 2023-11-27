<script setup lang="ts">

</script>

<template>
    <div class="main-nav">
        <router-link class="main-nav" :to="{name:'audio'}">Audio Mode</router-link>
        <router-link class="main-nav" :to="{name:'messages'}">Message Mode</router-link>
    </div>

</template>

<style scoped lang="scss">
.main-nav {
  width: 100%;
  min-width: 800px;
  margin: 15px;
  display: flex;
  justify-content: space-between;

  a {

  }

}
</style>
