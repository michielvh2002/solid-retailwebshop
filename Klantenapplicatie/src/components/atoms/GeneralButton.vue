<script setup lang="ts"></script>

<template>
  <button type="button" v-bind="$attrs">
    <slot />
  </button>
</template>

<style lang="scss" scoped>
button {
  display: block;
  border-radius: 6px;
  color: white;
  border: none;
  padding: 1rem 4rem;
  font-size: large;
  margin: 1rem auto 0 auto;
  width: 100%;
  background-color: black;
}
button:hover {
  cursor: pointer;
}
</style>
