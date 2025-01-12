<script setup lang="ts">
import GeneralButton from '@/components/atoms/GeneralButton.vue'
import { loginToPod } from '@/utils/login'
import { ref } from 'vue'

const webId = ref<string>('')
const err = ref<string>('')

const login = async () => {
  try {
    await loginToPod(webId.value, new URL('/', window.location.href).toString())
  } catch (error: any) {
    if (error.statusCode === 404) {
      err.value = 'WebId is not correct'
    } else {
      err.value = error.message
    }
  }
}
</script>

<template>
  <form action="POST" @submit.prevent novalidate>
    <h2>Login</h2>
    <span class="error" v-if="err !== ''">{{ err }}</span>
    <div class="element">
      <label for="webid">WebId</label>
      <input type="text" id="webid" v-model="webId" required />
    </div>
    <GeneralButton @click="login">Login</GeneralButton>
  </form>
</template>

<style lang="scss" scoped>
form {
  h2 {
    text-align: center;
  }
  .element {
    display: grid;
    grid-template-rows: 1fr 1fr;
  }
  min-width: 20rem;
  max-width: 30rem;
  margin: 0 auto;
  background-color: white;
  padding: 2rem;
  box-shadow: 5px 8px 3px 2px #888888;
  border-radius: 10px;
  height: fit-content;
}
.error {
  color: red;
}
</style>
