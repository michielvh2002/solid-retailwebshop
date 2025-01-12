<script setup lang="ts">
defineProps({
  routeName: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <div>
    <RouterLink :to="{ name: routeName }" class="link"><slot></slot></RouterLink>
  </div>
</template>

<style scoped lang="scss">
div {
  text-align: center;
  margin-top: 0.5rem;
}
.link {
  position: relative;
  display: inline-block;
  margin: 15px 25px;
  outline: none;
  color: #000;
  text-decoration: none;
  //text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 400;
  text-shadow: 0 0 1px rgba(255, 255, 255, 0.3);
  font-size: 1.35em;
}

.link:hover,
.link:focus {
  outline: none;
}
.link::before,
.link::after {
  display: inline-block;
  opacity: 0;
  -webkit-transition:
    -webkit-transform 0.3s,
    opacity 0.2s;
  -moz-transition:
    -moz-transform 0.3s,
    opacity 0.2s;
  transition:
    transform 0.3s,
    opacity 0.2s;
}

.link::before {
  margin-right: 10px;
  content: '[';
  -webkit-transform: translateX(20px);
  -moz-transform: translateX(20px);
  transform: translateX(20px);
}

.link::after {
  margin-left: 10px;
  content: ']';
  -webkit-transform: translateX(-20px);
  -moz-transform: translateX(-20px);
  transform: translateX(-20px);
}

.link:hover::before,
.link:hover::after,
.link:focus::before,
.link:focus::after {
  opacity: 1;
  -webkit-transform: translateX(0px);
  -moz-transform: translateX(0px);
  transform: translateX(0px);
}
</style>
