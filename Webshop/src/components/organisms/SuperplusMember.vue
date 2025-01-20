<script setup lang="ts">
import { getDemographicdataFrom, getOrdersFrom } from '@/utils/admin'
import { ref } from 'vue'
import { JsonViewer } from 'vue3-json-viewer'
import 'vue3-json-viewer/dist/index.css'

const props = defineProps({
  webid: {
    required: true,
    type: String,
  },
  demographicRead: {
    required: true,
    type: Boolean,
  },
  orderhistoryRead: {
    required: true,
    type: Boolean,
  },
})

const demographicData = ref('')
const orderHistory = ref('')

const fetchDemographicdata = async () => {
  demographicData.value = JSON.stringify(await getDemographicdataFrom(props.webid), null, 2)
}
const fetchOrderHistory = async () => {
  orderHistory.value = JSON.stringify(await getOrdersFrom(props.webid), null, 2)
}
</script>

<template>
  <div class="containerp">
    <p>{{ webid }}</p>
    <button
      @click="async () => await fetchDemographicdata()"
      type="button"
      v-if="demographicRead"
      class="btn-fetch"
    >
      <div class="d-flex justify-content-between">
        <span>fetch demographic data</span>
      </div>
    </button>
    <button
      @click="async () => await fetchOrderHistory()"
      type="button"
      v-if="demographicRead"
      class="btn-fetch"
    >
      <div class="d-flex justify-content-between">
        <span>fetch order history</span>
      </div>
    </button>
  </div>
  <JsonViewer
    v-if="demographicData !== ''"
    :value="JSON.parse(demographicData)"
    copyable
    boxed
    sort
    theme="jv-light"
  />
  <JsonViewer
    v-if="orderHistory !== ''"
    :value="JSON.parse(orderHistory)"
    copyable
    theme="jv-light"
  />
</template>

<style scoped lang="scss">
.containerp {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.btn-fetch {
  border: 1px solid black;
  border-radius: 8px;
  padding: 1rem 2rem;
  background-color: inherit;
}
</style>
