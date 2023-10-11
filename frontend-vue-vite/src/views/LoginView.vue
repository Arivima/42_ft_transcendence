<!-- LOGIN -->
<script setup lang="ts">
</script>

<template>
    <v-main style="height: 250px">
        <v-container class="d-flex align-center justify-center" fluid>
            <v-btn
				href="http://localhost:3000/auth/42"
            >
				Login now !
			</v-btn>
        </v-container>
    </v-main>
</template>


<style scoped>
.align-center {
  display: flex;
  align-items: center;
}

.justify-center {
  justify-content: center;
}

/* Add background image */
.v-main {
  /* background-image: url("../assets/saiyanBackground.jpeg"); Adjust the path based on your project structure */
  background-size: cover; /* Ensures the image covers the entire container */
  background-position: center; /* Centers the background image */
  height: 100vh; /* Makes sure the background covers the entire viewport height */
}
</style>