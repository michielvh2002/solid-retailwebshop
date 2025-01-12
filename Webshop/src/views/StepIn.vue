<script setup lang="ts">
import { WEBID_DELHAIZE } from '@/constants/appConstants'
import { useSessionStore } from '@/stores/sessionStore'
import { checkPermissions, registerMember } from '@/utils/membership'
import { storeToRefs } from 'pinia'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const { session } = storeToRefs(useSessionStore())
const router = useRouter()
const accessRights = ref({
  demographic: {
    read: false,
    write: false,
  },
  orderhistory: {
    read: false,
    write: false,
  },
})
const loading = ref(false)
const error = ref('')

onMounted(async () => {
  if (!session.value.info.isLoggedIn) {
    router.push({ name: 'login' })
  }
  await refreshPermissions()
})

const refreshPermissions = async () => {
  loading.value = true
  const res = await checkPermissions()
  accessRights.value = res
  loading.value = false
}

const registerAsMember = async () => {
  if (!accessRights.value.demographic.read || !accessRights.value.orderhistory.read) {
    error.value = 'We need at least read permissions to your order history and demographic data'
    return
  }
  const res = await registerMember()
  if (res.status === 200) {
    router.push({ name: 'success' })
  }
}
</script>

<template>
  <h1>Become a member of Delhaize Superplus</h1>
  <div class="introduction">
    <p>
      To become a member, give us read and/or write permissions to your demographic data and
      orderhistory, and receive up to 800 Delhaize points!
    </p>
    <p>
      When giving read permissions to your demographic data and your purchase history, you recieve
      400 Delhaize points
    </p>
    <p>
      >When giving read and write permissions to your demographic data and your purchase history,
      you recieve 800 Delhaize points
    </p>
    <p>
      Our WebId: <span>{{ WEBID_DELHAIZE }}</span>
    </p>
    <p>
      You can add us <a href="" target="_blank">manually</a>, or use our
      <a href="" target="_blank">application</a> to automate this process
    </p>
  </div>
  <div class="permsdiv">
    <button
      @click="async () => refreshPermissions()"
      type="button"
      v-if="!loading"
      class="btn btn-primary btn-block btn-lg refresh"
    >
      <div class="d-flex justify-content-between">
        <span>Refresh</span>
      </div>
    </button>
    <p class="refresh pwf" v-else>Loading...</p>
    <table>
      <tr>
        <th></th>
        <th>Demographic data</th>
        <th>Order history</th>
      </tr>
      <tr>
        <td>Read</td>
        <td>
          <p v-if="accessRights.demographic.read">
            granted <img src="../assets/green_checkmark.svg" alt="check" />
          </p>
          <p v-else>revoked <img src="../assets/red_error_white_cross.png" alt="X" /></p>
        </td>
        <td>
          <p v-if="accessRights.orderhistory.read">
            granted <img src="../assets/green_checkmark.svg" alt="check" />
          </p>
          <p v-else>revoked <img src="../assets/red_error_white_cross.png" alt="X" /></p>
        </td>
      </tr>
      <tr>
        <td>Write</td>
        <td>
          <p v-if="accessRights.demographic.write">
            granted <img src="../assets/green_checkmark.svg" alt="check" />
          </p>
          <p v-else>revoked <img src="../assets/red_error_white_cross.png" alt="X" /></p>
        </td>
        <td>
          <p v-if="accessRights.orderhistory.write">
            granted <img src="../assets/green_checkmark.svg" alt="check" />
          </p>
          <p v-else>revoked <img src="../assets/red_error_white_cross.png" alt="X" /></p>
        </td>
      </tr>
    </table>
    <button
      @click="async () => registerAsMember()"
      type="button"
      class="btn btn-primary btn-block btn-lg btn-center"
      :disabled="!accessRights.demographic.read || !accessRights.orderhistory.read"
    >
      <div class="d-flex justify-content-between">
        <span>Become a superplus member</span>
      </div>
    </button>
    <p class="error" v-if="error !== ''">{{ error }}</p>
  </div>
</template>

<style scoped lang="scss">
img {
  max-height: 21px;
}
.error {
  color: red;
}
table {
  min-width: 30rem;
  tr {
    width: 100%;
    display: grid;
    grid-template-columns: 4rem 1fr 1fr;
    padding: 0.5rem 2rem;
    td:first-child {
      font-weight: bold;
    }
  }
}
.permsdiv {
  margin: 0 auto;
  padding: 1.5rem;
  width: fit-content;
  box-shadow: 5px 8px 3px 2px #888888;
  border-radius: 10px;
}
.btn-center {
  margin: 0 auto;
  display: block;
}
.refresh {
  display: block;
  margin-left: auto;
}
.pwf {
  width: fit-content;
}
</style>
