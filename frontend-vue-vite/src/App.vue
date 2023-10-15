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

</style>
