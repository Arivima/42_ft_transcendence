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
		showCustomization: false,
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
	>	

		<v-card-item
			density="compact"
			style="background-color: lavender;"
			class="rounded-pill"
			prepend-icon="mdi-brush"
		>
			<v-card-subtitle
				class="text-overline"
			>
				Customize your game
			</v-card-subtitle>

			<template v-slot:append>
				<v-btn
					:icon="showCustomization ? 'mdi-chevron-up' : 'mdi-chevron-down'"
					size="small"
					variant="outlined"
					class="mr-1"
					:color="showCustomization ? 'grey' : 'primary'"
					@click="showCustomization = !showCustomization"
				>
				</v-btn>
			</template>
		</v-card-item>

		<v-card-item
			v-if="showCustomization == true"
		>
			<v-card-item
			>	
				<v-btn> A</v-btn>
				<v-btn> B</v-btn>
				<v-btn> C</v-btn>				
			</v-card-item>
		</v-card-item>

	</v-card>
</template>

<style scoped>
.component {
	max-width:  100%;
	max-height:  100%;
	width: fit-content;
}

</style>