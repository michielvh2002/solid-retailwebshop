<script setup lang="ts">
import { useSessionStore } from '@/stores/sessionStore'
import { storeToRefs } from 'pinia'

const { session } = storeToRefs(useSessionStore())
</script>

<template>
  <div v-if="session.info.isLoggedIn"></div>
  <div v-else>
    <p>You must be logged in to apply for superplus</p>
  </div>
</template>
