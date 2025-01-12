<script setup lang="ts">
import { useBasketStore } from '@/stores/basket'
import { useSessionStore } from '@/stores/sessionStore'
import { storeToRefs } from 'pinia'
const basketstore = useBasketStore()
const { session } = storeToRefs(useSessionStore())
</script>

<template>
  <nav class="navbar navbar-expand-lg">
    <div class="container">
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarTogglerDemo02"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <router-link to="/"
        ><img
          src="https://static.delhaize.be/static/next/icons/logo.be.svg?buildNumber=7bc843440e2d22bfe6673f0b08c7a4393a2360c53e3b917915391836ebe59221"
          width="40"
          height="40"
      /></router-link>
      <div class="container-fluid">
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul
            class="navbar-nav me-auto my-2 my-lg-0 navbar-nav-scroll"
            style="--bs-scroll-height: 100px"
          >
            <li class="nav-item">
              <router-link class="nav-link active" style="color: white" aria-current="page" to="/"
                >Home</router-link
              >
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/products">Products</router-link>
            </li>

            <li class="nav-item">
              <router-link class="nav-link" v-if="!session.info.isLoggedIn" to="/login">
                Log In
              </router-link>
              <button
                type="button"
                class="nav-link"
                style="cursor: pointer"
                v-else
                v-on:click="session.logout()"
              >
                Logout
              </button>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" :to="{ name: 'superplus' }">Superplus </router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" :to="{ name: 'admin' }">Admin </router-link>
            </li>
            <li>
              <router-link
                id="cart"
                to="/cart"
                class="cart"
                :data-totalitems="basketstore.basket.length"
              >
                <img src="../../assets/shopping-cart-solid.svg" alt="shopping cart" />
              </router-link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&display=swap');
nav {
  width: 100vw;
  border-bottom: 1px solid black;
}
img {
  color: white;
}
.cart {
  position: fixed;
  top: 20px;
  right: 40px;
  width: 30px;
  height: 30px;
  background: inherit;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  border-radius: 5px;
}

.cart i {
  font-size: 25px;
}

.cart:before {
  content: attr(data-totalitems);
  font-size: 12px;
  font-weight: 600;
  position: absolute;
  top: -12px;
  right: -12px;
  background: #ff0000;
  line-height: 24px;
  padding: 0 5px;
  height: 24px;
  min-width: 24px;
  color: white;
  text-align: center;
  border-radius: 24px;
}

.cart.shake {
  -webkit-animation: shakeCart 0.4s ease-in-out forwards;
  animation: shakeCart 0.4s ease-in-out forwards;
}

.nav-link {
  font-family: 'Lato', serif;
  font-weight: 700;
  font-style: normal;
}
</style>
