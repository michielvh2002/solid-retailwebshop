<script setup lang="ts">
import { useBasketStore } from '@/stores/basket'
import { useSessionStore } from '@/stores/sessionStore'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
const { session } = storeToRefs(useSessionStore())
const router = useRouter()

const basketStore = useBasketStore()
const showModal = ref(false)

const checkout = () => {
  if (session.value.info.isLoggedIn) {
    console.log('test')
    basketStore.checkoutItems()
  } else showModal.value = true
}

const login = () => {
  router.push({ name: 'login' })
}
</script>

<template>
  <div>
    <section class="h-100 h-custom">
      <div class="container h-100 py-5">
        <div
          v-if="basketStore.basket.length > 0"
          class="row d-flex justify-content-center align-items-center h-100"
        >
          <div class="col">
            <div class="table-responsive">
              <table class="table">
                <thead>
                  <tr>
                    <th scope="col" class="h5">Shopping Cart</th>

                    <th scope="col">Quantity</th>
                    <th scope="col">Price</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in basketStore.basket" :key="item.product.name">
                    <th scope="row" class="border-bottom-0">
                      <div class="d-flex align-items-center">
                        <div class="product-img-container">
                          <img
                            :src="item.product.image"
                            class="img-fluid rounded-3 product-img"
                            :alt="item.product.name"
                          />
                        </div>
                        <div class="flex-column ms-4">
                          <p class="mb-2">
                            {{ item.product.name }}
                          </p>
                          <p class="mb-0">{{ item.product.brand }}</p>
                        </div>
                      </div>
                    </th>

                    <td class="align-middle border-bottom-0">
                      <div class="d-flex flex-row">
                        <button
                          class="btn btn-link px-2"
                          @click="basketStore.removeFromCart(item.product)"
                        >
                          <i class="fas fa-minus"></i>
                        </button>

                        <input
                          id="form1"
                          min="1"
                          name="quantity"
                          :value="item.quantity"
                          type="number"
                          class="form-control form-control-sm"
                          style="width: 53px"
                        />

                        <button
                          class="btn btn-link px-2"
                          @click="basketStore.addToCart(item.product)"
                        >
                          <i class="fas fa-plus"></i>
                        </button>
                      </div>
                    </td>
                    <td class="align-middle border-bottom-0">
                      <p class="mb-0" style="font-weight: 500">
                        {{ (item.product.price * item.quantity).toFixed(2) }} EUR
                      </p>
                    </td>
                    <td class="align-middle border-bottom-0">
                      <img
                        class="mb-0"
                        style="height: 25px"
                        src="../assets/icons8_close_50px.png"
                        @click="basketStore.deleteFromCart(item.product)"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div class="card shadow-2-strong mb-5 mb-lg-0" style="border-radius: 16px">
            <div class="card-body p-4">
              <div class="row">
                <div class="col-lg-4 col-xl-3">
                  <div class="d-flex justify-content-between" style="font-weight: 500">
                    <p class="mb-2">Subtotal</p>
                    <p class="mb-2">{{ (basketStore.totalPrice * 0.79).toFixed(2) }} EUR</p>
                  </div>

                  <div class="d-flex justify-content-between" style="font-weight: 500">
                    <p class="mb-0">BTW</p>
                    <p class="mb-0">{{ (basketStore.totalPrice * 0.21).toFixed(2) }} EUR</p>
                  </div>

                  <hr class="my-4" />

                  <div class="d-flex justify-content-between mb-4" style="font-weight: 500">
                    <p class="mb-2">Total (incl. BTW)</p>
                    <p class="mb-2">{{ basketStore.totalPrice }} EUR</p>
                  </div>
                  <button
                    @click="checkout"
                    type="button"
                    v-if="session.info.isLoggedIn"
                    class="btn btn-primary btn-block btn-lg"
                    data-bs-toggle="modal"
                    data-bs-target="#exampleModal"
                  >
                    <div class="d-flex justify-content-between">
                      <span>Checkout</span>
                    </div>
                  </button>
                  <button
                    type="button"
                    v-else
                    class="btn btn-primary btn-block btn-lg"
                    data-bs-toggle="modal"
                    data-bs-target="#exampleModal1"
                  >
                    <div class="d-flex justify-content-between">
                      <span>Checkout</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="row d-flex justify-content-center align-items-center h-100">
          <table class="table">
            <thead>
              <tr>
                <th scope="col" class="h5">Shopping Cart</th>
              </tr>
            </thead>
          </table>
          <br />
          <div>
            <center>Cart is empty</center>
            <br />
            <br />
            <router-link to="/products">
              <img src="../assets/icons8_back_64px.png" style="height: 37px" />
              Continue shopping
            </router-link>
          </div>
        </div>
      </div>
    </section>
  </div>
  <!-- Modal -->
  <div
    class="modal fade"
    id="exampleModal"
    tabindex="-1"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content" style="border: black">
        <div class="modal-header" style="background: #242121; color: white">
          <div class="r" style="display: flex; margin: auto">
            <img src="../assets/icons8_Done_64px_1.png" style="height: 31px" />
            <h5 class="modal-title" id="exampleModalLabel">Order will be processed</h5>
          </div>
        </div>
        <div class="modal-body" style="display: flex">
          <div class="row g-0">
            <div class="col-md-4">
              <img
                src="../assets/time-check-symbol_ready_timer_checkmark_countdown_compliance_done_reminder-512.webp"
                class="img-fluid rounded-start"
                alt="..."
              />
            </div>
            <div class="col">
              <p class="card-text" style="margin-top: 62px; margin-left: 46px">
                Your order will be processed !
              </p>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" id="close" class="btn btn-dark" data-bs-dismiss="modal">
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
  <!-- Modal -->
  <!-- Modal 2 -->
  <div
    class="modal fade"
    id="exampleModal1"
    tabindex="-1"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content" style="border: black">
        <div class="modal-header" style="background: #242121; color: white">
          <div class="r" style="display: flex; margin: auto">
            <img src="../assets/icons8_close_26px.png" style="height: 31px" />
            <h5 class="modal-title" id="exampleModalLabel">You need to authentificate first</h5>
          </div>
        </div>
        <div class="modal-body" style="display: flex">
          <div class="row g-0">
            <div class="col-md-4">
              <img src="../assets/R.png" class="img-fluid rounded-start" alt="..." />
            </div>
            <div class="col">
              <p class="card-text" style="margin: revert; margin-left: 29px">
                You need to authentificate first
              </p>
              <br />
              <button
                type="button"
                class="btn btn-outline-dark"
                data-bs-dismiss="modal"
                @click="login"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" id="close1" class="btn btn-dark" data-bs-dismiss="modal">
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
a {
  text-decoration: none;
  color: inherit;
}

.product-img-container {
  max-width: 6rem;
  width: 6rem;
  align-items: center;
  .product-img {
    height: auto;
    max-height: 7rem;
    width: auto;
    max-width: 6rem;
    margin: 0 auto;
    display: block;
  }
}
</style>
