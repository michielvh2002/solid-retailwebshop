<script setup lang="ts">
import { useRoute } from 'vue-router'
import { products } from '@/constants/fakeProducts'
import { useBasketStore } from '@/stores/basket.ts'
import { ref } from 'vue'
const route = useRoute()
const basketStore = useBasketStore()
const product = products.find((p) => p.name === route.params.name)
if (!product) {
  throw new Error('No product found')
}
const quantity = ref(1)
</script>

<template>
  <div class="card">
    <div class="row g-0">
      <div class="col-md-6 border-end">
        <div class="d-flex flex-column justify-content-center">
          <div class="main_image">
            <img :src="product.image" id="main_product_image" />
          </div>
          <div class="thumbnail_images">
            <ul id="thumbnail">
              <li>
                <img :src="product.image" />
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="p-3 right-side rg-2">
          <div class="d-flex justify-content-between align-items-center">
            <h3>{{ product.name }}</h3>
          </div>

          <h3 style="color: #005eb8; font-size: xxx-large">
            {{ product.price }} {{ product.currency }}
          </h3>
          <div class="mt-2 pr-3 content" style="margin-top: 1rem !important">
            <p style="font-size: 16px">lorem ipsum</p>
          </div>
          <div class="ratings d-flex flex-row align-items-center">
            <div class="d-flex flex-row">
              <i class="bx bxs-star"></i> <i class="bx bxs-star"></i> <i class="bx bxs-star"></i>
              <i class="bx bxs-star"></i>
              <i class="bx bx-star"></i>
            </div>
            <span>441 reviews</span>
          </div>
          <div class="mt-5">
            <div class="r" style="display: flex; margin: auto">
              <span class="fw-bold">Status: </span>
              <img src="../assets/icons8_done_48px.png" style="margin-left: 15px; width: 23px" />
              <span id="exampleModalLabel" />
              Available
            </div>
          </div>
          <br />
          <div class="buttons d-flex flex-row mt-5 gap-3">
            <div class="row" style="margin-top: -30px">
              <div>
                <h5>Quantity</h5>
              </div>
              <div class="d-flex flex-row">
                <button class="btn btn-link px-2" style="width: 30px" @click="quantity--">
                  <img src="../assets/minus-solid.svg" alt="minus" />
                </button>

                <input
                  id="form1"
                  min="1"
                  name="quantity"
                  :value="quantity"
                  type="number"
                  class="form-control form-control-sm"
                  style="width: 53px"
                />

                <button class="btn btn-link px-2" style="width: 30px" @click="quantity++">
                  <img src="../assets/plus-solid.svg" alt="plus" />
                </button>
              </div>
            </div>
          </div>
          <button class="btn btn-add" @click="basketStore.addToCart(product, quantity)">
            Add to cart
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.card {
  border: none;
  overflow: hidden;
  margin-top: 5rem;
}
.btn-add {
  border: 1px solid black;
  border-radius: 8px;
  padding: 1rem 2rem;
  margin-top: 1rem;
}
.thumbnail_images ul {
  list-style: none;
  justify-content: center;
  display: flex;
  align-items: center;
  margin-top: 10px;
}
.thumbnail_images ul li {
  margin: 5px;
  padding: 10px;
  border: 2px solid #eee;
  cursor: pointer;
  transition: all 0.5s;
  img {
    height: 150px;
    width: auto;
    object-fit: cover;
  }
}
.thumbnail_images ul li:hover {
  border: 2px solid #000;
}
.main_image {
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid #eee;
  height: 400px;
  width: 100%;
  overflow: hidden;
  img {
    object-fit: cover;
    height: inherit;
    width: auto;
  }
}

.content p {
  font-size: 12px;
}
.ratings span {
  font-size: 14px;
  margin-left: 6px;
}
.colors {
  margin-top: 5px;
}
.colors ul {
  list-style: none;
  display: flex;
  padding-left: 0px;
}
.colors ul li {
  height: 20px;
  width: 20px;
  display: flex;
  border-radius: 50%;
  margin-right: 10px;
  cursor: pointer;
}
.colors ul li:nth-child(1) {
  background-color: #6c704d;
}
.colors ul li:nth-child(2) {
  background-color: #96918b;
}
.colors ul li:nth-child(3) {
  background-color: #68778e;
}
.colors ul li:nth-child(4) {
  background-color: #263f55;
}
.colors ul li:nth-child(5) {
  background-color: black;
}
.right-side {
  position: relative;
}
</style>
