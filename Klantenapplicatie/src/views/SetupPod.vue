<script setup lang="ts">
import GeneralButton from '@/components/atoms/GeneralButton.vue'
import { setupPod } from '@/utils/setup'
import { getDefaultSession } from '@inrupt/solid-client-authn-browser'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
const birthDate = ref('')
const error = ref('')
const router = useRouter()
</script>

<template>
  <form action="POST" @submit.prevent novalidate>
    <div>
      <label for="birthdate">Birthdate</label>
      <input type="date" v-model="birthDate" required />
    </div>
    <span v-if="error !== ''" class="error">{{ error }}</span>
    <GeneralButton
      @click="
        async () => {
          if (birthDate === '') {
            error = 'Fill in your birthday'
            return
          }
          const date = new Date(birthDate)
          await setupPod(getDefaultSession().info.webId!, date)
          router.push({ name: 'home' })
        }
      "
      >set up pod</GeneralButton
    >
  </form>
</template>

<style lang="scss" scoped>
form {
  display: grid;
  row-gap: 0.5rem;
  min-width: 25rem;
  max-width: 30rem;
  margin: 0 auto;
  background-color: white;
  padding: 2rem;
  box-shadow: 5px 8px 3px 2px #888888;
  border-radius: 10px;
  height: fit-content;
  div {
    display: grid;
    input {
      border-radius: 8px;
      padding: 0.5rem;
      max-width: 10rem;
    }
  }
}
.error {
  color: red;
}
</style>
