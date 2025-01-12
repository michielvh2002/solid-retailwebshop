<script setup lang="ts">
import { useSessionStore } from '@/stores/sessionStore'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const sessionStore = useSessionStore()
const webid = ref('')
const router = useRouter()
const baseUrl = window.location.origin
</script>

<template>
  <div
    class="vh-100 d-flex justify-content-center align-items-center"
    style="background: rgb(57 181 255)"
  >
    <div class="container">
      <div class="row d-flex justify-content-center">
        <div class="col-12 col-md-8 col-lg-6">
          <div class="card bg-white">
            <div class="card-body p-5">
              <form
                class="mb-3 mt-md-4"
                @submit.prevent="
                  () => sessionStore.login(webid, baseUrl + router.options.history.state.back)
                "
              >
                <h2
                  class="fw-bold mb-2 text-uppercase"
                  style="margin-left: 29%; padding-bottom: 22px"
                >
                  Welcome !
                </h2>
                <div class="mb-3">
                  <label for="email" class="form-label">WebId</label>
                  <input type="text" class="form-control" id="email" v-model="webid" />
                </div>
                <!-- <p class="small">
                  <a class="text-primary" href="forget-password.html"
                    >Forgot password?</a
                  >
                </p> -->
                <div class="d-grid">
                  <button class="btn btn-outline-dark" type="submit">Login</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
