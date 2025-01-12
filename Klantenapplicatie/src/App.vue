<script setup lang="ts">
import { useRoute } from 'vue-router'
import HeaderAuthorized from './components/organisms/HeaderAuthorized.vue'

const route = useRoute()
</script>

<template>
  <HeaderAuthorized v-if="!route.meta.hideHeader"></HeaderAuthorized>
  <RouterView />
</template>

<style scoped></style>
