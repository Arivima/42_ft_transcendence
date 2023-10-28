<!-- GAME -->
<script lang="ts">
import NavSideBar from '../components/NavSideBar.vue'
import { IntersectingCirclesSpinner } from 'epic-spinners'
export default {
	components : {
		IntersectingCirclesSpinner, NavSideBar
	}
}

</script>

<template>
	<v-card
		class="game flex-column"
		variant="tonal"
	>
		<NavSideBar/>
		<h1>This is Game</h1>
			<intersecting-circles-spinner
				:animation-duration="1200"
				:size="70"
				color="#ff1d5e"
				/>
		</v-card>
</template>

<style scoped>
.game {
	background-color: aqua;
	height: 100%;
	width: 100%;
	outline: solid;
	display: flex;
	justify-content: center;
	justify-items: center;
	align-content: center;
	align-items: center;

}
</style>