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
    <div class="game">
		<NavSideBar/>
			<h1>This is Game</h1>
			<p>Used as home view</p>

		<v-main>
			<intersecting-circles-spinner
				:animation-duration="1200"
				:size="70"
				color="#ff1d5e"
				/>
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