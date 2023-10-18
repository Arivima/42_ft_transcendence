<!-- APP -->

<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import TmpTab from './components/TmpTab.vue'
</script>

<template>
	<v-app>
		<TmpTab/>

		<v-main>
				<RouterView></RouterView>
		</v-main>
	</v-app>
</template>


<style scoped>

.v-app {
	background-color: red;
	outline: solid;
	height: 100dvh;
	width: 100dvw;
	margin: 0;
	padding: 0;
	align-content: center;
	justify-content: left;
}
.v-main {
	background-color: lightskyblue;
	outline: solid;
	height: 100dvh;
	width: 100dvw;
	margin: 0;
	padding: 0;
	align-content: center;
	justify-content: left;
}
</style>

