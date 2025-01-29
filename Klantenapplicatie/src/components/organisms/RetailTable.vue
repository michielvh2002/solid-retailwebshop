<script setup lang="ts">
import type { Retailer } from '@/types/retailer'
import {
  deleteRetailer,
  getRegisteredRetailers,
  updateRegisteredRetailers,
} from '@/utils/retailerHelper'
import TableRow from '../molecules/TableRow.vue'
import { onMounted, ref } from 'vue'
import GeneralButton from '../atoms/GeneralButton.vue'
import { toast } from 'vue3-toastify'

let retailers = ref<Array<Retailer>>([])
onMounted(async () => {
  retailers.value = await getRegisteredRetailers()
})
const loading = ref<boolean>(false)

const updateRetailers = async () => {
  try {
    loading.value = true
    await updateRegisteredRetailers(retailers.value)
    toast('successfully updated the retailers', {
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

const deleteARetailer = async (index: number) => {
  try {
    await deleteRetailer(retailers.value[index])
    retailers.value.splice(index, 1)
  } catch (error) {}
}
</script>

<template>
  <table>
    <tbody>
      <tr>
        <th>Name</th>
        <th>WebId</th>
        <th>Order history</th>
        <th>Demographics</th>
        <th class="invisible">delete</th>
      </tr>
      <tr v-for="(retailer, index) in retailers" :key="index">
        <TableRow v-model:retailer="retailers[index]" />
        <td>
          <button class="trashbtn" @click="async () => deleteARetailer(index)">
            <img src="../../assets/trash-can.svg" alt="delete retailer" class="trashimg" />
          </button>
        </td>
      </tr>
    </tbody>
  </table>
  <GeneralButton @click="updateRetailers" v-if="!loading">Update</GeneralButton>
  <div v-else class="loadercontainer">
    <span class="loader"></span>
  </div>
</template>

<style lang="css" scoped>
table {
  width: 100%;
}
.invisible {
  text-indent: -99999px;
}
.trashbtn {
  background-color: inherit;
  border: none;
  cursor: pointer;
}
.trashimg {
  height: 2rem;
  width: auto;
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
