<script setup lang="ts">
import type { Retailer } from '@/types/retailer'

const retailer = defineModel<Retailer>('retailer', { required: true })
</script>

<template>
  <td>{{ retailer.name }}</td>
  <td>{{ retailer.webId }}</td>
  <td>
    <div>
      <label>read</label>
      <input type="checkbox" v-model="retailer.orderHistory.read" />
    </div>
    <div>
      <label>write</label>
      <input type="checkbox" v-model="retailer.orderHistory.append" />
    </div>
  </td>
  <td>
    <div>
      <label>read</label>
      <input type="checkbox" v-model="retailer.demographics.read" />
    </div>
    <div>
      <label>write</label>
      <input type="checkbox" v-model="retailer.demographics.append" />
    </div>
  </td>
</template>

<style lang="scss" scoped>
td {
  text-align: center;
}
</style>
