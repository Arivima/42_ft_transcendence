<!-- PROFILE -->
<script setup lang="ts">
import NavSideBar from '../components/NavSideBar.vue'
import UserCard from '../components/Profile/UserCard.vue'
import Stats from '../components/Profile/Stats.vue'
import MatchHistory from '../components/Profile/MatchHistory.vue'
import Friends from '../components/Profile/Friends.vue'
import Achievements from '../components/Profile/Achievements.vue'

</script>

<template>
    <NavSideBar/>
    <v-main >
        <UserCard/>
        <Stats/>
        <MatchHistory/>
        <Friends/>
        <Achievements/>
    </v-main>
    </template>

<!-- <style>
.v-main {
    background-image: url("../assets/saiyanBackground.jpeg"); /* Adjust the path based on your project structure */
    background-size: cover; /* Ensures the image covers the entire container */
    background-position: center; /* Centers the background image */
    height: 100vh; /* Makes sure the background covers the entire viewport height */
    background-color: rgba(255, 255, 255, 0.3); /* White color with 0.3 opacity */
  }
</style> -->
