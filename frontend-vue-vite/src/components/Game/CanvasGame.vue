<script lang="ts">
import { usePlayerStore, type Player } from '@/stores/PlayerStore'
import { storeToRefs } from 'pinia'

const playerStore = usePlayerStore()
const { user } = storeToRefs(playerStore)

const debug = false

export default {
	components:	{
},
	data: () => ({
	}),
	computed : {
	},
	watch : {
	},
	beforeCreate() {
	if (debug) console.log('| BlockedSent | beforeCreate()')
	},
	created() {
		if (debug) console.log('| BlockedSent | created()')
	},
	beforeMount() {
		if (debug) console.log('| BlockedSent | beforeMount()')
	},
	mounted() {
		if (debug) console.log('| BlockedSent | mounted()')
	},
	beforeUpdate() {
		if (debug) console.log('| BlockedSent | beforeUpdate()')
	},
	updated() {
		if (debug) console.log('| BlockedSent | updated()')
	},
	beforeUnmount() {
		if (debug) console.log('| BlockedSent | beforeUnmount()')
	},
	unmounted() {
		if (debug) console.log('| BlockedSent | unmounted()')
	},
	}
</script>
  


<template>
	<v-card
		class="component justify-center align-center "
		min-width="500"
		title="Game canvas"
	>	

    <canvas id="CanvasGame" width="800" height="500" style="border:1px solid purple;">
    </canvas>

	</v-card>
</template>

<style scoped>
.component {
	max-width:  100%;
	max-height:  100%;
	width: fit-content;
}

</style>