import type { OrderItem } from '@/types/orderItem'
import type { Product } from '@/types/product'
import { defineStore, storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import { useSessionStore } from './sessionStore'
import { API_BASE_URL } from '@/constants/appConstants'

export const useBasketStore = defineStore(
  'basket',
  () => {
    const basket = ref<Array<OrderItem>>([])
    const totalPrice = computed(() => {
      return basket.value.reduce((acc, curr) => {
        return acc + curr.quantity * curr.product.price
      }, 0)
    })

    const addToCart = (item: Product, quantity: number = 1) => {
      const index = basket.value.findIndex((x) => x.product.name === item.name)
      if (index < 0) basket.value.push({ quantity: quantity, product: item })
      else {
        basket.value[index].quantity++
      }
    }
    const removeFromCart = (item: Product) => {
      const index = basket.value.findIndex((x) => x.product.name === item.name)
      console.log('test')
      if (index < 0) return
      basket.value[index].quantity--
    }

    const deleteFromCart = (item: Product) => {
      const index = basket.value.findIndex((x) => x.product.name === item.name)
      if (index < 0) return
      basket.value.splice(index, 1)
    }

    const checkoutItems = () => {
      const { session } = storeToRefs(useSessionStore())
      if (session.value.info.isLoggedIn) {
        session.value.fetch(API_BASE_URL + '/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(basket.value),
        })
        basket.value = []
      } else {
        console.warn('nope')
      }
    }

    return { basket, totalPrice, addToCart, removeFromCart, checkoutItems, deleteFromCart }
  },
  {
    persist: true,
  },
)
