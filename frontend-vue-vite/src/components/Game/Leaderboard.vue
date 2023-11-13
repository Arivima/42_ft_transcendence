<script lang="ts">
import { usePlayerStore, type Player } from '@/stores/PlayerStore'
import { storeToRefs } from 'pinia'

const playerStore = usePlayerStore()
const { user, friends } = storeToRefs(playerStore)

const debug = false

export default {
	components:	{
},
	data: () => ({
		showCustomization: false,
		items : [
			{
				username : 'pippo',
				avatar : user.value.avatar,
				won: 3,
				ladder : 5,
			},
		]
	}),
	computed : {
		// items() : Player[] {
		// 	return friends.value
		// }
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
		class="component justify-center align-center"	
		min-width="500"
	>
		<v-card-item
			density="compact"
		>
			<v-card-subtitle
				class="text-overline"
			>
			Leaderboard
			</v-card-subtitle>

	
		</v-card-item>
		<v-divider></v-divider>

		here a table


	</v-card>
</template>

<style scoped>
.component {
	max-width:  100%;
	max-height:  100%;
	width: fit-content;
}

</style>


