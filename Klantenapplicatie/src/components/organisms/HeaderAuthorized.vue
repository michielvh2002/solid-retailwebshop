<script setup lang="ts">
import AppLink from '../atoms/AppLink.vue'
</script>

<template>
  <header>
    <AppLink routeName="home">Home</AppLink>
    <AppLink routeName="setuppod">Setup Pod</AppLink>
    <AppLink routeName="addretailer">Add retailer</AppLink>
  </header>
</template>

<style scoped lang="scss">
header {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  column-gap: 1rem;
}
</style>
