<!-- GAME -->
<script setup lang="ts">
import NavSideBar from '../components/NavSideBar.vue'
</script>

<template>
    <div class="game">
		<NavSideBar/>
			<h1>This is Game</h1>
			<p>Used as home view</p>

		<v-main>
		</v-main>
	</div>
</template>

<style>
.game {
	background-color: aqua;
	outline: solid;
	/* height: 100dvh; */
	/* width: 100dvw; */
}
</style>