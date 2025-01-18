<script setup lang="ts">
import GeneralButton from '@/components/atoms/GeneralButton.vue'
import type { Retailer } from '@/types/retailer'
import { updateRegisteredRetailers } from '@/utils/retailerHelper'
import { giveAccessToTypeIndex } from '@/utils/typeIndexHelper'
import { getDefaultSession } from '@inrupt/solid-client-authn-browser'
import { ref } from 'vue'
import { toast } from 'vue3-toastify'

const retailer = ref<Retailer>({
  name: '',
  webId: '',
  demographics: {
    read: false,
    write: false,
    append: false,
    control: false,
  },
  orderHistory: {
    read: false,
    write: false,
    append: false,
    control: false,
  },
})

const loading = ref<boolean>(false)

const update = async () => {
  try {
    loading.value = true
    const session = getDefaultSession()
    await updateRegisteredRetailers([retailer.value])
    await giveAccessToTypeIndex(session.info.webId!, retailer.value.webId, false, session.fetch)
    toast('successfully added a retailer', {
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
    <h2>Add a retailer</h2>
    <div class="inputgroup">
      <label for="webid">WebId</label>
      <input type="text" id="webid" v-model="retailer.webId" />
    </div>
    <div class="inputgroup">
      <label for="name">Name</label>
      <input type="text" id="name" v-model="retailer.name" />
    </div>
    <div>
      <fieldset>
        <legend>Access to demographic data</legend>
        <div class="checkboxes">
          <div>
            <label for="dr">read</label>
            <input type="checkbox" id="dr" v-model="retailer.demographics.read" />
          </div>
          <div>
            <label for="da">write</label>
            <input type="checkbox" id="da" v-model="retailer.demographics.append" />
          </div>
        </div>
      </fieldset>
    </div>
    <div>
      <fieldset>
        <legend>Access to order history data</legend>
        <div class="checkboxes">
          <div>
            <label for="or">read</label>
            <input type="checkbox" id="or" v-model="retailer.orderHistory.read" />
          </div>
          <div>
            <label for="da">write</label>
            <input type="checkbox" id="oa" v-model="retailer.orderHistory.append" />
          </div>
        </div>
      </fieldset>
    </div>
    <GeneralButton v-if="!loading" @click="update">Add</GeneralButton>
    <div v-else class="loadercontainer">
      <span class="loader"></span>
    </div>
  </form>
</template>

<style lang="scss" scoped>
form {
  display: grid;
  row-gap: 0.5rem;
  h2 {
    text-align: center;
  }
  .element {
    display: grid;
    grid-template-rows: 1fr 1fr;
  }
  .inputgroup {
    display: grid;
  }
  .checkboxes {
    display: flex;
    justify-content: space-around;
    div {
      display: flex;
      column-gap: 0.5rem;
    }
  }
  min-width: 25rem;
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
