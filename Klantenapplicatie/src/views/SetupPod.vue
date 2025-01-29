<script setup lang="ts">
import GeneralButton from '@/components/atoms/GeneralButton.vue'
import { setupPod } from '@/utils/setup'
import { getDefaultSession } from '@inrupt/solid-client-authn-browser'
import { ref } from 'vue'
import { toast } from 'vue3-toastify'
const birthDate = ref('')
const error = ref('')
const loading = ref<boolean>(false)

const executeSetup = async () => {
  try {
    loading.value = true
    if (birthDate.value === '') {
      error.value = 'Fill in your birthday'
      return
    }
    const date = new Date(birthDate.value)
    await setupPod(getDefaultSession().info.webId!, date)
    toast('successfully setup your pod for use', {
      autoClose: 3000,
      position: toast.POSITION.BOTTOM_LEFT,
      toastStyle: {
        color: 'green',
      },
    })
  } catch (error) {
    toast(error, {
      autoClose: 3000,
      position: toast.POSITION.BOTTOM_LEFT,
      toastStyle: {
        color: 'red',
      },
    })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <form action="POST" @submit.prevent novalidate>
    <div>
      <label for="birthdate">Birthdate</label>
      <input type="date" v-model="birthDate" required />
    </div>
    <span v-if="error !== ''" class="error">{{ error }}</span>
    <GeneralButton @click="executeSetup" v-if="!loading"> set up pod</GeneralButton>
    <div v-else class="loadercontainer">
      <span class="loader"></span>
    </div>
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
.loadercontainer {
  margin: 0 auto;
  width: fit-content;
}
.loader {
  width: 48px;
  height: 48px;
  border: 5px solid #fff;
  border-bottom-color: #ff3d00;
  border-radius: 50%;
  display: inline-block;
  box-sizing: border-box;
  animation: rotation 1s linear infinite;
}

@keyframes rotation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
