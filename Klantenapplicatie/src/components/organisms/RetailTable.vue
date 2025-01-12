<script setup lang="ts">
import type { Retailer } from '@/types/retailer'
import { getRegisteredRetailers, updateRegisteredRetailers } from '@/utils/retailerHelper'
import TableRow from '../molecules/TableRow.vue'
import { onMounted, ref } from 'vue'
import GeneralButton from '../atoms/GeneralButton.vue'

let retailers = ref<Array<Retailer>>([])
onMounted(async () => {
  retailers.value = await getRegisteredRetailers()
})
</script>

<template>
  <table>
    <tbody>
      <tr>
        <th>Name</th>
        <th>WebId</th>
        <th>Order history</th>
        <th>Demographics</th>
      </tr>
      <tr v-for="(retailer, index) in retailers" :key="index">
        <TableRow v-model:retailer="retailers[index]" />
      </tr>
    </tbody>
  </table>
  <GeneralButton @click="async () => await updateRegisteredRetailers(retailers)"
    >Update</GeneralButton
  >
</template>

<style lang="css" scoped>
table {
  width: 100%;
}
</style>
