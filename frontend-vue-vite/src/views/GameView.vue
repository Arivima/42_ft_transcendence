<!-- GAME -->
<script setup lang="ts">
import NavSideBar from '../components/NavSideBar.vue'
</script>

<template>
    <v-main>
        <NavSideBar/>

        <v-responsive
            class="mx-auto"
            max-width="344"
        >
        <nav>
            <h1>This is Game</h1>
        </nav>
    </v-responsive>

    </v-main>
</template>