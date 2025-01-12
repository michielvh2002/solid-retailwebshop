<script setup lang="ts">
import { useBasketStore } from '@/stores/basket'
import type { Product } from '@/types/product'

defineModel<Product>('item', { required: true })
const basketStore = useBasketStore()
</script>

<template>
  <div class="card1 h-100 shadow-sm">
    <router-link href="#" :to="{ path: 'products/' + item.name }">
      <img :src="item.image" class="card1-img-top" alt="product.title" />
    </router-link>

    <div class="label-top shadow-sm">
      <a class="text-white" href="#">{{ item.brand }}</a>
    </div>
    <div class="card-body">
      <div class="clearfix mb-3">
        <span class="float-start badge rounded-pill">{{ item.price + ' ' + item.currency }}</span>

        <span class="float-end">
          <router-link
            class="small text-muted text-uppercase aff-link"
            href="#"
            :to="{ path: 'products/' + item.name }"
            >>More</router-link
          >
        </span>
      </div>

      <div class="d-grid gap-2 my-4">
        <button
          data-bs-toggle="modal"
          data-bs-target="#exampleModal"
          @click="basketStore.addToCart(item)"
          class="btn bold-btn"
        >
          add to cart
        </button>
      </div>
      <div class="clearfix mb-1">
        <span class="float-start"
          ><a href="#"><i class="fas fa-question-circle"></i></a
        ></span>

        <span class="float-end">
          <i class="far fa-heart" style="cursor: pointer"></i>
        </span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.bold-btn,
.badge {
  border: 1px solid black;
}
.badge {
  color: black;
  font-size: 0.8rem;
}
</style>
