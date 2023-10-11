<!-- HOME -->
<script setup lang="ts">
import NavSideBar from '../components/NavSideBar.vue'
</script>

<template>
    <NavSideBar/>
    <v-main>
        <v-responsive
            class="mx-auto"
            max-width="344"
        >
            <nav>
                <h1>This is Home</h1>
            </nav>
        </v-responsive>
    </v-main>
</template>
