<template>
  <div>
    <router-link to="/login">Go to Login Page</router-link>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App',
}
</script>

<style src="./assets/tailwind.css"></style>