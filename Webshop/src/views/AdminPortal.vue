<script setup lang="ts">
import { getSuperplusMembers } from '@/utils/admin'
import { onMounted, ref } from 'vue'
import SuperplusMember from '@/components/organisms/SuperplusMember.vue'
const members = ref()

onMounted(async () => {
  members.value = await getSuperplusMembers()
  console.log(members.value)
})
</script>

<template>
  <div class="body">
    <h1>ADMIN</h1>
    <ul>
      <li v-for="(member, index) in members" :key="index">
        <SuperplusMember
          :webid="member.webid"
          :demographic-read="member.read_d"
          :orderhistory-read="member.read_o"
        />
      </li>
    </ul>
  </div>
</template>

<style lang="css" scoped>
ul,
li {
  list-style: none;
}
ul {
  padding: 0;
  li {
    margin: 1rem 0;
  }
}
.body {
  margin: 0 2rem;
}
</style>
